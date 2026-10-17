const sharp = require("sharp");
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const uploadFile = require("./services/storage.service");
const postModel = require("./modules/post.model");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Please upload an image file"));
        }
    }
});

// Create post with image upload
app.post("/create-post", upload.single("image"), async (req, res) => {
    try {
        const resizedBuffer = await sharp(req.file.buffer)
            .resize({
                width: 1600,
                height: 1600,
                fit: "inside",
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toBuffer();

        const result = await uploadFile(
            resizedBuffer,
            `post-${Date.now()}.jpg`
        );

        const post = await postModel.create({
            image: result.url,
            caption: req.body.caption
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        console.error("Create post error:", error);
        res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
});

// Fetch posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await postModel.find();

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts
        });
    } catch (error) {
        console.error("Fetch posts error:", error);

        return res.status(500).json({
            message: "Failed to fetch posts"
        });
    }
});

// Create post using an existing image URL
app.post("/create-post-url", async (req, res) => {
    try {
        const { image, caption } = req.body;

        if (!image || !caption) {
            return res.status(400).json({
                message: "Image URL and caption are required"
            });
        }

        const post = await postModel.create({ image, caption });

        return res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        console.error("Create post URL error:", error);

        return res.status(500).json({
            message: "Failed to create post"
        });
    }
});

/* Add a comment to a post */
app.post("/posts/:id/comments", async (req, res) => {
    try {
        const { username, text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        post.comments.push({
            username: username?.trim() || "Anonymous",
            text: text.trim()
        });

        await post.save();

        return res.status(201).json({
            message: "Comment added successfully",
            comments: post.comments
        });
    } catch (error) {
        console.error("Add comment error:", error);

        return res.status(500).json({
            message: "Failed to add comment"
        });
    }
});


// Delete post
app.delete("/posts/:id", async (req, res) => {
    try {
        const post = await postModel.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully",
            post
        });
    } catch (error) {
        console.error("Delete post error:", error);

        return res.status(500).json({
            message: "Failed to delete post"
        });
    }
});
app.post("/posts/:id/like", async (req, res) => {
    try {
        const username = (req.body.username || "Anonymous").trim();
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const index = post.likes.indexOf(username);
        let liked;

        if (index === -1) {
            post.likes.push(username);
            liked = true;
        } else {
            post.likes.splice(index, 1);
            liked = false;
        }

        await post.save();

        res.json({
            liked,
            likes: post.likes,
            likeCount: post.likes.length
        });
    } catch (error) {
        console.error("Like error:", error);
        res.status(500).json({ message: "Could not update like" });
    }
});
app.delete("/posts/:postId/comments/:commentId", async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const post = await postModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        comment.deleteOne();
        await post.save();

        res.json({
            message: "Comment deleted successfully",
            comments: post.comments
        });
    } catch (error) {
        console.error("Delete comment error:", error);
        res.status(500).json({ message: "Failed to delete comment" });
    }
});

module.exports = app;
