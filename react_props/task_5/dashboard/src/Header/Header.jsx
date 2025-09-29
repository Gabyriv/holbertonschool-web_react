import "./Header.css";
import holbertonLogo from "../assets/holberton-logo.jpg";

// Header renders the dashboard branding section with the Holberton logo and title.
function Header() {
  return (
    <div className="App-header">
      <img src={holbertonLogo} alt="holberton logo" />
      <h1>School dashboard</h1>
    </div>
  );
}

export default Header;
