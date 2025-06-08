console.debug('content_scripts/pixiv.js');

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message) {
		case 'getDownloadOptions':
			let promise;
			const btnExpand = document.querySelector("main button div:not(:has(svg),:empty)");
			if (btnExpand) {
				btnExpand.click();
				promise = new Promise(resolve => {
					const intervalID = setInterval(() => {
						const imgList = document.querySelectorAll('main figure img');
						if (imgList.length > 1) {
							clearInterval(intervalID);
							resolve(imgList);
						}
					});
				});
			}
			else promise = Promise.resolve(document.querySelectorAll('main figure img'));

			const authorElem = document.querySelector('aside h2 a');
			const authorID = authorElem.dataset.gtmValue;
			const authorName = authorElem.querySelector('div').title;
			const artID = location.pathname.split('/').pop();

			const headers = [{name: 'Referer', value: location.href}];
			promise.then(imgList => {
				console.debug(imgList);
				sendResponse(
					[...imgList].map((img, index) => {
						const ext = img.src.slice(img.src.lastIndexOf('.'));
						return {
							url: img.src,
							filename: `pixiv+${authorName}(${authorID})+${artID}+${index}${ext}`,
							headers
						};
					})
				);
			});

			return true;
		default:
			return console.warn("Unknown message:", message) && !1;
	}
});
