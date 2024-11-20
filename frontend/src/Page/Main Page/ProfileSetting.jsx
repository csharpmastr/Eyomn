import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiBox } from "react-icons/fi";
import ProfileSettingSection from "../../Component/ui/ProfileSettingSection";
import RoleColor from "../../assets/Util/RoleColor";

const ProfileSetting = () => {
  const role = useSelector((state) => state.reducer.user.user.role);
  const [selected, setSelected] = useState("My Profile");

  const navigate = useNavigate();

  const handleSelected = (section) => {
    setSelected(section);
    navigate(`/manage-profile/${section}`);
  };

  const { settingBtn } = RoleColor();

  return (
    <div className="text-f-dark h-full p-4 md:p-6 2xl:p-8 font-Poppins flex flex-col gap-4 md:gap-8 ">
      <nav className="w-full">
        <div className="flex gap-4 w-auto overflow-x-auto">
          <div
            className={`h-auto flex items-center rounded-full px-4 py-2 cursor-pointer text-nowrap ${
              selected === "My Profile"
                ? settingBtn
                : "text-f-gray2 font-medium border bg-f-light"
            }`}
            onClick={() => handleSelected("My Profile")}
          >
            <FiUser className="h-6 w-6 md:mr-2" />
            <h1>My Profile</h1>
          </div>
          <div
            className={`h-auto flex items-center rounded-full px-4 py-2 cursor-pointer text-nowrap ${
              selected === "Account"
                ? settingBtn
                : "text-f-gray2 font-medium border bg-f-light"
            }`}
            onClick={() => handleSelected("Account")}
          >
            <FiUserCheck className="h-6 w-6 md:mr-2" />
            <h1>Account</h1>
          </div>
          {role !== "2" && (
            <div
              className={`h-auto flex items-center rounded-full px-4 py-2 cursor-pointer text-nowrap ${
                selected === "Product Archive"
                  ? settingBtn
                  : "text-f-gray2 font-medium border bg-f-light"
              }`}
              onClick={() => handleSelected("Product Archive")}
            >
              <FiBox className="h-6 w-6 md:mr-2" />
              <h1>Product Archive</h1>
            </div>
          )}
        </div>
      </nav>
      <div className="w-full h-full flex justify-center overflow-y-scroll">
        <div
          className={` w-full ${
            selected === "Product Archive" ? " lg:w-4/5 " : " lg:w-3/5 "
          }`}
        >
          {selected && <ProfileSettingSection selected={selected} />}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
