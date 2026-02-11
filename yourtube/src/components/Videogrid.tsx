"use client";

import { useEffect, useState } from "react";
import Videocard from "./videocard";
import axios from "axios";

export default function Videogrid() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/video/getall")
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videos.map((video) => (
        <Videocard key={video._id} video={video} />
      ))}
    </div>
  );
}