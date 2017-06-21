/******************************************
 * messenger-shortcuts.js
 *
 * Author: Allen Guo <guoguo12@gmail.com>
 *****************************************/


/** Constants **/

// Compose, toggle info, search, send like, search in current conversation
KEYS = ['C', 'D', 'Q', 'E', 'F', '/'];

HELP_TITLE = 'Keyboard Shortcuts for Messenger';

HELP_TEXT = "<b>Esc</b> &ndash; Move cursor to message input field<br><br>\
<b>Alt+Shift+" + KEYS[0] + "</b> &ndash; Compose new message<br>\
<b>Alt+Shift+" + KEYS[2] + "</b> &ndash; Search Messenger<br>\
<b>Alt+Shift+<i>n</i></b> &ndash; Jump to conversation <i>n</i>-th from top<br>\
<b>Alt+Up</b>/<b>Down</b> &ndash; Jump to conversation one above/below<br><br>\
<b>Alt+Shift+" + KEYS[1] + "</b> &ndash; Toggle conversation details<br>\
<b>Alt+Shift+" + KEYS[3] + "</b> &ndash; Send a like<br><br>\
<b>Alt+Shift+" + KEYS[4] + "</b> &ndash; Search in current conversation<br><br>\
<b>Alt+Shift+" + KEYS[5] + "</b> &ndash; Display this help dialog<br>\
"


/** Global variables and listeners **/

// Tracks whether the like button is down
var likeDown = false;

// Releases the like button
document.body.addEventListener('keyup', function () {
  if (likeDown) {
    var targetNode = getByAttr('a', 'aria-label', 'Send a Like');
    fireMouseEvent(targetNode, 'mouseup');
    likeDown = false;
  }
}, false);


/** Primary event handler **/

document.body.onkeydown = function(event) {
  // Esc key
  if (event.keyCode === 27) {
    focusMessageInput();
  }

  // Do nothing if a dialog is open or if the like button is down
  if (document.querySelector('div[role="dialog"]') || likeDown) {
    return;
  }

  // Enter key (select first search result)
  if (event.keyCode == 13 && document.activeElement === getSearchBar()) {
    // We're going to change the input, so throw away this keypress
    event.preventDefault();
    selectFirstSearchResult();
    return;
  }

  // Only combinations of the form Alt+Shift+<key> are accepted
  if (!(event.altKey && event.shiftKey)) {
    return;
  }

  // Number keys
  if (event.keyCode >= 49 && event.keyCode <= 57) {
    jumpToNthMessage(event.keyCode - 49);
  }

  // Actions
  switch (event.keyCode) {
    case getCode(0):
      compose();
      break;
    case getCode(1):
      toggleInfo();
      break;
    case getCode(2):
      focusSearchBar();
      break;
    case getCode(3):
      sendLike();
      break;
    case getCode(4):
      searchInConversation();
      break;
    case getCode(5):
      openHelp();
      break;
  }
}


/** Helper functions **/

function getByAttr(tag, attr, value) {
  return document.querySelector(tag + '[' + attr + '="' + value + '"]');
}

function last(arr) {
  return arr.length === 0 ? undefined : arr[arr.length - 1];
}

function getCode(index) {
  var key = KEYS[index];
  return key === '/' ? 191 : key.charCodeAt(0);
}

// Modified from http://stackoverflow.com/a/2706236
function fireMouseEvent(targetNode, event) {
  if (targetNode.fireEvent) {
    targetNode.fireEvent('on' + event);
  } else {
    var eventObject = document.createEvent('MouseEvents');
    eventObject.initEvent(event, true, false);  // Yes bubble, no cancel
    targetNode.dispatchEvent(eventObject);
  }
}

// A user reported that their built-in click() function doesn't work...
function click(targetNode) {
  fireMouseEvent(targetNode, 'click');
}


/** Page actions **/

function focusMessageInput() {
  click(getByAttr('div', 'role', 'combobox'));
}

function selectFirstSearchResult() {
  var listboxes = document.querySelectorAll('ul[role="listbox"]');
  // Checking if only <= single character has been pressed
  var contacts = listboxes[(getSearchBar().value.length <= 1) ? 0 : 1];
  var first = contacts.querySelector('ul[role="listbox"] li div');
  if (first) {
    click(first);
  }
}

function jumpToNthMessage(index) {
  document.querySelectorAll('div[aria-label="Conversations"] a')[index].click();
}

function compose() {
  click(getByAttr('a', 'aria-label', 'New Message'));
}

function toggleInfo() {
  click(getByAttr('a', 'aria-label', 'Conversation Information'));
}

function getSearchBar() {
  return getByAttr('input', 'type', 'text');
}

function focusSearchBar() {
  getSearchBar().focus();
}

function sendLike() {
  var targetNode = getByAttr('a', 'aria-label', 'Send a Like');
  fireMouseEvent(targetNode, 'mouseover');
  fireMouseEvent(targetNode, 'mousedown');  // Released by keyup listener

  likeDown = true;
}

function searchInConversation() {
  var targetNode = document.querySelector('._3szn._3szo ._5odt') // return the first one that matches the selector
  click(targetNode);
}

function openSettings() {
  // Briefly open cog button so that settings menu item exists in the HTML
  var cogButton = getByAttr('a', 'role', 'button');
  click(cogButton);
  click(cogButton);

  click(getByAttr('a', 'role', 'menuitem'));
}

function openHelp() {
  // Open the settings dialog, which we're hijacking
  openSettings();

  var titleDiv = document.querySelector('div[role="dialog"] h2 div');
  titleDiv.innerHTML = HELP_TITLE;

  var textDiv = document.querySelector('div[role="dialog"] h2~div');
  textDiv.innerHTML = HELP_TEXT;
  textDiv.style.lineHeight = '130%';
  textDiv.style.padding = '20px';

  var extraDivs = document.querySelectorAll('div[role="dialog"] h2~div~div');
  for (var i = 0; i < extraDivs.length; i++) {
    extraDivs[i].remove();
  }
}
