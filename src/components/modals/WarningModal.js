import Modal from 'react-modal';

const WarningModal = ({status, closer, confirmer, message}) => (
  <Modal 
    isOpen={status}
    onRequestClose={closer} 
    className="utility-modal"
    overlayClassName="utility-modal-overlay"
  >
    <div className='warning-modal'>
      <h3>⚠️ Warning</h3>
      <div>{message}</div>
      <button onClick={closer}>Cancel</button>
      <button onClick={confirmer}>Confirm</button>
    </div>
    
  </Modal>
);

export default WarningModal;
