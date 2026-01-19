import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ed';
  timestamp: Date;
  actions?: ActionButton[];
}

interface ActionButton {
  label: string;
  action: 'navigate' | 'query';
  value: string;
}

interface QuickAction {
  label: string;
  query: string;
}

const EdChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Get current page context
  const getCurrentPageContext = (): string => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/exam-prerequisites')) return 'exam-prerequisites';
    if (path.includes('/exam-timetable')) return 'exam-timetable';
    if (path.includes('/results')) return 'results';
    if (path.includes('/kt-section')) return 'kt-section';
    if (path.includes('/submissions')) return 'submissions';
    if (path.includes('/placement-eligibility')) return 'placement';
    if (path.includes('/marks-calculation')) return 'marks-entry';
    if (path.includes('/view-results')) return 'view-results';
    if (path.includes('/proctor-section')) return 'proctoring';
    if (path.includes('/supervisor-duty')) return 'supervisor-duty';
    if (path.includes('/end-semester-evaluation')) return 'evaluation';
    if (path.includes('/during-exam')) return 'during-exam';
    if (path.includes('/post-exam')) return 'post-exam';
    if (path.includes('/supervisory-duty')) return 'supervisory-duty';
    if (path.includes('/login')) return 'login';
    return 'general';
  };

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = getWelcomeMessage();
      setMessages([{
        id: '1',
        text: welcomeMessage.text,
        sender: 'ed',
        timestamp: new Date(),
        actions: welcomeMessage.actions
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getWelcomeMessage = (): { text: string; actions?: ActionButton[] } => {
    const role = user?.role || 'guest';
    const page = getCurrentPageContext();
    
    let contextHint = '';
    if (page !== 'general' && page !== 'login' && page !== 'dashboard') {
      contextHint = `\nI see you're on the ${page.replace('-', ' ')} page.`;
    }

    const actions: ActionButton[] = role === 'student' 
      ? [
          { label: 'Exam Schedule', action: 'query', value: 'exam schedule' },
          { label: 'View Results', action: 'query', value: 'how to view results' },
          { label: 'Hall Ticket', action: 'query', value: 'hall ticket procedure' },
        ]
      : role === 'faculty'
      ? [
          { label: 'Marks Entry', action: 'query', value: 'marks entry procedure' },
          { label: 'My Duties', action: 'query', value: 'supervisor duties' },
          { label: 'Proctoring', action: 'query', value: 'proctoring guidelines' },
        ]
      : role === 'admin'
      ? [
          { label: 'Schedule Exam', action: 'query', value: 'exam scheduling' },
          { label: 'Allocate Faculty', action: 'query', value: 'faculty allocation' },
          { label: 'Publish Results', action: 'query', value: 'result publication' },
        ]
      : [];
    
    return {
      text: `Good day. I am Ed – the built-in academic assistant for EduSync.${contextHint}\nHow may I assist you?`,
      actions: actions.length > 0 ? actions : undefined
    };
  };

  const getQuickActions = (): QuickAction[] => {
    const role = user?.role || 'guest';
    const page = getCurrentPageContext();

    // Page-specific quick actions
    if (page === 'results') {
      return [
        { label: 'Revaluation', query: 'revaluation process' },
        { label: 'Grade System', query: 'grading scale' },
      ];
    }
    if (page === 'kt-section') {
      return [
        { label: 'Apply for KT', query: 'KT application process' },
        { label: 'KT Fees', query: 'KT exam fees' },
      ];
    }
    if (page === 'marks-entry') {
      return [
        { label: 'Entry Steps', query: 'marks entry steps' },
        { label: 'Deadline', query: 'marks submission deadline' },
      ];
    }

    // Role-based defaults
    switch (role) {
      case 'student':
        return [
          { label: 'Exam Schedule', query: 'exam schedule' },
          { label: 'Results', query: 'view results' },
          { label: 'Hall Ticket', query: 'hall ticket' },
        ];
      case 'faculty':
        return [
          { label: 'Marks Entry', query: 'marks entry' },
          { label: 'Duties', query: 'supervisor duties' },
        ];
      case 'admin':
        return [
          { label: 'Schedule', query: 'exam scheduling' },
          { label: 'Allocate', query: 'faculty allocation' },
        ];
      default:
        return [{ label: 'Help', query: 'help' }];
    }
  };

  interface QueryResponse {
    text: string;
    actions?: ActionButton[];
    allowed: boolean;
  }

  // Input validation and sanitization
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  // Check if query contains prohibited content
  const isProhibitedContent = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    const prohibitedPatterns = [
      /hack|exploit|bypass|unauthorized|illegal|fraud|cheat|malicious/i,
      /delete|remove|drop|truncate|alter|modify database/i,
      /script|javascript|onclick|onerror|eval|exec/i,
      /password|secret|token|key|credential/i,
      /sql injection|xss|csrf|vulnerability/i,
    ];
    return prohibitedPatterns.some(pattern => pattern.test(lowerQuery));
  };

  // Check if query is inappropriate or offensive
  const isInappropriate = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    const inappropriatePatterns = [
      /curse|swear|profanity|offensive|insult/i,
      /spam|advertisement|promotion|sell|buy/i,
      /personal attack|harassment|threat/i,
    ];
    return inappropriatePatterns.some(pattern => pattern.test(lowerQuery));
  };

  const processQuery = (query: string): QueryResponse => {
    const sanitizedQuery = sanitizeInput(query);
    const lowerQuery = sanitizedQuery.toLowerCase().trim();
    const role = user?.role || 'guest';
    const page = getCurrentPageContext();

    // Block prohibited content
    if (isProhibitedContent(sanitizedQuery)) {
      return {
        text: `I cannot assist with that request. Please ask about academic processes, exam schedules, results, or institutional procedures.`,
        allowed: false
      };
    }

    // Block inappropriate content
    if (isInappropriate(sanitizedQuery)) {
      return {
        text: `I maintain a professional environment. Please rephrase your question appropriately.`,
        allowed: false
      };
    }

    // Block empty or very short queries
    if (lowerQuery.length < 2) {
      return {
        text: `Please provide a more specific question.`,
        allowed: false
      };
    }

    // Greetings
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(lowerQuery)) {
      return { text: `Good day. How may I assist you?`, allowed: true };
    }

    if (/^(thanks|thank you)/.test(lowerQuery)) {
      return { text: `You are welcome. Any other questions?`, allowed: true };
    }

    if (/^(bye|goodbye)/.test(lowerQuery)) {
      return { text: `Good day.`, allowed: true };
    }

    // Identity
    if (lowerQuery.includes('who are you') || lowerQuery.includes('what are you')) {
      return { 
        text: `I am Ed – the built-in academic assistant for EduSync. I explain institutional processes and guide you to correct procedures. I cannot modify records or approve requests.`,
        allowed: true
      };
    }

    // ============ PROHIBITED REQUESTS ============
    if (lowerQuery.includes('change my') || lowerQuery.includes('modify my') || lowerQuery.includes('update my') || 
        lowerQuery.includes('edit my') || lowerQuery.includes('alter my')) {
      return { 
        text: `I cannot modify records. For corrections, contact your department office or examination cell with proper documentation.`,
        allowed: false
      };
    }

    if (lowerQuery.includes('will i pass') || lowerQuery.includes('predict') || lowerQuery.includes('forecast')) {
      return { 
        text: `I cannot predict outcomes. Results are determined by the evaluation committee based on established criteria.`,
        allowed: false
      };
    }

    if (lowerQuery.includes('bypass') || lowerQuery.includes('exception') || lowerQuery.includes('skip') || 
        lowerQuery.includes('waive') || lowerQuery.includes('override')) {
      return { 
        text: `I cannot facilitate policy exceptions. Submit a written request to the appropriate authority for special consideration.`,
        allowed: false
      };
    }

    // Block requests to access/modify other users' data
    if (lowerQuery.includes('other student') || lowerQuery.includes('another student') || 
        lowerQuery.includes('someone else') || lowerQuery.includes('other user')) {
      return {
        text: `I can only provide information about your own records. For queries about other students, contact the administration.`,
        allowed: false
      };
    }

    // Block requests for system/admin functions from non-admins
    if (role !== 'admin' && (
      lowerQuery.includes('system') && (lowerQuery.includes('access') || lowerQuery.includes('login') || lowerQuery.includes('admin')) ||
      lowerQuery.includes('database') || lowerQuery.includes('server') || lowerQuery.includes('backend')
    )) {
      return {
        text: `System administration functions are restricted. Contact IT support for technical issues.`,
        allowed: false
      };
    }

    // ============ ROLE RESTRICTIONS ============
    if (role === 'student' && (
      lowerQuery.includes('enter mark') || lowerQuery.includes('publish result') || 
      lowerQuery.includes('submit mark') || lowerQuery.includes('grade student') ||
      lowerQuery.includes('faculty allocation') || lowerQuery.includes('assign duty')
    )) {
      return { 
        text: `This function requires faculty or admin access. Contact your department for assistance.`,
        allowed: false
      };
    }

    if (role === 'faculty' && (
      lowerQuery.includes('publish result') || lowerQuery.includes('declare result') ||
      lowerQuery.includes('schedule exam') || lowerQuery.includes('allocate faculty') ||
      lowerQuery.includes('system admin') || lowerQuery.includes('database')
    )) {
      return {
        text: `This function requires admin access. Contact the examination cell for assistance.`,
        allowed: false
      };
    }

    if (role === 'guest' && (
      lowerQuery.includes('result') || lowerQuery.includes('mark') || lowerQuery.includes('grade') ||
      lowerQuery.includes('hall ticket') || lowerQuery.includes('kt') || lowerQuery.includes('backlog')
    )) {
      return {
        text: `Please sign in to access student-specific information.`,
        allowed: false
      };
    }

    // ============ STUDENT QUERIES ============
    if (role === 'student' || role === 'guest') {
      // Exam schedule
      if (lowerQuery.includes('exam') && (lowerQuery.includes('schedule') || lowerQuery.includes('when') || lowerQuery.includes('timetable'))) {
        return {
          text: `To view your exam schedule:\n1. Go to Exam Timetable\n2. View dates, times, and venues\n\nSchedules are subject to official announcements. Report conflicts to your department.`,
          actions: [
            { label: 'Go to Timetable', action: 'navigate', value: '/student/exam-timetable' },
            { label: 'Hall Ticket', action: 'query', value: 'hall ticket procedure' }
          ],
          allowed: true
        };
      }

      // Results
      if (lowerQuery.includes('result') || lowerQuery.includes('grade') || lowerQuery.includes('marks') || lowerQuery.includes('cgpa')) {
        return {
          text: `To view results:\n1. Go to Results section\n2. Select semester\n3. View subject-wise grades\n\nGrading: A (90%+), B (80-89%), C (70-79%), D (60-69%), F (<60%)`,
          actions: [
            { label: 'View Results', action: 'navigate', value: '/student/results' },
            { label: 'Revaluation', action: 'query', value: 'revaluation process' }
          ],
          allowed: true
        };
      }

      // Hall ticket
      if (lowerQuery.includes('hall ticket') || lowerQuery.includes('admit card')) {
        return {
          text: `Hall ticket requirements:\n• Fees cleared\n• No outstanding dues\n• 75% attendance\n\nDownload from Pre Exam section. Carry printed copy with ID to exam.`,
          actions: [
            { label: 'Go to Pre Exam', action: 'navigate', value: '/student/exam-prerequisites' }
          ],
          allowed: true
        };
      }

      // KT
      if (lowerQuery.includes('kt') || lowerQuery.includes('supplementary') || lowerQuery.includes('backlog')) {
        return {
          text: `KT Exam Process:\n1. Go to KT Section\n2. View backlog subjects\n3. Apply and pay fee (~₹500/subject)\n4. Download KT hall ticket\n\nCheck announcements for application window.`,
          actions: [
            { label: 'Go to KT Section', action: 'navigate', value: '/student/kt-section' }
          ],
          allowed: true
        };
      }

      // Placement
      if (lowerQuery.includes('placement') || lowerQuery.includes('eligible')) {
        return {
          text: `Placement criteria (typical):\n• No active backlogs\n• Min 60% aggregate\n• 75% attendance\n\nCheck your status in Placement Eligibility section.`,
          actions: [
            { label: 'Check Eligibility', action: 'navigate', value: '/student/placement-eligibility' }
          ],
          allowed: true
        };
      }

      // Revaluation
      if (lowerQuery.includes('revaluation') || lowerQuery.includes('recheck')) {
        return {
          text: `Revaluation process:\n1. Apply for answer sheet photocopy\n2. Review against marking scheme\n3. Submit revaluation request (₹300-500)\n4. Wait 2-3 weeks\n\nApply within 7-10 days of result. Decision is final.`,
          allowed: true
        };
      }

      // Attendance
      if (lowerQuery.includes('attendance')) {
        return {
          text: `Attendance requirement: 75% minimum\n\nBelow 75%: Warning\nBelow 65%: Exam detention possible\n\nMedical leave requires certificate within 7 days of return.`,
          allowed: true
        };
      }

      // Fee
      if (lowerQuery.includes('fee') || lowerQuery.includes('payment')) {
        return {
          text: `Fees must be paid before hall ticket generation.\n\nPayment: Online portal or accounts office\nKT Fee: ~₹500 per subject\n\nKeep receipts for reference.`,
          allowed: true
        };
      }
    }

    // ============ FACULTY QUERIES ============
    if (role === 'faculty') {
      if (lowerQuery.includes('mark') && (lowerQuery.includes('enter') || lowerQuery.includes('entry'))) {
        return {
          text: `Marks Entry:\n1. Go to Marks Calculation\n2. Enter classroom & faculty code\n3. Authenticate\n4. Enter marks\n5. Submit for verification\n\nMarks lock after deadline. Post-deadline corrections need Exam Controller approval.`,
          actions: [
            { label: 'Go to Marks Entry', action: 'navigate', value: '/faculty/marks-calculation' }
          ],
          allowed: true
        };
      }

      if (lowerQuery.includes('duty') || lowerQuery.includes('supervisor') || lowerQuery.includes('invigil')) {
        return {
          text: `View duties in Supervisor Duty section.\n\nResponsibilities:\n• Report 30 min early\n• Verify hall tickets & IDs\n• Distribute papers\n• Monitor for irregularities\n• Submit attendance report\n\nFor duty swap, contact exam coordinator.`,
          actions: [
            { label: 'View Duties', action: 'navigate', value: '/faculty/supervisor-duty' }
          ],
          allowed: true
        };
      }

      if (lowerQuery.includes('proctor') || lowerQuery.includes('ufm')) {
        return {
          text: `Proctoring:\n1. Go to Proctor Section\n2. Enter classroom number\n3. Monitor feeds\n4. Report UFM with evidence\n\nUFM decisions are made by committee.`,
          actions: [
            { label: 'Proctor Section', action: 'navigate', value: '/faculty/proctor-section' }
          ],
          allowed: true
        };
      }

      if (lowerQuery.includes('evaluat')) {
        return {
          text: `End Semester Evaluation:\n1. Select subject & batch\n2. Enter component marks\n3. Submit for verification\n\nComponents: Internal (20%), Mid-sem (20%), End-sem (60%)`,
          actions: [
            { label: 'Go to Evaluation', action: 'navigate', value: '/faculty/end-semester-evaluation' }
          ],
          allowed: true
        };
      }
    }

    // ============ ADMIN QUERIES ============
    if (role === 'admin') {
      if (lowerQuery.includes('schedule') || lowerQuery.includes('timetable')) {
        return {
          text: `Exam Scheduling:\n1. Go to Exam Prerequisites\n2. Configure parameters\n3. Generate timetable\n4. Review conflicts\n5. Publish\n\nSystem detects student/faculty/room conflicts automatically.`,
          actions: [
            { label: 'Exam Prerequisites', action: 'navigate', value: '/admin/exam-prerequisites' }
          ],
          allowed: true
        };
      }

      if (lowerQuery.includes('allocat') || lowerQuery.includes('assign faculty')) {
        return {
          text: `Faculty Allocation:\n1. Go to Supervisory Duty Section\n2. View available faculty\n3. Assign duties (consider load balancing)\n4. Notify assigned faculty\n\nSwap requests need coordinator approval.`,
          actions: [
            { label: 'Supervisory Duty', action: 'navigate', value: '/admin/supervisory-duty' }
          ],
          allowed: true
        };
      }

      if (lowerQuery.includes('publish') || lowerQuery.includes('declare result')) {
        return {
          text: `Result Publication:\n1. Verify all marks submitted\n2. Apply moderation/grace\n3. Review summary\n4. Publish\n\nPublication is irreversible for the cycle. Ensure all verification complete.`,
          actions: [
            { label: 'Post Exam', action: 'navigate', value: '/admin/post-exam' }
          ],
          allowed: true
        };
      }

      if (lowerQuery.includes('status') || lowerQuery.includes('system')) {
        return {
          text: `System Status: Operational\n\nDatabase: Connected\nAuth: Active\nBackup: Daily 03:00\n\nFor technical issues, contact IT helpdesk.`,
          allowed: true
        };
      }
    }

    // ============ GENERAL QUERIES ============
    if (lowerQuery.includes('contact') || lowerQuery.includes('help desk')) {
      return {
        text: `Exam Cell: examcell@university.edu\nIT Helpdesk: itsupport@university.edu\nHours: Mon-Fri, 9AM-5PM`,
        allowed: true
      };
    }

    if (lowerQuery.includes('deadline') || lowerQuery.includes('last date')) {
      return {
        text: `General timelines:\n• Exam form: 30 days before\n• Fee payment: 15 days before\n• Hall ticket: 7 days before\n• Revaluation: 7-10 days after result\n\nCheck announcements for exact dates.`,
        allowed: true
      };
    }

    if (lowerQuery.includes('help')) {
      const topics = role === 'student' 
        ? 'exam schedules, results, hall tickets, KT exams, placement eligibility, fees, revaluation'
        : role === 'faculty'
        ? 'marks entry, supervisor duties, proctoring, evaluation'
        : role === 'admin'
        ? 'exam scheduling, faculty allocation, result publication, system status'
        : 'login, system overview';
      
      return { 
        text: `You can ask about: ${topics}.`,
        allowed: true
      };
    }

    // Page-specific context help
    if (lowerQuery.includes('this page') || lowerQuery.includes('what is this') || lowerQuery.includes('how to use')) {
      const pageHelp: Record<string, string> = {
        'results': 'This page shows your exam results. Select semester to view grades.',
        'exam-timetable': 'View your exam schedule here. Dates and venues are listed.',
        'kt-section': 'Apply for KT/supplementary exams here. Select backlog subjects and pay fee.',
        'marks-entry': 'Enter student marks here. Authenticate with faculty code first.',
        'proctoring': 'Monitor exams here. Enter classroom number to view feeds.',
        'dashboard': 'Overview of your activities and upcoming tasks.',
      };
      
      if (pageHelp[page]) {
        return { 
          text: pageHelp[page],
          allowed: true
        };
      }
    }

    // Default - allow but provide helpful guidance
    return { 
      text: `I don't have specific information on that. Try asking about ${role === 'student' ? 'exams, results, or hall tickets' : role === 'faculty' ? 'marks entry or duties' : 'scheduling or allocation'}.`,
      actions: getQuickActions().slice(0, 2).map(q => ({ label: q.label, action: 'query' as const, value: q.query })),
      allowed: true
    };
  };

  const handleSend = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    // Validate input length
    if (trimmedInput.length > 500) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Please keep your message under 500 characters.',
        sender: 'ed',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(trimmedInput);
      
      // Only add response if allowed
      if (response.allowed !== false) {
        const edMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'ed',
          timestamp: new Date(),
          actions: response.actions
        };
        setMessages(prev => [...prev, edMessage]);
      } else {
        // For disallowed queries, show the response but mark it differently
        const edMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'ed',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, edMessage]);
      }
      setIsTyping(false);
    }, 400 + Math.random() * 300);
  };

  const handleActionClick = (action: ActionButton) => {
    if (action.action === 'navigate') {
      navigate(action.value);
      setIsOpen(false);
    } else if (action.action === 'query') {
      // Trigger the query
      const userMessage: Message = {
        id: Date.now().toString(),
        text: action.value,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const response = processQuery(action.value);
        // Only add response if allowed
        if (response.allowed !== false) {
          const edMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'ed',
            timestamp: new Date(),
            actions: response.actions
          };
          setMessages(prev => [...prev, edMessage]);
        } else {
          const edMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: response.text,
            sender: 'ed',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, edMessage]);
        }
        setIsTyping(false);
      }, 400 + Math.random() * 300);
    }
  };

  const handleQuickAction = (query: string) => {
    handleActionClick({ label: '', action: 'query', value: query });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 overflow-hidden hover:scale-105"
        aria-label="Open Ed Assistant"
      >
        <img 
          src="/images/ed-bot.png" 
          alt="Ed" 
          className="w-full h-full object-cover"
        />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col z-50 transition-all duration-200 ${
        isMinimized ? 'w-64 h-12' : 'w-80 h-[26rem]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-600 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <img 
            src="/images/ed-bot.png" 
            alt="Ed" 
            className="w-7 h-7 object-contain bg-white rounded-full p-0.5"
          />
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm leading-tight">Ed</span>
            <span className="text-blue-200 text-[10px] leading-tight">Academic Assistant</span>
          </div>
        </div>
        <div className="flex items-center space-x-0.5">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-3.5 h-3.5 text-white/80" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5 text-white/80" />
            )}
          </button>
          <button
            onClick={() => { setIsOpen(false); setIsMinimized(false); }}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50 dark:bg-gray-950">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] px-3 py-2 rounded-lg text-[13px] leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {message.text.split('\n').map((line, i) => (
                      <div key={i} className={line.startsWith('•') || /^\d+\./.test(line) ? 'ml-2' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action buttons */}
                {message.sender === 'ed' && message.actions && message.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5 ml-1">
                    {message.actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleActionClick(action)}
                        className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Timestamp */}
                <div className={`text-[10px] text-gray-400 mt-0.5 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap gap-1.5">
                {getQuickActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className="px-2.5 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EdChatbot;
