/**
 * GOOGLE APPS SCRIPT - CRM 21 NGÀY
 * 
 * HƯỚNG DẪN:
 * 1. Mở Google Sheet → Extensions → Apps Script
 * 2. Xoá hết code cũ, paste toàn bộ code này vào
 * 3. Click "Deploy" → "New Deployment" 
 * 4. Chọn Type: "Web App"
 * 5. Execute as: "Me" 
 * 6. Who has access: "Anyone"
 * 7. Click "Deploy" → Copy URL mới
 * 8. Thay URL cũ trong tất cả file api/*.js bằng URL mới
 */

// ===== SHEET NAME =====
const SHEET_NAME = 'customers';

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((h, j) => {
        row[h] = data[i][j];
      });
      rows.push(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', data: rows }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    // ===== THÊM LEAD MỚI =====
    if (!action || action === 'add-lead') {
      // Headers: timestamp | fullname | phone | email | package | amount | promoCode | orderId | experience | goal | status
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      // Nếu sheet trống, tạo headers
      if (headers.length === 0 || !headers[0]) {
        sheet.getRange(1, 1, 1, 11).setValues([['timestamp', 'fullname', 'phone', 'email', 'package', 'amount', 'promoCode', 'orderId', 'experience', 'goal', 'status']]);
      }

      const row = [
        body.timestamp || new Date().toLocaleString('vi-VN'),
        body.fullname || '',
        body.phone || '',
        body.email || '',
        body.package || '',
        body.amount || '',
        body.promoCode || '',
        body.orderId || '',
        body.experience || '',
        body.goal || '',
        body.status || 'PENDING'
      ];

      sheet.appendRow(row);
      
      return ContentService.createTextOutput(JSON.stringify({ status: 'added' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ===== CẬP NHẬT TRẠNG THÁI =====
    if (action === 'update-status') {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      
      const phoneCol = headers.indexOf('phone');
      const orderCol = headers.indexOf('orderId');
      const statusCol = headers.indexOf('status');
      
      if (statusCol === -1) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No status column' }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      let updated = false;
      for (let i = 1; i < data.length; i++) {
        // Tìm theo phone hoặc orderId
        if ((body.phone && data[i][phoneCol] == body.phone) ||
            (body.orderId && data[i][orderCol] == body.orderId)) {
          sheet.getRange(i + 1, statusCol + 1).setValue(body.status || 'PAID');
          updated = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: updated ? 'updated' : 'not_found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ===== GHI NHẬN THANH TOÁN TỰ ĐỘNG =====
    if (action === 'payment-received') {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const orderCol = headers.indexOf('orderId');
      const statusCol = headers.indexOf('status');

      if (orderCol !== -1 && statusCol !== -1) {
        for (let i = 1; i < data.length; i++) {
          if (data[i][orderCol] == body.orderId) {
            sheet.getRange(i + 1, statusCol + 1).setValue('PAID');
            break;
          }
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: 'processed' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ===== ACTION KHÔNG XÁC ĐỊNH → Thêm dòng mới (backward compatible) =====
    const row = [
      body.timestamp || new Date().toLocaleString('vi-VN'),
      body.fullname || body.name || body.Name || '',
      body.phone || body.Phone || '',
      body.email || body.Email || '',
      body.package || '',
      body.amount || body.Amount || '',
      body.promoCode || body.Promo || '',
      body.orderId || '',
      body.experience || '',
      body.goal || '',
      body.status || 'PENDING'
    ];
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ status: 'added' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
