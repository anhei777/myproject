checkLogin();
document.getElementById("btnLogout").onclick = function (e) {
  e.preventDefault();
  logout();
};

API.getCourseAvg().then(function (res) {
  if (res.code !== 0) return;
  var labels = [];
  var values = [];
  res.data.forEach(function (item) {
    labels.push(item.course_name);
    values.push(item.avg_score);
  });
  new Chart(document.getElementById("avgChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "平均分",
        data: values,
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
});

API.getPassRate().then(function (res) {
  if (res.code !== 0) return;
  var labels = [];
  var values = [];
  res.data.forEach(function (item) {
    labels.push(item.course_name);
    values.push(item.pass_rate);
  });
  new Chart(document.getElementById("passChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "及格率",
        data: values,
        backgroundColor: "#10b981"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { max: 100 } }
    }
  });
});
