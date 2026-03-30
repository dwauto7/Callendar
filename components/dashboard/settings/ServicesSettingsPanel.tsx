'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { useClinicContext } from '@/components/providers/ClinicProvider'

const inputCls =
  'w-full h-9 rounded-md border border-[#1E2128] bg-[#0D0F12] px-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B]/50 focus:border-[#10B981] focus:outline-none transition-colors'

type ServiceRow = {
  id: string
  service_name: string
  price: string
}

export function ServicesSettingsPanel() {
  const { clinicConfigId, role } = useClinicContext()
  const [services, setServices] = useState<ServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null)

  const supabase = useMemo(() => createClient(), [])

  const loadServices = useCallback(async () => {
    if (!clinicConfigId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('service_pricing')
      .select('id, service_name, price, created_at')
      .eq('clinic_config_id', clinicConfigId)
      .order('created_at', { ascending: true })

    if (error) {
      toast.error('Failed to load services')
      setLoading(false)
      return
    }

    const mapped = (data ?? []).map((row) => ({
      id: row.id as string,
      service_name: String(row.service_name ?? ''),
      price: row.price != null ? String(row.price) : '0',
    }))

    setServices(mapped)
    setLoading(false)
  }, [clinicConfigId, supabase])

  useEffect(() => {
    if (!clinicConfigId) return
    loadServices()
  }, [clinicConfigId, loadServices])

  async function handleAdd() {
    if (role !== 'admin' && role !== 'owner') {
      toast.error('Admin access required to update services.')
      return
    }
    if (!newName.trim()) {
      toast.error('Service name is required')
      return
    }
    const priceNum = Number(newPrice)
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error('Price must be a valid number')
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('service_pricing')
      .insert({
        clinic_config_id: clinicConfigId,
        service_name: newName.trim(),
        price: priceNum,
      })

    setSaving(false)
    if (error) {
      toast.error('Failed to add service')
      return
    }

    setDialogOpen(false)
    setNewName('')
    setNewPrice('')
    toast.success('Service added')
    await loadServices()
  }

  async function handleDelete(id: string) {
    if (role !== 'admin' && role !== 'owner') {
      toast.error('Admin access required to update services.')
      return
    }
    setDeleting(id)
    const { error } = await supabase
      .from('service_pricing')
      .delete()
      .eq('id', id)
      .eq('clinic_config_id', clinicConfigId)

    setDeleting(null)
    if (error) {
      toast.error('Failed to delete')
      return
    }
    toast.success('Service removed')
    await loadServices()
  }

  return (
    <>
      <div className="rounded-xl border border-[#1E2128] bg-[#111318] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2128]">
          <div>
            <p className="text-sm font-semibold text-[#F1F5F9]" style={{ fontFamily: 'var(--font-syne)' }}>
              Services & Pricing
            </p>
            <p className="text-xs text-white/40 mt-1">
              Manage service list and prices for your clinic.
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="h-8 bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold text-xs"
            disabled={role !== 'admin' && role !== 'owner'}
          >
            <Plus className="size-3.5 mr-1.5" />
            Add Service
          </Button>
        </div>

        {loading ? (
          <div className="h-24 rounded-lg bg-white/5 animate-pulse" />
        ) : services.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748B]">
            No services added yet
          </div>
        ) : (
          <div className="divide-y divide-[#1E2128]">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-[#161B22] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#F1F5F9] truncate">
                    {service.service_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#0B0D10] bg-[#40E0FF] px-2.5 py-1 rounded-full">
                    RM {service.price}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteTarget(service)}
                    disabled={deleting === service.id || (role !== 'admin' && role !== 'owner')}
                    className="text-[#64748B] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                  >
                    {deleting === service.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#111318] border-[#1E2128] text-[#F1F5F9] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
              Add Service
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
                Service Name
              </Label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Consultation"
                className={inputCls}
              />
            </div>
            <div>
              <Label className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1.5 block">
                Price (RM)
              </Label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="120.00"
                className={inputCls}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-[#64748B] hover:text-[#F1F5F9]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={saving}
              className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#0A0A0A] font-semibold"
            >
              {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              {saving ? 'Adding?' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="bg-[#111318] border-[#1E2128] text-[#F1F5F9] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
              Delete Service?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/70">
            This will remove <span className="font-semibold text-white">{deleteTarget?.service_name}</span> from your
            service list.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="text-[#64748B] hover:text-[#F1F5F9]"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!deleteTarget) return
                await handleDelete(deleteTarget.id)
                setDeleteTarget(null)
              }}
              className="bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-semibold"
              disabled={deleting === deleteTarget?.id}
            >
              {deleting === deleteTarget?.id ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
