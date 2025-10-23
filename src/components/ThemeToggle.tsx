import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

const ThemeToggle = ({ isDark, onToggle, className = "" }: ThemeToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={`relative overflow-hidden border-emerald-200 hover:bg-emerald-50 dark:border-emerald-700 dark:hover:bg-emerald-900/50 ${className}`}
    >
      <motion.div
        className="flex items-center gap-2"
        initial={false}
        animate={{ scale: isDark ? [1, 0.8, 1] : [1, 0.8, 1] }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? 180 : 0,
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Sun size={16} className="text-yellow-600" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDark ? 0 : -180,
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <Moon size={16} className="text-blue-400" />
        </motion.div>
        
        {/* Spacer to maintain button width */}
        <div className="w-4 h-4 opacity-0" />
        
        <span className="ml-1 text-sm">
          {isDark ? 'Dark' : 'Light'}
        </span>
      </motion.div>
      
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
        initial={false}
        animate={{ 
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
    </Button>
  );
};

export default ThemeToggle;