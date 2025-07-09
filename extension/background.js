chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString(),
  }, ([result]) => {
    chrome.storage.local.set({ selectedText: result.result });
  });
});