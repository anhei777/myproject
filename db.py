import sqlite3
from config import DB_PATH, SCHEMA_PATH


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        sql = f.read()
    conn = get_conn()
    conn.executescript(sql)
    conn.commit()
    conn.close()


def row_to_dict(row):
    if row is None:
        return None
    return dict(row)


def rows_to_list(rows):
    return [dict(r) for r in rows]


# ---------- users ----------
def login_user(username, password):
    conn = get_conn()
    row = conn.execute(
        "SELECT id, username FROM users WHERE username=? AND password=?",
        (username, password),
    ).fetchone()
    conn.close()
    return row_to_dict(row)


def register_user(username, password):
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, password),
        )
        conn.commit()
        return True, "ok"
    except sqlite3.IntegrityError:
        return False, "username exists"
    finally:
        conn.close()


# ---------- students ----------
def list_students(keyword=""):
    conn = get_conn()
    if keyword:
        kw = "%" + keyword + "%"
        rows = conn.execute(
            "SELECT * FROM students WHERE student_no LIKE ? OR name LIKE ? OR class_name LIKE ? ORDER BY id",
            (kw, kw, kw),
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM students ORDER BY id").fetchall()
    conn.close()
    return rows_to_list(rows)


def add_student(student_no, name, class_name, gender):
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO students (student_no, name, class_name, gender) VALUES (?, ?, ?, ?)",
            (student_no, name, class_name, gender),
        )
        conn.commit()
        return True, "ok"
    except sqlite3.IntegrityError:
        return False, "student_no exists"
    finally:
        conn.close()


def update_student(sid, student_no, name, class_name, gender):
    conn = get_conn()
    try:
        conn.execute(
            "UPDATE students SET student_no=?, name=?, class_name=?, gender=? WHERE id=?",
            (student_no, name, class_name, gender, sid),
        )
        conn.commit()
        return conn.total_changes > 0
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def delete_student(sid):
    conn = get_conn()
    conn.execute("DELETE FROM grades WHERE student_id=?", (sid,))
    conn.execute("DELETE FROM students WHERE id=?", (sid,))
    conn.commit()
    deleted = conn.total_changes > 0
    conn.close()
    return deleted


# ---------- courses ----------
def list_courses(keyword=""):
    conn = get_conn()
    if keyword:
        kw = "%" + keyword + "%"
        rows = conn.execute(
            "SELECT * FROM courses WHERE course_no LIKE ? OR course_name LIKE ? ORDER BY id",
            (kw, kw),
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM courses ORDER BY id").fetchall()
    conn.close()
    return rows_to_list(rows)


def add_course(course_no, course_name, credit):
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO courses (course_no, course_name, credit) VALUES (?, ?, ?)",
            (course_no, course_name, credit),
        )
        conn.commit()
        return True, "ok"
    except sqlite3.IntegrityError:
        return False, "course_no exists"
    finally:
        conn.close()


def update_course(cid, course_no, course_name, credit):
    conn = get_conn()
    try:
        conn.execute(
            "UPDATE courses SET course_no=?, course_name=?, credit=? WHERE id=?",
            (course_no, course_name, credit, cid),
        )
        conn.commit()
        return conn.total_changes > 0
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def delete_course(cid):
    conn = get_conn()
    conn.execute("DELETE FROM grades WHERE course_id=?", (cid,))
    conn.execute("DELETE FROM courses WHERE id=?", (cid,))
    conn.commit()
    deleted = conn.total_changes > 0
    conn.close()
    return deleted


# ---------- grades ----------
def list_grades(keyword=""):
    conn = get_conn()
    sql = """
        SELECT g.id, g.score, g.exam_term,
               s.student_no, s.name AS student_name, s.class_name,
               c.course_no, c.course_name
        FROM grades g
        JOIN students s ON g.student_id = s.id
        JOIN courses c ON g.course_id = c.id
    """
    if keyword:
        kw = "%" + keyword + "%"
        sql += " WHERE s.name LIKE ? OR s.class_name LIKE ? OR c.course_name LIKE ? OR s.student_no LIKE ?"
        rows = conn.execute(sql + " ORDER BY g.id", (kw, kw, kw, kw)).fetchall()
    else:
        rows = conn.execute(sql + " ORDER BY g.id").fetchall()
    conn.close()
    return rows_to_list(rows)


def add_grade(student_id, course_id, score, exam_term):
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO grades (student_id, course_id, score, exam_term) VALUES (?, ?, ?, ?)",
            (student_id, course_id, score, exam_term),
        )
        conn.commit()
        return True, "ok"
    except sqlite3.IntegrityError:
        return False, "grade exists"
    finally:
        conn.close()


def update_grade(gid, student_id, course_id, score, exam_term):
    conn = get_conn()
    try:
        conn.execute(
            "UPDATE grades SET student_id=?, course_id=?, score=?, exam_term=? WHERE id=?",
            (student_id, course_id, score, exam_term, gid),
        )
        conn.commit()
        return conn.total_changes > 0
    except sqlite3.IntegrityError:
        return False
    finally:
        conn.close()


def delete_grade(gid):
    conn = get_conn()
    conn.execute("DELETE FROM grades WHERE id=?", (gid,))
    conn.commit()
    deleted = conn.total_changes > 0
    conn.close()
    return deleted


# ---------- stats ----------
def stats_course_avg():
    conn = get_conn()
    rows = conn.execute(
        """
        SELECT c.course_name, ROUND(AVG(g.score), 1) AS avg_score
        FROM grades g
        JOIN courses c ON g.course_id = c.id
        GROUP BY c.id
        ORDER BY c.id
        """
    ).fetchall()
    conn.close()
    return rows_to_list(rows)


def stats_pass_rate():
    conn = get_conn()
    rows = conn.execute(
        """
        SELECT c.course_name,
               COUNT(*) AS total,
               SUM(CASE WHEN g.score >= 60 THEN 1 ELSE 0 END) AS pass_count
        FROM grades g
        JOIN courses c ON g.course_id = c.id
        GROUP BY c.id
        ORDER BY c.id
        """
    ).fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        total = d["total"] or 0
        pass_count = d["pass_count"] or 0
        d["pass_rate"] = round(pass_count * 100.0 / total, 1) if total else 0
        result.append(d)
    return result
