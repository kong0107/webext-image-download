/**
 * Facebook
 *
 * 臉書進入燈箱模式是用 `pushState` ，也就是：
 * * 不會觸發 `popstate` 事件，
 * * 燈箱還沒準備好，
 * 故只好自己持續檢查燈箱狀態看是否有變化。
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
const locSP = new URLSearchParams(location.search);

const lightBox = new EventTarget();
let imgSrc;
setInterval(() => {
    const imgElem = document.querySelector("[role=main] img[data-visualcompletion=media-vc-image]");
    const src = imgElem ? imgElem.src : "";
    if(imgSrc == src) return;
    imgSrc = src;
    lightBox.dispatchEvent(new CustomEvent("imageChange", {detail: {src}}));
    console.debug("lightbox change", src);
}, 100);

switch(location.pathname) {
    case "/media/set/": {
        /**
         * 相簿有不同的顯示形式：
         * 1. 跟個人檔案首頁一樣，封面相片仍然在上方、有顯示其他頁籤。如：
         *    * 個人帳號的所有相簿
         *    * 粉絲專頁的特殊相簿（大頭貼照、封面照片）
         * 2. 說明欄和回應區在右側，左側顯示照片。如：
         *    * 粉絲專頁的一般相簿
         *    * 社團的相簿
         *
         * 於前者的情形，若使用者或專頁沒有另設別名，則下面找到的連結會是 profile.php?id={numeric_id}&sk=photos
         */
        const albumsAnchor = document.querySelector([
            '[href$="&sk=photos"]', // numeric ID of user or fanpage
            '[href$="/photos"]',  // user album, or fanpage native album
            '[href$="/photos/"]', // fanpage created album
            '[href$="/albums/"]' // group album
        ].join(","));
        if(albumsAnchor.search) {
            userID = (new URLSearchParams(albumsAnchor.search)).get("id");
        }
        else {
            const pathParts = albumsAnchor.pathname.split("/");
            userID = pathParts[1] === "groups" ? pathParts[2] : pathParts[1];
        }
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
        let match;
        match = location.pathname.match(/^\/([\w\.]+)\/posts\/(\w+)$/);
        if(match) {
            userID = match[1];
            anchors = [...document.querySelectorAll('[id^=mount] [href*="/photo"] img[src^=https]')]
            .filter(imgElem => !imgElem.closest('ul, a[href*="&set="]'))
            .map(imgElem => imgElem.closest("a"));
        }
    }
}

if(anchors.length) {
    let i = 0;
    const listener = async (event) => {
        const url = event.detail.src;
        if(!url) return;

        const asp = new URLSearchParams(anchors[i].search);
        const filename = `facebook+${userID}+${asp.get("set")}+${asp.get("fbid")}.jpeg`;
        downloadMulti([{url, filename}]);

        await historyGo(-1); // close lightbox mode
        ++i;
        if(i == anchors.length) lightBox.removeEventListener("imageChange", listener);
        else anchors[i].click();
    };
    lightBox.addEventListener("imageChange", listener);
    anchors[0].click();
}

}