import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { MdSend } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";

const LLMChatbot = () => {
  const [isLLMOpen, setIsLLMOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isOmnieTyping, setIsOmnieTyping] = useState(false);

  const handleSendQuestion = () => {
    if (userQuestion.trim()) {
      const newUserQuestion = {
        id: conversation.length + 1,
        sender: "user",
        message: userQuestion,
      };

      setConversation((prevConversation) => [
        ...prevConversation,
        newUserQuestion,
      ]);
      setUserQuestion("");

      setIsOmnieTyping(true);

      setTimeout(() => {
        const newBotMessage = {
          id: conversation.length + 2,
          sender: "bot",
          message: "LLM sample answer hahahaha",
        };
        setConversation((prevConversation) => [
          ...prevConversation,
          newBotMessage,
        ]);

        setIsOmnieTyping(false);
      }, 2000);
    }
  };

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
          <div className="w-full h-fit px-3 py-2 flex items-center justify-between bg-bg-sb rounded-t-lg border border-b-f-gray">
            <h1 className="text-p-rg font-medium text-f-dark">Omnie</h1>
            <button
              className="text-p-lg px-2 rounded-ful"
              onClick={() => setIsLLMOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="w-full px-4 pt-4 overflow-y-scroll h-[300px] text-p-rg">
            {conversation.map((msg) => (
              <section
                key={msg.id}
                className={`w-full flex mb-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`w-2/3 max-w-full flex flex-wrap  ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className={`px-4 py-2 rounded-xl w-fit break-words word-break overflow-hidden text-wrap ${
                      msg.sender === "user"
                        ? "bg-c-primary text-f-light"
                        : "bg-zinc-200 text-f-dark"
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
              </section>
            ))}
            {isOmnieTyping && (
              <div className="w-full mb-2">
                <BeatLoader size={6} color={"#359898"} />
              </div>
            )}
          </div>
          <div className="w-full flex flex-col items-center p-3">
            <div className="flex w-full items-center gap-2">
              <input
                type="text"
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="w-full px-4 py-2 border border-c-gray3 rounded-lg text-f-dark focus:outline-c-primary"
                placeholder="Message Omnie"
              />
              <button
                onClick={handleSendQuestion}
                className="w-6 h-6 text-c-gray3 absolute right-5 hover:text-f-dark"
              >
                <MdSend className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMChatbot;
