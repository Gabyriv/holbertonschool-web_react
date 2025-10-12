import { Component } from "react";
import PropTypes from "prop-types";
import BodySection from "../BodySection/BodySection.jsx";
import "./BodySectionWithMarginBottom.css";

class BodySectionWithMarginBottom extends Component {
  render() {
    return (
      <div className="bodySectionWithMargin">
        <BodySection title={this.props.title}>{this.props.children}</BodySection>
      </div>
    );
  }
}

BodySectionWithMarginBottom.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default BodySectionWithMarginBottom;
