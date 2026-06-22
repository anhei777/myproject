import os
from flask import Flask, request, jsonify, send_from_directory
import db
from config import HOST, PORT, SECRET_KEY

app = Flask(__name__, static_folder="static")
app.secret_key = SECRET_KEY


def ok(data=None, msg="ok"):
    return jsonify({"code": 0, "msg": msg, "data": data})


def fail(msg="error", code=1):
    return jsonify({"code": code, "msg": msg, "data": None})


# ---------- pages ----------
@app.route("/")
def page_index():
    return send_from_directory("templates", "index.html")


@app.route("/<path:page>.html")
def page_html(page):
    path = page + ".html"
    if os.path.exists(os.path.join("templates", path)):
        return send_from_directory("templates", path)
    return "Not Found", 404


# ---------- auth ----------
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    if not username or not password:
        return fail("username and password required")
    user = db.login_user(username, password)
    if user:
        return ok(user)
    return fail("login failed")


@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    if not username or not password:
        return fail("username and password required")
    success, msg = db.register_user(username, password)
    if success:
        return ok(msg="register ok")
    return fail(msg)


# ---------- students ----------
@app.route("/api/students", methods=["GET"])
def api_students_list():
    keyword = request.args.get("keyword", "").strip()
    return ok(db.list_students(keyword))


@app.route("/api/students", methods=["POST"])
def api_students_add():
    data = request.get_json() or {}
    success, msg = db.add_student(
        data.get("student_no", "").strip(),
        data.get("name", "").strip(),
        data.get("class_name", "").strip(),
        data.get("gender", "").strip(),
    )
    if success:
        return ok(msg="add ok")
    return fail(msg)


@app.route("/api/students/<int:sid>", methods=["PUT"])
def api_students_update(sid):
    data = request.get_json() or {}
    if db.update_student(
        sid,
        data.get("student_no", "").strip(),
        data.get("name", "").strip(),
        data.get("class_name", "").strip(),
        data.get("gender", "").strip(),
    ):
        return ok(msg="update ok")
    return fail("update failed")


@app.route("/api/students/<int:sid>", methods=["DELETE"])
def api_students_delete(sid):
    if db.delete_student(sid):
        return ok(msg="delete ok")
    return fail("delete failed")


# ---------- courses ----------
@app.route("/api/courses", methods=["GET"])
def api_courses_list():
    keyword = request.args.get("keyword", "").strip()
    return ok(db.list_courses(keyword))


@app.route("/api/courses", methods=["POST"])
def api_courses_add():
    data = request.get_json() or {}
    success, msg = db.add_course(
        data.get("course_no", "").strip(),
        data.get("course_name", "").strip(),
        int(data.get("credit", 2)),
    )
    if success:
        return ok(msg="add ok")
    return fail(msg)


@app.route("/api/courses/<int:cid>", methods=["PUT"])
def api_courses_update(cid):
    data = request.get_json() or {}
    if db.update_course(
        cid,
        data.get("course_no", "").strip(),
        data.get("course_name", "").strip(),
        int(data.get("credit", 2)),
    ):
        return ok(msg="update ok")
    return fail("update failed")


@app.route("/api/courses/<int:cid>", methods=["DELETE"])
def api_courses_delete(cid):
    if db.delete_course(cid):
        return ok(msg="delete ok")
    return fail("delete failed")


# ---------- grades ----------
@app.route("/api/grades", methods=["GET"])
def api_grades_list():
    keyword = request.args.get("keyword", "").strip()
    return ok(db.list_grades(keyword))


@app.route("/api/grades", methods=["POST"])
def api_grades_add():
    data = request.get_json() or {}
    success, msg = db.add_grade(
        int(data.get("student_id")),
        int(data.get("course_id")),
        float(data.get("score")),
        data.get("exam_term", "").strip(),
    )
    if success:
        return ok(msg="add ok")
    return fail(msg)


@app.route("/api/grades/<int:gid>", methods=["PUT"])
def api_grades_update(gid):
    data = request.get_json() or {}
    if db.update_grade(
        gid,
        int(data.get("student_id")),
        int(data.get("course_id")),
        float(data.get("score")),
        data.get("exam_term", "").strip(),
    ):
        return ok(msg="update ok")
    return fail("update failed")


@app.route("/api/grades/<int:gid>", methods=["DELETE"])
def api_grades_delete(gid):
    if db.delete_grade(gid):
        return ok(msg="delete ok")
    return fail("delete failed")


# ---------- stats ----------
@app.route("/api/stats/course-avg", methods=["GET"])
def api_stats_avg():
    return ok(db.stats_course_avg())


@app.route("/api/stats/pass-rate", methods=["GET"])
def api_stats_pass():
    return ok(db.stats_pass_rate())


if __name__ == "__main__":
    db.init_db()
    app.run(host=HOST, port=PORT, debug=True)
