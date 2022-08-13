function download(resource, fileName) {
    return fetch(resource)
    .then(res => res.blob())
    .then(blob => {
        if(!blob.size) return console.error("no content");
        const url = URL.createObjectURL(blob);
        directDownload(url, fileName);
        URL.revokeObjectURL(url);
    });
}

function directDownload(url, fileName) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

}

(new Map([
    ["twitter", url => url.host.endsWith("twitter.com")],
    ["pixiv", url => url.href.startsWith("https://www.pixiv.net/artworks/")]
])).forEach((filter, site) => {
    if(filter(location)) {
        chrome.runtime.sendMessage({
            command: "loadContentScript",
            site
        });
    }
});
