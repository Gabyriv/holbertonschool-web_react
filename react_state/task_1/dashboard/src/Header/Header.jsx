import holbertonLogo from "../assets/holberton-logo.jpg";

// Header renders the dashboard branding section with the Holberton logo and title.
function Header() {
  return (
    <div className="App-header flex flex-row items-center max-[520px]:flex-col max-[520px]:items-center">
      <img 
        src={holbertonLogo} 
        alt="holberton logo" 
        className="w-[300px] h-[300px] max-[520px]:w-[150px] max-[520px]:h-[150px]" 
      />
      <h1 className="text-[var(--main-color)] text-3xl md:text-4xl max-[520px]:text-2xl max-[520px]:mt-2">School dashboard</h1>
    </div>
  );
}

export default Header;
