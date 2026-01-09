import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, X } from 'lucide-react';

interface AnnouncementBannerProps {
  announcements: {
    id: string;
    message: string;
    messageMarathi?: string;
    link?: string;
    isImportant: boolean;
  }[];
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isMarathi, setIsMarathi] = useState(false);
  
  // Filter important announcements
  const importantAnnouncements = announcements.filter(a => a.isImportant);
  
  useEffect(() => {
    if (importantAnnouncements.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsMarathi(prev => !prev);
      if (isMarathi) {
        setCurrentIndex(prevIndex => 
          prevIndex === importantAnnouncements.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 4000); // Change language/announcement every 4 seconds
    
    return () => clearInterval(interval);
  }, [importantAnnouncements.length, isMarathi]);
  
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);
  
  const handleClose = () => {
    setIsClosing(true);
  };
  
  if (!isVisible || importantAnnouncements.length === 0) return null;
  
  const currentAnnouncement = importantAnnouncements[currentIndex];
  
  return (
    <div 
      className={`bg-gradient-to-r from-red-500/90 to-red-700/90 text-white transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 flex items-center gap-1 bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse">
            <AlertCircle className="h-3 w-3" />
            {isMarathi ? 'नवीन' : 'NEW'}
          </div>
          
          <div className="flex-1 text-center mx-4 whitespace-nowrap overflow-hidden text-ellipsis font-marathi">
            {isMarathi && currentAnnouncement.messageMarathi 
              ? currentAnnouncement.messageMarathi 
              : currentAnnouncement.message}
          </div>
          
          <div className="flex items-center gap-2">
            {currentAnnouncement.link && (
              <a 
                href={currentAnnouncement.link} 
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 transition-colors"
              >
                {isMarathi ? 'पहा' : 'View'}
                <ChevronRight className="h-3 w-3" />
              </a>
            )}
            
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;