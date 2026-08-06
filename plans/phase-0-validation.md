# phase-0-validation.md — Phase 0: Validation & chuẩn bị (chạy khi GATE ĐÓNG)

## Context của phase
Phase duy nhất được làm trước khi Solo Sitter đạt điều kiện gate (MASTER-PLAN mục 0).
Mục tiêu: đến ngày gate mở, ta khởi động với (a) 4 giả định trong EVIDENCE.md mục 6
đã có câu trả lời, (b) brand sạch, (c) waitlist ấm, (d) danh sách commissary sẵn.
KHÔNG code sản phẩm ở phase này (ngoại lệ duy nhất: landing page ở 0.5).
Ngân sách thời gian: 2-3 giờ/tuần — không hơn, để không rút máu Solo Sitter.

## Step 0.1 — Brand check
- Kiểm "Solo Truck" (và 2-3 phương án dự phòng): USPTO TESS, Google, App Store,
  domain .app/.com, Instagram handle. Ghi kết quả vào Nhật ký MASTER-PLAN.
- Nếu trùng/rủi ro: chọn tên khác TRƯỚC khi dùng ở bất cứ đâu public.
- DoD: [ ] bảng kết quả trong Nhật ký + brand chốt (hoặc danh sách chờ chốt).

## Step 0.2 — Nuôi cộng đồng + log pain
- Join r/foodtrucks + 3 FB group food truck lớn (ưu tiên theo 3 bang thí điểm).
- 30-60 phút/ngày: đọc, upvote, trả lời giúp thuần túy. KHÔNG nhắc sản phẩm.
- Ghi 20 thread về inspection/log/health dept vào `docs/EVIDENCE.md` (trích câu chữ
  thật của owner — dùng làm copy sau này).
- DoD: [ ] 20 thread đã log · [ ] tài khoản có karma/uy tín cơ bản.

## Step 0.3 — Phỏng vấn 10 owner + thu thập "ground truth" thanh tra

### 0.3a — Ground truth từ health department (làm TRƯỚC phỏng vấn, 1-2 buổi tối)
- Tra bản đồ FDA Food Code adoption (fda.gov) cho 3 bang thí điểm → ghi phiên bản
  (2013/2017/2022) + khác biệt ngưỡng nếu có vào EVIDENCE.md mục 2.
- Tải **mẫu biên bản thanh tra (inspection report form)** công khai của 3-5 hạt thí
  điểm từ website health department. Đối chiếu TỪNG TRƯỜNG trên form với 12 điểm
  checklist + các trường log của app: form hỏi mà app thiếu → thêm vào spec;
  app có mà không form nào hỏi → cắt. Đây là spec thật do chính "người chấm bài"
  viết — miễn phí và chính xác hơn mọi suy đoán.
- Lưu các form vào `docs/inspection-forms/{state}-{county}.pdf` + bảng đối chiếu
  vào EVIDENCE.md.

### 0.3b — Phỏng vấn 10 owner
Tuyển từ cộng đồng (DM sau khi đã tương tác) hoặc từ waitlist 0.5. 15-20 phút/cuộc.
Câu hỏi cốt lõi (đúng 4 giả định EVIDENCE.md mục 6):
1. Hiện anh/chị log nhiệt độ kiểu gì? Bao nhiêu lần/ngày? Ai làm?
2. Kể lần thanh tra gần nhất — họ hỏi gì đầu tiên? Có xem log không? Giấy hay số?
3. (Cho xem mock màn hình log 30 giây) Anh/chị có làm việc này 2-4 lần/ngày không?
   Điều gì làm anh/chị BỎ sau 1 tuần?
4. Có mong máy tự đo (sensor) không, hay nhập tay chấp nhận được?
5. $19/tháng — đắt, rẻ, hay vừa? So với gì?
6. Anh/chị có dùng commissary không? Quan hệ với chủ commissary thế nào — họ có bao
   giờ gợi ý công cụ/dịch vụ gì cho anh/chị chưa?
7. **"Cho tôi xem biên bản thanh tra gần nhất được không?"** — mỗi biên bản thật là
   một mẫu ground truth: hạt đó soi gì, chấm kiểu gì, chấp nhận log dạng nào.
   Lưu (che thông tin cá nhân) vào `docs/inspection-forms/real/`.
- DoD: [ ] 10 cuộc, note từng cuộc trong `docs/interviews/` · [ ] ≥3 biên bản thanh
  tra thật thu được · [ ] EVIDENCE.md mục 6 cập nhật câu trả lời · [ ] quyết định
  GO / PIVOT / KILL ghi vào Nhật ký.
  **Tiêu chí KILL rõ ràng:** ≥6/10 nói "chỉ dùng nếu có sensor tự động" → dừng, ngách
  này thuộc về mô hình hardware, không phải ta.

## Step 0.4 — Danh sách commissary + 5 call thăm dò
- Theo playbook MARKETING-PLAN mục 3 Bước 1-2. Chốt 3 bang thí điểm trước khi cào.
- Spreadsheet: tên, city/bang, contact, nguồn, ước lượng số xe, note call.
- DoD: [ ] 50 dòng · [ ] 5 cuộc call/email có phản hồi, kết quả ghi vào EVIDENCE.md
  mục 6 (giả định về quyền lực gợi ý của commissary).

## Step 0.5 — Landing page + waitlist (ngoại lệ được code)
- 1 trang duy nhất, tái dùng stack + component Solo Sitter: hero với định vị
  (MARKETING-PLAN mục 0), mock Inspector Mode, form email waitlist (lưu vào 1 bảng
  Supabase riêng biệt hoặc dùng form provider — KHÔNG dựng schema sản phẩm).
- DoD: [ ] live trên domain đã chốt · [ ] analytics đo signup · [ ] nguồn waitlist
  tag được (community/SEO/direct).

## Step 0.6 — Watchlist đối thủ (việc lặp hàng tháng)
- Mỗi đầu tháng, 15 phút: AuditBinder (pricing + blog + có ra subscription/logging
  chưa?), FoodDocs (pricing entry có hạ không?), App Store search "food truck temp log"
  (app mới nổi?). Ghi 3 dòng vào Nhật ký MASTER-PLAN.
- **Trigger cảnh báo:** AuditBinder ra daily-logging subscription → đánh giá lại toàn
  bộ trong 2 tuần (họ có SEO position + customer base sẵn).

## Sau khi xong phase
Tick các box Phase 0 trong MASTER-PLAN. Phase 1 chỉ bắt đầu khi: gate mở (MASTER-PLAN
mục 0) VÀ quyết định GO ở 0.3.
