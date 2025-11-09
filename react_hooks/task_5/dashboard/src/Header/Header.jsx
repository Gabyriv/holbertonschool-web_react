import { useContext } from "react";
import holbertonLogo from "../assets/holberton-logo.jpg";
import AppContext from "../Context/context.js";

// Header renders the dashboard branding section with the Holberton logo and title.
// When user is logged in, displays a welcome message with logout link.
// Converted to functional component using useContext hook for context consumption.
function Header() {
  // Use useContext hook to access the AppContext values
  const { user, logOut } = useContext(AppContext);

  return (
    <>
      <div className="App-header flex flex-row items-center max-[520px]:flex-col max-[520px]:items-center">
        <img 
          src={holbertonLogo} 
          alt="holberton logo" 
          className="w-[300px] h-[300px] max-[520px]:w-[150px] max-[520px]:h-[150px]" 
        />
        <h1 className="text-[var(--main-color)] text-3xl md:text-4xl max-[520px]:text-2xl max-[520px]:mt-2">School dashboard</h1>
      </div>
      {user.isLoggedIn && (
        <section id="logoutSection" className="mt-4 text-center">
          Welcome <strong>{user.email}</strong> (
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              logOut();
            }}
            className="text-[var(--main-color)] underline cursor-pointer"
          >
            logout
          </a>
          )
        </section>
      )}
    </>
  );
}

export default Header;
