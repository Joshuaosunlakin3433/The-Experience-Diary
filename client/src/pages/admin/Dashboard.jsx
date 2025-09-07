import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const { axios } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      data.success
        ? setDashboardData(data.dashboardData)
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10 bg-theme-secondary">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-theme-primary p-4 min-w-58 rounded shadow-theme-md cursor-pointer hover:scale-105 transition-all duration-300">
          <img src={assets.dashboard_icon_1} alt="" className="dark:invert" />
          <div>
            <p className="text-xl font-semibold text-theme-secondary">
              {dashboardData.blogs}
            </p>
            <p className="text-theme-muted font-light">Blogs</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-theme-primary p-4 min-w-58 rounded shadow-theme-md cursor-pointer hover:scale-105 transition-all duration-300">
          <img src={assets.dashboard_icon_2} alt="" className="dark:invert" />
          <div>
            <p className="text-xl font-semibold text-theme-secondary">
              {dashboardData.comments}
            </p>
            <p className="text-theme-muted font-light">Comments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-theme-primary p-4 min-w-58 rounded shadow-theme-md cursor-pointer hover:scale-105 transition-all duration-300">
          <img src={assets.dashboard_icon_3} alt="" className="dark:invert" />
          <div>
            <p className="text-xl font-semibold text-theme-secondary">
              {dashboardData.drafts}
            </p>
            <p className="text-theme-muted font-light">Drafts</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-theme-secondary">
          <img
            src={assets.dashboard_icon_4}
            alt="bloglist icon"
            className="dark:invert"
          />
          <p>Latest Blogs</p>
        </div>

        <div className="relative max-w-4xl overflow-x-auto shadow-theme-md rounded-lg scrollbar-hide bg-theme-primary">
          <table className="w-full text-sm text-theme-muted">
            <thead className="text-xs text-theme-secondary text-left uppercase">
              <tr>
                <th scope="col" className="px-2 py-4 xl:px-6">
                  #
                </th>
                <th scope="col" className="px-2 py-4">
                  Blog Title
                </th>
                <th scope="col" className="px-2 py-4">
                  Date
                </th>
                <th scope="col" className="px-2 py-4">
                  Status
                </th>
                <th scope="col" className="px-2 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBlogs.map((blog, index) => {
                return (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={fetchDashboard}
                    index={index + 1}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
