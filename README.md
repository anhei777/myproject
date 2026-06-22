# 学生成绩管理系统

基于 **Flask + SQLite + HTML/JavaScript(Ajax)** 的 Web 成绩管理系统，支持**管理员**与**学生**两类角色登录，权限分离。

GitHub 仓库：https://github.com/anhei777/myproject

---

## 一、功能说明

### 管理员功能
- 登录 / 注册（注册仅创建管理员账号）
- 学生信息增删改查
- 课程信息增删改查
- 成绩录入、删除与关键词搜索
- 各科平均分、及格率统计图表

### 学生功能
- 使用学号账号登录
- 查看个人基本信息（学号、姓名、班级）
- **仅查看本人成绩**，无法访问管理功能

---

## 二、测试账号

> 账号密码仅写在 README 中，登录页不显示。

### 管理员

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin | 123456 | 系统管理员，拥有全部管理权限 |

### 学生（用户名即学号）

| 用户名 | 密码 | 姓名 | 班级 | 预置成绩 |
|--------|------|------|------|----------|
| 2024001 | 123456 | 张三 | 计科2401 | 程序设计 88、数据库原理 92 |
| 2024002 | 123456 | 李四 | 计科2401 | 程序设计 76、高等数学 58 |
| 2024003 | 123456 | 王五 | 计科2402 | 数据库原理 85、程序设计 72、高等数学 66 |

---

## 三、环境搭建与启动

### 1. 环境要求
- Python 3.8+
- pip

### 2. 安装依赖

```bash
cd student-grade-system
pip install -r requirements.txt
```

### 3. 启动服务

```bash
python app.py
```

### 4. 访问系统

浏览器打开：**http://127.0.0.1:5000**

- 登录页：`/login.html`
- 管理员首页：`/index.html`
- 学生首页：`/student-home.html`
- 学生成绩页：`/my-grades.html`

首次启动会自动执行 `schema.sql` 建表并写入测试数据，生成 `grade.db`。

---

## 四、项目代码框架

```
student-grade-system/
├── app.py                 # Flask 入口：路由、权限校验、接口
├── config.py              # 端口、数据库路径、密钥
├── db.py                  # SQLite 读写（与 HTTP 层解耦）
├── schema.sql             # 建表与初始数据
├── grade.db               # 运行时数据库（自动生成，已 gitignore）
├── requirements.txt
├── static/
│   ├── css/style.css      # 全局样式
│   └── js/
│       ├── api.js         # Ajax 统一封装 + 登录态/角色检查
│       ├── login.js       # 登录页逻辑
│       ├── students.js    # 管理员-学生/课程管理
│       ├── grades.js      # 管理员-成绩管理
│       ├── stats.js       # 管理员-统计图表
│       ├── student-home.js# 学生-个人首页
│       └── my-grades.js   # 学生-我的成绩
├── templates/             # HTML 页面
│   ├── login.html
│   ├── index.html         # 管理员首页
│   ├── students.html
│   ├── grades.html
│   ├── stats.html
│   ├── student-home.html  # 学生首页
│   └── my-grades.html     # 学生成绩页
└── docs/
    ├── 实习报告.md
    └── images/            # 报告配图
```

### 分层说明

| 层次 | 文件 | 职责 |
|------|------|------|
| 表现层 | `templates/*.html` + `static/js/*.js` | 页面展示、Ajax 请求 |
| 控制层 | `app.py` | 接收请求、Session 鉴权、调用 db |
| 数据层 | `db.py` + `schema.sql` | SQL 操作与表结构 |
| 存储层 | `grade.db` | SQLite 持久化 |

### 权限设计

- 用户表 `users` 含 `role`（`admin` / `student`）和 `student_id`（学生账号关联档案）
- 后端通过 Flask Session + `@require_admin` / `@require_student` 装饰器控制接口
- 前端通过 `checkAdmin()` / `checkStudent()` 跳转对应页面

---

## 五、主要接口

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | /api/login | 公开 | 登录 |
| POST | /api/logout | 登录用户 | 退出 |
| POST | /api/register | 公开 | 注册管理员 |
| GET | /api/me | 登录用户 | 当前用户信息 |
| GET | /api/my/grades | 学生 | 查看本人成绩 |
| GET/POST/PUT/DELETE | /api/students | 管理员 | 学生 CRUD |
| GET/POST/PUT/DELETE | /api/courses | 管理员 | 课程 CRUD |
| GET/POST/PUT/DELETE | /api/grades | 管理员 | 成绩 CRUD |
| GET | /api/stats/* | 管理员 | 统计图表数据 |

---

## 六、技术栈

- 后端：Python Flask
- 数据库：SQLite
- 前端：HTML + CSS + JavaScript（原生 fetch Ajax）
- 图表：Chart.js（CDN）
