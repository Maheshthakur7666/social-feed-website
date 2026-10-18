
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Feed.css";

const API = "https://social-feed-website.onrender.com";

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [username, setUsername] = useState("Mahesh");
    const [commentInputs, setCommentInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState({});

    useEffect(() => {
        fetchPosts();
    }, []);

    // Fetch all posts
    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API}/posts`);
            setPosts(res.data.posts || []);
        } catch (error) {
            console.error("Loading posts failed:", error);
        }
    };

    // Like or Unlike a post
    const toggleLike = async (postId) => {
        if (busy[postId]) return;

        setBusy(prev => ({ ...prev, [postId]: true }));
        setErrors(prev => ({ ...prev, [postId]: "" }));

        try {
            const res = await axios.post(
                `${API}/posts/${postId}/like`,
                { username: username.trim() || "Anonymous" }
            );

            setPosts(prev =>
                prev.map(post =>
                    post._id === postId
                        ? { ...post, likes: res.data.likes }
                        : post
                )
            );
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [postId]:
                    error.response?.data?.message ||
                    "Could not update like."
            }));
        } finally {
            setBusy(prev => ({ ...prev, [postId]: false }));
        }
    };

    // Add a comment
    const addComment = async (postId) => {
        const text = (commentInputs[postId] || "").trim();

        if (!text || busy[postId]) return;

        setBusy(prev => ({ ...prev, [postId]: true }));
        setErrors(prev => ({ ...prev, [postId]: "" }));

        try {
            const res = await axios.post(
                `${API}/posts/${postId}/comments`,
                {
                    username: username.trim() || "Anonymous",
                    text
                }
            );

            setPosts(prev =>
                prev.map(post =>
                    post._id === postId
                        ? { ...post, comments: res.data.comments }
                        : post
                )
            );

            setCommentInputs(prev => ({
                ...prev,
                [postId]: ""
            }));
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                [postId]:
                    error.response?.data?.message ||
                    "Could not add comment."
            }));
        } finally {
            setBusy(prev => ({ ...prev, [postId]: false }));
        }
    };

    // Delete a comment
    const deleteComment = async (postId, commentId) => {
        if (!commentId) {
            alert("Comment ID is missing. Please check your backend schema.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            const res = await axios.delete(
                `${API}/posts/${postId}/comments/${commentId}`
            );

            setPosts(prev =>
                prev.map(post =>
                    post._id === postId
                        ? { ...post, comments: res.data.comments }
                        : post
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Could not delete comment."
            );
        }
    };

    // Share a post
    const sharePost = async (post) => {
        const url = `${window.location.origin}/feed`;
        const text = post.caption || "Check out this post!";

        try {
            if (navigator.share) {
                await navigator.share({
                    title: "Share this post",
                    text,
                    url
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(
                    `${text}\nImage: ${post.image}\n${url}`
                );

                alert("Post details copied. You can share them now.");
            } else {
                window.prompt(
                    "Copy post details:",
                    `${text}\nImage: ${post.image}\n${url}`
                );
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Share failed:", error);
            }
        }
    };

    return (
        <section className="feed-section">
            <h1>Feed ({posts.length})</h1>

            <div style={{ maxWidth: "550px", margin: "0 auto 20px" }}>
                <label>
                    Your username:{" "}
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                </label>
            </div>

            {posts.map(post => {
                const likes = post.likes || [];
                const comments = post.comments || [];
                const currentUser = username.trim() || "Anonymous";
                const liked = likes.includes(currentUser);

                return (
                    <article className="post-card" key={post._id}>
                        <img
                            src={post.image}
                            alt={post.caption || "Post image"}
                        />

                        <p>{post.caption}</p>

                        {/* Like and Share buttons */}
                        <div className="post-actions">
                            <button
                                onClick={() => toggleLike(post._id)}
                                disabled={busy[post._id]}
                                aria-pressed={liked}
                            >
                                {liked ? "❤️ Unlike" : "🤍 Like"} ({likes.length})
                            </button>

                            <button onClick={() => sharePost(post)}>
                                Share
                            </button>
                        </div>

                        {/* Comments section */}
                        <div className="comments-section">
                            <h3>Comments ({comments.length})</h3>

                            {comments.map((comment, index) => (
                                <div
                                    className="comment"
                                    key={comment._id || index}
                                >
                                    <p>
                                        <strong>
                                            {comment.username || "Anonymous"}:
                                        </strong>{" "}
                                        {comment.text}
                                    </p>

                                    <button
                                        type="button"
                                        className="delete-comment-btn"
                                        onClick={() =>
                                            deleteComment(
                                                post._id,
                                                comment._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                            {/* Add comment input */}
                            <textarea
                                placeholder="Write a comment..."
                                value={commentInputs[post._id] || ""}
                                onChange={e =>
                                    setCommentInputs(prev => ({
                                        ...prev,
                                        [post._id]: e.target.value
                                    }))
                                }
                            />

                            <button
                                type="button"
                                onClick={() => addComment(post._id)}
                                disabled={busy[post._id]}
                            >
                                {busy[post._id]
                                    ? "Please wait..."
                                    : "Post Comment"}
                            </button>

                            {errors[post._id] && (
                                <p className="comment-error">
                                    {errors[post._id]}
                                </p>
                            )}
                        </div>
                    </article>
                );
            })}
        </section>
    );
};

export default Feed;

