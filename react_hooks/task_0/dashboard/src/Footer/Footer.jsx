import { useContext } from "react";
import { getCurrentYear, getFooterCopy } from "../utils/utils.js";
import AppContext from "../Context/context.js";

// Footer renders the footer text with the current year and copy information.
// When user is logged in, displays a "Contact us" link.
// Converted to use useContext hook for cleaner context consumption.
function Footer() {
  // Use useContext hook to access the AppContext values
  const { user } = useContext(AppContext);

  return (
    <div className="App-footer text-center italic mt-auto py-4 text-xs md:text-sm">
      <p>
        Copyright {getCurrentYear()} - {getFooterCopy(false)}
      </p>
      {user.isLoggedIn && (
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
