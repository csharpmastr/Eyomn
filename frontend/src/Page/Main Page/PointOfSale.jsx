import React from "react";
import { IoMdSearch } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import PosTable from "../../Component/ui/PosTable";

const PointOfSale = () => {
  const [selectedProducts, setSelectedProducts] = React.useState([]);

  const handleProductSelect = (product) => {
    const existingProductIndex = selectedProducts.findIndex(
      (item) => item.productId === product.productId
    );
    if (existingProductIndex > -1) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (action, productId) => {
    setSelectedProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.productId === productId) {
          const newQuantity =
            action === "increase"
              ? product.quantity + 1
              : Math.max(product.quantity - 1, 0);
          return { ...product, quantity: newQuantity };
        }
        return product;
      });
    });
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.productId !== productId)
    );
  };

  return (
    <div className="text-f-dark font-Poppins flex h-full">
      <div className="flex flex-col w-3/4 px-6 pt-6">
        <div className="flex flex-row h-14 mb-6">
          <div className="flex flex-row border border-c-gray3 px-4 rounded-lg justify-center items-center w-full">
            <IoMdSearch className="h-8 w-8 text-c-secondary" />
            <input
              type="text"
              className="w-full focus:outline-none placeholder-f-gray2 bg-bg-mc text-p-rg"
              placeholder="Search product... "
              //value={searchTerm}
              //onChange={handleSearchChange}
            />
          </div>
          <div className="ml-2 h-auto flex justify-center items-center rounded-lg px-4 py-3 border border-c-gray3 font-medium font-md hover:cursor-pointer">
            <IoIosAddCircleOutline className="h-6 w-6 md:mr-2" />
            <select className="md:block hover:cursor-pointer focus:outline-none bg-bg-mc">
              <option value="" disabled selected>
                Filter
              </option>
              <option value="filter1">Filter 1</option>
              <option value="filter2">Filter 2</option>
              <option value="filter3">Filter 3</option>
            </select>
          </div>
        </div>
        <header className="flex text-p-rg font-semibold py-5 bg-white border border-b-f-gray rounded-t-lg sticky">
          <div className="w-1/6 pl-4">Code</div>
          <div className="flex-1 pl-4">Product Name</div>
          <div className="flex-1 pl-4">Category</div>
          <div className="w-1/6 pl-4">Price</div>
          <div className="w-1/6 pl-4">Quantity</div>
        </header>
        <div className="overflow-y-scroll">
          <div className="rounded-lg">
            <PosTable onProductSelect={handleProductSelect} />
          </div>
        </div>
      </div>
      <div className="w-2/5 h-full border border-l-f-gray bg-white flex flex-col">
        <header className="p-6">
          <h1 className="text-p-lg font-semibold text-f-dark">Order List</h1>
        </header>
        <div className="h-full overflow-y-scroll">
          {selectedProducts.map((product) => (
            <div
              className="px-6 py-6 border-f-gray border-b flex gap-8 "
              key={product.productId}
            >
              <button
                onClick={() => handleDeleteProduct(product.productId)}
                className="text-2xl"
              >
                &times;
              </button>
              <div className="w-full">
                <div className="flex justify-between">
                  <h1 className="text-p-rg font-semibold">
                    {product.product_name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 border border-c-gray3 rounded-md text-f-dark flex items-center justify-center focus:outline-none"
                      onClick={() =>
                        handleQuantityChange("decrease", product.productId)
                      }
                    >
                      -
                    </button>

                    <input
                      type="text"
                      value={product.quantity}
                      className="w-12 h-8 text-center border rounded-md border-c-gray3 text-f-dark focus:outline-c-primary"
                      readOnly
                    />

                    <button
                      type="button"
                      className="w-8 h-8 border border-c-gray3 rounded-md text-f-dark flex items-center justify-center focus:outline-none"
                      onClick={() =>
                        handleQuantityChange("increase", product.productId)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-f-gray2">Php {product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <div className="rounded-lg bg-bg-sb p-6 mx-6 mb-6 shadow-gray-300 shadow-md">
            <div className="flex justify-between mb-2 text-rg">
              <p className="text-f-gray2">Total</p>
              <p className="font-semibold text-f-dark">Php. 0.00</p>
            </div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-f-gray2">Cash Tendered</p>
              <input
                type="text"
                name="price"
                //value={formData.price}
                //onChange={handleChange}
                className="w-28 h-10 border text-end px-2 border-c-gray3 rounded-md text-f-dark focus:outline-c-primary"
              />
            </div>
            <hr className="border-f-gray text-rg" />
            <div className="flex justify-between mt-5">
              <p className="text-f-gray2">Change</p>
              <p className="font-semibold text-f-dark">Php. 0.00</p>
            </div>
          </div>
          <div className="px-6 pb-6">
            <button className="w-full h-12 bg-[#31d19c] text-f-light text-p-rg font-semibold rounded-lg">
              Process Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointOfSale;
