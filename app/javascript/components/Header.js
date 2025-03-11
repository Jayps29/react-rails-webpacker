import { useState, useEffect } from "react";
import DeleteAccountButton from "./DeleteAccountButton";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/users/current", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.signed_in) {
          setUser(data.user);
        }
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/users/sign_out", {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
      },
    });
    window.location.reload(); // Refresh after logout
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <a href="/" className="text-xl font-semibold hover:text-blue-500 transition duration-200">
        My App
      </a>
      <nav>
        <ul className="flex space-x-4">
          {user ? (
            <>
              <li>Welcome, {user.email}</li>
              <li>
                <a href="/users/edit" className="hover:underline">
                  Edit Profile
                </a>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/users/sign_in" className="hover:underline">
                  Login
                </a>
              </li>
              <li>
                <a href="/users/sign_up" className="hover:underline">
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
