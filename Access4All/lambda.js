global.fetch = require("node-fetch");

function getAltTextTwo(URL) {
    var data = {
        'URL': URL
    };
    return fetch('https://' + process.env.AWSAPIGatewayBase + '/default/handle_accessibility', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': process.env.AWSAPIGatewayKey,
            'Host': process.env.AWSAPIGatewayBase
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" heade
    })
    .then(response => response.json())
    .then(json => console.log(json));
}

//getAltTextTwo("google.com");