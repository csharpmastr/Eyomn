import React from "react";

const ProfileSettingSection = ({ selected }) => {
  return (
    <div className="w-full h-full flex flex-col gap-8">
      {selected === "My Profile" && (
        <div className="w-full border border-f-gray bg-white rounded-lg p-10 h-full flex flex-col justify-between">
          My Profile
        </div>
      )}
      {selected === "Account" && (
        <div className="w-full border border-f-gray bg-white rounded-lg p-10 h-full flex flex-col justify-between">
          Account
        </div>
      )}
    </div>
  );
};

export default ProfileSettingSection;
