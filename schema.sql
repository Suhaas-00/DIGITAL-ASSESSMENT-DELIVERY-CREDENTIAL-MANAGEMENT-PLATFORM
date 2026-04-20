-- Database Schema for DADCMP

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50),
    date_of_birth DATE
);

-- Categories Table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Tags Table
CREATE TABLE tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Questions Table
CREATE TABLE questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(50) NOT NULL,
    marks INT NOT NULL,
    options TEXT, -- JSON string
    correct_answer TEXT,
    category_id BIGINT,
    examiner_id BIGINT,
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (examiner_id) REFERENCES users(id)
);

-- Question Tags Mapping
CREATE TABLE question_tags (
    question_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Assessments Table
CREATE TABLE assessments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    domain VARCHAR(255),
    duration INT NOT NULL,
    total_marks INT NOT NULL,
    passing_marks INT NOT NULL,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    category_id BIGINT,
    created_by BIGINT,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Assessment Questions Mapping
CREATE TABLE assessment_questions (
    assessment_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    PRIMARY KEY (assessment_id, question_id),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Attempts Table
CREATE TABLE attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    candidate_id BIGINT NOT NULL,
    assessment_id BIGINT NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    responses TEXT, -- JSON snapshot
    score INT,
    status VARCHAR(50) NOT NULL,
    evaluated_by BIGINT,
    remarks TEXT,
    evaluated_at DATETIME,
    FOREIGN KEY (candidate_id) REFERENCES users(id),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id),
    FOREIGN KEY (evaluated_by) REFERENCES users(id)
);

-- Individual Attempt Responses
CREATE TABLE attempt_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option TEXT,
    is_correct BOOLEAN,
    marks_awarded INT,
    FOREIGN KEY (attempt_id) REFERENCES attempts(id),
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Credentials Table
CREATE TABLE credentials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    credential_code VARCHAR(100) NOT NULL UNIQUE,
    candidate_id BIGINT NOT NULL,
    assessment_id BIGINT NOT NULL,
    issue_date DATETIME,
    expiry_date DATETIME,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES users(id),
    FOREIGN KEY (assessment_id) REFERENCES assessments(id)
);

-- Notifications Table (NEW)
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255),
    performed_by VARCHAR(255),
    entity_name VARCHAR(100),
    entity_id VARCHAR(100),
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_question_difficulty ON questions(difficulty_level);
CREATE INDEX idx_assessment_status ON assessments(status);
CREATE INDEX idx_attempt_candidate ON attempts(candidate_id);
CREATE INDEX idx_credential_code ON credentials(credential_code);
