import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { LogoMark } from "../dashboard/art/Logo";

const MAX_SIZE_MB = 2;

export function LogoUploader({
  currentUrl,
  previewUrl,
  onFileSelected,
}: {
  currentUrl: string | null;
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
}) {
  const { notify } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      notify("Logo must be a PNG or JPG image.", "error");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      notify(`Logo must be under ${MAX_SIZE_MB}MB.`, "error");
      return;
    }
    onFileSelected(file);
  }

  const shown = previewUrl ?? currentUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload library logo"
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        className={`relative flex h-[76px] w-[76px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors ${
          dragging ? "border-brand-400 bg-brand-50" : "border-paper-700 bg-paper-300 hover:border-brand-300"
        }`}
      >
        {shown ? (
          <img src={shown} alt="Library logo" className="h-full w-full object-cover" />
        ) : (
          <LogoMark className="h-11 w-11 rounded-xl" />
        )}
        <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-400 text-ink-900 shadow-sm">
          <Pencil className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <p className="text-center text-[10.5px] leading-tight text-slate-400">
        PNG, JPG
        <br />
        up to {MAX_SIZE_MB}MB
      </p>
    </div>
  );
}
