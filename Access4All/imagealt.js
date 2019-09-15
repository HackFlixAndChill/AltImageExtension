function convertColors(color) {
  var rgbColors=new Object();

  ///////////////////////////////////
  // Handle rgb(redValue, greenValue, blueValue) format
  //////////////////////////////////
  if (color[0]=='r')
  {
    // Find the index of the redValue.  Using subscring function to
    // get rid off "rgb(" and ")" part.
    // The indexOf function returns the index of the "(" and ")" which we
    // then use to get inner content.
    color=color.substring(color.indexOf('(')+1, color.indexOf(')'));

    // Notice here that we don't know how many digits are in each value,
    // but we know that every value is separated by a comma.
    // So split the three values using comma as the separator.
    // The split function returns an object.
		rgbColors=color.split(',', 4);
		try {
			rgbColors[3]=parseFloat(rgbColors[3]);
		}
		finally {
			// Convert redValue to integer
	    rgbColors[0]=parseFloat(rgbColors[0]);
	    // Convert greenValue to integer
	    rgbColors[1]=parseFloat(rgbColors[1]);
	    // Convert blueValue to integer
	    rgbColors[2]=parseFloat(rgbColors[2]);
		}
  }

  ////////////////////////////////
  // Handle the #RRGGBB' format
  ////////////////////////////////
  else if (color.substring(0,1)=="#")
  {
    // This is simples because we know that every values is two
    // hexadecimal digits.
    rgbColors[0]=color.substring(1, 3);  // redValue
    rgbColors[1]=color.substring(3, 5);  // greenValue
    rgbColors[2]=color.substring(5, 7);  // blueValue

    // We need to convert the value into integers,
    //   but the value is in hex (base 16)!
	// Fortunately, the parseInt function takes a second parameter
    // signifying the base we're converting from.
    rgbColors[0]=parseFloat(rgbColors[0], 16);
    rgbColors[1]=parseFloat(rgbColors[1], 16);
    rgbColors[2]=parseFloat(rgbColors[2], 16);
	}
  return rgbColors;
}

function get_color(color) {
	console.log("Color:", color);
	return color = color/255.0 <= 0.03928 ? color/(255.0*12.92): Math.pow( ((color/255.0+0.055)/1.055), 2.4);;
}

function get_color_reverse(color) {
	var opt = color*12.92;
	if (opt <= 0.03928) {
		return Math.ceil(opt*255);
	}
	else {
		return Math.ceil( (Math.pow(color, 1.0/2.4)*1.005-.055)*255 );
	}
}

function updated_colors(colors) {
	console.log(colors);
	if (colors.length === 4) {
		if (colors[3] === 0) {
			colors[0] = 255.0;
			colors[1] = 255.0;
			colors[2] = 255.0;
		}
		else if (colors[3] !== NaN) {
			var alpha = colors[3];
			// assuming on white background
			colors[0] *= 255.0*(1-alpha)+colors[0]*alpha
			colors[1] *= 255.0*(1-alpha)+colors[1]*alpha
			colors[2] *= 255.0*(1-alpha)+colors[2]*alpha
		}
	}
	return [get_color(colors[0]), get_color(colors[1]), get_color(colors[2])];
}

function get_luminosity(colors) {
	colors = updated_colors(colors);
	console.log(colors);
	return 0.2126 * colors[0] + 0.7152 * colors[1] + 0.0722 * colors[2];
}

window.onload = function () {
	chrome.runtime.onMessage.addListener( function (request, sender, sendResponse) {
		if (request.message === "images") {
			var images = request.images;
			// get all image tags; img.src is the key in images
			var elements = document.getElementsByTagName("img");
			for (var img of elements) {
				// first check if backend returned an image alt text
				if (img.src in images) {
					// value is the new alt text
					img.alt = images[img.src];
				}
			}

			var elems = document.documentElement.querySelectorAll("p");
			console.log("Elems:", elems);
		}
	});
}
