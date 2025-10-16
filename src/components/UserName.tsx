
export const UserName = (): JSX.Element => {
  const userName = localStorage.getItem('loggedInUser');
  
  return (
    <div className="w-full text-white shadow-md rounded-b-2xl">
      <div className="flex items-center justify-between bg-white text-gray-800 rounded-xl shadow p-4">
        <div className="flex items-center gap-4">
          {/* <Avatar className="w-12 h-12 rounded-full shadow-md">
              <AvatarFallback className="bg-blue-400 text-white font-bold text-lg">
                田中
              </AvatarFallback>
            </Avatar> */}
          <div className="flex flex-row items-center">
            <p className="font-semibold text-base pr-5">{userName}</p>
            {/* <p className="text-sm text-gray-500">作業責任者</p> */}
          </div>
        </div>
        <p className="text-sm text-gray-400">2025年2月2日(日)</p>
      </div>
    </div>
  );
};
