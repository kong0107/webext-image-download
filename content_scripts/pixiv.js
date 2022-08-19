/**
 * Pixiv
 */
{
/// For lightbox mode
if(document.body.lastChild.role == "presentation") {
}

/// Click "expand all" button
document
.querySelectorAll("main button div")
.forEach(elem => {
    if(elem.textContent) elem.click();
});

const author = document.querySelector('[href^="/users/"]').href.split("/").pop();

const dlOptArr = [];
document
.querySelectorAll("figure a img")
.forEach(imgElem => {
    const url = imgElem.closest("a").href;
    const filename = `pixiv+${author}+` + url.split("/").pop();
    // const headers = [{name: "Referer", value: location.href}];

    console.debug(url, filename);
    dlOptArr.push({url, filename});
});
downloadMulti(dlOptArr);

}
