# AGENTS.md

## Project Overview

Project hiá»‡n táº¡i lĂ  **Ni Sport**.

Ni Sport lĂ  website bĂ¡n quáº§n Ă¡o bĂ³ng Ä‘Ă¡ vĂ  phá»¥ kiá»‡n bĂ³ng Ä‘Ă¡, gá»“m:

- Ăo bĂ³ng Ä‘Ă¡
- Quáº§n bĂ³ng Ä‘Ă¡
- Bá»™ Ä‘á»“ bĂ³ng Ä‘Ă¡
- Äá»“ táº­p bĂ³ng Ä‘Ă¡
- Phá»¥ kiá»‡n bĂ³ng Ä‘Ă¡

Project trÆ°á»›c Ä‘Ă¢y cĂ³ tĂªn Luna Fashion, nhÆ°ng hiá»‡n Ä‘Ă£ Ä‘á»•i concept sang Ni Sport. KhĂ´ng dĂ¹ng tĂªn Luna Fashion trong ná»™i dung hiá»ƒn thá»‹ má»›i, trá»« cĂ¡c migration cÅ© Ä‘Ă£ applied.

## Tech Stack

- Java 21
- Spring Boot 3
- Maven
- PostgreSQL
- Spring Security JWT
- Spring Data JPA
- Flyway
- Swagger/OpenAPI
- Lombok
- Bean Validation
- HTML/CSS/JavaScript frontend

## Project Structure

- `backend/`: backend Spring Boot.
- `frontend/`: frontend HTML/CSS/JavaScript tĩnh.
- `frontend/index.html`: file redirect sang `frontend/pages/index.html`.
- `frontend/pages/`: các trang khách hàng.
- `frontend/pages/index.html`: trang chủ thật.
- `frontend/admin/`: trang quản trị hiện có.
- `frontend/css/`: stylesheet frontend.
- `frontend/js/`: JavaScript frontend.
- `frontend/assets/`: hình ảnh và tài nguyên tĩnh.

Không sửa frontend nếu task không yêu cầu rõ ràng.

## Database Rules

- Database name: `ni_sport`.
- KhĂ´ng sá»­a migration Flyway Ä‘Ă£ applied nhÆ° `V1` hoáº·c `V3` Ä‘á»ƒ trĂ¡nh lá»—i checksum.
- Náº¿u cáº§n thay Ä‘á»•i database, táº¡o migration má»›i vá»›i version tiáº¿p theo.
- File SQL full náº¿u cĂ³ chá»‰ dĂ¹ng cho dev/reset thá»§ cĂ´ng.
- KhĂ´ng Ä‘Æ°a file SQL full vĂ o `src/main/resources/db/migration` náº¿u Flyway Ä‘Ă£ cháº¡y.

## Coding Rules

- KhĂ´ng Ä‘á»•i package Java `com.lunafashion`.
- KhĂ´ng tráº£ entity trá»±c tiáº¿p tá»« controller.
- LuĂ´n dĂ¹ng DTO cho API response.
- Response thĂ nh cĂ´ng dĂ¹ng `ApiResponse`.
- Lá»—i dĂ¹ng cĂ¡c exception sáºµn cĂ³ nhÆ° `BadRequestException`, `ResourceNotFoundException`, `UnauthorizedException`.
- KhĂ´ng dĂ¹ng `@Data` cho JPA entity.
- Tiá»n dĂ¹ng `BigDecimal`.
- Enum dĂ¹ng `@Enumerated(EnumType.STRING)`.
- Quan há»‡ entity dĂ¹ng `FetchType.LAZY`.
- Public product/category API khĂ´ng cáº§n JWT.
- Admin API pháº£i yĂªu cáº§u role `ADMIN`.
- KhĂ´ng phĂ¡ Auth/JWT khi lĂ m cĂ¡c giai Ä‘oáº¡n sau.

## Current Progress

- Stage 1: Backend setup - done.
- Stage 2: Common response/config/exception - done.
- Stage 3: Entity + Repository + Database - done.
- Stage 4: Auth/JWT - done.
- Stage 4.5: Rename display/project concept to Ni Sport - done.
- Next stage: Stage 5 Public Category + Product API.

## Commands

Run backend:

```bash
cd backend
mvn clean spring-boot:run
```

Run tests:

```bash
cd backend
mvn test
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

Health:

```http
GET http://localhost:8080/api/v1/health
```

Admin demo:

```text
admin@nisport.com / 123456
```

## Verification After Backend Changes

Sau má»—i láº§n chá»‰nh backend, cáº§n kiá»ƒm tra:

- `mvn test` pass.
- Backend cháº¡y Ä‘Æ°á»£c báº±ng `mvn clean spring-boot:run`.
- Health API cháº¡y Ä‘Æ°á»£c.
- Swagger má»Ÿ Ä‘Æ°á»£c.
- Login admin `admin@nisport.com / 123456` váº«n hoáº¡t Ä‘á»™ng.
- `/api/v1/auth/me` hoáº¡t Ä‘á»™ng vá»›i Bearer token.

## Output Rule

Sau khi hoĂ n thĂ nh task, luĂ´n bĂ¡o láº¡i:

- Files created.
- Files modified.
- Commands run.
- Test result.
- Endpoints cáº§n test thá»§ cĂ´ng.

