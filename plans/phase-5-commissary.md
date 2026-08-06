# phase-5-commissary.md — Phase 5: Kênh Commissary (mở khi ≥10 xe active)

## Context của phase
Kích hoạt tài sản chiến lược: kênh phân phối qua commissary — nơi food truck bị luật
bắt ghé hàng ngày, 1 commissary = 20-50 xe, chưa đối thủ nào đứng (EVIDENCE.md mục 4,
playbook MARKETING-PLAN mục 3). Phase này có cả build (referral + dashboard) lẫn bán
(outreach 50 commissary từ danh sách 0.4).
⚠️ Đọc `docs/SECURITY.md` mục 8 trước 5.2 — privacy giữa commissary và xe là ranh
giới cứng: mặc định KHÔNG lộ, owner opt-out được mọi lúc.
Điều kiện mở: ≥10 xe active (bằng chứng để pitch) + kết quả 5 call thăm dò ở 0.4
không phủ định giả định "commissary có quyền lực gợi ý".
**Phase XONG khi:** ≥5 commissary ký đối tác, ≥15 xe đăng ký qua mã referral, và
CAC kênh này đo được để so với kênh cộng đồng.

## Step 5.1 — Referral system
- Bảng `commissaries` + `commissary_referrals` (schema đã chừa từ 1.1): mã referral
  duy nhất/commissary, gắn vào signup, hoa hồng 20% năm đầu tính trên số MoR thực thu.
- Trang signup nhận `?ref=` → hiển thị "Referred by [commissary]" → lưu attribution.
- Trả hoa hồng: THỦ CÔNG hàng quý ở MVP (PayPal/check) — ghi sổ trong bảng, KHÔNG
  build payout tự động (BACKLOG). Đơn giản, minh bạch, đúng quy mô.
- DoD: [ ] attribution đúng qua funnel đầy đủ · [ ] báo cáo "commissary X: N signups,
  M paid, hoa hồng $Y" chạy được · [ ] điều khoản chương trình 1 trang public.

## Step 5.2 — Commissary dashboard mini
- Tài khoản commissary (magic link, role riêng): thấy DUY NHẤT các field liệt kê sau —
  danh sách xe opt-in qua mã của họ · trạng thái "active this week: yes/no" ·
  "commissary agreement expires: [date]" (nếu xe upload document loại này) · tổng
  hoa hồng. HẾT. Không nhiệt độ, không CA, không documents khác (SECURITY.md mục 8).
- Phía owner: settings có mục "Sharing with your commissary" hiển thị đúng những gì
  bị lộ + nút opt-out 1 chạm.
- Giá trị bán cho commissary (ngoài hoa hồng): biết agreement xe nào sắp hết hạn =
  bớt việc nhắc thủ công + đỡ rủi ro khi chính commissary bị thanh tra.
- DoD: [ ] test cứng: tài khoản commissary query mọi bảng khác đều bị RLS chặn ·
  [ ] opt-out có hiệu lực ngay · [ ] mọi field lộ ra khớp danh sách trên (review chéo
  với SECURITY.md mục 8 trước khi merge).

## Step 5.3 — Outreach 50 commissary
- Nâng cấp danh sách 0.4 (kiểm contact còn sống, thêm nếu hụt). Lịch: 2 buổi tối
  VN/tuần (= giờ hành chính Mỹ), 5-8 contact/buổi, email trước + call follow-up.
- Pitch 90 giây: "N xe tại khu vực anh/chị đang dùng app để qua thanh tra dễ hơn.
  Miễn phí cho anh/chị: dashboard xem xe nào còn agreement hiệu lực. Mỗi xe đăng ký
  qua mã của anh/chị: hoa hồng 20% năm đầu. Việc của anh/chị: dán poster này cạnh
  trạm xả nước." + case study Founding Trucks (MARKETING-PLAN mục 4).
- Vật phẩm: poster A4 + QR (in qua dịch vụ US, ship thẳng — không gửi từ VN) + PDF
  one-pager đính kèm email.
- Tracking trong spreadsheet 0.4: contacted / replied / signed / trucks referred.
- DoD: [ ] 50 contact đã chạm · [ ] ≥5 ký · [ ] ≥15 xe qua referral · [ ] số liệu +
  bài học ghi Nhật ký (kênh này ăn hay không quyết định chiến lược scale năm sau).

## Sau khi xong phase
Tick Phase 5 + Nhật ký. Đến đây MVP + kênh khác biệt đã hoàn chỉnh — mọi hướng tiếp
theo (jurisdiction UK/CA, sensor, multi-truck, staff accounts, AuditBinder partnership)
nằm ở `docs/BACKLOG.md` và chỉ mở bằng quyết định có ghi Nhật ký, dựa trên dữ liệu
retention/churn thật.
