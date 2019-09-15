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
  }).then(response =>
      response.json()
    )
    .then(json => {
      console.log("JSON:", json);
      return json;
    });
}

tabIdToImages = {}
tabCompletes = {}
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if ("status" in changeInfo && !tab["url"].startsWith("chrome") ) {
    if (changeInfo["status"] === "loading") {
      tabCompletes[tabId] = false;
      let url = tab["url"];
      getAltText(url).then((json) => {
        tabIdToImages[tabId] = json['alt_img_tags'];
        console.log("Images:", tabIdToImages[tabId]);

        if (tabCompletes[tabId]) {
          chrome.tabs.sendMessage(tab.id, { message: "images", images: tabIdToImages[tabId] });
        }
      });



    } else if (changeInfo["status"] === "complete") {
      tabCompletes[tabId] = true;
      if (tabId in tabIdToImages)
        chrome.tabs.sendMessage(tab.id, { message: "images", images: tabIdToImages[tabId] });
    }
  }
});
