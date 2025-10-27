import holbertonLogo from "../assets/holberton-logo.jpg";

// Header renders the dashboard branding section with the Holberton logo and title.
function Header() {
  return (
    <div className="App-header flex flex-row items-center">
      <img src={holbertonLogo} alt="holberton logo" className="w-[300px] h-[300px]" />
      <h1 className="text-[var(--main-color)]">School dashboard</h1>
    </div>
  );
}

export default Header;
