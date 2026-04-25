import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Play, 
  Pause, 
  RotateCcw,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import api from '../utils/api';
import TaskModal from '../components/TaskModal';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState('work'); // work, short, long

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setTimeout(() => setIsActive(false), 0);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(type === 'work' ? 25 * 60 : type === 'short' ? 5 * 60 : 15 * 60);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setIsActive(false);
    setTimeLeft(newType === 'work' ? 25 * 60 : newType === 'short' ? 5 * 60 : 15 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-widget card glass">
      <div className="timer-header">
        <Clock size={20} className="text-secondary" />
        <h3>Focus Timer</h3>
      </div>
      
      <div className="timer-modes">
        <button className={type === 'work' ? 'active' : ''} onClick={() => handleTypeChange('work')}>Work</button>
        <button className={type === 'short' ? 'active' : ''} onClick={() => handleTypeChange('short')}>Short Break</button>
        <button className={type === 'long' ? 'active' : ''} onClick={() => handleTypeChange('long')}>Long Break</button>
      </div>

      <div className="timer-display">
        {formatTime(timeLeft)}
      </div>

      <div className="timer-controls">
        <button onClick={toggleTimer} className="btn-icon">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={resetTimer} className="btn-icon">
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    upcomingExams: 0,
    subjectsWithProgress: []
  });
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (err) {
      console.error('Failed to fetch subjects', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSubjects();
  }, []);

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

  return (
    <div className="dashboard-view animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Your Dashboard</h1>
          <p>Track your study progress and stay focused.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </header>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchStats}
        subjects={subjects}
      />

      <div className="stats-grid">
        <div className="stats-card card">
          <div className="stats-icon text-primary"><CheckCircle /></div>
          <div className="stats-content">
            <h3>{stats.completedTasks}/{stats.totalTasks}</h3>
            <p>Tasks Completed</p>
          </div>
        </div>
        <div className="stats-card card">
          <div className="stats-icon text-secondary"><Calendar /></div>
          <div className="stats-content">
            <h3>{stats.upcomingExams}</h3>
            <p>Upcoming Exams</p>
          </div>
        </div>
        <div className="stats-card card">
          <div className="stats-icon text-accent"><TrendingUp /></div>
          <div className="stats-content">
            <h3>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</h3>
            <p>Overall Progress</p>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="chart-section card glass">
          <h3>Subject Progress</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.subjectsWithProgress}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <YAxis hide />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {stats.subjectsWithProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Pomodoro />
      </div>

      <style>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .stats-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .stats-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--bg-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stats-content h3 {
          font-size: 1.5rem;
          color: var(--text-main);
        }
        .stats-content p {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
        .chart-section h3 {
          margin-bottom: 1.5rem;
        }
        .chart-wrapper {
          width: 100%;
        } .pomodoro-widget {
          text-align: center;
        }
        .timer-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .timer-modes {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .timer-modes button {
          background: transparent;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .timer-modes button.active {
          background: var(--secondary);
          color: white;
        }
        .timer-display {
          font-size: 4rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 2rem;
          color: var(--text-main);
        }
        .timer-controls {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }
        .btn-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--bg-main);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-icon:hover {
          background: var(--border);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
