import "./App.css";
import holbertonLogo from "./assets/holberton-logo.jpg";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <img src={holbertonLogo} alt="holberton logo" />
        <h1>School dashboard</h1>
      </div>
      <div className="red-line" />
      <div className="App-body">
        <p>Login to access the full dashboard</p>
      </div>
      <div className="red-line" />
      <div className="App-footer">
        <p>Copyright 2025 - holberton school</p>
      </div>
    </div>
  );
}

export default App;
