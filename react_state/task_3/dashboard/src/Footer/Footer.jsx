import { getCurrentYear, getFooterCopy } from "../utils/utils.js";

// Footer renders the footer text with the current year and copy information.
function Footer() {
  return (
    <div className="App-footer text-center italic mt-auto py-4 text-xs md:text-sm">
      <p>
        Copyright {getCurrentYear()} - {getFooterCopy(false)}
      </p>
    </div>
  );
}

export default Footer;
