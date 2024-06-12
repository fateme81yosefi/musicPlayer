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
                <input placeholder="search..." />


                <div className="currentlyPlay">

                    <img src="/song_cover.png" alt="کاور آهنگ" />
                    <div className="containName">
                        <span className="">Armin Zarei - Daram Havato (320)</span>
                        <audio id="player" src="/Armin Zarei - Daram Havato (320).mp3" controls ></audio>

                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}
export default MainPage;