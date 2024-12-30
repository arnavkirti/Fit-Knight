import React, { useState, useEffect } from "react";

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isOpen]);

  return (
    <div className="bg-gray-600 min-h-screen overflow-hidden">
      <div className="flex justify-between items-center p-4 text-white">
        <h2 className="text-2xl p-1 ml-5">Fit Knight</h2>

        <button
          onClick={openPopup}
          className="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
        >
          Select your Role
        </button>
      </div>
      <div className="flex flex-col justify-center items-start h-screen">
        <h1 className="text-7xl p-5 pb-2 text-white mb-10">Fit Knight</h1>
        <p className="text-lg pl-5 text-white bg-gray-700 p-5 mb-20">
          Your fitness journey, redefined. Build strength, find your fitness
          buddy, and conquer every challenge with FitKnight.
        </p>
      </div>
      {isOpen && (
        <div
          className="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center"
          onClick={closePopup}
        >
          <div
            className=" bg-white p-8 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl ml-5">Select Your Fate</h2>
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5 cursor-pointer"
            >
              Buddy Finder
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5 cursor-pointer"
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
