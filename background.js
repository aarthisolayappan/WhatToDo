chrome.runtime.onInstalled.addListener(() => {
    console.log('Text Selection Popup Extension Installed');
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTabs") {
      chrome.tabs.query({}, function(tabs) {
        sendResponse({ tabs: tabs });
      });
      return true;
    }
  });
  