chrome.action.onClicked.addListener(tab => {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["content.js"]
    });
});

const listeners = {
    loadContentScript: ({site}, {tab}, sendResponse) => {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: [`content_scripts/${site}.js`]
        }, ([result]) => sendResponse(result));
        return true;
    },
    download: ({dlOpt}, _, cb) => {
        return download(dlOpt).then(cb, cb);
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


/**
 *
 * @param {DownloadOptions} options
 * @returns {Promise} DownloadItem
 */
function download(options) {
    return new Promise(async(resolve, reject) => {
        const id = await chrome.downloads.download(options);
        if(!id) return reject(chrome.runtime.lastError);

        const listener = async(delta) => {
            if(delta.id !== id || !delta.state || delta.state === "in_progress") return;
            chrome.downloads.onChanged.removeListener(listener);
            const [item] = await chrome.downloads.search({id});
            if(item.error) reject(item.error);
            else resolve(item);
        };
        chrome.downloads.onChanged.addListener(listener);
    });
}
