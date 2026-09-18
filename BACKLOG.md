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
- **Sensor/Bluetooth thermometer integration** — mở nếu ≥6/10 phỏng vấn 0.3 đòi
  sensor (khi đó đánh giá lại toàn bộ mô hình, xem tiêu chí KILL ở phase-0).
  Phân tích kỹ thuật 2026-09-18 (chưa code, chỉ ghi lại để phiên sau không phải
  phân tích lại):
  - **iOS không hỗ trợ Web Bluetooth** — rào cản lớn nhất. Solo Truck là PWA
    (native app là non-goal), cách duy nhất web app nói chuyện Bluetooth là
    Web Bluetooth API, nhưng Safari/iOS hoàn toàn không implement API này
    (nhiều năm chưa có lộ trình từ Apple). Chỉ chạy được Chrome/Edge Android +
    desktop → một phần đáng kể khách iPhone sẽ không dùng được.
  - **Không có chuẩn chung cho nhiệt kế thực phẩm.** BLE có "Health
    Thermometer Service" chuẩn nhưng dành cho nhiệt kế y tế; nhiệt kế probe
    bếp (ThermoPro, Govee, Cooper-Atkins, Thermoworks...) hầu hết dùng GATT
    characteristic riêng của từng hãng → phải chọn support từng model cụ thể,
    không có "tích hợp Bluetooth" chung chung.
  - **2 hướng nếu làm:** (a) Web Bluetooth trực tiếp — chỉ Android/desktop,
    UX pairing/reconnect khi mất kết nối, và BLE cũng yếu tín hiệu trong hộp
    kim loại (cùng vấn đề sóng yếu đã lo cho mạng cellular); (b) qua cloud API
    của hãng (dòng nhiệt kế "chuyên nghiệp" có WiFi, ví dụ ComplianceMate) —
    né được vấn đề iOS nhưng phá vỡ offline-first (thiết bị phải có mạng đẩy
    lên cloud hãng trước khi Solo Truck đọc được) trừ khi thiết bị tự cache
    offline như queue của Solo Truck.
  - Đây là đổi giả định nền tảng (chi phí phần cứng cho khách, khả năng phải
    hy sinh iOS HOẶC hy sinh offline-first), không phải thêm 1 tính năng đơn
    giản — đúng lý do điều kiện mở yêu cầu bằng chứng nhu cầu mạnh trước.
- **Voice input thay numpad (đã phân tích, KHÔNG làm)** — 2026-09-18: xung đột
  trực tiếp với offline-first bắt buộc (Web Speech API cần mạng để nhận dạng ở
  hầu hết trình duyệt; on-device thật sự chỉ có trên native app, là non-goal).
  Rủi ro cao hơn: `logs` append-only, nghe nhầm số (dễ xảy ra trong bếp ồn) tạo
  bản ghi sai vĩnh viễn — ngược với chính lý do sản phẩm tồn tại. Numpad hiện
  tại đã đạt DoD "≤3 chạm" (~5 giây), voice không rõ nhanh hơn vì vẫn cần bước
  xác nhận số trên màn hình. Điều kiện mở lại: (a) ≥N phỏng vấn owner chủ động
  than phiền gõ tay khi tay dính dầu/đeo găng, VÀ (b) on-device speech
  recognition không cần mạng khả dụng ổn định trên web — chưa có hiện nay.
  Nếu mục tiêu là "tay bẩn khó thao tác", ưu tiên Bluetooth thermometer ở trên
  thay vì voice: đọc số trực tiếp từ probe, không qua nhận dạng giọng nói, không
  lỗi nghe nhầm, không phụ thuộc mạng.
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
- Bottom nav vẫn 6 mục (Today/Checklist/History/Documents/Inspector/Settings)
  — Phase 4.1 đã gộp Staff+Billing vào `/settings` (giảm 1 mục lẽ ra phải
  thêm cho Billing) nhưng còn chật trên màn 390px; cân nhắc gộp thêm
  Documents vào Settings khi làm UI polish.
- ~~Funnel analytics chưa có~~ — xong 2026-09-18: GA4 (`NEXT_PUBLIC_GA4_ID`)
  + `track()`/`getAttribution()`, event `tool_view`/`tool_result`/
  `tool_cta_click` trên `/tools/*`, `cta_click` trên `/compare/*`,
  `/founding-trucks`, landing, `/about`. GA4 script CHỈ mount trên trang
  public (`PublicAnalytics` — landing/about/privacy/terms/tools/compare/
  founding-trucks), KHÔNG BAO GIỜ trong `(app)` — dữ liệu compliance của
  khách trả phí không phải analytics sản phẩm. Còn chờ founder tạo GA4
  property thật để xác nhận event lên dashboard (code fallback
  console.log khi thiếu env).
- ~~OG image động cho tools/SEO pages~~ — xong 2026-09-18: OG tĩnh
  (`scripts/generate-site-og-images.mjs`, output `public/og/site/*.png`)
  cho default/founding-trucks/compare-auditbinder/compare-fooddocs/tools,
  dùng qua `siteMetadata()` (`src/lib/seo/metadata.ts`) — canonical + OG +
  Twitter card cho mọi trang public. Sitemap (`src/app/sitemap.ts`) +
  robots (`src/app/robots.ts`, allowlist AI bot: GPTBot/ClaudeBot/
  PerplexityBot/...) đã có. JSON-LD (SoftwareApplication + FAQPage) trên
  landing. Đổi động OG (per-truck/per-lead) vẫn để dành sau nếu cần.
- Materialized streaks nếu chọn runtime ở 2.4 và về sau chậm.
- `npm audit` hiện có 3 lỗi high nằm trong `sharp`/`postcss` mà `next@16.2.12`
  tự bundle (không phải dep của mình, chưa có bản Next vá) — CI tạm gate ở
  mức `critical`, nâng lại `high` khi Next ra bản vá. Y hệt tình trạng đã gặp
  ở Solo Sitter.
- **`/guide` screenshots bị Serwist precache vào service worker** (~1MB thêm
  vào lượt cài PWA đầu tiên) — `@serwist/turbopack`'s `withSerwist()` trong
  bản đang dùng không nhận option thứ 2 (`globIgnores`) như `@serwist/next`
  cũ, nên chưa tìm được cách loại trừ `public/guide/*.png` khỏi precache mà
  không đổi cách serve ảnh. Không critical (vẫn 1 lần, không lặp lại), nhưng
  đáng tối ưu nếu thêm nhiều ảnh guide sau này.
