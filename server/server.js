require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_studyplanner';

app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hashedPassword);
    
    const token = jwt.sign({ id: info.lastInsertRowid, name }, JWT_SECRET);
    res.json({ token, user: { id: info.lastInsertRowid, name, email } });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Subject Routes
app.get('/api/subjects', authenticateToken, (req, res) => {
  const subjects = db.prepare('SELECT * FROM subjects WHERE user_id = ?').all(req.user.id);
  res.json(subjects);
});

app.post('/api/subjects', authenticateToken, (req, res) => {
  const { name, color } = req.body;
  const stmt = db.prepare('INSERT INTO subjects (user_id, name, color) VALUES (?, ?, ?)');
  const info = stmt.run(req.user.id, name, color);
  res.json({ id: info.lastInsertRowid, name, color });
});

app.put('/api/subjects/:id', authenticateToken, (req, res) => {
  const { name, color } = req.body;
  const stmt = db.prepare('UPDATE subjects SET name = ?, color = ? WHERE id = ? AND user_id = ?');
  const result = stmt.run(name, color, req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Subject not found' });
  res.json({ success: true });
});

app.delete('/api/subjects/:id', authenticateToken, (req, res) => {
  const stmt = db.prepare('DELETE FROM subjects WHERE id = ? AND user_id = ?');
  const result = stmt.run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Subject not found' });
  res.json({ success: true });
});

// Task Routes
app.get('/api/tasks', authenticateToken, (req, res) => {
  const tasks = db.prepare(`
    SELECT tasks.*, subjects.name as subject_name, subjects.color as subject_color 
    FROM tasks 
    JOIN subjects ON tasks.subject_id = subjects.id 
    WHERE tasks.user_id = ?
  `).all(req.user.id);
  res.json(tasks);
});

app.post('/api/tasks', authenticateToken, (req, res) => {
  const { subject_id, title, description, deadline } = req.body;
  const stmt = db.prepare('INSERT INTO tasks (user_id, subject_id, title, description, deadline) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(req.user.id, subject_id, title, description, deadline);
  res.json({ id: info.lastInsertRowid, ...req.body, completed: 0 });
});

app.patch('/api/tasks/:id', authenticateToken, (req, res) => {
  const { completed } = req.body;
  db.prepare('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?').run(completed ? 1 : 0, req.params.id, req.user.id);
  res.json({ success: true });
});

app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const { subject_id, title, description, deadline } = req.body;
  const stmt = db.prepare('UPDATE tasks SET subject_id = ?, title = ?, description = ?, deadline = ? WHERE id = ? AND user_id = ?');
  const result = stmt.run(subject_id, title, description, deadline, req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
});

app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
  const result = stmt.run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
});

// Exam Routes
app.get('/api/exams', authenticateToken, (req, res) => {
  const exams = db.prepare(`
    SELECT exams.*, subjects.name as subject_name 
    FROM exams 
    JOIN subjects ON exams.subject_id = subjects.id 
    WHERE exams.user_id = ?
  `).all(req.user.id);
  res.json(exams);
});

app.post('/api/exams', authenticateToken, (req, res) => {
  const { subject_id, title, exam_date } = req.body;
  const stmt = db.prepare('INSERT INTO exams (user_id, subject_id, title, exam_date) VALUES (?, ?, ?, ?)');
  const info = stmt.run(req.user.id, subject_id, title, exam_date);
  res.json({ id: info.lastInsertRowid, ...req.body });
});

app.put('/api/exams/:id', authenticateToken, (req, res) => {
  const { subject_id, title, exam_date } = req.body;
  const stmt = db.prepare('UPDATE exams SET subject_id = ?, title = ?, exam_date = ? WHERE id = ? AND user_id = ?');
  const result = stmt.run(subject_id, title, exam_date, req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Exam not found' });
  res.json({ success: true });
});

app.delete('/api/exams/:id', authenticateToken, (req, res) => {
  const stmt = db.prepare('DELETE FROM exams WHERE id = ? AND user_id = ?');
  const result = stmt.run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Exam not found' });
  res.json({ success: true });
});

// Stats Route
app.get('/api/stats', authenticateToken, (req, res) => {
  const totalTasks = (db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ?').get(req.user.id) || { count: 0 }).count;
  const completedTasks = (db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND completed = 1').get(req.user.id) || { count: 0 }).count;
  const upcomingExams = (db.prepare("SELECT COUNT(*) as count FROM exams WHERE user_id = ? AND exam_date > datetime('now')").get(req.user.id) || { count: 0 }).count;
  
  const subjectsWithProgress = db.prepare(`
    SELECT s.name, COUNT(t.id) as total, COALESCE(SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END), 0) as completed
    FROM subjects s
    LEFT JOIN tasks t ON s.id = t.subject_id
    WHERE s.user_id = ?
    GROUP BY s.id
  `).all(req.user.id);

  res.json({
    totalTasks,
    completedTasks,
    upcomingExams,
    subjectsWithProgress
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
