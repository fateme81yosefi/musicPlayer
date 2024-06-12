import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const token = 'BQDlxev_9Z76E6nGJtHDn4Da0z9OV3fT2XiEEBwA0_zMd5IsLh3T_7x6lxX5SPdFqTcHyP1lK992rjKmkDaVPRA89MLQnYhl5QJNoM0zbpxvv8Zf4jp4iAka5YP2t7A0d6pCgpp1yaZP-ndMzQ69mY1F5kHZxG5uHzMupCn6slrrO5amzXiIG3rJidjf58nYoZT-UzvNCT09cpxhebGceoeyQl1hpePMuuGahkXiUjOXxyh6iBDEF3I1lFpoTgCcnGTicSHLZKJbCEZ8pR-0mv7B';

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5',
    'GET'
  )).items;
}

const App = () => {
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      const tracks = await getTopTracks();
      setTopTracks(tracks);
    };

    fetchTopTracks();
  }, []);

  return (
    <div>
      {topTracks.map((track) => (
        <div key={track.id}>{track.name}</div>
      ))}
    </div>
  );
};

export default App;
