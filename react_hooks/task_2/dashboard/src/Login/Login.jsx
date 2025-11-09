import { useState } from "react";
import WithLogging from "../HOC/WithLogging.jsx";

// Login renders the login form with email and password inputs.
// Converted to functional component using React hooks for state management.
function Login(props) {
  // Initialize state using React hooks
  // enableSubmit controls whether the submit button is enabled
  const [enableSubmit, setEnableSubmit] = useState(false);
  
  // formData holds the email and password values
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Email validation regex: basic email format validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handler for email input changes
  // Updates formData with new email and validates submit button state
  const handleChangeEmail = (event) => {
    const email = event.target.value;
    const password = formData.password;
    
    // Update formData state with new email, keeping existing password
    setFormData({
      email: email,
      password: password
    });
    
    // Update enableSubmit state based on validation
    // Enable submit when:
    // 1. Email is not empty and valid
    // 2. Password has at least 8 characters
    const isEmailValid = email.trim() !== "" && isValidEmail(email);
    const isPasswordValid = password.length >= 8;
    setEnableSubmit(isEmailValid && isPasswordValid);
  };

  // Handler for password input changes
  // Updates formData with new password and validates submit button state
  const handleChangePassword = (event) => {
    const email = formData.email;
    const password = event.target.value;
    
    // Update formData state with new password, keeping existing email
    setFormData({
      email: email,
      password: password
    });
    
    // Update enableSubmit state based on validation
    // Enable submit when:
    // 1. Email is not empty and valid
    // 2. Password has at least 8 characters
    const isEmailValid = email.trim() !== "" && isValidEmail(email);
    const isPasswordValid = password.length >= 8;
    setEnableSubmit(isEmailValid && isPasswordValid);
  };

  // Handler for form submission - calls logIn from props
  // Always prevents default form behavior and calls logIn with current credentials
  const handleLoginSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    const { logIn } = props;
    // Call the logIn method from props with current email and password
    if (logIn) {
      logIn(formData.email, formData.password);
    }
  };

  return (
    <div className="App-body flex-1">
      <p className="mb-4">Login to access the full dashboard</p>
      <form 
        onSubmit={handleLoginSubmit}
        className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
      >
        <label htmlFor="inputEmail" className="md:mr-2.5">Email:</label>
        <input 
          type="email" 
          id="inputEmail"
          value={formData.email}
          onChange={handleChangeEmail}
          className="md:mr-2.5 w-full md:w-auto border border-gray-300 px-2 py-1" 
        />
        <label htmlFor="inputPassword" className="md:mr-2.5">Password:</label>
        <input 
          type="password" 
          id="inputPassword"
          value={formData.password}
          onChange={handleChangePassword}
          className="md:mr-2.5 w-full md:w-auto border border-gray-300 px-2 py-1" 
        />
        <input 
          type="submit"
          value="OK"
          disabled={!enableSubmit}
          className="md:ml-2.5 w-full md:w-auto mt-2 md:mt-0 border border-gray-300 px-4 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>
    </div>
  );
}

const LoginWithLogging = WithLogging(Login);

export default LoginWithLogging;
