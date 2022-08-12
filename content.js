function download(resource, fileName) {
    return fetch(resource)
    .then(res => res.blob())
    .then(blob => {
        console.debug(blob.size);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName || "";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    });
}

/**
 * Twitter
 *
 * A tweet may be a reply of another tweet. In this case, the target is not first <article>.
 * To find it, searching for the <a>{time}</a> whose `href` attribute is the same as the page URL is a good idea.
 *
 * In light box mode, the above method ends up with the thumbnail of the enlarged image.
 * But that also works for our requirement.
 */
if(location.host.endsWith("twitter.com")) {
    const match = location.pathname.match(/^\/(\w+)\/status\/(\d+)(\/photo\/(\d+))?/);
    if(match) {
        document
        .querySelector(`[href="${location.pathname}"]`)
        .closest("article")
        .querySelectorAll("[href*=photo] img")
        .forEach((img, index) => {
            if(match[3] && match[4] != index + 1) return; ///< For light box mode, just download the enlarged image.
            const imgMatch = img.src.match(/\?format=(\w+)&name=\w+$/);
            if(!imgMatch) console.error("unkown image URL: " + img.src);
            const ext = "." + imgMatch[1];
            const imgSrc = img.src.replace(imgMatch[0], ext);
            const fileName = `twitter+${match[1]}+${match[2]}+${index+1}${ext}`;
            download(imgSrc, fileName);
        });
    }
}

/**
 * Pixiv
 */
// if(location.href.startsWith("https://www.pixiv.net/artworks/")) {
//     console.debug("Pixiv");

//     /// For light box mode
//     if(document.body.lastChild.role == "presentation") {
//     }

//     /// Click "expand all" button
//     document
//     .querySelectorAll("main button div")
//     .forEach(elem => {
//         if(elem.textContent) elem.click();
//     });

//     document
//     .querySelectorAll("figure img")
//     .forEach(img => {
//         download(img.src); // error due to CORS....
//     });
// }

