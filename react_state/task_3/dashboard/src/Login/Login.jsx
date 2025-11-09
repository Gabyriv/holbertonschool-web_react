import { Component } from "react";
import WithLogging from "../HOC/WithLogging.jsx";

// Login renders the login form with email and password inputs.
class Login extends Component {
  // Constructor: initialize component state
  constructor(props) {
    super(props);
    // Initialize state - retrieve email and password from props with default values
    const { email = "", password = "" } = props;
    // Initialize state (removed isLoggedIn as it's now managed by App)
    this.state = {
      email: email,
      password: password,
      enableSubmit: false,
    };
  }

  // Email validation regex: basic email format validation
  isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Update enableSubmit state based on validation criteria
  updateSubmitState = (email, password) => {
    // Enable submit when:
    // 1. Email is not empty and valid
    // 2. Password has at least 8 characters
    const isEmailValid = email.trim() !== "" && this.isValidEmail(email);
    const isPasswordValid = password.length >= 8;
    const shouldEnable = isEmailValid && isPasswordValid;

    // Only update state if the value changed (to avoid unnecessary re-renders)
    if (this.state.enableSubmit !== shouldEnable) {
      this.setState({ enableSubmit: shouldEnable });
    }
  };

  // Handler for email input changes
  handleChangeEmail = (event) => {
    const newEmail = event.target.value;
    this.setState({ email: newEmail }, () => {
      // After state is updated, check if submit should be enabled
      this.updateSubmitState(this.state.email, this.state.password);
    });
  };

  // Handler for password input changes
  handleChangePassword = (event) => {
    const newPassword = event.target.value;
    this.setState({ password: newPassword }, () => {
      // After state is updated, check if submit should be enabled
      this.updateSubmitState(this.state.email, this.state.password);
    });
  };

  // Handler for form submission - calls logIn from props
  handleLoginSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    const { logIn } = this.props;
    // Call the logIn method from props with current email and password
    if (logIn) {
      logIn(this.state.email, this.state.password);
    }
  };

  render() {
    const { email, password, enableSubmit } = this.state;

    return (
      <div className="App-body flex-1">
        <p className="mb-4">Login to access the full dashboard</p>
        <form 
          onSubmit={this.handleLoginSubmit}
          className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0"
        >
          <label htmlFor="inputEmail" className="md:mr-2.5">Email:</label>
          <input 
            type="email" 
            id="inputEmail"
            value={email}
            onChange={this.handleChangeEmail}
            className="md:mr-2.5 w-full md:w-auto border border-gray-300 px-2 py-1" 
          />
          <label htmlFor="inputPassword" className="md:mr-2.5">Password:</label>
          <input 
            type="password" 
            id="inputPassword"
            value={password}
            onChange={this.handleChangePassword}
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
}

const LoginWithLogging = WithLogging(Login);

export default LoginWithLogging;
