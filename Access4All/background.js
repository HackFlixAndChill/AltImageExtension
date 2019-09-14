chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "post_url" ) {
      console.log(request.message);
      var url = sender.tab.url;

      sendResponse({farewell: "I finished running.. JUST FYI"});
    }
  }
);
