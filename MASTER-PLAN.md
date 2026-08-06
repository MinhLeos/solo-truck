# MASTER-PLAN.md — Solo Truck: Context + Gate + Progress Tracker
*(Nguồn sự thật về tiến độ. Mỗi phiên một step; xong step tick ☑ + ghi Nhật ký. Cập nhật: 2026-08-05.)*

---

## 0. ⛔ GATE KÍCH HOẠT (đọc trước tiên, mọi phiên)

**🟢 GATE: MỞ (founder override 2026-08-06 — xem Nhật ký mục 5, lý do: có dev khác
cùng làm, không còn rút lực founder khỏi Solo Sitter).** Điều kiện mở gate tự nhiên bên
dưới CHƯA đạt qua Solo Sitter; gate được mở sớm theo đúng ngoại lệ founder-quyết-định.
Phase 1 trở đi được phép code từ đây.

Dự án này là **sản phẩm thứ hai**. Solo Sitter là mặt trận chính.

**Điều kiện mở gate tự nhiên (phải đạt CẢ HAI — không còn là điều kiện chặn, đã override):**
- [ ] Solo Sitter đạt ~$1-2K MRR HOẶC ≥50 khách trả phí ổn định 2 tháng liên tiếp
- [ ] Marketing Solo Sitter đã thành nhịp lặp không cần founder trực hàng ngày
  (outreach + content chạy theo lịch tuần, không cháy việc)

**Khi gate ĐÓNG, chỉ được làm các việc sau (Phase 0):** research, viết/refine docs,
theo dõi đối thủ, nói chuyện với food truck owner. KHÔNG code sản phẩm.

**Ngoại lệ duy nhất:** founder có thể quyết định mở gate sớm bằng cách ghi quyết định
+ lý do vào Nhật ký (mục 5). Claude không tự đề xuất điều này.

## 1. Sản phẩm trong 1 câu

Web app (PWA, offline-first) cho food truck độc lập tại Mỹ: **log tuân thủ hàng ngày
trong 30 giây** (nhiệt độ, checklist, corrective action, timestamp thật) và **Inspector
Mode** — một nút đưa toàn bộ hồ sơ 90 ngày cho thanh tra xem — thay thế sổ giấy kẹp
trên tủ lạnh, giá $19-29/tháng, đứng giữa AuditBinder ($47 một lần, sinh binder giấy)
và FoodDocs ($169+/tháng, cho chuỗi).

Vị trí thị trường 3 tầng (chi tiết + bằng chứng: `docs/EVIDENCE.md`):
```
Tầng setup (ngày 0)        : AuditBinder — $47-97 one-time  → đối tác tiềm năng, không phải địch
Tầng VẬN HÀNH MICRO (ta)   : TRỐNG — đây là chỗ đứng
Tầng vận hành SMB/chuỗi    : FoodDocs, Jolt, Operandio — $169+/mo
```

## 2. Tiến độ — PHASE & STEP TRACKER

### Phase 0 — Validation & chuẩn bị (LÀM ĐƯỢC KHI GATE ĐÓNG) *(file: `phases/phase-0-validation.md`)*
- [ ] 0.1 — Kiểm tra brand/domain (USPTO, Google, App Store, domain khả dụng)
- [ ] 0.2 — Nuôi cộng đồng: r/foodtrucks + 3 FB group, log 20 thread pain về inspection
- [ ] 0.3 — Phỏng vấn 10 food truck owner (câu hỏi trong phase file) → cập nhật EVIDENCE.md
- [ ] 0.4 — Xây danh sách 50 commissary (3 bang thí điểm) + 5 cuộc gọi thăm dò
- [ ] 0.5 — Landing page "coming soon" + waitlist (được phép code MỖI trang này)
- [ ] 0.6 — Watchlist đối thủ: review AuditBinder/FoodDocs pricing+changelog mỗi tháng

### Phase 1 — Nền móng *(file: `phases/phase-1-foundation.md`)* — CẦN GATE MỞ
- [x] 1.1 — Repo, CI, Supabase project, schema migration đầu (15 bảng, RLS từ ngày 0)
- [x] 1.2 — Auth magic link + onboarding wizard (setup truck + equipment trong 5 phút)
- [x] 1.3 — PWA offline-first shell (Serwist + IndexedDB queue, sync engine)

### Phase 2 — Core logging (trái tim sản phẩm) *(file: `phases/phase-2-core-logging.md`)*
- [ ] 2.1 — Temp log 30 giây (đọc SECURITY.md trước) — append-only + timestamp integrity
- [ ] 2.2 — Corrective action flow (vượt ngưỡng → bắt ghi hành động + ảnh)
- [ ] 2.3 — Pre-shift checklist 12 điểm + custom items
- [ ] 2.4 — Nhắc theo ca + streak

### Phase 3 — Inspector Mode & documents *(file: `phases/phase-3-inspector-mode.md`)*
- [ ] 3.1 — Document vault (permit, commissary agreement, cert — kèm nhắc hết hạn)
- [ ] 3.2 — Inspector Mode (đọc SECURITY.md trước): view 30/90 ngày + export PDF tại chỗ
- [ ] 3.3 — Weekly email digest cho owner

### Phase 4 — Billing & launch *(file: `phases/phase-4-billing-launch.md`)*
- [ ] 4.1 — MoR billing (copy module Solo Sitter) + trial 14 ngày tự quản
- [ ] 4.2 — Founding Trucks campaign (20 xe đầu, 3 tháng free đổi feedback)
- [ ] 4.3 — Launch checklist: cộng đồng + Product Hunt + SEO pages đầu tiên

### Phase 5 — Commissary channel *(file: `phases/phase-5-commissary.md`)* — SAU khi có ≥10 xe active
- [ ] 5.1 — Referral code cho commissary (hoa hồng 20% năm đầu)
- [ ] 5.2 — Commissary dashboard mini (đọc SECURITY.md — privacy dữ liệu xe)
- [ ] 5.3 — Outreach 50 commissary theo playbook trong MARKETING-PLAN.md

## 3. Định nghĩa "xong" của MVP
Một chủ food truck lạ: đăng ký → setup 5 phút → log được nhiệt độ NGAY CẢ KHI OFFLINE
→ bị nhắc khi quên → khi thanh tra đến, bấm 1 nút đưa hồ sơ 90 ngày → trả $19-29/tháng
sau trial mà không cần nói chuyện với founder.

## 4. Chỉ số theo dõi
```
waitlist → signup → ACTIVATED (log ≥3 ngày liên tiếp) → retained tuần 4 → paid sau trial
```
Activated = chỉ số quan trọng nhất. Mục tiêu 60 ngày sau launch: 15-20 Founding Trucks
active, ≥25% chuyển trả phí sau trial (cùng ngưỡng kiểm chứng WTP như Solo Sitter).

## 5. Nhật ký quyết định
*(Ngày + quyết định + lý do, mới nhất trên cùng)*

- 2026-08-06 — **Phase 1 xong (1.1+1.2+1.3 trong 1 phiên, ngoại lệ rule "mỗi phiên
  một step" — founder yêu cầu vì có dev khác chờ).** Quyết định kỹ thuật đáng chú ý:
  - **Serwist + Turbopack chạy được thật** (`@serwist/turbopack` 9.5.12) — khác Solo
    Sitter (đã defer Serwist vì lúc đó không tương thích Turbopack). Verify bằng
    `next build` thật: sinh `/serwist/sw.js` + 18 precache entries. Route Serwist
    chính thức (`app/serwist/[path]/route.ts` + `<SerwistProvider>`), không tự viết
    tay `public/sw.js` như Solo Sitter.
  - **Không có bảng `business_members`** (khác Solo Sitter): MVP Solo Truck chỉ
    single-owner (SECURITY.md §7 — staff dùng PIN, không có tài khoản riêng), nên
    `businesses.owner_id` là cột trực tiếp, RLS không cần function security-definer
    né đệ quy. Mở `business_members` thật là backlog nếu sau này cần multi-owner.
  - **Đếm lại bảng: 15, không phải 13** — "13" trong ARCHITECTURE.md gốc đếm nhầm
    số dòng diagram, đã sửa lại header.
  - **Wizard 3 bước lưu draft vào `sessionStorage`**, submit 1 lần duy nhất ở bước
    cuối qua 1 RPC `complete_onboarding()` (không phải per-step DB write) — chịu được
    refresh/mất mạng giữa chừng mà không cần schema "wizard progress" riêng.
  - **Offline sync KHÔNG dùng Background Sync API** (Safari/iOS chưa hỗ trợ, mà chủ
    xe dùng iPhone nhiều) — dùng 3 trigger tay: `online` event, `visibilitychange`,
    interval 30s.
  - Test thật (không chỉ mock): chạy `supabase start` local + pgTAP pass, và
    smoke-test bằng Playwright qua Mailpit thật — phát hiện + fix 1 bug thật: gọi
    `dispatch()` (từ `useActionState`) ngoài `startTransition` làm `redirect()` sau
    khi hoàn tất wizard không điều hướng được sang `/today` (React chỉ warn ở console,
    không throw — dễ bị bỏ sót nếu không test tay).
  - Supabase project CLOUD chưa tạo (founder tự tạo, chưa đưa credentials) — mọi thứ
    ở trên chạy trên `supabase start` local (Docker). `.env.local` (gitignored) đang
    trỏ vào local stack.
- 2026-08-06 — **Founder mở gate sớm (override mục 0)** dù điều kiện MRR/nhịp marketing
  của Solo Sitter chưa đạt. Lý do: có dev khác cùng làm Solo Truck, nên rủi ro gốc của
  gate (founder solo bị phân tán lực khỏi Solo Sitter) không còn áp dụng nguyên vẹn.
  Phase 1 (`phases/phase-1-foundation.md`) được phép bắt đầu từ hôm nay.
- 2026-08-05 — Khởi tạo bộ docs. Chốt vị trí "tầng vận hành micro" giữa AuditBinder và
  FoodDocs; chốt kênh commissary là kênh phân phối khác biệt (chưa đối thủ nào dùng);
  chốt gate kích hoạt phụ thuộc Solo Sitter. Nguồn: research 2026-08-05, xem EVIDENCE.md.
- 2026-08-05 — Chốt US-only cho MVP dù AuditBinder phủ US/UK/Canada: mỗi jurisdiction
  là một bộ ngưỡng nhiệt + kỳ vọng giấy tờ khác nhau; làm sâu một thị trường trước.
