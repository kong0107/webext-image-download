/**
 * Pixiv
 */
{
/// For light box mode
if(document.body.lastChild.role == "presentation") {
}

/// Click "expand all" button
document
.querySelectorAll("main button div")
.forEach(elem => {
    if(elem.textContent) elem.click();
});

// document
// .querySelectorAll("figure img")
// .forEach(img => {
//     download(img.src, "abc.jpeg"); // error due to CORS....
// });

/// open in new tabs => fail
// const images = Array.from(
//     document.querySelectorAll("figure img")
// )
// .map(img => img.src.replace("master", "original").replace("_master1200", ""));
// chrome.runtime.sendMessage({
//     command: "createTabs",
//     urls: images,
//     active: false
// });

}
