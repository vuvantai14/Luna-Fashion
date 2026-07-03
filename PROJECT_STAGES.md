# Ni Sport Project Stages

## Usage Rule

Khi làm task mới, Codex phải đọc:

1. `AGENTS.md`
2. `PROJECT_STAGES.md`

Prompt nên bắt đầu bằng:

```text
Đọc AGENTS.md và PROJECT_STAGES.md trước. Làm đúng stage hiện tại. Không sửa ngoài phạm vi.
```

## Global Rules

- Không đổi package Java `com.lunafashion`.
- Không sửa Flyway migration đã applied.
- Nếu cần DB change mới thì tạo migration version tiếp theo.
- Không sửa backend khi task chỉ yêu cầu frontend.
- Không sửa frontend khi task chỉ yêu cầu backend.
- Không kết nối API thật khi task chỉ là polish UI.
- Không dùng lại tên Luna Fashion trong UI mới.
- Không dùng data fake/localStorage làm nguồn chính nếu API thật đã kết nối.
- Không cài framework mới nếu không được yêu cầu.
- Không redesign toàn bộ nếu task chỉ yêu cầu sửa/polish.

## Project Status Summary

### Stage 1: Backend setup

Status: DONE

Notes:

- Spring Boot backend đã chạy.
- Health API đã có.

### Stage 2: Common response/config/exception

Status: DONE

Notes:

- Có `ApiResponse`.
- Có `GlobalExceptionHandler`.
- Có custom exceptions.
- Có Swagger, CORS và config cơ bản.

### Stage 3: Entity + Repository + Database

Status: DONE

Notes:

- Có entity/repository cho user, category, product, cart, order, contact.
- Dữ liệu Ni Sport đã seed vào PostgreSQL.
- Database dùng `ni_sport`.

### Stage 4: Auth/JWT

Status: DONE

Notes:

- Register/login/auth/me hoạt động.
- Admin demo: `admin@nisport.com / 123456`.
- JWT Bearer token hoạt động.

### Stage 4.5: Rename concept to Ni Sport

Status: DONE

Notes:

- App display name đổi sang Ni Sport.
- Swagger/health/admin seed đổi sang Ni Sport.
- Package Java vẫn giữ `com.lunafashion`.

### Stage 5: Public Category + Product API

Status: DONE

Notes:

- Public categories API hoạt động.
- Public products API hoạt động.
- Product detail, slug, related hoạt động.
- Không token gọi product/category được 200.

### Stage 6: Admin Category/Product API

Status: DONE

Notes:

- Admin category/product API hoạt động.
- No token admin API trả 401.
- User thường gọi admin API trả 403.
- Admin gọi admin API trả 200.

### Stage 7: Cart API

Status: DONE

Notes:

- Cart API hoạt động.
- User token xem/thêm/sửa/xóa cart được.
- No token cart API trả 401.

### Stage 8: Order API

Status: DONE

Notes:

- User tạo order từ cart được.
- User xem list/detail order được.
- User hủy đơn `PENDING` được.
- Admin xem/cập nhật order được.
- Flyway đã apply V4.

### Stage 9: User Account API

Status: DONE

Notes:

- Profile API hoạt động.
- Change password hoạt động.
- Address API hoạt động.
- Flyway đã apply V5 nếu có address migration.

### Stage 10: Admin Dashboard API

Status: DONE

Notes:

- Dashboard summary/revenue/orders/top-products/recent-orders hoạt động.
- Chỉ `ADMIN` truy cập được.

### Stage 10.5: Frontend UI polish

Status: DONE

Notes:

- Frontend đã đổi concept sang Ni Sport.
- Đã cài skill UI UX Pro Max.
- UI đã được cải tiến theo hướng sport e-commerce.
- Vẫn cần polish thêm nếu còn lỗi hiển thị, ảnh, text hoặc responsive.

### Stage 11A: Connect Product + Category + Auth frontend

Status: DONE

Notes:

- Product list gọi backend.
- Category filter gọi backend.
- Product detail gọi backend.
- Login/register/auth/me/logout kết nối backend.
- Token lưu trong localStorage.
- Không lưu password.

### Stage 11B: Connect Cart + Checkout + Order frontend

Status: DONE

Notes:

- Cart frontend gọi backend.
- Add to cart gọi `POST /api/v1/cart/items`.
- Cart page gọi `GET /api/v1/cart`.
- Update quantity gọi `PUT /api/v1/cart/items/{itemId}`.
- Delete item gọi `DELETE /api/v1/cart/items/{itemId}`.
- Clear cart gọi `DELETE /api/v1/cart`.
- Checkout gọi `POST /api/v1/orders`.
- Orders page gọi `GET /api/v1/orders`.
- Order detail gọi `GET /api/v1/orders/{id}`.
- Cancel pending order gọi `PATCH /api/v1/orders/{id}/cancel`.
- Header cart count đã/đang cập nhật từ backend nếu UI có.
- Cart/order không dùng localStorage fake làm nguồn chính nữa.

### Stage 11B.1: Refactor frontend structure

Status: DONE

Notes:

- Frontend da duoc gom vao thu muc `frontend/`.
- `frontend/index.html` la file redirect sang `frontend/pages/index.html`.
- Trang chu that nam tai `frontend/pages/index.html`.
- `frontend/pages/checkout.html` redirect sang `frontend/pages/cart.html` de giu checkout flow hien co.
- Cac trang khach hang nam trong `frontend/pages/`.
- Trang admin hien co nam tai `frontend/admin/dashboard.html`.
- CSS nam trong `frontend/css/`.
- JavaScript nam trong `frontend/js/`.
- Assets nam trong `frontend/assets/`.
- Chay frontend bang Live Server tu `frontend/index.html`; file nay tu chuyen sang `pages/index.html`.
- API base URL van giu `http://localhost:8080/api/v1`.

### Stage 11B.5: Polish customer frontend before Admin

Status: CURRENT / RECOMMENDED NEXT

Goal:

- Hoàn thiện FE khách hàng trước khi làm Admin UI.

Tasks:

- Sửa ảnh sản phẩm chưa đúng shop bóng đá.
- Sửa text tiếng Việt mất dấu.
- Sửa layout cart/checkout.
- Sửa form giao hàng bị lệch.
- Đồng bộ product card.
- Kiểm tra product detail.
- Kiểm tra orders của tôi.
- Kiểm tra responsive mobile/tablet/desktop.

Important:

- Chỉ chỉnh frontend khách hàng.
- Không làm Admin UI.
- Không sửa backend nếu không cần.
- Không thay đổi API.
- Không quay về data fake.
- Không làm mất kết nối API đã hoàn thành ở 11A/11B.

### Stage 11C: Connect Account + Admin UI

Status: TODO

Goal:

- Kết nối account frontend và admin frontend với API backend.

Includes:

- Account/profile.
- Address.
- Admin guard.
- Admin dashboard.
- Admin categories.
- Admin products.
- Admin orders.

Important:

- Chỉ làm sau khi FE khách hàng đã ổn.
- Admin UI phải chặn user thường.
- No token vào admin phải bị chặn.
- Admin demo dùng `admin@nisport.com / 123456`.

### Stage 12: README + report + demo

Status: TODO

Goal:

- Hoàn thiện README, hướng dẫn chạy, tài khoản demo, ảnh minh họa, báo cáo đồ án.

Includes:

- Project overview.
- Tech stack.
- Features.
- Database.
- API summary.
- How to run backend.
- How to run frontend.
- Demo accounts.
- Screenshots.
- Known limitations.

## Current Priority

Ưu tiên hiện tại:

1. Test lại đầy đủ Stage 11B.
2. Polish FE khách hàng nếu UI còn lỗi.
3. Chuẩn hóa ảnh sản phẩm bóng đá.
4. Sau đó mới làm Stage 11C Admin UI.
5. Cuối cùng làm Stage 12 README/demo/report.

## Backend Quick Test Checklist

- `GET /api/v1/health` -> 200
- `GET /api/v1/products` no token -> 200
- `GET /api/v1/cart` no token -> 401
- `GET /api/v1/admin/categories` no token -> 401
- `GET /api/v1/admin/categories` user token -> 403
- `GET /api/v1/admin/categories` admin token -> 200

## Customer Frontend Quick Test Checklist

### Product/Auth

- Trang chủ hiển thị đúng Ni Sport.
- Trang sản phẩm load data backend.
- Category filter load backend.
- Product detail load đúng sản phẩm.
- Login/logout hoạt động.
- Register hoạt động.
- Token lưu đúng.
- Không lưu password.

### Cart

- Chưa login bấm thêm giỏ -> yêu cầu login.
- Login user -> thêm vào giỏ thành công.
- Cart page load backend.
- Tăng số lượng được.
- Giảm số lượng được.
- Xóa item được.
- Clear cart được.
- Tổng tiền đúng.

### Checkout/Order

- Checkout lấy cart từ backend.
- Form giao hàng không bị lệch.
- Tạo order thành công.
- Cart được clear sau khi tạo order nếu backend xử lý.
- Orders của tôi hiển thị đơn.
- Order detail hiển thị đúng.
- Hủy đơn `PENDING` được.

## UI Polish Checklist

- Không còn text Luna Fashion.
- Không còn category thời trang nữ.
- Không còn ảnh thời trang nữ nếu có ảnh bóng đá thay thế.
- Text tiếng Việt có dấu.
- Form không bị đè label/input.
- Product card đồng nhất.
- Mobile không tràn ngang.
- Button/hover/focus rõ.
- Header/search/cart/account không lệch.
- Cart/checkout/order nhìn gọn và dễ demo.

## Prompt Examples

### Continue Stage 11B.5

```text
Đọc AGENTS.md và PROJECT_STAGES.md trước.
Tiếp tục Stage 11B.5: polish FE khách hàng.
Chỉ sửa frontend khách hàng, không sửa backend, không làm admin.
Giữ kết nối API đã hoàn thành ở 11A/11B.
```

### Start Stage 11C

```text
Đọc AGENTS.md và PROJECT_STAGES.md trước.
Triển khai Stage 11C: kết nối Account + Admin UI với backend API.
Không sửa backend nếu không cần.
Không làm lại FE khách hàng.
Không phá kết nối Product/Auth/Cart/Order đã hoàn thành.
```

### Start Stage 12

```text
Đọc AGENTS.md và PROJECT_STAGES.md trước.
Triển khai Stage 12: hoàn thiện README, hướng dẫn chạy, tài khoản demo, ảnh minh họa và nội dung báo cáo/demo.
Không sửa code nếu không cần.
```
