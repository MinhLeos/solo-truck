# phase-2-core-logging.md — Phase 2: Core logging (trái tim sản phẩm)

## Context của phase
⚠️ **ĐỌC `docs/SECURITY.md` mục 2-3-4 TRƯỚC KHI CODE BẤT CỨ STEP NÀO.**
Phase này build thứ khách trả tiền để có: log 30 giây, append-only, timestamp thật,
corrective action, checklist, reminder. Chuẩn thiết kế xuyên suốt (ARCHITECTURE mục 2):
người dùng đứng bếp nóng, một tay, sóng yếu — mọi flow ≤30 giây, thumb-reachable,
offline được. Mọi bảng ghi ở phase này là DỮ LIỆU PHÁP LÝ → test bắt buộc theo
CLAUDE.md quy tắc 6.
**Phase XONG khi:** một chủ xe log nhiệt độ cả tuần (kể cả offline), bị chặn đúng lúc
vượt ngưỡng cho tới khi ghi corrective action, chạy pre-shift checklist mỗi sáng, và
được nhắc đúng ca — không cần đọc hướng dẫn nào.

## Step 2.1 — Temp log 30 giây + append-only
- Migration mở đầu step: REVOKE UPDATE/DELETE + trigger chặn trên `logs` (SECURITY.md
  mục 2) — commit RIÊNG, kèm đủ 4 test bắt buộc liệt kê trong đó.
- UI `/today`: mỗi equipment 1 card → chạm card → numpad to (không bàn phím hệ thống),
  nhập số °F → Save. Optimistic qua offline queue (Phase 1.3). Card đổi trạng thái:
  ✓ xanh trong ngưỡng / ⚠ đỏ vượt ngưỡng (→ dẫn sang 2.2).
- `recorded_at` từ clock máy; server gắn `synced_at` + cờ `clock_skew` (SECURITY.md mục 3).
- Supersede flow: từ `/history`, "This was a mistake" → form log mới + lý do ≥5 ký tự,
  bản cũ gạch nhẹ, cả hai hiển thị.
- Staff PIN attribution (SECURITY.md mục 7): nếu owner đã thêm staff trong settings,
  màn save hỏi PIN → `logged_by`.
- DoD: [ ] log trong ≤3 chạm từ `/today` · [ ] 4 test append-only pass · [ ] offline
  log → sync đúng 1 lần · [ ] không tồn tại API path sửa/xóa log.

## Step 2.2 — Corrective action flow
- Log vượt ngưỡng → bottom sheet BẮT BUỘC trước khi hoàn tất: chọn action từ preset
  (moved food / adjusted thermostat / discarded items / called repair / other + text)
  + ảnh tùy chọn (nén client-side ~1600px, upload Storage theo SECURITY.md mục 5;
  offline: ảnh vào queue, upload khi có mạng).
- `corrective_actions` cũng append-only (cùng migration pattern 2.1).
- Copy giọng khích lệ (ARCHITECTURE 6.2): "Good catch. Inspectors respect honest logs
  with corrective actions." — KHÔNG giọng trừng phạt.
- DoD: [ ] không thể lưu log vượt ngưỡng mà không có CA · [ ] CA gắn đúng log, hiển thị
  cùng nhau trong history · [ ] test append-only cho CA pass.

## Step 2.3 — Pre-shift checklist
- `/checklist`: run của hôm nay từ 12 item seed + custom items (settings cho phép
  thêm/ẩn — bảng `checklists` soft-delete được, nhưng `checklist_runs` thì không).
- Mỗi item 1 chạm toggle; xong hết → màn "Ready to open ✓" (screenshot-able — chủ xe
  hay khoe, đây là viral loop nhỏ). Run dở dang lưu từng chạm (offline queue).
- DoD: [ ] run hoàn chỉnh <2 phút thao tác · [ ] custom item hoạt động · [ ] runs
  append-only + hiện trong Inspector Mode data (chuẩn bị cho 3.2).

## Step 2.4 — Reminder + streak
- Cron (Vercel) quét theo `shifts` + timezone của truck: push (nếu PWA cho phép) hoặc
  email — "Pre-shift check" trước giờ mở X phút; "Temp log" mỗi Y giờ trong ca
  (X, Y config trong settings, default 30 phút / 4 giờ). Ngoài ca: im lặng.
- Mọi lần gửi → `notifications_log` (kênh, template, trạng thái, lỗi) — bài học
  notification hỏng âm thầm từ đối thủ của Solo Sitter áp nguyên ở đây.
- Streak (ARCHITECTURE 6.5): ngày-có-ca hoàn thành đủ log tối thiểu; ngày không ca
  không phá streak. Quyết định materialized vs runtime tại đây → ghi Nhật ký.
- DoD: [ ] reminder bắn đúng giờ đúng timezone (test 2 timezone) · [ ] không reminder
  ngoài ca · [ ] streak đúng qua các case: ngày nghỉ, quên log, múi giờ đổi (DST).

## Sau khi xong phase
Tick Phase 2 + Nhật ký. Đây là mốc "product core done" — quay lại MARKETING-PLAN
mục 4: bắt đầu quay demo thô cho build-in-public. Tiếp: Phase 3 (đọc SECURITY.md
mục 5-6 trước).
