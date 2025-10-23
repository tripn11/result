import Modal from 'react-modal';

const SuccessModal = ({status, message}) => (
    <Modal isOpen={status}>
        <p>v</p>
        <div>{message.split('<br />').map((line, i) => (
                <span key={i}>
                    {line}
                    <br />
                </span>
            ))}
        </div>
    </Modal>
)

export default SuccessModal;
