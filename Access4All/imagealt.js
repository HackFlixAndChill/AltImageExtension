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
	// console.log("Color:", color);
	return color = color/255.0 <= 0.03928 ? color/(255.0*12.92): Math.pow( ((color/255.0+0.055)/1.055), 2.4);;
}

function get_color_reverse(color) {
	// console.log("To_Update:", color);
	var opt = color*12.92;
	// console.log("option:", opt);
	if (opt <= 0.03928) {
		return Math.ceil(opt*255);
	}
	else {
		return Math.ceil( (Math.pow(color, 1.0/2.4)*1.005-.055)*255 );
	}
}

function updated_colors(colors) {
	// console.log(colors);
	if (colors.length === 4) {
		if (colors[3] === 0) {
			colors[0] = 255.0;
			colors[1] = 255.0;
			colors[2] = 255.0;
		}
		else if (!isNaN(colors[3]) ) {
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
	// console.log(colors);
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
		}

		var elems = document.documentElement.querySelectorAll("p");
		console.log("Elems:", elems);
		for (var element of elems) {
			console.log("Element:", element);
			var style = window.getComputedStyle(element);

			var color = style.backgroundColor;
			var colors = convertColors(color);

			var text_color = style.getPropertyValue("color");
			var text_colors = convertColors(text_color);

			var L1 = get_luminosity(colors);
			var L2 = get_luminosity(text_colors);
			var contrast = L1>L2 ? (L1+.05)/(L2+.05):(L2+.05)/(L1+.05);
			console.log("Contrast:", contrast, L1, colors, L2, text_colors);

			if (contrast <= 3) {
				var new_L2 = L1>L2 ? ((L1+.05)/3)-.05:3*(L1+.05)-.05;
				var update_txt_colors = updated_colors(text_colors);
				var color_multi = new_L2/L2;

				for (var i=0; i<3; i++) {
					update_txt_colors[i] *= color_multi;
					update_txt_colors[i] = get_color_reverse(update_txt_colors[i])
				}
				console.log("Final numbers:", update_txt_colors);
			}
		}
	});
}
