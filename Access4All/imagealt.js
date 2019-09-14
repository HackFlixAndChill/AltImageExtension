window.onload = function() {
	chrome.runtime.sendMessage({message: "post_url"}, function(response) {
	  console.log(response.farewell);
	});
}
