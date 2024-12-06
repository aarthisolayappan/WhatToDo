chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openPopup") {
        // Open the extension popup as a new window
        chrome.windows.create({
            url: "popup.html",  // Popup URL
            type: "popup",      // Open it as a popup
            width: 800,         // Width of the popup window
            height: 600,        // Height of the popup window
            top: 100,           // Position it 100px from the top
            left: 100           // Position it 100px from the left
        });
    }
});
