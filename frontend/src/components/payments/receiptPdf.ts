import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadReceiptPdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  pdf.save(filename);
}
