import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaQuestion, FaCheckCircle, FaTimes } from 'react-icons/fa';
import Confetti from 'react-confetti';

export default function QuizActivity({ items = [], instructions = '', title = '', onSubmit, disabled = false }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Convert teacher activity builder format to quiz format
  const quizItems = items.map(item => ({
    question: item.name,
    correctAnswer: item.target,
    hint: item.hint,
    // Generate simple options for young children
    options: generateOptions(item)
  }));

  function generateOptions(item) {
    const correct = item.target;
    const commonWrongAnswers = {
      'Dog': ['Cat', 'Bird', 'Fish'],
      'Cat': ['Dog', 'Mouse', 'Bird'],
      'Woof': ['Meow', 'Moo', 'Quack'],
      'Meow': ['Woof', 'Moo', 'Quack'],
      'Moo': ['Woof', 'Meow', 'Quack'],
      'Quack': ['Woof', 'Meow', 'Moo'],
      '4': ['3', '5', '6'],
      'Next': ['Before', 'Same', 'Never'],
      'Start': ['End', 'Middle', 'Stop'],
      'Go': ['Stop', 'Wait', 'Sleep'],
      'Stop': ['Go', 'Run', 'Jump'],
      'Turn': ['Straight', 'Stop', 'Go']
    };

    let options = [correct];
    const wrongOptions = commonWrongAnswers[correct] || ['Option A', 'Option B', 'Option C'];
    options = options.concat(wrongOptions.slice(0, 3));
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  }

  const handleChange = (idx, value) => {
    if (disabled || submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    
    // Calculate score
    let correctCount = 0;
    quizItems.forEach((item, idx) => {
      if (answers[idx] === item.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    
    if (correctCount === quizItems.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    if (onSubmit) {
      onSubmit({
        score: correctCount,
        total: quizItems.length,
        percentage: (correctCount / quizItems.length) * 100,
        answers
      });
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
    setScore(0);
  };

  if (!items || items.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <FaQuestion className="mx-auto text-6xl text-gray-400 mb-4" />
          <p className="text-gray-500">No quiz questions available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FaQuestion className="text-2xl" />
            {title || 'Fun Quiz Time!'}
          </CardTitle>
          {instructions && (
            <p className="text-orange-100 mt-2">{instructions}</p>
          )}
        </CardHeader>
        
        <CardContent className="p-6">
          {!showResults ? (
            <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
              {quizItems.map((q, idx) => (
                <div key={idx} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{q.question}</h3>
                      {q.hint && (
                        <p className="text-sm text-gray-600 mb-3">💡 Hint: {q.hint}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, oidx) => (
                      <label 
                        key={oidx} 
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          answers[idx] === opt
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          value={opt}
                          checked={answers[idx] === opt}
                          onChange={() => handleChange(idx, opt)}
                          disabled={disabled}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="font-medium text-gray-800">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Button
                  type="submit"
                  disabled={disabled || Object.keys(answers).length !== quizItems.length}
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
                >
                  <FaCheckCircle className="mr-2" />
                  Submit My Answers
                </Button>
              </div>
            </form>
          ) : (
            /* Results Section */
            <div className="text-center">
              <div className={`text-6xl mb-4 ${score === quizItems.length ? 'animate-bounce' : ''}`}>
                {score === quizItems.length ? '🎉' : score > quizItems.length / 2 ? '😊' : '😅'}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">
                You got {score} out of {quizItems.length} correct!
              </h3>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${(score / quizItems.length) * 100}%` }}
                ></div>
              </div>
              
              <p className="text-lg text-gray-600 mb-6">
                {score === quizItems.length
                  ? 'Perfect! You\'re a quiz champion! 🏆'
                  : score > quizItems.length / 2
                  ? 'Great job! You\'re doing awesome! 🌟'
                  : 'Good try! Let\'s practice some more! 💪'}
              </p>
              
              {/* Show correct answers for learning */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-bold text-lg mb-3 text-gray-800">📚 Let's Learn Together!</h4>
                <div className="space-y-3 text-left">
                  {quizItems.map((q, idx) => {
                    const userAnswer = answers[idx];
                    const isCorrect = userAnswer === q.correctAnswer;
                    
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? <FaCheckCircle className="text-xs" /> : <FaTimes className="text-xs" />}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{q.question}</p>
                          <p className="text-sm text-gray-600">
                            Your answer: <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>{userAnswer}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600">
                              Correct answer: {q.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <Button 
                onClick={resetQuiz}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
