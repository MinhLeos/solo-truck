# PRODUCT-WALKTHROUGH.md — Solo Truck: business, kiến trúc, full flow

*(Đọc file này để hiểu SẢN PHẨM đang làm gì và trải nghiệm nó từ đầu đến cuối. Chi
tiết kỹ thuật/quyết định thiết kế → `ARCHITECTURE.md`. Bằng chứng thị trường →
`EVIDENCE.md`. Tiến độ/gate → `MASTER-PLAN.md`. File này không lặp lại các file đó,
chỉ nối chúng thành một câu chuyện đi được từ đầu đến cuối.)*

---

## 1. Business trong 3 câu

Food truck độc lập ở Mỹ bị thanh tra y tế đột xuất, không báo trước. Thanh tra hỏi
giấy tờ và log nhiệt độ TRƯỚC KHI mở tủ lạnh ra xem — thiếu hoặc log giả (số đều tăm
tắp, điền 5 phút trước khi thanh tra tới) là điểm bị soi gắt nhất. **Solo Truck bán
"log không thể chối cãi"**: ghi 30 giây/lần, append-only (không sửa/xoá), corrective
action bắt buộc khi vượt ngưỡng — một log trung thực kèm hành động khắc phục QUA
thanh tra; một log đẹp giả bị phát hiện ngay.

**Khách hàng:** chủ xe độc lập, 1-3 người, tự vận hành — không phải chuỗi, không cần
sensor/IoT, không cần multi-location. **Mô hình:** subscription qua Merchant of
Record (Dodo Payments) — $24/tháng hoặc $190/năm (giá tạm, chưa có dữ liệu phỏng vấn
WTP thật, xem Nhật ký `MASTER-PLAN.md`), trial 14 ngày tự mở khi tạo tài khoản.
**Định vị 3 tầng cạnh tranh** (chi tiết `EVIDENCE.md` §3): AuditBinder bán binder
giấy 1 lần (setup, không recurring) → đối tác tiềm năng hơn là địch; FoodDocs quá đắt
($169+/mo) cho xe 1-3 người → Solo Truck nằm đúng khoảng trống giữa 2 tầng đó, làm
ĐÚNG MỘT việc: log hàng ngày inspector-ready cho mobile unit.

## 2. Kiến trúc trong 30 giây

Next.js App Router + Supabase (Postgres/Auth/Storage/RLS) + **PWA offline-first
(Serwist + IndexedDB)** — offline là tính năng LÕI vì food truck = hộp kim loại,
sóng yếu, log phải ghi được ngay cả không mạng rồi sync sau. Mọi bảng ghi log
(`logs`, `corrective_actions`, `checklist_runs`) là **append-only ở tầng DB**
(revoke UPDATE/DELETE + trigger chặn) — sai thì ghi thêm dòng mới đánh dấu
supersede, không sửa dòng cũ. Billing qua Dodo Payments (MoR, vì founder VN không
dùng Stripe trực tiếp được), webhook verify chữ ký + idempotent. Chi tiết đầy đủ:
`ARCHITECTURE.md` §4-8.

## 3. Full flow — đi từ đầu đến cuối như một owner thật

Đây là đường đi một chủ xe thật sẽ trải qua, đúng thứ tự UI hiện có (không phải mô
tả trừu tượng — mỗi bước dưới đây bấm được ngay trên app đang chạy).

### 3.1 Trước khi có tài khoản — marketing (public, không cần login)
- `/founding-trucks` — offer 3 tháng free đổi feedback cho 20 xe đầu, CTA mailto.
- `/tools/temp-danger-zone-checker`, `/tools/inspection-readiness-quiz` — 2 free
  tool không DB, không đăng nhập, CTA cuối trỏ về `/founding-trucks` (KHÔNG trỏ
  `/` — root luôn redirect `/today` rồi 401 khách vô danh, xem `middleware.ts`).
- `/compare/auditbinder`, `/compare/fooddocs` — SEO landing so sánh đối thủ.

### 3.2 Tạo tài khoản
- `/signup` — email + password (≥8 ký tự) hoặc "Continue with Google". Submit →
  luôn hiện "Check your email to confirm" (không lộ email đã tồn tại hay chưa).
- Click link xác nhận trong email → `/auth/callback` → exchange code → vì chưa có
  `trucks` row nào → redirect `/setup`.
- (Quên password sau này: `/auth/forgot-password` → email → `/auth/reset-password`.)

### 3.3 Onboarding wizard (`/setup`, 3 bước, mục tiêu ≤5 phút)
1. **Truck** — tên xe, city, state.
2. **Equipment** — chọn nhanh preset (Fridge ≤41°F / Hot hold ≥135°F / Freezer
   ≤0°F, theo FDA Food Code default) hoặc thêm custom, cần ≥1 thiết bị.
3. **Shifts** — chọn ngày bán trong tuần (hoặc bỏ qua) — dùng để tính reminder +
   streak sau này, ngày không có ca không phá streak.

Bấm **Finish** → RPC `complete_onboarding()` tạo `business` + `truck` + equipment +
seed 12 checklist item chuẩn (từ `EVIDENCE.md` §2) + subscription trial 14 ngày —
tất cả trong 1 transaction. Redirect `/today`.

### 3.4 Vòng lặp hàng ngày (giá trị lõi)
- **`/today`** — mỗi equipment là 1 card, tap mở numpad to (không dùng bàn phím hệ
  thống) → nhập số → Save.
  - Trong ngưỡng: log thẳng vào hàng đợi offline, card hiện ✓ + số vừa ghi.
  - **Vượt ngưỡng**: sheet corrective action MỞ RA CHẶN hoàn tất — chọn lý do
    (moved food / adjusted thermostat / discarded items / called repair) + text
    tự do + ảnh tuỳ chọn, KHÔNG trừng phạt, copy khích lệ "Inspectors respect
    honest logs with corrective actions". Card sau đó hiện ⚠.
  - Ghi offline được — hàng đợi IndexedDB tự sync khi có mạng lại (`<SyncStatus>`
    ở header).
- **`/checklist`** — chạy checklist pre-shift hôm nay, tap từng item; mỗi tap là
  1 dòng append-only mới (snapshot đầy đủ, không phải UPDATE 1 dòng draft).
- **`/history`** — log + CA theo ngày, filter theo equipment. Log nào "ghi nhầm"
  → nút mở form nhập lý do (≥5 ký tự) → tạo log mới `supersedes`, log cũ vẫn còn,
  gạch nhẹ (không xoá).

### 3.5 Documents & Inspector Mode
- **`/documents`** — upload permit / commissary agreement / food manager cert /
  insurance / other, kèm ngày hết hạn tuỳ chọn → nhắc khi sắp hết hạn.
- **`/inspector`** — 1 nút, màn hình read-only fullscreen: log 30/90 ngày (kèm CA),
  checklist runs, documents còn hạn — không sửa được gì từ đây. Export PDF tại
  chỗ (client-side, không cần server). Tuỳ chọn: sinh link `/i/[token]` public
  read-only TTL 24h gửi thanh tra qua email.

### 3.6 Billing
- Banner mềm xuất hiện khi trial gần hết / đã hết (`billingBannerFor()`), không
  chặn gì cho đến khi hết hạn thật.
- **`/settings/billing`** — Subscribe $24/mo hoặc $190/năm → checkout Dodo →
  webhook flip status → "Manage subscription" (customer portal) khi đã active.
- Hết hạn/hết trial: **chỉ khoá GHI MỚI** (numpad, tick checklist, upload
  document, thêm staff) — đọc/export/sync hàng đợi cũ LUÔN mở (nguyên tắc "không
  bắt dữ liệu làm con tin", `SECURITY.md` §4). Bị chặn → redirect thẳng
  `/settings/billing`.

### 3.7 Settings khác
- **`/settings/staff`** — PIN 4 số cho từng nhân viên (attribution, KHÔNG phải
  bảo mật — xe 1-3 người không cần tài khoản riêng).
- **`/settings/account`** — đổi password (bắt nhập password cũ) hoặc "set a
  password" nếu đang chỉ đăng nhập bằng Google.

## 4. Tự chạy full flow (dev, ~10 phút)

```bash
supabase start                 # local Postgres/Auth/Storage + Mailpit :54324
cp .env.example .env.local     # điền NEXT_PUBLIC_SUPABASE_URL/ANON_KEY,
                                # SUPABASE_SERVICE_ROLE từ `supabase status`
npm run dev             # đã có -p 3010 sẵn trong package.json
```
1. Mở `http://localhost:3010/signup`, tạo tài khoản.
2. Mở Mailpit (`http://127.0.0.1:54324`), lấy link xác nhận, click.
3. Hoàn thành wizard 3 bước → `/today`.
4. Tap 1 equipment card, nhập số **trong** ngưỡng → thấy ✓.
5. Tap card khác, nhập số **vượt** ngưỡng → sheet corrective action mở → điền →
   thấy ⚠.
6. `/checklist` → tick vài item.
7. `/history` → thấy cả 2 log vừa tạo; thử "This was a mistake" trên 1 log.
8. `/documents` → upload 1 file bất kỳ làm permit.
9. `/inspector` → xem log/checklist/document gộp lại, thử export PDF.
10. `/settings/billing` → thấy trial 14 ngày còn lại; thử bấm Subscribe (cần
    `BILLING_*` env thật để checkout Dodo chạy hết, xem `.env.example`).

Đi hết 10 bước này là đã chạm toàn bộ 5 tính năng MVP (`ARCHITECTURE.md` §2).

## 5. Câu hỏi thường gặp khi mới vào

- **Vì sao không sửa/xoá được log?** → §3.4 trên + `SECURITY.md` §2-3 — đây là
  giá trị bán, không phải thiếu sót UI.
- **Vì sao PWA quan trọng đến vậy?** → `ARCHITECTURE.md` §7 — bếp nóng, một tay
  bẩn, sóng yếu; offline không phải cache đọc, là core write path.
- **Vì sao billing tách client-gate và server-gate?** → §3.6 trên +
  `ARCHITECTURE.md` §6.6 — flow offline (today/checklist) phải chặn ở CLIENT
  trước khi enqueue, vì endpoint sync phải luôn mở để flush hàng đợi cũ; flow
  online-only (documents/staff) chặn trong server action.
- **Phase nào đang làm, phase nào xong?** → `MASTER-PLAN.md` §2 (tracker) + §5
  (Nhật ký — lý do đằng sau mỗi quyết định, không chỉ cái gì đã làm).
