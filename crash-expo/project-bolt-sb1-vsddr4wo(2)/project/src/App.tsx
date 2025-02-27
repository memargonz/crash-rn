import React, { useState } from 'react';
import { ReportForm } from './components/ReportForm';
import { ReportList } from './components/ReportList';
import { AccidentReport } from './types';
import { FileText, List } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'report' | 'view'>('report');
  const [reports, setReports] = useState<AccidentReport[]>([]);

  const handleSubmitReport = (reportData: Omit<AccidentReport, 'id' | 'createdAt'>) => {
    const newReport: AccidentReport = {
      ...reportData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
    setActiveTab('view');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('report')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'report'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Report Accident</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'view'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <List className="h-5 w-5" />
                  <span>View Reports</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'report' ? (
              <ReportForm onSubmit={handleSubmitReport} />
            ) : (
              <ReportList reports={reports} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;