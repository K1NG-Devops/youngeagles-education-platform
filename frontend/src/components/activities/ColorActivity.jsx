import React, { useState } from 'react';

const ColorActivity = ({ items = [], instructions = '', title = '', onSubmit, disabled = false }) => {
  const [coloredItems, setColoredItems] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleColorSelect = (itemName, color) => {
    if (disabled) return;
    setColoredItems(prev => ({
      ...prev,
      [itemName]: color
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    checkAnswers();
  };

  const availableColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black'];
  
  // Check if all items are correctly colored
  const checkAnswers = () => {
    let correctCount = 0;
    const results = items.map(item => {
      const isCorrect = coloredItems[item.name] === item.target.toLowerCase();
      if (isCorrect) correctCount++;
      return {
        item: item.name,
        requiredColor: item.target,
        selectedColor: coloredItems[item.name],
        isCorrect
      };
    });
    
    if (onSubmit) {
      onSubmit({
        score: correctCount,
        total: items.length,
        percentage: (correctCount / items.length) * 100,
        results
      });
    }
  };
  
  // Auto-submit when all items are colored correctly
  React.useEffect(() => {
    const allColored = items.every(item => coloredItems[item.name]);
    const allCorrect = items.every(item => coloredItems[item.name] === item.target.toLowerCase());
    
    if (allColored && allCorrect && !submitted) {
      setTimeout(() => {
        setSubmitted(true);
        checkAnswers();
      }, 500);
    }
  }, [coloredItems, items, submitted]);
  
  const getShapeForItem = (itemName) => {
    const shapes = {
      'Circle': '●',
      'Square': '■',
      'Triangle': '▲',
      'Star': '★',
      'Car': '🚗',
      'Bus': '🚌',
      'Bike': '🚲',
      'Truck': '🚚'
    };
    return shapes[itemName] || itemName.charAt(0).toUpperCase();
  };

  const isComplete = items.every(item => coloredItems[item.name]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-3 text-center text-purple-600">{title}</h2>
      <p className="mb-6 text-center text-gray-600">{instructions}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, idx) => {
          const requiredColor = item.target.toLowerCase();
          const isCorrect = coloredItems[item.name] === requiredColor;
          const hasColored = coloredItems[item.name];
          
          return (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Color this {item.name.toLowerCase()} <strong className="text-purple-600">{requiredColor}</strong>
                </p>
                {item.hint && (
                  <p className="text-xs text-gray-500 mb-3">💡 {item.hint}</p>
                )}
              </div>
              
              {/* Shape or item to color */}
              <div className="flex items-center justify-center mb-4">
                <div 
                  className={`w-24 h-24 border-4 rounded-lg flex items-center justify-center text-3xl font-bold transition-all duration-200 ${
                    hasColored 
                      ? isCorrect 
                        ? 'border-green-500 shadow-lg' 
                        : 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  style={{ 
                    backgroundColor: coloredItems[item.name] || 'white',
                    color: ['yellow', 'pink', 'orange', 'white'].includes(coloredItems[item.name]) ? 'black' : 'white'
                  }}
                >
                  {getShapeForItem(item.name)}
                  {hasColored && isCorrect && (
                    <span className="absolute mt-8 text-green-500">✓</span>
                  )}
                </div>
              </div>
              
              {/* Color palette */}
              <div className="grid grid-cols-3 gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(item.name, color)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      coloredItems[item.name] === color 
                        ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-400' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Color with ${color}`}
                  />
                ))}
              </div>
              
              {/* Show status */}
              {hasColored && (
                <div className="mt-3 text-center">
                  {isCorrect ? (
                    <span className="text-green-600 font-semibold">✓ Perfect!</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Try {requiredColor} color!</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Show completion message */}
      {items.every(item => coloredItems[item.name] === item.target.toLowerCase()) && (
        <div className="mt-6 text-center bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Fantastic Job!</h3>
          <p className="text-green-700">You colored everything perfectly!</p>
        </div>
      )}
    </div>
  );
};

export default ColorActivity;
