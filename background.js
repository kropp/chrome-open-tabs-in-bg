var lastOpenedTabId = undefined;

chrome.tabs.onActivated.addListener(function (activeInfo) {
    lastOpenedTabId = undefined;
});

const blacklist = [
    "chrome://",
    "view-source:",
    "file://"
];

function switchToOpener(tab) {
    let url = tab.url || tab.pendingUrl || "";
    var excluded = false;
    if (!excluded) {
        for (var i in blacklist) {
            if (blacklist.hasOwnProperty(i)) {
                if (url.startsWith(blacklist[i])) {
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

chrome.tabs.onCreated.addListener(function (tab) {
    if (tab.openerTabId && tab.active) {
	switchToOpener(tab);
    }
    if (lastOpenedTabId) {
        chrome.tabs.get(lastOpenedTabId, function (lastOpenedTab) {
            chrome.tabs.move(tab.id, {index: lastOpenedTab.index});
        });
    }
});
