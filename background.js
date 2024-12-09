chrome.runtime.onInstalled.addListener(() => {
    console.log('Text Selection Popup Extension Installed');
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTabs") {
      // Get the current tabs and send them back to the content script
      chrome.tabs.query({}, function(tabs) {
        sendResponse({ tabs: tabs });
      });
      // Indicate that the response will be sent asynchronously
      return true;
    }
  });
  