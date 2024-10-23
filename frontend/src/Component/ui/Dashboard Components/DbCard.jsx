import React from "react";
import { FiUser } from "react-icons/fi";

const DbCard = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <div
          key={index}
          className="p-4 w-full rounded-xl text-f-dark font-Poppins border border-f-gray text-p-rg"
          style={{
            background: "linear-gradient(to top, #EEF1F1, #B8D4D4, #EEF1F1)",
          }}
        >
          <div className="flex items-center w-full justify-between">
            <section>
              <p className="text-p-sm">{item.title}</p>
              <p className="font-semibold text-p-lg">{item.value}</p>
            </section>
            <div className="p-4 bg-white rounded-full">
              <FiUser />
            </div>
          </div>
          <p className="text-p-sm mt-6">
            <span className="text-green-800">{item.percentageChange}</span> vs
            last month
          </p>
        </div>
      ))}
    </>
  );
};

export default DbCard;
