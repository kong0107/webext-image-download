chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["content.js"]
    });
});

const listeners = {
    loadContentScript: ({site}, {tab}) => {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: [`content_scripts/${site}.js`]
        });
    },
    downloadMulti: ({dlOptArr}) => {
        dlOptArr.forEach(dlOpt =>
            chrome.downloads.download(dlOpt)
        );
    }
};
chrome.runtime.onMessage.addListener(function (request) {
    if(listeners.hasOwnProperty(request.command))
        return listeners[request.command].apply(null, arguments);
    console.error("unknown command " + request.command);
});
