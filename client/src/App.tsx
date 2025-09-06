import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TimetableModule from './components/TimetableModule';
import SeatingModule from './components/SeatingModule';
import InvigilatorModule from './components/InvigilatorModule';
import PreviewPanel from './components/PreviewPanel';
import { ExamProvider } from './context/ExamContext';

export type ActiveModule = 'dashboard' | 'timetable' | 'seating' | 'invigilator';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'timetable':
        return <TimetableModule />;
      case 'seating':
        return <SeatingModule />;
      case 'invigilator':
        return <InvigilatorModule />;
      default:
        return <Dashboard onModuleSelect={setActiveModule} />;
    }
  };

  return (
    <ExamProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar 
          activeModule={activeModule} 
          onModuleChange={setActiveModule}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header 
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
            onPreviewToggle={() => setPreviewOpen(!previewOpen)}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {renderActiveModule()}
            </div>
          </main>
        </div>

        <PreviewPanel 
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      </div>
    </ExamProvider>
  );
}

export default App;
