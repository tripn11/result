import { useNavigate } from "react-router-dom";

const BackButton = ({ label = (<ion-icon name="chevron-back-outline"></ion-icon>), destination=-1, confirm }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if(confirm){
      e.preventDefault();
      const confirmLeave = window.confirm('If you leave now, you would lose your unsaved data.');
      if (confirmLeave) {
        navigate(destination);
      }
    } else {
      navigate(destination);
    }
  };

  return (
    <button onClick={handleClick} className='special'>{label}</button>
  );
};

export default BackButton;