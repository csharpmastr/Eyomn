import React from "react";

const SessionConflictModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-800 bg-opacity-50 z-50 font-Poppins">
      <div className="bg-f-light rounded-lg w-[440px] p-6">
        <h1 className="text-p-lg font-semibold text-f-dark mb-2">
          Account Logged in on Another Device
        </h1>
        <p className="text-c-gray3 mb-10">
          Your account is currently active on another device. For security
          reasons, simultaneous logins are not allowed.
        </p>
        <div className="flex flex-col gap-4 text-p-sm md:text-p-rg font-medium">
          <button
            //onClick={LogoutOther}
            className="bg-red-500 text-f-light px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout other device
          </button>
          <button
            // onClick={StayLoggedIn}
            className="bg-zinc-200 text-f-dark px-4 py-2 rounded-md hover:bg-zinc-300"
          >
            Stay logged in
          </button>
        </div>
        <p className="text-p-sc text-c-gray3 mt-4 text-center">
          If this wasn't you, consider changing your password for enhanced
          security.
        </p>
      </div>
    </div>
  );
};

export default SessionConflictModal;
