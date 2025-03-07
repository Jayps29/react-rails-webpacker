import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">My App</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/signin" className="hover:underline">
              Sign In
            </a>
          </li>
          <li>
            <a href="/signout" className="hover:underline">
              Sign Out
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
