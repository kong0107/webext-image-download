(new Map([
    ["twitter", url => url.host.endsWith("twitter.com")],
    ["pixiv", url => url.href.startsWith("https://www.pixiv.net/artworks/")],
    ["plurk", url => url.host == "www.plurk.com"],
    ["myreadingmanga", url => url.host == "myreadingmanga.info"]
])).forEach((filter, site) => {
    if(filter(location)) {
        chrome.runtime.sendMessage({
            command: "loadContentScript",
            site
        });
    }
});

function downloadMulti(dlOptArr) {
    chrome.runtime.sendMessage({
        command: "downloadMulti",
        dlOptArr
    });
}
