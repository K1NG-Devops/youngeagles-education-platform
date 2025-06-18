import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPuzzlePiece, FaPaintBrush, FaShapes, FaPalette, FaQuestion, FaBook, FaStar, FaAppleAlt, FaDog, FaMusic } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { decodeToken } from '../../utils/decodeToken';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

const initialItem = { name: '', target: '', hint: '' };

const activityTypes = [
  { key: 'match', label: 'Match', icon: <FaPuzzlePiece className="text-pink-500" /> },
  { key: 'sort', label: 'Sort', icon: <FaShapes className="text-green-500" /> },
  { key: 'color', label: 'Color', icon: <FaPalette className="text-yellow-500" /> },
  { key: 'puzzle', label: 'Puzzle', icon: <FaPaintBrush className="text-blue-500" /> },
  { key: 'memory', label: 'Memory', icon: <FaBook className="text-purple-500" /> },
  { key: 'quiz', label: 'Quiz', icon: <FaQuestion className="text-orange-500" /> },
];

const readyMadeTemplates = [
  // --- EASY ---
  {
    type: 'match',
    title: 'Match the Colors',
    instructions: 'Drag each color to its matching name.',
    difficulty: 'Easy',
    age: '3-4',
    items: [
      { name: 'Red', target: '🔴', hint: 'Color' },
      { name: 'Blue', target: '🔵', hint: 'Color' },
      { name: 'Green', target: '🟢', hint: 'Color' },
      { name: 'Yellow', target: '🟡', hint: 'Color' },
    ],
  },
  {
    type: 'sort',
    title: 'Sort the Animals',
    instructions: 'Sort animals into land and water.',
    difficulty: 'Easy',
    age: '3-4',
    items: [
      { name: 'Fish', target: 'Water', hint: 'Lives in water' },
      { name: 'Dog', target: 'Land', hint: 'Lives on land' },
      { name: 'Frog', target: 'Water', hint: 'Can swim' },
      { name: 'Bird', target: 'Land', hint: 'Can fly' },
    ],
  },
  {
    type: 'color',
    title: 'Color the Shapes',
    instructions: 'Color each shape as shown.',
    difficulty: 'Easy',
    age: '3-4',
    items: [
      { name: 'Circle', target: 'Red', hint: 'Color' },
      { name: 'Square', target: 'Blue', hint: 'Color' },
      { name: 'Triangle', target: 'Yellow', hint: 'Color' },
      { name: 'Star', target: 'Green', hint: 'Color' },
    ],
  },
  {
    type: 'memory',
    title: 'Memory: Match the Fruit',
    instructions: 'Match each fruit to its pair.',
    difficulty: 'Easy',
    age: '3-4',
    items: [
      { name: 'Apple', target: '🍎', hint: 'Fruit' },
      { name: 'Banana', target: '🍌', hint: 'Fruit' },
      { name: 'Grape', target: '🍇', hint: 'Fruit' },
      { name: 'Orange', target: '🍊', hint: 'Fruit' },
    ],
  },
  {
    type: 'match',
    title: 'Match the Numbers',
    instructions: 'Match each number to its word.',
    difficulty: 'Easy',
    age: '3-4',
    items: [
      { name: '1', target: 'One', hint: 'First number' },
      { name: '2', target: 'Two', hint: 'Second number' },
      { name: '3', target: 'Three', hint: 'Third number' },
      { name: '4', target: 'Four', hint: 'Fourth number' },
    ],
  },
  // --- MEDIUM ---
  {
    type: 'quiz',
    title: 'Quiz: Animal Sounds',
    instructions: 'Which animal says "woof"?',
    difficulty: 'Medium',
    age: '4-5',
    items: [
      { name: 'Dog', target: 'Woof', hint: 'Barks' },
      { name: 'Cat', target: 'Meow', hint: 'Meows' },
      { name: 'Cow', target: 'Moo', hint: 'Moos' },
      { name: 'Duck', target: 'Quack', hint: 'Quacks' },
    ],
  },
  {
    type: 'puzzle',
    title: 'Puzzle: Complete the Pattern',
    instructions: 'Drag the correct shape to complete the pattern.',
    difficulty: 'Medium',
    age: '4-5',
    items: [
      { name: 'Circle', target: '🔵', hint: 'Shape' },
      { name: 'Square', target: '🟦', hint: 'Shape' },
      { name: 'Triangle', target: '🔺', hint: 'Shape' },
      { name: 'Star', target: '⭐', hint: 'Shape' },
    ],
  },
  {
    type: 'sort',
    title: 'Sort the Foods',
    instructions: 'Sort foods into healthy and treats.',
    difficulty: 'Medium',
    age: '4-5',
    items: [
      { name: 'Apple', target: 'Healthy', hint: 'Fruit' },
      { name: 'Candy', target: 'Treat', hint: 'Sweet' },
      { name: 'Carrot', target: 'Healthy', hint: 'Vegetable' },
      { name: 'Cookie', target: 'Treat', hint: 'Baked' },
    ],
  },
  {
    type: 'color',
    title: 'Color the Vehicles',
    instructions: 'Color each vehicle as shown.',
    difficulty: 'Medium',
    age: '4-5',
    items: [
      { name: 'Car', target: 'Red', hint: 'Color' },
      { name: 'Bus', target: 'Yellow', hint: 'Color' },
      { name: 'Bike', target: 'Blue', hint: 'Color' },
      { name: 'Truck', target: 'Green', hint: 'Color' },
    ],
  },
  {
    type: 'memory',
    title: 'Memory: Match the Weather',
    instructions: 'Match each weather word to its symbol.',
    difficulty: 'Medium',
    age: '4-5',
    items: [
      { name: 'Sunny', target: '☀️', hint: 'Bright' },
      { name: 'Rainy', target: '🌧️', hint: 'Wet' },
      { name: 'Cloudy', target: '☁️', hint: 'Gray' },
      { name: 'Snowy', target: '❄️', hint: 'Cold' },
    ],
  },
  // --- HARD ---
  {
    type: 'quiz',
    title: 'Quiz: What Comes Next?',
    instructions: 'What comes after 3? (1, 2, 3, ?)',
    difficulty: 'Hard',
    age: '5-6',
    items: [
      { name: '4', target: 'Next', hint: 'After 3' },
      { name: '5', target: 'Later', hint: 'After 4' },
      { name: '6', target: 'Later', hint: 'After 5' },
      { name: '7', target: 'Later', hint: 'After 6' },
    ],
  },
  {
    type: 'puzzle',
    title: 'Puzzle: Build the Robot',
    instructions: 'Drag the parts to build the robot.',
    difficulty: 'Hard',
    age: '5-6',
    items: [
      { name: 'Head', target: '🤖', hint: 'Top' },
      { name: 'Body', target: '🦾', hint: 'Middle' },
      { name: 'Arms', target: '🦿', hint: 'Sides' },
      { name: 'Legs', target: '🦵', hint: 'Bottom' },
    ],
  },
  {
    type: 'robotics',
    title: 'Robotics: Sequence the Robot',
    instructions: 'Put the robot steps in order to reach the goal.',
    difficulty: 'Hard',
    age: '5-6',
    items: [
      { name: 'Move Forward', target: 'Step 1', hint: 'Start' },
      { name: 'Turn Left', target: 'Step 2', hint: 'Turn' },
      { name: 'Move Forward', target: 'Step 3', hint: 'Continue' },
      { name: 'Pick Up', target: 'Step 4', hint: 'Finish' },
    ],
  },
  {
    type: 'robotics',
    title: 'Robotics: Coding Colors',
    instructions: 'Match the color blocks to the robot commands.',
    difficulty: 'Hard',
    age: '5-6',
    items: [
      { name: 'Red Block', target: 'Start', hint: 'Begin' },
      { name: 'Blue Block', target: 'Turn', hint: 'Change direction' },
      { name: 'Green Block', target: 'Go', hint: 'Move' },
      { name: 'Yellow Block', target: 'Stop', hint: 'End' },
    ],
  },
  {
    type: 'robotics',
    title: 'Robotics: If-Then Logic',
    instructions: 'Match the condition to the robot action.',
    difficulty: 'Hard',
    age: '5-6',
    items: [
      { name: 'If button pressed', target: 'Move Forward', hint: 'Action' },
      { name: 'If see red', target: 'Stop', hint: 'Action' },
      { name: 'If see green', target: 'Go', hint: 'Action' },
      { name: 'If hear beep', target: 'Turn', hint: 'Action' },
    ],
  },
  // ...add more as needed to reach 15-20
];

// Helper to fetch teacher by class/grade
async function fetchTeacherByClass(className, grade) {
  console.log('Fetching teacher for className:', className, 'grade:', grade);
  if (!className || !grade) {
    throw new Error('Class name and grade are required to fetch teacher.');
  }
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('Not authenticated. Please log in.');
  const response = await fetch(
    `https://youngeagles-api-server.up.railway.app/api/teachers/by-class?className=${encodeURIComponent(className)}&grade=${encodeURIComponent(grade)}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    }
  );
  if (!response.ok) throw new Error('Failed to fetch teacher: ' + (await response.text()));
  const data = await response.json();
  return data.teacher;
}

// Submit activity/homework to backend
async function submitHomework({ classInfo, teacher, activity, dueDate, fileUrl = '' }) {
  const token = localStorage.getItem('accessToken');
  
  // Debug logging to see what we're receiving
  console.log('🔍 submitHomework received:', {
    classInfo,
    teacher,
    activity,
    dueDate,
    fileUrl
  });
  
  // Validate required data
  if (!activity?.title) throw new Error('Activity title is required');
  if (!classInfo?.className) throw new Error('Class name is required');
  if (!classInfo?.grade) throw new Error('Grade is required');
  if (!teacher?.id) throw new Error('Teacher ID is required');
  
  const payload = {
    title: activity.title,
    instructions: activity.instructions || '',
    className: classInfo.className,
    grade: classInfo.grade,
    uploadedBy: teacher.id,
    fileUrl: fileUrl || '', // Support for file uploads
    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 1 week from now
    type: activity.type || null,
    items: activity.items || null,
  };
  
  console.log('📤 Sending payload:', payload);
  const response = await fetch(`${API_BASE_URL}/homeworks/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('❌ Server response error:', {
      status: response.status,
      statusText: response.statusText,
      errorData
    });
    throw new Error(`Server error ${response.status}: ${errorData.error || errorData.message || response.statusText}`);
  }
  
  const result = await response.json();
  console.log('✅ Homework submitted successfully:', result);
  return result;
}

// Update existing homework
async function updateHomework(homeworkId, data) {
  const token = localStorage.getItem('accessToken');
  
  const payload = {
    title: data.title,
    instructions: data.instructions,
    type: data.type,
    items: data.items
  };
  
  const response = await fetch(`https://youngeagles-api-server.up.railway.app/api/homework/${homeworkId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Update failed: ${errorData.error || errorData.message}`);
  }
  
  return await response.json();
}

// Helper to get item field labels based on type
const getItemFields = (type) => {
  switch (type) {
    case 'quiz':
      return [
        { key: 'name', label: 'Question' },
        { key: 'target', label: 'Answer' },
        { key: 'hint', label: 'Hint (optional)' },
      ];
    case 'memory':
      return [
        { key: 'name', label: 'Item 1' },
        { key: 'target', label: 'Item 2' },
        { key: 'hint', label: 'Hint (optional)' },
      ];
    case 'sort':
      return [
        { key: 'name', label: 'Item' },
        { key: 'target', label: 'Category' },
        { key: 'hint', label: 'Hint (optional)' },
      ];
    case 'color':
      return [
        { key: 'name', label: 'Shape/Item' },
        { key: 'target', label: 'Color' },
        { key: 'hint', label: 'Hint (optional)' },
      ];
    case 'puzzle':
      return [
        { key: 'name', label: 'Piece' },
        { key: 'target', label: 'Position/Target' },
        { key: 'hint', label: 'Hint (optional)' },
      ];
    case 'match':
    default:
      return [
        { key: 'name', label: 'Item' },
        { key: 'target', label: 'Target' },
        { key: 'hint', label: 'Hint (optional)' },
      ];
  }
};

export default function TeacherActivityBuilder() {
  const [type, setType] = useState('match');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [className, setClassName] = useState('');
  const [grade, setGrade] = useState('');
  const [items, setItems] = useState([{ ...initialItem }]);
  const [submitting, setSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [homeworks, setHomeworks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dueDate, setDueDate] = useState('');

  // Auto-fill className and grade from JWT
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.className) setClassName(decoded.className);
      if (decoded?.grade) setGrade(decoded.grade);
    }
  }, []);

  // Fetch posted homeworks
  useEffect(() => {
    const fetchHomeworks = async () => {
      const teacherId = localStorage.getItem('teacherId');
      const token = localStorage.getItem('accessToken');
      if (!teacherId || !token) return;
      try {
        const res = await fetch(`https://youngeagles-api-server.up.railway.app/api/homeworks/for-teacher/${teacherId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setHomeworks(data.homeworks || []);
      } catch (err) {
        // Error fetching homeworks
      }
    };
    fetchHomeworks();
  }, []);

  // Template selection
  const handleTemplateSelect = (template) => {
    setType(template.type);
    setTitle(template.title);
    setInstructions(template.instructions);
    setItems(template.items);
  };

  // Drag-and-drop handler
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  const handleItemChange = (idx, field, value) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };
  const addItem = () => {
    setItems(items => [...items, { ...initialItem }]);
  };
  const removeItem = idx => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // Check if we're editing an existing homework
      if (editingId) {
        await updateHomework(editingId, {
          title,
          instructions,
          type,
          items: items.filter(item => item.name && item.target),
        });
        alert('Homework updated successfully!');
        // Reset editing state
        setEditingId(null);
        setTitle('');
        setInstructions('');
        setItems([{ ...initialItem }]);
        setType('match');
        // Refresh homework list
        const fetchHomeworks = async () => {
          const teacherId = localStorage.getItem('teacherId');
          const token = localStorage.getItem('accessToken');
          if (!teacherId || !token) return;
          try {
            const res = await fetch(`https://youngeagles-api-server.up.railway.app/api/homeworks/for-teacher/${teacherId}`, {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setHomeworks(data.homeworks || []);
          } catch (err) {
            // Error fetching homeworks
          }
        };
        fetchHomeworks();
      } else {
        // Create new homework
        const classInfo = { className, grade };
        let teacher = JSON.parse(localStorage.getItem('teacher'));
        if (!teacher || !teacher.id) {
          teacher = await fetchTeacherByClass(className, grade);
          localStorage.setItem('teacher', JSON.stringify(teacher));
        }
        const activity = {
          type,
          title,
          instructions,
          className,
          grade,
          items: items.filter(item => item.name && item.target),
        };
        await submitHomework({ classInfo, teacher, activity, dueDate });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        alert('Homework/activity submitted to your class!');
      }
    } catch (err) {
      setError(err.message);
      alert('Submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete homework
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this homework?')) return;
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`https://youngeagles-api-server.up.railway.app/api/homeworks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setHomeworks(homeworks.filter(hw => hw.id !== id));
    } catch (err) {
      alert('Failed to delete homework.');
    }
  };

  // Edit homework
  const handleEdit = (hw) => {
    setEditingId(hw.id);
    setType(hw.type || 'match');
    setTitle(hw.title || '');
    setInstructions(hw.instructions || '');
    setItems(hw.items || [{ ...initialItem }]);
    setClassName(hw.class_name || '');
    setGrade(hw.grade || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded shadow mt-8 overflow-x-auto animate-fade-in">
      {/* Back to Dashboard Button */}
      <button onClick={() => navigate('/teacher-dashboard')} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Back to Dashboard</button>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} gravity={0.3} />}
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 animate-bounce">Create Fun Homework Activity</h2>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-center font-semibold">{error}</div>}
      {/* 1. Activity Type Picker */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        {activityTypes.map((t) => (
          <button
            key={t.key}
            className={`flex flex-col items-center px-4 py-3 rounded-lg shadow-md text-lg font-bold transition-all duration-200 transform hover:scale-110 ${type === t.key ? 'bg-blue-200 scale-105' : 'bg-gray-100 hover:bg-blue-100'}`}
            onClick={() => setType(t.key)}
            type="button"
          >
            <span className="text-3xl mb-1 animate-pop-in">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      {/* 2. Ready-Made Template Gallery */}
      <div className="mb-8">
        <h3 className="font-bold mb-2 text-lg text-blue-600">Pick a Ready-Made Activity</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 flex-nowrap">
          {readyMadeTemplates.map((tpl, idx) => (
            <div key={idx} className="min-w-[220px] bg-yellow-50 rounded-lg shadow p-4 flex flex-col items-start transition-transform duration-300 hover:scale-105 animate-fade-in">
              <div className="font-bold text-lg mb-1">{tpl.title}</div>
              <div className="text-sm text-gray-700 mb-2">{tpl.instructions}</div>
              <div className="text-xs text-gray-500 mb-1">{tpl.difficulty} | Ages {tpl.age}</div>
              <ul className="mb-2 text-sm">
                {tpl.items.map((item, i) => (
                  <li key={i}><b>{item.name}</b> → <span className="text-blue-700">{item.target}</span></li>
                ))}
              </ul>
              <button
                className="mt-auto px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={() => handleTemplateSelect(tpl)}
                type="button"
              >Use this</button>
            </div>
          ))}
          <div className="min-w-[220px] flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow p-4 animate-fade-in">
            <span className="text-4xl mb-2">➕</span>
            <span className="font-bold">Start from Scratch</span>
            <button
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition"
              onClick={() => {
                setTitle('');
                setInstructions('');
                setItems([{ ...initialItem }]);
              }}
              type="button"
            >Blank Activity</button>
          </div>
        </div>
      </div>
      {/* 3. Drag-and-Drop Builder */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 min-w-[300px]">
            <label className="block font-semibold mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-300 transition" />
            <label className="block font-semibold mb-1">Instructions</label>
            <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-300 transition" />
            <div className="flex gap-4 mb-3 flex-wrap">
              <div className="flex-1 min-w-[120px]">
                <label className="block font-semibold mb-1">Class Name</label>
                <input value={className} readOnly className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 transition bg-gray-100 cursor-not-allowed" />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block font-semibold mb-1">Grade</label>
                <input value={grade} readOnly className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 transition bg-gray-100 cursor-not-allowed" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Due Date <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 transition" 
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <p className="text-sm text-gray-600 mt-1">Select the date by which this homework should be completed.</p>
            </div>
            <label className="block font-semibold mb-2">Items (Drag to reorder)</label>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="items-list" isDropDisabled={false}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    {items.map((item, idx) => (
                      <Draggable key={idx} draggableId={`item-${idx}`} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex flex-col md:flex-row gap-2 mb-2 items-center w-full bg-white border rounded p-2 shadow-sm transition-transform duration-200 ${snapshot.isDragging ? 'ring-2 ring-blue-400 scale-105' : ''}`}
                          >
                            {getItemFields(type).map(field => (
                              <input
                                key={field.key}
                                placeholder={field.label}
                                value={item[field.key] || ''}
                                onChange={e => handleItemChange(idx, field.key, e.target.value)}
                                className="p-2 border rounded flex-1 focus:ring-2 focus:ring-blue-300 transition"
                              />
                            ))}
                            <button type="button" onClick={() => removeItem(idx)} className="text-red-600 font-bold px-2 hover:scale-125 transition">✕</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button type="button" onClick={addItem} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition">Add Item</button>
          </div>
          {/* 4. Live Preview */}
          <div className="flex-1 min-w-[300px] bg-blue-50 rounded-lg p-4 shadow overflow-x-auto animate-fade-in">
            <h3 className="font-bold mb-2 text-blue-700">Live Preview</h3>
            <div className="mb-1 font-semibold text-lg">{title || <span className="text-gray-400">(No title yet)</span>}</div>
            <div className="mb-2 text-sm text-gray-600">{instructions || <span className="text-gray-400">(No instructions yet)</span>}</div>
            <ul className="list-disc pl-5">
              {items.map((item, idx) => (
                <li key={idx} className="transition-all duration-200 hover:scale-105">
                  {getItemFields(type).map(field => (
                    <span key={field.key} className="mr-2">
                      <b>{field.label}:</b> {item[field.key] || <span className="text-gray-400">(empty)</span>}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-gray-500">(This is how children will see the activity!)</div>
          </div>
        </div>
        {/* 5. Assign & Save Controls */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button type="submit" disabled={submitting} className="px-6 py-2 bg-green-500 text-white rounded font-bold text-lg hover:bg-green-700 transition">
            {submitting ? 'Submitting...' : 'Assign to Class'}
          </button>
          <button type="button" className="px-6 py-2 bg-yellow-400 text-white rounded font-bold text-lg hover:bg-yellow-500 transition" onClick={() => alert('Saving as template coming soon!')}>
            Save as Template
          </button>
        </div>
      </form>
      {/* Posted Homeworks Section */}
      <div className="mt-12">
        <h3 className="font-bold text-xl mb-4 text-blue-700">My Posted Homeworks</h3>
        {homeworks.length === 0 ? (
          <div className="text-gray-500">No homeworks posted yet.</div>
        ) : (
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Due Date</th>
                <th className="py-2 px-4 border-b">Class</th>
                <th className="py-2 px-4 border-b">Grade</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {homeworks.map(hw => (
                <tr key={hw.id}>
                  <td className="py-2 px-4 border-b">{hw.title}</td>
                  <td className="py-2 px-4 border-b">{hw.type || '-'}</td>
                  <td className="py-2 px-4 border-b">{hw.due_date ? new Date(hw.due_date).toLocaleDateString() : '-'}</td>
                  <td className="py-2 px-4 border-b">{hw.class_name}</td>
                  <td className="py-2 px-4 border-b">{hw.grade}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleEdit(hw)} className="mr-2 px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
                    <button onClick={() => handleDelete(hw.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
// NOTE: You must install react-beautiful-dnd for drag-and-drop to work:
// npm install react-beautiful-dnd
// Animations use Tailwind CSS classes (add custom keyframes if you want more effects)
// NOTE: Place pop.mp3 and success.mp3 in src/assets/sounds/ or update the import paths. 