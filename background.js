var lastOpenedTabId = undefined;

chrome.tabs.onActivated.addListener(function (activeInfo) {
    lastOpenedTabId = undefined;
});

chrome.tabs.onCreated.addListener(function (tab) {
    if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("view-source:") && tab.openerTabId && tab.active) {
        chrome.tabs.update(tab.openerTabId, {active: true}, function () {
            lastOpenedTabId = tab.id;
        });
    }
    if (lastOpenedTabId) {
        chrome.tabs.get(lastOpenedTabId, function (lastOpenedTab) {
            chrome.tabs.move(tab.id, {index: lastOpenedTab.index});
        });
    }
});
