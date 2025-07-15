import React, { useState } from 'react';

export default function PuzzleActivity({ items = [], instructions = '', title = '', onSubmit, disabled = false }) {
  const [order, setOrder] = useState(items);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDrop = (idx) => {
    if (draggedIdx === null || disabled) return;
    const newOrder = [...order];
    const [removed] = newOrder.splice(draggedIdx, 1);
    newOrder.splice(idx, 0, removed);
    setOrder(newOrder);
    setDraggedIdx(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (onSubmit) onSubmit(order);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 text-center">{title}</h2>
      <p className="mb-4 text-center">{instructions}</p>
      <ul className="w-full space-y-2">
        {order.map((piece, idx) => (
          <li
            key={piece.id || piece.name || idx}
            draggable={!disabled}
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className={`p-3 bg-purple-100 rounded shadow border cursor-move text-center font-medium ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {piece.display || piece.name || piece}
          </li>
        ))}
      </ul>
      <button
        className="mt-6 bg-purple-500 text-white px-6 py-2 rounded font-bold disabled:opacity-50"
        onClick={handleSubmit}
        disabled={disabled || submitted}
      >
        Submit
      </button>
      {submitted && <div className="mt-4 text-green-600 font-bold">Puzzle submitted! 🎉</div>}
    </div>
  );
} 