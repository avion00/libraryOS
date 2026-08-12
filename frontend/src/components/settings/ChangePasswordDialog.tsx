import { useId, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import { authApi } from "../../api/endpoints";
import { extractErrorMessage } from "../../api/client";
import { useToast } from "../../context/ToastContext";
import { DialogShell, Button } from "../ui";
import { settingInputClass } from "./SettingField";

export function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const { notify } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => authApi.changePassword(current, next),
    onSuccess: () => {
      notify("Password changed successfully.", "success");
      handleClose();
    },
    onError: (err) => setError(extractErrorMessage(err)),
  });

  function handleClose() {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError(null);
    onClose();
  }

  function handleSubmit() {
    setError(null);
    if (!current || !next) {
      setError("Fill in both password fields.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    mutation.mutate();
  }

  return (
    <DialogShell open={open} onClose={handleClose} widthClass="max-w-sm" labelledBy={titleId}>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="flex items-center gap-2 text-[16px] font-bold text-slate-900">
            <KeyRound className="h-4 w-4 text-slate-400" strokeWidth={2} />
            Change password
          </h2>
          <button onClick={handleClose} className="rounded-full p-1.5 text-slate-400 hover:bg-paper-500 hover:text-slate-600" aria-label="Close">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {error && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">{error}</div>}

        <div className="space-y-3">
          <div>
            <label htmlFor="current_password" className="mb-1.5 block text-[12.5px] font-medium text-slate-600">
              Current password
            </label>
            <input id="current_password" type={show ? "text" : "password"} className={settingInputClass} value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div>
            <label htmlFor="new_password" className="mb-1.5 block text-[12.5px] font-medium text-slate-600">
              New password
            </label>
            <input id="new_password" type={show ? "text" : "password"} className={settingInputClass} value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div>
            <label htmlFor="confirm_password" className="mb-1.5 block text-[12.5px] font-medium text-slate-600">
              Confirm new password
            </label>
            <input id="confirm_password" type={show ? "text" : "password"} className={settingInputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <button type="button" onClick={() => setShow((v) => !v)} className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-700">
            {show ? <EyeOff className="h-3.5 w-3.5" strokeWidth={2} /> : <Eye className="h-3.5 w-3.5" strokeWidth={2} />}
            {show ? "Hide" : "Show"} passwords
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : "Change password"}
          </Button>
        </div>
      </div>
    </DialogShell>
  );
}
