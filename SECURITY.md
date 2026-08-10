# docs/SECURITY.md — Solo Truck: Bảo mật & Data Integrity
*(BẮT BUỘC đọc trước khi code Phase 2, 3, 4. Với sản phẩm này, integrity của log
KHÔNG phải yêu cầu bảo mật phụ — nó là chính giá trị bán. Cập nhật: 2026-08-05.)*

---

## 1. Mô hình đe dọa (threat model) — ai có động cơ làm gì

| Tác nhân | Động cơ | Ta chống bằng |
|---|---|---|
| Chính user (owner) | Sửa/xóa log xấu trước thanh tra ("làm đẹp hồ sơ") | Append-only ở tầng DB (mục 2) — kể cả ta cũng không sửa hộ được |
| Staff | Log khống cho nhanh ("điền đại 38°F") | Timestamp máy + pattern rõ ràng trong lịch sử; PIN riêng để phân biệt ai log |
| Kẻ ngoài | Xem hồ sơ tuân thủ / documents của xe khác | RLS theo business_id + Storage private + inspector_links TTL |
| Chính ta (bug) | Sync duplicate, mất log offline | client_id idempotent + queue bền (mục 4) |

Điểm triết lý quan trọng: **ta không "chống user gian lận" kiểu cảnh sát — ta làm cho
log trung thực TRỞ THÀNH lựa chọn dễ nhất và có lợi nhất.** App không tố cáo ai;
app chỉ đảm bảo những gì đã ghi là không thể chối cãi — chính điều đó làm hồ sơ của
user ĐÁNG TIN trước thanh tra, và đó là thứ họ trả tiền.

## 2. Append-only cho `logs`, `corrective_actions`, `checklist_runs` (Phase 2)

Thi hành ở BA tầng — thiếu một tầng coi như chưa làm:
1. **DB grants:** role của app chỉ có INSERT + SELECT trên 3 bảng này. Không UPDATE,
   không DELETE. Migration đầu tiên của Phase 2 phải chứa các REVOKE này.
2. **Trigger phòng thủ:** `BEFORE UPDATE OR DELETE` → RAISE EXCEPTION. Chống cả trường
   hợp ai đó sau này lỡ cấp lại quyền.
3. **Không API path nào** (server action / route handler) nhận id log để "sửa".
   Sửa sai = INSERT bản ghi mới với `supersedes_log_id` + `supersede_reason`
   (bắt buộc ≥5 ký tự). UI hiển thị cả hai, bản cũ gạch nhẹ. Bản mới cũng append-only.

Test bắt buộc (quy tắc 6 trong CLAUDE.md):
- [ ] UPDATE trực tiếp một log qua supabase client → phải fail
- [ ] DELETE → phải fail
- [ ] supersede flow tạo bản ghi mới, giữ nguyên bản cũ
- [ ] RLS: user A không SELECT được log của business B

## 3. Timestamp integrity (Phase 2)
- `recorded_at` = clock của thiết bị lúc bấm lưu (kể cả offline). `synced_at` = server
  time lúc nhận. Server KHÔNG tin `recorded_at` mù quáng: nếu `recorded_at` >
  `synced_at` + 5 phút (clock máy chỉnh về tương lai) → gắn cờ `clock_skew=true`.
- Inspector Mode hiển thị lệch >15 phút giữa hai mốc: "logged offline, synced later" —
  minh bạch là tính năng, không phải lỗi.
- KHÔNG cho backfill: form log không có date picker quá khứ. Quên log hôm qua = hôm qua
  trống. (Đau, nhưng chính điều này làm hồ sơ đáng tin — và làm reminder có giá trị.)

## 4. Offline queue integrity (Phase 1.3 + 2)
- Mỗi write sinh `client_id` uuid TẠI máy trước khi vào queue. Server upsert theo
  `client_id` → retry bao nhiêu lần cũng không duplicate.
- Queue nằm IndexedDB (sống sót đóng tab/restart). Chỉ xóa item khỏi queue SAU khi
  server xác nhận. Sync theo thứ tự thời gian.
- Nếu sync fail vĩnh viễn (vd bị 401 do hết hạn subscription): giữ item, hiển thị cảnh
  báo — KHÔNG lặng lẽ vứt dữ liệu của user. Hết hạn trả phí: khóa GHI mới, vẫn cho
  ĐỌC + export + sync nốt hàng đợi cũ (nguyên tắc "không bắt dữ liệu làm con tin" —
  kế thừa Solo Sitter).

## 5. `documents` & Storage (Phase 3.1)
- Bucket private. Đường dẫn: `{business_id}/documents/{uuid}`. Truy cập qua signed URL
  TTL ngắn (60s) sinh server-side sau khi check RLS.
- Ảnh corrective action: tương tự, `{business_id}/ca/{uuid}`, nén client-side ~1600px
  (tái dùng code nén ảnh visit report của Solo Sitter).
- Không lưu gì nhạy cảm hơn giấy phép kinh doanh — nhưng vẫn xử lý như nhạy cảm:
  permit chứa tên thật, địa chỉ, số giấy phép.

## 6. `inspector_links` (Phase 3.2)
- Token ≥32 bytes random, TTL mặc định 24h, owner revoke được, log mỗi lần mở
  (`opened_at`, IP) để owner biết. Trang `/i/[token]`: server-render, read-only tuyệt
  đối, `noindex`, rate limit theo IP, 404 sạch khi token sai/hết hạn (không phân biệt
  "sai" vs "hết hạn" ra ngoài).
- Inspector KHÔNG bao giờ thấy: billing, settings, dữ liệu xe khác, streak/gamification
  (chỉ dữ liệu tuân thủ nghiêm túc).

## 7. Staff PIN (Phase 2)
- MVP: staff dùng chung phiên đăng nhập của owner trên máy của xe, phân biệt bằng PIN
  4 số khi lưu log (`logged_by` = staff name). PIN KHÔNG phải cơ chế bảo mật — chỉ là
  attribution. Ghi rõ trong UI settings để owner không ngộ nhận.
- Tài khoản staff riêng thật sự = backlog (khi có khách xe >3 người yêu cầu).

## 8. Commissary dashboard (Phase 5.2) — privacy giữa các bên
- Commissary CHỈ thấy: danh sách xe đã opt-in qua referral của họ + trạng thái mức
  tổng quan ("active this week: yes/no", "agreement expires: date"). KHÔNG thấy: số
  nhiệt độ cụ thể, CA, documents của xe. Owner opt-out được bất cứ lúc nào.
- Mọi field lộ ra dashboard commissary phải liệt kê tường minh trong phase file 5.2
  và được đối chiếu lại file này. Mặc định là KHÔNG lộ.

## 9. Chuẩn chung (kế thừa Solo Sitter, áp nguyên)
- RLS mọi bảng từ migration đầu; test RLS như test logic.
- Webhook MoR: verify chữ ký + idempotent theo event id.
- Route public (`/i/`): rate limit IP, honeypot, không leak thông tin qua error.
- Export CSV/PDF toàn bộ dữ liệu từ MVP.
- Sentry không nhận PII trong breadcrumbs (scrub tên/email/số permit).
- **Đổi từ magic link sang email+password / Google OAuth (2026-08-10)** — magic
  link không hoạt động tốt trên PWA đã cài trên điện thoại: link mở ra browser
  ngoài thay vì trong app đã cài, session có khi không đồng bộ lại vào PWA
  (giống lý do Solo Sitter đã đổi trước đó). `/login`, `/signup`,
  `/auth/forgot-password` đều rate limit theo IP (bảng `rate_limit_hits`) và
  trả response giống hệt nhau dù email có tồn tại hay không (anti-enumeration).

## 10. Disclaimer pháp lý (bắt buộc, Phase 3.2 + landing)
App là công cụ ghi chép, KHÔNG phải tư vấn pháp lý/food-safety, không đảm bảo qua
thanh tra. Ngưỡng mặc định theo FDA Food Code; quy định thực tế theo hạt/bang —
"Verify with your local health authority." Hiển thị ở footer Inspector Mode + Terms.
