# DADCMP - Execution Guide

Follow these instructions to run the **Digital Assessment Delivery & Credential Management Platform** locally.

## Prerequisites
- **Java 17** or higher
- **Node.js** (v14 or higher) and **npm**
- **Maven** (to run the backend)
- **MySQL Server** (ensure it's running and the database matches backend config)

---

## Step 1: Backend Setup (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd DADCMP
   ```
2. Configure your database in `src/main/resources/application.properties` (update username/password if needed).
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will start on `http://localhost:8080`.*

---

## Step 2: Frontend Setup (Angular)
1. Open a **new** terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```
   *The frontend will start on `http://localhost:4200`.*

---

## Step 3: Accessing the Application
- Open your browser and go to: **`http://localhost:4200`**
- **Default Roles:**
  - Register as an **Admin** to manage assessments and questions.
  - Register as a **Candidate** to take exams and view results.
  - Register as an **Examiner** to evaluate student attempts.

---

## Troubleshooting
- **CORS Errors:** Ensure the backend `SecurityConfig` allows origins from `http://localhost:4200`.
- **Database Connection:** Verify that MySQL is running and the `dadcmp` database exists (or as specified in `application.properties`).
- **Node Modules:** If the frontend fails to start, delete `node_modules` and run `npm install` again.
