# phase-4-billing-launch.md — Phase 4: Billing & Launch

## Context của phase
⚠️ Đọc `docs/SECURITY.md` mục 4 (khóa ghi khi hết hạn — không giữ dữ liệu làm con tin)
và mục 9 (webhook) trước step 4.1.
Sản phẩm đã dùng được — phase này biến nó thành doanh nghiệp: thu tiền, 20 khách đầu,
ra mắt công khai. Marketing chạy đậm song song theo MARKETING-PLAN mục 4.
**Phase XONG khi:** một chủ xe lạ tự đi hết vòng đời: signup → trial → dùng thật →
trả tiền qua MoR → nhận receipt — không cần nói chuyện với founder.

## Step 4.1 — MoR billing + trial
- Copy module `src/lib/billing/` từ Solo Sitter (interface createCheckout /
  getSubscription / parseWebhook). Provider: cùng MoR với Solo Sitter cho gọn vận hành.
- Giá: chốt theo dữ liệu phỏng vấn 0.3 — mặc định đề xuất $24/mo hoặc $190/năm
  (ghi quyết định + lý do vào Nhật ký). Trial 14 ngày tự quản (`trial_ends_at`),
  không cần thẻ.
- Hết trial/hết hạn: khóa GHI mới; ĐỌC + export + sync queue cũ vẫn mở (SECURITY.md
  mục 4). Banner mềm, không nagging mỗi phút.
- Webhook: verify chữ ký + idempotent theo event id + test.
- DoD: [ ] checkout sandbox end-to-end · [ ] webhook test pass · [ ] trạng thái
  trial/active/expired phản ánh đúng trong UI · [ ] khóa ghi nhưng không khóa đọc.

## Step 4.2 — Founding Trucks (20 xe đầu)
- Offer: 3 tháng miễn phí + hotline founder, đổi feedback 15 phút/tuần. Trang
  `/founding-trucks` (copy pattern /founding-sitters).
- Nguồn: waitlist Phase 0.5 trước → cộng đồng đã nuôi từ 0.2 (theo giọng TEMPLATES
  Solo Sitter, đổi ngữ cảnh) → 10 owner đã phỏng vấn ở 0.3 (lead ấm nhất).
- Onboard TAY từng xe (video call/chat), ghi friction log — mỗi friction lặp ≥2 lần
  = bug ưu tiên cao.
- DoD: [ ] ≥15 xe activated (log ≥3 ngày liên tiếp) · [ ] friction log thành danh sách
  fix đã xử lý hoặc vào BACKLOG · [ ] ≥5 testimonial xin phép dùng công khai.

## Step 4.3 — Launch công khai
- 2 free tools theo MARKETING-PLAN kênh B (Temp Danger Zone Checker + Inspection
  Readiness Quiz) — build theo đúng 4 quy tắc /tools của Solo Sitter, đặt tại
  domain Solo Truck `/tools/*`.
- 4 bài SEO đầu (đã viết nháp từ Phase 1-2 theo lịch marketing) + 2 trang /compare
  (auditbinder, fooddocs — giọng trung thực "tầng khác nhau").
- Product Hunt: playbook y hệt Solo Sitter (launch thứ Ba/Tư, 12:01 AM PT ≈ 2 PM VN,
  first comment = founder story hai-sản-phẩm-một-playbook, trực cả ngày).
- Đăng cộng đồng: free tools theo mẫu "I made a free tool" (được phép ở hầu hết
  group/sub); sản phẩm chính chỉ nhắc khi được hỏi hoặc trong post build-in-public.
- DoD: [ ] tools live + được đăng ≥3 nơi · [ ] PH launched · [ ] funnel đo đủ
  waitlist→signup→activated→paid · [ ] số liệu tuần đầu ghi vào Nhật ký.

## Sau khi xong phase
Tick Phase 4 + Nhật ký. Điều kiện mở Phase 5 (commissary): ≥10 xe active — vì pitch
với commissary cần bằng chứng "xe thật đang dùng", không bán ý tưởng suông.
