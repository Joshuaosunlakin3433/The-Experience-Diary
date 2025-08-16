import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/comment.js";

export const addBlog = async (req, res) => {
  try {
    const { title, description, subTitle, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
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
    res.status(500)({
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
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cannot get comment",
    });
  }
};

// import fs from "fs";
// import imagekit from "../configs/imageKit.js";
// import Blog from "../models/Blog.js";

// export const addBlog = async (req, res) => {
//   try {
//     const { title, description, subTitle, category, isPublished } = JSON.parse(
//       req.body.blog
//     );
//     const imageFile = req.file;

//     console.log("=== PRODUCTION MODE WITH IMAGEKIT ===");
//     console.log("Parsed data:", { title, description, subTitle, category, isPublished });

//     // Check if all fields are present (including image file)
//     if (!title || !category || !imageFile || !description) {
//       return res.json({ success: false, message: "Missing required fields" });
//     }

//     console.log("=== IMAGEKIT UPLOAD ===");
//     const fileBuffer = fs.readFileSync(imageFile.path);
//     console.log("File buffer ready, size:", fileBuffer.length);

//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/blogs",
//     });

//     // 🔍 DEBUG: Let's see what ImageKit actually returns
//     console.log("ImageKit response keys:", Object.keys(response));
//     console.log("ImageKit response:", {
//       fileId: response.fileId,
//       name: response.name,
//       filePath: response.filePath,
//       url: response.url,
//       thumbnailUrl: response.thumbnailUrl
//     });

//     // 🛠️ ROBUST IMAGE URL HANDLING
//     let image;

//     // Try the direct URL first (most reliable)
//     if (response.url) {
//       console.log("Using direct ImageKit URL:", response.url);
//       image = response.url;
//     }
//     // Fallback: try URL transformation if we have a file path
//     else if (response.filePath) {
//       console.log("Attempting URL transformation with filePath:", response.filePath);
//       try {
//         image = imagekit.url({
//           path: response.filePath,
//           transformation: [
//             { quality: "auto" },
//             { format: "webp" },
//             { width: "1280" },
//           ],
//         });
//         console.log("Generated optimized URL:", image);
//       } catch (urlError) {
//         console.log("URL transformation failed:", urlError.message);
//         // Final fallback - use any available URL
//         image = response.thumbnailUrl || "https://via.placeholder.com/1280x720?text=Image+Upload+Failed";
//       }
//     }
//     // Last resort fallback
//     else {
//       console.log("No URL found in response, using placeholder");
//       image = "https://via.placeholder.com/1280x720?text=Image+Upload+Failed";
//     }

//     console.log("=== FINAL IMAGE URL ===");
//     console.log("Image URL:", image);
//     console.log("Image URL type:", typeof image);
//     console.log("Image URL length:", image.length);

//     // Validate that we have a proper image URL
//     if (!image || typeof image !== 'string' || image.length === 0) {
//       throw new Error("Failed to generate valid image URL from ImageKit");
//     }

//     const blogData = {
//       title,
//       subTitle,
//       description,
//       category,
//       image,
//       isPublished: isPublished === 'true' || isPublished === true,
//     };

//     console.log("=== SAVING TO DATABASE ===");
//     const savedBlog = await Blog.create(blogData);

//     console.log("SUCCESS! Blog saved with ID:", savedBlog._id);
//     console.log("Saved image URL:", savedBlog.image);

//     // Clean up temp file
//     if (fs.existsSync(imageFile.path)) {
//       fs.unlinkSync(imageFile.path);
//     }

//     res.json({
//       success: true,
//       message: "Blog added successfully",
//       blogId: savedBlog._id,
//       imageUrl: savedBlog.image
//     });

//   } catch (error) {
//     console.error("Error details:", error);

//     // Clean up temp file on error
//     if (req.file && req.file.path && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }

//     res.json({ success: false, message: error.message });
//   }
// };
