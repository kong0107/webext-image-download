console.debug('content_script/twitter.js');

setInterval(() => {
	document.querySelector('[href*="/photo/"] + button')?.click();

	/// 影片靜態預覽圖原本是用 tiny ，改成 small 。
	const blurredBG = document.querySelector('[style*="&name=tiny"]');
	if (blurredBG && blurredBG.style.backgroundImage) {
		blurredBG.style.backgroundImage = blurredBG.style.backgroundImage.replace(/&name=tiny/g, '&name=small');
	}

	/**
	 * 進入 `/status/\d+/video/\d+` 頁面時，直接觸發點擊。
	 * 只有同站換頁時才有效，直接開網頁仍（可能）會被瀏覽器擋下影片自動播放。
	 * `[data-testid=swipe-to-dismiss]` 初始只會載入自身和前一後一，故不可與 `index` 直接換算。
	 */
	if (/^\/[^/]+\/status\/\d+\/video\/\d+$/.test(location.pathname)) {
		const slides = document.querySelectorAll('[data-testid=swipe-to-dismiss]');
		for (let i = 0; i < slides.length; ++i) {
			const slide = slides[i];
			if (slide.getBoundingClientRect().x) continue; // 不是當前的 slide
			if (! slide.querySelector('video'))
				slide.querySelector('button')?.click();
			break;
		}
	}
}, 100);

/// 拿掉影片預覽圖的模糊效果
for (const sheet of document.styleSheets) {
	console.debug('Processing stylesheet:', sheet);
	try {
		for (const rule of sheet.cssRules) {
			if (rule.style?.filter?.includes('blur')) {
				rule.style.filter = rule.style.filter.replace(/blur\([^)]+\)\s*/g, '').trim();
				// console.debug('Removed blur filter from:', rule);
			}
		}
	} catch (e) {
		// 有些樣式表因同源政策無法存取
		// console.warn(`無法存取樣式表：${sheet.href}`, e);
	}
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message) {
		case 'getDownloadOptions':
			const pathMatch = location.pathname.match(/^\/([^/]+)\/status\/(\d+)(?:\/([^/]+)\/(\d+))?$/);
			if (! pathMatch) return console.warn("Not a valid tweet URL") && !1;
			const [, user, tweet, type, index] = pathMatch;
			const prefix = `x+${user}+${tweet}`;
			switch (type) {
				case undefined: { /// 一篇推文，可能有多個不同類型的媒體
					const article = document.querySelector('article');
					if (! article) return console.warn('No <article /> found') && !1;
					const targets = article.querySelectorAll('[data-testid=tweetPhoto] :is(video, img:not([src*=ext_tw_video_thumb]))');
					const result = [];
					for (let i = 0; i < targets.length; ++i) {
						const url = targets[i].src.replace(/&name=[^&]+/, '&name=large'); // 改成 `orig` 似乎即為原圖，但我自己 large 就夠大了
						const format = url.match(/[?&]format=([^&]+)/)?.[1] || 'jpeg';
						const filename = `${prefix}+${i + 1}.${format}`;
						result.push({url, filename});
					}
					console.debug(result);
					sendResponse(result);
					return false;
				}
				case 'photo': {
					const slides = document.querySelectorAll('[data-testid=swipe-to-dismiss]');
					for (let i = 0; i < slides.length; ++i) {
						const slide = slides[i];
						if (slide.getBoundingClientRect().x) continue; // 不是當前的 slide
						const url = slide.querySelector('img').src.replace(/&name=[^&]+/, '&name=large');
						const format = url.match(/[?&]format=([^&]+)/)?.[1] || 'jpeg';
						const filename = `${prefix}+${index}.${format}`;
						sendResponse([{url, filename}]);
						return false;
					}
					return false;
				}
				case 'video': {
                    // todo
					return false;
				}
				default: return console.warn(`Unknown type: ${type}`) && !1;
			}
		default:
			return console.warn("Unknown message:", message) && !1;
	}
});
