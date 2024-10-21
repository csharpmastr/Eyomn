import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FiMessageSquare } from "react-icons/fi";

const LLMChatbot = () => {
  const [isLLMOpen, setIsLLMOpen] = useState(false);

  const DummyConvo = [
    { id: 1, sender: "user", message: "Hi, what's the weather like today?" },
    { id: 2, sender: "bot", message: "The weather is sunny and 25°C today." },
    { id: 3, sender: "user", message: "Great! What can I do on a sunny day?" },
    {
      id: 4,
      sender: "bot",
      message: "How about going for a walk or visiting a park?",
    },
    { id: 5, sender: "user", message: "That sounds perfect. Thanks, Baymax!" },
    { id: 6, sender: "bot", message: "You're welcome! Have a great day!" },
  ];

  return (
    <div className="relative w-full h-fit">
      <button
        onClick={() => setIsLLMOpen(!isLLMOpen)}
        className="fixed bottom-5 right-5 bg-white border border-f-gray items-center flex justify-center rounded-full shadow-lg h-10 w-10 transition-all hover:scale-110 focus:outline-none"
      >
        <FiMessageSquare className="h-5 w-5" />
      </button>
      {isLLMOpen && (
        <div className="fixed bottom-20 right-5 w-80 bg-white shadow-lg border rounded-lg flex flex-col transition-all duration-300 ease-in-out">
          <div className="w-full h-fit p-3 flex items-center justify-between bg-bg-sb rounded-t-lg border border-b-f-gray">
            <h1 className="text-p-rg font-semibold">Convo 1</h1>
            <button
              className=" text-p-lg px-2 rounded-ful"
              onClick={() => setIsLLMOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="w-full px-4 pt-4 overflow-y-scroll h-[300px] text-p-rg text-f-light">
            {DummyConvo.map((msg) => (
              <section
                key={msg.id}
                className={`w-full flex mb-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`px-4 py-2 rounded-xl w-2/3 ${
                    msg.sender === "user" ? "bg-c-primary" : "bg-f-dark"
                  }`}
                >
                  {msg.message}
                </p>
              </section>
            ))}
          </div>
          <div className="w-full flex flex-col items-center p-3">
            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                name="convo"
                className="w-full px-4 py-1 border border-c-gray3 rounded-xl text-f-dark focus:outline-c-primary "
                placeholder="Message Baymax"
              />
              <IoIosAddCircleOutline className="w-10 h-10 text-c-gray3" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMChatbot;
