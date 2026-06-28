'use client';

import { useState, useEffect } from 'react';

export interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  progressMs: number;
  durationMs: number;
  isSimulated: boolean;
}

export function useSpotify() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [localProgress, setLocalProgress] = useState<number>(0);

  useEffect(() => {
    let active = true;


    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (active) {
          const spotifyInfo = await response.json();
          setData(spotifyInfo);
          setLocalProgress(spotifyInfo.progressMs || 0);
          setError(null);
        }
      } catch (err) {
        if (active) {
          console.error('Failed to fetch Spotify status:', err);
          setError(err);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchNowPlaying();

    // Poll Spotify endpoint every 15 seconds to sync state
    const pollInterval = setInterval(fetchNowPlaying, 15000);

    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Smoothly increment the song progress local timer every second if playing
  useEffect(() => {
    if (!data || !data.isPlaying) {
      if (data) {
        setLocalProgress(data.progressMs || 0);
      }
      return;
    }

    const interval = setInterval(() => {
      setLocalProgress((prev) => {
        const nextProgress = prev + 1000;
        if (nextProgress >= data.durationMs) {
          return data.durationMs;
        }
        return nextProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    progressMs: localProgress,
  };
}
