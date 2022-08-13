/**
 * Plurk
 *
 * 分為主噗和回應。
 * 存檔格式：
 * * 主噗： plurk+{plurk_author_id}+{plurk_id}+{counter}
 * * 回應： plurk+{plurk_author_id}+{plurk_id}+{responser_id}+{response_id}+{counter}
 *
 * 不在 <a> 裡面的是表情符號；在 <a target="_blank"> 裡面的則是大頭像和外部連結；
 * 但連到其他噗的連結則沒有 [target] ，因此仍要檢查。
 */
{
const match = location.pathname.match(/^\/(m\/)?p\/(\w+)/);
if(match) {
    // const isMobile = match[1];
    const plurkID = match[2]; // in base36
    const mainPlurk = document.querySelector(".plurk");
    const author = mainPlurk.querySelector("a").href.split("/").pop();
    const prefix = `plurk+${author}+${plurkID}+`;

    const dlOptArr = getImages(mainPlurk, prefix);
    document
    .querySelectorAll(".response")
    .forEach(container => {
        const rid = container.dataset.rid; // decimal
        const responser = container.querySelector("a").href.split("/").pop();
        dlOptArr.push(...getImages(container, `${prefix}${responser}+${rid}+`));
    })

    downloadMulti(dlOptArr);
}

function getImages(elem, filenamePrefix) {
    const urls = [];
    elem.querySelectorAll("a:not([target]) img").forEach(imgElem => {
        const a = imgElem.closest("a");
        if(a.href == imgElem.alt) urls.push(a.href);
    });

    return urls.map((url, index) => {
        const ext = url.split(".").pop();
        const filename = filenamePrefix + (index + 1) + "." + ext;
        return {url, filename};
    });
}

}
