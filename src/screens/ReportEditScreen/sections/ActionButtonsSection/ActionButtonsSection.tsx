import React from "react";
import { Button } from "../../../../components/ui/button";

export const ActionButtonsSection: React.FC = () => {
  return (
    <section className="flex flex-col w-full items-start gap-3 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
      <Button
        type="submit"
        className="h-12 w-full bg-gull-gray hover:bg-gull-gray/90 text-white font-bold text-base rounded-[10px] transition-colors"
      >
        保存
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