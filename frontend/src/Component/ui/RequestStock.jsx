import React, { useState } from "react";

const RequestStock = ({ onClose, productDetails, productId }) => {
  const [requestForm, setRequestForm] = useState({
    prod_name: productDetails.product_name,
    quantity: "",
    remark: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRequestForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!requestForm.quantity || requestForm.quantity <= 10) {
      alert("Please meet the minimum request Qty");
      return;
    }
    console.log(productId);
    console.log("Submitting request:", requestForm);
    onClose();
  };

  return (
    <div className="fixed px-5 top-0 left-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-30 z-50 font-Poppins  text-f-dark">
      <div className="w-[500px] bg-white rounded-lg">
        <header className="p-4 border-b flex justify-between items-center">
          <h1 className="text-p-rg md:text-p-lg font-medium">Reques Stock</h1>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-md border hover:bg-zinc-50"
          >
            &times;
          </button>
        </header>
        <main className="p-4">
          <section className="mb-4">
            <label
              htmlFor="prod_name"
              className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
            >
              Product Name
            </label>
            <h6 className="text-p-rg font-medium">{`${productDetails.product_name} (${productDetails.category})`}</h6>
          </section>
          <section className="mb-4">
            <label
              htmlFor="quantity"
              className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
            >
              Stock Quantity Needed <span className="text-blue-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              value={requestForm.quantity}
              onChange={handleChange}
              min={0}
              className="mt-1 w-full px-4 py-3 border rounded-md border-f-gray focus:outline-c-primary"
              placeholder="Quantity"
            />
          </section>
          <section>
            <label
              htmlFor="remark"
              className="text-p-sc md:text-p-sm text-c-gray3 font-medium"
            >
              Remark
            </label>
            <textarea
              type="text"
              name="remark"
              value={requestForm.remark}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 border rounded-md border-f-gray focus:outline-c-primary resize-none"
              rows={3}
              placeholder="Reason for Request"
            />
          </section>
        </main>
        <footer className="flex justify-end p-4 gap-4">
          <button
            className="px-4 lg:px-12 py-2 text-f-dark text-p-sm md:text-p-rg font-medium rounded-md border shadow-sm hover:bg-sb-org"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 lg:px-12 py-2 bg-bg-con text-f-light text-p-sm md:text-p-rg font-medium rounded-md  hover:bg-opacity-75 active:bg-pressed-branch"
            onClick={handleSubmit}
          >
            Request
          </button>
        </footer>
      </div>
    </div>
  );
};

export default RequestStock;
