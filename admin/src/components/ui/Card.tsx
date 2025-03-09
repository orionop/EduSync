import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
      className={`
        bg-glass dark:bg-glass-dark backdrop-blur-glass
        rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50
        p-6 overflow-hidden ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;