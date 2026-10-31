# Trả lời câu hỏi bổ sung — Buổi 7 BookStore

Họ tên: Nguyễn Minh Thành · MSSV: 23714141

## 1. Cấu trúc điều hướng
BookDetail được đăng ký ở Stack nên khi mở nó phủ lên cả Tab Bar và tự có nút ← quay về. Nếu đặt BookDetail vào Tab thì nó thành một tab riêng: Tab Bar vẫn hiện, không có nút quay lại, và Tab Bar có thêm một mục "Chi tiết" không hợp lý.

## 2. Redux
Redux Toolkit dùng Immer: khi viết state.items.push(...) ta sửa trên một bản nháp, Immer tự tạo ra state mới bất biến nên state gốc không bị sửa trực tiếp. Bỏ useMemo thì tổng vẫn hiển thị đúng vì được tính lại từ items. Hậu quả chỉ là hiệu năng: mỗi lần render, reduce chạy lại dù items không đổi, giỏ càng lớn càng tốn.

## 3. Promise.all
Promise.all lỗi cả nhóm nếu một request lỗi, nên Home hiện ErrorView dù getBooks() đã thành công. Dùng Promise.allSettled thì hai kết quả trả về riêng, vẫn hiện được danh sách sách và chỉ thiếu chip danh mục. Đánh đổi là phải tự kiểm tra từng kết quả (fulfilled hay rejected), tự quyết định hiển thị khi thiếu một phần dữ liệu, và code dài hơn.

## 4. Debounce
Nếu đặt setTimeout thẳng trong onChangeText thì mỗi phím gõ vẫn tạo một timer riêng không bị huỷ, nên gõ 10 ký tự vẫn lọc 10 lần (chỉ trễ chứ không gộp lại). Hàm dọn dẹp return () => clearTimeout(t) huỷ timer cũ mỗi khi value đổi, nên chỉ lần gõ cuối được áp dụng. Nó còn tránh cập nhật state sau khi component đã bị gỡ (unmount).

## 5. Code bổ sung: sắp xếp theo giá
Đã làm

## Thử thách
Giao diện chỉ gọi useWishlist() ở store/hooks.ts (adapter), không import Redux, useDispatch hay useSelector trực tiếp. Nếu sau này đổi Redux sang Zustand/Recoil, chỉ phải viết lại bên trong useWishlist() (giữ nguyên tên ids, isFavorite, toggle), còn mọi màn hình như BookDetailScreen không phải sửa dòng nào.