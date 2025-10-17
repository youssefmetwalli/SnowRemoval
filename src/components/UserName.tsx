
export const UserName = (): JSX.Element => {
  const rawUserData = localStorage.getItem('loggedInUser');
  let name: string | null = null;
  try {
    if(rawUserData){
      const userData = JSON.parse(rawUserData);
      name = userData?.field_1754549790;
    }
    
  } catch (error) {
    console.error("Failed to parse JSON from localStrage.", error);
  }
  const date = new Date();
  const weekday = new Intl.DateTimeFormat('jp-JP', {
    weekday: "short"
  }).format(date);

  return (
    <div className="w-full text-white shadow-md rounded-b-2xl mb-3">
      <div className="flex items-center justify-between bg-white text-gray-800 rounded-xl shadow p-4">
        <div className="flex items-center gap-4">
          {/* <Avatar className="w-12 h-12 rounded-full shadow-md">
              <AvatarFallback className="bg-blue-400 text-white font-bold text-lg">
                田中
              </AvatarFallback>
            </Avatar> */}
          <div className="flex flex-row items-center">
            <p className="font-semibold text-base pr-5">{name}</p>
            {/* <p className="text-sm text-gray-500">作業責任者</p> */}
          </div>
        </div>
        <p className="text-sm text-gray-400">{date.getFullYear()}年{date.getMonth()+1}月{date.getDate()}日({weekday})</p>
      </div>
    </div>
  );
};
