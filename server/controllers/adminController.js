import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/comment.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments(); //gives total number of comments
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      blogs,
      comments,
      drafts,
      recentBlogs,
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Comment successfully deleted",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// APPROVE COMMENT CONTROLLER
export const approveCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    //check if comment exist and then update it
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true } //return updated document
    );
    //in a case where comment doesnt exist
    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment successfully approved",
      data: {
        id: updatedComment._id,
        content: updatedComment.content,
        isApproved: updatedComment.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
