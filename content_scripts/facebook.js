/**
 * Facebook
 *
 * 準備點進去的連結。要考量的情形：
 * * 有些相同的元素會在其他節點裡（推測是 RWD 需求），故只抓 `body>div[id^=mount_0_0_]` 裡的。
 * * 封面照片的連結有 `a[aria-label="Link to open profile cover photo"]` ，應排除。
 * * 通知區有 `img[src^="data:image/svg+xml"]` ，應排除。
 * * 後面迴圈應以這個連結列表為主。若按「下一頁」的話有可能進入影片。
 */
{
let userID;
let anchors = [];
const locSP = new URLSearchParams(document.location.search);

const lightBox = new EventTarget();
let imgSrc;
setInterval(() => {
    const imgElem = document.querySelector("[role=main] img[data-visualcompletion=media-vc-image]");
    const src = imgElem ? imgElem.src : "";
    if(imgSrc == src) return;
    imgSrc = src;
    lightBox.dispatchEvent(new CustomEvent("imageChange", {detail: {src}}));
}, 100);

switch(location.pathname) {
    case "/media/set/": {
        const userTab = document.querySelector("a[role=tab]");
        userID = userTab.search ? userTab.search.substring(4) : userTab.pathname.split("/")[1];
        anchors = [...document.querySelectorAll("a[href]")]
        .filter(anchor => (new URLSearchParams(anchor.search)).get("set") === locSP.get("set"));
        break;
    }
    case "/permalink.php": {
        userID = locSP.get("id");
        anchors = [...document.querySelectorAll('[id^=mount] [href*="/photo"] img[src^=https]')]
        .filter(imgElem => !imgElem.closest("ul"))
        .map(imgElem => imgElem.closest("a"));
        break;
    }
    default: {
        const match = location.pathname.match(/^\/([\w\.]+)\/posts\/(\w+)$/);
        if(match) {
            userID = match[1];
            anchors = [...document.querySelectorAll('[id^=mount] [href*="/photo"] img[src^=https]')]
            .filter(imgElem => !imgElem.closest("ul"))
            .map(imgElem => imgElem.closest("a"));
        }
    }
}

if(anchors.length) {
    let i = 0;
    const listener = event => {
        const url = event.detail.src;
        if(!url) return;

        const asp = new URLSearchParams(anchors[i].search);
        const filename = `facebook+${userID}+${asp.get("set")}+${asp.get("fbid")}.jpeg`;
        downloadMulti([{url, filename}]);

        const btnClose = document.querySelector("[aria-label]");
        btnClose.click();

        ++i;
        if(i == anchors.length) lightBox.removeEventListener("imageChange", listener);
        else setTimeout(() => anchors[i].click(), 100);
    };
    lightBox.addEventListener("imageChange", listener);
    anchors[0].click();
}

}