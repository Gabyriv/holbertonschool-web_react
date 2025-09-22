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
  // Use event delegation so it works even if the button is added later
  $(document).on(
    "click",
    "button",
    _.debounce(() => {
      count++;
      $("#count").text(`${count} clicks on the button`);
    }, 500)
  );
}
