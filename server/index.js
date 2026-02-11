import express from "express";
import cors from "cors";
import http from "http";
import fetch from "node-fetch";
import { Server } from "socket.io";

const app = express();

// Important for Render proxy support
app.set("trust proxy", true);

app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

/* ===========================
   VIDEO DATA
=========================== */

const videos = [
  {
    _id: "1",
    videotitle: "Wildlife Safari Adventure",
    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    channel: "Discovery World",
    views: 55000,
    videoUrl:
      "https://media.w3.org/2010/05/bunny/trailer.mp4",
  },
  {
    _id: "2",
    videotitle: "JavaScript Full Course 2026",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    channel: "Code Master",
    views: 210000,
    videoUrl:
      "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
  {
    _id: "3",
    videotitle: "Future Technology & AI",
    thumbnail:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    channel: "Tech Vision",
    views: 99000,
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  }
];

/* ===========================
   VIDEO ROUTES
=========================== */

app.get("/", (req, res) => {
  res.send("🚀 YouTube Backend API Running");
});

app.get("/video/getall", (req, res) => {
  res.json(videos);
});

/* ===========================
   COMMENT SYSTEM
=========================== */

let comments = [];

const isValidComment = (text) => {
  const regex = /^[\p{L}\p{N}\s.,!?\n]+$/u;
  return regex.test(text.trim());
};

const getCityFromIP = async (ip) => {
  try {
    const cleanIP = ip.includes(",") ? ip.split(",")[0] : ip;
    const response = await fetch(`https://ipapi.co/${cleanIP}/json/`);
    const data = await response.json();
    return data.city || "Unknown";
  } catch {
    return "Unknown";
  }
};

// Add Comment
app.post("/comment/add", async (req, res) => {
  try {
    const { videoId, text } = req.body;

    if (!videoId || !text || !isValidComment(text)) {
      return res.status(400).json({ error: "Invalid comment" });
    }

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "8.8.8.8";

    const city = await getCityFromIP(ip);

    const newComment = {
      id: Date.now(),
      videoId,
      text,
      likes: 0,
      dislikes: 0,
      city,
    };

    comments.push(newComment);

    res.json(newComment);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Comments
app.get("/comment/:videoId", (req, res) => {
  const filtered = comments.filter(
    (c) => c.videoId === req.params.videoId
  );
  res.json(filtered);
});

// Like / Dislike
app.post("/comment/react", (req, res) => {
  const { commentId, type } = req.body;

  const comment = comments.find(
    (c) => c.id === Number(commentId)
  );

  if (!comment) return res.sendStatus(404);

  if (type === "like") comment.likes++;
  if (type === "dislike") comment.dislikes++;

  // Auto remove if 2 dislikes
  if (comment.dislikes >= 2) {
    comments = comments.filter(
      (c) => c.id !== comment.id
    );
    return res.json({ removed: true });
  }

  res.json(comment);
});

/* ===========================
   TRANSLATE SYSTEM
=========================== */

app.post("/comment/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const url =
      "https://translate.googleapis.com/translate_a/single" +
      `?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json({ translated: data[0][0][0] });

  } catch (error) {
    res.status(500).json({ error: "Translation failed" });
  }
});

/* ===========================
   SOCKET.IO SIGNAL SERVER
=========================== */

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("signal", (data) => {
    socket.broadcast.emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ===========================
   START SERVER
=========================== */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
