import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const App = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
   
    const token = 'BQDlxev_9Z76E6nGJtHDn4Da0z9OV3fT2XiEEBwA0_zMd5IsLh3T_7x6lxX5SPdFqTcHyP1lK992rjKmkDaVPRA89MLQnYhl5QJNoM0zbpxvv8Zf4jp4iAka5YP2t7A0d6pCgpp1yaZP-ndMzQ69mY1F5kHZxG5uHzMupCn6slrrO5amzXiIG3rJidjf58nYoZT-UzvNCT09cpxhebGceoeyQl1hpePMuuGahkXiUjOXxyh6iBDEF3I1lFpoTgCcnGTicSHLZKJbCEZ8pR-0mv7B';
    spotifyApi.setAccessToken(token);

    // درخواست API برای دریافت لیست آهنگ ها
    spotifyApi.getMyTopTracks({ limit: 10 })
      .then((response) => {
        setTracks(response.items);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(tracks)
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
