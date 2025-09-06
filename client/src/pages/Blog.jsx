import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import moment from "moment";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Blog = () => {
  const { id } = useParams();

  const { axios } = useAppContext();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCommentData = async () => {
    try {
      const { data } = await axios.post(`/api/blog/${id}/comments`);
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      console.error("Comments fetch error: ", error);
      if (error.response?.status !== 404) {
        const errorMessage =
          error.response?.data.message || "Failed to fetch comments";
        toast.error(errorMessage);
      }
      setComments([]);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/blog/add-comment`, {
        blog: id,
        name,
        content,
      });
      if (data.success) {
        toast.success(data.message);
        setName("");
        setContent("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchCommentData();
  }, []);

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-10 opacity-50"
      />
      <Navbar />
      <div className="text-center mt-20 text-theme-secondary">
        <p className="font-medium text-primary py-4">
          Published on {moment(data.createdAt).format("MMMM Do YYYY")}
        </p>
        <h1 className="font-semibold text-2xl sm:text-5xl max-w-2xl mx-auto text-theme-primary">
          {data.title}
        </h1>
        <h2 className="my-5 max-w-lg mx-auto truncate text-gray-500 dark:text-gray-400">
          {data.subTitle}
        </h2>
        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          Joshua Osunlakin
        </p>
      </div>

      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} alt="blog image" className="rounded-3xl mb-5" />

        <div
          dangerouslySetInnerHTML={{ __html: data.description }}
          className="rich-text max-w-3xl mx-auto"
        ></div>
      </div>

      {/* comment section */}
      <div className="mt-14 mb-10 max-w-3xl mx-auto">
        <p className="font-semibold mb-4 text-theme-primary">
          Comments ({comments.length})
        </p>
        <div className="flex flex-col gap-4">
          {comments.map((item, index) => (
            <div
              key={index}
              className="relative bg-primary/2 border border-primary/5 max-w-xl rounded text-theme-secondary"
            >
              <div className="flex items-center gap-2 mb-2">
                <img src={assets.user_icon} alt="User Icon" className="w-6" />
                <p className="font-medium text-theme-primary">{item.name}</p>
              </div>
              <p className="text-sm max-w-md ml-8 text-theme-secondary">
                {item.content}
              </p>
              <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs text-theme-muted">
                {moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add comment section */}
      <div className="max-w-3xl mx-auto">
        <p className="font-semibold mb-4 text-theme-primary">
          Add your comment
        </p>

        <form
          onSubmit={addComment}
          className="flex flex-col items-start gap-4 max-w-lg"
        >
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded outline-none"
            required
          />
          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            placeholder="Comment"
            className="w-full h-48 p-2 border border-gray-300 rounded outline-none"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-primary text-white rounded py-2 px-8 hover:scale-102 transition-all ease-in-out duration-300 cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
      {/* Share Buttons */}
      <div className="my-24 max-w-3xl mx-auto">
        <p className="font-semibold my-4 text-theme-primary">
          Share this article on social media
        </p>
        <div className="flex">
          <img
            src={assets.facebook_icon}
            alt="facebook icon"
            width={50}
            className="cursor-pointer hover:scale-102 transition ease-in-out duration-300"
          />
          <img
            src={assets.twitter_icon}
            alt="X icon"
            width={50}
            className="cursor-pointer hover:scale-102 transition ease-in-out duration-300"
          />
          <img
            src={assets.googleplus_icon}
            alt="google icon"
            width={50}
            className="cursor-pointer hover:scale-105 transition ease-in-out duration-350"
          />
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <div>
      <Loader />
    </div>
  );
};

export default Blog;
