/**
 * Facebook
 */
{
// const path = location.pathname + location.search;
let match, anchors = [];

const lightBox = new EventTarget();

let imgSrc;
setInterval(() => {
    const imgElem = [...document.querySelectorAll("[role=main] img[data-visualcompletion=media-vc-image]")].pop();
    const src = imgElem ? imgElem.src : "";
    if(imgSrc == src) return;
    imgSrc = src;
    lightBox.dispatchEvent(new CustomEvent("imageChange", {detail: {src}}));
}, 100);

match = location.pathname.match(/^\/([\w\.]+)\/posts\/pfbid02(\w+)$/);
if(match) {
    anchors = [
        ...document.querySelectorAll('[href*="/photo"] img[src^=https]')
    ]
    .filter(img => !img.closest("ul"))
    .map(img => img.closest("a"));
}

if(anchors.length) {
    let i = 0;
    const prefix = "facebook" + location.pathname.replace(/\//g, "+");
    const listener = event => {
        const url = event.detail.src;
        if(!url) return;
        const filename = `${prefix}+${i+1}.jpeg`;
        downloadMulti([{url, filename}]);

        ++i;
        if(i == anchors.length) {
            lightBox.removeEventListener("imageChange", listener);
            const btnClose = document.querySelector("[aria-label]");
            btnClose.click();
        }
        else {
            const btnNext = document.querySelector('[data-name=media-viewer-nav-container]').lastChild.lastChild;
            btnNext.click();
        }
    };
    lightBox.addEventListener("imageChange", listener);
    anchors[0].click();

}


}