import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import ProfileSettingSection from "../../Component/ui/ProfileSettingSection";

const ProfileSetting = () => {
  const [selected, setSelected] = useState("My Profile");

  const navigate = useNavigate();

  const handleSelected = (section) => {
    setSelected(section);
    navigate(`/manage-profile/${section}`);
  };

  return (
    <div className="text-f-dark h-full p-3 md:p-8 font-Poppins flex gap-10">
      <nav className="w-1/5 flex flex-col gap-10">
        <div>
          <div className="flex flex-col gap-1 w-full">
            {["My Profile", "Account"].map((section) => (
              <div
                key={section}
                className={`h-auto flex items-center rounded-md px-4 py-2 cursor-pointer ${
                  selected === section
                    ? "bg-[#E0EAEA] text-c-primary font-semibold"
                    : "text-f-dark font-md"
                }`}
                onClick={() => handleSelected(section)}
              >
                <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
                <h1>{section}</h1>
              </div>
            ))}
          </div>
        </div>
      </nav>
      <aside className="w-4/5 overflow-y-scroll">
        {selected && <ProfileSettingSection selected={selected} />}
      </aside>
    </div>
  );
};

export default ProfileSetting;
