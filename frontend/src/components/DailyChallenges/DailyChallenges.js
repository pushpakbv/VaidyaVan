import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import CoinDisplay from '../common/CoinDisplay';

const DailyChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});
    const [results, setResults] = useState({});
    const [userCoins, setUserCoins] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [submitError, setSubmitError] = useState('');
    const [nextQuizTime, setNextQuizTime] = useState(null);
    const [quizLocked, setQuizLocked] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const article = `
        <h1 class="text-3xl font-bold mb-6">Healing with Herbal Plants: A Natural Approach to Health</h1>
        
        <p class="mb-4">
            Herbal plants have been used for centuries in traditional medicine, offering natural solutions to various health issues. 
            Understanding these powerful plants can help you make informed decisions about your health and well-being.
        </p>

        <h2 class="text-2xl font-semibold mb-4">Immune System Support</h2>
        <p class="mb-4">
            Several herbs are known for their immune-boosting properties. Elderberry is particularly effective during cold and flu season, 
            helping to reduce both the duration and severity of symptoms. Echinacea is another powerful immune booster, commonly used to 
            fight off respiratory infections.
        </p>

        <h2 class="text-2xl font-semibold mb-4">Stress Relief and Mental Wellness</h2>
        <p class="mb-4">
            For those seeking natural stress relief, Ashwagandha is a powerful herb known for reducing stress and lowering cortisol levels. 
            It's particularly beneficial for mental health, helping with anxiety and improving focus. Lavender is another calming herb, 
            widely used for stress relief, anxiety reduction, and improving sleep quality.
        </p>

        <h2 class="text-2xl font-semibold mb-4">Heart and Circulation</h2>
        <p class="mb-4">
            Garlic stands out for its impressive cardiovascular benefits. It's known for its antimicrobial properties and ability to lower 
            blood pressure. Regular consumption may help prevent infections and improve heart health. Ginseng also supports circulation 
            while providing energy and reducing chronic fatigue.
        </p>

        <h2 class="text-2xl font-semibold mb-4">Digestive Health</h2>
        <p class="mb-4">
            Ginger and peppermint are excellent herbs for digestive health. Ginger can help with nausea, morning sickness, and motion 
            sickness, while also reducing inflammation throughout the body. Peppermint is particularly effective for relieving indigestion, 
            bloating, and other digestive discomforts.
        </p>
    `;

    const startQuiz = () => {
        setShowQuiz(true);
        setTimeLeft(600); // Reset timer to 10 minutes
    };

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Check for token
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }

                // Ensure token is properly formatted
                if (!token.startsWith('Bearer ')) {
                    localStorage.setItem('token', `Bearer ${token}`);
                }

                const response = await axiosInstance.get('/challenges');
                setChallenges(response.data);
                setUserCoins(user?.coins || 0);
            } catch (error) {
                console.error('Error fetching challenges:', error);
                if (error.response?.status === 403) {
                    setQuizLocked(true);
                    setNextQuizTime(new Date(error.response.data.nextQuizTime));
                    setError(error.response.data.message);
                } else if (error.response?.status === 401) {
                    console.log('Auth error, redirecting to login');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError(error.response?.data?.message || 'Failed to load challenges. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, [navigate, user]);

    const areAllQuestionsAnswered = () => {
        return challenges.length > 0 && challenges.every(challenge => answers[challenge._id]);
    };

    const handleOptionSelect = (challengeId, option) => {
        setAnswers({
            ...answers,
            [challengeId]: option
        });
        setSubmitError(''); // Clear any previous submit error when an option is selected
    };

    const validateAnswers = () => {
        const unansweredQuestions = challenges.filter(challenge => !answers[challenge._id]);
        if (unansweredQuestions.length > 0) {
            setSubmitError(`Please answer all questions before submitting. ${unansweredQuestions.length} question${unansweredQuestions.length > 1 ? 's' : ''} remaining.`);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateAnswers()) {
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError('');
            
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const answersArray = Object.entries(answers).map(([challengeId, answer]) => ({
                challengeId,
                answer: answer.toString()
            }));

            const response = await axiosInstance.post('/challenges/submit', { answers: answersArray });
            
            setResults(response.data.results);
            setUserCoins(response.data.newBalance);
            setTotalScore(response.data.totalCoins);
            setQuizSubmitted(true);

            const correctCount = response.data.results.filter(r => r.correct).length;
            setCorrectAnswers(correctCount);
            setFinalScore((correctCount / challenges.length) * 100);

            if (response.data.nextQuizTime) {
                setNextQuizTime(new Date(response.data.nextQuizTime));
            }

        } catch (error) {
            console.error('Error submitting answers:', error);
            if (error.response?.status === 403) {
                setQuizLocked(true);
                setNextQuizTime(new Date(error.response.data.nextQuizTime));
                setSubmitError(error.response.data.message);
            } else if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setSubmitError(error.response?.data?.message || 'Failed to submit answers. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        let timer;
        if (showQuiz && timeLeft > 0 && !quizSubmitted) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showQuiz, quizSubmitted]);

    if (loading) {
        return (
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading quiz...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="text-center">
                    <div className="text-xl font-semibold text-red-600 mb-4">{error}</div>
                    {quizLocked && nextQuizTime && (
                        <div className="text-gray-600">
                            <p>Next quiz available at: {new Date(nextQuizTime).toLocaleTimeString()}</p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {!showQuiz ? (
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                        <div 
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: article }}
                        />
                        <div className="mt-8 text-center">
                            {quizSubmitted ? (
                                <div className="bg-green-50 rounded-lg p-6">
                                    <h2 className="text-2xl font-bold text-green-800 mb-4">Quiz Completed!</h2>
                                    <div className="space-y-4">
                                        <div className="text-4xl font-bold text-green-600">
                                            {finalScore.toFixed(1)}%
                                        </div>
                                        <p className="text-gray-700">
                                            You got {correctAnswers} out of {challenges.length} questions correct
                                        </p>
                                        <p className="text-green-700 font-medium">
                                            Earned: +{totalScore} coins
                                        </p>
                                        <div className="mt-6">
                                            <button
                                                onClick={() => navigate('/')}
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Return to Home
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-600 mb-4">
                                        You will have 10 minutes to complete the quiz once you start.
                                    </p>
                                    <button
                                        onClick={startQuiz}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Start Quiz
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-8 shadow-sm">
                        <div className="mb-6">
                            <div className="flex flex-col space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="text-2xl font-bold text-gray-800">Daily Quiz</div>
                                    <CoinDisplay coins={userCoins} className="text-lg text-green-600" />
                                </div>
                                <div className="text-lg text-gray-600 text-center">
                                    Time Remaining: {minutes}:{seconds.toString().padStart(2, '0')}
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-8">
                            {challenges.map((challenge, index) => (
                                <div key={challenge._id} className="border-b pb-6 last:border-b-0">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Question {index + 1}</span>
                                            <CoinDisplay coins={challenge.reward} className="text-sm text-green-600" showIcon={false} />
                                        </div>
                                        <p className="text-lg font-medium text-gray-800 mt-1">{challenge.description}</p>
                                    </div>
                                    <div className="space-y-3">
                                        {challenge.options.map((option, optionIndex) => (
                                            <label
                                                key={optionIndex}
                                                className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                                                    quizSubmitted
                                                        ? option === challenge.correctAnswer
                                                            ? 'bg-green-50 border-green-500'
                                                            : answers[challenge._id] === option
                                                                ? 'bg-red-50 border-red-500'
                                                                : ''
                                                        : answers[challenge._id] === option
                                                            ? 'bg-green-50 border-green-500'
                                                            : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${challenge._id}`}
                                                    value={option}
                                                    checked={answers[challenge._id] === option}
                                                    onChange={() => handleOptionSelect(challenge._id, option)}
                                                    disabled={quizSubmitted}
                                                    className="sr-only"
                                                />
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-700">{option}</span>
                                                    {quizSubmitted && (
                                                        <span className={`text-sm font-medium ${
                                                            option === challenge.correctAnswer
                                                                ? 'text-green-600'
                                                                : answers[challenge._id] === option
                                                                    ? 'text-red-600'
                                                                    : ''
                                                        }`}>
                                                            {option === challenge.correctAnswer && '✓ Correct Answer'}
                                                            {answers[challenge._id] === option && option !== challenge.correctAnswer && '✗ Your Answer'}
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {quizSubmitted && (
                                        <div className={`mt-4 p-3 rounded-lg ${
                                            results[challenge._id]?.correct 
                                                ? 'bg-green-50 text-green-800' 
                                                : 'bg-red-50 text-red-800'
                                        }`}>
                                            {results[challenge._id]?.correct 
                                                ? `Correct! You earned ${challenge.reward} coins` 
                                                : `Incorrect. The correct answer was: ${challenge.correctAnswer}`}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 text-center">
                            {submitError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-lg">
                                    {submitError}
                                </div>
                            )}
                            {quizSubmitted ? (
                                <div className="space-y-6">
                                    <div className="bg-green-50 rounded-lg p-6">
                                        <h2 className="text-2xl font-bold text-green-800 mb-4">Quiz Completed!</h2>
                                        <div className="space-y-4">
                                            <div className="text-4xl font-bold text-green-600">
                                                {finalScore.toFixed(1)}%
                                            </div>
                                            <p className="text-gray-700">
                                                You got {correctAnswers} out of {challenges.length} questions correct
                                            </p>
                                            <p className="text-green-700 font-medium">
                                                <CoinDisplay coins={totalScore} className="text-lg" showIcon={true} />
                                            </p>
                                            <p className="text-gray-600">
                                                Total Balance: <CoinDisplay coins={userCoins} className="inline-block" showIcon={false} />
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting || quizSubmitted || !areAllQuestionsAnswered()}
                                    className={`px-6 py-3 rounded-lg font-medium ${
                                        submitting || quizSubmitted || !areAllQuestionsAnswered()
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Answers'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyChallenges;