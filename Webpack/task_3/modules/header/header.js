import $ from 'jquery';
import './header.css';

console.log('Init header');

// Build header with logo and title
$(function () {
  const $header = $('<header id="app-header"></header>');
  $header.append('<div id="logo"></div>');
  $header.append('<h1>Holberton Dashboard</h1>');
  $('body').prepend($header);
});
