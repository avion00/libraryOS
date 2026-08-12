import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "../api/endpoints";
import { extractErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";
import { Button, Field, Input, Modal } from "../components/ui";
import type { Student } from "../api/types";

export default function StudentFormModal({
  open,
  onClose,
  student,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
  onSaved?: (student: Student) => void;
}) {
  const isEdit = !!student;
  const [fullName, setFullName] = useState(student?.full_name ?? "");
  const [phone, setPhone] = useState(student?.phone ?? "");
  const [email, setEmail] = useState(student?.email ?? "");
  const [address, setAddress] = useState(student?.address ?? "");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const payload = { full_name: fullName, phone, email, address };
      return isEdit ? studentsApi.update(student!.id, payload) : studentsApi.create(payload);
    },
    onSuccess: (resp) => {
      notify(isEdit ? "Student updated." : "Student added.", "success");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", student?.id] });
      onSaved?.(resp.data);
      onClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit student" : "Add student"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <Field label="Full name">
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required autoFocus />
        </Field>
        <Field label="Phone">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </Field>
        <Field label="Email (optional)">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Address (optional)">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : isEdit ? "Save changes" : "Add student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
