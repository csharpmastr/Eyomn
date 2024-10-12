import React, { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";

const InventoryTable = () => {
  const products = useSelector((state) => state.reducer.product.products);
  const [collapsedProducts, setCollapsedProducts] = useState({});

  const handleCollapseToggle = (productId) => {
    setCollapsedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  return (
    <div className="w-fit md:w-full rounded-lg bg-white text-f-dark overflow-x-auto font-poppins">
      <header className="flex text-p-rg font-semibold py-8 border border-b-f-gray">
        <div className="flex-1 pl-4">Product Name</div>
        <div className="flex-1 pl-4">Category</div>
        <div className="flex-1 pl-4">Prescription/Type</div>
        <div className="flex-1 pl-4">Price</div>
        <div className="flex-1 pl-4">Quantity</div>
        <div className="flex-1 pl-4">Brand</div>
        <div className="w-20"></div>
      </header>
      <main>
        {products.map((product, index) => {
          // Default to true (collapsed) if not already set
          const isCollapsed = collapsedProducts[product.productId] !== false;

          return (
            <section
              key={product.productId}
              className={`${index % 2 === 0 ? "bg-bg-mc" : "bg-white"}`}
            >
              <div
                className={`flex text-p-rg py-6 ${
                  isCollapsed ? "border border-b-f-gray" : ""
                }`}
              >
                <div className="flex-1 pl-4">{product.product_name}</div>
                <div className="flex-1 pl-4">
                  {product.category || "Eyeglasses"}
                </div>
                <div className="flex-1 pl-4">
                  {product.eyeglass_category || ""}
                </div>
                <div className="flex-1 pl-4">Php {product.price || 0}</div>
                <div className="flex-1 pl-4">{product.quantity || 0}</div>
                <div className="flex-1 pl-4">
                  {product.brand || "Luxottica"}
                </div>
                <div className="w-20 flex">
                  <IoIosAddCircleOutline
                    className="h-6 w-6 md:mr-2"
                    onClick={() => handleCollapseToggle(product.productId)}
                  />
                </div>
              </div>
              {!isCollapsed && (
                <div className={`py-5 flex border border-b-f-gray`}>
                  <div className="flex-1 pl-4">
                    <p className="text-p-sm">Other Info:</p>
                    <p>Sample Info</p>
                  </div>
                  <div className="flex-1 pl-4">
                    <p className="text-p-sm">Other Info:</p>
                    <p>Sample Info</p>
                  </div>
                  <div className="flex-1 pl-4">
                    <p className="text-p-sm">Other Info:</p>
                    <p>Sample Info</p>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default InventoryTable;
