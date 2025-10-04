import React, { useState, useEffect } from "react";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import { PlayCircleIcon } from "lucide-react";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  const [autoPlay, setAutoPlay] = useState(0); // Enable autoplay initially

  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/|v\/)?([^&?]+)/
    );
    return match ? match[1] : null;
  };

  const currentVideoId = getYouTubeId(currentTrailer.videoUrl);

  // When user selects a trailer, enable autoplay
  const handleTrailerClick = (trailer) => {
    setCurrentTrailer(trailer);
    setAutoPlay(0); // Force autoplay on new selection
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>

      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />

        {/* YouTube Embed with AutoPlay */}
        {currentVideoId ? (
          <iframe
            width="960"
            height="540"
            className="mx-auto max-w-full rounded-lg shadow-lg"
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=${autoPlay}&rel=0&modestbranding=1&mute=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-center text-red-500 mt-4">Invalid video URL</p>
        )}
      </div>

      {/* Trailer Thumbnails */}
      <div className="group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <div
            key={trailer.image}
            className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer"
            onClick={() => handleTrailerClick(trailer)}
          >
            <img
              src={trailer.image}
              alt="trailer"
              className="rounded-lg w-full h-full object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
