import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  const handleBuddyFinder = () => {
    navigate("/api/user");
  };

  const handleGroupOrganizer = () => {
    navigate("/api/admin");
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpen]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white font-sans">
      <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <h2 className="text-4xl font-extrabold tracking-wide text-white">
          Fit Knight
        </h2>
        <button
          onClick={openPopup}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105"
        >
          Select Your Role
        </button>
      </header>

      <div className="flex flex-col justify-center items-start h-[calc(100vh-80px)] px-8 text-left">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-6">
          Unleash Your Inner Hero
        </h1>
        <h2 className="text-3xl font-semibold text-gray-300 leading-relaxed mb-8">
          Train Like Gotham’s Guardian, Conquer Your Fitness!
        </h2>
        <p className="text-lg md:text-xl text-gray-400 bg-gray-700 p-6 rounded-lg shadow-md max-w-3xl">
          Your fitness journey, redefined. Fit Knight empowers you to:
          <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-300">
            <li>Build strength and resilience with personalized workouts.</li>
            <li>Connect with fitness buddies who share your goals.</li>
            <li>Organize groups to achieve collective fitness milestones.</li>
            <li>Track your progress and unleash your full potential.</li>
          </ul>
        </p>
      </div>

      {isOpen && (
        <div
          className="bg-black bg-opacity-70 fixed top-0 left-0 w-full h-full flex justify-center items-center"
          onClick={closePopup}
        >
          <div
            className="bg-gray-800 text-gray-100 p-8 rounded-lg shadow-2xl w-96 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-semibold mb-6">Select Your Fate</h2>
            <button
              onClick={handleBuddyFinder}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg mb-4 w-full transition transform hover:scale-105"
            >
              Buddy Finder
            </button>
            <button
              onClick={handleGroupOrganizer}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg w-full transition transform hover:scale-105"
            >
              Group Organizer
            </button>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
              onClick={closePopup}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
