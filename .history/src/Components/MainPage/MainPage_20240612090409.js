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
                        <span>fav</span>
                        <hr />
                    </div>
                </div>
                <button>Create PlayList</button>
            </div>
            <div className="rightPage"></div>
        </div>
    )
}
export default MainPage;