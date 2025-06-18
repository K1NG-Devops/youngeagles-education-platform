-- Initialize skydek_DB and railway databases
-- Use this script with phpMyAdmin or MySQL CLI

-- SKYDEK_DB (Parents and Students)
USE skydek_DB;

-- Users table (parents, children)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  workaddress TEXT,
  password VARCHAR(255),
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  firebase_uid VARCHAR(128),
  profile_picture VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP NULL,
  child_id VARCHAR(20) UNIQUE,
  guardian_id INT,
  class_id INT,
  attendance_status ENUM('present', 'absent', 'late') DEFAULT NULL,
  FOREIGN KEY (guardian_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  teacher_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Homeworks table
CREATE TABLE IF NOT EXISTS homeworks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(255),
  teacher_id INT NOT NULL,
  class_id INT NOT NULL,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activity_type VARCHAR(50) DEFAULT 'general',
  activity_data JSON,
  status ENUM('active', 'archived') DEFAULT 'active'
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  homework_id INT NOT NULL,
  comment TEXT,
  file_path VARCHAR(255),
  status ENUM('submitted', 'graded', 'returned') DEFAULT 'submitted',
  score DECIMAL(5,2),
  teacher_comments TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (homework_id) REFERENCES homeworks(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent', 'late') NOT NULL,
  notes TEXT,
  recorded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  location VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES 
('System Admin', 'admin@youngeagles.org.za', '$2a$12$sMDqsHA9.ThWdzEY57JsAObYsM/g3SWGRzHn5OuzYT.XWEk.s7.kq', 'admin');

-- RAILWAY DB (Staff)
USE railway;

-- Users table (staff - teachers, admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  firebase_uid VARCHAR(128),
  profile_picture VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP NULL
);

-- Classrooms table
CREATE TABLE IF NOT EXISTS classrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  teacher_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- FCM tokens table
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  device VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert admin and teacher users
INSERT INTO users (name, email, password, role) VALUES 
('Marrion Makunyane', 'king@youngeagles.org.za', '$2a$12$sMDqsHA9.ThWdzEY57JsAObYsM/g3SWGRzHn5OuzYT.XWEk.s7.kq', 'admin'),
('Teacher Demo', 'teacher@youngeagles.org.za', '$2a$12$sMDqsHA9.ThWdzEY57JsAObYsM/g3SWGRzHn5OuzYT.XWEk.s7.kq', 'teacher');

-- Both passwords are "King@123"
