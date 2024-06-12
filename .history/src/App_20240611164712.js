import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const App = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    // قبل از استفاده از API، باید توکن دسترسی خود را دریافت کنید.
    // شما باید یک برنامه در Spotify Developer Dashboard ایجاد کنید و توکن دسترسی خود را دریافت کنید.
    // سپس توکن را در متغیر زیر قرار دهید.
    const accessToken = 'YOUR_ACCESS_TOKEN';

    spotifyApi.setAccessToken(accessToken);

    // درخواست API برای دریافت لیست آهنگ ها
    spotifyApi.getMyTopTracks({ limit: 10 })
      .then((response) => {
        setTracks(response.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>لیست آهنگ ها</h1>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
