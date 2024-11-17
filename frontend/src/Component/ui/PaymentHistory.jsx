import React, { useState } from "react";

const PaymentHistory = ({ onClose }) => {
  const dummyData = [
    {
      category: "Eye Glass",
      date: "2024-11-17",
      product_description: "dasd",
      product_name: "dasd",
      product_price: "22",
      product_qty: "12",
      service_other: "",
      service_price: 0,
      service_type: "",
      Total_Payment: 264,
    },
    {
      category: "Contact Lens",
      date: "2024-11-17",
      product_description: "Soft lens",
      product_name: "Lens A",
      product_price: "15",
      product_qty: "10",
      service_other: "",
      service_price: 50,
      service_type: "Consultation",
      Total_Payment: 200,
    },
    {
      category: "Consultation",
      date: "2024-11-17",
      product_description: "",
      product_name: "",
      product_price: "0",
      product_qty: "0",
      service_other: "First-time consultation",
      service_price: 150,
      service_type: "Consultation",
      Total_Payment: 150,
    },
    {
      category: "Checkup",
      date: "2024-11-18",
      product_description: "",
      product_name: "",
      product_price: "0",
      product_qty: "0",
      service_other: "Yearly checkup",
      service_price: 100,
      service_type: "Checkup",
      Total_Payment: 100,
    },
    {
      category: "Eye Glass",
      date: "2024-11-17",
      product_description: "Prescription glasses",
      product_name: "Eye Glass X",
      product_price: "50",
      product_qty: "3",
      service_other: "",
      service_price: 0,
      service_type: "",
      Total_Payment: 150,
    },
    {
      category: "Medication",
      date: "2024-11-18",
      product_description: "Pain reliever",
      product_name: "Aspirin",
      product_price: "10",
      product_qty: "20",
      service_other: "",
      service_price: 0,
      service_type: "",
      Total_Payment: 200,
    },
  ];

  const [collapsed, setCollapsed] = useState({});

  const handleToggleCollapse = (index) => {
    setCollapsed((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[380px] md:w-1/2 xl:w-[600px] h-[600px] bg-white rounded-md overflow-clip">
        <header className="p-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
          <h1 className="text-p-rg md:text-p-lg text-c-secondary font-medium">
            Payment History
          </h1>
          <button onClick={onClose}> &times; </button>
        </header>
        <div className="p-4 w-full h-full overflow-auto pb-16">
          {dummyData.map((data, index) => (
            <div className="border rounded-md mb-2 shadow-sm" key={index}>
              <section
                className="flex justify-between w-full p-4 bg-zinc-100 rounded-t-md cursor-pointer hover:bg-bg-sub"
                onClick={() => handleToggleCollapse(index)}
              >
                <p>Total: {data.Total_Payment}</p>
                <p>{data.date}</p>
              </section>
              {collapsed[index] && (
                <div className="w-full flex-col flex gap-5 px-3 py-5">
                  <div className="w-full grid grid-cols-3 gap-4">
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Product Name
                      </p>
                      <p>{data.product_name || "N/A"}</p>
                      <hr />
                    </section>
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Category
                      </p>
                      <p>{data.category || "N/A"}</p>
                      <hr />
                    </section>
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Description
                      </p>
                      <p>{data.product_description || "N/A"}</p>
                      <hr />
                    </section>
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Price
                      </p>
                      <p>{data.product_price || "N/A"}</p>
                      <hr />
                    </section>
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Quantity
                      </p>
                      <p>{data.product_qty || "N/A"}</p>
                      <hr />
                    </section>
                  </div>
                  <div className="w-full bg-red grid grid-cols-3 gap-4">
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Service Type
                      </p>
                      <p>{data.service_type || "N/A"}</p>
                      <hr />
                    </section>
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Other Description
                      </p>
                      <p>{data.service_other || "N/A"}</p>
                      <hr />
                    </section>
                    <section className="w-full">
                      <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                        Service Fee
                      </p>
                      <p>{data.service_price || "N/A"}</p>
                      <hr />
                    </section>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
