/******************************************
 * messenger-shortcuts.js
 *
 * Author: Allen Guo <guoguo12@gmail.com>
 *****************************************/

/** Constants **/

HELP_HTML = "List of shortcuts:\
<br><br>\
<b>Esc</b> &ndash; Move cursor to message input field<br><br>\
<b>Alt+Shift+C</b> &ndash; Compose new message<br>\
<b>Alt+Shift+Q</b> &ndash; Search for people and groups<br>\
<b>Alt+Shift+<i>n</i></b> &ndash; Jump to conversation <i>n</i>-th from top<br><br>\
<b>Alt+Shift+D</b> &ndash; Toggle conversation details<br>\
<b>Alt+Shift+M</b> &ndash; Mute conversation<br><br>\
<b>Alt+Shift+/</b> &ndash; Display this help dialog<br>\
"


/** Primary event handler **/

document.body.onkeydown = function(event) {
  // Escape key
  if (event.keyCode === 27) {
    focusMessageInput();
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
    case 67:  // C
      compose();
      break;
    case 68:  // D
      toggleInfo();
      break;
    case 77:  // M
      mute();
      break;    
    case 81:  // Q
      focusSearchBar();
      break;    
    case 191: // Fwd. slash
      openHelp();
      break;
    // default:
    //   focusMessageInput();
  }

}


/** Helper functions **/

function getByAttr(tag, attr, value) {
  return document.querySelector(tag + '[' + attr + '="' + value + '"]');
}

function last(arr) {
  return arr.length === 0 ? undefined : arr[arr.length - 1];
}


/** Functionality **/

function jumpToMessage(index) {
  document.querySelectorAll('div[aria-label="Conversations"] a')[index].click();
}

function compose() {
  getByAttr('a', 'title', 'New Message').click();
}

function toggleInfo() {
  getByAttr('a', 'title', 'Conversation Information').click();
}

function mute() {
  getByAttr('input', 'type', 'checkbox').click();
}

function focusSearchBar() {
  getByAttr('input', 'placeholder', 'Search for people and groups').focus();
}

function focusMessageInput() {
  getByAttr('div', 'title', 'Type a message...').click();
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
  }, 100);
}
