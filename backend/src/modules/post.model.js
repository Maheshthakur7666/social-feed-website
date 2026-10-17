const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    image: String,
    caption: String,

    likes: {
        type: [String],
        default: []
    },

    comments: [{
        username: {
            type: String,
            default: "Anonymous"
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model("post", postSchema);