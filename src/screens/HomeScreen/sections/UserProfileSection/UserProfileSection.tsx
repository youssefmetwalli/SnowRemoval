import { UserName } from "../../../../components/UserName";

export const UserProfileSection = (): JSX.Element => {

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
        </div>

        {/* Profile info */}
        <UserName />
      </div>
    </header>
  );
};
