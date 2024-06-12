import "./MainPage.css"
const MainPage = () => {


    return (
        <div className="container">
            <div className="leftMenue">
                <div className="top">
                    <div className="imageProfile">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s" />
                        <div className="name">Fateme</div>

                    </div>
                    <div className="categories">
                        <h4>categories:</h4>
                        <span>pop</span>
                        <hr />
                        <span>Rock</span>
                        <hr />
                        <span>fav</span>
                        <hr />
                    </div>
                    <div className="artist">
                        <h4>Artist:</h4>
                        <span>ali</span>
                        <hr />
                        <span>reza</span>
                        <hr />
                        <span>amir</span>
                        <hr />
                    </div>
                </div>
                <button>Create PlayList</button>
            </div>
            <div className="rightPage">
                <input placeholder="search..."/>


                <div className="currentlyPlay">
                <div class="icon-container">
    <svg xmlns="http://www.w3.org/2000/svg" class="audio-icon" viewBox="0 0 20 20" fill="currentColor">
  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
</svg>
                <audio src="/Armin Zarei - Daram Havato (320).mp3"  controls/>

                </div>
            </div>
        </div>
    )
}
export default MainPage;