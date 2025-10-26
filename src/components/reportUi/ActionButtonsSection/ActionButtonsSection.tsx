import React from "react";
import { Button } from "../../ui/button";

interface Props {
  isValid: boolean;
  isDirty: boolean;
  isSubmitting?: boolean;
}

export const ActionButtonsSection: React.FC<Props> = ({ 
  isValid, 
  isDirty, 
  isSubmitting = false 
}) => {
  const isEnabled = isValid && isDirty && !isSubmitting;
  
  return (
    <section className="flex flex-col w-full items-start gap-3 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
      <Button
        type="submit"
        disabled={!isEnabled}
        className={`h-12 w-full font-bold text-base rounded-[10px] transition-colors ${
          isEnabled 
            ? "bg-blue-500 hover:bg-blue-600 text-white" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "送信中..." : "保存"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full bg-white hover:bg-blue-50 border-slate-200 rounded-[10px] transition-colors"
      >
        続けて作業を登録
      </Button>
    </section>
  );
};