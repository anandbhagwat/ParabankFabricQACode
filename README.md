# ParabankFabricQACode

## Overview

This project is an automated test framework for the Parabank demo banking application, using Playwright for both UI and API testing. It is designed for robust, maintainable, and scalable quality assurance.

---

## 1. How to Run UI and API Tests

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)

### Install dependencies

```bash
npm install
```

### Run all tests

```bash
npm test
```

### Run only UI tests

```bash
npm run test:ui
```

### Run only API tests

```bash
npm run test:api
```

### Run tests in debug mode (with Playwright Inspector)

```bash
npm run test:debug
```

### View the last HTML report

```bash
npm run report
```

---

## 2. What UI and API Tests Cover

### UI Tests

- **Registration:** New user registration and validation.
- **Login/Logout:** User authentication flows.
- **Account Management:** Opening new accounts, viewing account details.
- **Transfers:** Transferring funds between accounts.
- **Bill Pay:** Paying bills to registered payees.
- **Loan Requests:** Applying for loans and verifying approval/denial.
- **Transactions:** Viewing and searching transaction history.
- **Profile:** Updating and verifying user profile information.

### API Tests

- **User Registration:** (Note: Parabank API registration is limited; see test code for details.)
- **Account Management:** Creating and retrieving accounts via API.
- **Transfers:** Transferring funds and verifying balances.
- **Bill Pay:** Sending payments and verifying transactions.
- **Loans:** Requesting loans and checking loan status.

---

## 3. Environment Variables and Runtime Options

- **Headless/Headed Mode:**  
  By default, tests run in headless mode. To run in headed mode, use:
  ```bash
  npx playwright test --headed
  ```
- **Browser Selection:**  
  You can specify the browser at runtime:
  ```bash
  npx playwright test --project=firefox
  npx playwright test --project=chromium
  npx playwright test --project=webkit
  ```
  (See `playwright.config.ts` for available projects.)

- **Base URL:**  
  The base URL for tests is set in `playwright.config.ts`.  
  - UI: `https://parabank.parasoft.com`
  - API: `http://parabank.parasoft.com/parabank`

- **Other Playwright Environment Variables:**  
  - `CI=true` enables CI mode (forbidOnly, retries, single worker, etc.)

---

## 4. Repository Structure

```
.
├── config/                # (Reserved for future configuration files)
├── tests/
│   ├── api/               # API test specs and API helper classes
│   ├── data/              # Test data in JSON format (users, payees, etc.)
│   ├── ui/                # UI test specs and page objects
│   │   └── pages/         # Page Object Model (POM) classes for UI automation
│   ├── utils/             # Utility classes and helpers (test data, base test, etc.)
├── playwright.config.ts   # Playwright configuration (projects, base URLs, etc.)
├── package.json           # Project metadata and scripts
├── tsconfig.json          # TypeScript configuration
├── README.md              # Project documentation
├── LICENSE                # License file
```

**Folder Details:**

- **config/**: Reserved for future configuration files.
- **tests/api/**: Contains API test specs (e.g., `account.api.ts`, `billpay.api.ts`) and API helper classes.
- **tests/data/**: JSON files for test users and payees.
- **tests/ui/**: UI test specs (e.g., `loan.spec.ts`, `register.spec.ts`) and a `pages/` subfolder for Page Object Model classes.
- **tests/ui/pages/**: Page Object Model (POM) classes for each UI page (e.g., `home.page.ts`, `loan.page.ts`).
- **tests/utils/**: Utility classes for test data management, base test setup, and helper functions.
- **playwright.config.ts**: Main Playwright configuration file.
- **package.json**: Project dependencies and npm scripts.
- **tsconfig.json**: TypeScript configuration.
- **README.md**: This documentation.
- **LICENSE**: Project license.

---

## 5. How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anandbhagwat/ParabankFabricQACode.git
   cd ParabankFabricQACode
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests:**
   - All tests: `npm test`
   - UI only: `npm run test:ui`
   - API only: `npm run test:api`
   - Debug mode: `npm run test:debug`

4. **View reports:**
   ```bash
   npm run report
   ```

5. **Custom options:**
   - Run headed: `npx playwright test --headed`
   - Specify browser: `npx playwright test --project=firefox`
   - Run a specific test file: `npx playwright test tests/ui/loan.spec.ts`

---

## Notes

- **API registration:** The Parabank demo API does not fully support programmatic registration. Some API tests may require manual setup or may only validate the request/response structure.
- **Test data:** You can modify `tests/data/users.json` and `tests/data/payees.json` to add or update test users and payees.
- **Extending tests:** Add new UI tests in `tests/ui/`, new API tests in `tests/api/`, and new page objects in `tests/ui/pages/`.