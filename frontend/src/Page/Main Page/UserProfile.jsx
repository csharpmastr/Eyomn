import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Image/3.png";
import { useSelector } from "react-redux";
import { calculateAge } from "../../Helper/Helper";

const UserProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.reducer.user.user);
  const branches = user.branches || [];
  const edit = () => {
    navigate(`/manage-profile/My Profile`);
  };
  console.log(branches);

  const workingDaysCount = branches.reduce((uniqueDays, branch) => {
    branch.schedule.forEach(({ day }) => uniqueDays.add(day));
    return uniqueDays;
  }, new Set()).size;

  return (
    <div className="w-full h-full text-f-dark p-4 md:p-10 font-Poppins flex flex-col gap-4 md:gap-6">
      <header className="w-full h-fit flex justify-between items-center">
        <section className="flex items-center gap-4">
          <img
            className="w-24 h-24 rounded-xl object-fit bg-gray-200"
            src={logo}
            alt="Profile Image"
          />
          <div>
            <h1 className="text-p-lg font-semibold mb-2">{`${user.first_name} ${user.last_name}`}</h1>
            <h3 className="text-p-rg text-f-gray">{user.position}</h3>
            <h3 className="text-p-rg text-f-gray">{`${user.municipality} ${user.province}`}</h3>
          </div>
        </section>
        <div
          className="h-fit flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer"
          onClick={edit}
        >
          <h1>Manage Profile</h1>
        </div>
      </header>
      <div className="w-full h-full flex flex-col justify-between gap-6">
        <div className="w-full flex-1 text-f-dark rounded-md shadow-md">
          <header className="px-8 py-4 bg-white border-b rounded-t-md">
            <h1 className="text-p-lg font-medium text-c-secondary">
              | Personal Information
            </h1>
          </header>
          <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Firstname
              </p>
              <p> {user.first_name}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Lastname</p>
              <p> {user.last_name}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Birthday</p>
              <p> {user.birthdate}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Age</p>
              <p>
                {user.age
                  ? calculateAge(user.birthdate)
                  : calculateAge(user.birthdate)}
              </p>
            </section>
          </div>
        </div>
        <div className="w-full flex-1 text-f-dark rounded-md shadow-md">
          <header className="px-8 py-4 bg-white border-b rounded-t-md">
            <h1 className="text-p-lg font-medium text-c-secondary">
              | Contact Information
            </h1>
          </header>
          <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Municipality
              </p>
              <p> {user.municipality}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Province</p>
              <p> {user.province}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Contact Number
              </p>
              <p> {user.contact_number || user.contact}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Email Address
              </p>
              <p> {user.email}</p>
            </section>
          </div>
        </div>
        <div className="w-full flex-1 text-f-dark rounded-md shadow-md">
          <header className="px-8 py-4 bg-white border-b rounded-t-md">
            <h1 className="text-p-lg font-medium text-c-secondary">
              | Job Information
            </h1>
          </header>
          <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Job/Role</p>
              <p>{user.position}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Assigned Branch
              </p>
              <p>Santa Cruz</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Branch Assignment
              </p>
              <p>{branches.length > 1 ? `Rotational` : `Stationary`}</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                No. Working Days
              </p>
              <p>{user.branches ? workingDaysCount : "N/A"} </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
