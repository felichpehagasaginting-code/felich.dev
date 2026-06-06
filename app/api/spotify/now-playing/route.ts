import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    // Check if Spotify credentials are set. If not, fallback to simulated data.
    if (!client_id || !client_secret || !refresh_token) {
      const durationMs = 260000;
      const progressMs = Date.now() % durationMs;
      return NextResponse.json({
        isPlaying: true,
        title: "Coding Flow & Lo-Fi",
        artist: "Deep Focus",
        album: "24/7 Beats",
        albumImageUrl: "",
        songUrl: "https://open.spotify.com",
        progressMs,
        durationMs,
        isSimulated: true
      });
    }

    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
    
    // 1. Fetch access token from Spotify Account service
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
      cache: 'no-store'
    });

    if (!tokenResponse.ok) {
      throw new Error(`Spotify token exchange failed with status: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch currently playing track
    const currentlyPlayingRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    // Handle 204 No Content (nothing is playing) or API errors
    if (currentlyPlayingRes.status === 204 || currentlyPlayingRes.status > 400) {
      // 3. Fallback: Fetch recently played track
      const recentlyPlayedRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (recentlyPlayedRes.status === 200) {
        const recentlyPlayedData = await recentlyPlayedRes.json();
        if (recentlyPlayedData.items && recentlyPlayedData.items.length > 0) {
          const item = recentlyPlayedData.items[0].track;
          return NextResponse.json({
            isPlaying: false,
            title: item.name,
            artist: item.artists.map((_artist: any) => _artist.name).join(', '),
            album: item.album.name,
            albumImageUrl: item.album.images[0]?.url || '',
            songUrl: item.external_urls.spotify,
            progressMs: 0,
            durationMs: item.duration_ms,
            isSimulated: false
          });
        }
      }

      // Default mock fallback if recently played query fails or is empty
      const durationMs = 260000;
      const progressMs = Date.now() % durationMs;
      return NextResponse.json({
        isPlaying: false,
        title: "Coding Flow & Lo-Fi",
        artist: "Deep Focus",
        album: "24/7 Beats",
        albumImageUrl: "",
        songUrl: "https://open.spotify.com",
        progressMs,
        durationMs,
        isSimulated: true
      });
    }

    const currentlyPlayingData = await currentlyPlayingRes.json();
    const isPlaying = currentlyPlayingData.is_playing;
    const item = currentlyPlayingData.item;

    if (!item) {
      const durationMs = 260000;
      const progressMs = Date.now() % durationMs;
      return NextResponse.json({
        isPlaying: false,
        title: "Coding Flow & Lo-Fi",
        artist: "Deep Focus",
        album: "24/7 Beats",
        albumImageUrl: "",
        songUrl: "https://open.spotify.com",
        progressMs,
        durationMs,
        isSimulated: true
      });
    }

    return NextResponse.json({
      isPlaying,
      title: item.name,
      artist: item.artists.map((_artist: any) => _artist.name).join(', '),
      album: item.album.name,
      albumImageUrl: item.album.images[0]?.url || '',
      songUrl: item.external_urls.spotify,
      progressMs: currentlyPlayingData.progress_ms,
      durationMs: item.duration_ms,
      isSimulated: false
    });

  } catch (error: any) {
    console.error('Failed to fetch Spotify data:', error);
    // Dynamic simulated fallback in case of exceptions/connection errors
    const durationMs = 260000;
    const progressMs = Date.now() % durationMs;
    return NextResponse.json({
      isPlaying: false,
      title: "Coding Flow & Lo-Fi",
      artist: "Deep Focus",
      album: "24/7 Beats",
      albumImageUrl: "",
      songUrl: "https://open.spotify.com",
      progressMs,
      durationMs,
      isSimulated: true,
      error: error.message || 'Unknown server error'
    });
  }
}
