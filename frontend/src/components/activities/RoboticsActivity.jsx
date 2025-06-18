import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaRobot, FaPlay, FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown, FaStop, FaCheckCircle, FaRedo, FaHandPaper } from 'react-icons/fa';
import Confetti from 'react-confetti';
// Using standard HTML elements to avoid import issues
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// Simple fallback components
const Card = ({ children, className }) => <div className={`rounded-lg border bg-white shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>;
const Button = ({ children, onClick, disabled, className, ...props }) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 ${className}`} 
    {...props}
  >
    {children}
  </button>
);

const RoboticsActivity = ({ items = [], instructions = '', title = '', onSubmit }) => {
  const [programSequence, setProgramSequence] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [robotPosition, setRobotPosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [pathTaken, setPathTaken] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Maze layout (1 = wall, 0 = path, 2 = goal)
  const maze = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2]
  ];
  
  // Available arrow commands for the robot (only 4 directional arrows)
  const availableCommands = [
    { name: 'Up', icon: <FaArrowUp />, color: 'bg-blue-500', description: 'Move one block up' },
    { name: 'Down', icon: <FaArrowDown />, color: 'bg-green-500', description: 'Move one block down' },
    { name: 'Left', icon: <FaArrowLeft />, color: 'bg-yellow-500', description: 'Move one block left' },
    { name: 'Right', icon: <FaArrowRight />, color: 'bg-red-500', description: 'Move one block right' },
  ];
  
  const maxAttempts = 3;
  const maxCommands = 8; // Allow up to 8 commands as requested


  const handleDragEnd = (result) => {
    if (!result.destination || hasSubmitted) return;

    const { source, destination } = result;
    
    // Only allow dropping onto sequence slots
    if (!destination.droppableId.startsWith('sequence-')) return;
    
    const destinationIndex = parseInt(destination.droppableId.split('-')[1]);
    const newSequence = [...programSequence];
    
    // Extend array if needed
    while (newSequence.length <= destinationIndex) {
      newSequence.push(null);
    }
    
    // Get the dragged command
    const draggedCommand = availableCommands[source.index];
    
    // Place the command in the sequence
    newSequence[destinationIndex] = draggedCommand;
    
    setProgramSequence(newSequence);
  };

  const checkSuccess = (finalPosition = robotPosition) => {
    // Check if robot reached the goal (bottom-right corner)
    const goalReached = finalPosition.x === 4 && finalPosition.y === 4;
    const newAttempts = attempts + 1;
    
    console.log('🤖 Checking success:', {
      finalPosition,
      robotPosition,
      goalReached,
      attempts: newAttempts
    });
    
    setAttempts(newAttempts);
    setShowResult(true);
    setScore(goalReached ? 100 : 0);
    
    if (goalReached) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      console.log('🎉 Success! Robot reached the treasure!');
    } else {
      console.log('❌ Robot did not reach treasure. Position:', finalPosition);
    }
    
    // Auto-submit after 3 attempts or if successful
    const shouldAutoSubmit = newAttempts >= maxAttempts || goalReached;
    
    if (shouldAutoSubmit) {
      setHasSubmitted(true);
      
      // Submit the activity immediately
      if (onSubmit) {
        onSubmit({
          score: goalReached ? 1 : 0,
          total: 1,
          percentage: goalReached ? 100 : 0,
          success: goalReached,
          failed: !goalReached && newAttempts >= maxAttempts,
          commands: programSequence.filter(cmd => cmd !== null),
          attempted: true,
          robotPosition: finalPosition,
          attempts: newAttempts,
          maxAttempts: maxAttempts,
          autoSubmitted: shouldAutoSubmit,
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  const resetActivity = () => {
    if (hasSubmitted) return; // Don't allow reset after submission
    
    setProgramSequence([]);
    setShowResult(false);
    setScore(0);
    setCurrentStep(0);
    setRobotPosition({ x: 0, y: 0 });
    setPathTaken([]);
  };

  const runRobotSequence = async () => {
    setIsAnimating(true);
    setRobotPosition({ x: 0, y: 0 });
    setPathTaken([{ x: 0, y: 0 }]);
    
    let currentPos = { x: 0, y: 0 };
    const path = [{ x: 0, y: 0 }];
    
    // Execute the programmed sequence
    for (let i = 0; i < programSequence.length; i++) {
      const command = programSequence[i];
      if (!command) continue;
      
      setCurrentStep(i);
      
      let newPos = { ...currentPos };
      
      // Direct movement based on arrow commands
      if (command.name === 'Up') {
        newPos.y = Math.max(0, currentPos.y - 1);
      } else if (command.name === 'Down') {
        newPos.y = Math.min(4, currentPos.y + 1);
      } else if (command.name === 'Left') {
        newPos.x = Math.max(0, currentPos.x - 1);
      } else if (command.name === 'Right') {
        newPos.x = Math.min(4, currentPos.x + 1);
      }
      
      // Check if new position is valid (not a wall)
      if (maze[newPos.y][newPos.x] !== 1) {
        currentPos = newPos;
        path.push({ ...currentPos });
        setRobotPosition({ ...currentPos });
        setPathTaken([...path]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    setIsAnimating(false);
    
    // Wait a moment for final position to update, then check success
    setTimeout(() => {
      checkSuccess(currentPos); // Pass the final position
    }, 100);
  };

  // Initialize with starting position
  React.useEffect(() => {
    setRobotPosition({ x: 0, y: 0 });
  }, []);
  
  // Disable drag and drop when submitted
  const handleDragStart = (e) => {
    if (hasSubmitted) {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FaRobot className="text-2xl" />
            {title || 'Robotics Challenge'}
          </CardTitle>
          {instructions && (
            <p className="text-purple-100 mt-2">{instructions}</p>
          )}
        </CardHeader>
        
        <CardContent className="p-3 sm:p-6">
          {/* Robot Grid Visualization */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">🤖 Robot Maze Adventure</h3>
            <p className="text-center text-gray-600 mb-4">Help the robot reach the treasure! Start at 🏁 and reach 🏆</p>
            <div className="text-center mb-4">
              <div className="flex flex-col items-center gap-1">
                <p className="text-sm text-blue-600 font-medium">Attempts: {attempts}/{maxAttempts}</p>
                <p className="text-xs text-gray-500">Robot position: ({robotPosition.x}, {robotPosition.y}) | Goal: (4, 4)</p>
              </div>
              {hasSubmitted && (
                <p className="text-sm text-green-600 font-medium">✅ Activity Completed!</p>
              )}
            </div>
            
            <div className="grid grid-cols-5 gap-1 w-fit mx-auto mb-4 p-2 sm:p-4 bg-gray-800 rounded-lg">
              {Array.from({ length: 25 }, (_, i) => {
                const row = Math.floor(i / 5);
                const col = i % 5;
                const isRobotHere = robotPosition.x === col && robotPosition.y === row;
                const isStart = col === 0 && row === 0;
                const isGoal = col === 4 && row === 4;
                const isWall = maze[row][col] === 1;
                const isPath = pathTaken.some(p => p.x === col && p.y === row);
                
                return (
                  <div
                    key={i}
                    className={`w-10 h-10 sm:w-12 sm:h-12 border flex items-center justify-center text-sm sm:text-xl font-bold relative ${
                      isWall
                        ? 'bg-gray-900 border-gray-700'
                        : isRobotHere
                        ? 'bg-blue-400 border-blue-600 animate-pulse'
                        : isGoal
                        ? 'bg-yellow-400 border-yellow-600'
                        : isStart
                        ? 'bg-green-400 border-green-600'
                        : isPath
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white border-gray-400'
                    }`}
                  >
                    {isWall && '🧱'}
                    {isRobotHere && (
                      <div className="text-lg sm:text-2xl animate-bounce">
                        <span>🤖</span>
                      </div>
                    )}
                    {isGoal && !isRobotHere && '🏆'}
                    {isStart && !isRobotHere && !isPath && '🏁'}
                    {isPath && !isRobotHere && !isStart && !isGoal && '👣'}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-2 mb-4">
              <Button
                onClick={runRobotSequence}
                disabled={isAnimating || programSequence.filter(cmd => cmd !== null).length === 0 || hasSubmitted}
                className={`${hasSubmitted ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
              >
                <FaPlay className="mr-2" />
                {isAnimating ? 'Running...' : hasSubmitted ? 'Submitted' : 'Run Program'}
              </Button>
              <Button 
                onClick={resetActivity} 
                disabled={hasSubmitted}
                className={`${hasSubmitted ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600'}`}
              >
                Reset
              </Button>
            </div>
          </div>

          {!showResult ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Available Commands */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🔧 Arrow Commands</h3>
                  <p className="text-sm text-gray-600 mb-3">Drag arrows to move the robot:</p>
                  <Droppable droppableId="commands" isDropDisabled>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3"
                      >
                        {availableCommands.map((command, index) => (
                          <Draggable key={`command-${index}`} draggableId={`command-${index}`} index={index} isDragDisabled={hasSubmitted}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 sm:p-4 rounded-lg border-2 cursor-move transition-all ${
                                  snapshot.isDragging
                                    ? 'shadow-lg scale-105 rotate-3'
                                    : 'hover:shadow-md hover:scale-102'
                                } ${command.color} text-white font-bold ${
                                  hasSubmitted ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <div className="flex items-center justify-center">
                                  <span className="text-2xl sm:text-4xl">{command.icon}</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Program Sequence */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">🎯 Program Sequence</h3>
                  <p className="text-sm text-gray-600 mb-3">Drop arrows here in order:</p>
                  <div className="space-y-2">
                    {Array.from({ length: maxCommands }, (_, index) => (
                      <Droppable key={`sequence-${index}`} droppableId={`sequence-${index}`}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`p-2 sm:p-3 min-h-[50px] sm:min-h-[60px] border-2 border-dashed rounded-lg flex items-center ${
                              snapshot.isDraggingOver
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-300 bg-gray-50'
                            } ${
                              currentStep === index && isAnimating
                                ? 'ring-2 ring-yellow-500 bg-yellow-50 animate-pulse'
                                : ''
                            }`}
                          >
                            {programSequence[index] ? (
                              <div className="flex items-center gap-3 w-full">
                                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  {index + 1}
                                </span>
                                <div className={`flex items-center justify-center ${programSequence[index].color} text-white px-2 sm:px-3 py-1 rounded-lg flex-1`}>
                                  <span className="text-lg sm:text-2xl">{programSequence[index].icon}</span>
                                </div>
                                {!hasSubmitted && (
                                  <button
                                    onClick={() => {
                                      const newSequence = [...programSequence];
                                      newSequence[index] = null;
                                      setProgramSequence(newSequence);
                                    }}
                                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 flex items-center gap-2">
                                <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  {index + 1}
                                </span>
                                Drop arrow here
                              </span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </div>
              </div>
            </DragDropContext>
          ) : (
            /* Results */
            <div className="text-center">
              <div className={`text-6xl mb-4 ${score === 100 ? 'animate-bounce' : ''}`}>
                {score === 100 ? '🎉' : attempts >= maxAttempts ? '😔' : '🤔'}
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {score === 100 
                  ? 'Mission Accomplished!' 
                  : attempts >= maxAttempts 
                  ? 'All Attempts Used!' 
                  : `Attempt ${attempts}/${maxAttempts}`}
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                {score === 100
                  ? "Fantastic! You reached the treasure! 🏆"
                  : attempts >= maxAttempts
                  ? "Don't worry! Your teacher will review your attempts. 📝"
                  : "The robot didn't reach the treasure. Try again! 🤖"}
              </p>
              
              <div className="flex justify-center gap-4">
                {!hasSubmitted && attempts < maxAttempts && (
                  <Button onClick={resetActivity} className="bg-blue-600 hover:bg-blue-700">
                    <FaRobot className="mr-2" />
                    Try Again
                  </Button>
                )}
                {hasSubmitted && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">✅ Activity Completed!</p>
                    <p className="text-sm text-green-600 mt-1">Now use the Submit button to send your homework to the teacher.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Auto-submit when all commands are programmed */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoboticsActivity;

