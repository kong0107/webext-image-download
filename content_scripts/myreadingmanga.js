/**
 * MyReadingManga
 */
{
document
.querySelectorAll(".entry-content :not(a) img")
.forEach(img => {
    download(img.src);
});

}
