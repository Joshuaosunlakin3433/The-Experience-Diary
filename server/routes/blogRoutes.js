import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  generateContent,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
} from "../controllers/blogController.js";
import upload from "../middlewares/multer.js";
import auth from "../middlewares/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);

blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/:id/delete", deleteBlogById);
blogRouter.patch("/:id/toggle-publish", auth, togglePublish); //why are we using post for delete? is it not supposed to be delete? and why is there no id their as well

blogRouter.post("/add-comment", addComment);
blogRouter.post("/:id/comments", getBlogComments);
blogRouter.post("/generate",auth, generateContent);
export default blogRouter;