import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt, _id } = blog;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  //actual delete function
  const performDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/blog/${_id}/delete`);
      data.success ? toast.success(data.message) : toast.error(data.message);
      await fetchBlogs();
    } catch (error) {
      toast.error(error.message);
    }
  };

  //toggle publish
  const togglePublish = async () => {
    try {
      const { data } = await axios.patch(`/api/blog/${_id}/toggle-publish`);
      data.success ? toast.success(data.message) : toast.error(data.message);
      fetchBlogs()
    } catch (error) {
      toast.error(error.message);
    }
  };
  //custom toast confirmation
  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Delete Blog</h4>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete "{title}"?
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                performDelete();
              }}
              className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // Stays until user clicks
        position: "top-center",
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "16px",
          maxWidth: "400px",
        },
      }
    );
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button onClick={togglePublish} className="border px-2 py-0.5 mt-1 rounded cursor-pointer">
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        <img
          onClick={handleDelete}
          src={assets.cross_icon}
          alt="cross icon"
          className="w-8 hover:scale-110 transition-all cursor-pointer"
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
