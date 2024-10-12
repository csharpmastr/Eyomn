import React from "react";

const UserProfileCard = ({ title, tags, data }) => {
  return (
    <div className="w-full border border-f-gray rounded-lg p-8 font-Poppins text-f-dark">
      <h1 className="text-p-lg font-medium mb-5">{title}</h1>
      <div className="w-full flex">
        {tags.map((tag, index) => (
          <div key={index} className="flex-1 text-p-rg">
            <p className="text-f-gray mb-1 text-p-sm">{tag}</p>
            <p>{data[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileCard;
