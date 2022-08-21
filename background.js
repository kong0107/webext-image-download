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
    download: async({dlOpt}, {}, sendResponse) => {
        const dlID = await chrome.downloads.download(dlOpt);
        if(!dlID) return sendResponse(chrome.runtime.lastError);

        const dl = new DownloadItemExt(dlID);
        const listener = async() => {
            const [dlItem] = await chrome.downloads.search({id: dlID});
            sendResponse(dlItem);
        };
        dl.addEventListener("complete", listener);
        dl.addEventListener("interrupted", listener);
    },
    downloadMulti: ({dlOptArr}) => {
        dlOptArr.forEach(dlOpt =>
            chrome.downloads.download(dlOpt)
        );
    }
};
chrome.runtime.onMessage.addListener(function (request) {
    if(listeners.hasOwnProperty(request.command))
        return !!listeners[request.command].apply(null, arguments);
    console.error("unknown command " + request.command);
});


class DownloadItemExt extends EventTarget {
    static downloads = new Map();
    constructor(id) {
        super();
        DownloadItemExt.downloads.set(id, this);
    }
}

chrome.downloads.onChanged.addListener(delta => {
    if(delta.state) {
        const dl = DownloadItemExt.downloads.get(delta.id);
        if(dl) dl.dispatchEvent(new CustomEvent(delta.state.current, {detail: delta}));
    }
});
