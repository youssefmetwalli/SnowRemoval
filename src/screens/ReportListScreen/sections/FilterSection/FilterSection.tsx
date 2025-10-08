import { XIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";

export const FilterSection = (): JSX.Element => {
  const filters = [
    {
      label: "日付: 2025/02/02",
      id: "date",
    },
    {
      label: "作業分類: 除雪",
      id: "category",
    },
  ];

  return (
    <section className="w-full items-start gap-2 pt-3 pb-[13px] px-5 bg-white overflow-x-auto border-b border-slate-200 flex translate-y-[-1rem] animate-fade-in opacity-0">
      {filters.map((filter, index) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className={`inline-flex items-center gap-1 pt-[7px] pb-[9px] px-[13px] flex-shrink-0 bg-zumthor rounded-2xl border border-solid border-[#e9ecef] font-inter-medium font-[number:var(--inter-medium-font-weight)] text-royal-blue text-[length:var(--inter-medium-font-size)] tracking-[var(--inter-medium-letter-spacing)] leading-[var(--inter-medium-line-height)] [font-style:var(--inter-medium-font-style)] hover:bg-zumthor/80 transition-colors cursor-pointer translate-y-[-1rem] animate-fade-in opacity-0`}
          style={
            {
              "--animation-delay": `${(index + 1) * 200}ms`,
            } as React.CSSProperties
          }
        >
          <span className="flex items-center justify-center whitespace-nowrap">
            {filter.label}
          </span>
          <XIcon className="w-3.5 h-3.5 hover:text-royal-blue/70 transition-colors" />
        </Badge>
      ))}
    </section>
  );
};
