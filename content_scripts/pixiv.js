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

document
.querySelectorAll("figure img")
.forEach(img => {
    chrome.runtime.sendMessage({
        command: "download",
        urls: [img.src]
    });
});

}
