global.fetch = require("node-fetch");

function superEncodeURI(url) {

    var encodedStr = '', encodeChars = ["(", ")"];
    url = encodeURIComponent(url);

    for (var i = 0, len = url.length; i < len; i++) {
        if (encodeChars.indexOf(url[i]) >= 0) {
            var hex = parseInt(url.charCodeAt(i)).toString(16);
            encodedStr += '%' + hex;
        }
        else {
            encodedStr += url[i];
        }
    }

    return encodedStr;
}

function getContrastColorsBackground(C1, C2, isBackgroundTested) {
    var queryString = 'https://app.contrast-finder.org/result.html?' + 'foreground=' +
        superEncodeURI(C1) + '&background=' + superEncodeURI(C2) + '&ratio=3&isBackgroundTested=' + isBackgroundTested.toString() + '&algo=Rgb';

    console.log("query=", queryString);

    fetch(queryString)
        .then(response => response.text())
        .then(response => {
            // get regex
            const r = /<li.*?class=\"color-value-rgb\".*?>(.+?)<\/li>/g;

            var result, rgbColors = [];
            while ((result = r.exec(response)) !== null) {
                rgbColors.push(result[1]);
            }

            // try contrasting text
            if (rgbColors.length > 0) {
                // return 1st result's rgb
                console.log([rgbColors[2], rgbColors[3]])
                return [rgbColors[2], rgbColors[3]]
            } else {
                return []
            }
        })
}

function getContrastColors(C1, C2) {
    result = Promise.resolve(getContrastColorsBackground(C1, C2, true));

    if (result.length > 0) {
        return result;
    } else {
        getContrastColorsBackground(C1, C2, false);
    }
}

console.log(getContrastColors('rgb(70,136,71)', '#7A81FF'));



