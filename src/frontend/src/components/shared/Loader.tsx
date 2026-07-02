import { Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/context';

export default function Loader() {
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Coffee className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-sm font-body text-muted-foreground">
          {t('common.loading')}
        </p>
      </div>
    </div>
  );
}
