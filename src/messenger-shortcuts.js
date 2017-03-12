/******************************************
 * messenger-shortcuts.js
 *
 * Author: Allen Guo <guoguo12@gmail.com>
 *****************************************/

/** Key bindings **/
/** Compose, ToggleInfo, Mute, Search, SendLike **/
var bind = ['C', 'D', 'M', 'Q', 'E'];

/** Constants **/

HELP_HTML = "List of shortcuts:\
<br><br>\
<b>Esc</b> &ndash; Move cursor to message input field<br><br>\
<b>Alt+Shift+"+bind[0]+"</b> &ndash; Compose new message<br>\
<b>Alt+Shift+"+bind[3]+"</b> &ndash; Search Messenger<br>\
<b>Alt+Shift+<i>n</i></b> &ndash; Jump to conversation <i>n</i>-th from top<br>\
<b>Alt+Up</b>/<b>Down</b> &ndash; Jump to conversation one above/below<br><br>\
<b>Alt+Shift+"+bind[1]+"</b> &ndash; Toggle conversation details<br>\
<b>Alt+Shift+"+bind[2]+"</b> &ndash; Mute conversation<br>\
<b>Alt+Shift+"+bind[4]+"</b> &ndash; Send a like<br><br>\
<b>Alt+Shift+/</b> &ndash; Display this help dialog<br>\
"

/** Menu **/
var menuOpened = false;
var delay = 100;

/** Primary event handler **/

document.body.onkeydown = function(event) {
  // Esc key
  if (event.keyCode === 27) {
		dismiss();
    focusMessageInput();
  }

  if (event.keyCode == 13 && document.activeElement === getSearchBar()) {
    // we're going to change the input, so throw away this keypress
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
    jumpToMessage(event.keyCode - 49);
  }

  // Other keys
  switch (event.keyCode) {
    case getCode(0):
      compose();
      break;
    case getCode(1):
      toggleInfo();
      break;
    case getCode(2):
      mute();
      break;
    case getCode(3):
      focusSearchBar();
      break;
    case getCode(4):
      sendLike();
      break;
    case 191: // Fwd. slash
      if(menuOpened) {
        return;
      } else {
        openHelp();
      } 
      menuOpened = !menuOpened;
      break;
  }
}
document.body.addEventListener('click', dismiss, true);

/** Helper functions **/

function getByAttr(tag, attr, value) {
  return document.querySelector(tag + '[' + attr + '="' + value + '"]');
}

function last(arr) {
  return arr.length === 0 ? undefined : arr[arr.length - 1];
}

function getCode(index) {
  return bind[index].charCodeAt(0);
}

function dismiss() {
	if(menuOpened) {
		menuOpened = false;
	}
}

/** Functionality **/

function jumpToMessage(index) {
  document.querySelectorAll('div[aria-label="Conversations"] a')[index].click();
}

function selectFirstSearchResult() {
  var first = document.querySelector('span[role="search"] a');
  if (first) {
    first.click();
    // focus message input afterwards in case the user already has that chat open
    focusMessageInput();
  }
}

function compose() {
  getByAttr('a', 'aria-label', 'New Message').click();
}

function toggleInfo() {
  getByAttr('a', 'title', 'Conversation Information').click();
}

function mute() {
  getByAttr('input', 'type', 'checkbox').click();
}

function getSearchBar() {
  return getByAttr('input', 'type', 'text');
}

function focusSearchBar() {
  getSearchBar().focus();
}

function focusMessageInput() {
  targetNode = getByAttr('div', 'aria-label', 'Type a message...')
  triggerMouseEvent (targetNode, "mouseover");
  triggerMouseEvent (targetNode, "mousedown");
  triggerMouseEvent (targetNode, "mouseup");
  triggerMouseEvent (targetNode, "click");
}

function openDeleteDialog() {
  last(document.querySelectorAll('div.contentAfter div[aria-label="Conversation actions"]')).click();
  document.querySelector('a[role="menuitem"] span span').click();
}

function openHelp() {
  mute();
  setTimeout(function() {
    document.querySelector('div[role="dialog"] h2').innerHTML = "Keyboard Shortcuts for Messenger";
    document.querySelector('div[role="dialog"] h2~div').innerHTML = HELP_HTML;
    document.querySelector('div[role="dialog"] h2~div~div').remove();
  }, delay);
	delay = 0; // to prevent unnecessary timeout
}

function sendLike() {
  targetNode = getByAttr('a', 'aria-label', 'Send a Like');
  triggerMouseEvent(targetNode, "mouseover");
  triggerMouseEvent(targetNode, "mousedown");
  triggerMouseEvent(targetNode, "mouseup");
  triggerMouseEvent(targetNode, "click");
}

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
