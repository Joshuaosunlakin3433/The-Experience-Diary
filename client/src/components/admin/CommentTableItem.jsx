import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { blog, createdAt, _id } = comment;
  const BlogDate = new Date(createdAt);
  const { axios } = useAppContext();

  const performDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/admin/${_id}/delete-comment`);
      data.success ? toast.success(data.message) : toast.error(data.message);
      fetchComments();
    } catch (error) {
      toast.error(error.message);
    }
  };

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
                Are you sure you want to delete this comment?
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

  const toggleApprove = async () => {
    try {
      const { data } = await axios.patch(`/api/admin/${_id}/approve-comment`);
      data.success ? toast.success(data.message) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-600">Blog</b> : {blog.title}
        <br />
        <br />
        <b className="font-medium text-gray-600">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-gray-600">Comment</b> : {comment.content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-3">
          {!comment.isApproved ? (
            <img
              onClick={toggleApprove}
              src={assets.tick_icon}
              alt="tick icon"
              className="w-5 hover-scale-110 trasnition-all cursor-pointer"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            onClick={handleDelete}
            src={assets.bin_icon}
            alt="delete icon"
            className="w-5 hover-scale-110 trasnition-all cursor-pointer"
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
