/**
 * ============================================================
 *  retos/ChallengeVideo.jsx — Reproductor YouTube responsivo
 *  Solo embed oficial (youtube-nocookie). No descarga videos.
 * ============================================================
 */

import { useState } from 'react';
import Icon from '../Icon';
import { extractYouTubeId, youtubeEmbedUrl, youtubeThumbnail } from '../../lib/retos';

export default function ChallengeVideo({ videoId, title }) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = youtubeThumbnail(videoId);

  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-[#f7f8fa] text-sm text-gray-400">
        Video no disponible
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
        aria-label={`Reproducir video: ${title || 'entrenamiento'}`}
      >
        {thumbnail && (
          <img src={thumbnail} alt="" loading="lazy" className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-70" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#563a78] shadow-lg transition-transform group-hover:scale-105">
            <Icon name="play" className="ml-1 h-7 w-7" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-sm">
      <iframe
        src={youtubeEmbedUrl(videoId)}
        title={title || 'Entrenamiento del reto'}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
