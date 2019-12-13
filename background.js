var lastOpenedTabId = undefined;

chrome.tabs.onActivated.addListener(function (activeInfo) {
    lastOpenedTabId = undefined;
});

const blacklist = [
    "chrome://",
    "view-source:",
    "file://"
];

chrome.tabs.onCreated.addListener(function (tab) {
    if (tab.openerTabId && tab.active) {
        var excluded = tab.url == "";
	if (!excluded) {
            for (var i in blacklist) {
                if (blacklist.hasOwnProperty(i)) {
                    if (tab.url.startsWith(blacklist[i])) {
                        excluded = true;
                    }
                }
            }
        }
        if (!excluded) {
            chrome.tabs.update(tab.openerTabId, {active: true}, function () {
                lastOpenedTabId = tab.id;
            });
        }
    }
    if (lastOpenedTabId) {
        chrome.tabs.get(lastOpenedTabId, function (lastOpenedTab) {
            chrome.tabs.move(tab.id, {index: lastOpenedTab.index});
        });
    }
});
