# phase-1-foundation.md — Phase 1: Nền móng (CẦN GATE MỞ + GO từ 0.3)

## Context của phase
Dựng xương sống kỹ thuật: schema + RLS, auth + onboarding, và offline-first shell.
Offline shell làm NGAY ở phase nền (không phải "thêm sau") vì toàn bộ flow ghi của
Phase 2 xây trên queue này — làm sau = viết lại Phase 2.
Tái dùng tối đa từ repo Solo Sitter: cấu trúc project, UI components, auth flow,
billing module (chưa nối), code nén ảnh. Copy có chọn lọc, không fork nguyên repo.
**Phase XONG khi:** user đăng ký → setup truck 5 phút → thấy màn hình Today với
equipment cards (chưa log được — đó là Phase 2), và một write giả lập ghi được vào
IndexedDB queue rồi sync lên server khi có mạng.

## Step 1.1 — Repo, CI, schema đầu tiên
- Init repo theo cấu trúc Solo Sitter. CI: lint + typecheck + test trên PR.
- Migration đầu: đủ 13 bảng theo ARCHITECTURE.md mục 5, RLS bật TẤT CẢ ngay từ đây
  (kể cả bảng Phase 5 chưa dùng — schema chừa sẵn, quyền khóa chặt).
- CHƯA áp append-only grants (đó là migration mở đầu Phase 2, đi kèm test của nó) —
  nhưng ghi TODO trỏ tới SECURITY.md mục 2 ngay trong file migration này.
- Seed: 12 checklist items chuẩn (EVIDENCE.md mục 2), ngưỡng FDA mặc định cho 3 loại
  equipment.
- DoD: [ ] migration chạy sạch trên project mới · [ ] test RLS cơ bản (user A không
  đọc được business B) pass · [ ] commit `feat: initial schema with RLS`.

## Step 1.2 — Auth + onboarding wizard
- Magic link (copy flow Solo Sitter). Route map theo ARCHITECTURE.md mục 8.
- `/setup` wizard 3 bước, mục tiêu ≤5 phút:
  1. Truck: tên, city + state (→ timezone), loại (truck/trailer/cart).
  2. Equipment: thêm nhanh từ preset ("Fridge", "Freezer", "Hot hold") — mỗi cái 1 chạm,
     ngưỡng FDA tự điền, sửa được. Tối thiểu 1 equipment để hoàn tất.
  3. Shifts: chọn ngày bán + khung giờ (dùng cho reminder Phase 2.4; skip được).
- DoD: [ ] flow chạy trên mobile 375px · [ ] user mới đến được `/today` thấy equipment
  cards trống trạng thái "No log yet today".

## Step 1.3 — PWA offline-first shell
- Serwist: precache app shell; manifest + install prompt.
- Xây `src/lib/offline/`: IndexedDB write-queue theo SECURITY.md mục 4 —
  `enqueue(mutation)` → optimistic UI → background sync → xóa item sau khi server ack.
  `client_id` uuid sinh tại máy. Server endpoint upsert idempotent theo client_id.
- Cache đọc: dữ liệu `/today` (equipment + logs hôm nay) đọc được khi offline.
- Chỉ báo sync trung thực: "N items waiting to sync" + trạng thái online/offline.
- Test: [ ] tắt mạng → thực hiện write giả → bật mạng → xuất hiện trên server đúng
  1 lần (kể cả khi retry nhiều lần) · [ ] đóng tab giữa chừng → queue sống sót.
- DoD: [ ] các test trên pass · [ ] Lighthouse PWA installable.

## Sau khi xong phase
Tick Phase 1 trong MASTER-PLAN + Nhật ký (đặc biệt: quyết định nào khi build offline
queue — thứ tự sync, xử lý lỗi — đáng ghi lại). Tiếp: Phase 2, và ĐỌC SECURITY.md
mục 2-3-4 trước khi viết dòng code đầu tiên của nó.
