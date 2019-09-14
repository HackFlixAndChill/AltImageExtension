window.onload = function() {
	chrome.runtime.sendMessage({message: "post_url"}, function(response) {
	  var images = response.images;
		var elements = document.getElementById("img").src;
		for (var img in images) {
			
		}

	});
}
