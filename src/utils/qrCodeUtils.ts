
import QRCode from "qrcode";

/**
 * Generates a QR code data URL representing the passed object as a JSON string.
 * @param payload - The object to encode into the QR code.
 * @returns Promise<string> data URL of the QR code image.
 */
export async function generateQRCode(payload: any): Promise<string> {
  const jsonString = JSON.stringify(payload);
  return QRCode.toDataURL(jsonString, { width: 300, errorCorrectionLevel: "H" });
}
