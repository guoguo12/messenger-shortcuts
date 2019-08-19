/******************************************
 * messenger-shortcuts.js
 *
 * Author: Allen Guo <guoguo12@gmail.com>
 *****************************************/


/** Constants **/

var KEYS = {
    COMPOSE: 'C',
    INFO_PANE: 'D',
    ACTIONS_MENU: 'A',
    SEARCH: 'Q',
    SEND_LIKE: 'E',
    SEARCH_IN_CONVO: 'F',
    HELP: '/'
};

var ESC_KEY = 27;
var ENTER_KEY = 13;
var NUMBER_1 = 49;
var NUMBER_9 = 57;
var SLASH_KEY = 191;

var HELP_TITLE = 'Keyboard Shortcuts for Messenger';

var HELP_TEXT =
"<b>Esc</b> &ndash; Move cursor to message input field<br><br>" +
"<b>Alt+Shift+" + KEYS.COMPOSE + "</b> &ndash; Compose new message<br>" +
"<b>Alt+Shift+" + KEYS.SEARCH + "</b> &ndash; Search Messenger<br>" +
"<b>Alt+Shift+<i>n</i></b> &ndash; Jump to conversation <i>n</i>-th from top<br>" +
"<b>Alt+Up</b>/<b>Down</b> &ndash; Jump to conversation one above/below<br><br>" +
"<b>Alt+Shift+" + KEYS.INFO_PANE + "</b> &ndash; Toggle conversation details<br>" +
"<b>Alt+Shift+" + KEYS.ACTIONS_MENU + "</b> &ndash; Open conversation actions menu<br>" +
"<b>Alt+Shift+" + KEYS.SEND_LIKE + "</b> &ndash; Send a like<br><br>" +
"<b>Alt+Shift+" + KEYS.SEARCH_IN_CONVO + "</b> &ndash; Search in current conversation<br><br>" +
"<b>Alt+Shift+" + KEYS.HELP + "</b> &ndash; Display this help dialog<br>";


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
  if (event.keyCode === ESC_KEY) {
    focusMessageInput();
  }

  // Do nothing if a dialog is open or if the like button is down
  if (document.querySelector('div[role="dialog"]') || likeDown) {
    return;
  }

  // Enter key (select first search result)
  if (event.keyCode == ENTER_KEY && document.activeElement === getSearchBar()) {
    // We're going to change the input, so throw away this keypress
    event.preventDefault();
    selectFirstSearchResult();
    return;
  }

  // Only combinations of the form Alt+Shift+<key> are accepted
  if (navigator.appVersion.indexOf("Mac")!=-1) {
    // macOS
    if (!(event.ctrlKey && event.shiftKey)) {
      return;
    }
  } else {
    // other OS
    if (!(event.altKey && event.shiftKey)) {
      return;
    }
  }

  // Number keys
  if (event.keyCode >= NUMBER_1 && event.keyCode <= NUMBER_9) {
    jumpToNthMessage(event.keyCode - NUMBER_1);
  }

  // Actions
  switch (event.keyCode) {
    case getCode(KEYS.COMPOSE):
      compose();
      break;
    case getCode(KEYS.INFO_PANE):
      toggleInfo();
      break;
    case getCode(KEYS.ACTIONS_MENU):
      openActions();
      break;
    case getCode(KEYS.SEARCH):
      focusSearchBar();
      break;
    case getCode(KEYS.SEND_LIKE):
      sendLike();
      break;
    case getCode(KEYS.SEARCH_IN_CONVO):
      searchInConversation();
      break;
    case getCode(KEYS.HELP):
      openHelp();
      break;
  }
};


/** Helper functions **/

function getByAttr(tag, attr, value) {
  return document.querySelector(tag + '[' + attr + '="' + value + '"]');
}

function getByText(tag, text) {
  var query = '//' + tag + '[text()="' + text + '"]';
  var results = document.evaluate(query, document, null, XPathResult.ANY_TYPE, null);
  return results.iterateNext();
}

// Get the event keyCode value for the given keypress
function getCode(key) {
  return key === '/' ? SLASH_KEY : key.charCodeAt(0);
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
  var targetNode = getByText('div', 'Search in Conversation').parentNode;
  if (targetNode) {
    click(targetNode);
  }
}

function openSettings() {
  // Briefly open cog button so that settings menu item exists in the HTML
  var cogButton = getByAttr('a', 'aria-haspopup', 'true');

  click(cogButton);
  click(cogButton);

  var settingsButton = document.querySelector('.uiContextualLayerBelowLeft a[role="menuitem"]');
  click(settingsButton);
}

function openActions() {
  // The "additions text" part gets the selected/active conversation
  var menuButton = document.querySelector('li[aria-relevant="additions text"] div[aria-label="Conversation actions"]');
  click(menuButton);
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
  textDiv.style.display = 'block';

  var extraDivs = document.querySelectorAll('div[role="dialog"] h2~div~div');
  for (var i = 0; i < extraDivs.length; i++) {
    extraDivs[i].remove();
  }
}
