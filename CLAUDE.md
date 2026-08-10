# CLAUDE.md — Project Memory (Solo Truck)

## Project
Vertical SaaS (web app, PWA, mobile-first, **offline-first**) cho food truck / mobile food unit
độc lập tại US: daily compliance logging (nhiệt độ, checklist, corrective action) + Inspector Mode.
Solo indie builder, tiếng Việt là ngôn ngữ chính của founder — trả lời tiếng Việt khi thảo luận,
code/comment/commit bằng tiếng Anh.

**Ngách:** food-truck compliance logging (research chốt 2026-08-05, xem `docs/EVIDENCE.md`)
**Brand (working name): Solo Truck** — ⚠️ CHƯA kiểm tra USPTO/Google/App Store/domain.
Step 0.1 phải làm việc này trước khi dùng brand ở bất cứ đâu public.

**⛔ GATE KÍCH HOẠT:** dự án này CHỈ được code khi Solo Sitter đạt điều kiện trong
`MASTER-PLAN.md` mục 0. Trước đó, mọi phiên làm việc chỉ được phép: research, viết docs,
theo dõi đối thủ. Claude Code KHÔNG được đề xuất "tiện tay build trước".

## File điều phối
- **`MASTER-PLAN.md` — LUÔN đọc đầu tiên.** Context + gate + progress tracker.
- **`ARCHITECTURE.md`** — kiến trúc + business logic. Đọc trước mọi quyết định thiết kế.
- **`docs/SECURITY.md`** — BẮT BUỘC đọc trước khi code Phase 2, 3, 4 (log integrity là
  sản phẩm; làm sai = sản phẩm vô giá trị trước thanh tra).
- `docs/EVIDENCE.md` — bằng chứng thị trường đằng sau mỗi tính năng.
- `MARKETING-PLAN.md` — kênh commissary + SEO + cộng đồng.
- `docs/BACKLOG.md` — mọi tính năng ngoài scope ghi vào đây, không code.
- Thứ tự build: `MASTER-PLAN.md` + `phases/phase-N-*.md`.

## Tech stack (đã chốt — tái dùng tối đa playbook Solo Sitter, không tự ý đổi)
- Next.js (App Router) + TypeScript · Tailwind CSS · zod validate
- Supabase: Postgres, Auth (email+password / Google OAuth — đổi từ magic link
  2026-08-10, xem SECURITY.md mục 9), RLS, Storage (ảnh corrective action, documents)
- **PWA offline-first bằng Serwist + IndexedDB — BẮT BUỘC, không phải nice-to-have**
  (food truck = hộp kim loại, sóng yếu; log phải ghi được offline và sync sau)
- Thanh toán (founder VN, KHÔNG dùng được Stripe trực tiếp):
  - Subscription: Merchant of Record (Dodo Payments hoặc Paddle) — copy module
    `src/lib/billing/` từ Solo Sitter
  - KHÔNG xử lý tiền hộ ai (không có dòng tiền B như Solo Sitter — đơn giản hơn)
- Deploy: Vercel · Lỗi: Sentry · Email: Resend

## Quy tắc làm việc với tôi
1. LUÔN đọc `ARCHITECTURE.md` và `docs/EVIDENCE.md` trước khi implement tính năng mới.
2. Làm theo MASTER-PLAN.md, mỗi phiên MỘT step. Đọc `phases/phase-N-*.md` tương ứng
   trước khi code. Xong step: tick checkbox trong MASTER-PLAN.md + ghi Nhật ký quyết định.
3. Trước khi code một task: trình bày plan ngắn (file tạo/sửa, data model đổi gì), chờ xác nhận.
4. KHÔNG thêm tính năng ngoài phase files. Thấy tính năng "nên có" → `docs/BACKLOG.md`.
5. Scope MVP = 5 tính năng (xem ARCHITECTURE.md mục 2) — ship trong 6 tuần kể từ khi gate mở.
6. Mọi thao tác liên quan `logs` / `corrective_actions` / `documents` phải có test —
   đây là dữ liệu pháp lý của khách, tương đương "dữ liệu tiền bạc" bên Solo Sitter.
7. Commit nhỏ, message tiếng Anh: `feat:` / `fix:` / `chore:`.

## Non-goals (KHÔNG bao giờ đề xuất build)
- Sinh HACCP plan (nhường AuditBinder — tầng setup; ta là tầng vận hành)
- Tích hợp cảm biến Bluetooth/IoT · Multi-location cho chuỗi · ISO/SQF/BRC
- POS, inventory, đặt món, marketplace · Native app
- Phiên bản UK/Canada (US-only cho MVP; jurisdiction khác = backlog)
