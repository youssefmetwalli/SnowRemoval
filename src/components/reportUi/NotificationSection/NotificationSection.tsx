import { ArrowLeftIcon, MapPinIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { cn } from "../../../lib/utils";
import { useRoute } from "../../../hook/getRoute";


interface NotificationSectionProps {
  selectedLocationId?: number | null;
  onLocationSelect?: (location: { id: number; name: string }) => void;
  title?: string;
  navigateTo: string;
  workerName: string | null;
  error?: string;
}

export const NotificationSection = ({
  selectedLocationId,
  onLocationSelect,
  title,
  navigateTo,
  workerName,
  error,
}: NotificationSectionProps): JSX.Element => {
  const navigate = useNavigate();
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(
    selectedLocationId ?? null
  );

  const { data: workPlaceData, isLoading: isLoadingWorkPlace, isError: isErrorWorkPlace } = useRoute(workerName ?? undefined);
  const pickWorkPlaces = workPlaceData?.map((workPlaceData, index) => ({
    id: workPlaceData.field_workPlaceId[1],
    name: workPlaceData.field_workPlaceName ?? "名称未設定",
  }));
  const workPlaces = Array.from(new Map(pickWorkPlaces?.map((place) => [place.name, place])).values());

  useEffect(() => {
    if (selectedLocationId !== undefined) {
      setInternalSelectedId(selectedLocationId ?? null);
    }
  }, [selectedLocationId]);

  const handleSelect = useCallback(
    (loc: { id: number; name: string }) => {
      if (selectedLocationId === undefined) setInternalSelectedId(loc.id);
      onLocationSelect?.(loc);
    },
    [onLocationSelect, selectedLocationId]
  );

  const currentSelected = selectedLocationId ?? internalSelectedId;

  console.log("selectedLocationId:", selectedLocationId);
  console.log("internalSelectedId:", internalSelectedId);
  console.log("currentSelected:", currentSelected);

  return (
    <header className="flex flex-col w-full items-start gap-3 pt-5 pb-2 px-5 relative bg-transparent shadow-[0px_2px_4px_#0000001a] bg-[linear-gradient(158deg,rgba(59,130,246,1)_0%,rgba(37,99,235,1)_100%)] translate-y-[-1rem] animate-fade-in opacity-0">
      {/* Header Bar */}
      <div className="flex items-center justify-between w-full pt-6">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-lg bg-white text-blue-600 text-3xl font-bold shadow-md 
             hover:bg-blue-100 hover:scale-105 transition-all"
          onClick={() => navigate(navigateTo)}
        >
          <ArrowLeftIcon className="w-5 h-5 text-blue text-3xl" />
        </Button>

        <div className="flex-1 flex justify-center">
          <h1 className="text-white font-semibold text-lg">
            {title ?? "日報入力"}
          </h1>
        </div>

        <div className="w-9" />
      </div>

      {/* Location chips */}
      <div className="w-full">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-3 text-lg">
            {workPlaces?.map((location) => {
              const selected = currentSelected === Number(location.id);
              return (
                <Badge
                  key={Number(location.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selected}
                  onClick={() => handleSelect({ id: Number(location.id) , name: location.name})}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect({ id: Number(location.id) , name: location.name});
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[20px] whitespace-nowrap cursor-pointer select-none border transition-colors duration-150 ease-out",
                    "focus:outline-none focus-visible:ring-0",
                    selected
                      ? "bg-amber-400 text-amber-900 border-transparent shadow-md hover:bg-sky-300 hover:text-blue-900"
                      : "bg-white text-blue-900 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow"
                  )}
                >
                  <MapPinIcon
                    className={cn(
                      "w-4 h-4",
                      selected ? "text-amber-900" : "text-blue-500"
                    )}
                  />
                  {location.name}
                </Badge>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {error && (
          <p className="text-red-100 bg-red-500/20 rounded-md mt-1 px-2 py-1 text-sm font-medium">
            {error}
          </p>
        )}
      </div>
    </header>
  );
};
