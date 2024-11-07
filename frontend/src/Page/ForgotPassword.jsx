import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineEmail, MdOutlineLock } from "react-icons/md";

const ForgotPassword = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isCPassVisible, setIsCPassVisible] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentCardIndex(currentCardIndex + 1);
  };

  const handleBack = () => {
    setCurrentCardIndex(currentCardIndex - 1);
  };

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join("");
  };

  return (
    <div className="h-screen w-full bg-bg-mc font-Raleway text-f-dark">
      <div className="flex flex-col items-center justify-center h-full w-full">
        {currentCardIndex < 3 ? (
          <div className="flex gap-40 mb-20">
            <div className="rounded-full bg-green-300 p-8"></div>
            <div className="rounded-full bg-red-300 p-8"></div>
            <div className="rounded-full bg-blue-300 p-8"></div>
          </div>
        ) : (
          <div className="rounded-full bg-green-300 p-16 mb-10"></div>
        )}
        <div className="w-[600px] h-fit">
          {currentCardIndex === 0 && (
            <div className="flex flex-col gap-8">
              <article className="flex flex-col text-center">
                <h1 className="text-h-h4 font-semibold">Forgot Password?</h1>
                <p className="text-p-rg text-f-gray2">
                  No worries, well help you reset your password
                </p>
              </article>
              <div className="flex flex-col gap-8 items-center">
                <section className="w-full">
                  <label className="text-p-rg font-medium">Email Address</label>
                  <div className="relative">
                    <MdOutlineEmail className="w-6 h-6 absolute top-5 left-4 text-c-gray3" />
                    <input
                      type="email"
                      name="email"
                      className="mt-1 w-full pl-12 py-4 border border-c-gray3 font-medium rounded-md text-f-dark focus:outline-c-primary font-Poppins"
                      placeholder="Enter your email"
                      //   value={userData.email}
                      //   onChange={handleChange}
                    />
                  </div>
                </section>
                <button
                  className="text-center py-3 rounded-md text-p-lg text-f-light font-semibold bg-c-primary w-full"
                  onClick={handleNext}
                >
                  Send an OTP
                </button>
              </div>
            </div>
          )}
          {currentCardIndex === 1 && (
            <div className="flex flex-col gap-8">
              <article className="flex flex-col text-center">
                <h1 className="text-h-h4 font-semibold">Confirm Your Code</h1>
                <p className="text-p-rg text-f-gray2">
                  Please enter the 6-digit code we sent to your email.
                </p>
              </article>
              <div className="flex flex-col gap-8 items-center">
                <div className="flex w-full gap-4">
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      className="w-full h-20 text-center border border-f-gray rounded-md text-lg text-f-dark focus:outline-c-primary"
                      maxLength="1"
                      value={otp[index]}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputsRef.current[index] = el)}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                <button
                  className="text-center py-3 rounded-md text-p-lg text-f-light font-semibold bg-c-primary w-full"
                  onClick={handleNext}
                >
                  Confirm OTP
                </button>
                <p className="text-p-sm font-medium text-center w-full">
                  Didn't receive the email?{" "}
                  <span className="text-c-secondary font-bold">
                    Click to resend
                  </span>
                </p>
              </div>
            </div>
          )}
          {currentCardIndex === 2 && (
            <div className="flex flex-col gap-8">
              <article className="flex flex-col text-center">
                <h1 className="text-h-h4 font-semibold">
                  Create a New Password
                </h1>
                <p className="text-p-rg text-f-gray2">
                  Create a new password to secure your account.
                </p>
              </article>
              <div className="flex flex-col gap-8 items-center">
                <section className="w-full">
                  <label className="text-p-rg font-medium">New Password</label>
                  <div className="relative">
                    <MdOutlineLock className="w-6 h-6 absolute top-5 left-4 text-c-gray3" />
                    <input
                      type={isPassVisible ? "text" : "password"}
                      name="password"
                      className="mt-1 w-full pl-12 py-4 border border-c-gray3 font-medium rounded-md text-f-dark focus:outline-c-primary font-Poppins"
                      placeholder="Enter your new password"
                      //   value={userData.password}
                      //   onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute top-6 right-4 text-f-gray2"
                      onClick={() => setIsPassVisible(!isPassVisible)}
                    >
                      {isPassVisible ? (
                        <MdOutlineRemoveRedEye className="w-6 h-6" />
                      ) : (
                        <FaRegEyeSlash className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </section>
                <section className="w-full">
                  <label className="text-p-rg font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <MdOutlineLock className="w-6 h-6 absolute top-5 left-4 text-c-gray3" />
                    <input
                      type={isCPassVisible ? "text" : "password"}
                      name="confirmpassword"
                      className="mt-1 w-full pl-12 py-4 border border-c-gray3 font-medium rounded-md text-f-dark focus:outline-c-primary font-Poppins"
                      placeholder="Confirm your password"
                      //   value={userData.password}
                      //   onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute top-6 right-4 text-f-gray2"
                      onClick={() => setIsCPassVisible(!isCPassVisible)}
                    >
                      {isCPassVisible ? (
                        <MdOutlineRemoveRedEye className="w-6 h-6" />
                      ) : (
                        <FaRegEyeSlash className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </section>
                <button
                  className="text-center py-3 rounded-md text-p-lg text-f-light font-semibold bg-c-primary w-full"
                  onClick={handleNext}
                >
                  Reset Password
                </button>
              </div>
            </div>
          )}
          {currentCardIndex === 3 && (
            <div className="flex flex-col gap-8">
              <article className="flex flex-col text-center">
                <h1 className="text-h-h4 font-semibold">
                  Password Reset Successful!
                </h1>
                <p className="text-p-rg text-f-gray2">
                  Success! Your password has been updated. You can now log in
                  using your new password.
                </p>
              </article>
              <button
                className="text-center py-3 rounded-md text-p-lg text-f-light font-semibold bg-c-primary w-full"
                onClick={() => navigate("/")}
              >
                Go to Login
              </button>
            </div>
          )}
          {currentCardIndex < 3 && (
            <div
              className="flex items-center justify-center text-f-gray2 w-full mt-8 gap-2"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft className="h-auto w-6" />
              <p className="text-p-sm font-medium">Back to login</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
