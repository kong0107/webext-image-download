/**
 * MyReadingManga
 */
{
const path = location.pathname.split("/");
const prefix = "myreadingmanga" + path.join("+");
const dlOptArr = [];

document
.querySelectorAll(".entry-content :not(a) img")
.forEach((imgElem, index) => {
    const url = imgElem.dataset.lazySrc || imgElem.src;
    const filename = prefix + (index + 1) + "." + url.split(".").pop();
    dlOptArr.push({url, filename});
});
downloadMulti(dlOptArr);

}
