import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Image/3.png";

const UserProfile = () => {
  const navigate = useNavigate();

  const edit = () => {
    navigate(`/manage-profile/My Profile`);
  };

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
            <h1 className="text-p-lg font-semibold mb-2">Modest Mouse</h1>
            <h3 className="text-p-rg text-f-gray">Optometrist</h3>
            <h3 className="text-p-rg text-f-gray">Pila Laguna, Philippines</h3>
          </div>
        </section>
        <div
          className="h-fit flex justify-center items-center rounded-md px-4 py-3 bg-c-secondary text-f-light font-md hover:cursor-pointer hover:bg-hover-c-secondary active:bg-pressed-c-secondary"
          onClick={edit}
        >
          <h1>Manage Profile</h1>
        </div>
      </header>
      <div className="w-full h-full flex flex-col justify-between gap-6">
        <div className="w-full flex-1 text-f-dark rounded-md border border-f-gray shadow-md">
          <header className="px-8 py-4 bg-white border border-b-f-gray rounded-t-md">
            <h1 className="text-p-lg font-medium text-c-primary">
              | Personal Information
            </h1>
          </header>
          <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Firstname
              </p>
              <p>Modest</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Lastname</p>
              <p>Mouse</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Birthday</p>
              <p>October 9, 1986</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Age</p>
              <p>38 Years Old</p>
            </section>
          </div>
        </div>
        <div className="w-full flex-1 text-f-dark rounded-md border border-f-gray shadow-md">
          <header className="px-8 py-4 bg-white border border-b-f-gray rounded-t-md">
            <h1 className="text-p-lg font-medium text-c-primary">
              | Contact Information
            </h1>
          </header>
          <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Municipality
              </p>
              <p>Pila</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Province</p>
              <p>Laguna</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Contact Number
              </p>
              <p>09715378246</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                Email Address
              </p>
              <p>modestmousey@gmail.com</p>
            </section>
          </div>
        </div>
        <div className="w-full flex-1 text-f-dark rounded-md border border-f-gray shadow-md">
          <header className="px-8 py-4 bg-white border border-b-f-gray rounded-t-md">
            <h1 className="text-p-lg font-medium text-c-primary">
              | Job Information
            </h1>
          </header>
          <div className="w-full flex flex-wrap p-8 gap-8 md:gap-0 md:flex-none">
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">Job/Role</p>
              <p>Optometrist</p>
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
              <p>Rotational</p>
            </section>
            <section className="flex-1 text-p-rg font-medium">
              <p className="text-f-gray mb-1 text-p-sm font-normal">
                No. Working Days
              </p>
              <p>5 Working Days</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
