# phase-3-inspector-mode.md — Phase 3: Inspector Mode & Documents

## Context của phase
⚠️ **ĐỌC `docs/SECURITY.md` mục 5-6 + mục 10 (disclaimer) TRƯỚC KHI CODE.**
Phase này build "khoảnh khắc bán hàng" của sản phẩm: thanh tra gõ cửa → owner bấm
1 nút → hồ sơ 90 ngày sạch đẹp trong tay. Đây cũng là asset marketing số 1 (demo
video 60s — MARKETING-PLAN mục 4). Mọi thứ ở phase này là READ-only trên dữ liệu
append-only của Phase 2 — không viết thêm business logic ghi nào ngoài documents.
**Phase XONG khi:** demo được trọn kịch bản "thanh tra đến" trên một điện thoại thật,
kể cả khi offline, và export được PDF tại chỗ.

## Step 3.1 — Document vault
- `/documents`: upload permit, commissary agreement, food manager cert... (ảnh/PDF)
  vào Storage private theo SECURITY.md mục 5. Mỗi document: loại (preset), `expires_at`
  tùy chọn.
- Badge trạng thái: xanh còn hạn / vàng <30 ngày / đỏ hết hạn. Reminder hết hạn qua
  hub notification của 2.4 (30 ngày + 7 ngày trước).
- Documents cache offline (đọc) — thanh tra đến lúc mất sóng vẫn mở được.
- DoD: [ ] upload/xem/soft-delete hoạt động · [ ] signed URL TTL 60s, không truy cập
  chéo business (test) · [ ] reminder hết hạn vào notifications_log.

## Step 3.2 — Inspector Mode
- `/inspector` (trong app, fullscreen): header tên truck + permit hiện hành → tab
  Logs (30/90 ngày, bảng: thời gian, equipment, °F, trong/vượt ngưỡng, CA đính kèm,
  cột "logged offline, synced later" khi lệch >15 phút — minh bạch theo SECURITY.md
  mục 3) → tab Checklists (runs) → tab Documents (còn hạn).
- KHÔNG hiển thị: streak/gamification, billing, settings (SECURITY.md mục 6).
- **Export PDF client-side** (pdf-lib, lazy-load): "Temperature & Compliance Report —
  [truck] — [range]", footer disclaimer đúng nguyên văn SECURITY.md mục 10. Nút
  "Print backup" (EVIDENCE.md: một số thanh tra vẫn muốn bản in).
- **Inspector link** `/i/[token]`: sinh token theo SECURITY.md mục 6 (TTL 24h, revoke,
  log mở, rate limit, noindex, 404 sạch). Server-rendered read-only.
- Toàn bộ Inspector Mode chạy offline từ cache (trừ sinh link mới).
- DoD: [ ] kịch bản demo end-to-end trên điện thoại thật, airplane mode: mở Inspector
  Mode → xem 90 ngày → export PDF · [ ] token test: hết hạn/revoke/sai đều 404 sạch ·
  [ ] disclaimer hiện ở cả màn hình lẫn PDF.

## Step 3.3 — Weekly digest
- Email thứ Hai (timezone truck): streak, số log tuần, CA đã xử lý, document sắp hết
  hạn, 1 dòng khích lệ. Qua hub notification, có unsubscribe riêng cho digest.
- Mục đích kép: giá trị cho owner + nhắc tồn tại của app với người log ít (chống churn).
- DoD: [ ] render đúng dữ liệu thật · [ ] log gửi + unsubscribe hoạt động.

## Sau khi xong phase
Tick Phase 3 + Nhật ký. **Quay demo video Inspector Mode 60s ngay khi 3.2 xong**
(MARKETING-PLAN mục 4) — đừng đợi hết phase. Tiếp: Phase 4.
