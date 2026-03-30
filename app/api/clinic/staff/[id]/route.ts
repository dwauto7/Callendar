import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const staff_id = params.id;

    if (!staff_id) {
      return Response.json(
        { error: "staff_id is required" },
        { status: 400 }
      );
    }

    // Get the staff member to find their clinic_config_id
    const { data: staffToDelete, error: fetchError } = await supabase
      .from("clinic_users")
      .select("clinic_config_id")
      .eq("id", staff_id)
      .single();

    if (fetchError || !staffToDelete) {
      return Response.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    // Verify requester is admin of this clinic
    const { data: requesterClinicUser, error: requesterError } = await supabase
      .from("clinic_users")
      .select("role")
      .eq("user_id", user.id)
      .eq("clinic_config_id", staffToDelete.clinic_config_id)
      .eq("is_active", true)
      .single();

    if (requesterError || !requesterClinicUser) {
      return Response.json(
        { error: "You are not part of this clinic" },
        { status: 403 }
      );
    }

    if (requesterClinicUser.role !== "admin") {
      return Response.json(
        { error: "Only admins can remove staff" },
        { status: 403 }
      );
    }

    // Prevent admin from deleting themselves
    const { data: staffUserLink } = await supabase
      .from("clinic_users")
      .select("user_id")
      .eq("id", staff_id)
      .single();

    if (staffUserLink?.user_id === user.id) {
      return Response.json(
        { error: "You cannot remove yourself from the clinic" },
        { status: 400 }
      );
    }

    // Soft delete: set is_active = false
    const { error: updateError } = await supabase
      .from("clinic_users")
      .update({ is_active: false })
      .eq("id", staff_id);

    if (updateError) {
      console.error("Update error:", updateError);
      return Response.json(
        { error: "Failed to remove staff member" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Staff member removed successfully",
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