import Link from "next/link";

export default function Videocard({ video }: any) {
  return (
    <Link href={`/watch/${video._id}`}>
      <div className="cursor-pointer">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-200">
          <img
            src={video.thumbnail}
            alt={video.videotitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/320x180?text=No+Thumbnail";
            }}
          />
        </div>

        {/* Video Info */}
        <div className="mt-3">
          <h3 className="font-semibold text-sm line-clamp-2">
            {video.videotitle}
          </h3>
          <p className="text-xs text-gray-600">{video.channel}</p>
          <p className="text-xs text-gray-500">
            {video.views.toLocaleString()} views
          </p>
        </div>
      </div>
    </Link>
  );
}
