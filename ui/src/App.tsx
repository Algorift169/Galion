// App.tsx
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import './App.css';
//import wallpaper from './assets/images/walpaper.png';

// Calendar Component
interface CalendarProps {
  onClose?: () => void;
}

const Calendar: React.FC<CalendarProps> = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const days: React.ReactElement[] = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear()
    );
    
    days.push(
      <div 
        key={`day-${day}`} 
        className={`calendar-day ${isToday ? 'today' : ''}`}
      >
        {day}
      </div>
    );
  }
  
  const goToPreviousMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button 
          onClick={goToPreviousMonth} 
          className="calendar-nav-btn"
          aria-label="Previous month"
        >
          &lt;
        </button>
        <div className="calendar-month-year">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button 
          onClick={goToNextMonth} 
          className="calendar-nav-btn"
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>
      
      <div className="calendar-days-header">
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
      </div>
      
      <div className="calendar-days">
        {days}
      </div>
    </div>
  );
};

// TimeDisplay Component
const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    const updateDateTime = (): void => {
      const now = new Date();
      
      // Format time as HH:MM:SS
      const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit' 
      });
      
      // Format date as Day, Month DD, YYYY
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };
    
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="time-display">
      <div className="time-text">{currentTime}</div>
      <div className="date-text">{currentDate}</div>
    </div>
  );
};

// TopBar Component
interface TopBarProps {
  onDateClick: () => void;
  showCalendar: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onDateClick, showCalendar }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="os-name">Galion OS</div>
      </div>
      
      <div className="top-bar-center">
        <div className="status-icons">
          <div className="status-item">WiFi</div>
          <div className="status-item">Battery</div>
          <div className="status-item">Sound</div>
        </div>
      </div>
      
      <div className="top-bar-right">
        <div className="datetime-container">
          <TimeDisplay />
          <button 
            className="date-button" 
            onClick={onDateClick}
            aria-label="Toggle calendar"
          >
            📅
          </button>
          {showCalendar && (
            <div className="calendar-container">
              <Calendar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// DesktopArea Component
interface DesktopAreaProps {
  showAppContainer: boolean;
  onGIconClick: () => void;
}

const DesktopArea: React.FC<DesktopAreaProps> = ({ showAppContainer, onGIconClick }) => {
  const placeholderApps = [
    { id: 1, name: 'File Manager', icon: '📁' },
    { id: 2, name: 'Browser', icon: '🌐' },
    { id: 3, name: 'Terminal', icon: '💻' },
    { id: 4, name: 'Settings', icon: '⚙️' },
    { id: 5, name: 'Text Editor', icon: '📝' },
    { id: 6, name: 'Media Player', icon: '🎵' },
  ];
  
  const handleAppDoubleClick = (name: string): void => {
    console.log(`Opening ${name}`);
  };
  
  return (
    <div className="desktop-area">
      {/* G Icon to open app container */}
      <div 
        className="g-icon-container"
        onClick={onGIconClick}
        title="Click to open app container"
      >
        <div className="g-icon">G</div>
        <div className="g-icon-label">Apps</div>
      </div>
      
      {/* App Container - Only show when app container is open */}
      {showAppContainer && (
        <div className="app-container">
          {/* Apps Grid inside the container */}
          <div className="apps-grid">
            {placeholderApps.map(app => (
              <div 
                key={app.id} 
                className="app-icon"
                onDoubleClick={() => handleAppDoubleClick(app.name)}
              >
                <div className="app-icon-image">{app.icon}</div>
                <div className="app-icon-label">{app.name}</div>
              </div>
            ))}
          </div>
          
          {/* App window area */}
          <div className="app-window">
            <div className="app-window-header">
              <h3>App Container</h3>
              <p>Future applications will open here</p>
            </div>
            <div className="app-window-content">
              <div className="window-placeholder">
                <div className="placeholder-text">No application running</div>
                <div className="placeholder-instruction">
                  Double-click an app icon to launch it here
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showAppContainer, setShowAppContainer] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  
  const handleDateClick = (): void => {
    setShowCalendar(!showCalendar);
  };
  
  const handleGIconClick = (): void => {
    setShowAppContainer(!showAppContainer);
  };
  
  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element;
      
      // Close calendar if clicked outside
      if (
        showCalendar &&
        calendarRef.current && 
        !calendarRef.current.contains(target) &&
        dateButtonRef.current &&
        !dateButtonRef.current.contains(target)
      ) {
        setShowCalendar(false);
      }
      
      // Close app container if clicked outside (except G icon)
      if (
        showAppContainer &&
        !target.closest('.g-icon-container') &&
        !target.closest('.app-container')
      ) {
        setShowAppContainer(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar, showAppContainer]);
  
  return (
    <div 
      className="galion-os" 
      //style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <TopBar 
        onDateClick={handleDateClick} 
        showCalendar={showCalendar} 
      />
      
      <DesktopArea 
        showAppContainer={showAppContainer}
        onGIconClick={handleGIconClick}
      />
    </div>
  );
};

export default App;