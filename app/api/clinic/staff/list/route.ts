import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
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

    // Get clinic_config_id from URL params
    const url = new URL(request.url);
    const clinic_config_id = url.searchParams.get("clinic_config_id");

    if (!clinic_config_id) {
      return Response.json(
        { error: "clinic_config_id query parameter required" },
        { status: 400 }
      );
    }

    // Verify requester is admin of this clinic
    const { data: requesterClinicUser, error: requesterError } = await supabase
      .from("clinic_users")
      .select("role")
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

    if (requesterClinicUser.role !== "admin" && requesterClinicUser.role !== "owner") {
      return Response.json(
        { error: "Only admins can view clinic staff" },
        { status: 403 }
      );
    }

    // Fetch all staff rows for this clinic (active + inactive + pending invites)
    const { data: staffList, error: fetchError } = await supabase
      .from("clinic_users")
      .select("id, user_email, role, is_active, created_at, last_login_at, invite_expires_at, user_id, invite_token")
      .eq("clinic_config_id", clinic_config_id)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return Response.json(
        { error: "Failed to fetch staff list" },
        { status: 500 }
      );
    }

    // Compute invite status for each staff member
    const staffWithStatus = (staffList || []).map((staff) => {
      let inviteStatus = "active";
      if (staff.invite_token && !staff.user_id) {
        inviteStatus = "pending";
      }
      if (staff.invite_expires_at && staff.invite_token && !staff.user_id) {
        const expiresAt = new Date(staff.invite_expires_at);
        if (expiresAt > new Date()) {
          inviteStatus = "pending";
        } else {
          inviteStatus = "expired";
        }
      }
      if (staff.last_login_at) {
        inviteStatus = "active";
      }

      return {
        ...staff,
        inviteStatus,
      };
    });

    return Response.json(
      {
        success: true,
        staff: staffWithStatus,
        count: staffWithStatus.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
