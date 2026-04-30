# 📚 Smart Study Planner

A web-based application designed to help students efficiently manage their study schedules by organizing tasks, deadlines, and priorities. The project also demonstrates modern DevOps practices using Docker and CI/CD pipelines.

---

## 🚀 Features

* 📝 Create, update, and delete study tasks
* ⏰ Manage deadlines and priorities
* 📊 Track task completion and progress
* ⚡ Fast backend using Node.js
* 🗄️ Lightweight database using SQLite
* 🐳 Docker-based deployment
* 🔄 CI/CD integration using GitHub Actions

---

## 🛠️ Tech Stack

| Category        | Technology             |
| --------------- | ---------------------- |
| Backend         | Node.js, Express.js    |
| Database        | SQLite                 |
| DevOps          | Docker, GitHub Actions |
| Version Control | GitHub                 |

---

## 📁 Project Structure

```
smart-study-planner/
├── server.js
├── database.sqlite
├── package.json
├── Dockerfile
├── .github/workflows/ci.yml
├── public/
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd smart-study-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the application

```bash
node server.js
```

---

## 🐳 Run with Docker

```bash
docker build -t smart-study-planner .
docker run -d -p 3001:3000 --name study-planner smart-study-planner
```

---

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** to automate:

* Build process
* Testing
* Deployment readiness

Workflow file:

```
.github/workflows/ci.yml
```

---

## 📌 Future Enhancements

* Notification system
* AI-based chatbot integration
* Advanced analytics dashboard
* Multi-user support

---

## 📷 Screenshots

*Add your project screenshots here*

---

## 📖 Learning Outcomes

* Backend development using Node.js
* Database management using SQLite
* Containerization with Docker
* CI/CD automation using GitHub Actions
* Version control using Git

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

Kavya Gupta
B.Tech CSE

---
