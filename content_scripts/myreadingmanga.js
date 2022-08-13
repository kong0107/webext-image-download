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
    const ext = url.split(".").pop();
    const filename = prefix + (index + 1) + "." + ext;
    dlOptArr.push({url, filename});
});
downloadMulti(dlOptArr);

}
