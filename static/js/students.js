checkAdmin();
document.getElementById("btnLogout").onclick = function (e) {
  e.preventDefault();
  logout();
};

var editingStudentId = null;
var editingCourseId = null;

function resetStudentForm() {
  editingStudentId = null;
  document.getElementById("student_no").value = "";
  document.getElementById("name").value = "";
  document.getElementById("class_name").value = "";
  document.getElementById("gender").value = "男";
  document.getElementById("btnAdd").textContent = "添加";
  document.getElementById("btnCancelStudent").style.display = "none";
  document.getElementById("formMsg").textContent = "";
}

function resetCourseForm() {
  editingCourseId = null;
  document.getElementById("course_no").value = "";
  document.getElementById("course_name").value = "";
  document.getElementById("credit").value = "3";
  document.getElementById("btnAddCourse").textContent = "添加课程";
  document.getElementById("btnCancelCourse").style.display = "none";
}

function loadStudents(keyword) {
  API.getStudents(keyword || "").then(function (res) {
    var tbody = document.getElementById("studentTable");
    tbody.innerHTML = "";
    if (res.code !== 0) return;
    res.data.forEach(function (s) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + s.student_no + "</td>" +
        "<td>" + s.name + "</td>" +
        "<td>" + s.class_name + "</td>" +
        "<td>" + s.gender + "</td>" +
        "<td>" +
        "<button class='secondary btn-edit-student' data-id='" + s.id + "'>修改</button>" +
        "<button class='danger btn-del' data-id='" + s.id + "'>删除</button>" +
        "</td>";
      tbody.appendChild(tr);
    });
    document.querySelectorAll(".btn-edit-student").forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.dataset.id;
        var student = res.data.find(function (item) {
          return String(item.id) === String(id);
        });
        if (!student) return;
        editingStudentId = student.id;
        document.getElementById("student_no").value = student.student_no;
        document.getElementById("name").value = student.name;
        document.getElementById("class_name").value = student.class_name;
        document.getElementById("gender").value = student.gender;
        document.getElementById("btnAdd").textContent = "保存修改";
        document.getElementById("btnCancelStudent").style.display = "inline-block";
        document.getElementById("formMsg").style.color = "#2563eb";
        document.getElementById("formMsg").textContent = "正在修改学生：" + student.name;
        document.querySelector(".card").scrollIntoView({ behavior: "smooth" });
      };
    });
    document.querySelectorAll(".btn-del").forEach(function (btn) {
      btn.onclick = function () {
        if (confirm("确定删除该学生？")) {
          API.deleteStudent(btn.dataset.id).then(function (r) {
            if (r.code === 0) {
              if (String(editingStudentId) === String(btn.dataset.id)) {
                resetStudentForm();
              }
              loadStudents(document.getElementById("keyword").value);
            }
          });
        }
      };
    });
  });
}

function loadCourses() {
  API.getCourses().then(function (res) {
    var tbody = document.getElementById("courseTable");
    tbody.innerHTML = "";
    if (res.code !== 0) return;
    res.data.forEach(function (c) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + c.course_no + "</td>" +
        "<td>" + c.course_name + "</td>" +
        "<td>" + c.credit + "</td>" +
        "<td>" +
        "<button class='secondary btn-edit-course' data-id='" + c.id + "'>修改</button>" +
        "<button class='danger btn-del-course' data-id='" + c.id + "'>删除</button>" +
        "</td>";
      tbody.appendChild(tr);
    });
    document.querySelectorAll(".btn-edit-course").forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.dataset.id;
        var course = res.data.find(function (item) {
          return String(item.id) === String(id);
        });
        if (!course) return;
        editingCourseId = course.id;
        document.getElementById("course_no").value = course.course_no;
        document.getElementById("course_name").value = course.course_name;
        document.getElementById("credit").value = course.credit;
        document.getElementById("btnAddCourse").textContent = "保存修改";
        document.getElementById("btnCancelCourse").style.display = "inline-block";
        document.querySelectorAll(".card")[2].scrollIntoView({ behavior: "smooth" });
      };
    });
    document.querySelectorAll(".btn-del-course").forEach(function (btn) {
      btn.onclick = function () {
        if (confirm("确定删除该课程？")) {
          API.deleteCourse(btn.dataset.id).then(function (r) {
            if (r.code === 0) {
              if (String(editingCourseId) === String(btn.dataset.id)) {
                resetCourseForm();
              }
              loadCourses();
            }
          });
        }
      };
    });
  });
}

document.getElementById("btnAdd").onclick = function () {
  var msg = document.getElementById("formMsg");
  var data = {
    student_no: document.getElementById("student_no").value.trim(),
    name: document.getElementById("name").value.trim(),
    class_name: document.getElementById("class_name").value.trim(),
    gender: document.getElementById("gender").value
  };
  var request = editingStudentId
    ? API.updateStudent(editingStudentId, data)
    : API.addStudent(data);
  request.then(function (res) {
    if (res.code === 0) {
      msg.style.color = "#16a34a";
      msg.textContent = editingStudentId ? "修改成功" : "添加成功";
      resetStudentForm();
      loadStudents();
    } else {
      msg.style.color = "#dc2626";
      msg.textContent = res.msg;
    }
  });
};

document.getElementById("btnCancelStudent").onclick = resetStudentForm;

document.getElementById("btnAddCourse").onclick = function () {
  var data = {
    course_no: document.getElementById("course_no").value.trim(),
    course_name: document.getElementById("course_name").value.trim(),
    credit: document.getElementById("credit").value
  };
  var request = editingCourseId
    ? API.updateCourse(editingCourseId, data)
    : API.addCourse(data);
  request.then(function (res) {
    if (res.code === 0) {
      resetCourseForm();
      loadCourses();
    }
  });
};

document.getElementById("btnCancelCourse").onclick = resetCourseForm;

document.getElementById("btnSearch").onclick = function () {
  loadStudents(document.getElementById("keyword").value.trim());
};

loadStudents();
loadCourses();
