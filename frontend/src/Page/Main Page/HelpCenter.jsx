import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HelpSections from "../../Component/ui/HelpSections";
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";

const HelpCenter = () => {
  const [selected, setSelected] = useState("Getting Started");

  const navigate = useNavigate();

  const handleSelected = (section) => {
    setSelected(section);
    navigate(`/help/${section}`);
  };

  return (
    <div className="text-f-dark p-3 md:p-6 xl:p-8 font-Poppin h-full gap-6 overflow-clip">
      <nav className="w-full flex gap-4 overflow-x-scroll">
        {[
          "Getting Started",
          "Account",
          "Billing",
          "FAQ's",
          "Features",
          "Changelog",
        ].map((section) => (
          <div
            key={section}
            className={`h-auto flex items-center rounded-full px-4 py-2 cursor-pointer text-nowrap ${
              selected === section
                ? "bg-[#E0EAEA] text-c-primary border border-c-primary font-semibold"
                : "text-f-dark font-medium border  bg-white"
            }`}
            onClick={() => handleSelected(section)}
          >
            <h1>{section}</h1>
          </div>
        ))}
      </nav>
      <div className="flex h-full pt-4 pb-12">
        <section className="w-full md:w-1/3 flex flex-col justify-between h-fit md:h-full">
          <div>
            <h1 className="text-p-lg font-semibold">{selected}</h1>
            <p className="text-p-rg">Lorem ipsum dolor sha.</p>
          </div>
          <div className="w-2/3 bg-c-primary rounded-lg px-4 py-4  text-f-light text-p-rg">
            <section>
              <h1 className="font-semibold">Do you still need our help?</h1>
              <p className="text-p-sm">Send you request via email.</p>
            </section>
            <div className="h-fit w-fit items-center justify-center rounded-md px-4 py-2 font-md bg-f-light text-f-dark font-semibold mt-4">
              <h1>Contact Us</h1>
            </div>
          </div>
        </section>
        <aside className="w-full md:w-2/3 h-full overflow-y-scroll">
          {selected && <HelpSections selected={selected} />}
        </aside>
      </div>
    </div>
  );
};

export default HelpCenter;
