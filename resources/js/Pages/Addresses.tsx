import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';
import Modal from '@/Components/Modal';
import AccountLayout from '@/Layouts/AccountLayout';
import { AddressData } from '@/types';
import SettingsHeader from '@/Components/SettingsHeader';

const labels = ['Home', 'Work', 'Other'];
const input = 'w-full rounded-full bg-paper px-4 py-2.5 text-sm';
type Key = 'name' | 'phone' | 'address' | 'city' | 'postal';
const fields: [Key, string][] = [['name', 'Full name'], ['phone', 'Mobile number'], ['address', 'Unit, street, barangay'], ['city', 'City'], ['postal', 'Postal code']];

function AddressModal({ open, editing, first, onClose }: { open: boolean; editing: AddressData | null; first: boolean; onClose: () => void }) {
  const form = useForm({ label: 'Home', name: '', phone: '', address: '', city: '', postal: '', is_default: false });

  useEffect(() => {
    if (!open) return;
    form.clearErrors();
    form.setData(editing
      ? { label: editing.label, name: editing.name, phone: editing.phone, address: editing.address, city: editing.city, postal: editing.postal, is_default: editing.isDefault }
      : { label: 'Home', name: '', phone: '', address: '', city: '', postal: '', is_default: first });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const done = { preserveScroll: true, onSuccess: onClose };
  const save = () => (editing ? form.put(`/addresses/${editing.id}`, done) : form.post('/addresses', done));

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit address' : 'Add address'} size="md">
      <div className="space-y-3">
        <div className="flex gap-2">
          {labels.map((l) => (
            <button key={l} type="button" onClick={() => form.setData('label', l)} aria-pressed={form.data.label === l}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${form.data.label === l ? 'border-ink bg-ink text-white' : 'border-stone'}`}>{l}</button>
          ))}
        </div>
        {fields.map(([k, ph]) => (
          <div key={k}>
            <input className={input} placeholder={ph} aria-label={ph} value={form.data[k]} onChange={(e) => form.setData(k, e.target.value)} />
            {form.errors[k] && <p className="mt-1 px-2 text-xs text-ember">{form.errors[k]}</p>}
          </div>
        ))}
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" className="accent-ember" checked={form.data.is_default} onChange={(e) => form.setData('is_default', e.target.checked)} />
          Use as my default address
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full border border-ink/40 px-5 py-2.5 text-sm">Cancel</button>
        <button disabled={form.processing} onClick={save} className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{form.processing ? 'Saving' : 'Save address'}</button>
      </div>
    </Modal>
  );
}

export default function Addresses({ addresses }: { addresses: AddressData[] }) {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AddressData | null>(null);
  const [del, setDel] = useState<AddressData | null>(null);

  const add = () => { setEditing(null); setModal(true); };
  const edit = (a: AddressData) => { setEditing(a); setModal(true); };

  return (
    <AccountLayout active="settings">
      <Head title="Addresses" />
      <SettingsHeader tab="addresses" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-black/60">Saved shipping addresses for faster checkout.</p>
        <button onClick={add} className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white">Add address</button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <article key={a.id} className="flex flex-col rounded-2xl bg-white p-5 text-sm">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-paper px-3 py-1 text-[11px] font-semibold">{a.label}</span>
              {a.isDefault && <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold text-white">Default</span>}
            </div>
            <b>{a.name}</b>
            <p className="text-black/70">{a.address}<br />{a.city} {a.postal}<br />{a.phone}</p>
            <div className="mt-4 flex flex-wrap gap-3 border-t border-stone pt-3 text-xs">
              <button onClick={() => edit(a)} className="underline">Edit</button>
              {!a.isDefault && <button onClick={() => router.post(`/addresses/${a.id}/default`, {}, { preserveScroll: true })} className="underline">Set as default</button>}
              <button onClick={() => setDel(a)} className="ml-auto text-black/60 hover:text-red-600">Delete</button>
            </div>
          </article>
        ))}
      </div>
      {!addresses.length && <p className="mt-5 rounded-2xl bg-white p-8 text-center text-sm">No saved addresses yet. Add one and it will be ready at checkout.</p>}

      <AddressModal open={modal} editing={editing} first={addresses.length === 0} onClose={() => setModal(false)} />

      <ConfirmModal open={!!del} danger title="Delete this address?" confirmLabel="Delete"
        message={del ? `${del.label} · ${del.address}, ${del.city} will be removed from your saved addresses.` : ''}
        onClose={() => setDel(null)}
        onConfirm={() => del && router.delete(`/addresses/${del.id}`, { preserveScroll: true, onSuccess: () => setDel(null) })} />
    </AccountLayout>
  );
}