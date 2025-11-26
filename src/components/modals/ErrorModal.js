import Modal from 'react-modal';

const ErrorModal = ({status, closer, error}) => (
    <Modal
        isOpen={status}
        onRequestClose={closer}
        className="utility-modal"
        overlayClassName="utility-modal-overlay"
    >
        <div className='error-modal'>
            <span onClick={closer}><ion-icon name="close-circle-outline"></ion-icon></span>
            <div>{error}</div>
        </div>
    </Modal>
)

export default ErrorModal;