import React, { useState, useEffect, useRef } from 'react';

// Main App component
const App = () => {
  // State for the password input
  const [password, setPassword] = useState('');
  // State for the strength score (0-5)
  const [strengthScore, setStrengthScore] = useState(0);
  // State for feedback messages
  const [feedback, setFeedback] = useState([]);
  // Ref for the password input field
  const passwordInputRef = useRef(null);

  // Effect hook to focus the input field on component mount
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  // Effect hook to assess password strength whenever the password changes
  useEffect(() => {
    assessPasswordStrength(password);
  }, [password]);

  /**
   * Assesses the strength of the given password based on multiple criteria.
   * Updates the strength score and feedback messages.
   * @param {string} pwd The password string to assess.
   */
  const assessPasswordStrength = (pwd) => {
    let score = 0;
    const feedbackMessages = [];

    // Criteria checks
    const hasLowercase = /[a-z]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);

    // 1. Length
    if (pwd.length >= 8) {
      score += 1;
      feedbackMessages.push('Length: At least 8 characters (Good)');
    } else {
      feedbackMessages.push(`Length: Password is too short (${pwd.length}/8 characters)`);
    }

    if (pwd.length >= 12) {
      score += 1;
      feedbackMessages.push('Length: Over 12 characters (Excellent)');
    }

    // 2. Character types
    let charTypeCount = 0;
    if (hasLowercase) {
      charTypeCount++;
      feedbackMessages.push('Contains: Lowercase letters');
    } else {
      feedbackMessages.push('Missing: Lowercase letters');
    }
    if (hasUppercase) {
      charTypeCount++;
      feedbackMessages.push('Contains: Uppercase letters');
    } else {
      feedbackMessages.push('Missing: Uppercase letters');
    }
    if (hasNumber) {
      charTypeCount++;
      feedbackMessages.push('Contains: Numbers');
    } else {
      feedbackMessages.push('Missing: Numbers');
    }
    if (hasSpecialChar) {
      charTypeCount++;
      feedbackMessages.push('Contains: Special characters');
    } else {
      feedbackMessages.push('Missing: Special characters');
    }

    // Add score based on character types diversity
    if (charTypeCount >= 3) {
      score += 1;
    }
    if (charTypeCount === 4) {
      score += 1;
    }

    // Penalize for common patterns or simple sequences (basic check)
    // This is a very simple check and can be expanded for more robust analysis.
    if (/(123|abc|password|qwerty)/i.test(pwd)) {
        score = Math.max(0, score - 1); // Decrease score, but not below 0
        feedbackMessages.push('Warning: Avoid common patterns like "123", "abc", or "password"');
    }

    setStrengthScore(score);
    setFeedback(feedbackMessages);
  };

  /**
   * Returns the color class for the strength indicator based on the score.
   * @param {number} score The current strength score.
   * @returns {string} Tailwind CSS class for background color.
   */
  const getStrengthColor = (score) => {
    if (score === 0) return 'bg-gray-400'; // Very Weak (default)
    if (score === 1) return 'bg-red-500';  // Weak
    if (score === 2) return 'bg-orange-500'; // Moderate
    if (score === 3) return 'bg-yellow-500'; // Good
    if (score >= 4) return 'bg-green-500'; // Strong
    return 'bg-gray-400';
  };

  /**
   * Returns the text description for the strength.
   * @param {number} score The current strength score.
   * @returns {string} Text description of strength.
   */
  const getStrengthText = (score) => {
    if (score === 0) return 'Very Weak';
    if (score === 1) return 'Weak';
    if (score === 2) return 'Moderate';
    if (score === 3) return 'Good';
    if (score >= 4) return 'Strong';
    return 'Enter a password';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center p-4 font-inter">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Password Strength Checker
        </h1>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
            Enter your password:
          </label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
            placeholder="Type your password here..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password input"
          />
        </div>

        {/* Strength Indicator */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">Password Strength:</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-in-out ${getStrengthColor(strengthScore)}`}
              style={{ width: `${(strengthScore / 5) * 100}%` }}
              role="progressbar"
              aria-valuenow={strengthScore}
              aria-valuemin="0"
              aria-valuemax="5"
            ></div>
          </div>
          <p className={`text-right text-sm mt-1 font-semibold ${getStrengthColor(strengthScore).replace('bg', 'text')}`}>
            {getStrengthText(strengthScore)}
          </p>
        </div>

        {/* Feedback Section */}
        {password && ( // Only show feedback when password is not empty
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-bold text-blue-800 mb-3">Feedback:</h2>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {feedback.map((msg, index) => (
                <li key={index} className={msg.startsWith('Missing') || msg.startsWith('Warning') ? 'text-red-600' : 'text-gray-700'}>
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
