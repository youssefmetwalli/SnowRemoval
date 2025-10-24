import { ArrowLeftIcon, FilterIcon, SearchIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { FilterMenu } from "../FilterMenu/FilterMenu";


interface HeaderSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const HeaderSection = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <FilterMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <header className="flex flex-col w-full items-start gap-4 pt-5 pb-4 px-5 relative bg-transparent shadow-[0px_2px_4px_#0000001a] bg-[linear-gradient(158deg,rgba(59,130,246,1)_0%,rgba(37,99,235,1)_100%)] translate-y-[-1rem] animate-fade-in opacity-0">
        <div className="flex items-center justify-between pt-6 pb-0 px-0 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 bg-white-20 rounded-lg hover:bg-white-20/80 transition-colors translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:100ms]"
              onClick={() => navigate("/homescreen")}
            >
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </Button>

            <div className="inline-flex flex-col items-start pt-px pb-0.5 px-0 relative flex-[0_0_auto] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
              <div className="relative w-fit mt-[-1.00px] font-semantic-heading-1 font-[number:var(--semantic-heading-1-font-weight)] text-white text-[length:var(--semantic-heading-1-font-size)] tracking-[var(--semantic-heading-1-letter-spacing)] whitespace-nowrap flex items-center justify-center leading-[var(--semantic-heading-1-line-height)] [font-style:var(--semantic-heading-1-font-style)]">
                作業日報一覧
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 bg-white-20 rounded-lg hover:bg-white-20/80 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]"
            onClick={() => setIsOpen(true)}
          >
            <FilterIcon className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
          <div className="relative w-full">
            <SearchIcon className="absolute top-1/2 left-3 w-[18px] h-[18px] text-gull-gray transform -translate-y-1/2 z-10" />
            <Input
              className="h-10 pl-10 pr-3 py-3 bg-white rounded-[10px] border-0 [font-family:'Arial-Narrow',Helvetica] font-normal text-gull-gray text-sm tracking-[0] leading-[normal] placeholder:text-gull-gray focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="検索（日付、場所、作業員など）"
              defaultValue=""
            />
          </div>
        </div>
      </header>
    </>
  );
};
