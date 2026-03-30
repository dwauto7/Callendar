import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { invite_token, password, full_name } = await request.json();

    if (!invite_token || !password || !full_name) {
      return Response.json(
        {
          error: "Missing required fields: invite_token, password, full_name",
        },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Look up the invite token
    const { data: staffWithInvite, error: lookupError } = await supabase
      .from("clinic_users")
      .select("id, clinic_config_id, user_email, role, invite_expires_at")
      .eq("invite_token", invite_token)
      .single();

    if (lookupError || !staffWithInvite) {
      return Response.json(
        { error: "Invalid invite token" },
        { status: 404 }
      );
    }

    // Check if invite is expired
    const expiresAt = new Date(staffWithInvite.invite_expires_at);
    if (expiresAt < new Date()) {
      return Response.json(
        { error: "Invite token has expired" },
        { status: 410 }
      );
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser(
      {
        email: staffWithInvite.user_email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name,
          clinic_config_id: staffWithInvite.clinic_config_id,
        },
      }
    );

    if (authError || !authData.user) {
      console.error("Auth creation error:", authError);
      return Response.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // Update clinic_users record with user_id and clear invite token
    const { error: updateError } = await supabase
      .from("clinic_users")
      .update({
        user_id: authData.user.id,
        invite_token: null,
        invite_expires_at: null,
        last_login_at: new Date().toISOString(),
      })
      .eq("id", staffWithInvite.id);

    if (updateError) {
      console.error("Update error:", updateError);
      // Auth user was created but clinic_users wasn't updated—this is a problem
      // In production, you'd want to clean up the auth user here
      return Response.json(
        { error: "Account created but failed to complete setup" },
        { status: 500 }
      );
    }

    // Link doctor profile by email (if exists)
    await supabase
      .from("clinic_profiles")
      .update({
        user_id: authData.user.id,
      })
      .eq("clinic_config_id", staffWithInvite.clinic_config_id)
      .eq("user_email", staffWithInvite.user_email);

    // Mark invite as accepted in clinic_user_invites table
    await supabase
      .from("clinic_user_invites")
      .update({
        accepted_at: new Date().toISOString(),
        accepted_by_user_id: authData.user.id,
      })
      .eq("invite_token", invite_token);

    return Response.json(
      {
        success: true,
        message: "Account created successfully",
        user_id: authData.user.id,
        clinic_config_id: staffWithInvite.clinic_config_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
