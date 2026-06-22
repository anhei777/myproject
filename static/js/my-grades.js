var user = checkStudent();
document.getElementById("btnLogout").onclick = function (e) {
  e.preventDefault();
  logout();
};

API.getMe().then(function (res) {
  if (res.code === 0 && res.data.profile) {
    var p = res.data.profile;
    document.getElementById("studentTip").textContent =
      p.name + "（" + p.student_no + "） · " + p.class_name;
  }
});

API.getMyGrades().then(function (res) {
  var tbody = document.getElementById("gradeTable");
  var emptyTip = document.getElementById("emptyTip");
  tbody.innerHTML = "";
  if (res.code !== 0) return;
  if (!res.data.length) {
    emptyTip.hidden = false;
    return;
  }
  emptyTip.hidden = true;
  res.data.forEach(function (g) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + g.course_no + "</td>" +
      "<td>" + g.course_name + "</td>" +
      "<td>" + g.credit + "</td>" +
      "<td>" + g.score + "</td>" +
      "<td>" + g.exam_term + "</td>";
    tbody.appendChild(tr);
  });
});
