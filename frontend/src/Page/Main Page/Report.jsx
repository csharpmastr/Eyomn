import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import RCLineGraph from "../../Component/ui/Report Components/RCLineGraph";
import RCPieChart from "../../Component/ui/Report Components/RCPieChart";
import RCTable from "../../Component/ui/Report Components/RCTable";
import { useSelector } from "react-redux";

const Report = () => {
  const [selected, setSelected] = useState("Patients");
  const branch = useSelector((state) => state.reducer.branch.branch);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const handleSelected = (section) => {
    setSelected(section);
  };

  const staffs = useSelector((state) => state.reducer.staff.staffs);
  const staffCount = staffs.length;

  let secCount = 0;
  let docCount = 0;
  let rotate = 0;
  let station = 0;

  staffs.forEach((staff) => {
    if (staff.role === "3") {
      secCount++;
    } else if (staff.role === "2") {
      docCount++;
      if (staff.branches.length > 1) {
        rotate++;
      } else if (staff.branches.length === 1) {
        station++;
      }
    }
  });

  return (
    <div className="text-f-dark p-4 md:p-6 2xl:p-8 font-Poppins w-full h-full overflow-auto">
      <div className="flex justify-between">
        <nav className="flex items-end gap-3 text-f-dark">
          <button
            className={`rounded-t-md border-x border-t border-f-gray px-5 pt-2 h-fit ${
              selected === "Patients"
                ? "bg-f-light font-semibold pb-1"
                : "bg-non font-medium pb-0"
            }`}
            onClick={() => handleSelected("Patients")}
          >
            Patient
          </button>
          <div
            className={`rounded-t-md border-x border-t border-f-gray px-5 pt-2 h-fit ${
              selected === "Inventory" || selected === "Sales"
                ? "bg-f-light font-semibold pb-1"
                : "bg-non font-medium pb-0"
            }`}
          >
            <select
              name="section"
              value={selected}
              onChange={(e) => handleSelected(e.target.value)}
              className={`w-full outline-none ${
                selected === "Inventory" || selected === "Sales"
                  ? "bg-f-light"
                  : "bg-bg-mc"
              }`}
            >
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <button
            className={`rounded-t-md border-x border-t border-f-gray px-5 pt-2 h-fit ${
              selected === "Staffs"
                ? "bg-f-light font-semibold pb-1"
                : "bg-non font-medium pb-0"
            }`}
            onClick={() => handleSelected("Staffs")}
          >
            Staff
          </button>
        </nav>
      </div>
      <div className="w-full h-full flex flex-col p-5 gap-5 rounded-b-xl rounded-tr-xl border border-f-gray bg-white text-f-dark text-p-sm md:text-p-rg">
        <div className="w-full flex justify-between">
          <div className="flex gap-5 w-3/5">
            <select
              className="hover:cursor-pointer w-fit focus:outline-none border border-f-gray px-4 py-2 rounded-md bg-bg-mc"
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branch.map((item, key) => (
                <option key={key} value={item.branchId}>
                  {item.name}
                </option>
              ))}
            </select>
            <div className="flex flex-row gap-2 border border-f-gray px-4 py-2 rounded-md justify-center items-center w-full">
              <IoMdSearch className="h-6 w-6 text-c-secondary" />
              <input
                type="text"
                className="w-full text-f-dark focus:outline-none placeholder-f-gray2 text-p-sm md:text-p-rg"
                placeholder="Search "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/* <button className="rounded-md font-medium px-4 py-2 h-fit bg-blue-400 text-f-light">
            Export
          </button> */}
        </div>
        {selected === "Patients" ? (
          <></>
        ) : selected === "Inventory" ? (
          <>
            {/* <div className="flex gap-5 h-80">
              <RCLineGraph />
              <RCPieChart />
              <div className="w-1/4 h-full flex flex-col gap-5">
                <div className="w-full h-1/3 rounded-md bg-c-primary">
                  Total Srp Price
                </div>
                <div className="w-full h-1/3 rounded-md bg-c-primary">
                  Total Retail Price
                </div>
                <div className="w-full h-1/3 rounded-md bg-c-primary">
                  No. Low Stock
                </div>
              </div>
            </div> */}
          </>
        ) : selected === "Sales" ? (
          <>
            {/* <div className="flex gap-5 h-80">
              <RCLineGraph />
              <RCPieChart />
              <div className="w-1/4 h-full flex flex-col gap-5">
                <div className="w-full h-1/2 rounded-md bg-c-primary">
                  Gross Profit
                </div>
                <div className="w-full h-1/2 rounded-md bg-c-primary">
                  No. Sale Product
                </div>
              </div>
            </div> */}
          </>
        ) : (
          <>
            {/* <div className="flex gap-5 h-28">
              <div className="w-1/5 rounded-md bg-c-primary">{staffCount}</div>
              <div className="w-1/5 rounded-md bg-c-primary">{secCount}</div>
              <div className="w-1/5 rounded-md bg-c-primary">{docCount}</div>
              <div className="w-1/5 rounded-md bg-c-primary">{rotate}</div>
              <div className="w-1/5 rounded-md bg-c-primary">{station}</div>
            </div> */}
          </>
        )}
        <section className="w-full flex items-center justify-between font-medium">
          <h1>{selected} Report</h1>
          <h1>01-31 September 2024</h1>
        </section>
        <div className="w-full h-full border border-f-gray rounded-md p-5 overflow-y-scroll">
          <RCTable
            selected={selected}
            branch={selectedBranch}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default Report;
