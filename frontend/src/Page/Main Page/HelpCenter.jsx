import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HelpSections from "../../Component/ui/HelpSections";
import RoleColor from "../../assets/Util/RoleColor";

const HelpCenter = () => {
  const [selected, setSelected] = useState("Getting Started");
  const [selectedPart, setSelectedPart] = useState("Creating an Account");

  const navigate = useNavigate();

  const handleSelected = (section) => {
    setSelected(section);
    navigate(`/help/${section}`);
  };

  const handleSectionPart = (section_part) => {
    setSelectedPart(section_part);
    document
      .getElementById(section_part)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const { helpBtn, helpSection } = RoleColor();

  return (
    <div className="text-f-dark p-4 md:p-6 2xl:p-8 font-Poppins h-full gap-6 overflow-clip">
      <nav className="w-full flex gap-4 overflow-x-auto pb-2 ">
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
                ? helpBtn
                : "text-f-gray2 font-medium border bg-f-light"
            }`}
            onClick={() => handleSelected(section)}
          >
            <h1>{section}</h1>
          </div>
        ))}
      </nav>
      <div className="flex flex-col lg:flex-row h-full pt-4 pb-12">
        <section className="w-full md:w-1/3 lg:flex flex-row lg:flex-col justify-between h-fit md:h-full hidden text-f-dark">
          <div>
            <h1 className="text-4xl font-bold font-helvetica-rounded mb-5">
              {selected}
            </h1>
            <section>
              {selected === "Account" && (
                <>
                  {[
                    "Creating an Account",
                    "Logging In and Out",
                    "Password Management",
                    "Profile Management",
                    "Deleting Your Account",
                  ].map((section_part) => (
                    <div
                      key={section_part}
                      className={`w-fit pl-2 py-2  cursor-pointer ${
                        selectedPart === section_part
                          ? ` border-l-2 font-medium ${helpSection} `
                          : " border-l-2 border-f-gray font-medium text-f-gray2"
                      }`}
                      onClick={() => handleSectionPart(section_part)}
                    >
                      <p>{section_part}</p>
                    </div>
                  ))}
                </>
              )}
            </section>
          </div>
          <div className="w-2/3 h-fit bg-c-primary rounded-lg px-4 py-4  text-f-light text-p-rg">
            <section>
              <h1 className="font-semibold">Do you still need our help?</h1>
              <p className="text-p-sm">Send you request via email.</p>
            </section>
            <div className="h-fit w-fit items-center justify-center rounded-md px-4 py-2 font-md bg-f-light text-f-dark font-semibold mt-4">
              <a
                href="mailto:info@eyomn.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
        <aside className="w-full lg:w-2/3 h-full overflow-y-scroll">
          {selected && <HelpSections selected={selected} />}
        </aside>
      </div>
    </div>
  );
};

export default HelpCenter;
