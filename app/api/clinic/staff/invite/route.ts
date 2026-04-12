import { createClient } from "@supabase/supabase-js";
import nodemailer from 'nodemailer'
import { nanoid } from "nanoid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: Request) {
  try {
    // Get user from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    // Parse request body
    const { invitee_email, role, clinic_config_id, profile_id } = await request.json();

    if (!invitee_email || !role || !clinic_config_id) {
      return Response.json(
        { error: "Missing required fields: invitee_email, role, clinic_config_id" },
        { status: 400 }
      );
    }

    // Verify requester is admin of this clinic
    const { data: requesterClinicUser, error: requesterError } = await supabase
      .from("clinic_users")
      .select("id, role")
      .eq("user_id", user.id)
      .eq("clinic_config_id", clinic_config_id)
      .eq("is_active", true)
      .single();

    if (requesterError || !requesterClinicUser) {
      return Response.json(
        { error: "You are not part of this clinic" },
        { status: 403 }
      );
    }

    // Check if requester is admin (using is_admin() RLS context)
    // For this, we rely on the RLS policy to enforce it
    // But we can do a simpler check: verify role = 'admin'
    if (!['admin', 'owner'].includes(requesterClinicUser.role)) {
      return Response.json(
        { error: "Only admins can invite staff" },
        { status: 403 }
      );
    }

    // Check if staff already exists in clinic
    const { data: existingStaff } = await supabase
      .from("clinic_users")
      .select("id")
      .eq("clinic_config_id", clinic_config_id)
      .eq("user_email", invitee_email)
      .maybeSingle();

    if (existingStaff) {
      return Response.json(
        { error: "This email is already part of this clinic" },
        { status: 409 }
      );
    }

    // Generate invite token (32-char alphanumeric)
    const invite_token = nanoid(32);
    const invite_expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create staff record with invite token
    const { data: newStaff, error: insertError } = await supabase
      .from("clinic_users")
      .insert({
        clinic_config_id,
        user_email: invitee_email,
        role,
        invite_token,
        invite_expires_at: invite_expires_at.toISOString(),
        is_active: true,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return Response.json(
        { error: "Failed to create invite" },
        { status: 500 }
      );
    }

    // Auto-create or link doctor profile when inviting a doctor
    if (role === "doctor") {
      if (profile_id) {
        await supabase
          .from("clinic_profiles")
          .update({ user_email: invitee_email })
          .eq("id", profile_id)
          .eq("clinic_config_id", clinic_config_id);
      } else {
        const displayName = invitee_email.split("@")[0]?.replace(/[._-]+/g, " ") || "Doctor";
        await supabase.from("clinic_profiles").insert({
          clinic_config_id,
          display_name: displayName,
          role: "doctor",
          user_email: invitee_email,
        });
      }
    }

    // Also log to clinic_user_invites table for audit trail
    await supabase.from("clinic_user_invites").insert({
      clinic_config_id,
      inviter_user_id: user.id,
      invitee_email,
      invite_token,
      invite_expires_at: invite_expires_at.toISOString(),
      role,
    });

    // Send invite email via Resend
    const acceptInviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invite?token=${invite_token}`;

    try {
      await transporter.sendMail({
        from: "Callendar <noreply@beaconhorizons.io>",
        to: invitee_email,
        subject: "You're invited to join Callendar",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Callendar</h2>
            <p>You've been invited to join your clinic's AI receptionist system.</p>
            <p>
              <a 
                href="${acceptInviteUrl}" 
                style="display: inline-block; padding: 12px 24px; background-color: #0D9488; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;"
              >
                Accept Invite
              </a>
            </p>
            <p style="color: #666; font-size: 12px;">
              This link expires in 7 days. If you didn't expect this invitation, you can ignore this email.
            </p>
            <p style="color: #999; font-size: 12px;">
              Callendar • AI Voice Receptionist for Clinics
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      return Response.json(
        { error: "Failed to send invite email", details: String(emailError) },
      )
      // Don't fail the whole request if email fails—staff record is created
    }

    return Response.json(
      {
        success: true,
        message: "Invite sent successfully",
        staff_id: newStaff.id,
        invite_expires_at,
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
