import "./Login.css";

// Login renders the login form with email and password inputs.
function Login() {
  return (
    <div className="App-body">
      <p>Login to access the full dashboard</p>
      <label htmlFor="inputEmail">Email:</label>
      <input type="email" id="inputEmail" />
      <label htmlFor="inputPassword">Password:</label>
      <input type="password" id="inputPassword" />
      <button type="submit">OK</button>
    </div>
  );
}

export default Login;
