import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper to get current weekday index (0=Monday, 4=Friday)
const getTodayIndex = () => {
  const jsDay = new Date().getDay(); // 0=Sunday, 1=Monday, ...
  return jsDay === 0 ? 0 : Math.min(jsDay - 1, 4); // Sunday as Monday, max Friday
};

const DAYS = [
  {
    day: 'Monday',
    exercises: [
      {
        title: 'Match the Colors!',
        instructions: 'Drag the color names to the correct colored circles.',
        items: [
          { name: 'Red', color: 'red', hint: 'Red is the color of an apple 🍎' },
          { name: 'Blue', color: 'blue', hint: 'Blue is the color of the sky ☁️' },
          { name: 'Green', color: 'green', hint: 'Green is the color of grass 🌱' },
          { name: 'Yellow', color: 'gold', hint: 'Yellow is the color of a banana 🍌' }
        ],
      },
      {
        title: 'Match the Fruit to its Color!',
        instructions: 'Drag the fruit names to the correct color circles.',
        items: [
          { name: 'Apple', color: 'red', hint: 'Apples are usually red 🍎' },
          { name: 'Banana', color: 'gold', hint: 'Bananas are yellow 🍌' },
          { name: 'Grass', color: 'green', hint: 'Grass is green 🌱' },
          { name: 'Sky', color: 'blue', hint: 'The sky is blue ☁️' }
        ],
      },
      {
        title: 'Match the Animal to its Sound!',
        instructions: 'Drag the animal names to the correct sound.',
        items: [
          { name: 'Dog', color: 'bark', hint: 'A dog says "bark" 🐶' },
          { name: 'Cat', color: 'meow', hint: 'A cat says "meow" 🐱' },
          { name: 'Cow', color: 'moo', hint: 'A cow says "moo" 🐮' },
          { name: 'Duck', color: 'quack', hint: 'A duck says "quack" 🦆' }
        ],
        getCircle: (item) => <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 border text-lg font-bold">{item.color.toUpperCase()}</div>
      }
    ]
  },
  {
    day: 'Tuesday',
    exercises: [
      {
        title: 'Match the Shape to its Name!',
        instructions: 'Drag the shape names to the correct shapes.',
        items: [
          { name: 'Circle', color: 'circle', hint: 'A circle is round ⚪' },
          { name: 'Square', color: 'square', hint: 'A square has 4 equal sides ◼️' },
          { name: 'Triangle', color: 'triangle', hint: 'A triangle has 3 sides 🔺' },
          { name: 'Star', color: 'star', hint: 'A star has points ⭐' }
        ],
        getCircle: (item) => {
          switch (item.color) {
            case 'circle': return <div className="w-16 h-16 rounded-full bg-yellow-200" />;
            case 'square': return <div className="w-16 h-16 bg-blue-300" />;
            case 'triangle': return <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-pink-400" style={{width: 0, height: 0, borderLeft: '32px solid transparent', borderRight: '32px solid transparent', borderBottom: '56px solid #ec4899'}} />;
            case 'star': return <div className="w-16 h-16 flex items-center justify-center text-3xl">⭐</div>;
            default: return null;
          }
        }
      },
      {
        title: 'Match the Number to its Word!',
        instructions: 'Drag the number words to the correct numbers.',
        items: [
          { name: 'One', color: '1', hint: 'One is 1' },
          { name: 'Two', color: '2', hint: 'Two is 2' },
          { name: 'Three', color: '3', hint: 'Three is 3' },
          { name: 'Four', color: '4', hint: 'Four is 4' }
        ],
        getCircle: (item) => <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-200 text-xl font-bold">{item.color}</div>
      },
      {
        title: 'Match the Vehicle to its Sound!',
        instructions: 'Drag the vehicle names to the correct sound.',
        items: [
          { name: 'Car', color: 'vroom', hint: 'A car goes "vroom" 🚗' },
          { name: 'Train', color: 'choo', hint: 'A train goes "choo choo" 🚂' },
          { name: 'Ambulance', color: 'wee', hint: 'An ambulance goes "wee-woo" 🚑' },
          { name: 'Bike', color: 'ring', hint: 'A bike bell goes "ring ring" 🚲' }
        ],
        getCircle: (item) => <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 border text-lg font-bold">{item.color.toUpperCase()}</div>
      }
    ]
  },
  {
    day: 'Wednesday',
    exercises: [
      {
        title: 'Match the Weather to its Symbol!',
        instructions: 'Drag the weather words to the correct symbol.',
        items: [
          { name: 'Sunny', color: '☀️', hint: 'Sunny is ☀️' },
          { name: 'Rainy', color: '🌧️', hint: 'Rainy is 🌧️' },
          { name: 'Cloudy', color: '☁️', hint: 'Cloudy is ☁️' },
          { name: 'Snowy', color: '❄️', hint: 'Snowy is ❄️' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center text-3xl bg-blue-100 rounded-full">{item.color}</div>
      },
      {
        title: 'Match the Food to its Group!',
        instructions: 'Drag the food names to the correct group.',
        items: [
          { name: 'Apple', color: 'Fruit', hint: 'Apple is a fruit 🍎' },
          { name: 'Carrot', color: 'Vegetable', hint: 'Carrot is a vegetable 🥕' },
          { name: 'Chicken', color: 'Protein', hint: 'Chicken is protein 🍗' },
          { name: 'Bread', color: 'Grain', hint: 'Bread is a grain 🍞' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 rounded-full text-base font-bold">{item.color}</div>
      },
      {
        title: 'Match the Sport to its Ball!',
        instructions: 'Drag the sport names to the correct ball.',
        items: [
          { name: 'Soccer', color: '⚽', hint: 'Soccer uses a ⚽' },
          { name: 'Basketball', color: '🏀', hint: 'Basketball uses a 🏀' },
          { name: 'Tennis', color: '🎾', hint: 'Tennis uses a 🎾' },
          { name: 'Baseball', color: '⚾', hint: 'Baseball uses a ⚾' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center text-3xl bg-green-100 rounded-full">{item.color}</div>
      }
    ]
  },
  {
    day: 'Thursday',
    exercises: [
      {
        title: 'Match the Insect to its Sound!',
        instructions: 'Drag the insect names to the correct sound.',
        items: [
          { name: 'Bee', color: 'buzz', hint: 'A bee goes "buzz" 🐝' },
          { name: 'Mosquito', color: 'whine', hint: 'A mosquito goes "whine" 🦟' },
          { name: 'Cricket', color: 'chirp', hint: 'A cricket goes "chirp" 🦗' },
          { name: 'Fly', color: 'bzzz', hint: 'A fly goes "bzzz" 🪰' }
        ],
        getCircle: (item) => <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 border text-lg font-bold">{item.color.toUpperCase()}</div>
      },
      {
        title: 'Match the Tool to its Use!',
        instructions: 'Drag the tool names to the correct use.',
        items: [
          { name: 'Hammer', color: 'Nail', hint: 'Hammer is for nails 🔨' },
          { name: 'Spoon', color: 'Eat', hint: 'Spoon is for eating 🥄' },
          { name: 'Broom', color: 'Sweep', hint: 'Broom is for sweeping 🧹' },
          { name: 'Pen', color: 'Write', hint: 'Pen is for writing 🖊️' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full text-base font-bold">{item.color}</div>
      },
      {
        title: 'Match the Country to its Flag!',
        instructions: 'Drag the country names to the correct flag.',
        items: [
          { name: 'South Africa', color: '🇿🇦', hint: 'South Africa is 🇿🇦' },
          { name: 'USA', color: '🇺🇸', hint: 'USA is 🇺🇸' },
          { name: 'France', color: '🇫🇷', hint: 'France is 🇫🇷' },
          { name: 'Japan', color: '🇯🇵', hint: 'Japan is 🇯🇵' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center text-3xl bg-yellow-100 rounded-full">{item.color}</div>
      }
    ]
  },
  {
    day: 'Friday',
    exercises: [
      {
        title: 'Match the Family Member to their Title!',
        instructions: 'Drag the family member names to the correct title.',
        items: [
          { name: 'Mother', color: 'Mom', hint: 'Mother is Mom 👩' },
          { name: 'Father', color: 'Dad', hint: 'Father is Dad 👨' },
          { name: 'Brother', color: 'Bro', hint: 'Brother is Bro 👦' },
          { name: 'Sister', color: 'Sis', hint: 'Sister is Sis 👧' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full text-base font-bold">{item.color}</div>
      },
      {
        title: 'Match the Transport to its Type!',
        instructions: 'Drag the transport names to the correct type.',
        items: [
          { name: 'Car', color: 'Land', hint: 'Car is land transport 🚗' },
          { name: 'Boat', color: 'Water', hint: 'Boat is water transport 🚤' },
          { name: 'Plane', color: 'Air', hint: 'Plane is air transport ✈️' },
          { name: 'Bicycle', color: 'Land', hint: 'Bicycle is land transport 🚲' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full text-base font-bold">{item.color}</div>
      },
      {
        title: 'Match the Month to its Season!',
        instructions: 'Drag the month names to the correct season.',
        items: [
          { name: 'December', color: 'Summer', hint: 'December is summer ☀️' },
          { name: 'June', color: 'Winter', hint: 'June is winter ❄️' },
          { name: 'March', color: 'Autumn', hint: 'March is autumn 🍂' },
          { name: 'September', color: 'Spring', hint: 'September is spring 🌸' }
        ],
        getCircle: (item) => <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full text-base font-bold">{item.color}</div>
      }
    ]
  }
];

const shuffled = (arr) => arr.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);

// Generic ColorMatchActivity: expects props { items, instructions, title, onSubmit, disabled, initialMatches }
export default function ColorMatchActivity({ items = [], instructions = '', title = '', onSubmit, disabled = false, initialMatches = {} }) {
  const [colorNames, setColorNames] = useState(shuffled(items));
  const [matches, setMatches] = useState(initialMatches);
  const [dragged, setDragged] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  function shuffled(arr) {
    return arr.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
  }

  const isCorrect = (color) => matches[color] && items.find(c => c.color === color).name === matches[color];
  const allMatched = Object.keys(matches).length === items.length;
  const allCorrect = items.every(({ color }) => isCorrect(color));

  const handleDragStart = (name) => setDragged(name);
  const handleDrop = (color) => {
    if (dragged && !disabled) {
      setMatches((prev) => ({ ...prev, [color]: dragged }));
      setDragged(null);
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleCheck = () => {
    setShowResult(true);
    setShowHints(true);
  };

  const handleRetry = () => {
    setColorNames(shuffled(items));
    setMatches({});
    setDragged(null);
    setShowResult(false);
    setShowHints(false);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (onSubmit) {
      await onSubmit(matches);
    }
    setTimeout(() => {
      setShowResult(false);
      setShowHints(false);
    }, 2000);
  };

  // Default color circle
  const getCircle = (item) => <div style={{ background: item.color }} className="w-16 h-16 rounded-full" />;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-yellow-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="w-full p-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white flex-shrink-0">
        <h2 className="text-xl md:text-2xl font-bold text-center">{title}</h2>
        <p className="text-center mt-2 text-pink-100 text-sm md:text-base">{instructions}</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="w-full max-w-none space-y-8">
        {/* Circles to drop on */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mb-8">
          {items.map((item) => (
            <div
              key={item.color}
              onDrop={() => handleDrop(item.color)}
              onDragOver={handleDragOver}
              className={`w-20 h-20 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 ${matches[item.color] ? (isCorrect(item.color) ? 'border-green-500' : 'border-red-500') : 'border-gray-300'} transition-colors shadow-lg`}
              style={{ opacity: matches[item.color] ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
            >
              {matches[item.color] && (
                <span className="text-white font-bold text-sm select-none">
                  {matches[item.color]}
                </span>
              )}
              {!matches[item.color] && getCircle(item)}
            </div>
          ))}
        </div>
        {/* Draggable names */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
          {colorNames.map(({ name }) => (
            !Object.values(matches).includes(name) && (
              <div
                key={name}
                draggable={!disabled}
                onDragStart={() => handleDragStart(name)}
                className={`w-full px-4 py-3 bg-white rounded-lg shadow-md cursor-grab text-center font-semibold border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg select-none transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {name}
              </div>
            )
          ))}
        </div>
        {/* Hints for incorrect answers */}
        {showHints && !allCorrect && (
          <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded">
            <div className="font-semibold mb-1">Hints:</div>
            <ul className="list-disc pl-5">
              {items.map((item) =>
                !isCorrect(item.color) && matches[item.color] ? (
                  <li key={item.color}>{item.hint}</li>
                ) : null
              )}
            </ul>
          </div>
        )}
        {/* Submit/Retry/Check buttons */}
        <div className="flex flex-col items-center mt-8 gap-4 pb-6">
          {!submitted && (
            <>
              <button
                className="w-full md:w-auto bg-blue-500 text-white px-8 py-4 rounded-lg font-bold disabled:opacity-50 text-lg shadow-lg hover:bg-blue-600 transition-colors"
                disabled={!allMatched || disabled}
                onClick={handleCheck}
              >
                Check Answers
              </button>
              {showResult && allCorrect && (
                <button
                  className="w-full md:w-auto bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-green-700 transition-colors"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Submit Homework
                </button>
              )}
              {showResult && !allCorrect && (
                <button
                  className="w-full md:w-auto bg-yellow-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-yellow-600 transition-colors"
                  onClick={handleRetry}
                  disabled={disabled}
                >
                  Try Again
                </button>
              )}
            </>
          )}
          {submitted && (
            <div className="mt-4 text-center">
              <span className="text-green-600 font-bold block mb-2">Great job! Activity complete! 🎉</span>
            </div>
          )}
          {showResult && !allCorrect && (
            <span className="text-red-600 font-bold mt-2">Some matches are incorrect. Try again!</span>
          )}
        </div>
        {submitted && (
          <div className="mt-6 text-center">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg mx-auto max-w-xs">
              <div className="text-lg font-bold">🎉 Perfect Match! 🎉</div>
              <div className="text-sm mt-1">All colors matched correctly!</div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 