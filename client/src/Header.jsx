import './App.css';
import { MDBCardImage } from 'mdb-react-ui-kit';
import Stack from 'react-bootstrap/Stack';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
    return (
        /*
        <div className="Header">
            <div style={{width:"20%"}}>
                <Stack gap={1} style={{width:"120%"}}>
                    <h1 className="Title">FAFOChess</h1> 
                    <h3>Free And Fun Online Chess</h3>
                </Stack>
            </div>
            <MDBCardImage
                  src="FAFOLogo .svg"
                  alt="avatar"
                  className="rounded-circle"
                  style={{width: '100px', background:"black"}}
                  fluid />
        </div>
        */

        <Navbar className="navbar navbar-expand-md py-4 pink">
        <div class="container">
                <div style={{width:"35%"}}>
                <Stack gap={1} style={{width:"100%"}}>
                    <h1 className="Title">FAFOChess</h1> 
                    <h3>Free And Fun Online Chess</h3>
                </Stack>
                 </div>
                 <MDBCardImage
                  src="FAFOLogo .svg"
                  alt="avatar"
                  className="rounded-circle"
                  style={{width: '100px', background:"black"}}
                  fluid />

            <button type="button" data-toggle="collapse" data-target="#navbarSupportedContent2" aria-controls="navbarSupportedContent2" aria-expanded="false" aria-label="Toggle navigation" class="navbar-toggler"><span class="navbar-toggler-icon"></span></button>

            <div id="navbarSupportedContent2" class="collapse navbar-collapse">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active"><a href="#" class="nav-link">Home <span class="sr-only">(current)</span></a></li>
                <li class="nav-item"><a href="#" class="nav-link">About</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Services</a></li>
                <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
            </ul>
            </div>
        </div>
        </Navbar>
    )
    
}

export default Header