document.getElementById("btnLogin").onclick = function () {
  var username = document.getElementById("username").value.trim();
  var password = document.getElementById("password").value.trim();
  var msg = document.getElementById("msg");
  if (!username || !password) {
    msg.textContent = "请输入用户名和密码";
    return;
  }
  API.login(username, password).then(function (res) {
    if (res.code === 0) {
      sessionStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/index.html";
    } else {
      msg.textContent = res.msg;
    }
  });
};

document.getElementById("btnRegister").onclick = function () {
  var username = document.getElementById("username").value.trim();
  var password = document.getElementById("password").value.trim();
  var msg = document.getElementById("msg");
  if (!username || !password) {
    msg.textContent = "请输入用户名和密码";
    return;
  }
  API.register(username, password).then(function (res) {
    if (res.code === 0) {
      msg.style.color = "#16a34a";
      msg.textContent = "注册成功，请登录";
    } else {
      msg.style.color = "#dc2626";
      msg.textContent = res.msg;
    }
  });
};
