chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["content.js"]
    });
});

chrome.runtime.onMessage.addListener((request, sender) => {
    switch(request.command) {
        case "loadContentScript":
            chrome.scripting.executeScript({
                target: {tabId: sender.tab.id},
                files: [`content_scripts/${request.site}.js`]
            });
            break;
        case "downloadMulti":
            request.dlOptArr.forEach(
                dlOpt => chrome.downloads.download(dlOpt)
            );
            break;
        default:
            console.error("unknown command " + request.command);
    }
});
