checkAdmin();
document.getElementById("btnLogout").onclick = function (e) {
  e.preventDefault();
  logout();
};

var studentList = [];
var courseList = [];
var editingGradeId = null;

function resetGradeForm() {
  editingGradeId = null;
  document.getElementById("score").value = "";
  document.getElementById("exam_term").value = "2025-2026-1";
  document.getElementById("btnAdd").textContent = "录入";
  document.getElementById("btnCancelGrade").style.display = "none";
  document.getElementById("formMsg").textContent = "";
  if (studentList.length) document.getElementById("student_id").value = studentList[0].id;
  if (courseList.length) document.getElementById("course_id").value = courseList[0].id;
}

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
        "<td>" +
        "<button class='secondary btn-edit' data-id='" + g.id + "'>修改</button>" +
        "<button class='danger btn-del' data-id='" + g.id + "'>删除</button>" +
        "</td>";
      tbody.appendChild(tr);
    });
    document.querySelectorAll(".btn-edit").forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.dataset.id;
        var grade = res.data.find(function (item) {
          return String(item.id) === String(id);
        });
        if (!grade) return;
        editingGradeId = grade.id;
        document.getElementById("student_id").value = grade.student_id;
        document.getElementById("course_id").value = grade.course_id;
        document.getElementById("score").value = grade.score;
        document.getElementById("exam_term").value = grade.exam_term;
        document.getElementById("btnAdd").textContent = "保存修改";
        document.getElementById("btnCancelGrade").style.display = "inline-block";
        document.getElementById("formMsg").style.color = "#2563eb";
        document.getElementById("formMsg").textContent =
          "正在修改：" + grade.student_name + " - " + grade.course_name;
        document.querySelector(".card").scrollIntoView({ behavior: "smooth" });
      };
    });
    document.querySelectorAll(".btn-del").forEach(function (btn) {
      btn.onclick = function () {
        if (confirm("确定删除该成绩？")) {
          API.deleteGrade(btn.dataset.id).then(function (r) {
            if (r.code === 0) {
              if (String(editingGradeId) === String(btn.dataset.id)) {
                resetGradeForm();
              }
              loadGrades(document.getElementById("keyword").value);
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
    student_id: document.getElementById("student_id").value,
    course_id: document.getElementById("course_id").value,
    score: document.getElementById("score").value,
    exam_term: document.getElementById("exam_term").value.trim()
  };
  var request = editingGradeId
    ? API.updateGrade(editingGradeId, data)
    : API.addGrade(data);
  request.then(function (res) {
    if (res.code === 0) {
      msg.style.color = "#16a34a";
      msg.textContent = editingGradeId ? "修改成功" : "录入成功";
      resetGradeForm();
      loadGrades();
    } else {
      msg.style.color = "#dc2626";
      msg.textContent = res.msg;
    }
  });
};

document.getElementById("btnCancelGrade").onclick = resetGradeForm;

document.getElementById("btnSearch").onclick = function () {
  loadGrades(document.getElementById("keyword").value.trim());
};

fillSelects();
loadGrades();
