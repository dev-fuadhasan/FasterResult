import React from 'react';
import ResultForm from './components/ResultForm';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">SSC Result Checker</h1>
        <ResultForm />
      </div>
      <footer className="mt-8 text-gray-500 text-sm text-center">Made for fast, reliable result checking</footer>
    </div>
  );
} 