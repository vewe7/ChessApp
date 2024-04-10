import './App.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className="Header">
            <div className="title-container">
                <h1 className="Title">FAFOChess</h1> 
                <h2>Free And Fun Online Chess</h2>
            </div>
            <img className="logo" src ="FAFOLogo .svg"></img>
            <Link to='/game'>Chess Game</Link>
        </div>  
    )
    
}

export default Header