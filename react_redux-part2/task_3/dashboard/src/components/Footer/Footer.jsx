import { useSelector } from 'react-redux';
import { getCurrentYear, getFooterCopy } from "../../utils/utils.js";

/**
 * Footer component - Displays footer text with current year and copy information
 * Uses Redux to manage authentication state
 * When user is logged in, displays a "Contact us" link
 */
function Footer() {
  // Get authentication state from Redux store
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  return (
    <div className="App-footer text-center italic mt-auto py-4 text-xs md:text-sm">
      <p>
        Copyright {getCurrentYear()} - {getFooterCopy(false)}
      </p>
      {isLoggedIn && (
        <p>
          <a href="#" className="text-[var(--main-color)] underline">
            Contact us
          </a>
        </p>
      )}
    </div>
  );
}

export default Footer;
