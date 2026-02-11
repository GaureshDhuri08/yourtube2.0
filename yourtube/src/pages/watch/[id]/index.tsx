"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Videoplayer from "@/components/Videopplayer";
import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoCall from "@/components/VideoCall";
import axios from "axios";

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  const [videos, setVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchVideos = async () => {
      const res = await axios.get("http://localhost:5000/video/getall");
      setVideos(res.data);

      const found = res.data.find(
        (v: any) => String(v._id) === String(id)
      );

      setCurrentVideo(found);
    };

    fetchVideos();
  }, [id]);

  const playNextVideo = () => {
    if (!currentVideo || videos.length === 0) return;

    const index = videos.findIndex(
      (v) => v._id === currentVideo._id
    );

    const nextVideo =
      index === videos.length - 1
        ? videos[0]
        : videos[index + 1];

    router.push(`/watch/${nextVideo._id}`);
  };

  if (!currentVideo) return null;

  return (
    <div className="flex justify-center w-full">
      <div className="flex w-full max-w-[1400px] gap-6 px-6 py-4">
        {/* LEFT */}
        <div className="flex-1 max-w-[1000px]">
          <Videoplayer
            video={currentVideo}
            onNext={playNextVideo}
            onToggleComments={() =>
              setShowComments((prev) => !prev)
            }
          />
          <VideoCall roomId={currentVideo._id} />
          <h1 className="text-xl font-semibold mt-4">
            {currentVideo.videotitle}
          </h1>

          <p className="text-gray-600 text-sm mb-4">
            {currentVideo.views} views • {currentVideo.channel}
          </p>

          {/* SAME COMMENTS BELOW VIDEO */}
          {showComments && (
            <Comments videoId={currentVideo._id} />
          )}
        </div>

        {/* RIGHT */}
        <div className="w-[360px] shrink-0">
          <RelatedVideos videos={videos} />
        </div>
      </div>
    </div>
  );
}