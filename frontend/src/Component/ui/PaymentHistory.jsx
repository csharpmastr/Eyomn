import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientProductServiceAvail } from "../../Service/InventoryService";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { addPurchase, addServices } from "../../Slice/InventorySlice";

const PaymentHistory = ({ onClose }) => {
  const { patientId } = useParams();
  const cookies = new Cookies();
  const accessToken = cookies.get("accessToken");
  const refreshToken = cookies.get("refreshToken");
  const user = useSelector((state) => state.reducer.user.user);
  const [history, setHistory] = useState([]);
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const patient = patients.find((patient) => patient.patientId === patientId);
  const purchases = useSelector((state) => state.reducer.inventory.purchases);
  const services = useSelector((state) => state.reducer.inventory.services);
  const patientPurchases = [];
  let avails = [];
  console.log();

  useEffect(() => {
    const patientPurchases = purchases.filter(
      (purchase) => purchase.patientId === patientId
    );
    const patientServices = services.filter(
      (service) => service.patientId === patientId
    );

    if (
      user.role !== "2" ||
      patientPurchases.length > 0 ||
      patientServices.length > 0
    ) {
      setHistory([...patientServices, ...patientPurchases]);
    } else {
      const fetchPatientData = async () => {
        try {
          setIsLoading(true);
          const response = await getPatientProductServiceAvail(
            patient.branchId,
            patient.patientId,
            user.firebaseUid,
            accessToken,
            refreshToken
          );
          if (response) {
            const { purchases, services } = response;
            purchases.forEach((purchase) => {
              reduxDispatch(addPurchase(purchase));
            });
            services.forEach((service) => {
              reduxDispatch(addServices(service));
            });
            setHistory([...services, ...purchases]);
          }
        } catch (error) {
          console.error(
            "Error fetching patient product and service availability:",
            error
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchPatientData();
    }
  }, [
    patientId,
    user.role,
    accessToken,
    refreshToken,
    patient,
    purchases,
    services,
  ]);

  console.log(avails);

  const dummyData = [
    // Same as the dummy data, including both product and service types.
  ];

  // Track the index of the collapsed section
  const [collapsedIndex, setCollapsedIndex] = useState(null);

  const handleToggleCollapse = (index) => {
    setCollapsedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const serviceAvails = avails.filter((item) => item.service_type);

  return (
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div className="w-[380px] md:w-1/2 xl:w-[600px] h-[600px] bg-white rounded-md overflow-clip">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <h1>{}</h1>
          </div>
        ) : (
          <>
            <header className="p-4 bg-bg-sb border border-b-f-gray rounded-t-lg flex justify-between">
              <h1 className="text-p-rg md:text-p-lg text-c-secondary font-medium">
                Payment History
              </h1>
              <button onClick={onClose}> &times; </button>
            </header>
            <div className="p-4 w-full h-full overflow-auto pb-16">
              {history.map((data, index) => (
                <div className="border rounded-md mb-2 shadow-sm" key={index}>
                  <section
                    className="flex justify-between w-full p-4 bg-zinc-100 rounded-t-md cursor-pointer hover:bg-bg-sub"
                    onClick={() => handleToggleCollapse(index)}
                  >
                    <p>Total: {data.service_price || "0"}</p>
                    <p>{data.date || "N/A"}</p>
                  </section>
                  {collapsedIndex === index && (
                    <div className="w-full flex-col flex gap-5 px-3 py-5">
                      <div className="w-full grid grid-cols-3 gap-4">
                        {/* Conditionally Render Product Fields Only if Data Exists */}
                        {data.product_name && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Product Name
                            </p>
                            <p>{data.product_name || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                        {data.category && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Category
                            </p>
                            <p>{data.category || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                        {data.product_description && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Description
                            </p>
                            <p>{data.product_description || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                        {data.product_price && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Price
                            </p>
                            <p>{data.product_price || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                        {data.product_qty && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Quantity
                            </p>
                            <p>{data.product_qty || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                      </div>
                      {/* Render Only Service-Related Information */}
                      <div className="w-full bg-red grid grid-cols-3 gap-4">
                        {data.service_type && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Service Type
                            </p>
                            <p>{data.service_type || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                        {data.service_other && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Other Description
                            </p>
                            <p>{data.service_other || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                        {data.service_price && (
                          <section className="w-full">
                            <p className="text-f-gray mb-1 text-p-sc md:text-p-sm font-normal">
                              Service Fee
                            </p>
                            <p>{data.service_price || "N/A"}</p>
                            <hr />
                          </section>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
