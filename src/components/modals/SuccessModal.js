import Modal from 'react-modal';

const SuccessModal = ({status, message}) => (
    <Modal isOpen={status}>
        <p>v</p>
        <div>{message}</div>
    </Modal>
)

export default SuccessModal;
