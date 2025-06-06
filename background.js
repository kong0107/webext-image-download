
browser.pageAction.onClicked.addListener(tab => {
    console.debug(tab);
    browser.tabs.sendMessage(tab.id, 'getDownloadOptions')
    .then(downloadOptionsArray => {
        console.debug(downloadOptionsArray);
        let queue = Promise.resolve();
        for (const options of downloadOptionsArray) {
            queue = queue.then(() => {
                browser.downloads.download(options)
            });
        }
    });
});
