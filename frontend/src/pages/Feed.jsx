
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Feed.css";

const API = "https://social-feed-website.onrender.com";

function Feed() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/posts`);
      setPosts(response.data.posts || response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId) => {
    setLikedPosts((previous) =>
      previous.includes(postId)
        ? previous.filter((id) => id !== postId)
        : [...previous, postId]
    );
  };

  const handleComment = async (postId) => {
    const comment = commentInputs[postId]?.trim();

    if (!comment) return;

    try {
      await axios.post(`${API}/posts/${postId}/comments`, {
        text: comment,
      });

      setCommentInputs((previous) => ({
        ...previous,
        [postId]: "",
      }));

      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Could not add comment. Check your backend route.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `${API}/posts/${postId}/comments/${commentId}`
      );

      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Could not delete comment.");
    }
  };

  const handleShare = async (post) => {
    const postUrl = window.location.href;
    const shareText = post.caption || "Check out this post!";

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Social Feed",
          text: shareText,
          url: postUrl,
        });
      } else {
        await navigator.clipboard.writeText(postUrl);
        alert("Feed link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Sharing failed:", error);
      }
    }
  };

  if (loading) {
    return (
      <section className="feed-section">
        <button
          type="button"
          onClick={() => navigate("/create-post")}
        >
          ← Back to Create Post
        </button>

        <p>Loading posts...</p>
      </section>
    );
  }

  return (
    <section className="feed-section">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/create-post")}
      >
        ← Back to Create Post
      </button>

      <h1>Social Feed</h1>

      {posts.length === 0 ? (
        <p>No posts found. Create your first post!</p>
      ) : (
        <div className="posts-container">
          {posts.map((post) => {
            const isLiked = likedPosts.includes(post._id);

            return (
              <article className="post-card" key={post._id}>
                <p className="username">
                  {post.username || "User"}
                </p>

                {post.image && (
                  <img
                    src={post.image}
                    alt={post.caption || "Post"}
                    className="post-image"
                  />
                )}

                <p className="post-caption">
                  {post.caption}
                </p>

                <div className="post-actions">
                  <button
                    type="button"
                    onClick={() => handleLike(post._id)}
                  >
                    {isLiked ? "❤️ Liked" : "🤍 Like"}
                    {" "}
                    ({(post.likesCount ?? post.likes ?? 0) +
                      (isLiked ? 1 : 0)})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(post)}
                  >
                    Share
                  </button>
                </div>

                <div className="comments-section">
                  <h3>Comments</h3>

                  {(post.comments || []).map((comment) => (
                    <div
                      className="comment"
                      key={comment._id}
                    >
                      <span>
                        {comment.text || comment.comment}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteComment(
                            post._id,
                            comment._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <div className="comment-form">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) =>
                        setCommentInputs((previous) => ({
                          ...previous,
                          [post._id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      type="button"
                      onClick={() => handleComment(post._id)}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Feed;
