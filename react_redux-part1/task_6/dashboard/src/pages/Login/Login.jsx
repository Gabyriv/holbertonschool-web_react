import { useDispatch } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import WithLogging from "../../components/HOC/WithLogging.jsx";
import useLogin from "../../hooks/useLogin.jsx";

/**
 * Login component - Renders the login form with email and password inputs
 * Uses Redux to dispatch login action when form is submitted
 * Uses custom useLogin hook for form state management and validation
 */
function Login() {
  // Get dispatch function from Redux
  const dispatch = useDispatch();
  
  /**
   * Handle login submission
   * Dispatches login action to Redux store with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   */
  const handleLogin = (email, password) => {
    dispatch(login({ email, password }));
  };
  
  // Use custom hook to manage login form state and validation
  // Pass handleLogin callback to the hook
  const {
    email,
    password,
    enableSubmit,
    handleChangeEmail,
    handleChangePassword,
    handleLoginSubmit
  } = useLogin(handleLogin);

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
          value={email}
          onChange={handleChangeEmail}
          className="md:mr-2.5 w-full md:w-auto border border-gray-300 px-2 py-1" 
        />
        <label htmlFor="inputPassword" className="md:mr-2.5">Password:</label>
        <input 
          type="password" 
          id="inputPassword"
          value={password}
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

// Wrap Login with WithLogging HOC for lifecycle logging
const LoginWithLogging = WithLogging(Login);

export default LoginWithLogging;
