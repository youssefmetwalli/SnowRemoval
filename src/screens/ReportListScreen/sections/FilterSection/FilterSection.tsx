// FilterSection.tsx
import { XIcon, CalendarIcon, MapPinIcon, LayersIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import type { ReportListFilters } from "../../ReportListScreen";

type Props = {
  filters: ReportListFilters;
  onChangeFilters: (f: ReportListFilters) => void;
};

export const FilterSection: React.FC<Props> = ({ filters, onChangeFilters }) => {
  const remove = (key: keyof ReportListFilters) => {
    onChangeFilters({ ...filters, [key]: "" });
  };

  const chips = [
    filters.date && {
      id: "date",
      label: `日付: ${filters.date.replace(/-/g, "/")}`,
      icon: <CalendarIcon className="w-4 h-4 text-blue-600" />,
    },
    filters.classification && {
      id: "classification",
      label: `作業分類: ${filters.classification}`,
      icon: <LayersIcon className="w-4 h-4 text-blue-600" />,
    },
    filters.location && {
      id: "location",
      label: `作業場所: ${filters.location}`,
      icon: <MapPinIcon className="w-4 h-4 text-blue-600" />,
    },
  ].filter(Boolean) as { id: keyof ReportListFilters; label: string; icon: React.ReactNode }[];

  if (chips.length === 0) return null;

  return (
    <div className="w-full bg-sky-50 py-3 px-4 flex flex-wrap gap-2 border-b border-sky-100">
      {chips.map((chip) => (
        <Badge
          key={chip.id}
          variant="outline"
          className="flex items-center gap-1.5 bg-white border-blue-200 text-blue-700 shadow-sm rounded-full py-1.5 px-3 hover:bg-blue-50 transition"
        >
          {chip.icon}
          <span className="font-medium text-sm">{chip.label}</span>
          <button
            onClick={() => remove(chip.id)}
            className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
          >
            <XIcon className="w-3 h-3 text-blue-500" />
          </button>
        </Badge>
      ))}
    </div>
  );
};
