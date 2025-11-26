import Modal from 'react-modal';
import success from "../../good.png";

const SuccessModal = ({status, message='success'}) => (
    <Modal 
        isOpen={status}
        className="utility-modal"
        overlayClassName="utility-modal-overlay"
    >
        <div className='success-modal'>
            <img src={success} alt='checkmark'/> 
            <div>{message.split('<br />')
                    .map((line, i) => (<span key={i}>{line}<br /></span>))
                }
            </div>
        </div>
    </Modal>
)

export default SuccessModal;
