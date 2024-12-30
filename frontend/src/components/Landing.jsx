import React, { useState } from "react";

const Landing = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-stone-500">
        <h2 className="text-3xl">Fit Knight</h2>

        <button
          onClick={openPopup}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Select your Role
        </button>
      </div>
      <h1 className="text-4xl p-5 pb-2">Fit Knight</h1>
      <p className="pl-5">Find Buddies, Hit the GYM in Style!!</p>
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5"
            >
              Buddy Finder
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-5"
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
