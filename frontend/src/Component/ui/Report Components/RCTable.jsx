import React from "react";
import { useSelector } from "react-redux";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const RCTable = ({ selected, branch, searchTerm }) => {
  const branches = useSelector((state) => state.reducer.branch.branch);
  const patients = useSelector((state) => state.reducer.patient.patients);
  const products = useSelector((state) => state.reducer.inventory.products);
  const sales = useSelector((state) => state.reducer.inventory.purchases);
  const staffs = useSelector((state) => state.reducer.staff.staffs);
  const productTotals = {};

  const filteredPatients = branch
    ? patients.filter((patient) => patient.branchId === branch)
    : patients;

  const filteredSales = branch
    ? sales.filter((sale) => sale.branchId === branch)
    : sales;

  filteredSales.forEach((entry) => {
    entry.purchaseDetails.forEach((detail) => {
      const { productId, quantity, totalAmount } = detail;

      const product = products.find((p) => p.productId === productId);
      const price = product ? product.price : "Unknown Price";
      const product_name = product ? product.product_name : "Unknown Product";
      const brand = product ? product.brand : "Unknown Product";
      if (!productTotals[productId]) {
        productTotals[productId] = {
          product_name,
          brand,
          price,
          totalQuantity: 0,
          totalAmount: 0,
        };
      }

      productTotals[productId].totalQuantity += quantity;
      productTotals[productId].totalAmount += totalAmount;
    });
  });

  const filteredProducts = branch
    ? products.filter((product) => product.branchId === branch)
    : products;

  const filteredStaffs = branch
    ? staffs.filter((staffs) =>
        staffs.branches.some((branchItem) => branchItem.branchId === branch)
      )
    : staffs;

  const filteredSearchPatients = filteredPatients.filter((patient) =>
    `${patient.first_name || ""} ${patient.last_name || ""}`
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase())
  );

  const filteredSearchProducts = filteredProducts.filter(
    (product) =>
      product.product_name &&
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSearchStaffs = filteredStaffs.filter((staff) =>
    `${staff.first_name} ${staff.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSetRole = (role) => {
    const roleNum = parseInt(role, 10);
    if (roleNum === 0) {
      return "Org Manager";
    } else if (roleNum === 1) {
      return "Branch Manager";
    } else if (roleNum === 2) {
      return "Doctor";
    } else if (roleNum === 3) {
      return "Secretary";
    }
    return "Unknown Role";
  };

  const HEADERS = {
    Patients: [
      "Patient Name",
      "Date Admitted",
      "Reason for Visit",
      "Last Visit",
    ],
    Inventory: [
      "Product Name",
      "Category",
      "Expiration Date",
      "Product Retail",
      "Product Srp",
      "Stock",
    ],
    Sales: ["Product Name", "Category", "Price", "Quantity", "Total"],
    Staffs: ["Staff Name", "Role", "Branch", "Email Address", "Contact Number"],
  };
  const getBranchNames = (staffBranches) => {
    return staffBranches
      .map((branchItem) => {
        const branch = branches.find((b) => b.branchId === branchItem.branchId);
        return branch ? branch.name : "Unknown Branch";
      })
      .join("\n");
  };

  const headers = HEADERS[selected] || [];

  return (
    <div className="w-full text-f-dark">
      <header className="bg-bg-sb pl-5 py-4 rounded-md flex mb-3 shadow-sm">
        {headers.map((section) => (
          <div key={section} className="flex-1 font-medium">
            <h1>{section}</h1>
          </div>
        ))}
      </header>
      <section className="flex flex-col gap-5">
        {selected === "Patients" ? (
          <>
            {filteredSearchPatients.map((reportData, index) => (
              <div
                key={index}
                className="pl-5 py-4 text-f-dark bg-f-light rounded-md shadow-sm flex"
              >
                <div className="flex-1">
                  {reportData.first_name + " " + reportData.last_name}
                </div>
                <div className="flex-1">{formatDate(reportData.createdAt)}</div>
                <div className="flex-1">----</div>
                <div className="flex-1">----</div>
              </div>
            ))}
          </>
        ) : selected === "Inventory" ? (
          <>
            {filteredSearchProducts.map((reportData, index) => (
              <div
                key={index}
                className="pl-5 py-3 text-f-dark bg-f-light rounded-md shadow-sm flex"
              >
                <div className="flex-1">{reportData.product_name}</div>
                <div className="flex-1">{reportData.category}</div>
                <div className="flex-1">
                  {reportData.expirationDate
                    ? formatDate(reportData.expirationDate)
                    : "N/A"}
                </div>
                <div className="flex-1">{reportData.retail_price || "N/A"}</div>
                <div className="flex-1">{reportData.price}</div>
                <div className="flex-1">{reportData.quantity}</div>
              </div>
            ))}
          </>
        ) : selected === "Sales" ? (
          <>
            {Object.entries(productTotals).map(
              ([productId, product], index) => (
                <div
                  key={productId}
                  className="pl-5 py-3 text-f-dark bg-f-light rounded-md shadow-sm flex"
                >
                  <div className="flex-1">{product.product_name}</div>
                  <div className="flex-1">{product.brand || ""}</div>
                  <div className="flex-1">{product.price || ""}</div>
                  <div className="flex-1">{product.totalQuantity}</div>
                  <div className="flex-1">{product.totalAmount}</div>
                </div>
              )
            )}
          </>
        ) : (
          <>
            {filteredSearchStaffs.map((reportData, index) => (
              <div
                key={index}
                className="pl-5 py-3 text-f-dark bg-f-light rounded-md shadow-sm flex"
              >
                <div className="flex-1 flex items-center">
                  {reportData.first_name + " " + reportData.last_name}
                </div>
                <div className="flex-1 flex items-center">
                  {handleSetRole(reportData.role)}
                </div>
                <div className="flex-1">
                  {getBranchNames(reportData.branches)
                    .split("\n")
                    .map((branch, index) => (
                      <div key={index}>{branch}</div>
                    ))}
                </div>
                <div className="flex-1 flex items-center">
                  {reportData.email}
                </div>
                <div className="flex-1 flex items-center">
                  {reportData.contact_number}
                </div>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default RCTable;
