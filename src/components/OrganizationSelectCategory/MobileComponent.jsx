// MobileComponent.js
import React from "react";
import { useNavigate } from "react-router-dom";

const MobileComponent = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full py-4 bg-gray-200 text-center font-bold text-lg">
        Volunteer Dashboard
      </header>

      {/* Content */}
      <div className="flex flex-col w-full max-w-md px-4 py-12 space-y-4">
        {/* Title */}
        <h2 className="text-center text-xl font-semibold">Select Category</h2>
        {/* Category Buttons */}
        <CategoryButton text="Feed Food for Needy" route="/feed-food" />
        <CategoryButton text="Feed for Stray Cats / Dogs" route="/feed-stray" />
        {/* <CategoryButton
          text="Provide Medicines to the Poor"
          route="/provide-medicines"
        /> */}
        {/* <CategoryButton
          text="Sanitary Pads to Poor Girls"
          route="/sanitary-pads"
        /> */}
        <CategoryButton text="Groceries to Poor" route="/groceries-to-poor" />
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center bg-gray-200 font-bold mt-auto">
        AKB
      </footer>
    </div>
  );
};

// CategoryButton Component
const CategoryButton = ({ text, route }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(route);
  };

  return (
    <button
      onClick={handleNavigation}
      className="flex justify-between items-center w-full px-4 py-4 bg-white rounded-lg shadow-md text-gray-800"
    >
      <span>{text}</span>
      <span>&#8250;</span>
    </button>
  );
};

export default MobileComponent;
