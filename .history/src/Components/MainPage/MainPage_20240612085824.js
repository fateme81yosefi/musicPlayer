import "./MainPage.css"
const MainPage = () => {


    return (
        <div className="container">
            <div className="leftMenue">
                <div className="imageProfile">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s" />
                </div>
                <div className="name">Fateme</div>
                <div className="categories">
                    <h4>categories:</h4>
                    <span>pop</span>
                    <hr />
                    <span>Rock</span>
                    <hr />
                    <span>fav</span>
                    <hr />
                </div>
            </div>
            <div className="rightPage"></div>
        </div>
    )
}
export default MainPage;