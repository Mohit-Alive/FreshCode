export {}

// Listen for SPA navigation using History API changes
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.includes("leetcode.com/problems/")) {
    chrome.tabs
      .sendMessage(details.tabId, {
        type: "NAVIGATION_UPDATE",
        url: details.url
      })
      .catch(() => {
        // Ignore errors if content script is not yet injected
      })
  }
})
