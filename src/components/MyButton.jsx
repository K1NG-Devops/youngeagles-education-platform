import { Link } from 'react-router-dom';

function MyButton() {
  return (
    <button>
      <Link to='/contact'
      className="px-4 py-2 bg-pink-600 text-white rounded-xl w-50 hover:bg-blue-700 transition"
    >
      Get Started
      </Link>
    </button>
  );
}

export default MyButton;
