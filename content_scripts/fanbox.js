/**
 * Fanbox
 */
{
const author = location.host.split(".")[0];
const post = location.pathname.split("/").pop();
const prefix = `fanbox+${author}+${post}+`;
const dlOptArr = [];

document
.querySelectorAll("article a")
.forEach((anchor, index) => {
    const url = anchor.href;
    const ext = url.split(".").pop();
    const filename = prefix + (index + 1) + "." + ext;
    dlOptArr.push({url, filename});
});
downloadMulti(dlOptArr);

}
