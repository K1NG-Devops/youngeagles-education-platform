// const API_BASE = 'https://youngeagles-api-server.up.railway.app/api/homeworks';

// export const fetchHomeworks = async (className, grade) => {
//   try {
//     const res = await fetch(`${API_BASE}/list?className=${className}&grade=${grade}`);
//     if (!res.ok) throw new Error('Failed to fetch homeworks');
//     return await res.json();
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// };

// useEffect(() => {
//     const fetchHomeworks = async () => {
//       try {
//         const token = localStorage.getItem('accessToken');
    
//         const response = await fetch(`https://youngeagles-api-server.up.railway.app/api/homeworks/list?className=${className}&grade=${grade}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
    
//         if (!response.ok) throw new Error('Failed to fetch homeworks');
    
//         const data = await response.json();
//         setHomeworkList(data);
//       } catch (err) {
//         console.error("Failed to fetch homework:", err);
//         toast.error("Could not load homework");
//       }
//     };

//     fetchHomeworks();
//   }, []);

import { API_BASE_URL } from '../config/api';

export const fetchHomeworks = async (className, grade, token) => {
  const res = await fetch(
    `${API_BASE_URL}/homeworks/list?className=${className}&grade=${grade}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch homeworks');
  return res.json();
};
