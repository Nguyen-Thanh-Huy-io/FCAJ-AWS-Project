# Admin Pricing Backend Architecture

## 📋 Overview

Backend implementation cho Admin Pricing Management (`/admin/pricing`) tuân theo **SOLID principles** và sử dụng các **design patterns** hợp lý để đảm bảo code quality, maintainability, và scalability.

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────┐
│           HTTP Request/Response                  │
│          (Express Routes & Middleware)           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Pricing Controller Layer                 │
│  (pricing.controller.js)                         │
│  - Handle HTTP requests                          │
│  - Format HTTP responses                         │
│  - Call service methods                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Pricing Service Layer                    │
│  (pricing.service.js)                            │
│  - Business logic                                │
│  - Validation rules                              │
│  - Data transformation                           │
│  - Error handling                                │
└─────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────┬──────────────────────┐
│   Plan Repository        │  PlanLimit Repository│
│  (plan.repository.js)    │ (plan-limit.repo.js) │
│  - Database queries      │  - Database queries  │
│  - CRUD operations       │  - CRUD operations   │
└──────────────────────────┴──────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Prisma ORM & MySQL Database              │
└─────────────────────────────────────────────────┘
```

---

## 🔐 SOLID Principles Implementation

### 1. **Single Responsibility Principle (SRP)**

Mỗi class chỉ có **một lý do duy nhất để thay đổi**.

**Examples:**

- ✅ `PlanRepository`: Chỉ xử lý database queries
- ✅ `PricingService`: Chỉ xử lý business logic
- ✅ `PricingController`: Chỉ xử lý HTTP request/response
- ✅ `pricing.validation`: Chỉ validate request data

```javascript
// ❌ Bad: Multiple responsibilities
class PlanManager {
  async getPlan(id) {
    /* fetch from DB */
  }
  async validatePrice(price) {
    /* validation */
  }
  async sendResponse(res, data) {
    /* HTTP */
  }
}

// ✅ Good: Single responsibility
class PlanRepository {
  async findById(id) {
    /* fetch from DB */
  }
}

class PricingService {
  validatePrice(price) {
    /* validation */
  }
}

class PricingController {
  async getPlanDetails(req, res) {
    /* HTTP */
  }
}
```

---

### 2. **Open/Closed Principle (OCP)**

Classes **mở để mở rộng**, nhưng **đóng để sửa đổi**.

**Examples:**

- ✅ Service dễ dàng thêm pricing strategy mới (ví dụ: discount, tax calculation)
- ✅ Repository dễ dàng thêm query methods mới
- ✅ Middleware có thể extended cho thêm validations

```javascript
// ✅ Open for extension, closed for modification
class PricingService {
  // Dễ thêm method mới mà không modify code cũ
  async calculatePricingWithDiscount(planId, discountCode) {}
  async calculateTax(amount, country) {}
}
```

---

### 3. **Liskov Substitution Principle (LSP)**

Objects của class con có thể thay thế objects của class cha.

**Example:**

- ✅ Repository methods có consistent return types
- ✅ Service methods return formatted responses
- ✅ Middleware can be chained without issues

```javascript
// ✅ Consistent interface
class PlanRepository {
  async findAll() {
    return plans;
  } // Returns array
  async findById(id) {
    return plan;
  } // Returns object
}

// ✅ Can be used interchangeably
const plan = await repository.findById(id);
const plans = await repository.findAll();
```

---

### 4. **Interface Segregation Principle (ISP)**

Clients không nên depend trên interfaces họ không dùng.

**Examples:**

- ✅ Repository chỉ expose các methods liên quan tới data access
- ✅ Service chỉ expose business logic methods
- ✅ Validation middleware chỉ validate relevant fields

```javascript
// ✅ Segregated, focused interface
class PlanRepository {
  // Data access methods only
  async findAll() {}
  async findById(id) {}
  async create(data) {}
  async update(id, data) {}
}

// ❌ Mixed responsibilities
class PlanRepository {
  async findAll() {}
  async validatePrice() {} // Not data access!
  async sendEmail() {} // Not data access!
}
```

---

### 5. **Dependency Inversion Principle (DIP)**

High-level modules không nên depend trên low-level modules. **Both depend on abstractions**.

**Example:**

- ✅ Controller inject Service (abstraction)
- ✅ Service inject Repository (abstraction)
- ✅ No hard dependencies on implementations

```javascript
// ✅ Dependency Injection
class PricingController {
  constructor(pricingService) {
    this.service = pricingService; // Injected dependency
  }
}

// ✅ Service receives repository
const pricingService = {
  async getPricingPlans() {
    const plans = await planRepository.findAll(); // Using abstraction
    return this._formatPlans(plans);
  },
};

// ❌ Hard dependency (Bad)
class PricingService {
  async getPricingPlans() {
    const db = new PrismaClient(); // Hard dependency!
    const plans = await db.plan.findMany();
  }
}
```

---

## 🎯 Design Patterns Used

### 1. **Repository Pattern**

**Purpose**: Abstraction của data access logic

```
User Code → Service → Repository → Database
```

**Benefits:**

- ✅ Centralized data access
- ✅ Easy to mock for testing
- ✅ Can switch database without changing service

**Implementation:**

```javascript
// Repository: Abstract data access
class PlanRepository {
  async findAll() {
    /* DB query */
  }
  async findById(id) {
    /* DB query */
  }
  async create(data) {
    /* DB mutation */
  }
}

// Service: Uses repository without knowing DB details
class PricingService {
  async getAllPricingPlans() {
    const plans = await planRepository.findAll();
    return plans.map((p) => this._formatPlan(p));
  }
}
```

---

### 2. **Service Layer Pattern**

**Purpose**: Encapsulate business logic

```
Controller → Service (Business Logic) → Repository
```

**Benefits:**

- ✅ Centralized business rules
- ✅ Reusable across endpoints
- ✅ Easy to test

**Implementation:**

```javascript
// Service encapsulates business logic
class PricingService {
  async createPlan(planData) {
    // Validation
    this._validatePlanData(planData);

    // Business rules
    const existingPlan = await planRepository.findByNameAndCycle(...);
    if (existingPlan) throw new Error('Already exists');

    // Creation
    return planRepository.create(planData);
  }
}

// Controller just calls service
class PricingController {
  async createPlan(req, res) {
    const plan = await pricingService.createPlan(req.body);
    res.json(plan);
  }
}
```

---

### 3. **Factory Pattern (Implicit)**

**Purpose**: Create and format objects

**Implementation:**

```javascript
// Service has private factory method
class PricingService {
  _formatPlanResponse(plan) {
    return {
      id: plan.id,
      name: plan.name,
      price: { amount: parseFloat(plan.priceAmount), currency: plan.currency },
      // ... other fields
    };
  }
}
```

---

### 4. **Middleware Pattern**

**Purpose**: Cross-cutting concerns (validation, auth, etc.)

```javascript
// Validation middleware
const validatePlanData = (req, res, next) => {
  const { name, priceAmount } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });
  if (priceAmount < 0)
    return res.status(400).json({ message: "Invalid price" });

  next(); // Pass to next middleware/handler
};

// Applied in routes
router.post("/", validatePlanData, controller.createPlan);
```

---

## 📁 File Structure

```
backend/src/
├── controllers/
│   └── pricing.controller.js          # HTTP handlers
├── services/
│   └── pricing.service.js             # Business logic
├── repositories/
│   ├── plan.repository.js             # Plan data access
│   └── plan-limit.repository.js       # PlanLimit data access
├── routes/
│   └── pricing.routes.js              # Route definitions
├── middlewares/
│   └── pricing.validation.js          # Request validation
└── docs/
    └── ADMIN_PRICING_API.md           # API documentation
```

---

## 🔄 Request Flow Example

### Example: Create New Plan

```
1. HTTP Request
   POST /api/admin/pricing
   { name: "STARTER", priceAmount: 19, ... }
              ↓
2. Middleware Chain
   - verifyAuth (authentication)
   - authorize (check ADMIN/OWNER role)
   - validatePlanData (validate request body)
              ↓
3. Controller
   pricingController.createPlan(req, res)
   - Extract data from req.body
   - Call service method
              ↓
4. Service
   pricingService.createPlan(planData)
   - Validate input (_validatePlanData)
   - Check if plan exists
   - Verify PlanLimit exists
   - Call repository
   - Format response (_formatPlanResponse)
              ↓
5. Repository
   planRepository.create(data)
   - Execute Prisma query
   - Return created plan from DB
              ↓
6. Controller Response
   res.status(201).json({ data: formattedPlan })
              ↓
7. HTTP Response
   201 Created
   { id: "uuid", name: "STARTER", ... }
```

---

## ✅ Best Practices Applied

### Error Handling

```javascript
// Consistent error handling
try {
  const plan = await service.createPlan(data);
  res.json(plan);
} catch (error) {
  const status = error.status || 500;
  res.status(status).json({ message: error.message });
}
```

### Validation

```javascript
// Multi-layer validation
1. Middleware: validatePlanData (req structure)
2. Service: _validatePlanData (business rules)
3. Database: unique constraints, foreign keys
```

### Data Formatting

```javascript
// Always format data before returning
class PricingService {
  _formatPlanResponse(plan) {
    return {
      id: plan.id,
      price: { amount: parseFloat(plan.priceAmount), currency: plan.currency },
      // Transform DB format to API format
    };
  }
}
```

---

## 🚀 Scalability

### Easy to Extend:

- ✅ Add new pricing strategies (subscription, usage-based, etc.)
- ✅ Add new validation rules
- ✅ Add new analytics endpoints
- ✅ Switch to different database

### Without Modifying Existing Code:

```javascript
// Future: Add discount pricing
class PricingService {
  async calculateFinalPrice(planId, discountCode) {
    const plan = await planRepository.findById(planId);
    const basePrice = parseFloat(plan.priceAmount);
    const discount = await discountService.getDiscount(discountCode);
    return basePrice - (basePrice * discount.percentage) / 100;
  }
}
```

---

## 📊 Testing Strategy

### Unit Testing:

```javascript
// Mock repository
const mockRepository = {
  findById: jest.fn().mockResolvedValue({ id: "1", name: "PRO" }),
};

// Test service logic
const service = new PricingService(mockRepository);
const plan = await service.getPlanDetails("1");
expect(plan.name).toBe("PRO");
```

### Integration Testing:

```javascript
// Test full flow with real database
POST /api/admin/pricing
{ name: "TEST", priceAmount: 10, ... }
// Assert response format and database state
```

---

## 🎓 Lessons & Decisions

1. **Why Layers?**
   - Separation of concerns
   - Testability
   - Reusability
   - Maintainability

2. **Why Repository?**
   - Abstract database details
   - Easy to mock in tests
   - Centralize data queries

3. **Why Service?**
   - Encapsulate business logic
   - Share logic across endpoints
   - Easier to test

4. **Why Validation Middleware?**
   - Prevent invalid data reaching service
   - Early validation = better performance
   - Consistent validation across routes

5. **Why Consistent Formatting?**
   - API consistency
   - Better frontend integration
   - Easier to version API

---

## 🔗 Related Documentation

- [ADMIN_PRICING_API.md](./ADMIN_PRICING_API.md) - API endpoints
- [Backend README](./README.md) - Backend setup

---

## 💡 SOLID & Design Patterns Recap

| Principle  | Applied Where                     | Benefit                                |
| ---------- | --------------------------------- | -------------------------------------- |
| SRP        | Each class has one responsibility | Easy to modify, test, understand       |
| OCP        | Service designed for extension    | Add features without modifying code    |
| LSP        | Consistent method signatures      | Predictable, substitutable classes     |
| ISP        | Focused interfaces                | Clients don't depend on unused methods |
| DIP        | Dependencies injected             | Easy to mock, test, swap               |
| Repository | Data access abstraction           | Flexible database changes              |
| Service    | Business logic encapsulation      | Reusable, testable logic               |
| Factory    | Data formatting methods           | Consistent API responses               |
| Middleware | Cross-cutting concerns            | Authentication, validation, logging    |
