import React from "react";
import Modal from 'react-modal';


export default props => (
    <Modal
        isOpen={props.status}
        onRequestClose={props.closer}
    >
        <p onClick={props.closer}>X</p>
        <p>{props.error}</p>
    </Modal>
)