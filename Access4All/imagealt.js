window.onload = function () {
	chrome.runtime.sendMessage({ message: "post_url" }, function (response) {
		// dict of form {<imgURL: string> : <altText: string>}
		var images = response.images;

		// get all image tags; img.src is the key in images
		var elements = document.getElementsByTagName("img");

		for (var img of elements) {
			// first check if backend returned an image alt text
			if (img.src in images) {
				// value is the new alt text
				img.alt = images[img.src];
			}
		}
	});
}
