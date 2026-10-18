import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const API = "https://social-feed-website.onrender.com";

const CreatePost = () => {
   const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(e.target);

    try {
      await axios.post(`${API}/create-post`, formData);
      setMessage("Post created successfully!");
      e.target.reset();
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-section">
      <h1>Create Post</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="image"
          accept="image/*"
          required
        />

        <input
          type="text"
          name="caption"
          placeholder="Write a caption..."
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Post"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default CreatePost;

