console.debug('content_scripts/plurk.js');
/**
 * Plurk
 *
 * URL format: https://www.plurk.com/p/{plurk_id}
 *
 * structure:
 *  article#permanent-plurk
		div.plurk[data-type=plurk][data-respcount]
			.avatar
			.user
			.time
			.content
				a:not([target]) > img:not(.emoticon_my, .emoticon)
		div#plurk_responses.plurk_box
			div.plurkresponse[data-type=response][data-rid]**
				.avatar
				.user
				.content
					a:not([target]) > img:not(.emoticon_my, .emoticon)
 *
 * 分為主噗和回應。
 * 存檔格式：
 * * 主噗： plurk+{plurk_author_id}+{plurk_id}+{counter}
 * * 回應： plurk+{plurk_author_id}+{plurk_id}+{responser_id}+{response_id}+{counter}
 *
 * <img> 相關的結構
 * :not(a) > img:is(.emoticon, .emoticon_my) - 表情符號
 * a.ex_link.meta.plink > img - 連往其他噗
 * a.ex_link.meta[target] > img - 連往外部網站
 * a.ex_link.pictrueservices.rendered > img - 要下載的圖片
 *
 * 在噗浪上傳的圖片， a[href] 和 img[src] 會相同；反之 a[href] 是外部， img[src] 會是噗浪的連結。
 *
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message) {
		case 'getDownloadOptions':
			try {
				const container = document.querySelector('article#permanent-plurk');
				const main = container.querySelector('div.plurk[data-type=plurk]');
				const userid = main.querySelector('.user a').href.split('/').pop();
				const plurk_id = parseInt(main.dataset.pid).toString(36);

				const imgList = [];
				main.querySelectorAll('.content a.rendered > img').forEach((imgElem, index) => {
					const ext = imgElem.src.slice(imgElem.src.lastIndexOf('.'));
					imgList.push({
						url: imgElem.src,
						filename: `plurk+${userid}+${plurk_id}+${index + 1}${ext}`
					});
				});

				container.querySelectorAll('#plurk_responses .response[data-rid]').forEach(resContainer => {
					resContainer.querySelectorAll('.content a.rendered > img').forEach((imgElem, index) => {
						const ext = imgElem.src.slice(imgElem.src.lastIndexOf('.'));
						const rid = resContainer.dataset.rid; // decimal
						imgList.push({
							url: imgElem.src,
							filename: `plurk+${userid}+${plurk_id}+${rid}+${index + 1}${ext}`
						});
					});
				});

				sendResponse(imgList);
			}
			catch(e) {
				console.warn("Error in Plurk content script:", e);
				sendResponse([]);
			}
			return false;
		default:
			return console.warn("Unknown message:", message) && !1;
	}
});
