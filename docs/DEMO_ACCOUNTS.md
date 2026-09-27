# Tài khoản demo (giai đoạn mock)

> ⚠️ Chỉ dùng khi FE chạy với dữ liệu mock (`USE_MOCK = true` trong `src/services/*`).
> Khi BE hoàn thiện API, các tài khoản này **không còn hiệu lực** — xóa `src/mocks/auth.js` và cập nhật lại file này.

## Đăng nhập (`/login`)

Mật khẩu chung cho tất cả tài khoản: **`123456`**

| Vai trò          | Email                        | Số điện thoại | Vào cổng     |
| ---------------- | ---------------------------- | ------------- | ------------ |
| Phụ huynh        | `me.lanhuong@storyweaver.vn` | `0901234567`  | `/parent`    |
| Kiểm duyệt viên  | `kdv@storyweaver.vn`         | `0907654321`  | `/moderator` |
| Admin            | `admin@storyweaver.vn`       | `0909999999`  | `/admin`     |

- Đăng nhập được bằng **email hoặc số điện thoại** (nhận cả dạng `+84...`).
- Khi chạy `npm run dev`, dưới form đăng nhập có khung **"Tài khoản demo"** để điền nhanh (bản build production không có khung này).
- Muốn đổi tài khoản: bấm nút **Đăng xuất** ở khung hồ sơ cuối sidebar.

## Mã PIN phụ huynh — Chế độ Trẻ Em (`/kid`)

| Mục đích                                  | Mã PIN |
| ----------------------------------------- | ------ |
| Thoát Kid Mode qua nút "Bố Mẹ" / "Dành cho Ba Mẹ" | `1234` |

Khai báo tại `MOCK_PARENT_PIN` trong `src/mocks/kidStory.js`.

## Các trường hợp để test lỗi

| Màn hình                         | Nhập                           | Kết quả                                  |
| -------------------------------- | ------------------------------ | ---------------------------------------- |
| Đăng nhập                        | Sai mật khẩu                   | Báo "Email/Số điện thoại hoặc mật khẩu chưa đúng" |
| Landing – ô email đăng ký cuối trang | Email đuôi `@test.com`      | Báo "Email này đã được đăng ký"          |
| Kid Mode – cổng Ba Mẹ            | PIN khác `1234`                | Báo "Mã PIN chưa đúng"                   |

## Vị trí trong code

- Tài khoản đăng nhập: `src/mocks/auth.js`
- Logic đăng nhập mock: `src/services/authService.js`
- PIN Kid Mode: `src/mocks/kidStory.js`
