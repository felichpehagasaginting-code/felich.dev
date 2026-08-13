'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ShortcutHint() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="text-center"
    >
      <p className="text-xs text-[var(--text-muted)]">
        {t('shortcut_hint')}
      </p>
    </motion.div>
  );
}