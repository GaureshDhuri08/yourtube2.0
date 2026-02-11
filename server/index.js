import express from "express";
import cors from "cors";
import http from "http";
import fetch from "node-fetch";
import { Server } from "socket.io";


const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});


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
  },
  {
    _id: "4",
    videotitle: "Street Food India Tour",
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    channel: "Food Explorer",
    views: 87000,
    videoUrl:
      "https://media.w3.org/2010/05/video/movie_300.mp4",
  },

   {
    _id: "5",
    videotitle: "Amazing Nature Documentary",
    thumbnail: "https://i.ytimg.com/vi/6lt2JfJdGSY/maxresdefault.jpg",
    channel: "Nature Channel",
    views: 45000,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    _id: "6",
    videotitle: "React Full Course for Beginners",
    thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    channel: "Code Academy",
    views: 120000,
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    _id: "7",
    videotitle: "Top Tech Gadgets 2025",
    thumbnail: "https://i.ytimg.com/vi/GV3HUDMQ-F8/maxresdefault.jpg",
    channel: "Tech World",
    views: 78000,
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    _id: "8",
    videotitle: "Street Food Around the World",
    thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg",
    channel: "Food Vlogs",
    views: 99000,
    videoUrl: "https://media.w3.org/2010/05/sintel/trailer.mp4",
  },
];

app.get("/video/getall", (req, res) => {
  res.json(videos);
});

app.get("/", (req, res) => {
  res.send("🚀 YouTube Backend API is running");
});


let comments = [];

const isValidComment = (text) => {
  const regex = /^[\p{L}\p{N}\s.,!?\n]+$/u;
  return regex.test(text.trim());
};

const getCityFromIP = async (ip) => {
  try {
    const r = await fetch(`https://ipapi.co/${ip}/json/`);
    const d = await r.json();
    return d.city || "Unknown";
  } catch {
    return "Unknown";
  }
};

app.post("/comment/add", async (req, res) => {
  const { videoId, text } = req.body;

  if (!isValidComment(text)) {
    return res.status(400).json({ error: "Invalid characters" });
  }

  const city = await getCityFromIP(req.ip);

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
});

app.get("/comment/:videoId", (req, res) => {
  res.json(comments.filter((c) => c.videoId === req.params.videoId));
});

app.post("/comment/react", (req, res) => {
  const { commentId, type } = req.body;
  const comment = comments.find((c) => c.id === commentId);
  if (!comment) return res.sendStatus(404);

  if (type === "like") comment.likes++;
  if (type === "dislike") comment.dislikes++;

  if (comment.dislikes >= 2) {
    comments = comments.filter((c) => c.id !== commentId);
    return res.json({ removed: true });
  }

  res.json(comment);
});

app.post("/comment/translate", async (req, res) => {
  const { text, targetLang } = req.body;

  const url =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  const r = await fetch(url);
  const d = await r.json();

  res.json({ translated: d[0][0][0] });
});


io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("signal", (data) => {
    socket.broadcast.emit("signal", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
