import { useState } from "react";

/**
 * Custom React hook for managing login form state and validation
 * 
 * @param {Function} onLogin - Callback function to be called when form is submitted
 * @returns {Object} Object containing state values and handlers
 *   - email: Current email value
 *   - password: Current password value
 *   - enableSubmit: Boolean indicating if submit button should be enabled
 *   - handleChangeEmail: Handler for email input changes
 *   - handleChangePassword: Handler for password input changes
 *   - handleLoginSubmit: Handler for form submission
 */
function useLogin(onLogin) {
  // Initialize state for form data
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Initialize state for submit button enablement
  const [enableSubmit, setEnableSubmit] = useState(false);

  /**
   * Validates email format using regex
   * @param {string} email - Email address to validate
   * @returns {boolean} True if email is valid, false otherwise
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates form inputs and updates enableSubmit state
   * @param {string} email - Email to validate
   * @param {string} password - Password to validate
   */
  const validateForm = (email, password) => {
    // Enable submit when:
    // 1. Email is not empty and valid format
    // 2. Password has at least 8 characters
    const isEmailValid = email.trim() !== "" && isValidEmail(email);
    const isPasswordValid = password.length >= 8;
    setEnableSubmit(isEmailValid && isPasswordValid);
  };

  /**
   * Handler for email input changes
   * Updates email in formData and validates form
   * @param {Event} event - Input change event
   */
  const handleChangeEmail = (event) => {
    const email = event.target.value;
    const password = formData.password;
    
    // Update formData state with new email, keeping existing password
    setFormData({
      email: email,
      password: password
    });
    
    // Validate form with new email
    validateForm(email, password);
  };

  /**
   * Handler for password input changes
   * Updates password in formData and validates form
   * @param {Event} event - Input change event
   */
  const handleChangePassword = (event) => {
    const email = formData.email;
    const password = event.target.value;
    
    // Update formData state with new password, keeping existing email
    setFormData({
      email: email,
      password: password
    });
    
    // Validate form with new password
    validateForm(email, password);
  };

  /**
   * Handler for form submission
   * Prevents default form behavior and calls onLogin callback with credentials
   * @param {Event} event - Form submit event
   */
  const handleLoginSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    
    // Call the onLogin callback with current email and password
    if (onLogin) {
      onLogin(formData.email, formData.password);
    }
  };

  // Return state values and handlers for use in component
  return {
    email: formData.email,
    password: formData.password,
    enableSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleLoginSubmit
  };
}

export default useLogin;

