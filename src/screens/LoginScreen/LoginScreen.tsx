import { LockIcon, UserIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export const LoginScreen = (): JSX.Element => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/homescreen");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-6 bg-gradient-to-b from-sky-50 to-sky-100"
      data-model-id="1:53"
    >
      <div className="flex flex-col w-full max-w-sm items-center gap-12">
        {/* Logo and Header Section */}
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          <div className="flex w-20 h-20 items-center justify-center rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-500 to-blue-800">
            <img
              className="w-12 h-12"
              alt="Logo"
              src="https://c.animaapp.com/mg8tl4lwEWxGtx/img/component-1-2.svg"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-gray-900 text-2xl text-center">
              除雪作業日報
            </h1>
            <p className="font-medium text-gray-500 text-sm text-center">
              作業記録管理システム
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="w-full bg-white rounded-2xl shadow-md border-0 animate-fade-in">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* User ID */}
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-gray-700 text-sm">
                  ユーザーID
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    className="h-12 pl-14 pr-4 bg-white rounded-xl border border-gray-300 text-base"
                    placeholder="IDを入力"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label className="font-medium text-gray-700 text-sm">
                  パスワード
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <LockIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="password"
                    className="h-12 pl-14 pr-4 bg-white rounded-xl border border-gray-300 text-base"
                    placeholder="パスワードを入力"
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="h-12 rounded-xl shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 text-white font-bold text-base transition"
              >
                ログイン
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
