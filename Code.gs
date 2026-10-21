// DIS After-School Interest: receiver
// The parent page (index.html) sends ready-made rows here and they are saved to a Google Sheet in your Drive.
// Written so it should never need editing again: the page decides the columns.
// If the page sends a column name the sheet doesn't have yet, it is added to the end of the header row.

function doGet() {
  return ContentService.createTextOutput('After-school form receiver is running (v2).');
}

function doPost(e) {
  var result = { ok: false };
  try {
    var data = JSON.parse(e.postData.contents);
    saveRows_(data.rows || []);
    result.ok = true;
  } catch (err) {
    result.error = String(err);
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor to create the sheet and approve permissions.
function setup() {
  var ss = getSheet_().getParent();
  Logger.log('Responses sheet: ' + ss.getUrl());
}

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  var ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('After-School Interest Responses');
    props.setProperty('SHEET_ID', ss.getId());
    ss.getSheets()[0].setName('Responses');
    ss.getSheets()[0].appendRow(['Timestamp']);
    ss.getSheets()[0].setFrozenRows(1);
  }
  return ss.getSheets()[0];
}

// Stops typed text from being read as a spreadsheet formula.
function clean_(v) {
  v = String(v == null ? '' : v).slice(0, 300);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

// rows: [{ 'Column name': value, ... }, ...]  (one object per child)
function saveRows_(rows) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
    if (!header[0]) header[0] = 'Timestamp';
    rows.forEach(function (r) {
      Object.keys(r).forEach(function (k) {
        if (header.indexOf(k) < 0) header.push(k);
      });
    });
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    var now = new Date();
    rows.forEach(function (r) {
      sheet.appendRow(header.map(function (k) {
        return k === 'Timestamp' ? now : (k in r ? clean_(r[k]) : '');
      }));
    });
  } finally {
    lock.releaseLock();
  }
}
