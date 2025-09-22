import $ from "jquery";
import _ from "lodash";

$(function () {
  $("body").append("<p>Holberton Dashboard</p>");
  $("body").append("<p>Dashboard data for the students</p>");
  $("body").append("<button>Click here to get started</button>");
  $("body").append("<p id='count'></p>");
  $("body").append("<p>Copyright - Holberton School</p>");
});

export default function updateCounter() {
  let count = 0;
  const button = document.querySelector("button");
  button.addEventListener(
    "click",
    _.debounce(() => {
      count++;
      document.getElementById(
        "count"
      ).textContent = `${count} clicks on the button`;
    }, 500)
  );
}
