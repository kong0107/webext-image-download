{ // wrap in curly braces to avoid duplicate declaration

console.debug("content.js loaded", location.href);

const sites = [ // in reverse alphabetical order
    ["twitter", url => url.host.endsWith("x.com")],
    ["plurk", url => url.host == "www.plurk.com"],
    ["pixiv", url => url.href.startsWith("https://www.pixiv.net/artworks/")],
    ["myreadingmanga", url => url.host == "myreadingmanga.info"],
    ["housamo.wiki", url => url.host == "housamo.wiki"],
    ["fanbox", url => url.host.endsWith("fanbox.cc")],
    ["facebook", url => url.host.endsWith("facebook.com")]
];
const siteInfo = sites.find(([, tester]) => tester(location));

if(siteInfo) {
    browser.runtime.sendMessage({
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
 * Send a message to background to download multiple files at the same time.
 * @param {DownloadOptions[]} dlOptArr
 * @returns {Promise}
 */
function downloadMulti(dlOptArr) {
    return browser.runtime.sendMessage({
        command: "downloadMulti",
        dlOptArr
    });
}

/**
 * For each URL to download, send a message to background and wait until it's finished (either complete or interrupted).
 * Close the tab will stop the following download. This is on purpose.
 * @param {DownloadOptions[]} dlOptArr
 * @returns {Promise}
 */
async function download1by1(dlOptArr) {
    for(let i = 0; i < dlOptArr.length; ++i) {
        const response = await browser.runtime.sendMessage({
            command: "download",
            dlOpt: dlOptArr[i]
        });
        console.debug(response);
    }
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
