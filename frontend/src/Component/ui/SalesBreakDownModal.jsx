import React from "react";
import BannerBg from "../../assets/Image/BannerBg.png";
import { useSelector } from "react-redux";

const SalesBreakDownModal = ({ gross, onClose }) => {
  const products = useSelector((state) => state.reducer.inventory.products);
  const sales = useSelector((state) => state.reducer.inventory.purchases);
  const services = useSelector((state) => state.reducer.inventory.services);
  console.log(sales);
  console.log(products);

  const productCategoryMap = products
    .filter((product) => !product.isDeleted)
    .reduce((map, product) => {
      map[product.productId] = product.category;
      return map;
    }, {});

  const totalAmountAndQuantityPerCategory = sales.reduce((result, purchase) => {
    purchase.purchaseDetails.forEach((detail) => {
      const category = productCategoryMap[detail.productId];
      if (category) {
        result[category] = result[category] || { totalAmount: 0, quantity: 0 };
        result[category].totalAmount += detail.totalAmount;
        result[category].quantity += detail.quantity;
      }
    });
    return result;
  }, {});

  const updatedTotalAmountAndQuantityPerCategory = services.reduce(
    (result, service) => {
      const serviceCategory = "services";
      result[serviceCategory] = result[serviceCategory] || {
        totalAmount: 0,
        quantity: 0,
      };
      result[serviceCategory].totalAmount += service.service_price;
      result[serviceCategory].quantity += 1;
      return result;
    },
    { ...totalAmountAndQuantityPerCategory }
  );

  console.log(updatedTotalAmountAndQuantityPerCategory);

  return (
    <div className="fixed top-0 left-0 flex items-center p-4 justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins">
      <div
        className="w-auto rounded-md flex flex-col p-8 gap-4 bg-cover bg-no-repeat bg-center bg-bg-sub"
        style={{ backgroundImage: `url(${BannerBg})` }}
      >
        <header className="flex justify-between items-start">
          <div>
            <p>Gross Income:</p>
            <h1 className="text-h-h4">{`PHP ${gross}`}</h1>
          </div>
          <button onClick={onClose} className="text-f-dark">
            &times;
          </button>
        </header>
        <div className="flex gap-2">
          {Object.entries(updatedTotalAmountAndQuantityPerCategory).map(
            ([category, { totalAmount, quantity }], index) => (
              <div
                key={index}
                className="flex flex-col gap-2 shadow-sm bg-red-50 p-8 rounded-md"
              >
                <span>
                  <p className="text-f-gray">
                    {category === "services" ? "Services" : `${category}`}:
                  </p>
                  <h1 className="text-f-dark text-p-lg font-medium">
                    Php {totalAmount.toLocaleString()}
                  </h1>
                </span>

                <p className="text-p-sm">
                  {category !== "services"
                    ? `Quantity sold: ${quantity.toLocaleString()}`
                    : ` Services availed: ${quantity.toLocaleString()}`}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesBreakDownModal;
