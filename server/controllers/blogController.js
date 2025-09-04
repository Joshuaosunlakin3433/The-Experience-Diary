import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, description, subTitle, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    // Check if all fields are present
    if (!title || !category || !imageFile || !description) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    //image upload to imageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    //optimization through imageKit URL transformation
    const optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" }, // Auto compression
        { format: "webp" }, // convert to modern format
        { width: "1280" }, // width resizing
      ],
    });

    const image = optimizedImageURL;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });
    res.json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get blog by id
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not Found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Delete error:", error);
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to get blog",
    });
  }
};

//Delete a particular Blog and the comments under the blog
export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blogToDelete = await Blog.findById(id);
    if (!blogToDelete) {
      return res.status(404).json({
        success: false,
        message: "Blog not Found",
      });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);
    //Delete all comments associated with the blog
    await Comment.deleteMany({ blog: id });

    res.status(200).json({
      success: true,
      message: "Blog Successfully deleted",
      deletedBlog: {
        id: deletedBlog._id,
        title: deletedBlog.title,
      },
    });
  } catch (error) {
    console.error("Delete error:", error);
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};

//update isPublished toggle button
export const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        sucess: false,
        message: "Blog not found",
      });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.status(200).json({
      success: true,
      message: "Blog status updated",
    });
  } catch (error) {
    console.error("Toggle publish error:", error);
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID format",
      });
    }
    res.status(500)({
      success: false,
      message: "Failed to update blog",
    });
  }
};

//posting a new comment
export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    //basic validation
    if (!blog || !name || !content) {
      return res.status(400).json({
        success: false,
        message: "Blog ID, name, and content are required",
      });
    }

    // Trim whitespace and check length
    const trimmedContent = content.trim();
    if (trimmedContent.length < 1 || trimmedContent.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Comment must be between 1-1000 characters",
      });
    }

    const newComment = await Comment.create({
      blog,
      name: name.trim(),
      content: trimmedContent,
    });

    res.status(201).json({
      success: true,
      message: "Comment created, awaiting review",
      data: {
        commentId: newComment._id,
      },
    });
  } catch (error) {
    console.error("Couldn't add comment: ", error);
    res.status(500).json({
      success: false,
      message: "Comment cannot be added, please try again",
    });
  }
};

//getting the comments for a particular blog post
export const getBlogComments = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({
      blog: id,
      isApproved: true,
    }).sort({ createdAt: -1 });

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comments not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Comments gotten successfully",
      comments: comments || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot get comment",
    });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt, topic, title, contentType = "blog-post" } = req.body;
    const userInput = prompt || topic || title;
    if (!userInput?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a topic or prompt",
      });
    }

    let enhancedPrompt;
    switch (contentType) {
      case "blog-post":
        enhancedPrompt = `Write a comprehensive, engaging blog post about "${userInput}".
          Structure it with: 
          - An engaging introduction that hooks the reader
          - Clear subheadings and well-organized content  
          - Practical examples, tips, or insights
          - A strong conclusion
           Format: Use markdown for headings and emphasis. Length: 800-1200 words.`;
        break;

      case "title":
        enhancedPrompt = `Generate 5 catchy, SEO-friendly blog post titles about "${userInput}". 
          Make them click-worthy but professional. Format as a numbered list.`;
        break;

      case "outline":
        enhancedPrompt = `Create a detailed blog post outline about "${userInput}". 
          Include main headings, subheadings, and key points to cover in each section.`;
        break;
      case "meta":
        enhancedPrompt = `Write an SEO meta description for a blog post about "${userInput}". 
          Keep it 150-160 characters, compelling, and include relevant keywords.`;
        break;

      default:
        enhancedPrompt = `${userInput}. Generate comprehensive blog content for this topic in markdown format with proper structure.`;
    }

    const content = await main(enhancedPrompt);
    res.status(200).json({
      success: true,
      content,
      topic: userInput,
      contentType,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Content generation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate content. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
