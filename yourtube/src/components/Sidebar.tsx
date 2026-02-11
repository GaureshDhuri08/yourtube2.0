
/*import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";

const Sidebar = () => {
  const { user } = useUser();

  const [isdialogeopen, setisdialogeopen] = useState(false);
  return (
    <aside className="w-64 bg-white  border-r min-h-screen p-2">
      <nav className="space-y-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Home
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start">
            <Compass className="w-5 h-5 mr-3" />
            Explore
          </Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start">
            <PlaySquare className="w-5 h-5 mr-3" />
            Subscriptions
          </Button>
        </Link>

        {user && (
          <>
            <div className="border-t pt-2 mt-2">
              <Link href="/history">
                <Button variant="ghost" className="w-full justify-start">
                  <History className="w-5 h-5 mr-3" />
                  History
                </Button>
              </Link>
              <Link href="/liked">
                <Button variant="ghost" className="w-full justify-start">
                  <ThumbsUp className="w-5 h-5 mr-3" />
                  Liked videos
                </Button>
              </Link>
              <Link href="/watch-later">
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="w-5 h-5 mr-3" />
                  Watch later
                </Button>
              </Link>
              {user?.channelname ? (
                <Link href={`/channel/${user.id}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-5 h-5 mr-3" />
                    Your channel
                  </Button>
                </Link>
              ) : (
                <div className="px-2 py-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setisdialogeopen(true)}
                  >
                    Create Channel
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
      <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
    </aside>
  );
};

export default Sidebar;
*/
"use client";

import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  ListVideo,
  Download,
  User,
  ShoppingBag,
  Music,
  Film,
  ChevronDown,
} from "lucide-react";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";

const Sidebar = () => {
  const { user } = useUser();
  const [isdialogeopen, setisdialogeopen] = useState(false);

  return (
    <aside className="w-64 min-w-64 bg-white border-r min-h-screen p-3">

      
      {/* MAIN MENU */}
      <nav className="space-y-1">

        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="w-5 h-5 mr-3" />
            Home
          </Button>
        </Link>

        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start">
            <Compass className="w-5 h-5 mr-3" />
            Explore
          </Button>
        </Link>

        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start">
            <PlaySquare className="w-5 h-5 mr-3" />
            Subscriptions
          </Button>
        </Link>

        {/* YOU SECTION */}
        {user && (
          <>
            <div className="border-t pt-3 mt-3">

              <p className="text-sm text-gray-500 px-2 mb-2">You</p>

              <Link href="/history">
                <Button variant="ghost" className="w-full justify-start">
                  <History className="w-5 h-5 mr-3" />
                  History
                </Button>
              </Link>

              <Link href="/playlists">
                <Button variant="ghost" className="w-full justify-start">
                  <ListVideo className="w-5 h-5 mr-3" />
                  Playlists
                </Button>
              </Link>

              <Link href="/watch-later">
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="w-5 h-5 mr-3" />
                  Watch Later
                </Button>
              </Link>

              <Link href="/liked">
                <Button variant="ghost" className="w-full justify-start">
                  <ThumbsUp className="w-5 h-5 mr-3" />
                  Liked videos
                </Button>
              </Link>

              <Link href="/your-videos">
                <Button variant="ghost" className="w-full justify-start">
                  <PlaySquare className="w-5 h-5 mr-3" />
                  Your videos
                </Button>
              </Link>

              <Link href="/downloads">
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="w-5 h-5 mr-3" />
                  Downloads
                </Button>
              </Link>

              {/* CHANNEL */}
              {user?.channelname ? (
                <Link href={`/channel/${user.id}`}>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="w-5 h-5 mr-3" />
                    Your channel
                  </Button>
                </Link>
              ) : (
                <div className="px-2 py-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setisdialogeopen(true)}
                  >
                    Create Channel
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* EXPLORE SECTION */}
        <div className="border-t pt-3 mt-3">

          <p className="text-sm text-gray-500 px-2 mb-2">Explore</p>

          <Button variant="ghost" className="w-full justify-start">
            <ShoppingBag className="w-5 h-5 mr-3" />
            Shopping
          </Button>

          <Button variant="ghost" className="w-full justify-start">
            <Music className="w-5 h-5 mr-3" />
            Music
          </Button>

          <Button variant="ghost" className="w-full justify-start">
            <Film className="w-5 h-5 mr-3" />
            Films
          </Button>

          <Button variant="ghost" className="w-full justify-start">
            <ChevronDown className="w-5 h-5 mr-3" />
            Show more
          </Button>

        </div>
      </nav>

      {/* CHANNEL DIALOG */}
      <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
    </aside>
  );
};

export default Sidebar;
