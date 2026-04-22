import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export const buildWatermarkedPDF = async (docTitle, studentName, contentText, outputPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Watermark
      doc
        .fillColor('#e0e0e0')
        .fontSize(60)
        .opacity(0.3)
        .text('PARUL UNIVERSITY CONFIDENTIAL', 50, 400, {
          align: 'center',
          angle: -45,
        });

      // Reset opacity & setup Header
      doc.opacity(1);
      doc.fillColor('#000').fontSize(24).text(docTitle, { align: 'center' });
      doc.moveDown(1);
      
      // Date and Watermark text
      const dateStr = new Date().toLocaleDateString();
      doc.fontSize(12).text(`Generated For: ${studentName}`, { align: 'right' });
      doc.text(`Date: ${dateStr}`, { align: 'right' });
      doc.moveDown(2);

      // Body text
      doc.fontSize(14).text(contentText, { align: 'justify' });
      doc.moveDown(3);

      // Generate verification QR code
      const authHash = 'AUTH-' + Date.now();
      const qrDataUrl = await QRCode.toDataURL(`VERIFY: ${authHash} | ${studentName}`);
      // qrDataUrl is a generic base64 image data URL 'data:image/png;base64,....'
      const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, "");
      
      // We will place the QR code at the bottom right
      doc.image(Buffer.from(base64Data, 'base64'), 450, 650, { fit: [80, 80] });
      doc.fontSize(10).text(`Verification Hash: ${authHash}`, 50, 700);

      doc.end();

      stream.on('finish', () => resolve(outputPath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};
