"use client";

import { useState } from "react";

const Comments = ({ videoId }: { videoId?: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");

  /* ✅ COMMENT VALIDATION (NO SPECIAL CHARS) */
  const isValid = (t: string) => {
    const regex = /^[\p{L}\p{N}\s.,!?]+$/u;
    return regex.test(t.trim());
  };

  /* 📍 GET USER CITY */
  const getLocation = async () => {
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej)
      );

      const { latitude, longitude } = pos.coords;
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const d = await r.json();

      return (
        d.address.city ||
        d.address.town ||
        d.address.village ||
        "Unknown"
      );
    } catch {
      return "Location unavailable";
    }
  };

  /* 🌐 TRANSLATION */
  const translateText = async (text: string, lang: string) => {
    const r = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const d = await r.json();
    return d[0].map((x: any) => x[0]).join("");
  };

  /* ➕ ADD COMMENT */
  const addComment = async () => {
    if (!text.trim() || !isValid(text)) {
      alert("❌ Special characters are not allowed");
      return;
    }

    const city = await getLocation();

    setComments((prev) => [
      {
        id: Date.now(),
        text,
        original: text,
        city,
        likes: 0,
        dislikes: 0,
      },
      ...prev,
    ]);

    setText("");
  };

  /* 👍 👎 HANDLE REACTION */
  const react = (id: number, type: "like" | "dislike") => {
    setComments((prev) =>
      prev
        .map((c) => {
          if (c.id !== id) return c;

          const updated = {
            ...c,
            likes: type === "like" ? c.likes + 1 : c.likes,
            dislikes: type === "dislike" ? c.dislikes + 1 : c.dislikes,
          };

          return updated;
        })
        // ❌ AUTO REMOVE IF DISLIKES >= 2
        .filter((c) => c.dislikes < 2)
    );
  };

  return (
    <div className="mt-8 max-w-3xl">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      {/* INPUT */}
      <div className="bg-white border rounded-xl p-4 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full border rounded-lg p-3 resize-none outline-none focus:border-blue-500"
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={addComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm"
          >
            Comment
          </button>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="mt-6 space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4 border-b pb-6">
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
              U
            </div>

            {/* BODY */}
            <div className="flex-1">
              <p className="text-xs text-gray-500">
                User • {c.city}
              </p>

              <p className="mt-1 text-sm whitespace-pre-line">
                {c.text}
              </p>

              {/* ACTIONS */}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <button
                  onClick={() => react(c.id, "like")}
                  className="hover:text-black"
                >
                  👍 {c.likes}
                </button>

                <button
                  onClick={() => react(c.id, "dislike")}
                  className="hover:text-black"
                >
                  👎 {c.dislikes}
                </button>

                <select
                  className="border rounded px-2 py-1 text-xs"
                  onChange={async (e) => {
                    const lang = e.target.value;

                    if (lang === "en") {
                      setComments((prev) =>
                        prev.map((x) =>
                          x.id === c.id
                            ? { ...x, text: x.original }
                            : x
                        )
                      );
                      return;
                    }

                    const translated = await translateText(
                      c.original,
                      lang
                    );

                    setComments((prev) =>
                      prev.map((x) =>
                        x.id === c.id
                          ? { ...x, text: translated }
                          : x
                      )
                    );
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                  <option value="ta">Tamil</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;