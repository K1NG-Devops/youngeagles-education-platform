// useRedirect.js
import { useNavigate } from 'react-router-dom';

function useRedirect() {
  const navigate = useNavigate();

  return (path, delay = 0) => {
    setTimeout(() => {
      if (path.startsWith('http')) {
        window.location.href = path;
      } else {
        navigate(path);
      }
    }, delay);
  };
}

export default useRedirect;
