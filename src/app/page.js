"use client";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  Target,
} from "lucide-react";

export default function WhoSaidItGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const MODI_IMAGE = "https://c.files.bbci.co.uk/9C7C/production/_133006004_modiprofilepic.jpg";
  const RAHUL_IMAGE =
"https://images.news18.com/ibnlive/uploads/2024/07/rahul-gandhi-2024-07-6e36e1a6fdd1de30d70696453a8e6111-16x9.png";

  const questions = [{"quoute": "Who is good?", "answer": 0}].map((q, index) => ({
    id: index,
    quote: q.quoute,
    options: [
      { name: "Narendra Modi" },
      { name: "Rahul Gandhi" },
    ],
    correctAnswer: q.answer === 0 ? "Narendra Modi" : "Rahul Gandhi",
  }));

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;
  const selectedAnswer = selectedAnswers[currentQ.id];

  const handleAnswerClick = (answer) => {
    if (!isAnswered) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQ.id]: answer,
      }));
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          setShowResults(true);
        }
      }, 5000);
    }
  };

  const calculateScore = () => {
    return Object.entries(selectedAnswers).reduce(
      (score, [questionId, answer]) => {
        const question = questions.find((q) => q.id === parseInt(questionId));
        return score + (answer === question?.correctAnswer ? 1 : 0);
      },
      0
    );
  };

  const getScoreColor = (score) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className='min-h-screen bg-white flex items-center justify-center p-4'>
        <div className='w-full max-w-2xl bg-white rounded-xl shadow-lg p-6'>
          <div className='text-center mb-8'>
            <Trophy className='mx-auto mb-4 w-16 h-16 text-yellow-500' />
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>
              { percentage >= 60 ? "Nice bro!" : "Amazed?"}
            </h1>
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(score)}`}>
              {score}/{questions.length}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-4'>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Who Said It?</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Target className="w-5 h-5" />
          <span className="font-semibold">{currentQuestion + 1}/{questions.length}</span>
        </div>
      </div>


      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex justify-between text-sm text-gray-600 mb-2'>
          <span>Progress</span>
          <span>
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-blue-500 h-2 rounded-full transition-all duration-300'
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Quote */}
      <div className='bg-blue-50 p-6 rounded-lg mb-8'>
        <p className='text-lg italic text-gray-800 leading-relaxed text-center'>
          "{currentQ.quote}"
        </p>
      </div>

      {/* Picture Options */}
      <div className='grid grid-cols-2 gap-6 mb-8'>
        {currentQ.options.map((option, index) => {
          let containerClass =
            "flex flex-col items-center p-6 border-3 rounded-xl transition-all duration-200 cursor-pointer ";

          if (!isAnswered) {
            containerClass +=
              "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transform hover:scale-105";
          } else {
            if (option.name === currentQ.correctAnswer) {
              containerClass += "border-green-400 bg-green-100 shadow-lg";
            } else if (option.name === selectedAnswer) {
              containerClass += "border-red-400 bg-red-100 shadow-lg";
            } else {
              containerClass += "border-gray-200 bg-gray-50 opacity-70";
            }
          }

          return (
            <div
              key={index}
              onClick={() => handleAnswerClick(option.name)}
              className={containerClass}
            >
              <div className='relative'>
                <img
                  src={index == 0 ? MODI_IMAGE : RAHUL_IMAGE}
                  alt={option.name}
                  className='w-200 h-100 object-cover'
                />
                {isAnswered && option.name === currentQ.correctAnswer && (
                  <div className='absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                    <span className='text-white font-bold text-sm'>✓</span>
                  </div>
                )}
                {isAnswered &&
                  option.name === selectedAnswer &&
                  option.name !== currentQ.correctAnswer && (
                    <div className='absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>✗</span>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
