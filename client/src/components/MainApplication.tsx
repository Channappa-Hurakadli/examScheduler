import React, { useState } from 'react';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Dashboard from './pages/Dashboard';
import TimetableWizard from './pages/TimetableWizard';
import SeatingWizard from './pages/SeatingWizard';
import InvigilatorWizard from './pages/InvigilatorWizard';
import ReportsModule from './pages/ReportsModule';
import SettingsModule from './pages/SettingsModule';
import UserManagement from './pages/UserManagement';
import NotificationCenter from './components/NotificationCenter';
import { useTheme } from '../contexts/ThemeContext';

export type ActiveModule = 'dashboard' | 'timetable' | 'seating' | 'invigilator' | 'reports' | 'settings' | 'users';

export default function MainApplication() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useTheme();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'timetable':
        return <TimetableWizard />;
      case 'seating':
        return <SeatingWizard />;
      case 'invigilator':
        return <InvigilatorWizard />;
      case 'reports':
        return <ReportsModule />;
      case 'settings':
        return <SettingsModule />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard onModuleSelect={setActiveModule} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          
          <main className="flex-1 overflow-y-auto">
            <div className="h-full">
              {renderActiveModule()}
            </div>
          </main>
        </div>
      </div>

      <NotificationCenter />
    </div>
  );
}