import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const GameOver = ({ status, winner }) => {
    const navigate = useNavigate();

    const [winningColor, setWinningColor] = useState("");

    useEffect(() => {
        try {
            switch (winner) {
                case 'b':
                    setWinningColor("Black");
                    break;
                case 'w':
                    setWinningColor("White");
                    break;
                case 'd':
                    setWinningColor("Draw");
                    break;
                default:
                    throw new Error("Unexpected value for 'winner' in GameOver.jsx");
            }
        } catch (err) {
            console.error(err.message);
        }
    }, []);

    const handleClose = () => navigate("/");

    return (
        <Fragment>
            <Modal
                show={true}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                dialogClassName="modal-50w modal-50h"
                centered
            >
                <Modal.Header className="text-center">
                    <Modal.Title>Game Over</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {((winningColor !== "Draw") && (
                        <p>{winningColor} won by {status}!</p>
                    ))}
                    {((winningColor === "Draw") && (
                        <p>{winningColor} by {status}!</p>
                    ))}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button variant="dark" onClick={handleClose}>
                        Return to home
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
}

export default GameOver;