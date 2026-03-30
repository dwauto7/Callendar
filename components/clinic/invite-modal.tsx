'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2, UserPlus } from 'lucide-react';

interface InviteModalProps {
  clinicConfigId: string;
  onInviteSuccess: () => void;
}

export function InviteModal({ clinicConfigId, onInviteSuccess }: InviteModalProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('receptionist');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);

    try {
      // Get user's auth token
      const { data } = await (
        await import('@supabase/supabase-js').then(m => m.createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        ))
      ).auth.getSession();

      const token = data.session?.access_token;

      if (!token) {
        setError('You must be logged in to invite staff');
        return;
      }

      const response = await fetch('/api/clinic/staff/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          invitee_email: email,
          role,
          clinic_config_id: clinicConfigId,
        }),
      });

      const data_response = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('This email is already part of your clinic');
        } else if (response.status === 403) {
          setError('You do not have permission to invite staff');
        } else {
          setError(data_response.error || 'Failed to send invite');
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setEmail('');
        setRole('receptionist');
        setSuccess(false);
        onInviteSuccess();
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error inviting staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!loading) {
      setOpen(newOpen);
      if (!newOpen) {
        setEmail('');
        setRole('receptionist');
        setError(null);
        setSuccess(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Staff Member</DialogTitle>
          <DialogDescription>
            Send an invite link to add a new team member to your clinic.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-success/50 bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Invite sent! Check your clinic's email for confirmation.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="staff@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
              required
            />
            <p className="text-xs text-muted-foreground">
              An invite link will be sent to this email
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select value={role} onValueChange={setRole} disabled={loading || success}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Admins can manage staff and settings
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Invite...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Invite Sent
              </>
            ) : (
              'Send Invite'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}