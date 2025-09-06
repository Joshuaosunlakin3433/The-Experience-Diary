import { Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "../../context/AppContext";
import DarkModeToggle from "../../components/DarkModeToggle";

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext();
  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    navigate("/admin");
  };

  return (
    <>
      <div className="flex items-center justify-between h-[80px] py-2 sm:px-12 border-b border-theme-primary bg-theme-primary">
        <img
          src={assets.ED_logo}
          alt="Experience Diary Logo"
          className="ed-logo cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button
            onClick={() => {
              logout();
            }}
            className="text-sm px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-theme-md"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
