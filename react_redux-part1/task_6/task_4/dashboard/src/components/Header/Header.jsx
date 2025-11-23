import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import holbertonLogo from "../../assets/holberton-logo.jpg";

/**
 * Header component - Dashboard branding section with logo and title
 * Uses Redux to manage authentication state
 * When user is logged in, displays a welcome message with logout link
 */
function Header() {
  // Get authentication state from Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  
  // Get dispatch function to dispatch actions
  const dispatch = useDispatch();
  
  /**
   * Handle logout action
   * Dispatches the logout action to Redux store
   */
  const handleLogout = () => {
    dispatch(logout());
  };
  
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
      {isLoggedIn && (
        <section id="logoutSection" className="mt-4 text-center">
          Welcome <strong>{user.email}</strong> (
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
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
