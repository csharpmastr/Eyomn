import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addService,
  getPatientProductServiceAvail,
} from "../../Service/InventoryService";
import Cookies from "universal-cookie";
import { useParams } from "react-router-dom";
import { addPurchase, addServices } from "../../Slice/InventorySlice";
import PointOfSale from "../../Page/Main Page/PointOfSale";

const PaymentHistory = ({ onClose }) => {
  const { patientId } = useParams();
  const user = useSelector((state) => state.reducer.user.user);
  const [history, setHistory] = useState([]);
  const [collapsedIndex, setCollapsedIndex] = useState(null);
  const reduxDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [openPOS, setOpenPOS] = useState(false);

  const patients = useSelector((state) => state.reducer.patient.patients);
  const patient = patients.find((patient) => patient.patientId === patientId);
  const purchases = useSelector((state) => state.reducer.inventory.purchases);
  const services = useSelector((state) => state.reducer.inventory.services);

  const togglePOS = () => setOpenPOS(!openPOS);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        console.log("running?");

        setIsLoading(true);

        // Filter from Redux store
        const patientPurchases = purchases.filter(
          (purchase) => purchase.patientId === patientId
        );
        const patientServices = services.filter(
          (service) => service.patientId === patientId
        );

        // Use Redux data if available
        if (
          user.role !== "2" ||
          patientPurchases.length > 0 ||
          patientServices.length > 0
        ) {
          setHistory([...patientServices, ...patientPurchases]);
        } else {
          // Fetch from API if no data in Redux store
          const response = await getPatientProductServiceAvail(
            patient.branchId,
            patient.patientId,
            user.firebaseUid
          );

          if (response) {
            const { purchases, services } = response;

            // Add data to Redux store
            purchases.forEach((purchase) => {
              reduxDispatch(addPurchase(purchase));
            });
            services.forEach((service) => {
              reduxDispatch(addServices(service));
            });

            // Update local state
            setHistory([...services, ...purchases]);
          }
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
  }, [patientId, user.role, patient, purchases, services, reduxDispatch]);

  const handleToggleCollapse = (index) => {
    setCollapsedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const serviceAvails = history.filter((item) => item.service_type);

  return (
    <>
      <div className="w-full h-fit bg-white text-f-dark font-Poppins">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <h1>Loading...</h1>
          </div>
        ) : (
          <>
            <header className="flex w-full h-fit justify-between items-center mb-4">
              <h1 className="text-p-sm md:text-p-rg font-medium text-f-dark">
                Payment History
              </h1>
              <button
                className="bg-c-branch px-4 py-2 rounded-md text-f-light"
                onClick={togglePOS}
              >
                Dispense
              </button>
            </header>
            <div className="w-full h-full">
              {history.length === 0 ? (
                <div className="text-center mt-10">
                  <h2>No history available</h2>
                </div>
              ) : (
                serviceAvails.map((data, index) => (
                  <div className="border rounded-md mb-4 shadow-sm" key={index}>
                    <section
                      className="flex justify-between w-full p-3 cursor-pointer bg-bg-sb hover:bg-bg-sub"
                      onClick={() => handleToggleCollapse(index)}
                    >
                      <p className="font-medium">
                        Total:{" "}
                        <span className="text-c-primary">
                          {data.service_price || "0"}
                        </span>
                      </p>
                      <p className="text-p-sm text-c-gray3">
                        {data.createdAt
                          ? new Date(data.createdAt).toISOString().split("T")[0]
                          : "N/A"}
                      </p>
                    </section>
                    {collapsedIndex === index && (
                      <div className="w-full flex-col flex px-3 py-5">
                        <div className="w-full grid grid-cols-3 gap-4">
                          {data.product_name && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Product Name
                              </p>
                              <p>{data.product_name || "N/A"}</p>
                              <hr />
                            </section>
                          )}
                          {data.category && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Category
                              </p>
                              <p>{data.category || "N/A"}</p>
                              <hr />
                            </section>
                          )}
                          {data.product_description && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Description
                              </p>
                              <p>{data.product_description || "N/A"}</p>
                              <hr />
                            </section>
                          )}
                          {data.product_price && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Price
                              </p>
                              <p>{data.product_price || "N/A"}</p>
                              <hr />
                            </section>
                          )}
                          {data.product_qty && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Quantity
                              </p>
                              <p>{data.product_qty || "N/A"}</p>
                              <hr />
                            </section>
                          )}
                        </div>
                        <div className="w-full grid grid-cols-3 gap-4">
                          {data.service_type && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Service Type
                              </p>
                              <p>{data.service_type || "N/A"}</p>
                            </section>
                          )}
                          {data.service_price && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Service Fee
                              </p>
                              <p>Php. {data.service_price || "N/A"}</p>
                            </section>
                          )}
                          {data.service_other && (
                            <section className="w-full">
                              <p className="text-f-gray2 mb-1 text-p-sc md:text-p-sm font-normal">
                                Other Description
                              </p>
                              <p>{data.service_other || "N/A"}</p>
                            </section>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
        {openPOS && <PointOfSale onClose={togglePOS} patient={patient} />}
      </div>
    </>
  );
};

export default PaymentHistory;
