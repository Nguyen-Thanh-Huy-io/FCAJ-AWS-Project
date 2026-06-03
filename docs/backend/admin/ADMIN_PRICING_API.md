# Admin Pricing API Documentation

## Overview

API endpoints để quản lý giá (pricing plans) - chỉ dành cho ADMIN và OWNER roles.

## Base URL

```
/api/admin/pricing
```

## Authentication

Tất cả endpoints yêu cầu:

1. **Authentication**: Bearer token (JWT)
2. **Authorization**: Chỉ ADMIN hoặc OWNER role có quyền truy cập

Header:

```
Authorization: Bearer <access_token>
```

---

## Endpoints

### 1. Get All Pricing Plans

**GET** `/api/admin/pricing`

Lấy danh sách tất cả các gói định giá.

**Response (200):**

```json
{
  "message": "Pricing plans retrieved successfully",
  "data": {
    "plans": [
      {
        "id": "uuid",
        "name": "FREE",
        "price": {
          "amount": 0,
          "currency": "USD"
        },
        "billingCycle": "MONTHLY",
        "description": "Gói miễn phí",
        "isActive": true,
        "limits": {
          "maxBrands": 1,
          "maxSocialProfiles": 3,
          "maxPostsPerMonth": 10,
          "maxLivePlatforms": 1,
          "maxStreamQuality": "HD",
          "maxTeamSeats": 1,
          "allowCustomRoles": false,
          "allowApprovalWorkflow": false
        },
        "subscriptionCount": 1250,
        "createdAt": "2026-05-22T10:00:00Z"
      }
    ],
    "summary": {
      "totalPlans": 4,
      "activePlans": 3,
      "inactivePlans": 1,
      "totalSubscriptions": 5000
    }
  }
}
```

**Error (401):**

```json
{
  "message": "Authentication required"
}
```

---

### 2. Get Plan Details

**GET** `/api/admin/pricing/:planId`

Lấy chi tiết một gói định giá cụ thể với thống kê.

**Parameters:**

- `planId` (path, required): UUID của gói định giá

**Response (200):**

```json
{
  "message": "Plan details retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "PRO",
    "price": {
      "amount": 49,
      "currency": "USD"
    },
    "billingCycle": "MONTHLY",
    "description": "Gói chuyên nghiệp",
    "isActive": true,
    "limits": {
      "maxBrands": 10,
      "maxSocialProfiles": 50,
      "maxPostsPerMonth": 500,
      "maxLivePlatforms": 5,
      "maxStreamQuality": "4K",
      "maxTeamSeats": 10,
      "allowCustomRoles": true,
      "allowApprovalWorkflow": true
    },
    "subscriptionStats": {
      "total": 1200,
      "active": 1050,
      "expired": 100,
      "cancelled": 50,
      "subscriptions": [
        {
          "id": "sub-uuid",
          "userId": "user-uuid",
          "email": "user@example.com",
          "status": "ACTIVE"
        }
      ]
    },
    "createdAt": "2026-05-22T10:00:00Z"
  }
}
```

**Error (404):**

```json
{
  "message": "Plan not found"
}
```

---

### 3. Create New Plan

**POST** `/api/admin/pricing`

Tạo một gói định giá mới.

**Request Body:**

```json
{
  "name": "STARTER",
  "priceAmount": 19,
  "currency": "USD",
  "billingCycle": "MONTHLY",
  "description": "Gói khởi đầu",
  "planLimitId": "limit-uuid"
}
```

**Validation Rules:**

- `name` (required, string): Tên gói định giá (1-100 characters)
- `priceAmount` (required, number): Giá tháng/năm (≥ 0)
- `currency` (required, string): Mã tiền tệ (USD, EUR, GBP, etc.)
- `billingCycle` (required, enum): MONTHLY hoặc ANNUAL
- `description` (optional, string): Mô tả gói
- `planLimitId` (required, string): UUID của PlanLimit

**Response (201):**

```json
{
  "message": "Plan created successfully",
  "data": {
    "id": "new-uuid",
    "name": "STARTER",
    "price": {
      "amount": 19,
      "currency": "USD"
    },
    "billingCycle": "MONTHLY",
    "description": "Gói khởi đầu",
    "isActive": true,
    "limits": { ... },
    "createdAt": "2026-05-22T10:00:00Z"
  }
}
```

**Error (400):**

```json
{
  "message": "Validation error",
  "errors": {
    "name": "Plan name is required and cannot be empty"
  }
}
```

**Error (409):**

```json
{
  "message": "Plan \"STARTER\" for MONTHLY already exists"
}
```

---

### 4. Update Plan

**PATCH** `/api/admin/pricing/:planId`

Cập nhật thông tin gói định giá.

**Parameters:**

- `planId` (path, required): UUID của gói định giá

**Request Body (partial update):**

```json
{
  "priceAmount": 29,
  "description": "Gói khởi đầu nâng cấp",
  "isActive": true
}
```

**Allowed Fields:**

- `priceAmount` (number): Giá mới (≥ 0)
- `description` (string): Mô tả mới
- `isActive` (boolean): Trạng thái hoạt động
- `planLimitId` (string): UUID của PlanLimit mới

**Response (200):**

```json
{
  "message": "Plan updated successfully",
  "data": {
    "id": "uuid",
    "name": "STARTER",
    "price": {
      "amount": 29,
      "currency": "USD"
    },
    ...
  }
}
```

**Error (404):**

```json
{
  "message": "Plan not found"
}
```

---

### 5. Deactivate Plan

**DELETE** `/api/admin/pricing/:planId`

Vô hiệu hóa gói định giá (soft delete).

**Parameters:**

- `planId` (path, required): UUID của gói định giá

**Response (200):**

```json
{
  "message": "Plan deactivated successfully",
  "data": {
    "id": "uuid",
    "name": "OLD_PLAN",
    "isActive": false,
    ...
  }
}
```

**Error (404):**

```json
{
  "message": "Plan not found"
}
```

**Error (400):**

```json
{
  "message": "Plan is already deactivated"
}
```

---

### 6. Get Pricing Analytics

**GET** `/api/admin/pricing/analytics/revenue`

Lấy thống kê doanh thu và phân tích định giá.

**Response (200):**

```json
{
  "message": "Pricing analytics retrieved successfully",
  "data": {
    "monthlyRevenue": 45678.9,
    "annualRevenue": 123450.0,
    "subscriptionsByPlan": {
      "FREE": 5000,
      "STARTER": 2500,
      "PRO": 1200,
      "AGENCY": 300
    },
    "revenueByPlan": {
      "FREE": {
        "monthly": 0,
        "annual": 0
      },
      "STARTER": {
        "monthly": 47500,
        "annual": 570000
      },
      "PRO": {
        "monthly": 58800,
        "annual": 705600
      },
      "AGENCY": {
        "monthly": 15000,
        "annual": 180000
      }
    }
  }
}
```

---

## Error Responses

### 401 - Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 - Forbidden

```json
{
  "message": "Access denied. Only ADMIN, OWNER roles are allowed."
}
```

### 400 - Bad Request

```json
{
  "message": "Validation error",
  "errors": {
    "fieldName": "Error message"
  }
}
```

### 404 - Not Found

```json
{
  "message": "Plan not found"
}
```

### 409 - Conflict

```json
{
  "message": "Plan already exists"
}
```

### 500 - Server Error

```json
{
  "message": "Failed to retrieve pricing plans"
}
```

---

## Code Examples

### Get All Plans (cURL)

```bash
curl -X GET http://localhost:3000/api/admin/pricing \
  -H "Authorization: Bearer <token>"
```

### Create New Plan (cURL)

```bash
curl -X POST http://localhost:3000/api/admin/pricing \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "STARTER",
    "priceAmount": 19,
    "currency": "USD",
    "billingCycle": "MONTHLY",
    "description": "Gói khởi đầu",
    "planLimitId": "plan-limit-uuid"
  }'
```

### Update Plan (JavaScript/Fetch)

```javascript
const updatePlan = async (planId, updates) => {
  const response = await fetch(`/api/admin/pricing/${planId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update plan");
  }

  return response.json();
};

// Usage
await updatePlan("plan-uuid", {
  priceAmount: 29,
  description: "Updated description",
});
```

---

## Architecture

### Layers:

1. **Controller** (`pricing.controller.js`): HTTP request/response handling
2. **Service** (`pricing.service.js`): Business logic & validation
3. **Repository** (`plan.repository.js`, `plan-limit.repository.js`): Data access
4. **Middleware** (`pricing.validation.js`): Request validation

### Design Patterns Used:

- **Repository Pattern**: Abstraction của database access
- **Service Layer Pattern**: Business logic separation
- **Factory Pattern**: Implicit trong data formatting
- **SOLID Principles**:
  - Single Responsibility: Mỗi class một trách nhiệm
  - Open/Closed: Easy to extend
  - Dependency Injection: Services nhận dependencies

### Error Handling:

- Consistent error response format
- Proper HTTP status codes
- Validation before processing
- Meaningful error messages

---

## Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request succeeded                  |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Validation error          |
| 401  | Unauthorized - Missing/invalid token    |
| 403  | Forbidden - Insufficient permissions    |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Resource already exists      |
| 500  | Server Error - Internal server error    |
