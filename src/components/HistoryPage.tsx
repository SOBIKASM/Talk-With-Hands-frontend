import React, { useState } from 'react';
import { History, Calendar, Clock, Search, Filter, Hash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
// NOTE: Assuming 'select' is implemented as a standard HTML select, 
// as the original code used it that way and the provided import only shows a placeholder.

interface HistoryEntry {
  id: string;
  type: 'letter' | 'word' | 'sentence';
  content: string;
  accuracy: number;
  timestamp: Date;
  session: string; // Identifier for a continuous signing session
}

// --- Helper Functions for Formatting ---

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// --- Component Start ---

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'letter' | 'word' | 'sentence'>('all');

  // Refined Mock history data to demonstrate grouping
  const historyEntries: HistoryEntry[] = [
    {
      id: '1',
      type: 'letter',
      content: 'A',
      accuracy: 95,
      timestamp: new Date('2024-01-25T10:30:00'),
      session: 'S-20240125-1'
    },
    {
      id: '2',
      type: 'word',
      content: 'HI',
      accuracy: 92,
      timestamp: new Date('2024-01-25T10:35:00'),
      session: 'S-20240125-1'
    },
    {
      id: '3',
      type: 'sentence',
      content: 'I AM FINE', // A confirmed sentence
      accuracy: 87,
      timestamp: new Date('2024-01-25T10:40:00'),
      session: 'S-20240125-1'
    },
    {
      id: '4',
      type: 'letter',
      content: 'C',
      accuracy: 93,
      timestamp: new Date('2024-01-24T15:20:00'),
      session: 'S-20240124-1'
    },
    {
      id: '5',
      type: 'sentence',
      content: 'THANK YOU', // Another confirmed sentence
      accuracy: 89,
      timestamp: new Date('2024-01-24T15:25:00'),
      session: 'S-20240124-2' // New session on the same day
    },
    {
      id: '6',
      type: 'sentence',
      content: 'WELCOME',
      accuracy: 85,
      timestamp: new Date('2024-01-24T15:30:00'),
      session: 'S-20240124-2'
    },
  ];

  const filteredEntries = historyEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Group by Date (YYYY-MM-DD string)
  const groupedByDate = filteredEntries.reduce((acc, entry) => {
    const dateKey = entry.timestamp.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = {};
    }
    // Then group by Session within that date
    if (!acc[dateKey][entry.session]) {
      acc[dateKey][entry.session] = [];
    }
    acc[dateKey][entry.session].push(entry);
    return acc;
  }, {} as Record<string, Record<string, HistoryEntry[]>>);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'letter': return 'bg-blue-500 hover:bg-blue-600';
      case 'word': return 'bg-green-500 hover:bg-green-600';
      case 'sentence': return 'bg-purple-500 hover:bg-purple-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const stats = {
    totalEntries: historyEntries.length,
    letters: historyEntries.filter(e => e.type === 'letter').length,
    words: historyEntries.filter(e => e.type === 'word').length,
    sentences: historyEntries.filter(e => e.type === 'sentence').length,
    averageAccuracy: historyEntries.length > 0
      ? Math.round(historyEntries.reduce((acc, e) => acc + e.accuracy, 0) / historyEntries.length)
      : 0,
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="gradient-text mb-4">Recognition History</h2>
        <p className="text-muted-foreground">
          View your complete sign language recognition history and track your progress
        </p>
      </div>

      {/* --- Stats Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.totalEntries}</div>
            <div className="text-sm text-muted-foreground">Total Recognitions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.letters}</div>
            <div className="text-sm text-muted-foreground">Letters</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.words}</div>
            <div className="text-sm text-muted-foreground">Words</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.sentences}</div>
            <div className="text-sm text-muted-foreground">Sentences</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getAccuracyColor(stats.averageAccuracy)}`}>{stats.averageAccuracy}%</div>
            <div className="text-sm text-muted-foreground">Avg Accuracy</div>
          </CardContent>
        </Card>
      </div>

      {/* --- Search and Filter --- */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content (e.g., HELLO, A, sentence)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Types</option>
                <option value="letter">Letters</option>
                <option value="word">Words</option>
                <option value="sentence">Sentences</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- History Entries --- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Recognition Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No history found matching the current filters.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByDate).sort((a, b) => b[0].localeCompare(a[0])).map(([dateKey, sessions]) => (
                <div key={dateKey} className="space-y-4">
                  {/* Date Divider */}
                  <h3 className="text-xl font-semibold border-b pb-2 text-primary">
                    <Calendar className="h-5 w-5 mr-2 inline-block align-middle" />
                    {formatDate(new Date(dateKey))}
                  </h3>

                  {/* Sessions within the Date */}
                  {Object.entries(sessions).map(([session, entries]) => (
                    <div key={session} className="border border-border rounded-lg p-4 bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <h4 className="flex items-center space-x-2 text-base font-medium text-secondary-foreground">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span>{session}</span>
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          {entries.length} recognitions
                        </div>
                      </div>

                      <div className="space-y-2">
                        {entries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex flex-wrap items-center justify-between p-3 bg-muted/50 rounded-md transition hover:bg-muted"
                          >
                            <div className="flex items-center space-x-3">
                              <Badge className={`text-white ${getTypeColor(entry.type)}`}>
                                {entry.type}
                              </Badge>
                              <span className="font-semibold text-base">{entry.content}</span>
                            </div>

                            <div className="flex items-center space-x-4 text-sm">
                              <div className={`font-bold ${getAccuracyColor(entry.accuracy)}`}>
                                {entry.accuracy}%
                              </div>
                              <div className="flex items-center space-x-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(entry.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* --- Export Options --- */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              Export as CSV
            </Button>
            <Button variant="outline">
              Export as JSON
            </Button>
            <Button variant="outline">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}