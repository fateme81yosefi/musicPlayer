import aud from "/src/DB/Ahllam-Yare-Dirin-128.mp3"

const App = () => {

  return (
    <audio controls>
      <source src="{aud}" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  )

}
export default App;
