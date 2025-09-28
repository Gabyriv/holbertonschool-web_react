import "./Footer.css";
import { getCurrentYear, getFooterCopy } from "../utils/utils.js";

// Footer renders the footer text with the current year and copy information.
function Footer() {
  return (
    <div className="App-footer">
      <p>
        Copyright {getCurrentYear()} - {getFooterCopy(true)}
      </p>
    </div>
  );
}

export default Footer;
