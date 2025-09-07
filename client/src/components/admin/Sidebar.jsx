import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  return (
    <div className="flex flex-col border-r border-theme-primary bg-theme-secondary min-h-full pt-6">
      <NavLink
        end={true}
        to="/admin"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer text-theme-primary hover:bg-theme-tertiary transition-all duration-300 ease-in-out ${
            isActive &&
            "bg-purple-100 dark:bg-purple-900/30 border-r-4 border-purple-600"
          }`
        }
      >
        <img
          src={assets.home_icon}
          alt="Home Icon"
          className="min-w-4 w-5 dark:invert"
        />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>

      <NavLink
        to="/admin/addBlog"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer text-theme-primary hover:bg-theme-tertiary transition-all duration-300 ease-in-out ${
            isActive &&
            "bg-purple-100 dark:bg-purple-900/30 border-r-4 border-purple-600"
          }`
        }
      >
        <img
          src={assets.add_icon}
          alt="Home Icon"
          className="min-w-4 w-5 dark:invert"
        />
        <p className="hidden md:inline-block">Add blogs</p>
      </NavLink>

      <NavLink
        to="/admin/listBlog"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer text-theme-primary hover:bg-theme-tertiary transition-all duration-300 ease-in-out ${
            isActive &&
            "bg-purple-100 dark:bg-purple-900/30 border-r-4 border-purple-600"
          }`
        }
      >
        <img
          src={assets.list_icon}
          alt="Home Icon"
          className="min-w-4 w-5 dark:invert"
        />
        <p className="hidden md:inline-block">Blog Lists</p>
      </NavLink>

      <NavLink
        to="/admin/comments"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer text-theme-primary hover:bg-theme-tertiary transition-all duration-300 ease-in-out ${
            isActive &&
            "bg-purple-100 dark:bg-purple-900/30 border-r-4 border-purple-600"
          }`
        }
      >
        <img
          src={assets.comment_icon}
          alt="Home Icon"
          className="min-w-4 w-5 dark:invert"
        />
        <p className="hidden md:inline-block">Comments</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
