import React, { Fragment, useState } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const EditBio = ({ profileData, bio, setBio }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setBio(profileData.bio);
    };

    const handleShow = () => setShow(true);

    const updateBio = async (e) => {
        e.preventDefault();
        try {
            const body = { bio };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/bio/${profileData.username}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            const responseData = await response.json();
    
            if (!response.ok) {
                throw new Error(responseData.error);
            }
    
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
      };

    return(
        <Fragment>
            <Button variant="dark" style={{margin: "0px", maxWidth: "100px"}} onClick={handleShow}>
                Edit Bio
            </Button>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Bio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <Form.Control as="textarea" value={bio} onChange={e => setBio(e.target.value)}/>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="" onClick={handleClose}>Close</Button>
                    <Button variant="dark" onClick={e => updateBio(e)}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default EditBio;