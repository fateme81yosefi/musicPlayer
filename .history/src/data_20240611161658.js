import React, { useEffect } from 'react';

const Data = ({ topTracks }) => {
  useEffect(() => {
    console.log(topTracks?.map(
      ({ name, artists }) =>
        ${name} by ${artists.map(artist => artist.name).join(', ')}
    ));
  }, [topTracks]);

  return (
    <div>
      <h2>Top Tracks</h2>
      <ul>
        {topTracks?.map(({ name, artists }, index) => (
          <li key={index}>{${name} by ${artists.map(artist => artist.name).join(', ')}}</li>
        ))}
      </ul>
    </div>
  );
}

export default Data;
