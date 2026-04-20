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
 * 
 * CỘT TRONG SHEET (theo thứ tự):
 * timestamp | fullname | phone | email | package | amount | promoCode | orderId | experience | goal | status | teleMessageId | type | mail_welcome | mail_payment
 */

// ===== SHEET NAME =====
const SHEET_NAME = 'customers';

// ===== COLUMN DEFINITIONS =====
const COLUMNS = ['timestamp', 'fullname', 'phone', 'email', 'package', 'amount', 'promoCode', 'orderId', 'experience', 'goal', 'status', 'teleMessageId', 'type', 'mail_welcome', 'mail_payment'];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  // Ensure headers exist
  const firstRow = sheet.getRange(1, 1, 1, COLUMNS.length).getValues()[0];
  if (!firstRow[0]) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  }
  return sheet;
}

function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((h, j) => {
        row[h] = data[i][j];
      });
      if (row.fullname || row.phone || row.email) {
        rows.push(row);
      }
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
    const sheet = getOrCreateSheet();
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    // ===== THÊM LEAD MỚI =====
    if (!action || action === 'add-lead') {
      // Auto-detect type from package name
      let type = body.type || '';
      if (!type) {
        const pkg = (body.package || '').toUpperCase();
        if (pkg.includes('COACHING')) type = 'Coaching';
        else if (pkg.includes('ELEARN') || pkg.includes('21NGAY') || pkg.includes('ONLINE')) type = 'E-learning';
      }

      const row = COLUMNS.map(col => {
        if (col === 'timestamp') return body.timestamp || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        if (col === 'fullname') return body.fullname || '';
        if (col === 'phone') return body.phone || '';
        if (col === 'email') return body.email || '';
        if (col === 'package') return body.package || '';
        if (col === 'amount') return body.amount || '';
        if (col === 'promoCode') return body.promoCode || '';
        if (col === 'orderId') return body.orderId || '';
        if (col === 'experience') return body.experience || '';
        if (col === 'goal') return body.goal || '';
        if (col === 'status') return body.status || 'PENDING';
        if (col === 'teleMessageId') return body.teleMessageId || '';
        if (col === 'type') return type;
        if (col === 'mail_welcome') return body.mail_welcome || '';
        if (col === 'mail_payment') return body.mail_payment || '';
        return '';
      });

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

    // ===== CẬP NHẬT FIELDS (Admin Actions) =====
    // Dùng cho: cập nhật type, mail_welcome, mail_payment, status từ admin panel
    if (action === 'update-fields') {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      
      const phoneCol = headers.indexOf('phone');
      const orderCol = headers.indexOf('orderId');
      
      // fields là object: { type, mail_welcome, mail_payment, status }
      const fields = body.fields || {};
      
      let updated = false;
      for (let i = 1; i < data.length; i++) {
        const matchPhone = body.phone && data[i][phoneCol] == body.phone;
        const matchOrder = body.orderId && data[i][orderCol] == body.orderId;
        
        if (matchPhone || matchOrder) {
          // Cập nhật từng field được yêu cầu
          for (const [fieldName, fieldValue] of Object.entries(fields)) {
            const colIdx = headers.indexOf(fieldName);
            if (colIdx !== -1) {
              sheet.getRange(i + 1, colIdx + 1).setValue(fieldValue);
            }
          }
          updated = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: updated ? 'updated' : 'not_found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ===== XÓA LEAD (Admin Actions) =====
    if (action === 'delete-lead') {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const phoneCol = headers.indexOf('phone');
      const orderCol = headers.indexOf('orderId');
      
      let deleted = false;
      for (let i = data.length - 1; i > 0; i--) {
        const matchPhone = body.phone && data[i][phoneCol] == body.phone;
        const matchOrder = body.orderId && data[i][orderCol] == body.orderId;
        
        if (matchPhone || matchOrder) {
          sheet.deleteRow(i + 1);
          deleted = true;
          break; // Chỉ xóa record đầu tiên match được
        }
      }

      return ContentService.createTextOutput(JSON.stringify({ status: deleted ? 'deleted' : 'not_found' }))
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

    // ===== BACKWARD COMPATIBLE FALLBACK =====
    const type = (() => {
      const pkg = (body.package || '').toUpperCase();
      if (pkg.includes('COACHING')) return 'Coaching';
      if (pkg.includes('ELEARN') || pkg.includes('21NGAY') || pkg.includes('ONLINE')) return 'E-learning';
      return '';
    })();

    const row = [
      body.timestamp || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      body.fullname || body.name || body.Name || '',
      body.phone || body.Phone || '',
      body.email || body.Email || '',
      body.package || '',
      body.amount || body.Amount || '',
      body.promoCode || body.Promo || '',
      body.orderId || '',
      body.experience || '',
      body.goal || '',
      body.status || 'PENDING',
      body.teleMessageId || '',
      type,
      '',
      ''
    ];
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ status: 'added' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
