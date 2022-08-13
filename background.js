chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["content.js"]
    });
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
    switch(request.command) {
        case "loadContentScript":
            chrome.scripting.executeScript({
                target: {tabId: sender.tab.id},
                files: [`content_scripts/${request.site}.js`]
            });
            break;
        case "createTabs":
            request.urls.forEach(url => chrome.tabs.create({
                url,
                openerTabId: sender.tab.id,
                active: (typeof request.active === "undefined") ? true : request.active
            }));
        default:
            console.error("unknown command " + request.command);
    }

    if(callback instanceof Function)
        return (callback() instanceof Promise);
});
