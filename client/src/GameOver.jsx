import React, { Fragment, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const GameOver = ({ status, winner, setIsGameOver, setStatus, setWinner }) => {
    const navigate = useNavigate();

    const [winningColor, setWinningColor] = useState("");
    const [losingColor, setLosingColor] = useState("");

    useEffect(() => {
        try {
            switch (winner) {
                case "b":
                    setWinningColor("Black");
                    setLosingColor("White");
                    break;
                case "w":
                    setWinningColor("White");
                    setLosingColor("Black");
                    break;
                case "d":
                    setWinningColor("Draw");
                    break;
                default:
                    throw new Error("Unexpected value for 'winner' in GameOver.jsx");
            }
        } catch (err) {
            console.error(err.message);
        }
    }, []);

    const handleClose = () => {
        setIsGameOver(false);
        localStorage.setItem("isGameOver", false);
        setStatus("");
        localStorage.setItem("status", "");
        setWinner("");
        localStorage.setItem("winner", "");
        navigate("/");
    }

    return (
        <Fragment>
            <Modal
                show={true}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header className="d-flex justify-content-center">
                    <Modal.Title>Game Over</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    {((winningColor !== "Draw" && status === "flag") && (
                        <p className="m-0">{losingColor} ran out of time! {winningColor} wins!</p>
                    ))}
                    {((winningColor !== "Draw" && status === "resign") && (
                        <p className="m-0">{winningColor} resigned! {losingColor} wins!</p> // ignore the reversed winner/loser, it works as intended
                    ))}
                    {((winningColor !== "Draw" && !(status === "flag" || status === "resign")) && (
                        <p className="m-0">{winningColor} won by {status}!</p>
                    ))}
                    {((winningColor === "Draw" && status === "draw") && (
                        <p className="m-0">Draw offer accepted!</p>
                    ))}
                    {((winningColor === "Draw" && status !== "draw") && (
                        <p>Draw by {status}!</p>
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