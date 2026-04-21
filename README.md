# Digital Assessment Delivery & Credential Management Platform (DADCMP)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.x-brightgreen)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-14.x-red)](https://angular.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

DADCMP is a robust, industry-grade platform designed to streamline the entire assessment lifecycle—from question bank management and examination delivery to automated evaluation and credential issuance. Built with a modern tech stack, it provides a secure, role-based environment for administrators, examiners, and candidates.

---

## 🚀 Key Features

### 🔐 Secure Authentication & Role-Based Access
- **JWT-based Authentication**: Secure stateless authentication for all API requests.
- **Role-Based Control**: Dedicated dashboards and permissions for:
  - **Admin**: System configuration, user management, and assessment creation.
  - **Examiner**: Question bank management and manual evaluation of subjective answers.
  - **Candidate**: Exam dashboard, real-time testing, and result viewing.

### 📝 Assessment & Question Management
- **Question Bank**: Support for Multiple Choice (MCQ) and Subjective questions.
- **Categorization**: Questions organized by domain, difficulty, and tags.
- **Assessment Builder**: Create timed assessments with specific question sets and passing criteria.

### 🎓 Exam Delivery & Evaluation
- **Candidate Interface**: Clean, distraction-free environment for taking exams.
- **Auto-Evaluation**: Instant scoring for MCQs based on predefined keys.
- **Manual Grading**: Examiners can review and grade subjective responses.

### 📜 Credential Management
- **Automated Certification**: Generation of digital credentials upon passing.
- **Verification System**: Unique verification codes for authenticating credentials.
- **Audit Logs**: Comprehensive tracking of all system actions for security and transparency.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular 14, TypeScript, Vanilla CSS, RXJS |
| **Backend** | Spring Boot 3.x, Spring Security (JWT), Spring Data JPA |
| **Database** | MySQL 8.0 |
| **Testing** | Postman, JUnit, Karma/Jasmine |
| **Documentation** | Swagger/OpenAPI (Logic implemented), Markdown |

---

## 📁 Project Structure

```text
DADCMP/
├── backend/               # Spring Boot Application
│   ├── src/main/java/     # Java Source Code
│   │   ├── config/        # Security & Bean Configs
│   │   ├── controller/    # REST API Endpoints
│   │   ├── entity/        # Database Entities
│   │   ├── service/       # Business Logic
│   │   └── security/      # JWT Implementation
│   └── pom.xml            # Maven Dependencies
├── frontend/              # Angular Application
│   ├── src/app/           # Component & Service Logic
│   │   ├── modules/       # Role-based feature modules
│   │   ├── core/          # Authentication & API services
│   │   └── shared/        # Reusable UI components
│   └── package.json       # Node Dependencies
├── schema.sql             # SQL Database Schema
└── BACKEND_DOCUMENTATION  # Detailed API Documentation
```

---

## ⚙️ Setup & Installation

### Prerequisites
- JDK 17 or higher
- Node.js (v16.x or v18.x)
- Angular CLI (v14.x)
- MySQL Server

### 1. Database Setup
1. Create a database named `dadcmp_db` in MySQL.
2. Execute the `schema.sql` file to create the necessary tables.
   ```bash
   mysql -u root -p dadcmp_db < schema.sql
   ```

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Update `src/main/resources/application.properties` with your database credentials.
3. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Access the platform at `http://localhost:4200`.

---

## 🚦 Workflow Overview

1.  **Preparation**: Admin creates **Categories** and **Levels**. Examiners add **Questions** to the bank.
2.  **Creation**: Admin builds an **Assessment** by selecting questions and setting a schedule.
3.  **Examination**: Candidates log in during the scheduled window and complete the **Attempt**.
4.  **Evaluation**: System auto-grades MCQs. Examiners grade subjective questions via the **Examiner Dashboard**.
5.  **Certification**: Scores meeting the threshold trigger the generation of a **Credential**.
6.  **Verification**: Third parties can verify credentials using the unique `credential_code`.

---

## 📖 API Documentation

For a detailed list of all REST endpoints, body structures, and Postman testing steps, please refer to the [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md).

---

## 🤝 Contributing

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
