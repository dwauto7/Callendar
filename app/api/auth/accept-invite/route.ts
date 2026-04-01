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
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // 🔍 Find invite
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

    // ⏳ Expiry check
    const expiresAt = new Date(staffWithInvite.invite_expires_at);
    if (expiresAt < new Date()) {
      return Response.json(
        { error: "Invite token has expired" },
        { status: 410 }
      );
    }

    const email = staffWithInvite.user_email.toLowerCase();

    // 🚫 Prevent duplicate users
    const { data: usersList } = await supabase.auth.admin.listUsers();
    const existingUser = usersList.users.find((u) => u.email === email);

    if (existingUser) {
      return Response.json(
        { error: "User already exists. Please login instead." },
        { status: 400 }
      );
    }

    // 👤 Create user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
        },
      });

    if (authError || !authData.user) {
      console.error("Auth error:", authError);
      return Response.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // 🔗 Link to clinic_users
    const { error: updateError } = await supabase
      .from("clinic_users")
      .update({
        user_id: userId,
        invite_token: null,
        invite_expires_at: null,
        last_login_at: new Date().toISOString(),
      })
      .eq("id", staffWithInvite.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return Response.json(
        { error: "Account created but failed to link clinic" },
        { status: 500 }
      );
    }

    // 🔗 Link profile (optional but good)
    await supabase
      .from("clinic_profiles")
      .update({ user_id: userId })
      .eq("clinic_config_id", staffWithInvite.clinic_config_id)
      .eq("user_email", email);

    // ✅ Mark invite accepted
    await supabase
      .from("clinic_user_invites")
      .update({
        accepted_at: new Date().toISOString(),
        accepted_by_user_id: userId,
      })
      .eq("invite_token", invite_token);

    return Response.json(
      {
        success: true,
        email, // 🔥 used for auto-login
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