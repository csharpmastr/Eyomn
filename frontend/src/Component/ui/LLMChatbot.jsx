import { useState, useEffect } from "react";
import { MdSend } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";
import { sendQuestion } from "../../Service/UserService";
import ChatLogo from "../../assets/Image/chatbot.png";

const LLMChatbot = () => {
  const [isLLMOpen, setIsLLMOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isOmnieTyping, setIsOmnieTyping] = useState(false);
  const [memory, setMemory] = useState([]);
  const [hasOpenedChat, setHasOpenedChat] = useState(false);
  const handleSendQuestion = async () => {
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
      try {
        const response = await sendQuestion(userQuestion, memory);

        const newBotMessage = {
          id: conversation.length + 2,
          sender: "bot",
          message: response.data,
        };
        setConversation((prevConversation) => [
          ...prevConversation,
          newBotMessage,
        ]);
        setIsOmnieTyping(false);
        const memoryEntry = { question: userQuestion, answer: response.data };
        setMemory((prevState) => [...prevState, memoryEntry]);
      } catch (error) {
      } finally {
        setIsOmnieTyping(false);
      }
    }
  };

  useEffect(() => {
    if (!hasOpenedChat) {
      const timer = setTimeout(() => {
        setIsLLMOpen(true);
        setHasOpenedChat(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasOpenedChat]);

  return (
    <div className="relative w-full h-fit font-Poppins">
      <button
        onClick={() => setIsLLMOpen(!isLLMOpen)}
        className="fixed bottom-5 right-5 border border-f-gray items-center flex justify-center rounded-full shadow-lg h-12 w-12 transition-all hover:scale-110 focus:outline-none"
      >
        <img src={ChatLogo} className="w-8 h-8" />
      </button>
      {isLLMOpen && (
        <div className="fixed bottom-20 right-5 w-96 bg-white shadow-lg border rounded-lg flex flex-col transition-all duration-300 ease-in-out">
          <div className="w-full h-fit px-3 py-2 flex items-center justify-between bg-bg-sb rounded-t-lg border border-b-f-gray">
            <h1 className="text-p-rg font-medium text-f-dark">Eyomn AI</h1>
            <button
              className="text-p-lg px-2 rounded-ful"
              onClick={() => setIsLLMOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="w-full px-4 pt-4 overflow-y-scroll h-[360px] text-p-rg">
            {conversation.length === 0 && (
              <div className="w-full text-p-sm flex flex-col items-center p-4 gap-10">
                <img src={ChatLogo} className="w-24 h-24" />
                <p className="w-full text-p-sm text-center">
                  <span className="text-p-lg font-medium">Hi there! </span>
                  <br />
                  I’m EyomnAI, ready to assist you with Eyomn software. What do
                  you need help with?
                </p>
              </div>
            )}
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
          <div className="w-full flex flex-col items-center px-3 gap-2 mb-2">
            <div className="flex w-full items-center gap-2">
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                className="w-full pl-4 pr-8 py-3 border border-c-gray3 rounded-lg text-f-dark focus:outline-c-primary text-p-sm resize-none"
                placeholder="Message EyomnAI"
                rows={1}
              />

              <button
                onClick={handleSendQuestion}
                className="w-6 h-6 text-c-gray3 absolute right-6 hover:text-f-dark"
              >
                <MdSend className="w-6 h-6" />
              </button>
            </div>
            <p className="text-p-sc font-light text-f-gray2">
              AI may produce inaccurate information
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMChatbot;
