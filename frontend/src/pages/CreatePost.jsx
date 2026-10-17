
import React from 'react';
import axios from 'axios';

const CreatePost = () => {
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        axios.post(
            "http://localhost:3000/create-post",
            formData
        )
        .then((res) => {
            console.log("Post created:", res.data);
            alert("Post created successfully!");
            e.target.reset();
        })
        .catch((err) => {
            console.error("Upload error:", err.response?.data || err.message);
            alert("Image upload failed. Check the console.");
        });
    };

    return (
        <section className="create-post-section">
            <h1>Create post</h1>

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
                    placeholder="Enter caption"
                    required
                />

                <button type="submit">Submit</button>
            </form>
        </section>
    );
};

export default CreatePost;
