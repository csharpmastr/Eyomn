import React from "react";
import ReactDOM from "react-dom";
import { IoIosAddCircleOutline } from "react-icons/io";

const LLMChat = ({ onClose }) => {
  const DummyConvo = [
    {
      id: 1,
      sender: "user",
      message:
        "Hi there, I was wondering if you could help me with some information regarding machine learning. I'm particularly interested in understanding how reinforcement learning differs from other types of learning in AI systems. Could you explain that in detail?",
    },
    {
      id: 2,
      sender: "bot",
      message:
        "Of course! Reinforcement learning (RL) is a type of machine learning where an agent learns by interacting with its environment, receiving rewards or penalties for its actions, and adjusting its strategy accordingly. Unlike supervised learning, where the model learns from labeled data, RL learns by trial and error. The agent's goal is to maximize cumulative rewards over time. It's often used in robotics, game playing, and scenarios where decision-making over time is crucial. Does that clarify things?",
    },
    {
      id: 3,
      sender: "user",
      message:
        "Yes, that makes sense! But could you elaborate a bit more on how the 'rewards' work in RL? How are they assigned, and what determines whether an action is considered good or bad? I'm particularly curious about how this applies in a gaming context.",
    },
    {
      id: 4,
      sender: "bot",
      message:
        "Great question! In reinforcement learning, rewards are typically numerical values that represent the feedback an agent gets from the environment after performing an action. A positive reward signals that the action was good, while a negative reward or penalty signals a bad action. In gaming, for example, the agent might receive points for achieving objectives or penalties for losing lives or making poor decisions. The agent doesn't immediately know the long-term impact of each action, so it needs to explore different actions and learn over time what leads to higher cumulative rewards. This process is often called the exploration-exploitation tradeoff.",
    },
    {
      id: 5,
      sender: "user",
      message:
        "Thanks for the detailed explanation! It's really interesting to see how RL can apply to so many fields. One last question—can you explain how the exploration-exploitation tradeoff works in more detail, especially in situations where exploring might seem risky?",
    },
    {
      id: 6,
      sender: "bot",
      message:
        "You're welcome! The exploration-exploitation tradeoff is a fundamental aspect of reinforcement learning. 'Exploration' refers to trying new actions that the agent hasn’t taken before, which may lead to discovering better strategies or higher rewards. 'Exploitation,' on the other hand, means choosing actions that the agent already knows to yield the highest rewards based on its past experience. The challenge is balancing between these two: explore too much, and you waste time on suboptimal actions; exploit too much, and you miss out on potentially better strategies. In high-stakes environments like finance or healthcare, exploration might indeed be risky, so techniques like epsilon-greedy or decaying exploration rates are used to gradually shift from exploration to exploitation as the agent gains more confidence in its actions.",
    },
  ];

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen bg-gray-400 bg-opacity-30 z-50 font-Poppins">
      <div className="w-3/4 h-3/4 bg-white rounded-lg flex">
        <div className="w-1/6 border border-r-f-gray h-full py-4">
          <div className="flex justify-center">History</div>
        </div>
        <div className=" w-full h-full rounded-lg justify-between items-center flex flex-col">
          <div className="w-full h-fit p-4 flex items-center justify-between bg-bg-sb rounded-tr-lg border border-b-f-gray">
            <h1>Convo 1</h1>
            <button className=" text-p-lg px-2 rounded-ful" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="w-full h-full p-4 overflow-y-scroll text-p-rg text-f-light">
            {DummyConvo.map((msg) => (
              <section
                key={msg.id}
                className={`w-full flex mb-4 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`px-4 py-2 rounded-xl w-1/2 ${
                    msg.sender === "user" ? "bg-c-primary" : "bg-f-dark"
                  }`}
                >
                  {msg.message}
                </p>
              </section>
            ))}
          </div>
          <div className="w-full flex flex-col items-center p-4">
            <div className="relative w-full">
              <input
                type="text"
                name="convo"
                className="mt-1 w-full px-4 py-3 border border-c-gray3 rounded-lg text-f-dark mb-4 focus:outline-c-primary "
                placeholder="Message Baymax"
              />
              <IoIosAddCircleOutline className="w-6 h-6 absolute top-4 right-4 text-c-gray3" />
            </div>
            <p className="text-f-dark text-p-sm font-light">
              LLM Chatbot can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LLMChat;
