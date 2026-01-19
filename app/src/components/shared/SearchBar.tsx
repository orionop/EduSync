import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Calendar, Award, RefreshCw, Calculator, Shield, ClipboardCheck, Clock, GraduationCap, X } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  path: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SearchBarProps {
  userRole: 'student' | 'faculty' | 'admin';
}

const SearchBar: React.FC<SearchBarProps> = ({ userRole }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Define searchable items based on role
  const getSearchableItems = (): SearchResult[] => {
    const baseItems: Record<string, SearchResult[]> = {
      student: [
        { id: 'dashboard', title: 'Dashboard', path: '/student/dashboard', category: 'Navigation', icon: FileText },
        { id: 'exam-prerequisites', title: 'Exam Prerequisites', path: '/student/exam-prerequisites', category: 'Exams', icon: FileText },
        { id: 'exam-timetable', title: 'Exam Timetable', path: '/student/exam-timetable', category: 'Exams', icon: Calendar },
        { id: 'results', title: 'Results', path: '/student/results', category: 'Results', icon: Award },
        { id: 'kt-section', title: 'KT Section', path: '/student/kt-section', category: 'Exams', icon: RefreshCw },
        { id: 'submissions', title: 'Submissions', path: '/student/submissions', category: 'Exams', icon: FileText },
        { id: 'placement-section', title: 'Placement Section', path: '/student/placement-eligibility', category: 'Placement', icon: GraduationCap },
      ],
      faculty: [
        { id: 'dashboard', title: 'Dashboard', path: '/faculty/dashboard', category: 'Navigation', icon: FileText },
        { id: 'marks-calculation', title: 'Marks Calculation', path: '/faculty/marks-calculation', category: 'Evaluation', icon: Calculator },
        { id: 'view-results', title: 'View Results', path: '/faculty/view-results', category: 'Results', icon: Award },
        { id: 'proctor-section', title: 'Proctor Section', path: '/faculty/proctor-section', category: 'Duties', icon: Shield },
        { id: 'supervisor-duty', title: 'Supervisor Duty', path: '/faculty/supervisor-duty', category: 'Duties', icon: ClipboardCheck },
        { id: 'end-semester-evaluation', title: 'End Semester Evaluation', path: '/faculty/end-semester-evaluation', category: 'Evaluation', icon: FileText },
        { id: 'revaluation', title: 'Revaluation', path: '/faculty/revaluation', category: 'Evaluation', icon: RefreshCw },
      ],
      admin: [
        { id: 'dashboard', title: 'Dashboard', path: '/admin/dashboard', category: 'Navigation', icon: FileText },
        { id: 'exam-prerequisites', title: 'Exam Prerequisites', path: '/admin/exam-prerequisites', category: 'Exams', icon: FileText },
        { id: 'supervisory-duty', title: 'Supervisory Duty', path: '/admin/supervisory-duty', category: 'Duties', icon: ClipboardCheck },
        { id: 'during-exam', title: 'During Exam', path: '/admin/during-exam', category: 'Exams', icon: Clock },
        { id: 'post-exam', title: 'Post Exam', path: '/admin/post-exam', category: 'Exams', icon: FileText },
        { id: 'exam-evaluation', title: 'Exam Evaluation', path: '/admin/exam-evaluation', category: 'Evaluation', icon: Award },
      ],
    };

    return baseItems[userRole] || [];
  };

  // Filter results based on query
  useEffect(() => {
    const searchableItems = getSearchableItems();
    
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const filtered = searchableItems.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchesCategory = item.category.toLowerCase().includes(lowerQuery);
      const matchesPath = item.path.toLowerCase().includes(lowerQuery);
      return matchesTitle || matchesCategory || matchesPath;
    });

    setResults(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [query, userRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md mx-4">
      <label htmlFor="search" className="sr-only">Search</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          ref={inputRef}
          id="search"
          type="search"
          placeholder="Search pages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="
            w-full pl-9 pr-9 py-1.5 
            bg-slate-50 border border-slate-200 rounded-lg 
            text-sm text-slate-700 placeholder-slate-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-shadow duration-150
          "
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          <div className="py-1">
            {results.map((result, index) => {
              const Icon = result.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    w-full px-4 py-2.5 flex items-center gap-3 text-left
                    transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isSelected ? 'bg-slate-100' : 'hover:bg-slate-50'}
                  `}
                  role="option"
                  id={`result-${index}`}
                  aria-selected={isSelected}
                  aria-label={`Navigate to ${result.title} in ${result.category}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {result.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-4 px-4"
          role="status"
          aria-live="polite"
        >
          <div className="text-sm text-slate-500 text-center">
            No results found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
