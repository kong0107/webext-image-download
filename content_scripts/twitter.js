/**
 * Twitter
 *
 * A tweet may be a reply of another tweet. In this case, the target is not first <article>.
 * To find it, searching for the <a>{time}</a> whose `href` attribute is the same as the page URL is a good idea.
 *
 * In light box mode, the above method ends up with the thumbnail of the enlarged image.
 * But that also works for our requirement.
 */
{
const match = location.pathname.match(/^\/(\w+)\/status\/(\d+)(\/photo\/(\d+))?/);
if(match) {
    const dlOptArr = [];
    document
    .querySelector(`[href="${location.pathname}"]`)
    .closest("article")
    .querySelectorAll("[href*=photo] img")
    .forEach((img, index) => {
        if(match[3] && match[4] != index + 1) return; ///< For light box mode, just download the enlarged image.
        const imgMatch = img.src.match(/\?format=(\w+)&name=\w+$/);
        if(!imgMatch) console.error("unkown image URL: " + img.src);
        const ext = "." + imgMatch[1];
        const url = img.src.replace(imgMatch[0], ext);
        const filename = `twitter+${match[1]}+${match[2]}+${index+1}${ext}`;
        dlOptArr.push({url, filename});
    });
    downloadMulti(dlOptArr);
}

}
