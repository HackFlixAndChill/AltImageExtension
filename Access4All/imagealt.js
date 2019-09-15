chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
	if (request.message === "images") {
		var images = request.images;
		// get all image tags; img.src is the key in images
		var elements = document.getElementsByTagName("img");
		for (var img of elements) {
			// first check if backend returned an image alt text
			if (img.src in images) {
				// value is the new alt text
				img.alt = images[img.src];
			}
		}
	}
});