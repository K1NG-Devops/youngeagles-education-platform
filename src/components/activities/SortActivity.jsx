import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaSort, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';

export default function SortActivity({ items = [], instructions = '', title = '', onSubmit, disabled = false }) {
  const [categories, setCategories] = useState({});
  const [availableItems, setAvailableItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Extract unique categories from items
  const uniqueCategories = [...new Set(items.map(item => item.target))];

  useEffect(() => {
    if (items.length > 0) {
      // Initialize categories with empty arrays
      const initialCategories = {};
      uniqueCategories.forEach(category => {
        initialCategories[category] = [];
      });
      setCategories(initialCategories);
      
      // Shuffle available items for challenge
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setAvailableItems(shuffled.map(item => ({ ...item, id: `item-${item.name}` })));
    }
  }, [items]);

  const handleDragEnd = (result) => {
    if (disabled || submitted) return;
    
    const { source, destination } = result;
    
    if (!destination) return;

    const sourceType = source.droppableId;
    const destinationType = destination.droppableId;
    
    setAttempts(prev => prev + 1);
    
    // Moving from available items to categories
    if (sourceType === 'available-items' && destinationType.startsWith('category-')) {
      const draggedItemIndex = source.index;
      const draggedItem = availableItems[draggedItemIndex];
      const targetCategory = destinationType.replace('category-', '');
      
      // Remove from available items
      const newAvailableItems = availableItems.filter((_, index) => index !== draggedItemIndex);
      setAvailableItems(newAvailableItems);
      
      // Add to category
      const newCategories = { ...categories };
      newCategories[targetCategory] = [...newCategories[targetCategory], draggedItem];
      setCategories(newCategories);
      
    } else if (sourceType.startsWith('category-') && destinationType === 'available-items') {
      // Moving from category back to available items
      const sourceCategory = sourceType.replace('category-', '');
      const draggedItemIndex = source.index;
      const draggedItem = categories[sourceCategory][draggedItemIndex];
      
      // Remove from category
      const newCategories = { ...categories };
      newCategories[sourceCategory] = newCategories[sourceCategory].filter((_, index) => index !== draggedItemIndex);
      setCategories(newCategories);
      
      // Add back to available items
      setAvailableItems([...availableItems, draggedItem]);
      
    } else if (sourceType.startsWith('category-') && destinationType.startsWith('category-')) {
      // Moving between categories
      const sourceCategory = sourceType.replace('category-', '');
      const targetCategory = destinationType.replace('category-', '');
      
      if (sourceCategory !== targetCategory) {
        const draggedItemIndex = source.index;
        const draggedItem = categories[sourceCategory][draggedItemIndex];
        
        const newCategories = { ...categories };
        
        // Remove from source
        newCategories[sourceCategory] = newCategories[sourceCategory].filter((_, index) => index !== draggedItemIndex);
        
        // Add to destination
        newCategories[targetCategory] = [...newCategories[targetCategory], draggedItem];
        
        setCategories(newCategories);
      }
    }
  };

  const checkAnswers = () => {
    let correctCount = 0;
    const results = [];
    
    items.forEach(item => {
      // Find which category this item was placed in
      let placedInCategory = null;
      Object.keys(categories).forEach(category => {
        if (categories[category].some(catItem => catItem.name === item.name)) {
          placedInCategory = category;
        }
      });
      
      const isCorrect = placedInCategory === item.target;
      if (isCorrect) correctCount++;
      
      results.push({
        item: item.name,
        correctCategory: item.target,
        placedInCategory,
        isCorrect
      });
    });
    
    setScore(correctCount);
    setSubmitted(true);
    setShowResults(true);
    
    if (correctCount === items.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    if (onSubmit) {
      onSubmit({
        score: correctCount,
        total: items.length,
        percentage: (correctCount / items.length) * 100,
        attempts,
        results,
        categories
      });
    }
  };

  const resetActivity = () => {
    // Reset everything
    const initialCategories = {};
    uniqueCategories.forEach(category => {
      initialCategories[category] = [];
    });
    setCategories(initialCategories);
    
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setAvailableItems(shuffled.map(item => ({ ...item, id: `item-${item.name}` })));
    
    setSubmitted(false);
    setShowResults(false);
    setScore(0);
    setAttempts(0);
  };

  const allItemsSorted = availableItems.length === 0;

  if (!items || items.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <FaSort className="mx-auto text-6xl text-gray-400 mb-4" />
          <p className="text-gray-500">No sorting items available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FaSort className="text-2xl" />
            {title || 'Sorting Challenge'}
          </CardTitle>
          {instructions && (
            <p className="text-green-100 mt-2">{instructions}</p>
          )}
        </CardHeader>
        
        <CardContent className="p-6">
          {!showResults ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="space-y-6">
                {/* Available Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">🎯 Items to Sort</h3>
                  <Droppable droppableId="available-items" direction="horizontal">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[100px] p-4 border-2 border-dashed rounded-lg flex flex-wrap gap-3 justify-center ${
                          snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        {availableItems.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded-lg border-2 cursor-move transition-all min-w-[120px] text-center ${
                                  snapshot.isDragging
                                    ? 'shadow-lg scale-105 border-green-500 bg-green-50'
                                    : 'border-gray-300 bg-white hover:border-green-400 hover:shadow-md'
                                }`}
                              >
                                <div className="text-2xl mb-1">
                                  {getItemEmoji(item.name)}
                                </div>
                                <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                                {item.hint && (
                                  <p className="text-xs text-gray-600 mt-1">💡 {item.hint}</p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {availableItems.length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            🎉 All items have been sorted!
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Category Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uniqueCategories.map((category, categoryIndex) => (
                    <div key={category} className="bg-purple-50 rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-3 text-center text-purple-800 flex items-center justify-center gap-2">
                        {getCategoryEmoji(category)} {category}
                      </h4>
                      
                      <Droppable droppableId={`category-${category}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`min-h-[150px] p-3 border-2 border-dashed rounded-lg transition-all ${
                              snapshot.isDraggingOver
                                ? 'border-purple-500 bg-purple-100'
                                : 'border-purple-300 bg-white'
                            }`}
                          >
                            <div className="space-y-2">
                              {categories[category]?.map((item, index) => {
                                const isCorrect = item.target === category;
                                return (
                                  <Draggable key={`${item.id}-in-${category}`} draggableId={`${item.id}-in-${category}`} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`p-2 rounded border-2 cursor-move transition-all ${
                                          snapshot.isDragging
                                            ? 'shadow-lg scale-105'
                                            : 'hover:shadow-md'
                                        } ${
                                          submitted
                                            ? isCorrect
                                              ? 'border-green-500 bg-green-50'
                                              : 'border-red-500 bg-red-50'
                                            : 'border-gray-300 bg-white'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">{getItemEmoji(item.name)}</span>
                                          <span className="font-medium text-sm">{item.name}</span>
                                          {submitted && (
                                            isCorrect ? (
                                              <FaCheckCircle className="text-green-500 ml-auto" />
                                            ) : (
                                              <span className="text-red-500 ml-auto">❌</span>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                              
                              {categories[category]?.length === 0 && (
                                <div className="text-center text-gray-500 py-8 text-sm">
                                  Drop {category.toLowerCase()} items here
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </div>
            </DragDropContext>
          ) : (
            /* Results Section */
            <div className="text-center">
              <div className={`text-6xl mb-4 ${score === items.length ? 'animate-bounce' : ''}`}>
                {score === items.length ? '🎉' : score > items.length / 2 ? '😊' : '🤔'}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                You sorted {score} out of {items.length} items correctly!
              </h3>
              
              <div className="flex justify-center items-center gap-2 mb-4">
                {Array.from({ length: items.length }, (_, i) => (
                  <FaStar 
                    key={i} 
                    className={`text-2xl ${
                      i < score ? 'text-yellow-500' : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(score / items.length) * 100}%` }}
                ></div>
              </div>
              
              <p className="text-lg text-gray-600 mb-6">
                {score === items.length
                  ? "Perfect! You're a sorting superstar! 🏆"
                  : score > items.length / 2
                  ? "Great job! You're really good at sorting! 🌟"
                  : "Good effort! Let's practice sorting some more! 💪"}
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                You made {attempts} moves to complete this activity.
              </p>
              
              {/* Show results breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg mb-3 text-gray-800">📚 Let's Review!</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {items.map((item, idx) => {
                    // Find which category this item was placed in
                    let placedInCategory = 'Not sorted';
                    Object.keys(categories).forEach(category => {
                      if (categories[category].some(catItem => catItem.name === item.name)) {
                        placedInCategory = category;
                      }
                    });
                    
                    const isCorrect = placedInCategory === item.target;
                    
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded bg-white">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium flex items-center gap-2">
                            {getItemEmoji(item.name)} {item.name} 
                            <FaArrowRight className="text-gray-400" /> 
                            {getCategoryEmoji(item.target)} {item.target}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-red-600">
                              You put it in: {placedInCategory}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <Button 
                onClick={resetActivity}
                className="bg-green-600 hover:bg-green-700"
              >
                <FaSort className="mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {!showResults && allItemsSorted && (
            <div className="mt-6 text-center">
              <Button
                onClick={checkAnswers}
                className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
              >
                <FaCheckCircle className="mr-2" />
                Check My Sorting
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions for emojis
function getItemEmoji(itemName) {
  const emojiMap = {
    'Fish': '🐟',
    'Dog': '🐶',
    'Frog': '🐸',
    'Bird': '🐦',
    'Apple': '🍎',
    'Candy': '🍭',
    'Carrot': '🥕',
    'Cookie': '🍪',
    'Car': '🚗',
    'Bus': '🚌',
    'Bike': '🚲',
    'Truck': '🚚'
  };
  return emojiMap[itemName] || '💬';
}

function getCategoryEmoji(category) {
  const emojiMap = {
    'Water': '🌊',
    'Land': '🌳',
    'Healthy': '🍏',
    'Treat': '🍭',
    'Animals': '🐾',
    'Food': '🍽️',
    'Vehicles': '🚗'
  };
  return emojiMap[category] || '📋';
}
