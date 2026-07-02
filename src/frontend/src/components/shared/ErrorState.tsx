import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/context';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-primary" />
        <h2 className="text-xl font-heading font-semibold text-foreground">
          {t('error.default')}
        </h2>
        <p className="text-sm font-body text-muted-foreground max-w-sm">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-squircle bg-primary text-primary-foreground font-body text-sm font-medium transition-all duration-300 hover:opacity-90 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            {t('error.retry')}
          </button>
        )}
      </div>
    </motion.div>
  );
}
