# Ni Sport

Ni Sport là website bán quần áo bóng đá và phụ kiện bóng đá. Project gồm frontend HTML/CSS/JavaScript tĩnh và backend Java Spring Boot kết nối PostgreSQL.

## Công nghệ sử dụng

- HTML5, CSS3, JavaScript ES6 Module
- Java 21, Spring Boot 3, Maven
- Spring Security JWT
- Spring Data JPA
- PostgreSQL database `ni_sport`
- Flyway migration
- Swagger/OpenAPI

## Cấu trúc thư mục

```text
nisport/
|-- backend/                 # Backend Spring Boot
|-- frontend/                # Frontend tĩnh chạy bằng Live Server
|   |-- index.html            # File redirect sang pages/index.html
|   |-- pages/                # Trang khách hàng
|   |   |-- index.html         # Trang chu that
|   |   |-- products.html
|   |   |-- product-detail.html
|   |   |-- cart.html
|   |   |-- orders.html
|   |   |-- checkout.html      # Redirect den cart/checkout hien co
|   |   |-- login.html
|   |   |-- register.html
|   |   |-- account.html
|   |   |-- collection.html
|   |   |-- contact.html
|   |   |-- brand.html
|   |   `-- sale.html
|   |-- admin/
|   |   `-- dashboard.html    # Trang quản trị hiện có
|   |-- css/                  # CSS dùng chung và theo trang
|   |-- js/                   # JavaScript ES6 module
|   `-- assets/               # Banner, ảnh danh mục, ảnh sản phẩm
|-- AGENTS.md
|-- PROJECT_STAGES.md
`-- BACKEND_DESIGN.md
```

## Chức năng chính

### Frontend khách hàng

- Trang chủ giới thiệu Ni Sport và sản phẩm nổi bật.
- Trang sản phẩm load category/product từ backend.
- Trang chi tiết sản phẩm load product detail, variants, ảnh và sản phẩm liên quan từ backend.
- Login/register/logout kết nối Auth API.
- Cart kết nối Cart API.
- Checkout COD tạo order qua Order API.
- Orders page hiển thị danh sách, chi tiết và hủy đơn `PENDING`.

### Frontend admin

- Trang admin hiện nằm tại `frontend/admin/dashboard.html`.
- UI admin hiện có dashboard, sản phẩm, đơn hàng và khách hàng.
- Admin demo: `admin@nisport.com / 123456`.

### Backend

- Health API.
- Auth/JWT.
- Public category/product API.
- Admin category/product/order/dashboard API.
- Cart API.
- Order API.
- Account/address API.

## Cách chạy backend

Yêu cầu PostgreSQL đã có database `ni_sport`.

```bash
cd backend
mvn clean spring-boot:run
```

Kiểm tra:

- Health: `http://localhost:8080/api/v1/health`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Cách chạy frontend

1. Mở project bằng Visual Studio Code.
2. Cài extension **Live Server** nếu chưa có.
3. Mở thư mục `frontend/`.
4. Bấm chuột phải vào `frontend/index.html`.
5. Chọn **Open with Live Server**.

Trang chính:

```text
frontend/index.html
```
`frontend/index.html` chi la file chuyen huong. Trang chu that nam tai:

```text
frontend/pages/index.html
```

Khi Live Server chay tu thu muc `frontend/`, cac trang su dung assets trong `frontend/assets/`.
Khi Live Server chạy từ thư mục `frontend/`, ảnh sản phẩm dạng `/assets/products/product-1.jpg` sẽ trỏ đúng tới `frontend/assets/products/product-1.jpg`.

## Ghi chú

- Backend API base URL hiện là `http://localhost:8080/api/v1`.
- Package Java vẫn giữ `com.lunafashion` để tránh lỗi import hàng loạt.
- Không sửa Flyway migration đã applied; nếu cần thay đổi database thì tạo migration version mới.
- Xem `PROJECT_STAGES.md` để biết tiến độ và stage hiện tại.
