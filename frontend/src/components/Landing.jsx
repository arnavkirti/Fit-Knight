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
    <div className="bg-gray-800 min-h-screen overflow-hidden text-white">
      <div className="flex justify-between items-center p-6">
        <h2 className="text-3xl font-bold ml-6">Fit Knight</h2>

        <button
          onClick={openPopup}
           className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition"
        >
          Select your Role
        </button>
      </div>
      <div className="flex flex-col justify-center items-start h-screen text-center">
        <h1 className="text-6xl font-bold text-white ml-6 mb-4">Fit Knight</h1>
        <p className="text-xl text-white bg-gray-700 p-6 rounded-lg mb-12 mx-6">
          Your fitness journey, redefined. Build strength, find your fitness
          buddy, and conquer every challenge with FitKnight.
        </p>
      </div>
      {isOpen && (
        <div
          className="bg-black bg-opacity-60 fixed top-0 left-0 w-full h-full flex justify-center items-center"
          onClick={closePopup}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Your Fate</h2>
            <button
              onClick={handleBuddyFinder}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg mb-4 w-full transition"
            >
              Buddy Finder
            </button>
            <button
              onClick={handleGroupOrganizer}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg w-full transition"
            >
              Group Organiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
