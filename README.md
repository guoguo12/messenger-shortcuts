# Keyboard Shortcuts for Messenger

This Chrome extension/Firefox add-on adds keyboard shortcuts to the [Messenger web app](http://messenger.com).

## Installation
To install, head over to the [Chrome Web Store](https://chrome.google.com/webstore/detail/keyboard-shortcuts-for-me/elgfaolomlhhmppjdicpgpmglkllebfb?hl=en-US&gl=US) or [Firefox Extension Store](https://addons.mozilla.org/en-US/firefox/addon/keyboardshortcutsformessenger/).

Alternatively, you can clone this repo and load the `src/` directory as an [unpacked extension](https://developer.chrome.com/extensions/getstarted#unpacked) or [temporary add-on](https://developer.mozilla.org/en-US/docs/Tools/about%3Adebugging#Enabling_add-on_debugging).

## List of shortcuts

**As of December 20, 2020, some shortcuts are broken due to a recent UI update. See [#27](https://github.com/guoguo12/messenger-shortcuts/issues/27).**

On macOS, replace `Alt` with `Ctrl`.

### General
* `Esc` &ndash; Move cursor to message input field (or cancel search)
* `Alt+Shift+C` &ndash; Compose new message
* `Alt+Shift+Q` &ndash; Search Messenger

### Jumping
* `Alt+Shift+n` &ndash; Jump to conversation <i>n</i>-th from top
  * On macOS, this uses `Alt` not `Ctrl`.
* `Alt+Up/Down` &ndash; Jump to conversation one above/below*

### Conversation
* `Alt+Shift+D` &ndash; Toggle conversation details
* `Alt+Shift+A` &ndash; Open conversation actions menu
* `Alt+Shift+E` &ndash; Send a like/emoji
* `Alt+Shift+F` &ndash; Search in current conversation

### Help
* `Alt+Shift+/` &ndash; Display help dialog

*This one works even without the extension.

## License

[GNU GPL v2.0](https://www.gnu.org/licenses/gpl-2.0.txt).
