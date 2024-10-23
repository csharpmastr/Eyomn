import React from "react";
import { useNavigate } from "react-router-dom";

const DbTable = () => {
  const currentData = [
    {
      first_name: "John",
      last_name: "Doe",
      contact_number: "123-456-7890",
      email: "john.doe@example.com",
      date: "2024-10-01",
    },
    {
      first_name: "Jane",
      last_name: "Smith",
      contact_number: "098-765-4321",
      email: "jane.smith@example.com",
      date: "2024-10-05",
    },
    {
      first_name: "Alice",
      last_name: "Johnson",
      contact_number: "555-123-4567",
      email: "alice.johnson@example.com",
      date: "2024-10-10",
    },
    {
      first_name: "Bob",
      last_name: "Williams",
      contact_number: "444-987-6543",
      email: "bob.williams@example.com",
      date: "2024-10-15",
    },
    {
      first_name: "Charlie",
      last_name: "Brown",
      contact_number: "333-555-7890",
      email: "charlie.brown@example.com",
      date: "2024-10-20",
    },
    {
      first_name: "David",
      last_name: "Wilson",
      contact_number: "222-777-8888",
      email: "david.wilson@example.com",
      date: "2024-10-22",
    },
    {
      first_name: "Emily",
      last_name: "Davis",
      contact_number: "111-222-3333",
      email: "emily.davis@example.com",
      date: "2024-10-25",
    },
    {
      first_name: "Frank",
      last_name: "Garcia",
      contact_number: "999-888-7777",
      email: "frank.garcia@example.com",
      date: "2024-10-30",
    },
    {
      first_name: "Grace",
      last_name: "Martinez",
      contact_number: "555-444-3333",
      email: "grace.martinez@example.com",
      date: "2024-11-01",
    },
    {
      first_name: "Henry",
      last_name: "Hernandez",
      contact_number: "888-555-4444",
      email: "henry.hernandez@example.com",
      date: "2024-11-05",
    },
  ];

  const navigate = useNavigate();

  const viewAll = () => {
    navigate(`/patient`);
  };

  return (
    <div className="text-p-rg h-[500px] text-c-secondary rounded-lg bg-white p-4 overflow-clip">
      <header className="flex justify-between items-center">
        <h1 className="font-medium text-nowrap">| Recent Patient</h1>
        <button
          onClick={viewAll}
          className="px-2 py-1 border border-c-primary text-c-primary rounded-lg"
        >
          View All
        </button>
      </header>
      <div className="text-left font-medium flex text-c-secondary py-2 bg-bg-mc rounded-t-md mt-6">
        <div className="pl-8 w-1/4">Patient Name</div>
        <div className="w-1/4">Contact</div>
        <div className="w-1/4">Email</div>
        <div className="w-1/4">Last Visit</div>
      </div>
      <div className="h-full overflow-y-scroll pb-24">
        {currentData.map((patientData, index) => (
          <div
            key={index}
            className="border-b border-f-gray py-4 text-f-dark cursor-pointer flex bg-white"
          >
            <td className="pl-8 w-1/4">
              {patientData.first_name + " " + patientData.last_name}
            </td>
            <td className="w-1/4">{patientData.contact_number}</td>
            <td className="w-1/4 truncate">{patientData.email}</td>
            <td className="w-1/4">{patientData.date}</td>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DbTable;
