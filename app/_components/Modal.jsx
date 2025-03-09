import React from "react";

const Modal = ({ message, onClose }) => {
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>{message}</h2>
                <button style={styles.button} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Modal;
