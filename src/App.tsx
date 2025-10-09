import React, { useState } from 'react';
import { Camera, History, HelpCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import SignLanguageRecognition from './components/SignLanguageRecognition';
import UserGuide from './components/UserGuide';
import HistoryPage from './components/HistoryPage';

type Page = 'recognition' | 'guide' | 'history';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('recognition');

  const navigation = [
    { id: 'recognition', label: 'Recognition', icon: Camera },
    { id: 'guide', label: 'User Guide', icon: HelpCircle },
    { id: 'history', label: 'History', icon: History },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'recognition':
        return <SignLanguageRecognition />;
      case 'guide':
        return <UserGuide />;
      case 'history':
        return <HistoryPage />;
      default:
        return <SignLanguageRecognition />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="gradient-text mr-8">TALKWITHHANDS</h1>
            </div>
            <nav className="flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => setCurrentPage(item.id as Page)}
                    className={`flex items-center space-x-2 ${
                      currentPage === item.id 
                        ? 'gradient-highlight text-white' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  );
}