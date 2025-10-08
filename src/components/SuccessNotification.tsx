import { CheckIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface SuccessNotificationProps {
  show: boolean;
  message: string;
}

export const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  show,
  message,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] w-[calc(100%-40px)] max-w-md"
        >
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl shadow-[0px_10px_25px_-5px_#10b98140] p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-base">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
