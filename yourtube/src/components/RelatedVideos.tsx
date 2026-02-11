"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Props {
  videos: any[];
}

export default function RelatedVideos({ videos }: Props) {
  const getTimeAgo = (createdAt?: string) => {
    if (!createdAt) return "Recently uploaded";

    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "Recently uploaded";

    return `${formatDistanceToNow(date)} ago`;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold mb-2">Up next</h3>

      {videos.map((video) => (
        <Link
          href={`/watch/${video._id}`}
          key={video._id}
          className="flex gap-3 hover:bg-gray-100 p-2 rounded-lg"
        >
          {/* Thumbnail */}
          <img
            src={video.thumbnail}
            alt={video.videotitle}
            className="w-40 h-24 rounded-lg object-cover bg-gray-200"
          />

          {/* Info */}
          <div className="flex-1">
            <p className="text-sm font-medium line-clamp-2">
              {video.videotitle}
            </p>

            <p className="text-xs text-gray-600 mt-1">
              {video.channel}
            </p>

            <p className="text-xs text-gray-500">
              {Number(video.views || 0).toLocaleString()} views •{" "}
              {getTimeAgo(video.createdAt)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
