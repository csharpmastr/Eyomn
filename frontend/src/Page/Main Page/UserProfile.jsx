import React from "react";
import UserProfileCard from "../../Component/ui/UserProfileCard";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const sample_data = [
    {
      title: "| Personal Info",
      tags: ["First Name", "Last Name", "Birthdate", "Age"],
      data: ["Modest", "Mouse", "October 9, 1986", "38 Years Old"],
    },
    {
      title: "| Contact Info",
      tags: ["Municipality", "Province", "Contact Number", "Email Address"],
      data: ["Pila", "Laguna", "09715378246", "modestmousey@gmail.com"],
    },
    {
      title: "| Job Information",
      tags: ["Job/Role", "Contract", "Working Hours", "Day’s Off"],
      data: [
        "Doctor / Optometrist ",
        "Full-Time",
        "09:00 am - 05:00 pm",
        "Saturday & Sunday",
      ],
    },
  ];

  const navigate = useNavigate();

  const edit = () => {
    navigate(`/manage-profile/My Profile`);
  };

  return (
    <div className="text-f-dark p-3 md:p-8 font-Poppin h-full flex flex-col gap-8">
      <header className="w-full h-fit flex justify-between items-center">
        <h1 className="text-p-lg font-semibold">Santa Cruz Branch</h1>
        <div
          className="h-fit flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
          onClick={edit}
        >
          <h1>Manage Profile</h1>
        </div>
      </header>
      <div className="w-full h-full bg-white border border-f-gray rounded-lg px-10 pt-10 overflow-clip">
        <div className="flex items-center gap-4 mb-10">
          <img
            className="w-[120px] h-[120px] rounded-full object-cover bg-gray-200"
            src="profile-pic.jpg"
            alt="Profile Image"
          />
          <div>
            <h1 className="text-p-lg font-medium">Modest Mouse</h1>
            <h3 className="text-p-rg text-f-gray">Optometrist</h3>
            <h3 className="text-p-rg text-f-gray">Pila Laguna, Philippines</h3>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-8">
          {sample_data.map((data, index) => (
            <UserProfileCard
              key={index}
              title={data.title}
              tags={data.tags}
              data={data.data}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
