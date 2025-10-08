import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export const UserProfileSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md rounded-b-2xl">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-md">
              <span className="text-blue-500 text-xl">❄</span>
            </div>
            <h1 className="font-bold text-lg">除雪作業日報</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-lg bg-white text-blue-600 text-3xl font-bold shadow-md 
             hover:bg-blue-100 hover:scale-105 transition-all"
            onClick={() => navigate("/loginscreen")}
          >
            <ArrowRightIcon className="w-5 h-5 text-blue text-3xl" />
          </Button>
        </div>

        {/* Profile info */}
        <div className="flex items-center justify-between bg-white text-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 rounded-full shadow-md">
              <AvatarFallback className="bg-blue-400 text-white font-bold text-lg">
                田中
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base">田中 太郎</p>
              <p className="text-sm text-gray-500">作業責任者</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">2025年2月2日(日)</p>
        </div>
      </div>
    </header>
  );
};
