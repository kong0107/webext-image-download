{ // wrap in curly braces to avoid duplicate declaration

const sites = [ // in reverse alphabetical order
    ["twitter", url => url.host.endsWith("twitter.com")],
    ["plurk", url => url.host == "www.plurk.com"],
    // ["pixiv", url => url.href.startsWith("https://www.pixiv.net/artworks/")],
    ["myreadingmanga", url => url.host == "myreadingmanga.info"],
    ["fanbox", url => url.host.endsWith("fanbox.cc")],
    ["facebook", url => url.host.endsWith("facebook.com")]
];
const siteInfo = sites.find(([, tester]) => tester(location));

if(siteInfo) {
    chrome.runtime.sendMessage({
        command: "loadContentScript",
        site: siteInfo[0]
    });
}
else { // for sites do not match, download all images
    const selectors = [
        "main",
        ".main",
        "article",
        "body"
    ];
    let containers;
    for(const selector of selectors) {
        containers = document.querySelectorAll(selector);
        if(containers.length) break;
    }

    const urls = new Set();
    containers.forEach(container => {
        container
        .querySelectorAll("img")
        .forEach(imgElem => urls.add(imgElem.src));

        /// find background images
        container
        .querySelectorAll("*")
        .forEach(elem => {
            const cssValues = getComputedStyle(elem).backgroundImage;
            const matches = [...cssValues.matchAll(/url\("([^"]+)"\)/g)];
            matches.forEach(m => urls.add(m[1]));
        });
    });
    downloadMulti(Array.from(urls).map(url => ({url})));
}

}


/**
 * Funcions also used in other content scripts.
 */

/**
 * Send a message to background to download multiple files.
 * @param {DownloadOptions[]} dlOptArr
 * @returns {Promise}
 */
function downloadMulti(dlOptArr) {
    return chrome.runtime.sendMessage({
        command: "downloadMulti",
        dlOptArr
    });
}

/**
 * Promisified version of `history.go`.
 * @param {integer} delta
 * @returns {Promise} PopStateEvent
 */
function historyGo(delta) {
    return new Promise(resolve => {
        const listener = event => {
            removeEventListener("popstate", listener);
            resolve(event);
        };
        addEventListener("popstate", listener);
        history.go(delta);
    });
}
