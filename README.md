# Social Feed Website

A full-stack social feed website where users can share posts with images and captions.

## Features

- Create posts with images and captions
- Upload and host images using ImageKit
- Store post data in MongoDB
- View posts in a feed
- React-based frontend
- Node.js and Express backend

## Tech Stack

**Frontend**
- React
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- ImageKit
- Multer

## Project Structure

```text
social-feed-website/
├── backend/
│   ├── src/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

*Note: The folder structure above is illustrative; adjust it to match your actual files.*

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Maheshthakur7666/social-feed-website.git
cd social-feed-website
```

### 2. Install dependencies

Install the frontend and backend dependencies in their respective folders:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the appropriate backend directory and configure your MongoDB connection and ImageKit credentials.

Never commit your `.env` file or private API keys to GitHub.

### 4. Run the application

Start the backend using the start script defined in its `package.json`.

Start the frontend using:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Future Improvements

- User authentication
- Likes and comments
- User profiles
- Responsive mobile design
- Deployment to a public URL

## Author

**Mahesh Thakur**

GitHub: [Maheshthakur7666](https://github.com/Maheshthakur7666)
