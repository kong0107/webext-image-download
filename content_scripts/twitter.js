/**
 * Twitter
 *
 * A tweet may be a reply of another tweet. In this case, the target is not first <article>.
 * To find it, searching for the <a>{time}</a> whose `href` attribute is the same as the page URL is a good idea.
 * However, Twitter does not auto-redirect to right URL if userID is wrong only in upper/lower case;
 * therefore matching should be case-insensitive and then use the <a href> to get the right userID.
 *
 * In lightbox mode, the above method ends up with the thumbnail of the enlarged image.
 * But that also works for our requirement.
 */
{
const match = location.pathname.match(/^\/(\w+)\/status\/(\d+)(\/photo\/(\d+))?/);
if(match) {
    const dlOptArr = [];
    const timeLink = document.querySelector(`[href="${location.pathname}" i]`);
    const userID = timeLink.pathname.split("/")[1];

    timeLink
    .closest("article")
    .querySelectorAll("[href*=photo] img")
    .forEach((img, index) => {
        if(match[3] && match[4] != index + 1) return; ///< For lightbox mode, just download the enlarged image.
        const imgMatch = img.src.match(/\?format=(\w+)&name=\w+$/);
        if(!imgMatch) console.error("unkown image URL: " + img.src);
        const ext = "." + imgMatch[1];
        const url = img.src.replace(imgMatch[0], ext);
        const filename = `twitter+${userID}+${match[2]}+${index+1}${ext}`;
        dlOptArr.push({url, filename});
    });
    downloadMulti(dlOptArr);
}

}
