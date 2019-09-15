// global.fetch = require("node-fetch");

function getAltText(URL) {
  var data = {
    'URL': URL
  };
  var AWSAPIGatewayKey = 'AESh5ga5gU4CKGzyFpBQkSxwCuIXi6R85PLgitMg'
  var AWSAPIGatewayBase = 'oq2hish015.execute-api.us-east-2.amazonaws.com'

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
    .then(response => {
      return response.json()
    })
    .then(json => {
      console.log("JSON:", json);
      return json;
    });
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "post_url") {
      var url = sender.tab.url;

      getAltText(url).then((json) => {
        images = json['alt_img_tags']
        console.log("Images:", images);

        sendResponse({ images: images });
      });

      return true;
    }
  }
);

// console.log(getAltText("https://moz.com/learn/seo/alt-text"));