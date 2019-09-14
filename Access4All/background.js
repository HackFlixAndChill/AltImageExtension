function getAltText(URL) {
   var data = {
       'URL': URL
   };
   var AWSAPIGatewayKey='AESh5ga5gU4CKGzyFpBQkSxwCuIXi6R85PLgitMg'
   var AWSAPIGatewayBase='https://oq2hish015.execute-api.us-east-2.amazonaws.com/default/handle_accessibility'

   return fetch('https://' + AWSAPIGatewayBase + '/default/handle_accessibility', {
       method: 'POST', // *GET, POST, PUT, DELETE, etc.
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           'x-api-key': AWSAPIGatewayKey,
           'Host': AWSAPIGatewayBase
       },
       redirect: 'follow', // manual, *follow, error
       referrer: 'no-referrer', // no-referrer, *client
       body: JSON.stringify(data), // body data type must match "Content-Type" heade
   })
   .then(response => response.json())
   .then(json => console.log(json));
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "post_url" ) {
      var url = sender.tab.url;
      response = getAltText(url);
      sendResponse({farewell: "I finished running.. JUST FYI"});
    }
  }
);
