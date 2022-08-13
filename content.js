(new Map([ // in reverse alphabetical order
    ["twitter", url => url.host.endsWith("twitter.com")],
    ["plurk", url => url.host == "www.plurk.com"],
    ["pixiv", url => url.href.startsWith("https://www.pixiv.net/artworks/")],
    ["myreadingmanga", url => url.host == "myreadingmanga.info"],
    ["fanbox", url => url.host.endsWith("fanbox.cc")]
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
