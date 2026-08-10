# ARCHITECTURE.md — Solo Truck: Kiến trúc + Business Logic
*(Nguồn sự thật duy nhất về kiến trúc. Kiến trúc thay đổi: sửa file này TRƯỚC, code SAU. Cập nhật: 2026-08-05.)*

---

## 1. Sản phẩm trong 1 câu
Compliance logging hàng ngày cho food truck độc lập US: temp log 30 giây có timestamp
thật, corrective action bắt buộc khi vượt ngưỡng, pre-shift checklist, Inspector Mode.
Thay sổ giấy — không thay HACCP consultant, không thay FoodDocs.

## 2. Scope MVP — ĐÚNG 5 tính năng, không hơn
1. **Temp log 30 giây** — chọn thiết bị → nhập số → xong. Offline được. Append-only.
2. **Corrective action flow** — đọc vượt ngưỡng → bắt buộc ghi hành động khắc phục (+ảnh).
3. **Pre-shift checklist** — 12 điểm chuẩn (theo EVIDENCE.md) + item tùy chỉnh.
4. **Inspector Mode** — 1 nút: hồ sơ 30/90 ngày sạch đẹp + documents + export PDF.
5. **Nhắc theo ca + streak** — push/email nhắc log; chuỗi ngày liên tục hiển thị to.

Nguyên tắc thiết kế xuyên suốt: **người dùng đứng trong bếp nóng, một tay bẩn, sóng yếu.**
Mọi flow chính phải: xong ≤30 giây · bấm được bằng ngón cái một tay · chạy offline.

## 3. Nhân vật trong hệ thống
| Nhân vật | Là ai | Truy cập |
|---|---|---|
| Founder | Vận hành app, ở VN | Admin (sau), nhận tiền qua MoR |
| **Owner** | Chủ food truck — khách trả tiền | Email + password hoặc Google OAuth — tài khoản chính |
| Staff | Nhân viên xe (nếu có) | PIN 4 số trong app của owner (KHÔNG tài khoản riêng ở MVP — xe 1-3 người) |
| **Inspector** | Thanh tra y tế | KHÔNG tài khoản. Xem Inspector Mode trên máy của owner, hoặc link read-only có hạn |
| Commissary (Phase 5) | Chủ bếp trung tâm | Tài khoản riêng, chỉ thấy dữ liệu được owner cho phép |

## 4. Tech stack & lý do
| Tầng | Chọn | Vì sao |
|---|---|---|
| Framework | Next.js (App Router) + TS | Tái dùng playbook + code Solo Sitter |
| DB/Auth/Storage | Supabase (Postgres + RLS + Storage) | Như Solo Sitter; Storage cho ảnh CA + documents |
| **Offline** | Serwist + IndexedDB write-queue | KHÁC Solo Sitter: ở đây offline là tính năng LÕI, không phải cache đọc — xem mục 7 |
| Billing | MoR Dodo Payments (chốt Phase 4.1, cùng provider Solo Sitter), `src/lib/billing/` | Founder VN không dùng được Stripe |
| Email | Resend | Digest, nhắc, receipt |
| PDF export | Client-side (pdf-lib, lazy-load) | Inspector Mode export tại chỗ, không cần server |
| Deploy/Errors | Vercel + Sentry | Như Solo Sitter |

Cố tình KHÔNG dùng: native app, sensor/Bluetooth, backend riêng, Redis/queue, multi-tenant
phức tạp cho chuỗi.

## 5. Data model (18 bảng — thêm `staff` ở Phase 2.1: SECURITY.md mục 7 tả PIN
attribution nhưng bản 15-bảng ban đầu chưa có chỗ lưu staff+PIN; thêm
`rate_limit_hits` ở Phase 3.2 cho rate limit IP trên route public `/i/[token]`;
thêm `billing_webhook_events` ở Phase 4.1 — ledger idempotency cho webhook Dodo)
```
businesses ─┬─ trucks (MVP: 1 business = 1 truck; bảng riêng để mở đường Phase 5+)
            │    └─ pre_shift_reminder_minutes, temp_log_interval_minutes (cột trên
            │       trucks, cấu hình nhắc — Phase 2.4)
            ├─ staff (name + PIN 4 số — CHỈ để attribution, KHÔNG phải cơ chế bảo
            │    mật, SECURITY.md mục 7; PIN lưu plain, không hash)
            ├─ equipment (fridge/freezer/hot-hold: tên, loại, ngưỡng min/max °F)
            ├─ logs                ⚠ APPEND-ONLY (xem SECURITY.md)
            │    └─ corrective_actions (bắt buộc khi log vượt ngưỡng; ảnh trong
            │         Storage; FK theo logs.client_id — không phải logs.id — để
            │         CA tạo offline được cùng lúc với log của nó, xem Phase 2.2)
            ├─ checklists (12 item mặc định seed + custom) ── checklist_runs (mỗi ca,
            │    mỗi lần tick = 1 dòng snapshot mới — append-only, không UPDATE draft)
            ├─ shifts (khung giờ hoạt động → sinh reminder)
            ├─ documents (permit, commissary agreement, cert: file + expires_at)
            ├─ inspector_links (token read-only, TTL, revoke được)
            ├─ rate_limit_hits (route+ip+created_at — chặn brute-force token
            │    trên /i/[token]; không phải dữ liệu business, không RLS
            │    authenticated, chỉ admin client ghi/đọc)
            ├─ streaks (bảng chừa sẵn, CHƯA dùng — Phase 2.4 quyết định tính RUNTIME
            │    từ logs/checklist_runs, không materialize; xem BACKLOG.md nếu sau
            │    này chậm cần materialize)
            ├─ subscriptions (MoR — status/trial_ends_at/current_period_end,
            │    1 dòng/business, tạo tự động trong complete_onboarding())
            ├─ billing_webhook_events (ledger idempotency theo webhook-id của
            │    Dodo — không phải dữ liệu business, chỉ admin client)
            ├─ notifications_log (mọi thứ gửi đi đều log — bài học Solo Sitter)
            └─ commissaries + commissary_referrals (Phase 5; schema chừa sẵn, chưa dùng)
```
Quy tắc xuyên suốt (kế thừa Solo Sitter):
- Thời gian = timestamptz UTC; hiển thị theo timezone của truck.
- Nhiệt độ lưu số thập phân + đơn vị °F (US-only MVP); KHÔNG convert khi lưu.
- RLS mọi bảng theo business_id từ migration đầu tiên.
- Soft delete (`deleted_at`) cho bảng cấu hình (equipment, checklists, documents) —
  NHƯNG KHÔNG cho `logs`/`corrective_actions`/`checklist_runs`: các bảng này
  không xóa, không sửa (xem mục 6 và SECURITY.md).

## 6. Business logic cốt lõi (đọc kỹ — đây là "linh hồn" sản phẩm)

### 6.1 Log integrity — lý do tồn tại của sản phẩm
Bằng chứng thị trường (EVIDENCE.md): thanh tra bắt bài log giấy giả — "cột số 38°F đều
tăm tắp, điền 5 phút trước khi thanh tra đến". Log trung thực kèm corrective action QUA
thanh tra; log đẹp giả BỊ soi. Vậy giá trị bán = **tính không thể chối cãi của log**:
- `logs` là append-only: không UPDATE, không DELETE ở tầng ứng dụng LẪN tầng DB
  (revoke quyền, trigger chặn — chi tiết SECURITY.md).
- `recorded_at` = thời điểm user bấm lưu trên máy (kể cả offline); `synced_at` = lúc
  về server. Hiển thị cả hai trong Inspector Mode nếu lệch >15 phút — minh bạch,
  không giấu việc log offline.
- Nhập sai? Tạo log mới đánh dấu `supersedes_log_id` + lý do. Log cũ vẫn còn, gạch nhẹ.
  (Giống nguyên tắc sổ cái payments của Solo Sitter: sửa bằng bút ghi thêm, không tẩy.)

### 6.2 Ngưỡng & corrective action
- Mỗi equipment có ngưỡng theo chuẩn FDA Food Code mặc định: cold ≤41°F, hot ≥135°F,
  freezer ≤0°F — owner chỉnh được (một số hạt khác nhẹ), app ghi rõ "FDA default".
- Log vượt ngưỡng → UI chặn hoàn tất cho đến khi chọn corrective action (danh sách
  gợi ý: "moved food", "adjusted thermostat", "discarded items", "called repair" + free
  text + ảnh tùy chọn). CA gắn cứng vào log, cũng append-only.
- KHÔNG chặn kiểu trừng phạt: copy giọng khích lệ — "Inspectors respect honest logs
  with corrective actions." Sản phẩm dạy user rằng số xấu + hành động = tốt.

### 6.3 Checklist & shifts
- Seed 12 item chuẩn từ EVIDENCE.md (hand sink stocked, sanitizer + test strips, grey
  tank, raw-below-RTE, date labels...). Owner thêm/ẩn item.
- `shifts` định nghĩa khung giờ bán → reminder "pre-shift check" trước giờ mở X phút
  và "temp log" mỗi Y giờ trong ca. Ngoài ca: im lặng tuyệt đối (đừng phiền ngày nghỉ).

### 6.4 Inspector Mode
- Owner bấm 1 nút → màn hình read-only: logs 30/90 ngày dạng bảng sạch (kèm CA),
  checklist runs, documents còn hạn. Không sửa được gì từ màn hình này.
- Export PDF client-side tại chỗ (thanh tra có nơi vẫn muốn bản in — EVIDENCE.md).
- Tùy chọn: sinh `inspector_links` token read-only TTL 24h gửi email cho thanh tra.

### 6.5 Streak & digest
- Streak = số ngày-có-ca liên tiếp hoàn thành đủ log tối thiểu. Ngày không có ca
  không phá streak. Hiển thị to ở home — vừa động lực, vừa là "bằng chứng thói quen".
- Weekly digest email: streak, số log, CA đã xử lý, document sắp hết hạn.

### 6.6 Billing & trial (Phase 4.1)
- Trial 14 ngày mở tự động cho mọi business (trong RPC `complete_onboarding()`,
  không có code path nào tạo business mà thiếu dòng `subscriptions`).
- `hasWriteAccess()` tính runtime từ status/trial_ends_at/current_period_end —
  KHÔNG cron nào cần chạy đúng lúc hết hạn. Hết hạn/hết trial: khóa GHI MỚI
  (numpad, checklist tick, upload document, thêm staff) — KHÔNG khóa đọc/export/
  sync hàng đợi cũ (SECURITY.md mục 4, "không bắt dữ liệu làm con tin"). Offline
  flow (today/checklist) chặn ở client trước khi enqueue; flow online-only
  (documents, staff) chặn trong server action qua `checkWriteAccess()`.
- Webhook Dodo verify chữ ký (`standardwebhooks`) + idempotent theo
  `webhook-id` (bảng `billing_webhook_events`).

## 7. Offline-first (khác biệt kỹ thuật lớn nhất so với Solo Sitter)
Solo Sitter: offline = cache ĐỌC (lịch hôm nay). Solo Truck: offline = GHI là chính.
- Mọi write (log, CA, checklist tick) đi vào IndexedDB queue trước, UI xác nhận ngay
  (optimistic), background sync khi có mạng.
- Mỗi bản ghi sinh `client_id` (uuid) ở máy → sync idempotent, không duplicate khi retry.
- Xung đột: không có (append-only = không ai sửa chung một bản ghi). Đây là lý do
  kiến trúc append-only còn RẺ hơn về engineering, không chỉ đúng về pháp lý.
- Trạng thái sync hiển thị nhỏ, trung thực: "3 logs waiting to sync".

## 8. Bản đồ route
```
src/app/
├── (app)/                 # cần đăng nhập (owner)
│   ├── today/             # màn hình chính: equipment cards + nút log to + streak
│   ├── checklist/         # pre-shift run của hôm nay
│   ├── history/           # logs + CA + filter theo equipment/ngày
│   ├── documents/         # vault + expiry badges
│   ├── inspector/         # Inspector Mode (fullscreen, read-only)
│   └── settings/          # index + billing (trial/subscribe/manage) + staff PIN
├── i/[token]/             # PUBLIC read-only: inspector link (TTL) — server-rendered
├── founding-trucks/       # PUBLIC marketing: offer 3 tháng free đổi feedback (Phase 4.2)
├── tools/                 # PUBLIC, không DB (4 quy tắc SẮT — MARKETING-PLAN.md §2 kênh B):
│   ├── temp-danger-zone-checker/
│   └── inspection-readiness-quiz/
├── compare/               # PUBLIC, không DB: /auditbinder, /fooddocs (Phase 4.3)
├── login/ · auth/callback/ · setup/
└── api/webhooks/dodo/     # MoR webhook (verify chữ ký, idempotent, Phase 4.1)
```

## 9. Những gì file này KHÔNG quyết (xem file khác)
- Thứ tự build → `MASTER-PLAN.md` + `phases/phase-N-*.md`
- Bảo mật/integrity chi tiết → `docs/SECURITY.md`
- Bằng chứng thị trường → `docs/EVIDENCE.md`
- Kênh bán → `MARKETING-PLAN.md`
