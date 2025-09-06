import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "← Back", destination=-1, confirm }) => {
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
    <button onClick={handleClick}>{label}</button>
  );
};

export default BackButton;