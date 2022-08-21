/**
 * Tokyo Afterschool Summoners Wiki
 *
 * For character page only.
 * There may be more than 200 images for one character.
 */
{

const sources = [];

document
.querySelectorAll("select.spriteSelector")
.forEach(selectElem => {
    const optionTexts = [...selectElem.options].map(optElem => optElem.text);
    sources.push(...(new Set(optionTexts))); // remove duplicates
});

const dlOptArr = sources.map(filename => {
    const url = `https://cdn.housamo.xyz/housamo/unity/Android/fg/fg_${filename}.png`;
    filename = `housamo+${filename}.png`;
    return {url, filename};
});
download1by1(dlOptArr);

}
