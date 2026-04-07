/**
 * Script chức năng để tự động tạo cấu trúc các Bảng AppSheet từ JSON
 * Đồng thời tự động chèn 2 bản ghi dữ liệu mẫu (Sample Data) vào cơ sở dữ liệu.
 * Copy toàn bộ mã này vào: Tiện ích mở rộng -> Apps Script trong Google Sheets
 * Sau đó bấm Run (Chạy) hàm createDatabaseStructure để các sheet được tự động tạo.
 */

function createDatabaseStructure() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // JSON Cấu trúc Headers
  var schema = {
    "BienBanSuCo": [
      "Id_BienBan", "DonVi_DeXuat", "So_ToTrinh", "DiaDiem_Lap", "NgayLap_ToTrinh",
      "Ten_TuyenCap", "NoiDung_ChiDao", "ThoiGian_HoanThanh", "NoiDung_SuaChua", "ViTri_SuaChua",
      "So_Eoffice", "Ngay_NghiemThu", "DiaDiem_NghiemThu", "PGD_TrungTam", "ToTruong_HaTang",
      "NhanVien_KyThuat", "ToTruong_KhaiThac", "NhanVien_KhaiThac"
    ],
    "ChiTietVatTu": [
      "Id_VatTu", "Id_BienBan", "Ten_VatTu", "DonViTinh", "SoLuong"
    ]
  };

  // JSON Dữ liệu mẫu khởi tạo chuẩn chỉ theo format biên bản (Dành cho 2 ID sự cố)
  var sampleData = {
    "BienBanSuCo": [
      [
        "TTr-TTHT-PYN-05012026", "TỔ HẠ TẦNG PHÚC YÊN", "/TTr-TTHT-PYN", "Phú Thọ", "05/01/2026",
        "Ngô Miễn – Phường Phúc Yên", "Chuẩn bị đầy đủ vật tư ưu tiên khu vực Ngô Miễn", "17h00 cùng ngày", 
        "Ra căng kéo lại cáp quang loại 4 FO, 8 FO, 48 FO đoạn từ Ngô Miễn – Phường Phúc Yên, đấu nối tủ hộp PON, hàn nối măng sông, đấu nối dây nhảy để bảo đảm an toàn cho tuyến cáp.", 
        "Ngô Miễn – Phường Phúc Yên", "/VBĐT", "09/01/2026", "TDP Ngô Miễn, Phường Phúc Yên", "Nguyễn Công Hoan", "Ngô Tiến Mạnh",
        "Nguyễn Văn A", "Trần Nam Trung", "Lê Văn B"
      ],
      [
        "TTr-TTHT-TDP-11022026", "TỔ HẠ TẦNG BÌNH XUYÊN", "/TTr-TTHT-BXX", "Vĩnh Phúc", "11/02/2026",
        "Tuyến Cáp Trục A - Khu Công Nghiệp Bình Xuyên", "Xử lý khẩn cấp tránh gián đoạn băng thông Doanh Nghiệp", "12h trưa", 
        "Tiến hành thay thế đoạn cáp quang 8FO bị đứt ngầm do xe tải thi công làm quẹt đứt. Kéo mới 200m cáp và hàn lại 2 măng xông tại điểm đứt.", 
        "Cổng KCN Bình Xuyên", "128/VBĐT", "13/02/2026", "Trạm Nguồn Bình Xuyên", "Nguyễn Công Hoan", "Ngô Tiến Mạnh",
        "Đào Duy Từ", "Trần Nam Trung", "Phạm Khắc T"
      ]
    ],
    "ChiTietVatTu": [
      ["VT-001-1", "TTr-TTHT-PYN-05012026", "Splitter 1:16 rời đã hàn đâu Connector SC/APC", "Bộ", 1],
      ["VT-001-2", "TTr-TTHT-PYN-05012026", "Splitter rời 1:2 (ko có Connector)", "Bộ", 1],
      ["VT-002-1", "TTr-TTHT-TDP-11022026", "Cáp quang 8FO luồn cống", "Mét", 200],
      ["VT-002-2", "TTr-TTHT-TDP-11022026", "Măng xông quang kèm khay hàn", "Cái", 2],
      ["VT-002-3", "TTr-TTHT-TDP-11022026", "Băng dính cách điện", "Cuộn", 5]
    ]
  };

  // Duyệt qua từng bảng và khởi tạo
  for (var sheetName in schema) {
    var sheet = ss.getSheetByName(sheetName);
    
    // Nếu sheet chưa tồn tại thì tạo mới
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    var headers = schema[sheetName];
    
    // Thay thế toàn bộ Headers ở dòng 1
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Chèn Dữ liệu Mẫu (Chỉ chèn nếu sheet đang chưa có data nào)
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) { 
       var data = sampleData[sheetName];
       if(data && data.length > 0) {
          // Ghi toàn bộ ma trận dữ liệu mẫu bắt đầu từ dòng số 2
          sheet.getRange(2, 1, data.length, headers.length).setValues(data);
       }
    }

    // Format cho đẹp và dễ sử dụng lúc nhập vào AppSheet
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");           // In đậm Header
    headerRange.setBackground("#FFF2CC");        // Bôi màu vàng nhạt
    sheet.setFrozenRows(1);                      // Đóng băng dòng đầu
    
    // Tự động căn chỉnh độ rộng cột
    sheet.autoResizeColumns(1, headers.length);
  }
  
  // Thông báo tới người dùng khi kết thúc
  SpreadsheetApp.getUi().alert("Đã tạo xong cấu trúc và Tự động chèn 2 bản ghi Dữ Liệu Mẫu (Sample Data) cho Bảng Sự cố!");
}

/**
 * Hàm Trả Về Dữ Liệu Gọi Từ Web (Dùng làm API kết nối Web in Vercel)
 */
function doGet(e) {
  var id = e.parameter.id;
  if (!id) {
    return ContentService.createTextOutput(JSON.stringify({error: "Thiếu tham số ID"})).setMimeType(ContentService.MimeType.JSON);
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (id === "ALL") {
    return ContentService.createTextOutput(JSON.stringify({
      BienBan: ss.getSheetByName("BienBanSuCo").getDataRange().getValues(),
      VatTu: ss.getSheetByName("ChiTietVatTu").getDataRange().getValues()
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // Đọc Bảng Cha: BienBanSuCo
  var sheetBB = ss.getSheetByName("BienBanSuCo");
  var dataBB = sheetBB.getDataRange().getValues();
  var headersBB = dataBB[0];
  var bbRecord = null;
  
  var targetId = String(id).trim().toLowerCase();
  
  for (var i = 1; i < dataBB.length; i++) {
    // ID Cột 1 (Index 0)
    if (String(dataBB[i][0]).trim().toLowerCase() === targetId) { 
      bbRecord = {};
      for (var j = 0; j < headersBB.length; j++) {
        var val = dataBB[i][j];
        if (val instanceof Date) {
           var dd = String(val.getDate()).padStart(2, '0');
           var mm = String(val.getMonth() + 1).padStart(2, '0');
           var yyyy = val.getFullYear();
           val = dd + '/' + mm + '/' + yyyy;
        }
        bbRecord[headersBB[j]] = val;
      }
      break;
    }
  }
  
  if (!bbRecord) {
    bbRecord = {}; // Trả về rỗng thay vì báo lỗi cứng để Web vẫn load
  }
  
  // Đọc Bảng Con: ChiTietVatTu
  var sheetVT = ss.getSheetByName("ChiTietVatTu");
  var dataVT = sheetVT.getDataRange().getValues();
  var headersVT = dataVT[0];
  var vtRecords = [];
  
  for (var i = 1; i < dataVT.length; i++) {
    var matchFound = false;
    
    // Tự động quét toàn bộ các cột trong dòng, tìm xem có chứa ID sự cố không
    for(var c = 0; c < headersVT.length; c++) {
      if(String(dataVT[i][c]).trim().toLowerCase() === targetId) {
        matchFound = true;
        break;
      }
    }
    
    // Nếu tìm thấy bất kỳ cột nào chứa ID sự cố, bế dòng đó vào Vật Tư
    if (matchFound) {
      var vtRec = {};
      for (var j = 0; j < headersVT.length; j++) {
        vtRec[headersVT[j]] = dataVT[i][j];
      }
      vtRecords.push(vtRec);
    }
  }
  
  var result = {
    BienBanSuCo: bbRecord,
    ChiTietVatTu: vtRecords
  };
  
  // Trả về luồng JSON cho Vercel sử dụng
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
