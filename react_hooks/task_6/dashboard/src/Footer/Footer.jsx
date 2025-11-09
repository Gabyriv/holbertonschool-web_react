import PropTypes from "prop-types";
import { getCurrentYear, getFooterCopy } from "../utils/utils.js";

// Footer renders the footer text with the current year and copy information.
// When user is logged in, displays a "Contact us" link.
// Refactored to use props instead of Context API for better testing and flexibility.
function Footer({ user }) {
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

Footer.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    isLoggedIn: PropTypes.bool,
  }),
};

Footer.defaultProps = {
  user: {
    email: '',
    password: '',
    isLoggedIn: false,
  },
};

export default Footer;
