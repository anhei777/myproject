checkLogin();
document.getElementById("btnLogout").onclick = function (e) {
  e.preventDefault();
  logout();
};

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
        "<td><button class='danger btn-del' data-id='" + s.id + "'>删除</button></td>";
      tbody.appendChild(tr);
    });
    document.querySelectorAll(".btn-del").forEach(function (btn) {
      btn.onclick = function () {
        if (confirm("确定删除该学生？")) {
          API.deleteStudent(btn.dataset.id).then(function (r) {
            if (r.code === 0) loadStudents(document.getElementById("keyword").value);
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
        "<td><button class='danger btn-del-course' data-id='" + c.id + "'>删除</button></td>";
      tbody.appendChild(tr);
    });
    document.querySelectorAll(".btn-del-course").forEach(function (btn) {
      btn.onclick = function () {
        if (confirm("确定删除该课程？")) {
          API.deleteCourse(btn.dataset.id).then(function (r) {
            if (r.code === 0) loadCourses();
          });
        }
      };
    });
  });
}

document.getElementById("btnAdd").onclick = function () {
  var msg = document.getElementById("formMsg");
  API.addStudent({
    student_no: document.getElementById("student_no").value.trim(),
    name: document.getElementById("name").value.trim(),
    class_name: document.getElementById("class_name").value.trim(),
    gender: document.getElementById("gender").value
  }).then(function (res) {
    if (res.code === 0) {
      msg.style.color = "#16a34a";
      msg.textContent = "添加成功";
      loadStudents();
    } else {
      msg.style.color = "#dc2626";
      msg.textContent = res.msg;
    }
  });
};

document.getElementById("btnAddCourse").onclick = function () {
  API.addCourse({
    course_no: document.getElementById("course_no").value.trim(),
    course_name: document.getElementById("course_name").value.trim(),
    credit: document.getElementById("credit").value
  }).then(function (res) {
    if (res.code === 0) loadCourses();
  });
};

document.getElementById("btnSearch").onclick = function () {
  loadStudents(document.getElementById("keyword").value.trim());
};

loadStudents();
loadCourses();
