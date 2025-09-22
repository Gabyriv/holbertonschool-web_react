import $ from 'jquery';
import _ from 'lodash';
import './body.css';

$(function () {
  const $main = $('<main id="app-main"></main>');
  $main.append('<p>Dashboard data for the students</p>');
  $main.append('<button id="start-btn">Click here to get started</button>');
  $main.append("<p id='count'></p>");
  $('body').append($main);

  let count = 0;
  $(document).on(
    'click',
    '#start-btn',
    _.debounce(() => {
      count++;
      $('#count').text(`${count} clicks on the button`);
    }, 500)
  );
});
