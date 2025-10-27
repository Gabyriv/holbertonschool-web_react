import WithLogging from "../HOC/WithLogging.jsx";

// Login renders the login form with email and password inputs.
function Login() {
  return (
    <div className="App-body flex-1">
      <p className="mb-4">Login to access the full dashboard</p>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
        <label htmlFor="inputEmail" className="md:mr-2.5">Email:</label>
        <input 
          type="email" 
          id="inputEmail" 
          className="md:mr-2.5 w-full md:w-auto border border-gray-300 px-2 py-1" 
        />
        <label htmlFor="inputPassword" className="md:mr-2.5">Password:</label>
        <input 
          type="password" 
          id="inputPassword" 
          className="md:mr-2.5 w-full md:w-auto border border-gray-300 px-2 py-1" 
        />
        <button type="submit" className="md:ml-2.5 w-full md:w-auto mt-2 md:mt-0 border border-gray-300 px-4 py-1">OK</button>
      </div>
    </div>
  );
}

const LoginWithLogging = WithLogging(Login);

export default LoginWithLogging;
