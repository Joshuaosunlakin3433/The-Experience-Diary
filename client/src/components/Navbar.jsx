import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const { navigate, token, logout } = useAppContext();

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        onClick={() => navigate("/")}
        src={assets.ED_logo}
        alt="Experience Diary Logo"
        className="ed-logo"
      />
      <div className="flex items-center gap-4">
        <DarkModeToggle />
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-10 py-2.5 hover:scale-105 transition-all duration-300 ease-in-out shadow-theme-md"
        >
          {token ? "Dashboard" : "Login"}
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
