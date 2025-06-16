import React, { useState, useEffect } from 'react';

// Main App component for the password strength checker
const App = () => {
  // State to store the current password input by the user
  const [password, setPassword] = useState('');
  // State to store the strength score of the password
  const [strength, setStrength] = useState(0);
  // State to store feedback messages for each criteria
  const [feedback, setFeedback] = useState([]);

  // useEffect hook to re-evaluate password strength whenever the password changes
  useEffect(() => {
    assessPasswordStrength(password);
  }, [password]); // Dependency array ensures this runs only when 'password' changes

  // Function to assess the password strength based on defined criteria
  const assessPasswordStrength = (pwd) => {
    let newStrength = 0; // Initialize strength score
    const newFeedback = []; // Initialize feedback messages array

    // 1. Length criteria: At least 8 characters
    if (pwd.length >= 8) {
      newStrength += 1; // Increment strength if criteria met
      newFeedback.push({ text: 'Length: At least 8 characters - Met', met: true });
    } else {
      newFeedback.push({ text: 'Length: At least 8 characters - Not Met', met: false });
    }

    // 2. Uppercase letters criteria: At least one uppercase letter
    if (/[A-Z]/.test(pwd)) {
      newStrength += 1;
      newFeedback.push({ text: 'Uppercase: At least one uppercase letter - Met', met: true });
    } else {
      newFeedback.push({ text: 'Uppercase: At least one uppercase letter - Not Met', met: false });
    }

    // 3. Lowercase letters criteria: At least one lowercase letter
    if (/[a-z]/.test(pwd)) {
      newStrength += 1;
      newFeedback.push({ text: 'Lowercase: At least one lowercase letter - Met', met: true });
    } else {
      newFeedback.push({ text: 'Lowercase: At least one lowercase letter - Not Met', met: false });
    }

    // 4. Numbers criteria: At least one number
    if (/\d/.test(pwd)) {
      newStrength += 1;
      newFeedback.push({ text: 'Numbers: At least one number - Met', met: true });
    } else {
      newFeedback.push({ text: 'Numbers: At least one number - Not Met', met: false });
    }

    // 5. Special characters criteria: At least one special character
    // Regex for common special characters: !@#$%^&*()_+{}[]:;<>,.?~\\-=/
    if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(pwd)) {
      newStrength += 1;
      newFeedback.push({ text: 'Special Characters: At least one special character - Met', met: true });
    } else {
      newFeedback.push({ text: 'Special Characters: At least one special character - Not Met', met: false });
    }

    // Update the state variables
    setStrength(newStrength);
    setFeedback(newFeedback);
  };

  // Determine the overall strength message based on the score
  const getStrengthMessage = (score) => {
    if (score === 5) return 'Very Strong';
    if (score >= 4) return 'Strong';
    if (score >= 3) return 'Moderate';
    if (score >= 1) return 'Weak';
    return 'Very Weak';
  };

  // Determine the color for the strength indicator based on the score
  const getStrengthColor = (score) => {
    if (score === 5) return 'bg-green-500'; // Very Strong
    if (score >= 4) return 'bg-lime-500';   // Strong
    if (score >= 3) return 'bg-yellow-500'; // Moderate
    if (score >= 1) return 'bg-orange-500'; // Weak
    return 'bg-red-500'; // Very Weak
  };

  return (
    // Main container for the application, centered and styled with Tailwind
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Password Strength Checker</h1>

        {/* Password input field */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
            Enter Password:
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Type your password here..."
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
          />
        </div>

        {/* Strength indicator bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ease-in-out ${getStrengthColor(strength)}`}
              style={{ width: `${(strength / 5) * 100}%` }} // Calculate width based on score out of 5
            ></div>
          </div>
          <p className={`text-center text-sm font-medium ${getStrengthColor(strength).replace('bg-', 'text-')}`}>
            Strength: {getStrengthMessage(strength)}
          </p>
        </div>

        {/* Feedback section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Feedback:</h2>
          <ul className="space-y-2">
            {feedback.map((item, index) => (
              <li key={index} className={`flex items-center text-md ${item.met ? 'text-green-600' : 'text-red-600'}`}>
                {item.met ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
