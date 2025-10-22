'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <Image src="/footballtop-logo-13.png" alt="Football Top Logo" width={200} height={57} priority />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg text-gray-300 mt-2"
        >
          人生が変わる体験を
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
