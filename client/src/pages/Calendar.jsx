import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  AlertCircle, 
  Plus
} from 'lucide-react';
import api from '../utils/api';
import TaskModal from '../components/TaskModal';
import ExamModal from '../components/ExamModal';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchData = async () => {
    try {
      const [tasksRes, examsRes, subjectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/exams'),
        api.get('/subjects')
      ]);
      setTasks(tasksRes.data);
      setExams(examsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error('Failed to fetch calendar data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month').day();
  const monthName = currentDate.format('MMMM YYYY');

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(currentDate.date(i));
  }

  const getEventsForDay = (date) => {
    if (!date) return [];
    const formattedDate = date.format('YYYY-MM-DD');
    const dayTasks = tasks.filter(t => t.deadline && dayjs(t.deadline).format('YYYY-MM-DD') === formattedDate);
    const dayExams = exams.filter(e => dayjs(e.exam_date).format('YYYY-MM-DD') === formattedDate);
    return [
      ...dayTasks.map(t => ({...t, type: 'task'})), 
      ...dayExams.map(e => ({...e, type: 'exam'}))
    ];
  };

  const handleDayClick = (date) => {
    if (!date) return;
    setSelectedDate(date.format('YYYY-MM-DDTHH:mm'));
    setIsTaskModalOpen(true);
  };

  return (
    <div className="calendar-view animate-fade-in">
      <header className="page-header">
        <div>
          <h1>Study Calendar</h1>
          <p className="subtitle">Visual overview of your deadlines</p>
        </div>
        <div className="calendar-header-actions">
          <div className="calendar-controls">
            <button onClick={prevMonth} className="btn-icon-sm glass"><ChevronLeft /></button>
            <h2>{monthName}</h2>
            <button onClick={nextMonth} className="btn-icon-sm glass"><ChevronRight /></button>
          </div>
          <div className="quick-add">
            <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Task
            </button>
            <button onClick={() => setIsExamModalOpen(true)} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Exam
            </button>
          </div>
        </div>
      </header>

      <div className="calendar-grid-header">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((date, index) => {
          const events = getEventsForDay(date);
          const isToday = date && date.isSame(dayjs(), 'day');

          return (
            <div 
              key={index} 
              className={`calendar-day card glass ${!date ? 'empty' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              {date && (
                <>
                  <span className="day-number">{date.date()}</span>
                  <div className="day-events">
                    {events.map((event, i) => (
                      <div key={i} className={`event-pill ${event.type}`} title={event.title}>
                        {event.type === 'exam' ? <AlertCircle size={10} /> : <BookOpen size={10} />}
                        <span>{event.title}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setSelectedDate(null); }}
        onSave={fetchData}
        subjects={subjects}
        task={selectedDate ? { deadline: selectedDate } : null}
      />

      <ExamModal 
        isOpen={isExamModalOpen}
        onClose={() => { setIsExamModalOpen(false); setSelectedDate(null); }}
        onSave={fetchData}
        subjects={subjects}
        exam={selectedDate ? { exam_date: selectedDate } : null}
      />

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .calendar-header-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .calendar-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .quick-add {
          display: flex;
          gap: 0.5rem;
        }
        .calendar-grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
          min-height: 600px;
        }
        .calendar-day {
          min-height: 120px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.2s;
        }
        .calendar-day:not(.empty):hover {
          background: var(--bg-card);
        }
        .calendar-day.empty {
          background: transparent;
          border-color: transparent;
          box-shadow: none;
          cursor: default;
        }
        .calendar-day.today {
          border-color: var(--primary);
          background-color: var(--bg-main);
        }
        .day-number {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .calendar-day.today .day-number {
          color: var(--primary);
        }
        .day-events {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          overflow-y: auto;
          max-height: 80px;
        }
        .event-pill {
          font-size: 0.65rem;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: white;
          font-weight: 500;
        }
        .event-pill.task {
          background-color: var(--primary);
        }
        .event-pill.exam {
          background-color: var(--secondary);
        }
        .btn-icon-sm {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: transparent;
          color: var(--text-main);
          cursor: pointer;
        }
        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.8125rem;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
