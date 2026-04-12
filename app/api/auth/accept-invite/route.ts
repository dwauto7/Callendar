import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();
    const { invite_token } = body;

    if (!invite_token) {
      return Response.json({ error: "Missing invite_token" }, { status: 400 });
    }

    // ── Find the invite ───────────────────────────────────────────
    const { data: staffRecord, error: lookupError } = await supabase
      .from("clinic_users")
      .select("id, clinic_config_id, user_email, role, invite_expires_at, user_id")
      .eq("invite_token", invite_token)
      .single();

    if (lookupError || !staffRecord) {
      return Response.json({ error: "Invalid invite token" }, { status: 404 });
    }

    // ── Expiry check ──────────────────────────────────────────────
    if (new Date(staffRecord.invite_expires_at) < new Date()) {
      return Response.json({ error: "Invite token has expired" }, { status: 410 });
    }

    // ── Already accepted ──────────────────────────────────────────
    if (staffRecord.user_id) {
      return Response.json({ error: "Invite already accepted. Please login." }, { status: 409 });
    }

    const email = staffRecord.user_email.toLowerCase();

// ════════════════════════════════════════════════════════════════
    // PATH A: OAuth flow — callback passes verified user_id + user_email
    // Service role does the linking (no Bearer token needed)
    // ════════════════════════════════════════════════════════════════
    if (body.user_id && body.user_email) {
      const { user_id, user_email } = body

      // Email must match the invite
      if (user_email.toLowerCase() !== email) {
        return Response.json(
          { error: `This invite was sent to ${email}. Please sign in with that Google account.` },
          { status: 403 }
        )
      }

      const { error: updateError } = await supabase
        .from('clinic_users')
        .update({
          user_id,
          is_active: true,
          invite_token: null,
          invite_expires_at: null,
          last_login_at: new Date().toISOString(),
        })
        .eq('id', staffRecord.id)

      if (updateError) {
        console.error('clinic_users update error:', updateError)
        return Response.json({ error: 'Failed to link clinic account' }, { status: 500 })
      }

      await supabase
        .from('clinic_profiles')
        .update({ user_id })
        .eq('clinic_config_id', staffRecord.clinic_config_id)
        .eq('user_email', email)

      await supabase
        .from('clinic_user_invites')
        .update({
          accepted_at: new Date().toISOString(),
          accepted_by_user_id: user_id,
        })
        .eq('invite_token', invite_token)

      return Response.json({ success: true, email }, { status: 200 })
    }

    // ════════════════════════════════════════════════════════════════
    // PATH B: Password flow (legacy — remove post-launch)
    // ════════════════════════════════════════════════════════════════
    const { password, full_name } = body;

    if (!password || !full_name) {
      return Response.json(
        { error: "Missing required fields: password, full_name" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists in Supabase auth
    const { data: usersList } = await supabase.auth.admin.listUsers();
    const existingUser = usersList?.users?.find((u) => u.email === email);

    if (existingUser) {
      return Response.json(
        { error: "User already exists. Please login instead." },
        { status: 400 }
      );
    }

    // Create the user with password
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (authError || !authData.user) {
      console.error("Auth create error:", authError);
      return Response.json({ error: "Failed to create account" }, { status: 500 });
    }

    const userId = authData.user.id;

    // Link to clinic_users
    const { error: updateError } = await supabase
      .from("clinic_users")
      .update({
        user_id: userId,
        is_active: true,
        invite_token: null,
        invite_expires_at: null,
        last_login_at: new Date().toISOString(),
      })
      .eq("id", staffRecord.id);

    if (updateError) {
      console.error("clinic_users update error:", updateError);
      return Response.json(
        { error: "Account created but failed to link clinic" },
        { status: 500 }
      );
    }

    // Link clinic_profiles
    await supabase
      .from("clinic_profiles")
      .update({ user_id: userId })
      .eq("clinic_config_id", staffRecord.clinic_config_id)
      .eq("user_email", email);

    // Mark invite accepted
    await supabase
      .from("clinic_user_invites")
      .update({
        accepted_at: new Date().toISOString(),
        accepted_by_user_id: userId,
      })
      .eq("invite_token", invite_token);

    return Response.json({ success: true, email }, { status: 201 });

  } catch (error) {
    console.error("accept-invite error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}