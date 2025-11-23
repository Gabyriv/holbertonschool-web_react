import { Component } from "react";
import PropTypes from "prop-types";
import BodySection from "../BodySection/BodySection.jsx";

class BodySectionWithMarginBottom extends Component {
  render() {
    return (
      <div className="bodySectionWithMargin mb-10">
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
