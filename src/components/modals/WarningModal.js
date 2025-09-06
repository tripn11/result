import Modal from 'react-modal';

const WarningModal = ({status, closer, confirmer, message}) => (
  <Modal 
    isOpen={status}
    onRequestClose={closer} 
  >
    <p>⚠️ Warning</p>
    <div>{message}</div>
    <button onClick={closer}>Cancel</button>
    <button onClick={confirmer}>Confirm</button>
  </Modal>
);

export default WarningModal;
