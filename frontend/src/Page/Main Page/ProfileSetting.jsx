import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import ProfileSettingSection from "../../Component/ui/ProfileSettingSection";

const ProfileSetting = () => {
  const [selected, setSelected] = useState("My Profile");

  const navigate = useNavigate();

  const handleSelected = (section) => {
    setSelected(section);
    navigate(`/manage-profile/${section}`);
  };

  return (
    <div className="text-f-dark h-full p-4 md:p-6 2xl:p-8 font-Poppins flex flex-col gap-4 md:gap-8 ">
      <nav className="w-full">
        <div className="flex gap-4 w-1/4">
          <div
            className={`h-auto flex items-center rounded-full px-4 py-2 cursor-pointer text-nowrap ${
              selected === "My Profile"
                ? "bg-[#E0EAEA] text-c-primary border border-c-primary font-semibold"
                : "text-f-dark font-md border  bg-white"
            }`}
            onClick={() => handleSelected("My Profile")}
          >
            <FiUser className="h-6 w-6 md:mr-2" />
            <h1>My Profile</h1>
          </div>
          <div
            className={`h-auto flex items-center rounded-full px-4 py-2 cursor-pointer text-nowrap ${
              selected === "Account"
                ? "bg-[#E0EAEA] text-c-primary border border-c-primary font-semibold"
                : "text-f-dark font-md border  bg-white"
            }`}
            onClick={() => handleSelected("Account")}
          >
            <FiUserCheck className="h-6 w-6 md:mr-2" />
            <h1>Account</h1>
          </div>
        </div>
      </nav>
      <div className="w-full flex justify-center overflow-y-scroll">
        <div className="lg:w-3/5 w-full">
          {selected && <ProfileSettingSection selected={selected} />}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
