# ParabankFabricQACode

## For Reviewers

### Quick Evaluation Guide

1. **Project Structure**
   - Check `tests/` directory for organized test files
   - Review `tests/ui/pages/` for Page Object Model implementation
   - Examine `tests/api/` for API test organization
   - Verify `tests/data/` for test data management

2. **Test Implementation**
   - UI Tests: Start with `tests/ui/register.spec.ts` for user registration flow
   - API Tests: Begin with `tests/api/account.api.ts` for basic API testing
   - Check random username generation in test files
   - Verify assertions in each test step

3. **Code Quality**
   - Review `tests/utils/baseTest.ts` for framework setup
   - Check `tests/utils/testData.ts` for data management
   - Examine page objects for reusability
   - Look for proper error handling

4. **CI/CD Setup**
   - Review `Jenkinsfile` for pipeline configuration
   - Check test reporting setup
   - Verify Docker configuration

5. **Running Tests**
   ```bash
   # Install dependencies
   npm install

   # Run all tests
   npm test

   # Run specific test suites
   npm run test:ui
   npm run test:api
   ```

6. **Key Files to Review**
   - `playwright.config.ts`: Framework configuration
   - `tests/ui/pages/*.page.ts`: Page objects
   - `tests/api/*.api.ts`: API test implementations
   - `tests/data/*.json`: Test data
   - `Jenkinsfile`: CI/CD configuration

7. **Evaluation Checklist**
   - [ ] All required test scenarios implemented
   - [ ] Random username generation working
   - [ ] Proper assertions in place
   - [ ] Page Object Model implemented
   - [ ] API tests properly structured
   - [ ] CI/CD pipeline configured
   - [ ] Code is modular and reusable
   - [ ] Error handling implemented
   - [ ] Test reports generated

## Overview

This project is an automated test framework for the Parabank demo banking application, using Playwright for both UI and API testing. It is designed for robust, maintainable, and scalable quality assurance.

### Test Coverage

#### UI Test Scenarios
1. Application Navigation
   - Navigate to Parabank application
   - Verify landing page elements

2. User Management
   - Create new user with random unique username
   - Login with created credentials
   - Verify user dashboard

3. Account Operations
   - Create new savings account
   - Capture and verify account number
   - Validate account overview and balance
   - Transfer funds between accounts
   - Pay bills using account

4. Navigation
   - Verify global navigation menu functionality
   - Test all menu items and links

#### API Test Scenarios
1. Transaction Management
   - Search transactions by amount
   - Validate transaction details in JSON response
   - Verify payment transaction details

### Key Features
- Random username generation for unique test data
- Comprehensive assertions at each test step
- Modular page object model
- Reusable test components
- Detailed test reports
- CI/CD integration with Jenkins

### Test Data Management

1. **User Data**
   - Random username generation using timestamp and random number
   - Unique email addresses for each test run
   - Standardized password format
   - User data stored in `tests/data/users.json`

2. **Account Data**
   - Pre-configured account types (Savings, Checking)
   - Initial balance settings
   - Account number format validation

3. **Payee Data**
   - Pre-configured payee information
   - Account numbers and routing numbers
   - Payee data stored in `tests/data/payees.json`

4. **Transaction Data**
   - Standard transaction amounts
   - Transaction type definitions
   - Expected response formats

### Assertions and Validations

1. **UI Assertions**
   - Page load verification
   - Element visibility and interactivity
   - Form validation messages
   - Success/error notifications
   - Navigation state
   - Account balance updates
   - Transaction confirmations

2. **API Assertions**
   - Response status codes
   - JSON schema validation
   - Transaction amount verification
   - Account balance calculations
   - Error message validation
   - Response time checks

3. **Data Validation**
   - Account number format
   - Balance calculations
   - Transaction history
   - User profile information
   - Payee details

### Error Handling

1. **UI Error Handling**
   - Element not found retries
   - Network timeout handling
   - Form submission errors
   - Navigation failures
   - Session timeout recovery

2. **API Error Handling**
   - HTTP error responses
   - Invalid data handling
   - Rate limiting
   - Authentication failures
   - Network issues

3. **Test Retry Mechanism**
   - Configurable retry attempts
   - Retry conditions
   - Failure reporting
   - Screenshot capture on failure
   - Video recording options

4. **Common Error Scenarios**
   - Invalid credentials
   - Insufficient funds
   - Duplicate transactions
   - Invalid account numbers
   - Session expiration

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

## 6. Running Tests on Jenkins CI

### Quick Start Guide

1. **Install Required Plugins:** Pipeline, HTML Publisher, Docker Pipeline, Git Integration
2. **Configure Docker:** Add Docker installation in Jenkins system configuration
3. **Create Pipeline Job:** Set up new pipeline job with Git repository and Jenkinsfile
4. **Run Tests:** Pipeline automatically runs UI and API tests in Docker container
5. **View Results:** Access test reports and artifacts from Jenkins build page

### Prerequisites

1. **Jenkins Installation:**
   - Jenkins server with Docker support
   - Required Jenkins plugins:
     - Pipeline
     - HTML Publisher
     - Docker Pipeline
     - Git Integration

2. **System Requirements:**
   - Docker installed on Jenkins server
   - Git installed on Jenkins server
   - Node.js v16+ installed
   - Sufficient disk space for test reports and artifacts (recommended: 10GB+)

### Jenkins Setup

1. **Install Required Plugins:**
   - Go to Jenkins Dashboard > Manage Jenkins > Manage Plugins
   - Install the following plugins:
     - Pipeline
     - HTML Publisher
     - Docker Pipeline
     - Git Integration
   - Restart Jenkins after plugin installation

2. **Configure Docker:**
   - Go to Jenkins Dashboard > Manage Jenkins > Configure System
   - Add Docker installation:
     - Name: `docker`
     - Docker executable path: `/usr/bin/docker`
   - Test Docker connection using "Test Connection" button

3. **Create Pipeline Job:**
   - Go to Jenkins Dashboard > New Item
   - Enter job name (e.g., "Parabank-Tests")
   - Select "Pipeline" as job type
   - Configure pipeline:
     - Select "Pipeline script from SCM"
     - Choose "Git" as SCM
     - Enter repository URL: `https://github.com/anandbhagwat/ParabankFabricQACode.git`
     - Set branch to `*/main`
     - Set Script Path to `Jenkinsfile`
   - Add build parameters (optional):
     - BROWSER (choice parameter: chromium, firefox, webkit)
     - HEADLESS (boolean parameter)

4. **Configure Build Triggers:**
   - Poll SCM: `H/15 * * * *` (runs every 15 minutes)
   - Or use GitHub webhook for automatic triggers:
     - Add webhook URL in GitHub repository settings
     - Configure Jenkins to accept GitHub webhooks

### Pipeline Stages

The Jenkins pipeline (`Jenkinsfile`) includes the following stages:

1. **Checkout:** Clones the repository
2. **Install Dependencies:** Runs `npm ci` for clean install
3. **Install Playwright Browsers:** Installs required browsers
4. **Run UI Tests:** Executes UI test suite
5. **Run API Tests:** Executes API test suite

### Maintenance Notes

1. **Docker Image Updates:**
   - Check for Playwright Docker image updates monthly
   - Update image version in Jenkinsfile when new versions are available
   - Test new image versions in a separate branch before updating

2. **Disk Space Management:**
   - Configure Jenkins to clean up old builds
   - Set build retention policy (e.g., keep last 10 builds)
   - Monitor disk space usage regularly

3. **Test Stability:**
   - Review failed tests daily
   - Update test data if needed
   - Check for environment changes affecting tests

### Viewing Test Results

1. **Access Test Reports:**
   - Go to the Jenkins build page
   - Click on "UI Test Report" or "API Test Report"
   - View detailed test results, screenshots, and traces
   - Download test artifacts for failed tests

2. **Build Artifacts:**
   - Test reports are archived as build artifacts
   - Access them from the build page under "Artifacts"
   - Screenshots and videos are available for failed tests

### Troubleshooting

1. **Docker Issues:**
   ```bash
   sudo usermod -aG docker jenkins
   sudo service jenkins restart
   ```

2. **Browser Installation Issues:**
   ```bash
   sudo apt-get update
   sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2
   ```

3. **Memory Issues:**
   Add to Jenkinsfile:
   ```groovy
   environment {
       NODE_OPTIONS = '--max-old-space-size=4096'
   }
   ```

4. **Timeout Issues:**
   Add to Jenkinsfile:
   ```groovy
   options {
       timeout(time: 1, unit: 'HOURS')
   }
   ```

5. **Common Problems:**
   - **Build fails with "No space left on device":**
     - Clean up old builds and artifacts
     - Increase disk space allocation
   - **Tests fail randomly:**
     - Check network connectivity
     - Verify test data is valid
     - Review recent application changes
   - **Docker container fails to start:**
     - Check Docker service status
     - Verify Jenkins user permissions
     - Review Docker logs

---

## Notes

- **API registration:** The Parabank demo API does not fully support programmatic registration. Some API tests may require manual setup or may only validate the request/response structure.
- **Test data:** You can modify `tests/data/users.json` and `tests/data/payees.json` to add or update test users and payees.
- **Extending tests:** Add new UI tests in `tests/ui/`, new API tests in `tests/api/`, and new page objects in `tests/ui/pages/`.