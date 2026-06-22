var user = checkStudent();
document.getElementById("btnLogout").onclick = function (e) {
  e.preventDefault();
  logout();
};

API.getMe().then(function (res) {
  if (res.code !== 0 || !res.data.profile) return;
  var p = res.data.profile;
  document.getElementById("userInfo").textContent = "欢迎，" + p.name + " | ";
  document.getElementById("profileBox").innerHTML =
    "<p><strong>学号：</strong>" + p.student_no + "</p>" +
    "<p><strong>姓名：</strong>" + p.name + "</p>" +
    "<p><strong>班级：</strong>" + p.class_name + "</p>" +
    "<p><strong>性别：</strong>" + p.gender + "</p>";
});
