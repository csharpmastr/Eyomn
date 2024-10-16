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
    <div className="text-f-dark p-3 md:p-6 font-Poppin h-full flex flex-col md:flex-row gap-6">
      <nav className="w-full md:w-1/3 flex flex-col justify-between h-full">
        <div>
          <div>
            <h1 className="text-p-lg font-semibold">{selected}</h1>
            <p className="text-p-rg">Lorem ipsum dolor sha.</p>
          </div>
          <div className="flex flex-row border border-c-gray3 px-4 rounded-md justify-center items-center w-full mt-2 md:mt-6">
            <IoMdSearch className="h-8 w-8 text-c-secondary" />
            <input
              type="text"
              className="w-full h-11 text-f-dark focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
              placeholder="Search product... "
              //value={searchTerm}
              //onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex flex-col gap-8 mt-2 md:mt-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 w-3/4">
              {[
                "Getting Started",
                "Account",
                "Billing",
                "FAQ's",
                "Features",
                "Changelog",
                "Submit a Ticket",
              ].map((section) => (
                <div
                  key={section}
                  className={`h-auto flex items-center rounded-md px-4 py-2 ${
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
            <div className="md:block hidden w-full bg-c-primary rounded-lg px-5 py-6  text-f-light">
              <section>
                <h1 className="font-semibold text-p-lg">
                  Do you still need our help?
                </h1>
                <p className="text-p-rg">Send you request via email.</p>
              </section>
              <div className="h-12 w-fit items-center justify-center rounded-md px-4 py-2 font-md bg-f-light text-f-dark font-semibold text-p-lg mt-6">
                <h1>Contact Us</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <aside className="w-full md:w-2/3 h-full overflow-scroll">
        {selected && <HelpSections selected={selected} />}
      </aside>
    </div>
  );
};

export default HelpCenter;
