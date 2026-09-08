import { NextResponse } from "next/server";

interface PdfItem { name: string; quantity: number; capacity?: string; }
interface PdfPayload { locale?: "en" | "fr"; reference: string; customerName?: string; businessName?: string; country?: string; city?: string; deliveryPreference?: string; note?: string; items: PdfItem[]; }

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 42;
const GREEN = "0.09 0.38 0.21";
const LIGHT_GREEN = "0.91 0.96 0.93";
const INK = "0.12 0.14 0.13";
const MUTED = "0.40 0.43 0.41";
const WHITE = "1 1 1";
const WIN_ANSI: Record<string, number> = { "€": 0x80, "‚": 0x82, "ƒ": 0x83, "„": 0x84, "…": 0x85, "†": 0x86, "‡": 0x87, "ˆ": 0x88, "‰": 0x89, "Š": 0x8a, "‹": 0x8b, "Œ": 0x8c, "Ž": 0x8e, "‘": 0x91, "’": 0x92, "“": 0x93, "”": 0x94, "•": 0x95, "–": 0x96, "—": 0x97, "˜": 0x98, "™": 0x99, "š": 0x9a, "›": 0x9b, "œ": 0x9c, "ž": 0x9e, "Ÿ": 0x9f };

function winAnsiBytes(value: string): Uint8Array { const bytes: number[] = []; for (const char of value) { const code = char.charCodeAt(0); bytes.push(code <= 0x7f || (code >= 0xa0 && code <= 0xff) ? code : (WIN_ANSI[char] ?? 0x3f)); } return Uint8Array.from(bytes); }
function pdfText(value: string): string { let out = ""; for (const byte of winAnsiBytes(value)) { const char = String.fromCharCode(byte); if (char === "\\" || char === "(" || char === ")") out += `\\${char}`; else if (byte < 32 || byte > 126) out += `\\${byte.toString(8).padStart(3, "0")}`; else out += char; } return `(${out})`; }
function wrap(text: string, maxChars: number): string[] { const words = text.trim().split(/\s+/).filter(Boolean); if (!words.length) return []; const lines: string[] = []; let current = ""; for (const word of words) { const next = current ? `${current} ${word}` : word; if (next.length > maxChars && current) { lines.push(current); current = word; } else current = next; } if (current) lines.push(current); return lines; }
function line(cmds: string[], x: number, y: number, text: string, size: number, font = "F1") { cmds.push(`BT /${font} ${size} Tf ${x} ${y} Td ${pdfText(text)} Tj ET`); }
function multiLine(cmds: string[], x: number, y: number, text: string, size: number, maxChars: number, leading = 13) { const lines = wrap(text, maxChars); lines.forEach((item, index) => line(cmds, x, y - index * leading, item, size)); return y - lines.length * leading; }

function buildPdf(data: PdfPayload): Uint8Array {
  const isFr = data.locale === "fr";
  const labels = isFr ? { order: "COMMANDE EN GROS", ref: "Référence", date: "Date", customer: "Client", business: "Entreprise", destination: "Destination", delivery: "Livraison", item: "Produit", capacity: "Format", qty: "Qté", notes: "Notes", footer: "Prix et disponibilité à confirmer avec notre équipe via WhatsApp.", thank: "Merci de votre intérêt pour Sherinab Venture." } : { order: "WHOLESALE ORDER", ref: "Reference", date: "Date", customer: "Customer", business: "Business", destination: "Destination", delivery: "Delivery", item: "Product", capacity: "Format", qty: "Qty", notes: "Notes", footer: "Pricing and availability are confirmed by our team via WhatsApp.", thank: "Thank you for your interest in Sherinab Venture." };
  const date = new Intl.DateTimeFormat(isFr ? "fr-FR" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
  const cmds: string[] = [];
  cmds.push(`${WHITE} rg`, `0 0 ${PAGE_W} ${PAGE_H} re f`);
  cmds.push(`${GREEN} rg 0 732 ${PAGE_W} 110 re f`, `${GREEN} rg 0 732 8 110 re f`, `${WHITE} rg`);
  line(cmds, MARGIN, 796, "SHERINAB", 12, "F2"); line(cmds, MARGIN, 779, "VENTURE.", 10, "F2"); line(cmds, 390, 797, labels.order, 10, "F2"); line(cmds, 390, 779, `${labels.ref}: ${data.reference}`, 8); line(cmds, 390, 764, `${labels.date}: ${date}`, 8);
  let y = 698; const cardW = (PAGE_W - MARGIN * 2 - 14) / 2; const cardH = 92; const leftX = MARGIN; const rightX = MARGIN + cardW + 14;
  cmds.push(`${LIGHT_GREEN} rg ${leftX} ${y - cardH} ${cardW} ${cardH} re f`, `${LIGHT_GREEN} rg ${rightX} ${y - cardH} ${cardW} ${cardH} re f`, `${INK} rg`);
  line(cmds, leftX + 12, y - 20, labels.customer.toUpperCase(), 7, "F2"); let leftY = y - 39; if (data.customerName) leftY = multiLine(cmds, leftX + 12, leftY, data.customerName, 10, 30); if (data.businessName) multiLine(cmds, leftX + 12, leftY - 3, data.businessName, 8, 34, 11);
  line(cmds, rightX + 12, y - 20, labels.destination.toUpperCase(), 7, "F2"); const destination = [data.city, data.country].filter(Boolean).join(", "); multiLine(cmds, rightX + 12, y - 39, destination || "—", 10, 30); if (data.deliveryPreference) multiLine(cmds, rightX + 12, y - 68, `${labels.delivery}: ${data.deliveryPreference}`, 7.5, 38, 10);
  y -= cardH + 32; line(cmds, MARGIN, y, labels.order, 9, "F2"); cmds.push(`${GREEN} rg ${MARGIN} ${y - 9} ${PAGE_W - MARGIN * 2} 1 re f`, `${INK} rg`); y -= 29;
  line(cmds, MARGIN + 8, y, labels.item.toUpperCase(), 7, "F2"); line(cmds, 395, y, labels.capacity.toUpperCase(), 7, "F2"); line(cmds, 505, y, labels.qty.toUpperCase(), 7, "F2"); y -= 13; cmds.push(`${GREEN} rg ${MARGIN} ${y} ${PAGE_W - MARGIN * 2} 0.6 re f`, `${INK} rg`); y -= 18;
  for (const item of data.items) { const nameLines = wrap(item.name, 42); const rowH = Math.max(26, nameLines.length * 11 + 10); if (y - rowH < 120) break; nameLines.forEach((name, index) => line(cmds, MARGIN + 8, y - index * 11, name, 9)); if (item.capacity) line(cmds, 395, y, item.capacity, 8); line(cmds, 505, y, item.quantity.toLocaleString(), 9, "F2"); y -= rowH; cmds.push(`${MUTED} rg ${MARGIN} ${y + 4} ${PAGE_W - MARGIN * 2} 0.35 re f`, `${INK} rg`); y -= 4; }
  if (data.note) { y -= 10; line(cmds, MARGIN, y, labels.notes.toUpperCase(), 7, "F2"); multiLine(cmds, MARGIN, y - 14, data.note, 8, 92, 11); }
  cmds.push(`${LIGHT_GREEN} rg ${MARGIN} 66 ${PAGE_W - MARGIN * 2} 46 re f`, `${INK} rg`); line(cmds, MARGIN + 12, 93, labels.footer, 7.5); line(cmds, MARGIN + 12, 79, labels.thank, 7.5, "F2"); cmds.push(`${MUTED} rg`); line(cmds, MARGIN, 44, "sherinabventure.com", 7);
  const stream = cmds.join("\n");
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>", "<< /Length " + Buffer.byteLength(stream, "latin1") + " >>\nstream\n" + stream + "\nendstream"];
  const chunks: Buffer[] = [Buffer.from("%PDF-1.4\n%âãÏÓ\n", "latin1")]; const offsets: number[] = []; let offset = chunks[0].length;
  objects.forEach((object, index) => { offsets.push(offset); const chunk = Buffer.from(`${index + 1} 0 obj\n${object}\nendobj\n`, "latin1"); chunks.push(chunk); offset += chunk.length; });
  const xrefOffset = offset; const xref = ["xref", `0 ${objects.length + 1}`, "0000000000 65535 f ", ...offsets.map((item) => `${String(item).padStart(10, "0")} 00000 n `), "trailer", `<< /Size ${objects.length + 1} /Root 1 0 R >>`, "startxref", String(xrefOffset), "%%EOF"].join("\n"); chunks.push(Buffer.from(xref, "latin1")); return new Uint8Array(Buffer.concat(chunks));
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as PdfPayload;
    if (!data.reference || !Array.isArray(data.items) || data.items.length === 0 || data.items.length > 100) return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    if (data.items.some((item) => !item || typeof item.name !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 1_000_000)) return NextResponse.json({ error: "Invalid order items" }, { status: 400 });
    const pdf = buildPdf(data); const blob = new Blob([pdf as unknown as BlobPart], { type: "application/pdf" });
    return new NextResponse(blob, { status: 200, headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${data.reference}.pdf"`, "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Unable to create PDF" }, { status: 400 }); }
}
