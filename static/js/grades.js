checkAdmin();
document.getElementById("btnLogout").onclick = function (e) {
  e.preventDefault();
  logout();
};

var studentList = [];
var courseList = [];

function fillSelects() {
  API.getStudents().then(function (res) {
    if (res.code !== 0) return;
    studentList = res.data;
    var sel = document.getElementById("student_id");
    sel.innerHTML = "";
    studentList.forEach(function (s) {
      var opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.student_no + " - " + s.name;
      sel.appendChild(opt);
    });
  });
  API.getCourses().then(function (res) {
    if (res.code !== 0) return;
    courseList = res.data;
    var sel = document.getElementById("course_id");
    sel.innerHTML = "";
    courseList.forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.course_name;
      sel.appendChild(opt);
    });
  });
}

function loadGrades(keyword) {
  API.getGrades(keyword || "").then(function (res) {
    var tbody = document.getElementById("gradeTable");
    tbody.innerHTML = "";
    if (res.code !== 0) return;
    res.data.forEach(function (g) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + g.student_no + "</td>" +
        "<td>" + g.student_name + "</td>" +
        "<td>" + g.class_name + "</td>" +
        "<td>" + g.course_name + "</td>" +
        "<td>" + g.score + "</td>" +
        "<td>" + g.exam_term + "</td>" +
        "<td><button class='danger btn-del' data-id='" + g.id + "'>删除</button></td>";
      tbody.appendChild(tr);
    });
    document.querySelectorAll(".btn-del").forEach(function (btn) {
      btn.onclick = function () {
        if (confirm("确定删除该成绩？")) {
          API.deleteGrade(btn.dataset.id).then(function (r) {
            if (r.code === 0) loadGrades(document.getElementById("keyword").value);
          });
        }
      };
    });
  });
}

document.getElementById("btnAdd").onclick = function () {
  var msg = document.getElementById("formMsg");
  API.addGrade({
    student_id: document.getElementById("student_id").value,
    course_id: document.getElementById("course_id").value,
    score: document.getElementById("score").value,
    exam_term: document.getElementById("exam_term").value.trim()
  }).then(function (res) {
    if (res.code === 0) {
      msg.style.color = "#16a34a";
      msg.textContent = "录入成功";
      loadGrades();
    } else {
      msg.style.color = "#dc2626";
      msg.textContent = res.msg;
    }
  });
};

document.getElementById("btnSearch").onclick = function () {
  loadGrades(document.getElementById("keyword").value.trim());
};

fillSelects();
loadGrades();
