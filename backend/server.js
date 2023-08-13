const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
require("colors");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDb = require("./config/db");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const path = require("path");

cloudinary.config({
  cloud_name: "dxazzitas",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to databse
connectDb();

const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/users/profile", require("./routes/profileRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));

// Serve Frontend
if (process.env.NODE_ENV === "production") {
  // Set build folder as static
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // FIX: below code fixes app crashing on refresh in deployment
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  app.get("/", (_, res) => {
    res.status(200).json({ message: "Welcome to the Social Gram API" });
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Connected to port:${PORT}`.blue);
});
