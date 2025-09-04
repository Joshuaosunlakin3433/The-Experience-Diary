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

    const token = jwt.sign(
      {
        email,
        iat: Math.floor(Date.now() / 1000), //issued at (currrent time)
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h", //Token expires in 24 hrs, any time can be used from 1h to 30m to 7d, etc.
      }
    );
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogsAdmin = async (_req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllComments = async (_req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDashboard = async (_req, res) => {
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
      dashboardData
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Delete comment controller
export const deleteCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!id) {
      return res.status(404).json({
        success: failure,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment successfully deleted",
      data: {
        id: deletedComment._id,
        content: deletedComment.content,
      },
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
    if ((error.name = "Cast Error")) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "failed to approve comment ",
    });
  }
};
