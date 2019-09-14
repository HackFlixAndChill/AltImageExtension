const apigClientFactory = require('aws-api-gateway-client').default;

/**
 * get dictionary of image alt texts in form {<imgname: string>: <alttext: string>}
 * @param {URL of the website} URL 
 */
function getAltText(URL) {
    var apigClient = apigClientFactory.newClient({
        apiKey: process.env.AWSAPIGatewayKey,
        invokeUrl: process.env.AWSAPIGatewayBase,
    });

    var params = {
        FunctionName: 'handle_accessibility',
        Payload: JSON.stringify({ "Test": "Hello world" })
    };

    var additionalParams = {};

    var body = {
        "URL": URL
    };

    apigClient.invokeApi(params = params, pathTemplate = '', method = "GET", additionalParams, body)
        .then(function (result) {
            return result;
        }).catch(function (result) {
            console.error(result);
        });
}

export default getAltText;