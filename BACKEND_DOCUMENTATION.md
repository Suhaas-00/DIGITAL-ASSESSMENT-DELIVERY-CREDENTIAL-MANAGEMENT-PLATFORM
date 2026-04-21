# DADCMP Backend Documentation

This document provides a comprehensive overview of the **Digital Assessment Delivery & Credential Management Platform (DADCMP)** backend. It includes API endpoints, testing procedures using Postman, and a detailed explanation of the project structure.

---

## 1. Backend API Documentation

The backend is built using **Spring Boot 3.x** and uses **JWT (JSON Web Token)** for secure authentication.

### Base URL
`http://localhost:8080` (Default Spring Boot port)

### Authentication API (`/api/user`)
All endpoints except login and register require a Bearer Token.

| Endpoint | Method | Description | Body (JSON) |
| :--- | :--- | :--- | :--- |
| `/api/user/register` | POST | Register a new user (Admin/Candidate/Examiner). | `{"username": "johndoe", "password": "password123", "role": "CANDIDATE", ...}` |
| `/api/user/login` | POST | Login to receive a JWT access token. | `{"username": "johndoe", "password": "password123"}` |

### Admin API (`/api/admin`)
Used for managing the platform's content and viewing reports.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/admin/assessments` | POST | Create a new assessment. |
| `/api/admin/assessments` | GET | List all available assessments. |
| `/api/admin/questions` | POST | Add a question to the database. |
| `/api/admin/questions/{id}` | PUT | Update an existing question. |
| `/api/admin/questions/{id}` | DELETE | Remove a question. |
| `/api/admin/reports` | GET | View all generated credentials (certificates). |

### Candidate API (`/api/candidate`)
Used by students or candidates to take assessments.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/candidate/assessments` | GET | View assessments available to take. |
| `/api/candidate/start/{id}` | POST | Start an assessment (requires `candidateId` query param). |
| `/api/candidate/submit/{id}` | POST | Submit answers for an attempt. |
| `/api/candidate/results` | GET | View results for a specific candidate. |

### Examiner API (`/api/examiner`)
Used by examiners to grade subjective or manual assessments.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/examiner/attempts` | GET | List all student attempts. |
| `/api/examiner/evaluate/{id}` | POST | Assign a final score to an attempt. |

### Credential API (`/api/credentials`)
Public or authenticated verification of certificates.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/credentials/verify/{code}` | GET | Verify the validity of a credential using its unique code. |

---

## 2. Postman Testing Guide

Follow these steps to test the entire workflow:

### Step 1: Register a User
*   **Method:** POST
*   **URL:** `{{base_url}}/api/user/register`
*   **Body (Raw JSON):**
    ```json
    {
      "username": "admin_user",
      "password": "password123",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
    ```

### Step 2: Login and Get Token
*   **Method:** POST
*   **URL:** `{{base_url}}/api/user/login`
*   **Body (Raw JSON):**
    ```json
    {
      "username": "admin_user",
      "password": "password123"
    }
    ```
*   **Action:** Copy the `token` value from the response.

### Step 3: Configure Authorization in Postman
*   In Postman, go to the **Auth** tab of your request or collection.
*   Select **Bearer Token**.
*   Paste the token you copied from the login response.

### Step 4: Create an Assessment (Admin)
*   **Method:** POST
*   **URL:** `{{base_url}}/api/admin/assessments`
*   **Body (Raw JSON):**
    ```json
    {
      "title": "Java Basics",
      "description": "Fundamental Java questions",
      "duration": 60
    }
    ```

### Step 5: Start & Submit (Candidate)
*   Register a Candidate user first and login to get their token.
*   **Start:** `POST /api/candidate/start/1?candidateId=2`
*   **Submit:** `POST /api/candidate/submit/1` with body `{"responses": "A, B, C"}`.

---

## 3. Project Structure & Workflow Explanation

### Folder Structure Overview

```text
src/main/java/com/DADCMP/DADCMP/
├── config/           # System-wide configurations (Security, Beans)
├── controller/       # REST API Endpoints (Entry points)
├── dto/              # Data Transfer Objects (Request/Response shapes)
├── entity/           # Database Models (JPA Entities)
├── enums/            # Constant types (Roles, Statuses)
├── exception/        # Custom error handling
├── repository/       # Database access layer (Spring Data JPA)
├── security/         # Authentication & Authorization logic (JWT)
└── service/          # Business logic implementation
```

### Detailed File Explanation

#### 1. Entity (`/entity`)
*   **What it is:** Classes mapped to database tables (e.g., `User.java`, `Assessment.java`).
*   **Why we use it:** To define the structure of the data we store in the database.

#### 2. Repository (`/repository`)
*   **What it is:** Interfaces extending `JpaRepository` (e.g., `UsersRepo.java`).
*   **Why we use it:** To perform CRUD (Create, Read, Update, Delete) operations on the database without writing complex SQL.

#### 3. Service (`/service`)
*   **What it is:** The "brain" of the application. It contains two parts: Interfaces (definitions) and `ServiceImpl` (actual logic).
*   **Why we use it:** To keep business logic separate from the API (Controller). This allows us to reuse logic and makes the code easier to test.

#### 4. Controller (`/controller`)
*   **What it is:** Classes that handle incoming HTTP requests (e.g., `AdminController.java`).
*   **Why we use it:** They act as the "gatekeeper." They receive user input, call the service layer, and return a response (JSON).

#### 5. Security (`/security`)
*   **What it is:** Contains `JwtUtil.java` (token generation/validation) and `JwtFilter.java`.
*   **Why we use it:** To ensure that only authorized users can access sensitive data. It checks every request for a valid token.

#### 6. DTO (`/dto`)
*   **What it is:** Simple objects like `LoginRequest` or `AuthResponse`.
*   **Why we use it:** We don't always want to expose our full database entities to the outside world. DTOs allow us to send only the necessary data.

### Workflow Summary
1.  **Request** hits a **Controller**.
2.  **Security Filter** checks if the request has a valid JWT.
3.  **Controller** validates the input and calls a **Service**.
4.  **Service** performs business logic (e.g., calculating scores) and uses a **Repository** to save/fetch data.
5.  **Repository** talks to the **Database**.
6.  **Service** returns data back to the **Controller**.
7.  **Controller** wraps the data in a **DTO** and sends it back to the user as a **JSON Response**.
