function apiRequest(url, method, body) {
  var options = {
    method: method || "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin"
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  return fetch(url, options).then(function (res) {
    return res.json();
  });
}

function checkLogin() {
  var user = sessionStorage.getItem("user");
  if (!user) {
    window.location.href = "/login.html";
    return null;
  }
  return JSON.parse(user);
}

function checkAdmin() {
  var user = checkLogin();
  if (!user) return null;
  if (user.role !== "admin") {
    window.location.href = "/student-home.html";
    return null;
  }
  return user;
}

function checkStudent() {
  var user = checkLogin();
  if (!user) return null;
  if (user.role !== "student") {
    window.location.href = "/index.html";
    return null;
  }
  return user;
}

function logout() {
  API.logout().then(function () {
    sessionStorage.removeItem("user");
    window.location.href = "/login.html";
  });
}

var API = {
  login: function (username, password) {
    return apiRequest("/api/login", "POST", { username: username, password: password });
  },
  logout: function () {
    return apiRequest("/api/logout", "POST", {});
  },
  register: function (username, password) {
    return apiRequest("/api/register", "POST", { username: username, password: password });
  },
  getMe: function () {
    return apiRequest("/api/me");
  },
  getMyGrades: function () {
    return apiRequest("/api/my/grades");
  },
  getStudents: function (keyword) {
    var url = "/api/students";
    if (keyword) url += "?keyword=" + encodeURIComponent(keyword);
    return apiRequest(url);
  },
  addStudent: function (data) {
    return apiRequest("/api/students", "POST", data);
  },
  updateStudent: function (id, data) {
    return apiRequest("/api/students/" + id, "PUT", data);
  },
  deleteStudent: function (id) {
    return apiRequest("/api/students/" + id, "DELETE");
  },
  getCourses: function (keyword) {
    var url = "/api/courses";
    if (keyword) url += "?keyword=" + encodeURIComponent(keyword);
    return apiRequest(url);
  },
  addCourse: function (data) {
    return apiRequest("/api/courses", "POST", data);
  },
  updateCourse: function (id, data) {
    return apiRequest("/api/courses/" + id, "PUT", data);
  },
  deleteCourse: function (id) {
    return apiRequest("/api/courses/" + id, "DELETE");
  },
  getGrades: function (keyword) {
    var url = "/api/grades";
    if (keyword) url += "?keyword=" + encodeURIComponent(keyword);
    return apiRequest(url);
  },
  addGrade: function (data) {
    return apiRequest("/api/grades", "POST", data);
  },
  updateGrade: function (id, data) {
    return apiRequest("/api/grades/" + id, "PUT", data);
  },
  deleteGrade: function (id) {
    return apiRequest("/api/grades/" + id, "DELETE");
  },
  getCourseAvg: function () {
    return apiRequest("/api/stats/course-avg");
  },
  getPassRate: function () {
    return apiRequest("/api/stats/pass-rate");
  }
};
