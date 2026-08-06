# docs/EVIDENCE.md — Bằng chứng thị trường đằng sau mỗi quyết định
*(Mỗi tính năng trong SPEC phải trỏ về được một dòng ở đây. Nguồn: research 2026-08-05.
Cần refresh mỗi quý — thị trường non trẻ, đối thủ chuyển động nhanh.)*

## 1. Pain được xác nhận
- Thanh tra food truck thường KHÔNG báo trước; giấy tờ là thứ bị hỏi ĐẦU TIÊN, trước cả
  việc mở tủ lạnh. Thiếu tài liệu → bị soi gắt ngay. (Nguồn: AuditBinder inspection guide,
  cập nhật 02/2026.)
- Temperature logs được yêu cầu ở MỌI cuộc thanh tra định kỳ; kỳ vọng phổ biến:
  30-90 ngày lịch sử. → quyết định "Inspector Mode hiển thị 30/90 ngày".
- Hậu quả rớt là thật: vụ Knoxville 2026 — truck bị chấm 63/100 (rớt) vì tủ lạnh giữ 49°F
  thay vì ≤41°F, vứt 20 pound thực phẩm, báo địa phương đăng tên. Reputational damage
  là nỗi sợ số 1.
- **Insight vàng — nền tảng của append-only:** thanh tra bắt bài log giấy giả ("cột 38°F
  đều tăm tắp mỗi ngày, điền 5 phút trước khi thanh tra tới"). Log TRUNG THỰC kèm
  corrective action thì QUA; log đẹp giả thì BỊ SOI. → sản phẩm bán "tính không thể
  chối cãi", không bán "hồ sơ đẹp".

## 2. Ngưỡng & checklist chuẩn (seed data cho Phase 2)
- US (FDA Food Code, adopted locally): cold ≤41°F, hot ≥135°F. Hạt/bang có thể khác nhẹ
  → ngưỡng chỉnh được, ghi "FDA default".
- 12 điểm pre-shift đã được validate bởi content đối thủ: permits + commissary agreement
  hiện diện · nước sạch đủ áp · grey tank ≥15% lớn hơn fresh (verify locally) · hand sink
  riêng có xà phòng + khăn + nước ≥100°F · probe thermometer đã hiệu chuẩn · cold/hot
  holding đúng ngưỡng · log hôm nay đã cập nhật · allergen matrix + staff trả lời được ·
  raw dưới ready-to-eat + date labels · sanitizer đúng nồng độ + test strips khô ·
  chống pest (screen cửa sổ, không nước đọng) · rác/dầu thải có nắp, không đổ cống.
- 3 lỗi rớt phổ biến (dùng cho content marketing): hand sink khô không khăn giấy ·
  test strips hỏng/ướt không chứng minh được ppm · log giả hoàn hảo.

## 3. Bản đồ cạnh tranh 3 tầng (cập nhật 2026-08-05)
| Tầng | Đối thủ | Mô hình | Giá | Khoảng trống họ để lại |
|---|---|---|---|---|
| Setup ngày 0 | **AuditBinder** | Sinh binder PDF/DOCX một lần: HACCP plan, CCP table, SOPs, log sheet ĐỂ IN | $47-97 one-time, Lemon Squeezy, US/UK/CA, 6 loại hình | Bán xong trả khách về với GIẤY. Không recurring, không dữ liệu vận hành. Khách của họ = lead ấm nhất của ta |
| Vận hành micro | App vụn trên App Store (SafeLogs, TempCheck, Hygiene Logs...) | Temp logger generic | Free/rẻ | Không hiểu food truck, không inspector-ready, gần như 0 rating — "cạnh tranh tồi xác nhận nhu cầu" |
| Vận hành SMB+ | **FoodDocs** (và Jolt, Operandio, Zip HACCP) | Monitoring platform: AI HACCP builder, sensor, multi-location, dashboard realtime | FoodDocs từ $169/tháng | Quá đắt + quá nặng cho xe 1-3 người → chừa nguyên phân khúc micro |

→ Định vị: "$19-29/mo, làm MỘT việc: log hàng ngày inspector-ready cho mobile unit."
→ AuditBinder là đối tác tiềm năng hơn là địch (họ setup, ta vận hành). Watchlist: nếu họ
  ra subscription logging → nguy cơ trực tiếp, cần biết trong vòng 30 ngày (Phase 0.6).

## 4. Kênh phân phối
- **Commissary (kênh khác biệt, chưa ai dùng):** food truck bị luật bắt có commissary
  agreement (đỗ xe, xả grey water, nước sạch, trữ/sơ chế) và agreement này bị kiểm tra
  trong thanh tra định kỳ. Chủ xe ra vào commissary HÀNG NGÀY. 1 commissary = 20-50 xe.
  Lưu ý: một số nơi cho waiver với xe tự chủ hoàn toàn → kênh không phủ 100%.
- Cộng đồng online: r/foodtrucks hoạt động tốt; group FB food truck theo vùng; văn hóa
  tương trợ mạnh ("food truck community is a real community" — Fresno Bee) — giống văn
  hóa giới pet sitter, playbook 90/10 áp dụng được nguyên.
- SEO: AuditBinder đang chiếm content position từ khóa inspection (bài 12-point checklist,
  free temp log template). Ta vào sau ở keyword "setup" — nhưng keyword "daily log app",
  "digital temperature log food truck" còn mở.
- Chấp nhận của thanh tra với log số: nhiều nơi OK nếu truy cập nhanh tại chỗ, một số
  vẫn muốn bản in → Inspector Mode phải có "Print backup" (quyết định 3.2).

## 5. Quy mô thị trường (ước lượng thô — cần số mới hơn ở Phase 0)
- Food truck US: 35.000-50.000+ đơn vị (con số 15.000 là số cũ ~2013; ngành tăng mạnh).
  Cộng thêm trailer, cart, caterer di động, ghost kitchen nhỏ — TAM mở rộng tự nhiên.
- Bottom-up: $10K MRR @ $24/mo ≈ 420 xe trả phí ≈ ~1% của đáy ước lượng. Khả thi về
  con số; câu hỏi là kênh — trả lời ở Phase 0.3/0.4.

## 6. Giả định CHƯA kiểm chứng (Phase 0 phải trả lời)
- [ ] Chủ xe có chịu nhập tay nhiệt độ 2-4 lần/ngày không, hay đòi sensor tự động?
  (Nếu đòi sensor → mô hình khác hẳn, phải đánh giá lại toàn bộ.)
- [ ] % thanh tra tại 3 bang thí điểm chấp nhận log số trên điện thoại?
- [ ] Chủ commissary có động cơ giới thiệu không (hoa hồng 20% đủ hấp dẫn?), và họ có
  quyền lực gợi ý công cụ cho xe không hay chỉ là bãi đỗ vô danh?
- [ ] WTP thật: $19 hay $29? Có cần annual $190 không?
