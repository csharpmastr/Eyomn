import React, { useState } from "react";
import { TiUpload } from "react-icons/ti";
import { FileUploader } from "react-drag-drop-files";

const HelpSections = ({ selected }) => {
  return (
    <div className="w-full h-full flex flex-col gap-8 font-Poppins">
      {selected === "Getting Started" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Getting Started</h1>
        </div>
      )}
      {selected === "Account" && (
        <>
          <div className="w-full h-fit border border-f-gray bg-white rounded-xl p-10 flex flex-col text-f-dark">
            <h1 className="font-medium text-p-lg">1. Creating an Account</h1>
            <article className=" mt-4">
              <h6 className="font-medium ">Who can create an account?</h6>
              <ul className="list-disc ml-10 mt-2">
                <li>
                  Only the Organization Manager has the permissions to create
                  new staff accounts.
                </li>
              </ul>
              <h6 className="font-medium mt-4">Steps to create an account:</h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>
                  In your Organization Account, navigate to the Organization
                  button in the sidebar.
                </li>
                <li>
                  Select the Branch where you want to appoint the new staff
                  member.
                </li>
                <li>
                  Click the Add Staff button located at the top left corner of
                  the screen.
                </li>
                <li>
                  Fill in the required details (e.g., name, email, role) in the
                  provided form.
                </li>
                <li>Once all details are entered, click Add Staff.</li>
              </ol>
              <p className="mt-4">
                That’s it! The new account will be created, and the staff member
                will receive login details via email.
              </p>
            </article>
          </div>
          <div className="w-full h-fit border border-f-gray bg-white rounded-xl p-10 flex flex-col text-f-dark">
            <h1 className="font-medium text-p-lg">2. Logging In and Out</h1>
            <article className=" mt-4">
              <h6 className="font-medium ">How do I log into my account?</h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>Go to eyomn.com and click Login.</li>
                <li>Enter your email address and password.</li>
                <li>Click Log In to be directed to your eyomn dashboard.</li>
              </ol>
              <h6 className="font-medium mt-4">
                How do I log out of my account?
              </h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>
                  Click the dropdown icon in the right corner of the navigation
                  bar.
                </li>
                <li>Select Log Out from the dropdown menu.</li>
                <li>You will be signed out of the account on that device.</li>
              </ol>
            </article>
          </div>
          <div className="w-full h-fit border border-f-gray bg-white rounded-xl p-10 flex flex-col text-f-dark">
            <h1 className="font-medium text-p-lg">3. Password Management</h1>
            <article className=" mt-4">
              <h6 className="font-medium ">
                I forgot my password. How do I reset it?
              </h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>Go to the eyomn login page and click Forgot password?.</li>
                <li>Enter the email address associated with your account.</li>
                <li>
                  Check your email for the OTP (One-Time Password) sent to you.
                </li>
                <li>Enter the OTP to verify your identity.</li>
                <li>Once verified, you’ll be able to reset your password.</li>
              </ol>
              <h6 className="font-medium mt-4">How do I change my password?</h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>Click the Settings button in the sidebar.</li>
                <li>In the Account section, select Change Password.</li>
                <li>
                  Enter your current password, then your new password, and click
                  Update Password to confirm the changes.
                </li>
              </ol>
            </article>
          </div>
          <div className="w-full h-fit border border-f-gray bg-white rounded-xl p-10 flex flex-col text-f-dark">
            <h1 className="font-medium text-p-lg">4. Profile Management</h1>
            <article className=" mt-4">
              <h6 className="font-medium ">
                How do I update my profile information?
              </h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>
                  Click your profile icon in the top-right corner and select
                  Manage Account.
                </li>
                <li>
                  You can update your personal information (e.g., name, email)
                  and upload a new profile picture.
                </li>
              </ol>
              <h6 className="font-medium mt-4">
                How do I upload a profile picture?
              </h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>
                  In the Account Settings menu, navigate to the Profile Picture
                  section.
                </li>
                <li>
                  Click the Upload Image button and select an image from your
                  computer to set as your profile picture.
                </li>
              </ol>
            </article>
          </div>
          <div className="w-full h-fit border border-f-gray bg-white rounded-xl p-10 flex flex-col text-f-dark">
            <h1 className="font-medium text-p-lg">5. Deleting Your Account</h1>
            <article className=" mt-4">
              <h6 className="font-medium ">
                How do I permanently delete my account?
              </h6>
              <ol className="list-decimal ml-10 flex flex-col gap-2 mt-2">
                <li>Navigate to Account Settings.</li>
                <li>In the Account section, scroll to the bottom.</li>
                <li>
                  Click Delete Account and follow the prompts to confirm the
                  deletion.
                </li>
              </ol>
              <p className="mt-4">
                <b>Important:</b> Once your account is deleted, all associated
                data and files will be permanently removed and cannot be
                recovered.
              </p>
            </article>
          </div>
        </>
      )}
      {selected === "Billing" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Billing</h1>
        </div>
      )}
      {selected === "FAQ's" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">FAQ's</h1>
        </div>
      )}
      {selected === "Features" && (
        <div className="w-full border border-f-gray bg-white rounded-lg px-10 h-52 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">Features</h1>
        </div>
      )}
      {selected === "Changelog" && (
        <div className="w-full h-full border border-f-gray bg-white rounded-lg px-10 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-p-lg">
            No changes have been made so far.
          </h1>
        </div>
      )}
    </div>
  );
};

export default HelpSections;
