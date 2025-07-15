import { Link } from 'react-router-dom';
import useRedirect from '../hooks/useRedirect';

function MyButton() {
  const redirect = useRedirect(); // ✅ Call the hook at the top

  return (
    <button>
      <Link to='/login'
      className="px-4 py-2 bg-pink-600 text-white rounded-xl w-50 hover:bg-blue-700 transition"
    >
      Start
      </Link>
    </button>
  );
}

export default MyButton;
