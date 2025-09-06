import Modal from 'react-modal';

const ErrorModal = ({status, closer, error}) => (
    <Modal
        isOpen={status}
        onRequestClose={closer}
    >
        <p onClick={closer}>X</p>
        <div>{error}</div>
    </Modal>
)

export default ErrorModal;