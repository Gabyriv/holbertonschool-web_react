import $ from 'jquery';
import './footer.css';

$(function () {
  const $footer = $('<footer id="app-footer"></footer>');
  $footer.append('<p>Copyright - Holberton School</p>');
  $('body').append($footer);
});
