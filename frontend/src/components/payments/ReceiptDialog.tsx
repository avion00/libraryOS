import { useEffect, useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Printer, X } from "lucide-react";
import { paymentsApi, settingsApi, studentsApi } from "../../api/endpoints";
import { DialogShell, Button, PageLoading } from "../ui";
import { useToast } from "../../context/ToastContext";
import { formatDate } from "../../lib/format";
import type { Payment } from "../../api/types";
import { ReceiptDocument } from "./ReceiptDocument";
import { derivePaymentRef } from "./types";
import { downloadReceiptPdf } from "./receiptPdf";

export function ReceiptDialog({ open, onClose, payment }: { open: boolean; onClose: () => void; payment: Payment | null }) {
  const titleId = useId();
  const { notify } = useToast();
  const documentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const receiptQuery = useQuery({
    queryKey: ["receipt", payment?.id],
    queryFn: () => paymentsApi.receipt(payment!.id).then((r) => r.data),
    enabled: open && !!payment,
  });

  const studentQuery = useQuery({
    queryKey: ["student", receiptQuery.data?.student.id],
    queryFn: () => studentsApi.get(receiptQuery.data!.student.id).then((r) => r.data),
    enabled: open && !!receiptQuery.data,
  });

  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data),
    enabled: open,
  });

  useEffect(() => {
    if (!open) setDownloading(false);
  }, [open]);

  async function handleDownloadPdf() {
    if (!documentRef.current || !receiptQuery.data) return;
    setDownloading(true);
    try {
      await downloadReceiptPdf(documentRef.current, `receipt-${receiptQuery.data.receipt_number}.pdf`);
    } catch {
      notify("Could not generate the PDF. Try Print instead.", "error");
    } finally {
      setDownloading(false);
    }
  }

  const receipt = receiptQuery.data;
  const loading = receiptQuery.isLoading || !receipt;

  return (
    <DialogShell open={open} onClose={onClose} widthClass="max-w-[760px]" labelledBy={titleId}>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between no-print">
          <h2 id={titleId} className="text-[20px] font-bold text-slate-900">
            Receipt
          </h2>
          <button onClick={onClose} className="rounded-lg border border-paper-700 p-1.5 text-slate-400 hover:bg-paper-500 hover:text-slate-600" aria-label="Close">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {loading ? (
          <PageLoading />
        ) : (
          <>
            <div ref={documentRef}>
              <ReceiptDocument
                receipt={receipt}
                studentEmail={studentQuery.data?.email || undefined}
                logoUrl={settingsQuery.data?.logo}
                issueDate={formatDate(receipt.generated_at)}
                paymentRef={receipt.reference_number || derivePaymentRef(payment!.id, receipt.generated_at)}
                collectedBy={payment?.created_by_username ?? null}
                verificationPayload={`LIBRARYOS-RECEIPT:${receipt.receipt_number}`}
                applyTax={settingsQuery.data?.apply_tax}
                taxLabel={settingsQuery.data?.tax_label}
                taxRate={settingsQuery.data?.tax_rate}
                footerText={settingsQuery.data?.receipt_footer_text || undefined}
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2.5 no-print">
              <Button variant="secondary" onClick={handleDownloadPdf} disabled={downloading}>
                <Download className="h-4 w-4" strokeWidth={2} />
                {downloading ? "Preparing…" : "Download PDF"}
              </Button>
              <Button variant="secondary" onClick={() => window.print()}>
                <Printer className="h-4 w-4" strokeWidth={2} />
                Print
              </Button>
              <Button onClick={onClose}>Done</Button>
            </div>
          </>
        )}
      </div>
    </DialogShell>
  );
}
