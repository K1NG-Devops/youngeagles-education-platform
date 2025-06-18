import { Link } from 'react-router-dom';
import useRedirect from '../hooks/useRedirect';

function MyRegisterButton() {
  const redirect = useRedirect(); // ✅ Call the hook at the top

  return (
    <button><Link to="/register" className="px-4 py-2 bg-pink-600 text-white rounded-xl w-50 hover:bg-blue-700 transition">
      Register Now
      </Link>
    </button>
  );
}

export default MyRegisterButton;
