-- users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- students
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_no TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    gender TEXT NOT NULL
);

-- courses
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_no TEXT NOT NULL UNIQUE,
    course_name TEXT NOT NULL,
    credit INTEGER NOT NULL DEFAULT 2
);

-- grades
CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    score REAL NOT NULL,
    exam_term TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(student_id, course_id, exam_term)
);

-- default admin
INSERT OR IGNORE INTO users (id, username, password) VALUES (1, 'admin', '123456');

-- sample students
INSERT OR IGNORE INTO students (id, student_no, name, class_name, gender) VALUES
(1, '2024001', '张三', '计科2401', '男'),
(2, '2024002', '李四', '计科2401', '女'),
(3, '2024003', '王五', '计科2402', '男');

-- sample courses
INSERT OR IGNORE INTO courses (id, course_no, course_name, credit) VALUES
(1, 'CS101', '程序设计', 3),
(2, 'CS102', '数据库原理', 3),
(3, 'MA101', '高等数学', 4);

-- sample grades
INSERT OR IGNORE INTO grades (id, student_id, course_id, score, exam_term) VALUES
(1, 1, 1, 88.0, '2025-2026-1'),
(2, 1, 2, 92.0, '2025-2026-1'),
(3, 2, 1, 76.0, '2025-2026-1'),
(4, 2, 3, 58.0, '2025-2026-1'),
(5, 3, 2, 85.0, '2025-2026-1');
