"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  Target,
  Clock,
} from "lucide-react";

export default function WhoSaidItGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(null);
  const [showNextScreen, setShowNextScreen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const MODI_IMAGE =
    "https://c.files.bbci.co.uk/9C7C/production/_133006004_modiprofilepic.jpg";
  const RAHUL_IMAGE =
    "https://images.news18.com/ibnlive/uploads/2024/07/rahul-gandhi-2024-07-6e36e1a6fdd1de30d70696453a8e6111-16x9.png";

  const questions = [
    { quoute: "When India and Canada meet an extra 2ab comes out", answer: 0 },
    { quoute: "Poverty is just a state of mind", answer: 1 },
    {
      quoute:
        "There are clouds, its is raining, our fighter planes can escape being detected by Radar",
      answer: 0,
    },
    { quoute: "Aloo Dalo, Sona Nikalo", answer: 0 },
    {
      quoute:
        "can you dedicate your vote for the Balakot strike, for the Pulwama attack victims",
      answer: 0,
    },
  ].map((q, index) => ({
    id: index,
    quote: q.quoute,
    options: [{ name: "Narendra Modi" }, { name: "Rahul Gandhi" }],
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
      setTimer(3);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowNextScreen(false);
      setTimer(null);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowNextScreen(false);
      setTimer(null);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setTimer(null);
    setShowNextScreen(false);
    setShowResults(false);
  };

  useEffect(() => {
    let interval;
    if (timer !== null) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setShowNextScreen(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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

  // Results Screen
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-2xl bg-white rounded-xl shadow-lg p-6'>
          <div className='text-center mb-8'>
            <Trophy className='mx-auto mb-4 w-16 h-16 text-yellow-500' />
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>
              {percentage >= 60 ? "Nice bro!" : "Amazed?"}
            </h1>
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(score)}`}>
              {score}/{questions.length}
            </div>
            <p className='text-gray-600 mb-6'>You scored {percentage}%!</p>
            <button
              onClick={resetGame}
              className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto'
            >
              <RotateCcw className='w-5 h-5' />
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Next Screen (between questions)
  if (showNextScreen) {
    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const isLastQuestion = currentQuestion === questions.length - 1;

    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 text-center'>
          <div
            className={`mb-6 ${isCorrect ? "text-green-600" : "text-red-600"}`}
          >
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <span className='text-3xl font-bold'>
                {isCorrect ? "✓" : "✗"}
              </span>
            </div>
            <h2 className='text-2xl font-bold mb-2'>
              {isCorrect ? "Correct!" : "Wrong!"}
            </h2>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg mb-6'>
            <p className='text-gray-600 mb-2'>The correct answer was:</p>
            <p className='text-xl font-semibold text-gray-800'>
              {currentQ.correctAnswer}
            </p>
          </div>

          <button
            onClick={handleNext}
            className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto'
          >
            {isLastQuestion ? (
              <>
                <Trophy className='w-5 h-5' />
                View Results
              </>
            ) : (
              <>
                <ChevronRight className='w-5 h-5' />
                Next Question
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl bg-white rounded-xl shadow-lg p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Who Said It?</h1>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 text-gray-600'>
              <Target className='w-5 h-5' />
              <span className='font-semibold'>
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            {/* Timer Display */}
            {timer !== null && (
              <div className='flex items-center gap-2 text-blue-600'>
                <Clock className='w-5 h-5' />
                <span className='font-bold text-xl'>{timer}</span>
              </div>
            )}
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
            {currentQ.quote}
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
                <div className='relative mb-4'>
                  <img
                    src={index === 0 ? MODI_IMAGE : RAHUL_IMAGE}
                    alt={option.name}
                    className='w-3xl h-max object-cover'
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

        {/* Navigation */}
        <div className='flex justify-between items-center'>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentQuestion === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className='w-5 h-5' />
            Previous
          </button>

          {isAnswered && timer === null && (
            <button
              onClick={() => setShowNextScreen(true)}
              className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2'
            >
              Continue
              <ChevronRight className='w-5 h-5' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
