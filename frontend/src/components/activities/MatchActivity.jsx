import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPuzzlePiece, FaCheckCircle, FaStar, FaHeart } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';

const MatchActivity = ({ items = [], instructions = '', title = '', onSubmit, disabled = false }) => {
  const [matches, setMatches] = useState({});
  const [availableItems, setAvailableItems] = useState([]);
  const [targets, setTargets] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (items.length > 0) {
      // Set up available items and targets
      setAvailableItems(items.map(item => ({ ...item, id: `item-${item.name}` })));
      setTargets(items.map(item => ({
        name: item.target,
        matchedWith: null,
        correctMatch: item.name,
        id: `target-${item.target}`
      })));
    }
  }, [items]);

  const handleDragEnd = (result) => {
    if (disabled || submitted) return;
    
    const { source, destination } = result;
    
    if (!destination) return;

    const sourceType = source.droppableId;
    const destinationType = destination.droppableId;
    
    // Only allow dropping items onto targets
    if (sourceType === 'available-items' && destinationType.startsWith('target-')) {
      const draggedItemIndex = source.index;
      const draggedItem = availableItems[draggedItemIndex];
      const targetIndex = parseInt(destination.droppableId.split('-')[1]);
      
      // Update matches
      const newMatches = { ...matches };
      
      // Remove item from previous match if exists
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === draggedItem.name) {
          delete newMatches[key];
        }
      });
      
      // Add new match
      newMatches[targets[targetIndex].name] = draggedItem.name;
      setMatches(newMatches);
      setAttempts(prev => prev + 1);
      
      // Check if all matches are made
      if (Object.keys(newMatches).length === items.length) {
        setTimeout(() => checkAnswers(newMatches), 500);
      }
    } else if (sourceType.startsWith('target-') && destinationType === 'available-items') {
      // Remove match when dragging back to available items
      const targetName = Object.keys(matches).find(target => 
        matches[target] === result.draggableId.split('-')[1]
      );
      if (targetName) {
        const newMatches = { ...matches };
        delete newMatches[targetName];
        setMatches(newMatches);
      }
    }
  };

  const checkAnswers = (currentMatches = matches) => {
    let correctCount = 0;
    const results = [];
    
    items.forEach(item => {
      const userMatch = currentMatches[item.target];
      const isCorrect = userMatch === item.name;
      if (isCorrect) correctCount++;
      
      results.push({
        item: item.name,
        target: item.target,
        userAnswer: userMatch,
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
        results
      });
    }
  };

  const resetActivity = () => {
    setMatches({});
    setSubmitted(false);
    setShowResults(false);
    setScore(0);
    setAttempts(0);
  };

  const getMatchedItem = (targetName) => {
    const matchedItemName = matches[targetName];
    return availableItems.find(item => item.name === matchedItemName);
  };

  const getAvailableItemsForDragging = () => {
    return availableItems.filter(item => 
      !Object.values(matches).includes(item.name)
    );
  };

  if (!items || items.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <FaPuzzlePiece className="mx-auto text-6xl text-gray-400 mb-4" />
          <p className="text-gray-500">No matching items available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <Card>
        <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FaPuzzlePiece className="text-2xl" />
            {title || 'Matching Game'}
          </CardTitle>
          {instructions && (
            <p className="text-pink-100 mt-2">{instructions}</p>
          )}
        </CardHeader>
        
        <CardContent className="p-6">
          {!showResults ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Available Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">🎯 Drag These Items</h3>
                  <Droppable droppableId="available-items">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[300px] p-4 border-2 border-dashed rounded-lg ${
                          snapshot.isDraggingOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="space-y-3">
                          {getAvailableItemsForDragging().map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 rounded-lg border-2 cursor-move transition-all ${
                                    snapshot.isDragging
                                      ? 'shadow-lg scale-105 border-pink-500 bg-pink-50'
                                      : 'border-gray-300 bg-white hover:border-pink-400 hover:shadow-md'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">🎪</span>
                                    <span className="font-medium text-gray-800">{item.name}</span>
                                  </div>
                                  {item.hint && (
                                    <p className="text-sm text-gray-600 mt-1">💡 {item.hint}</p>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                        
                        {getAvailableItemsForDragging().length === 0 && (
                          <div className="text-center text-gray-500 mt-8">
                            🎉 All items have been matched!
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Target Areas */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-center">🎯 Match With These</h3>
                  <div className="space-y-3">
                    {targets.map((target, index) => {
                      const matchedItem = getMatchedItem(target.name);
                      const isCorrectMatch = matchedItem && matchedItem.name === target.correctMatch;
                      
                      return (
                        <Droppable key={target.id} droppableId={`target-${index}`}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`p-4 min-h-[80px] border-2 border-dashed rounded-lg transition-all ${
                                snapshot.isDraggingOver
                                  ? 'border-green-500 bg-green-50'
                                  : matchedItem
                                  ? isCorrectMatch
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-red-500 bg-red-50'
                                  : 'border-purple-300 bg-purple-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">
                                    {typeof target.name === 'string' && target.name.match(/[🔴🔵🟢🟡⭐🎯🍎🍌🍇🍊]/) 
                                      ? target.name 
                                      : '🎯'
                                    }
                                  </span>
                                  <span className="font-medium text-gray-800">{target.name}</span>
                                </div>
                                
                                {matchedItem && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">
                                      {matchedItem.name}
                                    </span>
                                    {submitted && (
                                      isCorrectMatch ? (
                                        <FaCheckCircle className="text-green-500" />
                                      ) : (
                                        <span className="text-red-500">❌</span>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {!matchedItem && (
                                <p className="text-sm text-gray-500 mt-2">
                                  Drop an item here
                                </p>
                              )}
                              
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      );
                    })}
                  </div>
                </div>
              </div>
            </DragDropContext>
          ) : (
            /* Results Section */
            <div className="text-center">
              <div className={`text-6xl mb-4 ${score === items.length ? 'animate-bounce' : ''}`}>
                {score === items.length ? '🎉' : score > items.length / 2 ? '😊' : '🤗'}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                You matched {score} out of {items.length} correctly!
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
                  className="bg-gradient-to-r from-pink-400 to-purple-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(score / items.length) * 100}%` }}
                ></div>
              </div>
              
              <p className="text-lg text-gray-600 mb-6">
                {score === items.length
                  ? "Perfect! You're a matching master! 🏆"
                  : score > items.length / 2
                  ? "Great job! You're getting really good at this! 🌟"
                  : "Good effort! Let's try again and learn together! 💪"}
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                You made {attempts} moves to complete this activity.
              </p>
              
              {/* Show results breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg mb-3 text-gray-800">📚 Let's Review!</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {items.map((item, idx) => {
                    const userMatch = matches[item.target];
                    const isCorrect = userMatch === item.name;
                    
                    return (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded bg-white">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{item.name} → {item.target}</p>
                          {!isCorrect && userMatch && (
                            <p className="text-sm text-red-600">You matched: {userMatch}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <Button 
                onClick={resetActivity}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <FaHeart className="mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {!showResults && Object.keys(matches).length === items.length && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => checkAnswers()}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                <FaCheckCircle className="mr-2" />
                Check My Matches
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchActivity;

