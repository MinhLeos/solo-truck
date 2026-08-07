# docs/BACKLOG.md — Ngoài scope (ghi vào đây thay vì code)
*(Mỗi mục: 1 dòng mô tả + điều kiện mở. Claude Code: thấy tính năng "nên có" → thêm
vào đây, KHÔNG code.)*

## Product
- **Jurisdiction presets** (`jurisdiction_presets`: khách mới chọn "Travis County, TX"
  → ngưỡng + checklist + kỳ vọng đã xác minh nạp sẵn) — moat dữ liệu tích lũy, trả lời
  điểm yếu switching-cost. Nguồn dữ liệu: bảng theo dõi thanh tra theo hạt (dưới).
  Điều kiện mở: ≥10 hạt có ≥2 kỳ thanh tra thật xác nhận qua Founding Trucks.
- **Bảng theo dõi thanh tra theo hạt** (bắt đầu là spreadsheet từ Phase 4.2, chưa cần
  build trong app): mỗi Founding Truck sau kỳ thanh tra đầu có dùng app trả lời 3 câu —
  thanh tra có xem app không? / đòi gì app không có? / đòi bản in không? → nạp dần
  thành dữ liệu cho jurisdiction presets. Đưa vào app khi spreadsheet >50 dòng.
- Sensor/Bluetooth thermometer integration — mở nếu ≥6/10 phỏng vấn 0.3 đòi sensor
  (khi đó đánh giá lại toàn bộ mô hình, xem tiêu chí KILL ở phase-0).
- Staff accounts thật (thay PIN attribution) — mở khi có khách xe >3 người yêu cầu.
- Multi-truck cho 1 owner — mở khi ≥3 khách hỏi (schema trucks đã chừa sẵn).
- Jurisdiction UK (FSA, 8°C-63°C) / Canada (CFIA) — mở sau khi US retention ổn định.
- Cooling logs (2-stage cooling 135→70→41°F) — feature thật của ngành, hỏi trong
  phỏng vấn 0.3; nếu nhiều người cần, cân nhắc đưa vào ngay sau MVP.
- Receiving logs (nhận hàng từ supplier) — tương tự.
- Payout hoa hồng commissary tự động — mở khi >15 commissary active.
- AuditBinder partnership (họ setup binder → CTA sang ta vận hành, rev-share) —
  chỉ tiếp cận khi ta có ≥50 khách trả phí (đàm phán từ thế có gì đó).
- **Web push cho reminder (Phase 2.4)** — phase file cho phép "push (nếu PWA cho
  phép) HOẶC email"; đã ship EMAIL only (Resend, tái dùng module Solo Sitter).
  Solo Sitter cũng chưa có hạ tầng push (không VAPID key, không
  push_subscriptions table, không dep web-push) nên không có gì để copy — mở khi
  owner phản hồi email bị bỏ lỡ/không đủ nhanh.

## Marketing
- Ads trả phí — mở sau 3 tháng launch, khi biết LTV thật.
- Free tool thứ 3+ — theo dữ liệu traffic của 2 tool đầu.
- Podcast ngành food truck — tìm và log tên show trong Phase 0.2.

## Tech debt cho phép
- Bottom nav 6 mục (Today/Checklist/History/Documents/Inspector/Staff) hơi
  chật trên màn 390px sau khi thêm Documents + Inspector ở Phase 3 — cân
  nhắc gộp bớt (vd Documents+Staff vào 1 mục "Settings") khi làm UI polish.
- OG image động cho tools/SEO pages (tĩnh trước).
- Materialized streaks nếu chọn runtime ở 2.4 và về sau chậm.
- `npm audit` hiện có 3 lỗi high nằm trong `sharp`/`postcss` mà `next@16.2.12`
  tự bundle (không phải dep của mình, chưa có bản Next vá) — CI tạm gate ở
  mức `critical`, nâng lại `high` khi Next ra bản vá. Y hệt tình trạng đã gặp
  ở Solo Sitter.
