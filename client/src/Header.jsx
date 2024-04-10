import './App.css';
import { MDBCardImage } from 'mdb-react-ui-kit';

function Header() {
    return (
        <div className="Header">
            <div className="title-container">
                <h1 className="Title">FAFOChess</h1> 
                <h2>Free And Fun Online Chess</h2>
            </div>
            <MDBCardImage
                  src="FAFOLogo .svg"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '100px', background:"black" }}
                  fluid />
        </div>
        
    )
}

export default Header