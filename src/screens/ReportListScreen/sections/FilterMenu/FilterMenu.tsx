import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { ReportFilter } from "../../../../types/filterType";
import ReactDOM from "react-dom";

interface FilterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: ReportFilter) => void;
  currentFilters?: ReportFilter;
}

export const FilterMenu: React.FC<FilterMenuProps> = ({
  isOpen,
  onClose,
}: FilterMenuProps) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center animate-in fade-in duration-200"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-sky-50">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">フィルター設定</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* 日付フィルター */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              日付
            </label>
            <div className="flex gap-2 items-center">
              <Input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">〜</span>
              <Input
                type="date"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 作業分類フィルター */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              作業分類
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="作業分類を入力"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                追加
              </button>
            </div>
            <div className="flex flex-wrap gap-2"></div>
          </div>
        </div>
        {/* フッター */}
        <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <button className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            リセット
          </button>
          <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg">
            適用
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? ReactDOM.createPortal(modalContent, document.body)
    : modalContent;
};
