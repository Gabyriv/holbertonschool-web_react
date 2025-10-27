import WithLogging from "../HOC/WithLogging.jsx";

// Login renders the login form with email and password inputs.
function Login() {
  return (
    <div className="App-body flex-1">
      <p>Login to access the full dashboard</p>
      <label htmlFor="inputEmail" className="mr-2.5">Email:</label>
      <input type="email" id="inputEmail" className="mr-2.5" />
      <label htmlFor="inputPassword" className="mr-2.5">Password:</label>
      <input type="password" id="inputPassword" className="mr-2.5" />
      <button type="submit" className="ml-2.5">OK</button>
    </div>
  );
}

const LoginWithLogging = WithLogging(Login);

export default LoginWithLogging;
