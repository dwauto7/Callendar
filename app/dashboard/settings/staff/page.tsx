'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { InviteModal } from '@/components/clinic/invite-modal';
import { AlertCircle, Loader2, Trash2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getClinicContext } from '@/lib/clinic/getClinicContext';

interface StaffMember {
  id: string;
  user_email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  inviteStatus: 'active' | 'pending' | 'expired';
}

export default function StaffManagementPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [clinicConfigId, setClinicConfigId] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch clinic config on mount
  useEffect(() => {
    const fetchClinicConfig = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        const clinicContext = await getClinicContext(supabase, user.id);

        if (!clinicContext?.clinicConfigId) {
          setError('Could not find your clinic. Please contact support.');
          return;
        }

        setClinicConfigId(clinicContext.clinicConfigId);
      } catch (err) {
        console.error('Error fetching clinic config:', err);
        setError('Failed to load clinic information');
      }
    };

    fetchClinicConfig();
  }, [supabase, router]);

  // Fetch staff list
  useEffect(() => {
    if (!clinicConfigId) return;

    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: session } = await supabase.auth.getSession();
        const token = session?.session?.access_token;

        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch(
          `/api/clinic/staff/list?clinic_config_id=${clinicConfigId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Failed to load staff list');
          return;
        }

        const data = await response.json();
        setStaff(data.staff || []);
      } catch (err) {
        console.error('Error fetching staff:', err);
        setError('Failed to load staff list');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [clinicConfigId, supabase]);

  const handleRemoveStaff = async (staffId: string) => {
    try {
      setDeleting(staffId);

      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;

      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch(`/api/clinic/staff/${staffId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to remove staff member');
        return;
      }

      // Remove from local state
      setStaff((prev) => prev.filter((s) => s.id !== staffId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error removing staff:', err);
      setError('Failed to remove staff member');
    } finally {
      setDeleting(null);
    }
  };

  const handleInviteSuccess = () => {
    // Refresh staff list
    if (clinicConfigId) {
      const refreshStaff = async () => {
        try {
          const { data: session } = await supabase.auth.getSession();
          const token = session?.session?.access_token;

          if (!token) return;

          const response = await fetch(
            `/api/clinic/staff/list?clinic_config_id=${clinicConfigId}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setStaff(data.staff || []);
          }
        } catch (err) {
          console.error('Error refreshing staff list:', err);
        }
      };

      refreshStaff();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/20';
      case 'doctor':
        return 'bg-primary/10 text-primary hover:bg-primary/20';
      case 'receptionist':
      default:
        return 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70';
    }
  };

  const getInviteStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1 border-amber-200 text-amber-700 bg-amber-50">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="outline" className="gap-1 border-red-200 text-red-700 bg-red-50">
            <AlertTriangle className="w-3 h-3" />
            Expired
          </Badge>
        );
      case 'active':
      default:
        return (
          <Badge variant="outline" className="gap-1 border-green-200 text-green-700 bg-green-50">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>
        );
    }
  };

  if (!clinicConfigId) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Staff Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your clinic team members and their access permissions
          </p>
        </div>
        <InviteModal
          clinicConfigId={clinicConfigId}
          onInviteSuccess={handleInviteSuccess}
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Staff Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {staff.length === 0
              ? 'No staff members yet'
              : `${staff.length} staff member${staff.length !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No staff members in your clinic yet. Invite your first team member!
              </p>
              <InviteModal
                clinicConfigId={clinicConfigId}
                onInviteSuccess={handleInviteSuccess}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.user_email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getInviteStatusBadge(member.inviteStatus)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {member.last_login_at
                          ? formatDistanceToNow(new Date(member.last_login_at), {
                              addSuffix: true,
                            })
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        <AlertDialog open={deleteConfirm === member.id}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(member.id)}
                            disabled={deleting !== null}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Staff Member?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove{' '}
                                <strong>{member.user_email}</strong> from your clinic? This
                                action cannot be undone immediately, but they can be re-invited.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel disabled={deleting !== null}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveStaff(member.id)}
                                disabled={deleting !== null}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleting === member.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Removing...
                                  </>
                                ) : (
                                  'Remove'
                                )}
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            • <strong>Invite</strong>: Click "Invite Staff" and enter their email address
          </p>
          <p>
            • <strong>Email Link</strong>: They receive an invite email with a secure link
          </p>
          <p>
            • <strong>Accept</strong>: They click the link and create their account with a password
          </p>
          <p>
            • <strong>Access</strong>: Once accepted, they can log in and start using Callendar
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Invite links expire after 7 days. You can send a new invite anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
