if (typeof(lib)=="undefined" && typeof(__)=="undefined") {
	var __={
		error:function(msg) {
			try {
				throw new Error(msg);
			} catch(e) {
				console.log(e);
			}
		},
		areDefined:function() {
			for (var i=0; i<arguments.length; i++) {
				if (typeof(arguments[i])==="undefined") {
					return false;
				}
			}
			return true;
		},
		isWebKit:('WebkitAppearance' in window.document.documentElement.style),
		isApple:navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i)?true:false,
		bool:false,
		tQ:[],
		w:window,
		d:window.document,
		rAF:false,
		rAFinitiated:false,
		regs:{
			jsNumber:/^([^-\.0-9]*)\s*([\-]?[0-9]+[\.]?[0-9]*(?:e[\+|-]?[0-9]+)?)\s*([^\.0-9]*)$/i,
			cssWord:/^\s*\b([a-z0-9-]+)\b\s*$/i,
			cssSlash:/^\/$/i,
			cssCalc:/^\s*(calc\()([^\)]+)(\))(px|rem|em|cm|mm|in|pt|pc|vw|vh|fr|%|ch|ex|vmin|vmax)?\s*$/i,
			cssClamp:/^\s*(clamp\()([^\)]+)(\))\s*$/i,
			cssUnits:/^(?:.*?)(px|rem|em|cm|mm|in|pt|pc|vw|vh|fr|%|ch|ex|vmin|vmax)(.*?)$/i,
			cssUnitsSimple:/px|rem|em|cm|mm|in|pt|pc|vw|vh|fr|%|ch|ex|vmin|vmax/i,
			cssAngle:/^\s*([\-]?[0-9]+[\.]?[0-9]*(?:e[\+|-]?[0-9]+)?)\s*rad|deg|turn$/i,
			cssAngleUnits:/^(?:.*?)(rad|deg|turn)(.*?)$/i,
			cssAngleUnitsSimple:/rad|deg|turn/i,
			cssPrefixValueAndUnits:/(.*?)(\-?[0-9]?\.[0-9])(?:px|rem|em|cm|mm|in|pt|pc|vw|vh|fr|%|ch|ex|vmin|vmax)?(?:.*?)/gi,
			cssValueAndUnits:/(?:.*?)(\-?[0-9]?\.[0-9])(?:px|rem|em|cm|mm|in|pt|pc|vw|vh|fr|%|ch|ex|vmin|vmax)?(.*?)/gi,
			cssColorHex6:/^\s*#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2});?\s*$/i,
			cssColorHex6strict:/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2});?$/i,
			cssColorHex3:/^\s*#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1});?\s*$/i,
			cssColorHex3strict:/^#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1});?$/i,
			cssColorRGB:/^\s*rgb\(([0-9]{1,3}),\s*([0-9]{1,3}),\s*([0-9]{1,3})\);?\s*$/i,
			cssColorRGBa:/^\s*rgba\(([0-9]{1,3}),\s*([0-9]{1,3}),\s*([0-9]{1,3}),\s*(1(?:\.0+)?|0|0\.[0-9]+|\.[0-9]+)\);?\s*$/i,
			cssColorHSL:/^\s*hsl\(([0-9]{1,3}),\s*([0-9]{1,3})%?,\s*([0-9]{1,3})%?\);?\s*$/i,
			cssColorHSLa:/^\s*hsla\(([0-9]{1,3}),\s*([0-9]{1,3})%?,\s*([0-9]{1,3})%?,\s*(1(?:\.0+)?|0|0\.[0-9]+|\.[0-9]+)\);?\s*$/i,
			cssUrl:/^\s*(url\()([^\)]+)(\))/i,
			cssFunctionalNotation:/^\s*([a-z0-9-]+\()(.+?)(\))\s*$/i,
			cssDir:/to\s+(?:left|top|right|bottom)/i
		},
		colorStrings:{
			aliceblue:[240,248,255],
			antiquewhite:[250,235,215],
			aqua:[0,255,255],
			aquamarine:[127,255,212],
			azure:[240,255,255],
			beige:[245,245,220],
			bisque:[255,228,196],
			black:[0,0,0],
			blanchedalmond:[255,235,205],
			blue:[0,0,255],
			blueviolet:[138,43,226],
			brown:[165,42,42],
			burlywood:[222,184,135],
			cadetblue:[95,158,160],
			chartreuse:[127,255,0],
			chocolate:[210,105,30],
			coral:[255,127,80],
			cornflowerblue:[100,149,237],
			cornsilk:[255,248,220],
			crimson:[220,20,60],
			cyan:[0,255,255],
			darkblue:[0,0,139],
			darkcyan:[0,139,139],
			darkgoldenrod:[184,134,11],
			darkgray:[169,169,169],
			darkgreen:[0,100,0],
			darkgrey:[169,169,169],
			darkkhaki:[189,183,107],
			darkmagenta:[139,0,139],
			darkolivegreen:[85,107,47],
			darkorange:[255,140,0],
			darkorchid:[153,50,204],
			darkred:[139,0,0],
			darksalmon:[233,150,122],
			darkseagreen:[143,188,143],
			darkslateblue:[72,61,139],
			darkslategray:[47,79,79],
			darkslategrey:[47,79,79],
			darkturquoise:[0,206,209],
			darkviolet:[148,0,211],
			deeppink:[255,20,147],
			deepskyblue:[0,191,255],
			dimgray:[105,105,105],
			dimgrey:[105,105,105],
			dodgerblue:[30,144,255],
			firebrick:[178,34,34],
			floralwhite:[255,250,240],
			forestgreen:[34,139,34],
			fuchsia:[255,0,255],
			gainsboro:[220,220,220],
			ghostwhite:[248,248,255],
			gold:[255,215,0],
			goldenrod:[218,165,32],
			gray:[128,128,128],
			grey:[128,128,128],
			green:[0,128,0],
			greenyellow:[173,255,47],
			honeydew:[240,255,240],
			hotpink:[255,105,180],
			indianred:[205,92,92],
			indigo:[75,0,130],
			ivory:[255,255,240],
			khaki:[240,230,140],
			lavender:[230,230,250],
			lavenderblush:[255,240,245],
			lawngreen:[124,252,0],
			lemonchiffon:[255,250,205],
			lightblue:[173,216,230],
			lightcoral:[240,128,128],
			lightcyan:[224,255,255],
			lightgoldenrodyellow:[250,250,210],
			lightgray:[211,211,211],
			lightgreen:[144,238,144],
			lightgrey:[211,211,211],
			lightpink:[255,182,193],
			lightsalmon:[255,160,122],
			lightseagreen:[32,178,170],
			lightskyblue:[135,206,250],
			lightslategray:[119,136,153],
			lightslategrey:[119,136,153],
			lightsteelblue:[176,196,222],
			lightyellow:[255,255,224],
			lime:[0,255,0],
			limegreen:[50,205,50],
			linen:[250,240,230],
			magenta:[255,0,255],
			maroon:[128,0,0],
			mediumaquamarine:[102,205,170],
			mediumblue:[0,0,205],
			mediumorchid:[186,85,211],
			mediumpurple:[147,112,219],
			mediumseagreen:[60,179,113],
			mediumslateblue:[123,104,238],
			mediumspringgreen:[0,250,154],
			mediumturquoise:[72,209,204],
			mediumvioletred:[199,21,133],
			midnightblue:[25,25,112],
			mintcream:[245,255,250],
			mistyrose:[255,228,225],
			moccasin:[255,228,181],
			navajowhite:[255,222,173],
			navy:[0,0,128],
			oldlace:[253,245,230],
			olive:[128,128,0],
			olivedrab:[107,142,35],
			orange:[255,165,0],
			orangered:[255,69,0],
			orchid:[218,112,214],
			palegoldenrod:[238,232,170],
			palegreen:[152,251,152],
			paleturquoise:[175,238,238],
			palevioletred:[219,112,147],
			papayawhip:[255,239,213],
			peachpuff:[255,218,185],
			peru:[205,133,63],
			pink:[255,192,203],
			plum:[221,160,221],
			powderblue:[176,224,230],
			purple:[128,0,128],
			red:[255,0,0],
			rosybrown:[188,143,143],
			royalblue:[65,105,225],
			saddlebrown:[139,69,19],
			salmon:[250,128,114],
			sandybrown:[244,164,96],
			seagreen:[46,139,87],
			seashell:[255,245,238],
			sienna:[160,82,45],
			silver:[192,192,192],
			skyblue:[135,206,235],
			slateblue:[106,90,205],
			slategrey:[112,128,144],
			slategray:[112,128,144],
			snow:[255,250,250],
			springgreen:[0,255,127],
			steelblue:[70,130,180],
			tan:[210,180,140],
			teal:[0,128,128],
			thistle:[216,191,216],
			tomato:[255,99,71],
			turquoise:[64,224,208],
			violet:[238,130,238],
			wheat:[245,222,179],
			white:[255,255,255],
			whitesmoke:[245,245,245],
			yellow:[255,255,0],
			yellowgreen:[154,205,50],
			transparent:[0,0,0,0]
		},
		htmlEntitiesToNumberedEntitiesMap:{
			nbsp:160,
			iexcl:161,
			cent:162,
			pound:163,
			curren:164,
			yen:165,
			brvbar:166,
			sect:167,
			uml:168,
			copy:169,
			ordf:170,
			laquo:171,
			not:172,
			shy:173,
			reg:174,
			macr:175,
			deg:176,
			plusmn:177,
			sup2:178,
			sup3:179,
			acute:180,
			micro:181,
			para:182,
			middot:183,
			cedil:184,
			sup1:185,
			ordm:186,
			raquo:187,
			frac14:188,
			frac12:189,
			frac34:190,
			iquest:191,
			Agrave:192,
			Aacute:193,
			Acirc:194,
			Atilde:195,
			Auml:196,
			Aring:197,
			AElig:198,
			Ccedil:199,
			Egrave:200,
			Eacute:201,
			Ecirc:202,
			Euml:203,
			Igrave:204,
			Iacute:205,
			Icirc:206,
			Iuml:207,
			ETH:208,
			Ntilde:209,
			Ograve:210,
			Oacute:211,
			Ocirc:212,
			Otilde:213,
			Ouml:214,
			times:215,
			Oslash:216,
			Ugrave:217,
			Uacute:218,
			Ucirc:219,
			Uuml:220,
			Yacute:221,
			THORN:222,
			szlig:223,
			agrave:224,
			aacute:225,
			acirc:226,
			atilde:227,
			auml:228,
			aring:229,
			aelig:230,
			ccedil:231,
			egrave:232,
			eacute:233,
			ecirc:234,
			euml:235,
			igrave:236,
			iacute:237,
			icirc:238,
			iuml:239,
			eth:240,
			ntilde:241,
			ograve:242,
			oacute:243,
			ocirc:244,
			otilde:245,
			ouml:246,
			divide:247,
			oslash:248,
			ugrave:249,
			uacute:250,
			ucirc:251,
			uuml:252,
			yacute:253,
			thorn:254,
			yuml:255,
			fnof:192,
			Alpha:913,
			Beta:914,
			Gamma:915,
			Delta:916,
			Epsilon:917,
			Zeta:918,
			Eta:919,
			Theta:920,
			Iota:921,
			Kappa:922,
			Lambda:923,
			Mu:924,
			Nu:925,
			Xi:926,
			Omicron:927,
			Pi:928,
			Rho:929,
			Sigma:931,
			Tau:932,
			Upsi:933,
			Phi:934,
			Chi:935,
			Psi:936,
			Omega:937,
			alpha:945,
			beta:946,
			gamma:947,
			delta:948,
			epsi:949,
			zeta:950,
			eta:951,
			theta:952,
			iota:953,
			kappa:954,
			lambda:955,
			mu:956,
			nu:957,
			xi:958,
			omicron:959,
			pi:960,
			rho:961,
			sigmaf:962,
			sigma:963,
			tau:964,
			upsi:965,
			phi:966,
			chi:967,
			psi:968,
			omega:969,
			theta:977,
			upsih:978,
			piv:982,
			bull:8226,
			hellip:8230,
			prime:8242,
			Prime:8243,
			oline:8254,
			frasl:8260,
			weierp:8472,
			image:8465,
			real:8476,
			trade:8482,
			alefsym:8501,
			larr:8592,
			uarr:8593,
			rarr:8594,
			darr:8595,
			harr:8596,
			crarr:8629,
			lArr:8656,
			uArr:8657,
			rArr:8658,
			dArr:8659,
			hArr:8660,
			forall:8704,
			part:8706,
			exist:8707,
			empty:8709,
			nabla:8711,
			isin:8712,
			notin:8713,
			ni:8715,
			prod:8719,
			sum:8722,
			minus:8722,
			lowast:8727,
			radic:8730,
			prop:8733,
			infin:8734,
			ang:8736,
			and:8869,
			or:8870,
			cap:8745,
			cup:8746,
			int:8747,
			there4:8756,
			sim:8764,
			cong:8773,
			asymp:8773,
			ne:8800,
			equiv:8801,
			le:8804,
			ge:8805,
			sub:8834,
			sup:8835,
			nsub:8836,
			sube:8838,
			supe:8839,
			oplus:8853,
			otimes:8855,
			perp:8869,
			sdot:8901,
			lceil:8968,
			rceil:8969,
			lfloor:8970,
			rfloor:8971,
			lang:9001,
			loz:9674,
			spades:9824,
			clubs:9827,
			hearts:9829,
			diams:9830,
			quot:34,
			amp:38,
			lt:60,
			gt:62,
			OElig:338,
			oelig:339,
			Scaron:352,
			scaron:353,
			Yuml:376,
			circ:710,
			tilde:732,
			ensp:8194,
			emsp:8195,
			thinsp:8201,
			zwnj:8204,
			zwj:8205,
			lrm:8206,
			rlm:8207,
			ndash:8211,
			mdash:8212,
			lsquo:8216,
			rsquo:8217,
			sbquo:8218,
			ldquo:8220,
			rdquo:8221,
			bdquo:8222,
			dagger:8224,
			Dagger:8225,
			permil:8240,
			lsaquo:8249,
			rsaquo:8250,
		},
		HSLtoRGB:function(hsl) {
			while (hsl.h<0) {
				hsl.h+=360;
			}
			while (hsl.h>=360) {
				hsl.h-=360;
			}
			hsl.s/=100;
			hsl.l/=100;
			var c=hsl.l*hsl.s;
			var hPrime=hsl.h/60;
			var x=c*(1-Math.abs(hPrime%2-1));
			var functionTable=[
				function(c, x) { return [c, x, 0]; },
				function(c, x) { return [x, c, 0]; },
				function(c, x) { return [0, c, x]; },
				function(c, x) { return [0, x, c]; },
				function(c, x) { return [x, 0, c]; },
				function(c, x) { return [c, 0, x]; }
			];
			var index=Math.floor(hPrime);
			rgbPrime=(typeof(hsl.h)!=="undefined"?functionTable[index](c, x):[0,0,0]);
			var m=hsl.l-c;
			return { r:Math.round((rgbPrime[0]+m)*255), g:Math.round((rgbPrime[1]+m)*255), b:Math.round((rgbPrime[2]+m)*255) };
		},
		RGBtoHSL:function(rgb) {
			for (var p in rgb) {
				rgb[p]/=255;
			}
			var max=Math.max(rgb.r,rgb.g,rgb.b);
			var min=Math.min(rgb.r,rgb.g,rgb.b);
			var c=max-min;
			var h,s,l,hPrime;
			switch (max) {
				case min:
					hPrime=0;
				break;
				case rgb.r:
					hPrime=((rgb.g-rgb.b)/c+6)%6;
				break;
				case rgb.g:
					hPrime=(rgb.b-rgb.r)/c+2;
				break;
				case rgb.b:
					hPrime=(rgb.r-rgb.g)/c+4;
				break;
			}
			h=60*hPrime;
			if (c===0) {
				s=0;
			} else {
				s=c/max;
			}
			l=max;
			return { h:h, s:s*100, l:l*100 };
		},
		colorToRGBa:function(v) {
			var value, obj, rgb;
			v=__.trim(v);
			if (__.regs.cssColorHex6strict.test(v)) {
				obj=__.regs.cssColorHex6strict.exec(v);
				value={ r:__.hexToDec(obj[1]), g:__.hexToDec(obj[2]), b:__.hexToDec(obj[3]), a:1 };
			} else if (__.regs.cssColorHex3strict.test(v)) {
				obj=__.regs.cssColorHex3strict.exec(v);
				value={ r:__.hexToDec(obj[1]+obj[1]), g:__.hexToDec(obj[2]+obj[2]), b:__.hexToDec(obj[3]+obj[3]), a:1 };
			} else if (__.regs.cssColorRGBa.test(v)) {
				obj=__.regs.cssColorRGBa.exec(v);
				value={ r:parseInt(obj[1], 10), g:parseInt(obj[2], 10), b:parseInt(obj[3], 10), a:parseFloat(obj[4]) };
			} else if (__.regs.cssColorRGB.test(v)) {
				obj=__.regs.cssColorRGB.exec(v);
				value={ r:parseInt(obj[1], 10), g:parseInt(obj[2], 10), b:parseInt(obj[3], 10), a:1 };
			} else if (__.regs.cssColorHSLa.test(v)) {
				obj=__.regs.cssColorHSLa.exec(v);
				rgb=__.HSLtoRGB({ h:parseFloat(obj[1]), s:parseFloat(obj[2]), l:parseFloat(obj[3]) });
				value={ r:rgb.r, g:rgb.g, b:rgb.b, a:parseFloat(obj[4]) };
			} else if (__.regs.cssColorHSL.test(v)) {
				obj=__.regs.cssColorHSL.exec(v);
				rgb=__.HSLtoRGB({ h:parseFloat(obj[1]), s:parseFloat(obj[2]), l:parseFloat(obj[3]) });
				value={ r:rgb.r, g:rgb.g, b:rgb.b, a:1 };
			} else if (v in __.colorStrings) {
				value={ r:parseInt(__.colorStrings[v][0], 10), g:parseInt(__.colorStrings[v][1], 10), b:parseInt(__.colorStrings[v][2], 10), a:(3 in __.colorStrings[v])?parseFloat(__.colorStrings[v][3]):1 };
			}
			return value;
		},
		roundTo:function(number, precision) {
			return Math.round(number*Math.pow(10, precision))/Math.pow(10, precision);
		},
		floorTo:function(number, precision) {
			return Math.floor(number*Math.pow(10, precision))/Math.pow(10, precision);
		},
		ceilTo:function(number, precision) {
			return Math.ceil(number*Math.pow(10, precision))/Math.pow(10, precision);
		},
		hexToDec:function(str) {
			return parseInt(str, 16);
		},
		decToHex:function(nb) {
			return nb.toString(16);
		},
		binToDec:function(bin) {
			return parseInt(bin,2).toString(10);
		},
		decToBin:function(dec) {
			return (parseInt(dec,10)>>>0).toString(2);
		},
		strToHex:function(str) {
			var s='';
			for (var i=0; i<str.length; i++) {
				s+=str.charCodeAt(i).toString(16);
			}
			return s;
		},
		hexToStr:function(hexStr) {
			var str="";
			for (var i=0; i<hexStr.length; i+=2) {
			  	str+=String.fromCharCode(parseInt(hexStr.substring(i, i+2), 16));
			}
			return str;
		},
		utfToStr:function(u) {
			/*! https://mths.be/fromcodepoint v0.2.1 by @mathias */
			if (!String.fromCodePoint) {
				(function() {
					var defineProperty = (function() {
						// IE 8 only supports `Object.defineProperty` on DOM elements
						try {
							var object = {};
							var $defineProperty = Object.defineProperty;
							var result = $defineProperty(object, object, object) && $defineProperty;
						} catch(error) {}
						return result;
					}());
					var stringFromCharCode = String.fromCharCode;
					var floor = Math.floor;
					var fromCodePoint = function(_) {
						var MAX_SIZE = 0x4000;
						var codeUnits = [];
						var highSurrogate;
						var lowSurrogate;
						var index = -1;
						var length = arguments.length;
						if (!length) {
							return '';
						}
						var result = '';
						while (++index < length) {
							var codePoint = Number(arguments[index]);
							if (
								!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
								codePoint < 0 || // not a valid Unicode code point
								codePoint > 0x10FFFF || // not a valid Unicode code point
								floor(codePoint) != codePoint // not an integer
							) {
								throw RangeError('Invalid code point: ' + codePoint);
							}
							if (codePoint <= 0xFFFF) { // BMP code point
								codeUnits.push(codePoint);
							} else { // Astral code point; split in surrogate halves
								// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
								codePoint -= 0x10000;
								highSurrogate = (codePoint >> 10) + 0xD800;
								lowSurrogate = (codePoint % 0x400) + 0xDC00;
								codeUnits.push(highSurrogate, lowSurrogate);
							}
							if (index + 1 == length || codeUnits.length > MAX_SIZE) {
								result += stringFromCharCode.apply(null, codeUnits);
								codeUnits.length = 0;
							}
						}
						return result;
					};
					if (defineProperty) {
						defineProperty(String, 'fromCodePoint', {
							'value': fromCodePoint,
							'configurable': true,
							'writable': true
						});
					} else {
						String.fromCodePoint = fromCodePoint;
					}
				}());
			}
			if (typeof(u)==="string") {
				u=u.replace(/^0x/, "").replace(/^U\+/, "");
				if (!isNaN(parseInt(u, 16))) {
					return String.fromCodePoint(parseInt("0x"+u, 16));
				} else {
					return "";
				}
			} else if (typeof(u)==="number") {
				if (u|0===u) {
					return String.fromCodePoint(u);
				} else {
					return "";
				}
			}
		},
		utfToHtml:function(u) {
			if (typeof(u)==="string") {
				u=u.replace(/^0x/, "").replace(/^U\+/, "");
				if (!isNaN(parseInt(u, 16))) {
					return "&#x"+u+";";
				} else {
					return "";
				}
			}
		},
		htmlEntitiesToXmlNumberedEntities:function(str) {
			var reg;
			for (var p in __.htmlEntitiesToNumberedEntitiesMap) {
				reg=RegExp("&"+p+";", "gm");
				if (reg.test(str)) {
					str=str.replace(reg, "&#"+__.htmlEntitiesToNumberedEntitiesMap[p]+";");
				}
			}
			return str;
		},
		htmlEntitiesToUTF:function(str) {
			var reg, ex;
			for (var p in __.htmlEntitiesToNumberedEntitiesMap) {
				reg=RegExp("&"+p+";", "gm");
				if (reg.test(str)) {
					str=str.replace(reg, String.fromCodePoint(__.htmlEntitiesToNumberedEntitiesMap[p]));
				}
			}
			while ((ex=/&#([0-9]{1,});/.exec(str))!==null) {
				str=str.replace(RegExp('&#'+ex[1]+';', "g"), String.fromCharCode(ex[1]));
			}
			return str;
		},
		capitalize:function(str) {
			str=str.toLocaleLowerCase();
			str=str.substring(0, 1).toLocaleUpperCase()+str.substring(1);
			return str.replace(/(?:&nbsp;|[\s\'"«»\.,:;\?!\/\\\(\)\[\]\{\}\|_+=*<>-])+./g, function(sub) { return sub.toLocaleUpperCase(); }, str);
		},
		gcd:function(v1,v2) {
			var a,b;
			if (v1>v2) {
				a=v1;
				b=v2;
			} else {
				a=v2;
				b=v1;
			}
			var rest=a-((a/b)|0)*b;
			if (rest==0) {
				return b;
			} else {
				return __.gcd(b, rest);
			}
		},
		lcm:function(v1,v2) {
			return Math.abs(v1*v2)/__.gcd(v1,v2);
		},
		explode:function(sep, str) {
			var positions=[];
			var res=[];
			positions.push(-sep.length);
			for (var k=0; k<str.length; k++) {
				if (str.substring(k, k+sep.length)==sep) {
					positions.push(k);
				}
			}
			positions.push(str.length);
			for (k=0; k<(positions.length-1); k++) {
				res.push(str.substring(positions[k]+sep.length, positions[k+1]));
			}
			return res;
		},
		implode:function(sep, arr) {
			return arr.join(sep);
		},
		arrayDuplicate:function(obj) {
			var ret=[];
			if (typeof(ret)!=="undefined") {
				// fix for oldies
				if (typeof Object.assign != 'function') {
				  	Object.assign = function(target, varArgs) { // .length of function is 2
						'use strict';
						if (target == null) { // TypeError if undefined or null
							throw new TypeError('Cannot convert undefined or null to object');
						}
						var to = Object(target);
						for (var index = 1; index < arguments.length; index++) {
							var nextSource = arguments[index];
							if (nextSource != null) { // Skip over if undefined or null
								for (var nextKey in nextSource) {
									// Avoid bugs when hasOwnProperty is shadowed
									if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
											to[nextKey] = nextSource[nextKey];
									}
								}
							}
						}
						return to;
				  	};
				}
				Object.assign(ret, obj);
			}
			return ret;
		},
		objectDuplicate:function(obj, dontclone, useJSON) {
			var ret;
			if ("cloneNode" in obj && !dontclone) {
				return obj.cloneNode(true);
			} else if (__.isArray(obj)) {
				ret=[];
			} else if (__.isObject(obj)) {
				ret={};
			}
			if (typeof(ret)!=="undefined") {
				// fix for oldies
				if (typeof Object.assign!='function') {
				  	Object.assign=function(target, varArgs) { // .length of function is 2
						'use strict';
						if (target===null) { // TypeError if undefined or null
							throw new TypeError('Cannot convert undefined or null to object');
						}
						var to=Object(target);
						for (var index=1; index<arguments.length; index++) {
							var nextSource=arguments[index];
							if (nextSource!==null) { // Skip over if undefined or null
								for (var nextKey in nextSource) {
									// Avoid bugs when hasOwnProperty is shadowed
									if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
											to[nextKey]=nextSource[nextKey];
									}
								}
							}
						}
						return to;
				  	};
				}
				if (typeof(useJSON)==="undefined" || !useJSON) {
					Object.assign(ret, obj);
				} else {
					ret=JSON.parse(JSON.stringify(obj));
				}
			}
			return ret;
		},
		spliceInObjectWhereHas:function(obj, toFind, toIgnore, c) {
			var o=obj;
			var found=[], r, p, c=(typeof(c)!=="undefined"?c:__.countProperties(toFind)), a=c, p, prop, i;
			if (!__.isNumericalArray(o)) {
				for (p in o) {
					if (typeof(toIgnore)!=="undefined"?toIgnore.indexOf(p)===-1:true) {
						if (!__.isObject(o[p]) && !__.isArray(o[p])) {
							if (p in toFind && toFind[p]===o[p]) {
								a--;
							}
							if (a===0) {
								found=o;
								a=c;
								o=null;
								break;
							}
						} else if (p in toFind && (__.isObject(o[p]) || __.isArray(o[p])) && (__.isObject(toFind[p]) || __.isArray(toFind[p])) && __.countProperties((r=__.spliceInObjectWhereHas(o[p], toFind[p], toIgnore)).found)>0) {
							found.push(__.objectDuplicate(o, true));
							if (__.isObject(o[p])) {
								o[p]={};
							} else if (__.isArray(o[p])) {
								o[p]=[];
							}
						} else if ((__.isObject(o[p]) || __.isArray(o[p])) && __.countProperties((r=__.spliceInObjectWhereHas(o[p], toFind, toIgnore, c)).found)>0) {
							found=found.concat(r.found);
							if (r.rest!==null) {
								o[p]=r.rest;
							} else {
								if (__.isObject(o[p])) {
									o[p]={};
								} else if (__.isArray(o[p])) {
									o[p]=[];
								}
							}
						}
					}
				}
			} else {
				p=0;
				while (p<o.length) {
					if (typeof(toIgnore)!=="undefined"?toIgnore.indexOf(p)===-1:true) {
						if (!__.isObject(o[p]) && !__.isArray(o[p])) {
							for (prop in toFind) {
								if (toFind[prop]===o[p]) {
									a--;
								}
							}
							if (a===0) {
								found=o;
								a=c;
								o=null;
								break;
							}
						} else if ((__.isObject(o[p]) || __.isArray(o[p])) && __.countProperties((r=__.spliceInObjectWhereHas(o[p], toFind, toIgnore, c)).found)>0) {
							found=found.concat(r.found);
							if (r.rest!==null) {
								o[p]=r.rest;
							} else {
								o.splice(p--, 1);
							}
						} else if (__.isObject(o[p]) || __.isArray(o[p]) && __.isObject(toFind[prop])) {
							for (prop in toFind) {
								if ((__.isObject(toFind[prop]) || __.isArray(toFind[prop])) && __.countProperties((r=__.spliceInObjectWhereHas(o[p], toFind[prop], toIgnore)).found)>0) {
									a--;
								}
							}
							if (a===0) {
								found=o;
								a=c;
								o=null;
								break;
							}
						}
					}
					p++;
				}
			}
			obj=o;
			if (__.countProperties(obj)===0) {
				obj=null;
			}
			return { found:found, rest:obj };
		},
		searchItem:function(value, obj, res) {
			if (typeof(res)==="undefined") {
				var res=[];
			}
			var tmp;
			for (var prop in obj) {
				if (__.isArray(obj[prop]) || __.isObject(obj[prop])) {
					tmp=__.searchItem(value, obj[prop], res.concat(prop));
					if (tmp) {
						return tmp;
					}
				} else if (obj[prop]===value) {
					return res.concat(prop);
				}
			}
		},
		spliceAtKeys:function(obj, keys, len) {
			if (!__.isArray(keys)) {
				keys=[keys];
			}
			var l=len,o=__.isObject(obj)?{}:[],bool;
			for (var prop in obj) {
				if (keys.indexOf(prop)===-1 && (typeof(len)!=="undefined"?(bool?(l>=0 && l<len):true):true)) {
					o[prop]=obj[prop];
				} else if (typeof(len)!=="undefined") {
					bool=true;
					l--;
				}
			}
			return o;
		},
		spliceAtKeysRecursive:function(obj, keys) {
			if (!__.isArray(keys)) {
				keys=[keys];
			}
			var o=__.isObject(obj)?{}:[];
			for (var prop in obj) {
				if (keys.indexOf(prop)===-1) {
					o[prop]=obj[prop];
				} else if (keys.indexOf(prop)===-1 && (__.isArray(obj[prop]) || __.isObject(obj[prop]))) {
					o[prop]=__.spliceAtKeysRecursive(obj[prop], keys);
				}
			}
			return o;
		},
		escapeCharsForRegExp:function(str) {
			var specialChars=['\\','[',']','{','}','(',')','?','*','+','/','|','^','$'];
			for (var i=0; i<specialChars.length; i++) {
				if (str.match(RegExp('\\'+specialChars[i], 'gm'))) {
					str=str.replace(RegExp('\\'+specialChars[i], 'gm'), "\\"+specialChars[i]);
				}
			}
			return str;
		},
		escapeQuotes:function(str) {
			return str.replace(/"/g, '\\"').replace(/'/g, "\\'");
		},
		escapeSimpleQuotes:function(str) {
			return str.replace(/'/g, "\\'");
		},
		escapeDoubleQuotes:function(str) {
			return str.replace(/"/g, '\\"');
		},
		unescapeQuotes:function(str) {
			return str.replace(/\\'/g, "'").replace(/\\"/g, '"');
		},
		unescapeSimpleQuotes:function(str) {
			return str.replace(/\\'/g, "'");
		},
		unescapeDoubleQuotes:function(str) {
			return str.replace(/\\"/g, '"');
		},
		stripSlashes:function(str) {
			return str.replace(/\\([\\|"|'])/g, "$1");
		},
		removeSlashes:function(str) {
			return str.replace(/\\/g, "");
		},
		attr:function(obj, elements) {
			var i,p;
			if (typeof(obj)==="string") {
				try {
					var json=lib().json.parse(obj);
				} catch (e) { /* DO NOTHING */ }
				if (!__.isObject(json)) {
					res=[];
					for (i=0; i<elements.length; i++) {
						res[i]=elements[i].getAttribute(obj);
					}
					return res;
				} else {
					var props=__.getPropertiesContainingValues(json);
					var values=[];
					for (j=0; j<props.length; j++) {
						values[j]=__.getPropertyValueDeep(json, props[j]);
						if (props[j].length>1) {
							for (i=0; i<elements.length; i++) {
								__.setPropertyValueDeep(values[j], elements[i], props[j]);
							}
						} else {
							for (i=0; i<elements.length; i++) {
								elements[i].setAttribute(props[j][0], values[j]);
							}
						}
					}
				}
			} else if (__.isObject(obj) || __.isArray(obj)) {
				var props=__.getPropertiesContainingValues(obj);
				var values=[];
				for (j=0; j<props.length; j++) {
					values[j]=__.getPropertyValueDeep(obj, props[j]);
					if (props[j].length>1) {
						for (i=0; i<elements.length; i++) {
							__.setPropertyValueDeep(values[j], elements[i], props[j]);
						}
					} else {
						for (i=0; i<elements.length; i++) {
							elements[i].setAttribute(props[j][0], values[j]);
						}
					}
				}
			}
		},
		html:function(str, elements) {
			var i;
			if (typeof(str)=="string" || typeof(str)=="number") {
				for (i=0; i<elements.length; i++) {
					elements[i].innerHTML=str;
				}
				return;
			} else {
				var ret=[];
				for (i=0; i<elements.length; i++) {
					ret.push(elements[i].innerHTML);
				}
				return ret;
			}
		},
		text:function(str, elements) {
			var i;
			if (typeof(str)=="string" || typeof(str)=="number") {
				for (i=0; i<elements.length; i++) {
					elements[i].textContent=str;
				}
				return;
			} else {
				var ret=[];
				for (i=0; i<elements.length; i++) {
					
					ret.push(elements[i].textContent);
				}
				return ret;
			}
		},
		value:function(str, elements) {
			var i;
			if (typeof(str)=="string" || typeof(str)=="number") {
				for (i=0; i<elements.length; i++) {
					if ("value" in elements[i]) {
						elements[i].value=str;
					}
				}
				return;
			} else {
				var ret=[];
				for (i=0; i<elements.length; i++) {
					if ("value" in elements[i]) {
						ret.push(elements[i].value);
					} else {
						ret.push(null);
					}
				}
				return ret;
			}
		},
		appendHtml:function(str, elements) {
			for (var i=0; i<elements.length; i++) {
				elements[i].innerHTML+=str;
			}
		},
		appendText:function(str, elements) {
			for (var i=0; i<elements.length; i++) {
				elements[i].textContent+=str;
			}
		},
		prependHtml:function(str, elements) {
			for (var i=0; i<elements.length; i++) {
				elements[i].innerHTML=str+elements[i].innerHTML;
			}
		},
		prependText:function(str, elements) {
			for (var i=0; i<elements.length; i++) {
				elements[i].textContent=str+elements[i].textContent;
			}
		},
		append:function(elementsToAdd, elements) {
			var i,j;
			for (i=0; i<elements.length; i++) {
				for (j=0; j<elementsToAdd.length; j++) {
					elements[i].appendChild(elementsToAdd[j]);
				}
			}
		},
		prepend:function(elementsToAdd, elements) {
			var i,j;
			for (i=0; i<elements.length; i++) {
				for (j=0; j<elementsToAdd.length; j++) {
					elements[i].insertBefore(elementsToAdd[j], elements[i].firstChild);
				}
			}
		},
		insertNodeAtIndex:function(node, index, elements) {
			for (var i=0; i<elements.length; i++) {
				if (index<elements[i].childNodes.length-1) {
					elements[i].insertBefore(node, elements[i].childNodes[index]);
				} else {
					elements[i].appendChild(node);
				}
			}
		},
		launchQueue:{},
		launch:function(guid) {
			if ((guid in __.launchQueue) && __.isArray(__.launchQueue[guid].functions)) {
				__.launchQueue[guid].toLoad--;
				if (__.launchQueue[guid].toLoad===0) {
					for (var i=0; i<__.launchQueue[guid].functions.length; i++) {
						__.launchQueue[guid].functions[i]();
					}
				}
			}
		},
		htmlScriptStyleLinkMetaTitle:function(str, ondone, elements, classNameForExtraElements, onlyInsideId, optionalRemovalSelector, appendOrPrepend, omitExtraElements, beforeSelector) {
			var i,j,e,c,old,r,launchDirectly=false;
			if (typeof(clearContents)==="undefined") {
				clearContents=true;
			}
			if (!appendOrPrepend) {
				__.html("", elements);
			}
			if (typeof(str)!="undefined" && str.length>0) {
				var res=__.parseMarkupLanguage(str, "html"), base, rest;
				var result={ main:[], script:[], style:[], link:[], meta:[], title:[] };
				if ((r=__.spliceInObjectWhereHas(res, { type:"element", name:"script" }, ["parent"])).found.length>0) {
					if (!omitExtraElements) {
						result.script=r.found;
					}
					res=r.rest;
				}
				if ((r=__.spliceInObjectWhereHas(res, { type:"element", name:"style" }, ["parent"])).found.length>0) {
					if (!omitExtraElements) {
						result.style=r.found;
					}
					res=r.rest;
				}
				if ((r=__.spliceInObjectWhereHas(res, { type:"element", name:"link" }, ["parent"])).found.length>0) {
					if (!omitExtraElements) {
						result.link=r.found;
					}
					res=r.rest;
				}
				if ((r=__.spliceInObjectWhereHas(res, { type:"element", name:"meta" }, ["parent"])).found.length>0) {
					if (!omitExtraElements) {
						result.meta=r.found;
					}
					res=r.rest;
				}
				if ((r=__.spliceInObjectWhereHas(res, { type:"element", name:"title" }, ["parent"])).found.length>0) {
					if (!omitExtraElements) {
						result.title=r.found;
					}
					res=r.rest;
				}
				var obj;
				if (typeof(onlyInsideId)!=="undefined" && onlyInsideId!=="") {
					obj={ type:"element", attributes:[{ name:"id", type:"attribute", value:onlyInsideId }] };
					r=__.spliceInObjectWhereHas(res, obj, ["parent"]);
					r.found=r.found[0].content;
				} else if (/<body/i.test(str)) {
					obj={ type:"element", name:"body" };
					r=__.spliceInObjectWhereHas(res, obj, ["parent"]);
					r.found=r.found[0].content;
				} else {
					r={ found:res, rest:null };
				}
				if (__.isArray(r.found) && r.found.length>0) {
					result.main=r.found;
				}
				if (!__.isArray(ondone)) {
					if (typeof(ondone)==="function") {
						ondone=[ondone];
					} else {
						ondone=[];
					}
				}
				var guid=__.guid();
				if (typeof(optionalRemovalSelector)==="string" && optionalRemovalSelector.length>0) {
					lib(elements).find(optionalRemovalSelector).remove();
				}
				if (result.main.length>0) {
					__.appendOrPrependHtmlRecursively(elements, result.main, false, appendOrPrepend, beforeSelector);
				}
				if (result.meta.length>0) {
					for (i=0; i<result.meta.length; i++) {
						for (j=0; j<result.meta[i].attributes.length; j++) {
							lib("meta["+result.meta[i].attributes[j].name+"]").remove();
						}
						e=__.createNode('meta', { }, "", [__.d.getElementsByTagName('head')[0]]).targets[0];
						typeof(classNameForExtraElements)!=="undefined" && __.addClass([e], classNameForExtraElements);
						for (j=0; j<result.meta[i].attributes.length; j++) {
							e.setAttribute(result.meta[i].attributes[j].name, result.meta[i].attributes[j].value);
						}
					}
				}
				if (result.title.length>0) {
					__.remove([__.d.querySelector("title")]);
					e=__.createNode('title', {}, result.title[0].content[0].content, [__.d.getElementsByTagName('head')[0]]).targets[0];
				}
				if (result.script.length>0) {
					var toLoad=0;			
					for (i=0; i<result.script.length; i++) {
						c=false;
						for (j=0; j<result.script[i].attributes.length; j++) {
							if (result.script[i].attributes[j].name.toLowerCase()==="src" && (old=lib("head").find("script[src*='"+result.script[i].attributes[j].value.replace(/\?(.+)$/, "").replace(/^\.\//, "")+"']").targets).length>0) {
								if (old[0].src.replace(/^(?:.+)\?(.+)$/, "$1")===result.script[i].attributes[j].value.replace(/^(?:.+)\?(.+)$/, "$1")) {
									c=true;
								} else {
									__.remove(old);
								}
								break;
							} else {
								c=false;
							}
						}
						if (c) { continue; }
						e=__.createNode('script', {}, (0 in result.script[i].content?result.script[i].content[0].content:""), [__.d.getElementsByTagName('head')[0]]).targets[0];
						typeof(classNameForExtraElements)!=="undefined" && __.addClass([e], classNameForExtraElements);
						for (j=0; j<result.script[i].attributes.length; j++) {
							if (result.script[i].attributes[j].name!=="onload") {
								e.setAttribute(result.script[i].attributes[j].name, result.script[i].attributes[j].value);
							} else {
								toLoad++;
								ondone.push((function(onload, classNameForExtraElements) { return function() { var e=__.createNode('script', { type:"text/javascript" }, onload, [__.d.getElementsByTagName('head')[0]]).targets[0]; typeof(classNameForExtraElements)!=="undefined" && __.addClass([e], classNameForExtraElements); } })(result.script[i].attributes[j].value, classNameForExtraElements));
								e.setAttribute("onload", "__.launch('"+guid+"')");
							}
						}
					}
					if (toLoad>0) {
						__.launchQueue[guid]={ toLoad:toLoad, functions:ondone };		
					} else {
						launchDirectly=true;
					}
				} else {
					launchDirectly=true;
				}
				if (result.style.length>0) {
					for (i=0; i<result.style.length; i++) {
						e=__.createNode('style', { }, result.style[i].content[0].content, [__.d.getElementsByTagName('head')[0]]).targets[0];
						typeof(classNameForExtraElements)!=="undefined" && __.addClass([e], classNameForExtraElements);
						for (j=0; j<result.style[i].attributes.length; j++) {
							e.setAttribute(result.style[i].attributes[j].name, result.style[i].attributes[j].value);
						}
					}
				}
				if (result.link.length>0) {
					for (i=0; i<result.link.length; i++) {
						c=false;
						for (j=0; j<result.link[i].attributes.length; j++) {
							if (result.link[i].attributes[j].name.toLowerCase()==="href" && (old=lib("head").find("link[href*='"+result.link[i].attributes[j].value.replace(/\?(.+)$/, "").replace(/^\.\//, "")+"']").targets).length>0) {
								if (old[0].href.replace(/^(?:.+)\?(.+)$/, "$1")===result.link[i].attributes[j].value.replace(/^(?:.+)\?(.+)$/, "$1")) {
									c=true;
								} else {
									setTimeout(function(old) { return function() { __.remove(old); } }(old), 500);
								}
								break;
							} else {
								c=false;
							}
						}
						if (c) { continue; }
						e=__.createNode('link', { }, "", [__.d.getElementsByTagName('head')[0]]).targets[0];
						typeof(classNameForExtraElements)!=="undefined" && __.addClass([e], classNameForExtraElements);
						for (j=0; j<result.link[i].attributes.length; j++) {
							e.setAttribute(result.link[i].attributes[j].name, result.link[i].attributes[j].value);
						}
					}
				}
				if (launchDirectly && __.isArray(ondone)) {
					for (var i=0; i<ondone.length; i++) {
						ondone[i]();
					}
				}
				return res;
			}
		},
		appendOrPrependHtmlRecursively:function(elements, content, insideSVG, appendOrPrepend, beforeSelector) {
			var j, k, e, n, m;
			if (typeof(insideSVG)==="undefined") {
				insideSVG=false;
			}
			if (typeof(appendOrPrepend)==="undefined") {
				appendOrPrepend="append";
			}
			if ((!appendOrPrepend || appendOrPrepend==="append") && typeof(beforeSelector)==="undefined") {
				for (j=0; j<content.length; j++) {
					if (typeof(content[j])!=="undefined") {
						if (content[j].type==="element") {
							if (content[j].name.toLowerCase()==="svg" || insideSVG) {
								insideSVG=true;
								e=__.createNode(content[j].name, {}, "", elements, "http://www.w3.org/2000/svg").targets;
							} else {
								e=__.createNode(content[j].name, {}, "", elements).targets;
							}
							if ("attributes" in content[j]) {
								for (k=0; k<content[j].attributes.length; k++) {
									var obj=[];
									obj[content[j].attributes[k].name]=content[j].attributes[k].value;
									if (!insideSVG) {
										__.attr(obj, e);
									} else {
										for (i=0; i<e.length; i++) {
											e[i].setAttribute(content[j].attributes[k].name, content[j].attributes[k].value);
										}
									}
								}
							}
							if (content[j].content.length>0) {
								__.appendOrPrependHtmlRecursively(e, content[j].content, insideSVG, "append");
							}
						} else if (content[j].type==="text") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createTextNode(__.htmlEntitiesToUTF(content[j].content));
								elements[k].appendChild(n);
							}
						} else if (content[j].type==="cdata") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createCDataSection(content[j].content);
								elements[k].appendChild(n);
							}
						} else if (content[j].type==="comment") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createComment(__.htmlEntitiesToUTF(content[j].content));
								elements[k].appendChild(n);
							}
						} else if (content[j].type==="processing instruction") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createProcessingInstruction(content[j].name, content[j].content);
								elements[k].appendChild(n);
							}
						}
					}
				}
			} else if (appendOrPrepend==="prepend" || typeof(beforeSelector)!=="undefined") {
				let index;
				for (j=content.length-1; j>=0; j--) {
					if (typeof(content[j])!=="undefined") {
						if (content[j].type==="element") {
							if (content[j].name.toLowerCase()==="svg" || insideSVG) {
								insideSVG=true;
								if (typeof(beforeSelector)!=="undefined") {
									for (k=0; k<elements.length; k++) {
										index=lib([elements[k]]).find(beforeSelector).getIndexOfNodes()[0];
										e=__.createNodeAtIndex(content[j].name, index, {}, "", elements, "http://www.w3.org/2000/svg").targets;
									}
								} else {
									e=__.createNodeAtIndex(content[j].name, 0, {}, "", elements, "http://www.w3.org/2000/svg").targets;
								}
							} else {
								if (typeof(beforeSelector)!=="undefined") {
									for (k=0; k<elements.length; k++) {
										index=lib([elements[k]]).find(beforeSelector).getIndexOfNodes()[0];
										e=__.createNodeAtIndex(content[j].name, index, {}, "", elements).targets;
									}
								} else {
									e=__.createNodeAtIndex(content[j].name, 0, {}, "", elements).targets;
								}
							}
							if ("attributes" in content[j]) {
								for (k=0; k<content[j].attributes.length; k++) {
									var obj=[];
									obj[content[j].attributes[k].name]=content[j].attributes[k].value;
									if (!insideSVG) {
										__.attr(obj, e);
									} else {
										for (i=0; i<e.length; i++) {
											e[i].setAttribute(content[j].attributes[k].name, content[j].attributes[k].value);
										}
									}
								}
							}
							if (content[j].content.length>0) {
								__.appendOrPrependHtmlRecursively(e, content[j].content, insideSVG, "append");
							}
						} else if (content[j].type==="text") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createTextNode(__.htmlEntitiesToUTF(content[j].content));
								if (elements[k].firstChild===null) {
									elements[k].appendChild(n);
								} else {
									if (typeof(beforeSelector)!=="undefined") {
										m=lib([elements[k]]).find(beforeSelector).targets[0];
									} else {
										m=elements[k].firstChild;
									}
									m.parentNode.insertBefore(n, m);
								}
							}
						} else if (content[j].type==="cdata") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createCDataSection(content[j].content);
								if (elements[k].firstChild===null) {
									elements[k].appendChild(n);
								} else {
									if (typeof(beforeSelector)!=="undefined") {
										m=lib([elements[k]]).find(beforeSelector).targets[0];
									} else {
										m=elements[k].firstChild;
									}
									m.parentNode.insertBefore(n, m);
								}
							}
						} else if (content[j].type==="comment") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createComment(__.htmlEntitiesToUTF(content[j].content));
								if (elements[k].firstChild===null) {
									elements[k].appendChild(n);
								} else {
									if (typeof(beforeSelector)!=="undefined") {
										m=lib([elements[k]]).find(beforeSelector).targets[0];
									} else {
										m=elements[k].firstChild;
									}
									m.parentNode.insertBefore(n, m);
								}
							}
						} else if (content[j].type==="processing instruction") {
							for (k=0; k<elements.length; k++) {
								n=__.d.createProcessingInstruction(content[j].name, content[j].content);
								if (elements[k].firstChild===null) {
									elements[k].appendChild(n);
								} else {
									if (typeof(beforeSelector)!=="undefined") {
										m=lib([elements[k]]).find(beforeSelector).targets[0];
									} else {
										m=elements[k].firstChild;
									}
									m.parentNode.insertBefore(n, m);
								}
							}
						}
					}
				}
			}
		},
		parseMarkupLanguage:function(source, type) {
			"use strict";
			var at,	 // The index of the current character
				memAt=0,
				text,
				memText="",
				mainMarkupType,
				currentMarkupType,
				currentElement,
				res={ content:[] },
				r=res,
				tmp,
				regexp={
					unicodeJs:/^[\u0000-\uFFFD]+/,
					html:{
						opening:/^</,
						closing:/^>/,
						explicitAutoClosing:/^\/>/,
						explicitClosing:/^\/([a-z0-9\:]+)>/i,
						spaces:/^[\u0020\u0009\u000A\u000C\u000D]+/,
						name:/^[a-z0-9\:]+/i,
						doctype:/^\!?doctype/i,
						CDATAstart:/^\!\[CDATA\[/,
						CDATAend:/^\]\]/,
						commentStart:/^\!--/,
						commentEnd:/^--/,
						processingInstructionStart:/^\?[a-z0-9]+/,
						processingInstructionEnd:/^\?/,
						attributeName:/^[^\u0000-\u001F "'`<>\/=\?]+/,// No space, no control characters, and the rest
						attributeEqual:/^=/,
						attributeSimpleQuotedString:/^'([^\u0000-\u0008\u0010\u000B\u000E-\u001F']*)'/,// No control characters, no simple quote inside
						attributeDoubleQuotedString:/^"([^\u0000-\u0008\u0010\u000B\u000E-\u001F"]*)"/,// No control characters, no double quote inside
						attributeUnquotedString:/^[^\u0000-\u001F "'`<>\/=]+/,
						text:/^[^\u0000-\u0008\u0010\u000B\u000E-\u001F\u007F-\u009F\uFDD0-\uFDEF<]+/,// No control characters, and no undefined characters, and no opening of tag
						anything:/^[^\u0000-\u0008\u0010\u000B\u000E-\u001F\u007F-\u009F\uFDD0-\uFDEF]+/// No control characters, and no undefined characters
					},
					xml:{
						opening:/^</,
						closing:/^>/,
						explicitAutoClosing:/^\/>/,
						explicitClosing:/^\/((?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD])(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])*)>/,
						spaces:/^[\u0020\u0009\u000A\u000D]+/,
						name:/^(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD])(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])*/,
						doctype:/^\!?doctype/i,
						CDATAstart:/^\!\[CDATA\[/,
						CDATAend:/^\]\]/,
						commentStart:/^!--/,
						commentEnd:/^--/,
						processingInstructionStart:/^\?(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD])(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])+/,
						processingInstructionEnd:/^\?/,
						attributeName:/^(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD])(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])*/,
						attributeEqual:/^=/,
						attributeSimpleQuotedString:/^'(?:[^<&']|&(?:#(?:[0-9]+|x[0-9a-fA-F]+|(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD])(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])));|%)*'/,
						attributeDoubleQuotedString:/^"(?:[^<&"]|&(?:#(?:[0-9]+|x[0-9a-fA-F]+|(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD])(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])));|%)*"/,
						text:/^[^\u0000-\u0008\u0010\u000B\u000E-\u001F\u007F-\u009F\uFDD0-\uFDEF<]+/,// No control characters, and no undefined characters, and no opening of tag
						anything:/^[^\u0000-\u0008\u0010\u000B\u000E-\u001F\u007F-\u009F\uFDD0-\uFDEF]+/// No control characters, and no undefined characters
						/*namestartchar:/^:|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u0200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]/,
						namechar:/^:|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040]/,
						name:/^(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD])(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])+/,
						nametoken:/^(?::|[a-z]|[A-Z]|_|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u02FF]|[\u0370-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|-|[0-9]|\u00B7|[\u0300-\u036F]|[\u203F-\u2040])+/*/
					}
				},
				error=function(m) { // Call error when something is wrong.
					__.error("Syntax error : "+m+" at "+memAt+"\n"+memText.substring(0,200));
					return true;
				},
				testAndExec=function(r, optionnalText) {
					var ex;
					var t=optionnalText||text;
					if (r && (ex=r.exec(t))===null) {
						return false;
					} else {
						/*
							return the attended string
							and truncate the text
						*/
						t=t.substring(ex[0].length);
						if (typeof(optionnalText)!=="undefined") {
							optionnalText=t;
						} else {
							text=t;
							at+=ex[0].length;
						}
						return ex;
					}
				},
				ignoreTo=function(r) {
					var ex;
					if (r && (ex=r.exec(text))===null) {
						return false;
					} else {
						/*
							truncate the text and return true
						*/
						text=text.substring(ex.index+ex[0].length);
						at+=ex.index+ex[0].length;
						return true;
					}
				},
				anythingUntil=function(r, o) {
					var ex;
					if (r && (ex=r.exec(text))===null) {
						return false;
					} else {
						/*
							return the encapsed string
							and truncate the text
						*/
						var t="";
						if (__.isObject(o) && o.unless) {
							while (r.test(text) && o.unless.test(text.substring(0, ex.index))) {
								t+=text.substring(0, ex.index);
								text=text.substring(ex.index);
								at+=ex.index;
								ex=r.exec(text);
							}
						}
						if (ex!==null) {
							t+=text.substring(0, ex.index);
							text=text.substring(ex.index);
							at+=ex.index;
						}
						return t;
					}
				},
				markup=function() {
					if (regexp[currentMarkupType].opening.test(text.substring(0,1))) {
						memText=text;
						memAt=at;
						text=text.substring(1);
						var ex=testAndExec(regexp[currentMarkupType].name), 
							obj;
						if (ex!==false) {
							obj={ name:ex[0], type:"element", attributes:[], content:[], parent:r, closed:false };
							currentElement=ex[0];
							r.content.push(obj);
							r=obj;
							if (space()) {
								while (attribute()) {
									space();
								}	
							}
							closing(ex[0]) || error("Closure missing");
						} else if ((ex=testAndExec(regexp[currentMarkupType].explicitClosing))!==false) {
							currentElement=null;
							r=closeLastAndSetPointer(ex[1]);
						} else if (testAndExec(regexp[currentMarkupType].doctype)) {
							currentElement=null;
							obj={ name:"!DOCTYPE", type:"doctype", attributes:[], content:[], parent:r, closed:false };
							r.content.push(obj);
							r=obj;
							if (space()) {
								while (attribute()) {
									space();
								}	
							}
							closing() || error("Closure missing");
						} else if (testAndExec(regexp[currentMarkupType].commentStart)!==false) {
							currentElement=null;
							tmp=anythingUntil(/-->/, { unless:/<\!--/ });
							if (testAndExec(regexp[currentMarkupType].commentEnd)) {
								obj={ name:null, type:"comment", attributes:[], content:tmp, parent:r, closed:false };
								r.content.push(obj);
								space();
								closing() || error("Closure missing");
							} else {
								error("Comment ending missing");
							}
						} else if (testAndExec(regexp[currentMarkupType].CDATAstart)) {
							currentElement=null;
							tmp=anythingUntil(/\]\]>/, { unless:/<\!\[CDATA\[/ });
							if (testAndExec(regexp[currentMarkupType].CDATAend)) {
								obj={ name:null, type:"cdata", attributes:[], content:tmp, parent:r, closed:false };
								r.content.push(obj);
								space();
								closing() || error("Closure missing");
							} else {
								error("CDATA ending missing") && closing();
							}
						} else if ((ex=testAndExec(regexp[currentMarkupType].processingInstructionStart))!==false) {
							currentElement=ex[0];
							obj={ name:currentElement.replace(/^\?/, ""), type:"processing instruction", attributes:[], content:[], parent:r, closed:false };
							r.content.push(obj);
							r=obj;
							if (space()) {
								while (attribute()) {
									space();
								}
							}
							if (testAndExec(regexp[currentMarkupType].processingInstructionEnd)) {
								space();
								closing() || error("Closure missing");
							} else {
								error("Processing instruction ending missing") && closing();
							}
						} else {
							error("Tagname missing or wrong, uninterpretable tagname");
							ignoreTo(/>/) || error("Closure missing");
						}
						return true;
					} else {
						return false;
					}
				},
				data=function() {
					if (currentElement!=="script") {
						var ex=testAndExec(regexp[currentMarkupType].text);
						if (ex!==false) {
							var obj={ name:null, type:"text", attributes:[], content:ex[0], parent:r, closed:true };
							r.content.push(obj);
							return true;
						} else {
							return false;
						}
					} else {
						tmp=anythingUntil(/<\/script>/, { unless:/<script/ });
						var obj={ name:null, type:"text", attributes:[], content:tmp, parent:r, closed:true };
						r.content.push(obj);
						return true;
					}
				},
				attribute=function() {
					var ret;
					if (regexp[currentMarkupType].attributeName.test(text)) {
						var attributeName=testAndExec(regexp[currentMarkupType].attributeName)[0], ex;
						space();
						if (testAndExec(regexp[currentMarkupType].attributeEqual)) {
							space();
							if ((ex=testAndExec(regexp[currentMarkupType].attributeDoubleQuotedString))!==false) {
								r.attributes.push({ type:"attribute", name:attributeName, value:ex[0].substring(1, ex[0].length-1) });
								space();
								ret=1;
							} else if ((ex=testAndExec(regexp[currentMarkupType].attributeSimpleQuotedString))!==false) {
								r.attributes.push({ type:"attribute", name:attributeName, value:ex[0].substring(1, ex[0].length-1) });
								space();
								ret=2;
							} else if ("attributeUnquotedString" in regexp[currentMarkupType] && (ex=testAndExec(regexp[currentMarkupType].attributeUnquotedString))!==false) {
								r.attributes.push({ type:"attribute", name:attributeName, value:ex[0] });
								space();
								ret=3;
							} else {
								r.attributes.push({ type:"attribute", name:attributeName, value:"" });
								space();
								ret=4;
							}
						} else {
							r.attributes.push({ type:"attribute", name:attributeName, value:"" });
							space();
							ret=5;
						}
					} else if (regexp[currentMarkupType].attributeSimpleQuotedString.test(text)) {
						var attributeSimpleQuotedString=testAndExec(regexp[currentMarkupType].attributeSimpleQuotedString)[0];
						r.attributes.push({ type:"string", value:attributeSimpleQuotedString.substring(1, attributeSimpleQuotedString.length-1) });
						space();
						ret=6;
					} else if (regexp[currentMarkupType].attributeDoubleQuotedString.test(text)) {
						var attributeDoubleQuotedString=testAndExec(regexp[currentMarkupType].attributeDoubleQuotedString)[0];
						r.attributes.push({ type:"string", value:attributeDoubleQuotedString.substring(1, attributeDoubleQuotedString.length-1) });
						space();
						ret=7;
					} else {
						ret=0;
					}
					return ret>0;
				},
				closing=function(name) {
					if (testAndExec(regexp[currentMarkupType].explicitAutoClosing)!==false) {
						r.closed=true;
						r=r.parent;
						return true;
					} else if (regexp[currentMarkupType].closing.test(text) && typeof(name)!=="undefined" && RegExp('</'+name+'>', 'i').test(text)) {
						text=text.substring(1);
						//assume it will be closed next in parsing
						r.closed=false;
						return true;
					} else if (regexp[currentMarkupType].closing.test(text) && typeof(name)!=="undefined") {
						text=text.substring(1);
						//assume it should be explicitly auto closed
						r.closed=false;
						r=r.parent;
						return true;
					} else if (regexp[currentMarkupType].closing.test(text)) {
						text=text.substring(1);
						//assume it is auto closed
						r.closed=false;
						return true;
					} else {
						return false;
					}
				},
				closeLastAndSetPointer=function(name) {
					var found=false, i;
					var tempR=r;
					while (!found && "parent" in tempR) {
						if (tempR.name!==null && tempR.name===name && !tempR.closed) {
							tempR.closed=true;
							var mem=tempR;
							tempR=tempR.parent;
							found=true;
							break;
						} else {
							if (tempR.content.length>0) {
								i=1;
								while (tempR.content[tempR.content.length-i].type==="text" && i<tempR.content.length-1) {
									i++;
								}
								if (tempR.content[tempR.content.length-i].closed) {
									tempR=tempR.parent;
									i=1;
									while (tempR.content[tempR.content.length-i].type==="text" && i<tempR.content.length-1) {
										i++;
									}
									if (tempR.content[tempR.content.length-i].name!==null && !tempR.content[tempR.content.length-i].closed && tempR.content[tempR.content.length-i].name===name) {
										tempR.content[tempR.content.length-i].closed=true;
										var mem=tempR.content[tempR.content.length-i];
										found=true;
										break;
									}
								} else {
									break;
								}
							} else {
								break;
							}
						}
					}
					if (!found) {
						error("Found closing that does not match a previous opening : "+name);
					} else {
						r=tempR;
					}
					return r;
				},
				space=function() { // Skip whitespace.
					var ex=testAndExec(regexp[currentMarkupType].spaces);
					return ex!==false;
				},
				value=function() { // Parse a content. It can be a markup or simple data.
					space();
					while (markup() || data()) {
					}
					space();
					return true;
				}
			;
			text=source;
			mainMarkupType=type?type:"html";
			currentMarkupType=mainMarkupType;
			at=0;
			var v=value();
			if (text.length>0) {
				error("Some content could not be parsed");
			}
			return res.content;
		},
		cloneTo:function(targetsList, boolCloneChildren, attr, elements) {
			var res=[], i, j;
			for (i=0; i<elements.length; i++) {
				for (j=0; j<targetsList.length; j++) {
					var clone=elements[i].cloneNode(boolCloneChildren);
					targetsList[j].appendChild(clone);
					if (__.countProperties(attr)>0) {
						__.attr(attr, [clone]);
					}
					res.push(clone);
				}
			}
			return res;
		},
		isChildOf:function(parent, elements) {
			var res=[], e, i;
			for (i=0; i<elements.length; i++) {
				res[i]=false;
				if ("parentNode" in elements[i] && elements[i].parentNode!==null) {
					e=elements[i].parentNode;
					while (e!==__.d.documentElement && e.parentNode!==null) {
						if (e===parent) {
							res[i]=true;
							break;
						}
						if ("parentNode" in e && e.parentNode!==null) {
							e=e.parentNode;
						} else {
							break;
						}
					}
				}
			}
			return res;
		},
		isParentOf:function(child, elements) {
			var res=[], e, i;
			for (i=0; i<elements.length; i++) {
				res[i]=false;
				if ("parentNode" in child && child.parentNode!==null) {
					e=child.parentNode;
					while (e!==__.d.documentElement && e.parentNode!==null) {
						if (e===elements[i]) {
							res[i]=true;
							break;
						}
						if ("parentNode" in e && e.parentNode!==null) {
							e=e.parentNode;
						} else {
							break;
						}
					}
				}
			}
			return res;
		},
		isChildOfDeepWIthIndexes:function(parent, elements, res) {
			var res=[], e, indexes=[], i;
			for (i=0; i<elements.length; i++) {
				res[i]=false;
				indexes[i]=[];
				if ("parentNode" in elements[i] && elements[i].parentNode!==null) {
					e=elements[i].parentNode;
					if (e!==null) {
						indexes[i].push([].indexOf.call(e.childNodes, elements[i]));
						while (e!==__.d.documentElement && e.parentNode!==null) {
							if (e===parent) {
								res[i]=true;
								break;
							}
							indexes[i].push([].indexOf.call(e.parentNode.childNodes, e));
							if ("parentNode" in e && e.parentNode!==null) {
								e=e.parentNode;
							} else {
								break;
							}
						}
						if (!res[i]) {
							indexes[i]=[];
						}
					}
				}
			}
			return { result:res, indexes:indexes };
		},
		is:function(v, elements) {
			var i;
			if (typeof(v)!="string") {
				selements=[].concat(v);
			} else if (typeof(v)=="string") {
				if (v=="window") {
					selements=[window];
				} else if (v=="document") {
					selements=[__.d];
				} else if (__.d.querySelectorAll) {
					try {
						var sel=__.d.querySelectorAll(v);
						selements=[];
						for (i=0; i<sel.length; i++) {
							selements.push(sel[i]);
						}
					} catch (e) {
						console.log(e);
					}
				} else {
					selements=__.querySelectorAllReplacement(v, false);
				}
			}
			var res=[];
			for (i=0; i<elements.length; i++) {
				res[i]=false;
				for (j=0; j<selements.length; j++) {
					if (elements[i]===selements[j]) {
						res[i]=true;
					}
				}
			}
			return res;
		},
		href:function(str, elements) {
			var i;
			if (typeof(str)!="undefined") {
				for (i=0; i<elements.length; i++) {
					elements[i].href=str;
				}
			} else {
				var ret=[];
				for (i=0; i<elements.length; i++) {
					ret.push(elements[i].href);
				}
				return ret;
			}
		},
		createNode:function(type, params, content, elements, NS) {
			var res=[], value, element, i;
			for (i=0; i<elements.length; i++) {
				element=null;
				if (typeof(NS)=="undefined") {
					element=__.d.createElement(type);
				} else if (typeof(NS)=="string") {
					element=__.d.createElementNS(NS, type);
				}
				if (!(type=="style" && window.navigator.userAgent.toString().match(/MSIE [5-8]/i))) {
					for (var param in params) {
						if (!__.isObject(params[param])) {
							value=params[param];
							if (/className/.test(param)) {
								param="class";
							}
							if (!/:/.test(param)) {
								element.setAttribute(param, value);
							} else {
								if (/^xmlns:/.test(param)) {
									var ns="http://www.w3.org/2000/xmlns/";
									element.setAttributeNS(ns, param, value);
								} else if (/^html:/.test(param)) {
									var ns="http://www.w3.org/1999/xhtml";
									element.setAttributeNS(ns, param, value);
								} else if (/^svg:/.test(param)) {
									var ns="http://www.w3.org/2000/svg";
									element.setAttributeNS(ns, param, value);
								} else if (/^xlink:/.test(param)) {
									var ns="http://www.w3.org/1999/xlink";
									element.setAttributeNS(ns, param, value);
								} else if (/^xml:/.test(param)) {
									var ns="http://www.w3.org/XML/1998/namespace";
									element.setAttributeNS(ns, param, value);
								} else if (/^m:/.test(param)) {
									var ns="http://www.w3.org/1998/Math/MathML";
									element.setAttributeNS(ns, param, value);
								}
							}
						} else {
							var props=__.getPropertiesContainingValues(params[param], null);
							for (var a=0; a<props.length; a++) {
								value=params[param];
								for (b=0; b<props[a].length; b++) {
									value=value[props[a][b]];
								}
								__.setPropertyValueDeep(value, element, [param].concat(props[a]));
							}
						}
					}
				}
				elements[i].appendChild(element);
				res.push(element);
				if (content!==null && content!=="") {
					if (type=="style" && window.navigator.userAgent.toString().match(/MSIE [5-8]/i)) {
						var rCss=/([^\{]+)\{([^\}]+)\}/m;
						if (__.d.styleSheets.length===0) {
							var styleSheet = __.d.createElement('style');
							__.d.documentElement.firstChild.appendChild(styleSheet);
						}
						while (content.match(rCss)) {
							var obj=rCss.exec(content);
							var full=obj[0];
							var selector=obj[1].split(/\s/).join(" ");
							var rule=obj[2].split(/\s/).join(" ");
							content=content.replace(full, "");
							if (!__.d.styleSheets[0]) {
								__.d.createStyleSheet();
							}
							if (!__.d.styleSheets[__.d.styleSheets.length-1].cssText.match(RegExp(selector, "i"))) {
								rule=__.d.styleSheets[__.d.styleSheets.length-1].addRule(selector, rule, -1);
							}
						}
					} else if (type=="script") {
						element.text=content;
					} else {
						element.innerHTML=content;
					}
				}
			}
			return lib(res);
		},
		createNodeAtIndex:function(type, index, params, iHTML, elements, NS) {
			var res=[], value, element, i;
			for (i=0; i<elements.length; i++) {
				element=null;
				if (typeof(NS)=="undefined") {
					element=__.d.createElement(type);
				} else if (typeof(NS)=="string") {
					element=__.d.createElementNS(NS, type);
				}
				if (!(type=="style" && window.navigator.userAgent.toString().match(/MSIE [5-8]/i))) {
					for (var param in params) {
						if (!__.isObject(params[param])) {
							value=params[param];
							if (/className/.test(param)) {
								param="class";
							}
							if (!/:/.test(param)) {
								element.setAttribute(param, value);
							} else {
								if (/^xmlns:/.test(param)) {
									var ns="http://www.w3.org/2000/xmlns/";
									element.setAttributeNS(ns, param, value);
								} else if (/^html:/.test(param)) {
									var ns="http://www.w3.org/1999/xhtml";
									element.setAttributeNS(ns, param, value);
								} else if (/^svg:/.test(param)) {
									var ns="http://www.w3.org/2000/svg";
									element.setAttributeNS(ns, param, value);
								} else if (/^xlink:/.test(param)) {
									var ns="http://www.w3.org/1999/xlink";
									element.setAttributeNS(ns, param, value);
								} else if (/^xml:/.test(param)) {
									var ns="http://www.w3.org/XML/1998/namespace";
									element.setAttributeNS(ns, param, value);
								} else if (/^m:/.test(param)) {
									var ns="http://www.w3.org/1998/Math/MathML";
									element.setAttributeNS(ns, param, value);
								}
							}
						} else {
							var props=__.getPropertiesContainingValues(params[param], null);
							for (var a=0; a<props.length; a++) {
								value=params[param];
								for (b=0; b<props[a].length; b++) {
									value=value[props[a][b]];
								}
								__.setPropertyValueDeep(value, element, [param].concat(props[a]));
							}
						}
					}
				}
				if (index<=elements[i].childNodes.length) {
					elements[i].insertBefore(element, elements[i].childNodes[index]);
				} else {
					elements[i].appendChild(element);
				}
				res.push(element);
				if (iHTML!==null && iHTML!=="") {
					if (type=="style" && window.navigator.userAgent.toString().match(/MSIE [5-8]/i)) {
						var rCss=/([^\{]+)\{([^\}]+)\}/m;
						if (__.d.styleSheets.length===0) {
							var styleSheet = __.d.createElement('style');
							__.d.documentElement.firstChild.appendChild(styleSheet);
						}
						while (iHTML.match(rCss)) {
							var obj=rCss.exec(iHTML);
							var full=obj[0];
							var selector=obj[1].split(/\s/).join(" ");
							var rule=obj[2].split(/\s/).join(" ");
							iHTML=iHTML.replace(full, "");
							if (!__.d.styleSheets[0]) {
								__.d.createStyleSheet();
							}
							if (!__.d.styleSheets[__.d.styleSheets.length-1].cssText.match(RegExp(selector, "i"))) {
								rule=__.d.styleSheets[__.d.styleSheets.length-1].addRule(selector, rule, -1);
							}
						}
					} else if (type=="script") {
						element.text=iHTML;
					} else {
						element.innerHTML=iHTML;
					}
				}
			}
			return lib(res);
		},
		sanitizeHTML:function(s) {
			var d=__.d.createElement('div');
			d.appendChild(__.d.createTextNode(s));
			return d.innerHTML;
		},
		dispatch:function(eventType, elements) {
			for (i=0; i<elements.length; i++) {
			  	if ("dispatchEvent" in elements[i]) {
			  		var eventObj = __.d.createEvent('Events');
			    		eventObj.initEvent(eventType, true, false);
			    		elements[i].dispatchEvent(eventObj);
			    		
			  	} else if ("fireEvent" in elements[i]) {
			    		elements[i].fireEvent('on' + eventType);
			    	}
			}
		},
		normalizeWheelEvent:function(event) {
			var PIXEL_STEP  = 10;
			var LINE_HEIGHT = 40;
			var PAGE_HEIGHT = 800;
			var sX = 0, sY = 0,       // spinX, spinY
				pX = 0, pY = 0;       // pixelX, pixelY

			// Legacy
			if ('detail'      in event) { sY = event.detail; }
			if ('wheelDelta'  in event) { sY = -event.wheelDelta / 120; }
			if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
			if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

			// side scrolling on FF with DOMMouseScroll
			if ( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
				sX = sY;
				sY = 0;
			}

			pX = sX * PIXEL_STEP;
			pY = sY * PIXEL_STEP;
			
			if ('deltaY' in event) { pY = event.deltaY; }
			if ('deltaX' in event) { pX = event.deltaX; }

			if ((pX || pY) && event.deltaMode) {
				if (event.deltaMode == 1) {          // delta in LINE units
					pX *= LINE_HEIGHT;
					pY *= LINE_HEIGHT;
				} else {                             // delta in PAGE units
					pX *= PAGE_HEIGHT;
					pY *= PAGE_HEIGHT;
				}
			}

			// Fall-back if spin cannot be determined
			if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
			if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

			return { 
				spinX  : sX,
			   	spinY  : sY,
			   	pixelX : pX,
			   	pixelY : pY 
			};
		},
		wheel:function(originalEvent, callback) {
			!originalEvent && ( originalEvent = window.event );
			// create a normalized event object
			var target=originalEvent.libTarget || originalEvent.target || originalEvent.srcElement;
			var event = {
				// keep a ref to the original event object
				originalEvent:originalEvent,
				target:target,
				type:"wheel",
				deltaMode:originalEvent.type=="MozMousePixelScroll"?0:1,
				deltaX:0,
				delatZ:0
			};
			if ([window,__.d,document.body].indexOf(target)===-1) {
				event.preventDefault=function() {
					originalEvent.preventDefault?
						originalEvent.preventDefault():
						originalEvent.returnValue=false;
				};
			}
			// normalize deltaY
			var obj=__.normalizeWheelEvent(originalEvent);
			event.deltaX=obj.pixelX;
			event.deltaY=obj.pixelY;
			event.spinX=obj.spinX;
			event.spinY=obj.spinY;
			return callback(event);
		},
		addWheelListener:function(element, fn, useCapture, ts) {
			var eventType = "onwheel" in __.d.createElement("div") ? "wheel" : // Modern browsers support "wheel"
					"onmousewheel" in __.d ? "mousewheel" : // Webkit and IE support at least "mousewheel"
					"MozMousePixelScroll"; // let's assume that remaining browsers are older Firefox
			__.registeredListeners[element.guid+"_wl_"+ts]=function(e) { e.libTarget=element; __.wheel(e, fn); };
			if (element.addEventListener) {
				element.addEventListener(eventType, __.registeredListeners[element.guid+"_wl_"+ts], useCapture);
			} else if (element.attachEvent) {
				element.attachEvent("on"+eventType, __.registeredListeners[element.guid+"_wl_"+ts]);
			}
		},
		removeWheelListener:function(element, fn, useCapture, ts) {
			var eventType = "onwheel" in __.d.createElement("div") ? "wheel" : // Modern browsers support "wheel"
					"onmousewheel" in __.d ? "mousewheel" : // Webkit and IE support at least "mousewheel"
					"MozMousePixelScroll"; // let's assume that remaining browsers are older Firefox
			if ("guid" in element && element.guid+"_wl_"+ts in __.registeredListeners) {
				if (element.removeEventListener) {
					element.removeEventListener(eventType, __.registeredListeners[element.guid+"_wl_"+ts], useCapture);
				} else if (element.detachEvent) {
					element.detachEvent("on"+eventType, __.registeredListeners[element.guid+"_wl_"+ts]);
				}
			}
		},
		registeredListeners:[],
		on:function(eventType, fn, useCapture, elements) {
			var i, f, ts=fn.toString();
			if (typeof(useCapture)==="undefined") {
				useCapture=false;
			}
			if (/\s+/.test(__.trim(eventType))) {
				let events=__.trim(eventType).split(/\s+/);
				for (var e in events) {
					__.on(events[e], fn, useCapture, elements);
				}
				return true;
			}
			if (typeof(fn)==="function") {
				for (i=0; i<elements.length; i++) {
					if (!("guid" in elements[i])) {
						elements[i].guid=__.guid();
					}
					if (!(elements[i].guid in __.registeredListeners)) {
						__.registeredListeners[elements[i].guid]={};
					}
					if (!(eventType in __.registeredListeners[elements[i].guid])) {
						__.registeredListeners[elements[i].guid][eventType]={};
					}
					if (eventType!=="wheel") {
						if (elements[i].addEventListener) {
							f=function(element, fn) { return function(e) { e.libTarget=element; fn(e); } }(elements[i], fn);
							if (ts in __.registeredListeners[elements[i].guid][eventType] && __.isObject(__.registeredListeners[elements[i].guid][eventType][ts])) {
								elements[i].removeEventListener(eventType, __.registeredListeners[elements[i].guid][eventType][ts].F, useCapture);
								__.registeredListeners[elements[i].guid][eventType][ts]=null;
							}
							__.registeredListeners[elements[i].guid][eventType][ts]={ F:f, oF:fn };
							elements[i].addEventListener(eventType, __.registeredListeners[elements[i].guid][eventType][ts].F, useCapture);
						} else if (elements[i].attachEvent) {
							f=function(element, fn) { return function() { e=window.event; e.target=e.srcElement; e.libTarget=element; fn(e); } }(elements[i], fn);
							if (ts in __.registeredListeners[elements[i].guid][eventType] && __.isObject(__.registeredListeners[elements[i].guid][eventType][ts])) {
								elements[i].detachEvent("on"+eventType, __.registeredListeners[elements[i].guid][eventType][ts].F);
								__.registeredListeners[elements[i].guid][eventType][ts]=null;
							}
							__.registeredListeners[elements[i].guid][eventType][ts]={ F:f, oF:fn };
							elements[i].attachEvent("on"+eventType, __.registeredListeners[elements[i].guid][eventType][ts].F);
						}
					} else {
						f=function(element, fn) { return function(e) { e.libTarget=element; fn(e); } }(elements[i], fn);
						if (ts in __.registeredListeners[elements[i].guid][eventType] && __.isObject(__.registeredListeners[elements[i].guid][eventType][ts])) {
							__.removeWheelListener(elements[i], __.registeredListeners[elements[i].guid][eventType][ts].F, useCapture);
							__.registeredListeners[elements[i].guid][eventType][ts]=null;
						}
						__.registeredListeners[elements[i].guid][eventType][ts]={ F:f, oF:fn };
						__.addWheelListener(elements[i], __.registeredListeners[elements[i].guid][eventType][ts].F, useCapture, ts);
					}
				}
			}
			return true;
		},
		off:function(eventType, fn, useCapture, elements) {
			var i, f, ts=fn.toString();
			if (typeof(useCapture)==="undefined") {
				useCapture=false;
			}
			if (/\s+/.test(__.trim(eventType))) {
				let events=__.trim(eventType).split(/\s+/);
				for (var e in events) {
					__.off(events[e], fn, useCapture, elements);
				}
				return true;
			}
			if (typeof(fn)==="function") {
				for (i=0; i<elements.length; i++) {
					if (("guid" in elements[i]) && (elements[i].guid in __.registeredListeners) && (eventType in __.registeredListeners[elements[i].guid])) {
						if (eventType!=="wheel") {
							if (elements[i].removeEventListener) {
								f=function(element, fn) { return function(e) { e.libTarget=element; fn(e); } }(elements[i], fn);
								if (ts in __.registeredListeners[elements[i].guid][eventType] && __.isObject(__.registeredListeners[elements[i].guid][eventType][ts])) {
									elements[i].removeEventListener(eventType, __.registeredListeners[elements[i].guid][eventType][ts].F, useCapture);
									__.registeredListeners[elements[i].guid][eventType][ts]=null;
								}
							} else if (elements[i].detachEvent) {
								f=function(element, fn) { return function() { e=window.event; e.target=e.srcElement; e.libTarget=element; fn(e); } }(elements[i], fn);
								if (ts in __.registeredListeners[elements[i].guid][eventType] && __.isObject(__.registeredListeners[elements[i].guid][eventType][ts])) {
									elements[i].detachEvent("on"+eventType, __.registeredListeners[elements[i].guid][eventType][ts].F);
									__.registeredListeners[elements[i].guid][eventType][ts]=null;
								}
							}
						} else {
							f=function(element, fn) { return function(e) { e.libTarget=element; fn(e); } }(elements[i], fn);
							if (ts in __.registeredListeners[elements[i].guid][eventType] && __.isObject(__.registeredListeners[elements[i].guid][eventType][ts])) {
								__.removeWheelListener(elements[i], __.registeredListeners[elements[i].guid][eventType][ts].F, useCapture, ts);
								__.registeredListeners[elements[i].guid][eventType][ts]=null;
							}
						}
					}
				}
			}
		},
		moveAtIndex:function(index, elements, _lib) {
			for (let i=0; i<elements.length; i++) {
				if (elements[i].parentNode!==null) {
					if (index<elements[i].parentNode.childNodes.length) {
						elements[i].parentNode.insertBefore(elements[i], elements[i].parentNode.childNodes[index]);
					} else {
						elements[i].parentNode.appendChild(elements[i]);
					}
				}
			}
			return _lib(elements);
		},
		removeAtIndexes:function(indexes, elements) {
			for (var i=0; i<indexes.length; i++) {
				if (typeof(elements[indexes[i]])!="undefined" && typeof(elements[indexes[i]].parentNode)!="undefined" && elements[indexes[i]].parentNode!==null) {
					elements[indexes[i]].parentNode.removeChild(elements[indexes[i]]);
				}
			}
		},
		remove:function(elements) {
			for (var i=0; i<elements.length; i++) {
				if (typeof(elements[i])!="undefined" && typeof(elements[i].parentNode)!="undefined" && elements[i].parentNode!==null) {
					elements[i].parentNode.removeChild(elements[i]);
				}
			}
		},
		empty:function(elements) {
			let i, j;
			for (i=0; i<elements.length; i++) {
				for (j=0; j<elements[i].childNodes.length; j++) {
					elements[i].removeChild(elements[i].childNodes[j]);
				}
			}
		},
		find:function(str, elements, _lib) {
			let targets=[];
			let i, j;
			let sel=[];
			for (i=0; i<elements.length; i++) {
				if (elements[i].querySelectorAll && !/^[>+~]/.test(str)) {
					try {
						sel=elements[i].querySelectorAll(str);
						for (j=0; j<sel.length; j++) {
							targets.push(sel[j]);
						}
					} catch(e) {
						console.log(e);
					}
				} else {
					targets=targets.concat(__.querySelectorAllReplacement(str, elements[i]));
				}
			}
			return lib(targets);
		},
		getParentMatchingSelector:function(str, elements, _lib) {
			let targets=[];
			let i, j, t;
			let sel=lib(str).targets;
			for (i=0; i<elements.length; i++) {
				t=elements[i];
				while (t.parentNode!==null) {
					t=t.parentNode;
					if (sel.indexOf(t)!==-1) {
						targets.push(t);
					}
				}
			}
			return lib(targets);
		},
		findInternal:function(str, elements) {
			ret=[];
			for (var i=0; i<elements.length; i++) {
				ret=ret.concat(__.querySelectorAllReplacement(str, elements[i]));
			}
			return ret;
		},
		lastKeyIn:function(obj) {
			var mem;
			for (var prop in obj) {
				mem=prop;
			}
			return mem;
		},
		keyAtIndex:function(obj, index) {
			var i=0;
			for (var prop in obj) {
				if (i==index) {
					return prop;
				}
				i++;
			}
		},
		indexOfKey:function(needle, obj) {
			var index=-1;
			var i=0;
			for (var val in obj) {
				if (val==needle) {
					index=i;
				}
				i++;
			}
			return index;
		},
		numericalIndexOfVal:function(needle, obj) {
			var index=-1;
			var i=0;
			for (var prop in obj) {
				if (obj[prop]==needle) {
					index=i;
				}
				i++;
			}
			return index;
		},
		indexesOfValRecursive:function(needle, obj, currentIndexes) {
			if (typeof(currentIndexes)==="undefined") {
				currentIndexes=[];
			}
			var res=[], tmp;
			for (var prop in obj) {
				if (obj[prop]==needle) {
					res.push(currentIndexes.concat(prop));
				} else if (__.isArray(obj[prop]) || __.isObject(obj[prop])) {
					tmp=__.indexesOfValRecursive(needle, obj[prop], currentIndexes.concat(prop));
					if (0 in tmp) {
						res=res.concat(tmp[0]);
					}
				}
			}
			return res;
		},
		indexesOfKeyAndValRecursive:function(needlesObj, obj, currentIndexes) {
			if (typeof(currentIndexes)==="undefined") {
				currentIndexes=[];
			}
			var res=[], c=__.countProperties(needlesObj), tmp, p1, p2;
			for (p1 in needlesObj) {
				for (p2 in obj) {
					if (obj[p2]==needlesObj[p1] && p2===p1) {
						c--;
					} else if (__.isArray(obj[p2]) || __.isObject(obj[p2])) {
						tmp=__.indexesOfKeyAndValRecursive(needlesObj, obj[p2], currentIndexes.concat(p2));
						if (__.isArray(tmp)) {
							currentIndexes=tmp;
							c=0;
							break;
						}
					}
				}
			}
			if (c<=0) {
				return currentIndexes;
			} else return false;
		},
		valueExistsIn:function(val, obj) {
			for (var prop in obj) {
				if (obj[prop]==val) {
					return true;
				}
			}
			return false;
		},
		valueExistsInRecursive:function(val, obj) {
			for (var prop in obj) {
				if (obj[prop]==val) {
					return true;
				} else if (__.isArray(obj[prop]) || __.isObject(obj[prop])) {
					if (__.valueExistsInRecursive(val, obj[prop])) {
						return true;
					}
				}
			}
			return false;
		},
		concatArraysWithStringKeys:function(arrayOfArrays) {
			var res=[], i, p;
			for (i=0; i<arrayOfArrays.length; i++) {
				for (p in arrayOfArrays[i]) {
					res[p]=arrayOfArrays[i][p];
				}
			}
			return res;
		},
		isArray:function(obj) {
			if (Object.prototype.toString.call(obj)==='[object Array]') {
				return true;
			} else {
				return false;
			}
		},
		isNumericalArray:function(obj) {
			if (__.isArray(obj)) {
				for (var prop in obj) {
					if (["indexOf","lastIndexOf","forEach","every","some","filter","map","reduce","reduceRight"].indexOf(prop)==-1 && ((typeof(prop)==="string" && !/^[0-9]|[1-9][0-9]+$/.test(prop)) || (typeof(prop)==="number" && prop|0!==prop))) {
						return false;
					}
				}
				return true;
			} else return false;
		},
		isObject:function(obj) {
			if (Object.prototype.toString.call(obj)==='[object Object]') {
				return true;
			} else {
				return false;
			}
		},
		countProperties:function(obj) {
			if (__.isObject(obj) || __.isArray(obj)) {
				return Object.keys(obj).length;
			} else return 0;
		},
		countNumberValues:function(obj) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])=="number") {
					count++;
				}
			}
			return count;
		},
		countStringValues:function(obj) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])=="string") {
					count++;
				}
			}
			return count;
		},
		countNotFunctionValues:function(obj) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])!="function") {
					count++;
				}
			}
			return count;
		},
		countNotNumberValues:function(obj) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])!="number") {
					count++;
				}
			}
			return count;
		},
		countNotStringValues:function(obj) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])!="string") {
					count++;
				}
			}
			return count;
		},
		countNotNullValues:function(obj) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])!="undefined" && obj[prop]!=null) {
					count++;
				}
			}
			return count;
		},
		countPropertiesNamedRecursive:function(obj, val) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])!="object" && prop==val) {
					count++;
				} else if (typeof(obj[prop])=="object") {
					count+=countPropertiesRecursive(obj[prop]);
				}
			}
			return count;
		},
		countPropertiesForValue:function(obj, val) {
			var count=0;
			for (var prop in obj) {
				if (obj[prop]==val) {
					count++;
				}
			}
			return count;
		},
		countPropertiesRecursive:function(obj) {
			var count=0;
			for (var prop in obj) {
				if (typeof(obj[prop])!="object") {
					count++;
				} else {
					count+=countPropertiesRecursive(obj[prop]);
				}
			}
			return count;
		},
		countPropertiesWhereValueEqualsRecursive:function(obj, value) {
			var count=0;
			for (var prop in obj) {
				if (obj[prop]===value) {
					count++;
				} else if (__.isArray(obj[prop]) || __.isObject(obj[prop])) {
					count+=__.countPropertiesWhereValueEqualsRecursive(obj[prop], value);
				}
			}
			return count;
		},
		getPropertiesContainingValues:function(obj, propLevel) {
			var props=[];
			var objCopy=obj;
			if (__.isArray(propLevel)) {
				for (var i=0; i<propLevel.length; i++) {
					if (propLevel[i] in obj) {
						obj=obj[propLevel[i]];
					}
				}
			} else {
				propLevel=[];
			}
			for (var prop in obj) {
				if (typeof(obj[prop])=="object") {
					var arg;
					if (propLevel.length===0) {
						arg=[prop];
					} else {
						arg=propLevel;
						arg.push(prop);
					}
					props=props.concat(__.getPropertiesContainingValues(objCopy, arg));
				} else {
					props.push(propLevel.concat([prop]));
				}
			}
			return props;
		},
		getPropertiesWhereValueEquals:function(obj, value, propLevel) {
		  	var props=[], res, found=false;
		  	var objCopy=obj;
		  	if (__.isArray(propLevel)) {
				for (var i=0; i<propLevel.length; i++) {
			  		if (propLevel[i] in obj) {
						obj=obj[propLevel[i]];
			  		}
				}
		  	} else {
				propLevel=[];
		  	}
		  	if (typeof(obj)=="object") {
				for (var prop in obj) {
			  		if (typeof(obj[prop])=="object") {
						var arg;
						if (propLevel.length===0) {
				  			arg=[prop];
						} else {
				  			arg=propLevel;
				  			arg.push(prop);
						}
						res=__.getPropertiesWhereValueEquals(objCopy, value, arg);
						if (res.length>0 && res[0]) {
				  			found=true;
				  			props=props.concat(res[1]);
						}
			  		} else if (obj[prop]===value) {
						found=true;
						props.push(propLevel.concat([prop]));
			  		}
				}
		  	}
		  	return propLevel.length===0?props:[found, props];
		},
		setPropertyValueDeep:function(v, target, properties) {
			if (properties.length>1) {
				var t=target[properties[0]];
				for (var i=1; i<properties.length; i++) {
					if (i!==properties.length-1) {
						t=t[properties[i]];
					} else {
						t[properties[i]]=v;
					}
				}
				target[t]=t;
			} else {
				target[properties[0]]=v;
			}
		},
		getPropertyValueDeep:function(target, properties) {
			if (properties.length>1) {
				var t=target[properties[0]];
				for (var i=1; i<properties.length; i++) {
					if (i!==properties.length-1) {
						t=t[properties[i]];
					} else {
						return t[properties[i]];
					}
				}
			} else {
				return target[properties[0]];
			}
		},
		getUnit:function(variable) {
			if (typeof(variable)=="string") {
				if (__.regs.cssUnits.test(variable)) {
					var obj=__.regs.cssUnits.exec(variable);
					if (obj!==null) {
						return obj[1].toLowerCase();
					} else {
						return null;
					}
				} else if (__.regs.cssAngleUnits.test(variable)) {
					var obj=__.regs.cssAngleUnits.exec(variable);
					if (obj!==null) {
						return obj[1].toLowerCase();
					} else {
						return null;
					}
				} else {
					return null;
				}
			} else {
				return null;
			}
		},
		getPrefix:function(variable) {
			if (typeof(variable)=="string") {
				var obj=__.regs.cssPrefixValueAndUnits.exec(variable);
				if (obj!==null && (1 in obj)) {
					return obj[1];
				} else {
					return null;
				}
			} else if (typeof(variable)=="number") {
				return null;
			} else {
				return null;
			}
		},
		getSuffix:function(variable) {
			if (typeof(variable)=="string") {
				var obj=__.regs.cssValueAndUnits.exec(variable);
				if (obj!==null && (1 in obj)) {
					return obj[1];
				} else {
					return null;
				}
			} else if (typeof(variable)=="number") {
				return null;
			} else {
				return null;
			}
		},
		getValue:function(variable) {
			if (/\-?[0-9]+\.[0-9]+(?:[e|E][+|-]?[0-9]+)?/.test(variable)) {
				return parseFloat(/\-?[0-9]+\.[0-9]+(?:[e|E][+|-]?[0-9]+)?/.exec(variable));
			} else if (/\-?[0-9]+/.test(variable)) {
				return parseInt(/\-?[0-9]+/.exec(variable), 10);
			} else {
				return null;
			}
		},
		s4:function() {
			return Math.floor((1+Math.random())* 0x10000).toString(16).substring(1);
  		},
  		guid:function() {
			return __.s4()+__.s4()+'-'+__.s4()+'-'+__.s4()+'-'+__.s4()+'-'+__.s4()+__.s4()+__.s4();
  		},
  		fixBindIfNeeded:function() {
  			if (typeof(Function.prototype.bind)!=="function") {
				Function.prototype.bind = function(ctx) {
					var fn = this;
					return function() {
						fn.apply(ctx, arguments);
					};
				};
			}
  		},
		animLoop:function() {
			var t=__.timer();
			__.rAnimFrame(__.animLoop);
		},
  		rAnimFrameInitiated:false,
		rAnimFrameInit:function() {
			__.lastTime = 0;
			var vendors = ['webkit', 'moz', 'ms'];
			__.fixBindIfNeeded();
			__.requestAnimationFrame=window.requestAnimationFrame.bind(window);
			for (var x = 0; x<vendors.length && !__.requestAnimationFrame; ++x) {
				__.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'].bind(window);
			}
			if (!__.requestAnimationFrame) {
				__.requestAnimationFrame = function(callback) {
					var id = window.setTimeout(callback, 16);
					return id;
				};
			}
			__.rAnimFrameInitiated=true;
		},
		rAnimFrameID:false,
		rAnimFrame:function(callback) {
			if (!__.rAnimFrameInitiated) {
				__.rAnimFrameInit();
			}
			__.rAnimFrameID=__.requestAnimationFrame(callback);
		},
		cAnimFrameInitiated:false,
		cAnimFrameInit:function() {
			var vendors = ['webkit', 'moz', 'ms'];
			__.fixBindIfNeeded();
			__.cancelAnimationFrame=window.cancelAnimationFrame.bind(window);
			for (var x = 0; x<vendors.length && !__.cancelAnimationFrame; ++x) {
				__.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'].bind(window) || window[vendors[x]+'CancelRequestAnimationFrame'].bind(window);
			}
			if (!__.cancelAnimationFrame) {
				__.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
			}
			__.cAnimFrameInitiated=true;
		},
		cAnimFrame:function() {
			if (!__.cAnimFrameInitiated) {
				__.cAnimFrameInit();
			}
			__.cancelAnimationFrame(__.rAnimFrameID);
			__.rAnimFrameID=false;
		},
		animationRenderString:function(time, duration, easing, start, end, separator, treatment, bezier, prefixes) {
			var value="";
			if (__.isObject(start) && __.isObject(end) && "value" in start && "value" in end) {
				value=(end.prefix?end.prefix:"")+__.animationRenderString(time, duration, easing, start.value, end.value, end.separator, "treatment" in end?end.treatment:null, bezier, prefixes)+(end.unit?end.unit:"")+(end.suffix?end.suffix:"");
			} else if (__.isObject(start) && __.isObject(end) && "r" in start && "g" in start && "b" in start && "a" in start && "r" in end && "g" in end && "b" in end && "a" in end && typeof(treatment)==="function") {
				value=treatment(__.animationRenderString(time, duration, easing, start.r, end.r, null))+(separator?separator:"")+treatment(__.animationRenderString(time, duration, easing, start.g, end.g, null))+(separator?separator:"")+treatment(__.animationRenderString(time, duration, easing, start.b, end.b, null))+(separator?separator:"")+__.animationRenderString(time, duration, easing, start.a, end.a, null);
			} else if (__.isNumericalArray(start) && __.isNumericalArray(end)) {
				for (var i=0; i<start.length; i++) {
					if (__.isNumericalArray(prefixes) && prefixes.length===start.length) {
						value+=(i>0 && prefixes[i]!==","?" ":"")+prefixes[i]+" ";
					}
					value+=__.animationRenderString(time, duration, easing, start[i], end[i], (__.isObject(end[i]) && "treatment" in end[i]?end[i].treatment:false), bezier, false)+(separator && i<start.length-1?separator:"");
				}
			} else if (typeof(start)==="number" && typeof(end)==="number" && __.isNumericalArray(bezier)) {
				value=__.bezier(start, end, bezier, time/duration);
			} else if (typeof(start)==="number" && typeof(end)==="number" && !bezier) {
				if (typeof(easing)==="string" && easing in __.easing) {
					value=__.easing[easing](time, start, end-start, duration).toString();
				} else {
					value=start+(end-start)*(time/duration).toString();
				}
				if (typeof(treatment)==="function") {
					value=treatment(value).toString();
				} else {
					value=value.toString();
				}
			} else if (typeof(start)==="string" && typeof(end)==="string") {
				value=end;
			}
			return value;
		},
		animationRenderEndString:function(end, separator, prefixes, treatment) {
			var value="";
			if (__.isObject(end) && "value" in end) {
				value=(end.prefix?end.prefix:"")+__.animationRenderEndString(("postAnimValue" in end?end.postAnimValue:end.value), end.separator, prefixes, treatment)+(end.unit && !("postAnimValue" in end)?end.unit:"")+(end.suffix?end.suffix:"");
			} else if (__.isObject(end) && "r" in end && "g" in end && "b" in end && "a" in end && typeof(treatment)==="function") {
				value=__.animationRenderEndString(end.r, null, false, treatment)+(separator?separator:"")+__.animationRenderEndString(end.g, null, false, treatment)+(separator?separator:"")+__.animationRenderEndString(end.b, null, false, treatment)+(separator?separator:"")+__.animationRenderEndString(end.a, null, false, false);
			} else if (__.isNumericalArray(end)) {
				for (var i=0; i<end.length; i++) {
					if (__.isNumericalArray(prefixes) && prefixes.length===end.length) {
						value+=(i>0 && prefixes[i]!==","?" ":"")+prefixes[i]+" ";
					}
					value+=__.animationRenderEndString(end[i], false, false, (__.isObject(end[i]) && "treatment" in end[i]?end[i].treatment:false))+(separator && i<end.length-1?separator:"");
				}
			} else if (typeof(end)==="number") {
				if (typeof(treatment)==="function") {
					value=treatment(end).toString();
				} else {
					value=end.toString();
				}
			}  else if (typeof(end)==="string") {
				value=end;
			}
			return value;
		},
		timer:function() {
			if (__.tQ.length>0) {
				var date=new Date();
				var value,t,x,timeElapsed;
				for (t=0; t<__.tQ.length; t++) {
					timeElapsed=date.getTime()-__.tQ[t][1].startTime;
					if (timeElapsed<__.tQ[t][1].duration) {
						for (x=0; x<__.tQ[t][0].length; x++) {
							value=__.animationRenderString(timeElapsed, __.tQ[t][1].duration, __.tQ[t][1].easing, __.tQ[t][0][x].start, __.tQ[t][0][x].end, __.tQ[t][0][x].end.separator, null, ("bezier" in __.tQ[t][0][x]?__.tQ[t][0][x].bezier:false), ("prefixes" in __.tQ[t][0][x]?__.tQ[t][0][x].prefixes:false));
							__.affectValue(value, { target:__.tQ[t][0][x].target, properties:__.tQ[t][0][x].properties });
						}
					}
				}
			} else {
				__.cAnimFrame();
			}
			return true;
		},
		timerComplete:function(uid) {
			var m,t,x,value;
			t=0;
			while (t<__.tQ.length) {
				if (__.tQ[t][2]===uid) {
					m=__.tQ[t];
					__.tQ.splice(t,1);
					for (x=0; x<m[0].length; x++) {
						value=__.animationRenderEndString(m[0][x].end, m[0][x].separator, ("prefixes" in m[0][x]?m[0][x].prefixes:false), m[0][x].end.treatment);
						__.affectValue(value, { target:m[0][x].target, properties:m[0][x].properties });
					}
					if (uid in __.nostopUidList) {
						__.nostopUidList=__.spliceAtKeys(__.nostopUidList, uid, 1);
					}
					if (typeof(m[1].oncomplete)=="function") {
						if (!__.isObject(m[1].oncompleteparams)) {
							m[1].oncomplete();
						} else {
							m[1].oncomplete.call(this, m[1].oncompleteparams);
						}
					}
					break;
				} else {
					t++;
				}
			}
		},
		affectValue:function(v, obj) {			
			if (typeof(v)==="string" && v.indexOf("NaN")==-1) {
				if (obj.properties.length===1 && "setAttribute" in obj.target && ["scrollTop","scrollLeft"].indexOf(obj.properties[0])===-1) {
					obj.target.setAttribute(obj.properties[0], v);
				} else {
					__.setPropertyValueDeep(v, obj.target, obj.properties);
				}
			} else if (typeof(v)==="number" && !isNaN(v)) {
				if (obj.properties.length===1 && "setAttribute" in obj.target && ["scrollTop","scrollLeft"].indexOf(obj.properties[0])===-1) {
					obj.target.setAttribute(obj.properties[0], v);
				} else {
					__.setPropertyValueDeep(v, obj.target, obj.properties);
				}
			}
		},
		checkAndMakeItMatch:function(object1, object2, element, setting, context) {
			// object1 from get style 
			// object2 from user definition
			function getJSONwithSpliceOnValueAndUnit(object) {
				var splicedObject=__.objectDuplicate(__.spliceAtKeys(object, ["value", "unit", "postAnimValue"]), true, true);
				var json=lib().json.stringify(splicedObject);
				return json;
			}
			function orderByPrefix(array) {
				var i, p, toBeSorted={ index:[], prefix:[] };
				for (i=0; i<array.length; i++) {
					if (typeof(array[i].prefix)==="string" && array[i].prefix.length>0) {
						toBeSorted.index.push(i);
						toBeSorted.prefix.push(array[i].prefix);
					}
				}
				if (toBeSorted.index.length>0) {
					__.quicksort(toBeSorted, ["prefix", "index"], "alphanumerical", "ascending");
					var a=[];
					for (i=0; i<toBeSorted.index.length; i++) {
						a.push(array[toBeSorted.index[i]]);
					}
					for (i=0; i<array.length; i++) {
						if (a.indexOf(array[i])===-1) {
							a.push(array[i]);
						}
					}
					return a;
				} else {
					return array;
				}
			}
			function findInitializationValue(object, element, setting, context, dest) {
				if (__.isArray(object)) {
					var a=__.arrayDuplicate(object);
					for (var i=0; i<a.length; i++) {
						a[i]=findInitializationValue(a[i], element, setting, context, dest);
					}
					return a;
				} else if (__.isObject(object) && "value" in object) {
					var o=__.objectDuplicate(object, true, true);
					o.value=findInitializationValue(o.value, element, setting, context, dest);
					return o;
				} else if (typeof(object)==="number") {
					if (dest===1 && context==="to") {
						object=0;
					}
					return object;
				} else if (typeof(object)==="string") {
					return object;
				}
			}
			if (__.isObject(object1) && __.isObject(object2)) {
				var jsonObject1=getJSONwithSpliceOnValueAndUnit(object1);
				var jsonObject2=getJSONwithSpliceOnValueAndUnit(object2);
				var i, j, pairs=[], iUsed=[], excedentI=[], excedentJ=[];
				if (jsonObject1===jsonObject2) {
					if (__.isArray(object1.value) && __.isArray(object2.value)) {
						if (setting==="transform") {
							object1.value=orderByPrefix(object1.value);
							object2.value=orderByPrefix(object2.value);
						}
						memObject1=__.objectDuplicate(object1, true, true);
						memObject2=__.objectDuplicate(object2, true, true);
						for (i=0; i<object1.value.length; i++) {
							jsonObject1=getJSONwithSpliceOnValueAndUnit(object1.value[i]);
							for (j=0; j<object2.value.length; j++) {
								jsonObject2=getJSONwithSpliceOnValueAndUnit(object2.value[j]);
								if (jsonObject1===jsonObject2) {
									pairs[i]=j;
									iUsed.push(i);
									if (i==j) {
										break;
									}
								}
							}
							if (iUsed.indexOf(i)===-1) {
								excedentI.push(i);
							}
						}
						for (j=0; j<object2.value.length; j++) {
							if (pairs.indexOf(j)===-1) {
								excedentJ.push(j);
							}
						}
						if (__.countProperties(pairs)>0) {
							var a=0, b=0, c=0, p, q;
							for (p in excedentI) {
								object2.value.splice(excedentI[p], 0, findInitializationValue(object1.value[excedentI[p]], element, setting, context, 2));
								for (q in excedentJ) {
									if (excedentJ[q]>=excedentI[p]) {
										excedentJ[q]++;
									}
								}
								for (q=pairs.length-1; q>=0; q--) {
									if (!isNaN(pairs[q]) && parseInt(q, 10)>=excedentI[p]) {
										pairs[q]++;
									}
								}
							}
							for (p in excedentJ) {
								object1.value.splice(excedentJ[p], 0, findInitializationValue(object2.value[excedentJ[p]], element, setting, context, 1));
								for (q=pairs.length-1; q>=0; q--) {
									if (!isNaN(pairs[q]) && parseInt(pairs[q], 10)>=excedentJ[p]) {
										pairs[q+1]=pairs[q];
										delete(pairs[q]);
									}
								}
							}
							for (p in pairs) {
								if (!__.isArray(object1.value[p].value) && !__.isArray(object2.value[pairs[p]].value)) {
									if (object1.value[p].type==="numericstring" && object2.value[pairs[p]].type==="numericstring" && ["zIndex","counterIncrement","columnCount","gridColumn","gridRow"].indexOf(setting)!==-1) {
										object1.value[p].treatment=object2.value[pairs[p]].treatment=function(v) { return Math.round(v); };
									} else if (object1.value[p].type==="numericstring" && object2.value[pairs[p]].type==="numericstring" && object2.value[pairs[p]].unit!=object1.value[p].unit) {
										object1.value[p].value=__.convertUnits(element, setting, object1.value[p].value, object1.value[p].unit, object2.value[pairs[p]].unit!==null?object2.value[pairs[p]].unit:object1.value[p].unit);
										object1.value[p].unit=object2.value[pairs[p]].unit=(object2.value[pairs[p]].unit!==null?object2.value[pairs[p]].unit:object1.value[p].unit);
									}
								} else {
									if (object1.value[p].value.length===object2.value[pairs[p]].value.length) {
										for (i=0; i<object1.value[p].value.length; i++) {
											var res=__.checkAndMakeItMatch(object1.value[p].value[i], object2.value[pairs[p]].value[i], element, setting, context);
											if (res) {
												object1.value[p].value[i]=res[0];
												object2.value[pairs[p]].value[i]=res[1];
											}
										}
									}
								}
							}
						} else {
							i=0;
							var copyObject1=__.objectDuplicate(object1, true, true);
							while (i<object2.value.length) {
								object1.value.splice(i, 0, findInitializationValue(object2.value[i], element, setting, context, 1));
								i++;
							}
							i=0;
							while (i<copyObject1.value.length) {
								object2.value.push(findInitializationValue(copyObject1.value[i], element, setting, context, 2));
								i++;
							}
						}
					} else if (!__.isArray(object1.value) && !__.isArray(object2.value)) {
						if (object1.type==="numericstring" && object2.type==="numericstring" && ["zIndex","counterIncrement","columnCount","gridColumn","gridRow"].indexOf(setting)!==-1) {
							object1.treatment=object2.treatment=function(v) { return Math.round(v); };
						} else if (object1.type==="numericstring" && object2.type==="numericstring" && object2.unit!=object1.unit) {
							object1.value=__.convertUnits(element, setting, object1.value, object1.unit, object2.unit!==null?object2.unit:object1.unit);
							object1.unit=object2.unit!==null?object2.unit:object1.unit;
						}
					}
					if (setting==="transform") {
						object1.value=orderByPrefix(object1.value);
						object2.value=orderByPrefix(object2.value);
					}
					return [object1, object2];
				} else if (jsonObject1!==jsonObject2) {
					return false;
				}
			}
		},
		from:function(values, parameters, elements, selector, nostop) {
			if (elements.length>0) {
				var i, j, k, l, p, q, r, s, t, u, props, res;
				var properties=__.getPropertiesContainingValues(values, null);
				i=0;
				while (i<__.tQ.length) {
					j=0;
					while (j<__.tQ[i][0].length) {
						for (p in properties) {
							props=__.implode(',', properties[p]);
							if (elements.indexOf(__.tQ[i][0][j].target)!==-1 && props===__.implode(',', __.tQ[i][0][j].properties) && !(__.tQ[i][2] in __.nostopUidList)) {
								__.tQ[i][0].splice(j--, 1);
								break;
							}
						}
						j++;
					}
					if (__.tQ[i][0].length===0) {
						__.tQ.splice(i--, 1);
					}
					i++;
				}
				parameters.duration=("duration" in parameters)?parameters.duration:500;
				parameters.easing=("easing" in parameters)?parameters.easing:false;
				parameters.oncomplete=("oncomplete" in parameters)?parameters.oncomplete:false;
				parameters.oncompleteparams=("oncompleteparams" in parameters)?parameters.oncompleteparams:null;
				parameters.startTime=new Date().getTime();
				var toAnimate=[];
				var start, end, startPrefixes, endPrefixes, currentPrefix, currentSuffix, notModified;
				for (var prop in values) {
					if (prop=="style") {
						for (var setting in values.style) {
							if (typeof(values.style[setting])!=="object") {
								t=[];
								for (j=0; j<elements.length; j++) {
									cs=__.getStyle(elements[j], setting);
									elements[j][setting+"_animated"]=true;
									r=__.getValueAndPrepareForAnimation(__.trim(values.style[setting].toString()), elements[j], setting);
									s=__.getValueAndPrepareForAnimation(cs, elements[j], setting);
									if (!(j in t)) {
										t[j]={ start:[], end:[] };
									}
									res=__.checkAndMakeItMatch(s, r, elements[j], setting, "from");
									if (res) {
										s=res[0];
										r=res[1];
										t[j].start=r;
										t[j].end=s;
										toAnimate.push({ 
											target:elements[j],
											properties:["style", setting],
											start:t[j].start,
											end:t[j].end
										});
									} else {
										__.error("lib is trying to animate between incompatible objects : "+lib().json.stringify(s)+ " and "+lib().json.stringify(r));
									}
								}
							} else {
								if (("value" in values.style[setting]) && ("treatment" in values.style[setting])) {
									start=__.getValueAndPrepareForAnimation(values.style[setting].value, elements[0], setting);
									for (i=0; i<elements.length; i++) {
										end=__.getValueAndPrepareForAnimation(__.getStyle(elements[i], setting), elements[i], setting);
										end.treament=values.style[setting].treatment;
										elements[i][setting+"_animated"]=true;
										toAnimate.push({ 
											target:elements[i], 
											properties:["style", setting], 
											start:start,
											end:end
										});
									}
								} else if (("start" in values.style[setting]) && ("b1" in values.style[setting])) {
									for (i=0; i<elements.length; i++) {
										var bezier=[];
										start=__.getValueAndPrepareForAnimation(values.style[setting].start, elements[i], setting);
										for (p in values.style[setting]) {
											if (p!="start") {
												j=__.getValueAndPrepareForAnimation(values.style[setting][p], elements[i], setting);
												bezier.push((j.unit!=start.unit)?__.convertUnits(elements[i], setting, j.value, j.unit, start.unit):j.value);
											}
										}
										end=__.getValueAndPrepareForAnimation(__.getStyle(elements[i], setting), elements[i], setting);
										toAnimate.push({ 
											target:elements[i],
											properties:["style", setting],
											start:start,
											end:end,
											bezier:bezier
										});
									}
								}
							}
						}
					} else {
						if (typeof(values[prop])=="object") {
							p=values;
							properties=__.getPropertiesContainingValues(p, null);
							var tmpStart=[],
								elementP=[];
							for (i=0; i<elements.length; i++) {
								elementP.push(elements[i]);
							}
							for (i=0; i<properties.length; i++) {
								p=values;
								for (j=0; j<properties[i].length; j++) {
									p=p[properties[i][j]];
									if (j==properties[i].length-2 && ("treatment" in p) && ("value" in p)) {
										break;
									}
								}
								tmpStart[i]={};
								if (typeof(p)=="string" || typeof(p)=="number" ) {
									start=__.getValueAndPrepareForAnimation(p);
									tmpStart[i].start=start;
									tmpStart[i].treatment=null;
									tmpStart[i].props=properties[i];
								} else if (typeof(p)=="object" && ("treatment" in p) && ("value" in p)) {
									start=__.getValueAndPrepareForAnimation(p.value);
									tmpStart[i].start=start;
									tmpStart[i].treatment=p.treatment;
									properties[i].splice(properties[i].length-1, 1);
									tmpStart[i].props=properties[i];
								}
								i++;
							}
							var pMem;
							for (q=0; q<tmpStart.length; q++) {
								for (k=0; k<elementP.length; k++) {
									p=elementP[k];
									for (j=0; j<tmpStart[q].props.length; j++) {
										if (j<tmpStart[q].props.length-1) {
											pMem=p;
										}
										p=p[tmpEnd[q].props[j]];
										if (j==tmpEnd[q].props.length-1) {
											var lastProp=tmpEnd[q].props[j];
											end=__.getValueAndPrepareForAnimation(p);
											if (typeof(end.value)!=="number") {
												end.value=0;
											}
											toAnimate.push({ 
												target:elementP[k],
												properties:tmpEnd[q].props,
												start:tmpStart[q].start,
												end:end
											});
										}
									}
								}
							}
						} else {
							start=__.getValueAndPrepareForAnimation(values[prop]);
							for (i=0; i<elements.length; i++) {
								if (__.svgFull.indexOf(elements[i].tagName.toLowerCase())!==-1) {
									end=__.getValueAndPrepareForAnimation(elements[i].getAttribute(prop));
								} else if (typeof(elements[i][prop])=="undefined" && __.svgFull.indexOf(elements[i].tagName.toLowerCase())===-1) {
									elements[i][prop]=0;
									end=__.getValueAndPrepareForAnimation(elements[i][prop]);
								} else {
									end=__.getValueAndPrepareForAnimation(elements[i][prop]);
								}
								toAnimate.push({
									target:elements[i],
									properties:[prop],
									start:start,
									end:end
								});
							}
						}
					}
				}
				var uid=__.guid();
				__.tQ.push([toAnimate, parameters, uid]);
				if (nostop) {
					__.nostopUidList[uid]=true;
				}
				if (!__.rAnimFrameID) {
					__.animLoop();
				}
				setTimeout(function() { __.timerComplete(uid); }, parameters.duration);
			} else {
				__.error("lib is trying to animate an object that seems not to exist : "+selector);
			}
		},
		to:function(values, parameters, elements, selector, nostop) {
			if (elements.length>0) {
				var i, j, k, l, p, q, r, s, t, u, props, res;
				var properties=__.getPropertiesContainingValues(values, null);
				i=0;
				while (i<__.tQ.length) {
					j=0;
					while (j<__.tQ[i][0].length) {
						for (p in properties) {
							props=__.implode(',', properties[p]);
							if (elements.indexOf(__.tQ[i][0][j].target)!==-1 && props===__.implode(',', __.tQ[i][0][j].properties) && !(__.tQ[i][2] in __.nostopUidList)) {
								__.tQ[i][0].splice(j--, 1);
								break;
							}
						}
						j++;
					}
					if (__.tQ[i][0].length===0) {
						__.tQ.splice(i--, 1);
					}
					i++;
				}
				parameters.duration=("duration" in parameters)?parameters.duration:500;
				parameters.easing=("easing" in parameters)?parameters.easing:false;
				parameters.oncomplete=("oncomplete" in parameters)?parameters.oncomplete:false;
				parameters.oncompleteparams=("oncompleteparams" in parameters)?parameters.oncompleteparams:null;
				parameters.startTime=new Date().getTime();
				var toAnimate=[];
				var start, end, startPrefixes, endPrefixes, currentPrefix, currentSuffix, notModified;
				for (var prop in values) {
					if (prop=="style") {
						for (var setting in values.style) {
							if (typeof(values.style[setting])!=="object") {
								t=[];
								for (j=0; j<elements.length; j++) {
									cs=__.getStyle(elements[j], setting);
									elements[j][setting+"_animated"]=true;
									r=__.getValueAndPrepareForAnimation(__.trim(values.style[setting].toString()), elements[j], setting);
									s=__.getValueAndPrepareForAnimation(__.trim(cs), elements[j], setting);
									if (!(j in t)) {
										t[j]={ start:[], end:[] };
									}
									res=__.checkAndMakeItMatch(s, r, elements[j], setting, "to");
									if (res) {
										s=res[0];
										r=res[1];
										t[j].start=s;
										t[j].end=r;
										toAnimate.push({ 
											target:elements[j],
											properties:["style", setting],
											start:t[j].start,
											end:t[j].end
										});
									} else {
										__.error("lib is trying to animate between incompatible objects : "+lib().json.stringify(s)+ " and "+lib().json.stringify(r));
									}
								}
							} else {
								if (("value" in values.style[setting]) && ("treatment" in values.style[setting])) {
									end=__.getValueAndPrepareForAnimation(__.trim(values.style[setting].value.toString()), elements[0], setting);
									end.treament=values.style[setting].treatment;
									for (i=0; i<elements.length; i++) {
										start=__.getValueAndPrepareForAnimation(__.getStyle(elements[i], setting), elements[i], setting);
										elements[i][setting+"_animated"]=true;
										toAnimate.push({ 
											target:elements[i], 
											properties:["style", setting], 
											start:start, 
											end:end
										});
									}
								} else if (("end" in values.style[setting]) && ("b1" in values.style[setting])) {
									for (i=0; i<elements.length; i++) {
										var bezier=[];
										end=__.getValueAndPrepareForAnimation(__.trim(values.style[setting].end.toString()), elements[i], setting);
										for (p in values.style[setting]) {
											if (p!="end") {
												j=__.getValueAndPrepareForAnimation(values.style[setting][p], elements[i], setting);
												bezier.push((j.unit!=end.unit)?__.convertUnits(elements[i], setting, j.value, j.unit, end.unit):j.value);
											}
										}
										start=__.getValueAndPrepareForAnimation(__.getStyle(elements[i], setting), elements[i], setting);
										toAnimate.push({ 
											target:elements[i],
											properties:["style", setting],
											start:start,
											end:end,
											bezier:bezier
										});
									}
								}
							}
						}
					} else {
						if (typeof(values[prop])=="object") {
							p=values;
							properties=__.getPropertiesContainingValues(p, null);
							var tmpEnd=[],
								elementP=[];
							for (i=0; i<elements.length; i++) {
								elementP.push(elements[i]);
							}
							for (i=0; i<properties.length; i++) {
								p=values;
								for (j=0; j<properties[i].length; j++) {
									p=p[properties[i][j]];
									if (j==properties[i].length-2 && ("treatment" in p) && ("value" in p)) {
										break;
									}
								}
								tmpEnd[i]={};
								if (typeof(p)=="string" || typeof(p)=="number" ) {
									end=__.getValueAndPrepareForAnimation(p);
									tmpEnd[i].end=end;
									tmpEnd[i].treatment=null;
									tmpEnd[i].props=properties[i];
								} else if (typeof(p)=="object" && ("treatment" in p) && ("value" in p)) {
									end=__.getValueAndPrepareForAnimation(p.value);
									tmpEnd[i].end=end;
									tmpEnd[i].treatment=p.treatment;
									properties[i].splice(properties[i].length-1, 1);
									tmpEnd[i].props=properties[i];
								}
								i++;
							}
							var pMem;
							for (q=0; q<tmpEnd.length; q++) {
								for (k=0; k<elementP.length; k++) {
									p=elementP[k];
									for (j=0; j<tmpEnd[q].props.length; j++) {
										if (j<tmpEnd[q].props.length-1) {
											pMem=p;
										}
										p=p[tmpEnd[q].props[j]];
										if (j==tmpEnd[q].props.length-1) {
											var lastProp=tmpEnd[q].props[j];
											start=__.getValueAndPrepareForAnimation(p);
											if (typeof(start.value)!="number") {
												start.value=0;
											}
											toAnimate.push({ 
												target:elementP[k],
												properties:tmpEnd[q].props,
												start:start,
												end:tmpEnd[q].end
											});
										}
									}
								}
							}
						} else {
							end=__.getValueAndPrepareForAnimation(__.trim(values[prop].toString()));
							for (i=0; i<elements.length; i++) {
								if ("tagName" in elements[i] && __.svgFull.indexOf(elements[i].tagName.toLowerCase())!==-1) {
									start=__.getValueAndPrepareForAnimation(elements[i].getAttribute([prop]));
								} else if ("tagName" in elements[i] && typeof(elements[i][prop])=="undefined" && __.svgFull.indexOf(elements[i].tagName.toLowerCase())===-1) {
									elements[i][prop]=0;
									start=__.getValueAndPrepareForAnimation(elements[i][prop]);
								} else {
									start=__.getValueAndPrepareForAnimation(elements[i][prop]);
								}
								toAnimate.push({
									target:elements[i],
									properties:[prop],
									start:start,
									end:end
								});
							}
						}
					}
				}
				var uid=__.guid();
				__.tQ.push([toAnimate, parameters, uid]);
				if (nostop) {
					__.nostopUidList[uid]=true;
				}
				if (!__.rAnimFrameID) {
					__.animLoop();
				}
				setTimeout(function() { __.timerComplete(uid); }, parameters.duration);
			} else {
				__.error("lib is trying to animate an object that seems not to exist : "+selector);
			}
		},
		stop:function(elements) {
			i=0;
			while (i<__.tQ.length) {
				j=0;
				while (j<__.tQ[i][0].length) {
					if (elements.indexOf(__.tQ[i][0][j].target)!==-1) {
						__.tQ[i][0].splice(j--, 1);
					}
					j++;
				}
				if (__.tQ[i][0].length===0) {
					__.tQ.splice(i--, 1);
				}
				i++;
			}
		},
		addClass:function(elements, className) {
			var actual;
			for (var i=0; i<elements.length; i++) {
				actual=(elements[i].getAttribute("class")!==null && elements[i].getAttribute("class")!==""?elements[i].getAttribute("class")+" ":"");
				if (className.length>0 && !(RegExp("\\b"+className+"\\b", '').test(actual))) {
					elements[i].setAttribute("class", actual.replace(/ +$/, " ")+className);
				}
			}
		},
		removeClass:function(elements, className) {
			var actual;
			for (var i=0; i<elements.length; i++) {
				actual=elements[i].getAttribute("class");
				if (actual!==null && actual!=="" && RegExp("\\b"+className+"\\b", "").test(actual)) {
					elements[i].setAttribute("class", actual.replace(RegExp("\\b"+className+"\\b", ""), "").replace(/\s{2,}/g, " ").replace(/^\s+/g, "").replace(/\s+$/g, ""));
				}
			}
		},
		hasClass:function(elements, className) {
			var actual, ret=[];
			for (var i=0; i<elements.length; i++) {
				actual=(elements[i].getAttribute("class")!==null && elements[i].getAttribute("class")!==""?elements[i].getAttribute("class"):"");
				if (className.length>0 && (RegExp("\\b"+className+"\\b", '').test(actual))) {
					ret.push(true);
				} else {
					ret.push(false);
				}
			}
			return ret;
		},
		cssIze:function(value) {
			return value.replace(/\-[a-z]/g, function(c) { return c.substring(1,2).toUpperCase(); });
		},
		alreadyStyledOnNonStandardValue:[],
		css:function(values, destUnit, computedOnly, elements, _lib, getOffsetsInsteadOf0) {
			var i, u, ret, p, style, val, baseUnit, integerReg=/\-?[0-9]+/, floatReg=/\-?[0-9]+\.[0-9]+(?:[e|E][+|-]?[0-9]+)?/, verySmallNumberScientific=/\-?[0-9]+\.[0-9]+(?:e-[0-9]+)/i;
			if (typeof(values)=="object") {
				for (var prop in values) {
					for (i=0; i<elements.length; i++) {
						p=prop;
						if (prop!==p) {
							elements[i][p+"_animated"]=true;
						}
						if (verySmallNumberScientific.test(values[prop])) {
							values[prop]="0"+(u=__.getUnit(values[prop])!==null?u:"");
						}
						elements[i].style[p]=values[prop];
					}
				}
				return lib(elements);
			} else if (typeof(values)=="string") {
				if (typeof(destUnit)!="string" || destUnit==="") {
					ret=[];
					for (i=0; i<elements.length; i++) {
						ret.push(__.getStyle(elements[i], __.cssIze(values), computedOnly, getOffsetsInsteadOf0));
					}
					return ret;
				} else if (typeof(destUnit)=="string" && destUnit!=="") {
					ret=[];
					for (i=0; i<elements.length; i++) {
						style=__.getStyle(elements[i], __.cssIze(values), false, getOffsetsInsteadOf0);
						if (floatReg.test(style) || integerReg.test(style)) {
							val=__.getValue(style);
							baseUnit=__.getUnit(style);
							ret.push(__.convertUnits(elements[i], values, val, baseUnit, destUnit)+destUnit);
						} else {
							ret.push(style);
						}
					}
					return ret;
				}
			}
		},
		inverseSettingVariants:function(setting) {
			if (setting.substring(0,6)==="Webkit") {
				setting=setting.substring(6,7).toLowerCase()+setting.substring(7);
			} else if (setting.substring(0,3)==="Moz") {
				setting=setting.substring(3,4).toLowerCase()+setting.substring(4);
			} else if (setting.substring(0,2)==="ms") {
				setting=setting.substring(2,3).toLowerCase()+setting.substring(3);
			} else if (setting.substring(0,1)==="O") {
				setting=setting.substring(1,2).toLowerCase()+setting.substring(2);
			}
			return setting;
		},
		getValueAndPrepareForAnimation:function(v, element, setting, recursive) {
			var s=[], i, j, k, l, op, ex, o, res, obj, tmpO=[];
			if (v===undefined) {
				return false;
			} else if (typeof(v)!=="string") {
				v=v.toString();
			}
			v=v.replace(/\s+/g, " ").replace(/, /g, ",").replace(/;$/, "");
			if (v.length>0) {
				k=0;
				l=0;
				op=0;
				s[l]="";
				while (k<v.length) {
					if (v[k]==="(") {
						op++;
					} else if (v[k]===")") {
						op--;
					} else if ((v[k]==="," || v[k]===" ") && !/^to$/.test(s[l]) && op===0) {
						l++;
						s[l]="";
					}
					s[l]+=v[k];
					k++;
				}
			} else if (typeof(v)=="string" && v.length===0) {
				var o={ value:[{ value:null, unit:null, prefix:false, suffix:false, separator:"", treatment:false, animatable:false, type:"null" }], unit:null, prefix:"", suffix:"", separator:" ", treatment:null, animatable:true, type:"object" };
				return o;
			} else if (typeof(v)=="number") {
				s[0]=cs.toString();
			}
			for (i=0; i<s.length; i++) {
				s[i]=__.trim(s[i].replace(/^,/, ""));
				if (__.regs.cssUrl.test(s[i])) {
					obj=__.regs.cssUrl.exec(s[i]);
					tmpO.push({ value:obj[2], unit:null, prefix:obj[1], suffix:obj[3], separator:"", treatment:false, animatable:false, type:"alphanumeric" });
				} else if (__.regs.cssCalc.test(s[i])) {
					obj=__.regs.cssCalc.exec(s[i]);
					res=__.computeCalc(obj[2], obj[3], element, setting);
					tmpO.push({ value:res.value, unit:res.unit, prefix:"", suffix:"", separator:"", treatment:false, postAnimValue:s[i], animatable:true, type:"numericstring" });
				} else if (__.regs.cssClamp.test(s[i])) {
					obj=__.regs.cssClamp.exec(s[i]);
					res=__.computeClamp(obj[2], "", element, setting);
					tmpO.push({ value:res.value, unit:res.unit, prefix:"", suffix:"", separator:"", treatment:false, postAnimValue:s[i], animatable:true, type:"numericstring" });
				} else if (__.regs.cssColorHex6.test(s[i])) {
					obj=__.regs.cssColorHex6.exec(s[i]);
					tmpO.push({ value: { r:__.hexToDec(obj[1]), g:__.hexToDec(obj[2]), b:__.hexToDec(obj[3]), a:1 }, unit:null, prefix:"rgba(", suffix:")", separator:",", treatment:function(val) { return Math.round(val); }, animatable:true, type:"color" });
				} else if (__.regs.cssColorHex3.test(s[i])) {
					obj=__.regs.cssColorHex3.exec(s[i]);
					tmpO.push({ value: { r:__.hexToDec(obj[1]+obj[1]), g:__.hexToDec(obj[2]+obj[2]), b:__.hexToDec(obj[3]+obj[3]), a:1 }, unit:null, prefix:"rgba(", suffix:")", separator:",", treatment:function(val) { return Math.round(val); }, animatable:true, type:"color" });
				} else if (__.regs.cssColorRGBa.test(s[i])) {
					obj=__.regs.cssColorRGBa.exec(s[i]);
					tmpO.push({ value: { r:parseInt(obj[1], 10), g:parseInt(obj[2], 10), b:parseInt(obj[3], 10), a:parseFloat(obj[4]) }, unit:null, prefix:"rgba(", suffix:")", separator:",", treatment:function(val) { return Math.round(val); }, animatable:true, type:"color" });
				} else if (__.regs.cssColorRGB.test(s[i])) {
					obj=__.regs.cssColorRGB.exec(s[i]);
					tmpO.push({ value: { r:parseInt(obj[1], 10), g:parseInt(obj[2], 10), b:parseInt(obj[3], 10), a:1 }, unit:null, prefix:"rgba(", suffix:")", separator:",", treatment:function(val) { return Math.round(val); }, animatable:true, type:"color" });
				} else if (__.regs.cssColorHSLa.test(s[i])) {
					obj=__.regs.cssColorHSLa.exec(s[i]);
					var rgb=__.HSLtoRGB({ h:parseInt(obj[1], 10), s:parseInt(obj[2], 10), l:parseInt(obj[3], 10) });
					tmpO.push({ value: { r:rgb.r, g:rgb.g, b:rgb.b, a:parseFloat(obj[4]) }, unit:null, prefix:"rgba(", suffix:")", separator:",", treatment:function(val) { return Math.round(val); }, animatable:true, type:"color" });
				} else if (__.regs.cssColorHSL.test(s[i])) {
					obj=__.regs.cssColorHSL.exec(s[i]);
					var rgb=__.HSLtoRGB({ h:parseInt(obj[1], 10), s:parseInt(obj[2], 10), l:parseInt(obj[3], 10) });
					tmpO.push({ value: { r:rgb.r, g:rgb.g, b:rgb.b, a:1 }, unit:null, prefix:"rgba(", suffix:")", separator:",", treatment:function(val) { return Math.round(val); }, animatable:true, type:"color" });
				} else if (s[i] in __.colorStrings) {
					tmpO.push({ value: { r:parseInt(__.colorStrings[s[i]][0], 10), g:parseInt(__.colorStrings[s[i]][1], 10), b:parseInt(__.colorStrings[s[i]][2], 10), a:(3 in __.colorStrings[s[i]])?parseFloat(__.colorStrings[s[i]][3]):1 }, unit:null, prefix:"rgba(", suffix:")", separator:",", treatment:function(val) { return Math.round(val); }, animatable:true, type:"color" });
				} else if (__.regs.cssFunctionalNotation.test(s[i])) {
					ex=__.regs.cssFunctionalNotation.exec(s[i]);
					var ct=ex[2];
					var separator=/[\s|,]+/.test(ct)?/[\s|,]+/.exec(ct)[0]:"";
					tmpO.push({ value:__.getValueAndPrepareForAnimation(ct, element, setting, true), unit:null, prefix:ex[1], suffix:ex[3], separator:separator, treatment:null, animatable:true, type:"object" });
				} else if (__.regs.cssDir.test(s[i])) {
					var dirs={ left:270, top:180, right:90, bottom:0 };
					var s=__.trim(s[0].replace(/to\s+/i, ""));
					var angle=dirs[s];
					tmpO.push({ value:angle, unit:"deg", prefix:"", suffix:"", separator:"", treatment:false, animatable:true, type:"numericstring" });
				} else if (__.regs.cssAngle.test(s[i])) {
					var angle;
					if (/\s*[0-9]+\.?[0-9]*\s*turn/i.test(s[i])) {
						angle=(parseFloat(s[i].replace(/\s*turn/i, ""))*360);
					} else if (/,?\s*[0-9]+(?:\.[0-9]+)?\s*deg/i.test(s[i])) {
						angle=parseFloat(s[i].replace(/\s*deg/i, ""));
					} else if (/,?\s*[0-9]+(?:\.[0-9]+)?\s*rad/i.test(s[i])) {
						angle=(parseFloat(s[i].replace(/\s*rad/i, ""))*180/Math.PI);
					}
					tmpO.push({ value:angle, unit:"deg", prefix:"", suffix:"", separator:"", treatment:false, animatable:true, type:"numericstring" });
				} else if (__.regs.jsNumber.test(s[i])) {
					obj=__.regs.jsNumber.exec(s[i]);
					tmpO.push({ value:parseFloat(obj[2]), unit:(typeof(obj[3])!=="undefined" && __.regs.cssUnits.test(obj[3]))?__.regs.cssUnits.exec(obj[3])[1]:null, prefix:(typeof(obj[3])!=="undefined" && obj[1]!==","?obj[1]:''), suffix:(typeof(obj[3])!=="undefined" && __.regs.cssUnits.test(obj[3]))?__.regs.cssUnits.exec(obj[3])[2]:(typeof(obj[3])!=="undefined"?obj[3]:null), separator:"", treatment:false, animatable:true, type:"numericstring" });
				} else if (__.regs.cssWord.test(s[i]) && __.trim(s[i])==="auto" && typeof(setting)==="string" && setting==="width" && typeof(element)!=="undefined") {
					// experimental
					var elementBoundingRect=element.getBoundingClientRect();
					var childBoundingRect;
					var w=0;
					for (i=0; i<element.childNodes.length; i++) {
						if (typeof(element.childNodes[i].getBoundingClientRect)==="function") {
							childBoundingRect=element.childNodes[i].getBoundingClientRect();
							if (childBoundingRect.right-elementBoundingRect.left>w) {
								w=childBoundingRect.right-elementBoundingRect.left;
							}
						}
					}
					tmpO.push({ value:w, unit:"px", prefix:"", suffix:"", separator:"", treatment:false, postAnimValue:"auto",  animatable:true, type:"numericstring" });
				} else if (__.regs.cssWord.test(s[i]) && __.trim(s[i])==="auto" && typeof(setting)==="string" && setting==="height" && typeof(element)!=="undefined") {
					// experimental
					var elementBoundingRect=element.getBoundingClientRect();
					var childBoundingRect;
					var h=0;
					for (i=0; i<element.childNodes.length; i++) {
						if (typeof(element.childNodes[i].getBoundingClientRect)==="function") {
							childBoundingRect=element.childNodes[i].getBoundingClientRect();
							if (childBoundingRect.bottom-elementBoundingRect.top>h) {
								h=childBoundingRect.bottom-elementBoundingRect.top;
							}
						}
					}
					tmpO.push({ value:h, unit:"px", prefix:"", suffix:"", separator:"", treatment:false, postAnimValue:"auto",  animatable:true, type:"numericstring" });
				} else if (__.regs.cssWord.test(s[i])) {
					obj=__.regs.cssWord.exec(s[i]);
					tmpO.push({ value:obj[1], unit:null, prefix:false, suffix:false, separator:"", treatment:false, animatable:false, type:"alphanumeric" });
				} else if (__.regs.cssSlash.test(s[i])) {
					obj=__.regs.cssSlash.exec(s[i]);
					tmpO.push({ value:obj[0], unit:null, prefix:false, suffix:false, separator:"", treatment:false, animatable:false, type:"alphanumeric" });
				}
			}
			if (typeof(recursive)=="undefined") {
				o={ value:tmpO, unit:null, prefix:"", suffix:"", separator:" ", treatment:null, animatable:true, type:"object" };
			} else if (tmpO.length>1) {
				o=tmpO;
			} else {
				o=tmpO[0];
			}
			return o;
		},
		mathFunctionalNotations:{
			calc:function(v, optionalUnit, element, setting) { return __.computeCalc(v, optionalUnit, element, setting); },
			clamp:function(v, optionalUnit, element, setting) { return __.computeClamp(v, optionalUnit, element, setting); },
			max:function(v, optionalUnit, element, setting) { return __.computeMax(v, optionalUnit, element, setting); },
			min:function(v, optionalUnit, element, setting) { return __.computeMin(v, optionalUnit, element, setting); }/*,
			abs:function(v) { return __.computeAbs(v, "", element, setting); },
			cos:function(v) { return __.computeCos(v, "", element, setting); },
			sin:function(v) { return __.computeSin(v, "", element, setting); },
			tan:function(v) { return __.computeTan(v, "", element, setting); },
			acos:function(v) { return __.computeAcos(v, "", element, setting); },
			asin:function(v) { return __.computeAsin(v, "", element, setting); },
			atan:function(v) { return __.computeAtan(v, "", element, setting); },
			atan2:function(v) { return __.computeAtan2(v, "", element, setting); },
			pow:function(v) { return __.computePow(v, "", element, setting); },
			exp:function(v) { return __.computeExp(v, "", element, setting); },
			sqrt:function(v) { return __.computeSqrt(v, "", element, setting); },
			log:function(v) { return __.computeLog(v, "", element, setting); },
			mod:function(v) { return __.computeMod(v, "", element, setting); },
			rem:function(v) { return __.computeRem(v, "", element, setting); },
			round:function(v) { return __.computeRound(v, "", element, setting); },
			sign:function(v) { return __.computeSign(v, "", element, setting); },
			hypot:function(v) { return __.computeHypot(v, "", element, setting); }*/
		},
		computeCalc:function(inner, optionalUnit, element, setting) {
			if (/\s*\(([^\)]+)\)\s*/.test(inner)) {
				while ((ex=/\s*\(([^\)]+)\)\s*/.exec(inner))!==null) {
					inner=inner.substring(0, ex.index)+" "+__.computeCalc(ex[1], "", element, setting)+" "+inner.substring(ex.index+ex[1].length);
				}
			}
			if (/\s*[\+\-\*\/]\s*/.test(inner)) {
				var ops=[], i, vals=inner.split(/\s*[\+\-\*\/]\s*/), u;
				while ((ex=/\s*[\+\-\*\/]\s*/.exec(inner))!==null) {
					ops.push(__.trim(ex[0]));
					inner=inner.substring(ex.index+ex[0].length);
				}
				if (vals.length>1) {
					if (typeof(optionalUnit)==="string" && optionalUnit.length>0 && __.regs.cssUnits.test(__.trim(optionalUnit))) {
						u=__.trim(optionalUnit);
					} else {
						i=0;
						while (i<vals.length) {
							if (vals[i].length>0 && __.regs.cssUnits.test(__.getUnit(vals[i]))) {
								u=__.getUnit(vals[i]);
								break;
							}
							i++;
						}
						if (typeof(u)==="undefined") {
							u="px";
						}
						i=1;
						obj=__.regs.jsNumber.exec(vals[0]);
						var val=parseFloat(__.convertUnits(element, setting, obj[2], __.getUnit(vals[0]), u)), v;
						while (i<vals.length) {
							if (__.regs.cssFunctionalNotation.test(vals[i])) {
								obj=__.regs.cssFunctionalNotation.exec(vals[i]);
								if (obj[1].replace(/\(/, "") in __.mathFunctionalNotations) {
									v=__.convertUnits(element, setting, __.mathFunctionalNotations[obj[1].replace(/\(/, "")](obj[2], "", element, setting), __.getUnit(vals[i]), u);
									switch (__.trim(ops[i-1])) {
										case "+":
											val+=parseFloat(v);
										break;
										case "-":
											val-=parseFloat(v);
										break;
										case "*":
											val*=parseFloat(v);
										break;
										case "/":
											val/=parseFloat(v);
										break;
										default:
										break;
									}
								} else {
									__.error("wrong functional() notation");
								}
							} else if (__.regs.cssValueAndUnits.test(vals[i]) || __.regs.jsNumber.test(vals[i])) {
								obj=__.regs.jsNumber.exec(vals[i]);
								switch (__.trim(ops[i-1])) {
									case "+":
										v=__.convertUnits(element, setting, obj[2], __.getUnit(vals[i]), u);
										val+=parseFloat(v);
									break;
									case "-":
										v=__.convertUnits(element, setting, obj[2], __.getUnit(vals[i]), u);
										val-=parseFloat(v);
									break;
									case "*":
										val*=parseFloat(obj[2]);
									break;
									case "/":
										val/=parseFloat(obj[2]);
									break;
									default:
									break;
								}
							}
							i++;
						}
					}
					o={ value:val, unit:u, prefix:"", suffix:"", separator:"", treatment:false, animatable:true, type:"numericstring" };
					return o;
				}
			} else {
				__.error("wrong calc() syntax");
			}
		},
		computeClamp:function(inner, optionalUnit, element, setting) {
			if (/[\, ]+/.test(inner)) {
				var vals=inner.split(/[\, ]+/);
				if (values.length===3) {
					var v0, v1, v2, obj;
					if (__.regs.cssFunctionalNotation.test(vals[0])) {
						obj=__.regs.cssFunctionalNotation.exec(vals[0]);
						if (obj[1].replace(/\(/, "") in __.mathFunctionalNotations) {
							v0WithUnit=__.mathFunctionalNotations[obj[1].replace(/\(/, "")](obj[2], "", element, setting);
							v0=__.getValue(v0WithUnit);
						}
					} else if (__.regs.cssValueAndUnits.test(vals[0]) || __.regs.jsNumber.test(vals[0])) {
						v0WithUnit=__.convertUnits(element, setting, __.getValue(vals[0]), __.getUnit(vals[0]), "px");
						v0=__.getValue(v0WithUnit);
					}
					if (__.regs.cssFunctionalNotation.test(vals[1])) {
						obj=__.regs.cssFunctionalNotation.exec(vals[1]);
						if (obj[1].replace(/\(/, "") in __.mathFunctionalNotations) {
							v1WithUnit=__.mathFunctionalNotations[obj[1].replace(/\(/, "")](obj[2], "", element, setting);
							v1=__.getValue(v1WithUnit);
						}
					} else if (__.regs.cssValueAndUnits.test(vals[1]) || __.regs.jsNumber.test(vals[1])) {
						v1WithUnit=__.convertUnits(element, setting, __.getValue(vals[1]), __.getUnit(vals[1]), "px");
						v1=__.getValue(v1WithUnit);
					}
					if (__.regs.cssFunctionalNotation.test(vals[2])) {
						obj=__.regs.cssFunctionalNotation.exec(vals[2]);
						if (obj[1].replace(/\(/, "") in __.mathFunctionalNotations) {
							v2WithUnit=__.mathFunctionalNotations[obj[1].replace(/\(/, "")](obj[2], "", element, setting);
							v2=__.getValue(v2WithUnit);
						}
					} else if (__.regs.cssValueAndUnits.test(vals[2]) || __.regs.jsNumber.test(vals[2])) {
						v2WithUnit=__.convertUnits(element, setting, __.getValue(vals[2]), __.getUnit(vals[2]), "px");
						v2=__.getValue(v2WithUnit);
					}
					if (__.areDefined(v0, v1, v2)) {
						var clamp=vals[[v0, v1, v2].indexOf(Math.max(v0, Math.min(v1, v2)))];
						if (__.regs.cssFunctionalNotation.test(clamp)) {
							clamp=[v0WithUnit, v1WithUnit, v2WithUnit][[v0, v1, v2].indexOf(Math.max(v0, Math.min(v1, v2)))];
						}
						o={ value:clamp, unit:__.getUnit(clamp), prefix:"", suffix:"", separator:"", treatment:false, animatable:true, type:"numericstring" };
						return o;
					} else {
						__.error("wrong clamp() calculation");
						return false;
					}
				} else {
					__.error("wrong clamp() number of arguments");
					return false;
				}
			} else {
				__.error("wrong clamp() syntax");
				return false;
			}
		},
		computeMax:function(inner, optionalUnit, element, setting) {
			if (/[\, ]+/.test(inner)) {
				var vals=inner.split(/[\, ]+/), i=0, conv, max=-Math.pow(2,32), maxWithUnit, maxIndex=-1;
				while (i<vals.length) {
					conv=false;
					if (__.regs.cssFunctionalNotation.test(vals[i])) {
						obj=__.regs.cssFunctionalNotation.exec(vals[i]);
						if (obj[1].replace(/\(/, "") in __.mathFunctionalNotations) {
							convWithUnit=__.mathFunctionalNotations[obj[1].replace(/\(/, "")](obj[2], "", element, setting);
							conv=__.getValue(convWithUnit);
						}
					} else if (__.regs.cssValueAndUnits.test(vals[i]) || __.regs.jsNumber.test(vals[i])) {
						convWithUnit=__.convertUnits(element, setting, __.getValue(vals[i]), __.getUnit(vals[i]), "px");
						conv=__.getValue(convWithUnit);
					}
					if (conv && conv>max) {
						max=conv;
						maxWithUnit=convWithUnit;
						maxIndex=i;
					}
					i++;
				}
				if (max!==-Math.pow(2,32)) {
					var v=__.regs.cssFunctionalNotation.test(vals[maxIndex])?maxWithUnit:vals[maxIndex];
					o={ value:v, unit:__.getUnit(v), prefix:"", suffix:"", separator:"", treatment:false, animatable:true, type:"numericstring" };
					return o;
				} else {
					__.error("wrong max() calculation");
					return false;
				}
			} else {
				__.error("wrong max() syntax");
				return false;
			}
		},
		computeMin:function(inner, optionalUnit, element, setting) {
			if (/[\, ]+/.test(inner)) {
				var vals=inner.split(/[\, ]+/), i=0, conv, min=Math.pow(2,32), minWithUnit, minIndex=-1;
				while (i<vals.length) {
					conv=false;
					if (__.regs.cssFunctionalNotation.test(vals[i])) {
						obj=__.regs.cssFunctionalNotation.exec(vals[i]);
						if (obj[1].replace(/\(/, "") in __.mathFunctionalNotations) {
							convWithUnit=__.mathFunctionalNotations[obj[1].replace(/\(/, "")](obj[2], "", element, setting);
							conv=__.getValue(convWithUnit);
						}
					} else if (__.regs.cssValueAndUnits.test(vals[i]) || __.regs.jsNumber.test(vals[i])) {
						convWithUnit=__.convertUnits(element, setting, __.getValue(vals[i]), __.getUnit(vals[i]), "px");
						conv=__.getValue(convWithUnit);
					}
					if (conv && conv<min) {
						min=conv;
						minWithUnit=convWithUnit;
						minIndex=i;
					}
					i++;
				}
				if (min!==Math.pow(2,32)) {
					var v=__.regs.cssFunctionalNotation.test(vals[minIndex])?minWithUnit:vals[minIndex];
					o={ value:v, unit:__.getUnit(v), prefix:"", suffix:"", separator:"", treatment:false, animatable:true, type:"numericstring" };
					return o;
				} else {
					__.error("wrong min() calculation");
					return false;
				}
			} else {
				__.error("wrong min() syntax");
				return false;
			}
		},
		computeAbs:function(inner, optionalUnit, element, setting) {
			var val=false, valWithUnit;
			if (__.regs.cssFunctionalNotation.test(inner)) {
				obj=__.regs.cssFunctionalNotation.exec(inner);
				if (obj[1].replace(/\(/, "") in __.mathFunctionalNotations) {
					valWithUnit=__.mathFunctionalNotations[obj[1].replace(/\(/, "")](obj[2], "", element, setting);
					val=__.getValue(valWithUnit);
				}
			} else if (__.regs.cssValueAndUnits.test(inner) || __.regs.jsNumber.test(inner)) {
				valWithUnit=inner;
				val=__.getValue(valWithUnit);
			}
			if (val) {
				var v=Math.abs(val).toString()+__.getUnit(valWithUnit);
				o={ value:v, unit:__.getUnit(v), prefix:"", suffix:"", separator:"", treatment:false, animatable:true, type:"numericstring" };
				return o;
			} else {
				__.error("wrong abs() syntax");
				return false;
			}
		},
		/*computeCos:function(inner, optionalUnit, element, setting) {
		
		},
		computeSin:function(inner, optionalUnit, element, setting) {
			
		},
		computeTan:function(inner, optionalUnit, element, setting) {
			
		},
		computeAcos:function(inner, optionalUnit, element, setting) {
			var range=[0, Math.PI];
		},
		computeAsin:function(inner, optionalUnit, element, setting) {
			var range=[-Math.PI/2, Math.PI/2];
		},
		computeAtan:function(inner, optionalUnit, element, setting) {
			var range=[-Math.PI/2, Math.PI/2];
		},
		computeAtan2:function(inner, optionalUnit, element, setting) {
			
		},
		computePow:function(inner, optionalUnit, element, setting) {
			
		},
		computeExp:function(inner, optionalUnit, element, setting) {
			
		},
		computeSqrt:function(inner, optionalUnit, element, setting) {
			
		},
		computeLog:function(inner, optionalUnit, element, setting) {
			
		},
		computeMod:function(inner, optionalUnit, element, setting) {
			
		},
		computeRem:function(inner, optionalUnit, element, setting) {
			
		},
		computeRound:function(inner, optionalUnit, element, setting) {
			
		},
		computeSign:function(inner, optionalUnit, element, setting) {
			
		},
		computeHypot:function(inner, optionalUnit, element, setting) {
			
		},*/
		getOriginalStyle:function(element, setting) {
			function getValueAndScore(rule, setting) {
				var selectors, lastSelector, split, l, m;
				split=rule.selectorText.split(/\s*,\s*/);
				for (l in split) {
					if (setting in rule.style && rule.style[setting].length>0 && lib(split[l]).targets.indexOf(element)!==-1) {
						selectors=split[l].split(/\s*[\s>+]\s*/);
						score=0;
						for (m=selectors.length-1; m>=0; m--) {
							sel=/[^\s]+$/.exec(selectors[m].replace(/:[a-z-]\((.*)\)$/gi, ""))[0];
							if (/#/.test(sel)) {
								score+=100;
							}
							if (/\./.test(sel)) {
								score+=10;
							}
							if (!/[#\.]/.test(sel)) {
								score+=1;
							}
						}
						value=rule.style[setting];
						return { value:value, score:score };
					}
				}
				return { value:null, score:0 };
			}
			var i, j, k, mem, ret;
			mem=0;
			for (i=0; i<document.styleSheets.length; i++) {
				rules=document.styleSheets[i].cssRules;
				for (j=0; j<rules.length; j++) {
					if ("conditionText" in rules[j]) {
						var minWidth, maxWidth;
						ex1=/\(min-width:([^\)]+)\)/i.exec(rules[j].conditionText);
						if (!__.isArray(ex1) || !("length" in ex1 && ex1.length>1)) {
							minWidth={ value:0, unit:"px" };
						} else {
							minWidth={ value:__.getValue(__.trim(ex1[1])), unit:__.getUnit(ex1[1]) };
						}
						ex2=/\(max-width:([^\)]+)\)/i.exec(rules[j].conditionText);
						if (!__.isArray(ex2) || !("length" in ex2 && ex2.length>1)) {
							maxWidth={ value:Math.pow(2, 32), unit:"px" };
						} else {
							maxWidth={ value:__.getValue(__.trim(ex2[1])), unit:__.getUnit(ex2[1]) };
						}
						if (parseFloat(lib("html").css("width", minWidth.unit)[0])>=minWidth.value && parseFloat(lib("html").css("width", maxWidth.unit)[0])<=maxWidth.value) {
							for (k=0; k<rules[j].cssRules.length; k++) {
								if (setting in rules[j].cssRules[k].style && rules[j].cssRules[k].style[setting].length>0 && lib(rules[j].cssRules[k].selectorText).targets.indexOf(element)!==-1) {
									ret=getValueAndScore(rules[j].cssRules[k], setting);
									if (ret.score>mem) {
										mem=ret.score;
										value=ret.value;
									}
								}
							}
						} else {
							continue;
						}
					} else {
						if (setting in rules[j].style && rules[j].style[setting].length>0 && "selectorText" in rules[j] && lib(rules[j].selectorText).targets.indexOf(element)!==-1) {
							ret=getValueAndScore(rules[j], setting);
							if (ret.score>mem) {
								mem=ret.score;
								value=ret.value;
							}
						}
					}
				}
			}
			return value;
		},
		getStyle:function(element, setting, computedOnly, getOffsetsInsteadOf0, preserveAuto) {
			if (typeof(getOffsetsInsteadOf0)==="undefined") {
				getOffsetsInsteadOf0=true;
			}
			var normalizedSetting=__.inverseSettingVariants(setting);
			if (!(setting!==normalizedSetting && (setting+"_animated" in element))) {
				setting=normalizedSetting;
			}
			var curCss;
			if ((typeof(computedOnly)!=="undefined"?!computedOnly:true) && typeof(element)!=="undefined" && "style" in element && element.style[setting]!=="") {
				curCss=element.style[setting];
			} else if (typeof(element)!=="undefined" && __.d.defaultView && __.d.defaultView.getComputedStyle) {
				var defaultView, computedStyle;
				if ((defaultView=element.ownerDocument.defaultView) && (computedStyle=defaultView.getComputedStyle(element, null))) {
					setting=setting.replace(/[A-Z]/g, function(c) {
				   		return "-"+c.toLowerCase();
					});
					curCss=computedStyle.getPropertyValue(setting);
				}
				if ((typeof(computedOnly)!=="undefined"?!computedOnly:true) && setting==="transform" && /matrix(?:3d)?\(/.test(curCss)) {
					curCss=__.getOriginalStyle(element, setting);
				}
			} else if (typeof(element)!=="undefined" && __.d.documentElement.currentStyle) {
				if (element.currentStyle) {
					setting=setting.replace(/[A-Z]/g, function(c) {
				   		return "-"+c.toLowerCase();
					});
					curCss=element.currentStyle[setting];
				}
				curCss=(curCss==="" && ["width", "height"].indexOf(setting)!==-1? "auto" : curCss);
			} else {
				return false;
			}
			if (typeof(curCss)=="undefined" || (typeof(curCss)==="string" && ((getOffsetsInsteadOf0 && /^0(px|em|ex|in|cm|mm|pt|pc|vw|vh|%)/.test(curCss)) || (curCss=="auto" && typeof(preserveAuto)==="undefined")))) {
				switch (setting) {
					case "left":
						curCss="0px";
					break;
					case "top":
						curCss="0px";
					break;
					case "width":
						curCss=element.offsetWidth+"px";
					break;
					case "height":
						curCss=element.offsetHeight+"px";
					break;
					default: break;
				}
			}
			return curCss;
		},
		convertUnits:function(element, setting, value, baseUnit, destUnit) {
			var converted, pxSize, unit, conversionDic, em, e, v;
			if ([null,false].indexOf(destUnit)===-1 && baseUnit!=destUnit && typeof(value)!="object") {
				if ([null,false].indexOf(baseUnit)!==-1) {
					baseUnit="px";
				}
				baseUnit=baseUnit.toLowerCase();
				destUnit=destUnit.toLowerCase();
				var conversionToPixels={};
				conversionToPixels["px"]=function(value, setting, element) { 
					return value;
				};
				conversionToPixels["ex"]=function(value, setting, element) {
					var fs=__.getStyle(element, "fontSize");
					var conv=__.convertUnits(element, "fontFamily",  __.getValue(fs), __.getUnit(fs), "px");
					return value*(__.getValue(conv)*.5);
				};
				conversionToPixels["ch"]=function(value, setting, element) {
					var element=document.createElement("span");
					element.style.display="inline-block";
					element.style.width="auto";
					element.style.fontSize=element.style.fontSize;
					element.style.visibility="hidden";
					element.innerText="0000000000000000000000000000000000000000";
					document.body.appendChild(element);
					var pxSize=(element.offsetWidth/40);
					document.body.removeChild(element);
					return value*pxSize;
				};
				conversionToPixels["%"]=function(value, setting, element) {
					var converted;
					if (setting!==null) {
						if (setting.match(/width|left/i)) {
							converted=value/100*("parentNode" in element && typeof(element.parentNode)!=="undefined" && element.parentNode!==null?element.parentNode.offsetWidth:window.innerWidth);
						} else if (setting.match(/height|top/i) && !setting.match(/line-height/i)) {
							converted=value/100*("parentNode" in element && typeof(element.parentNode)!=="undefined" && element.parentNode!==null?element.parentNode.offsetHeight:window.innerHeight);
						} else if (setting.match(/line-height/i)) {
							converted=value/100*parseFloat(__.css("font-size", "px", false, [element], null, false)[0]);
						} else {
							converted=value/100*("parentNode" in element && typeof(element.parentNode)!=="undefined" && element.parentNode!==null?element.parentNode.offsetWidth:window.innerWidth);
						}
					}
					return converted;
				};
				conversionToPixels["em"]=function(value, setting, element) {
					pxSize=false;
					value=1/value;
					if (typeof(element)=="object" && ("parentNode" in element)) {
						e=(!/font-?size/i.test(setting)?element:element.parentNode);
						while (e!==__.d.documentElement) {
							v=__.getStyle(e, "fontSize");
							unit=__.getUnit(v);
							if (unit=="em") {
								value/=__.getValue(v);
							} else if (unit=="px") {
								pxSize=__.getValue(v)/value;
								break;
							}
							if (e.parentNode.tagName.toLowerCase()=="html" && !pxSize) {
								v=__.getStyle(e.parentNode, "fontSize");
								pxSize=parseFloat(__.convertUnits(e.parentNode, "font-size", __.getValue(v), __.getUnit(v), "px"))/value;
							}
							if (("parentNode" in e) && e.parentNode!==null) {
								e=e.parentNode;
							} else {
								e=document.body;
							}
						}
					}
					return pxSize;
				};
				conversionToPixels["rem"]=function(value, setting, element) {
					v=__.getStyle(__.d.documentElement, "fontSize");
					pxSize=parseFloat(__.convertUnits(__.d.documentElement, "font-size", __.getValue(v), __.getUnit(v), "px"));
					return value*pxSize;
				};
				conversionToPixels["in"]=function(value, setting, element) {
					var dpi=__.getDpi();
					conversionDic=[];
					var converted=value*dpi;
					return converted;
				};
				conversionToPixels["pc"]=function(value, setting, element) {
					var dpi=__.getDpi();
					var converted=value*1/6*dpi;
					return converted;
				};
				conversionToPixels["pt"]=function(value, setting, element) {
					var dpi=__.getDpi();
					var converted=value*1/72*dpi;
					return converted;
				};
				conversionToPixels["cm"]=function(value, setting, element) {
					var dpi=__.getDpi();
					var converted=value*1/25.4*dpi;
					return converted;
				};
				conversionToPixels["mm"]=function(value, setting, element) {
					var dpi=__.getDpi();
					var converted=value*1/254*dpi;
					return converted;
				};
				conversionToPixels["vw"]=function(value, setting, element) {
					var converted=value*window.innerWidth/100;
					return converted;
				};
				conversionToPixels["vh"]=function(value, setting, element) {
					var converted=value*window.innerHeight/100;
					return converted;
				};
				conversionToPixels["vmin"]=function(value, setting, element) {
					var converted=value*Math.min(window.innerWidth, window.innerHeight)/100;
					return converted;
				};
				conversionToPixels["vmax"]=function(value, setting, element) {
					var converted=value*Math.max(window.innerWidth, window.innerHeight)/100;
					return converted;
				};
				converted=conversionToPixels[baseUnit](value, setting, element);
				var conversionFromPixels={};
				conversionFromPixels["px"]=function(value, setting, element) { 
					return value;
				};
				conversionFromPixels["ex"]=function(value, setting, element) {
					var fs=__.getStyle(element, "fontSize");
					var conv=__.convertUnits(element, "fontFamily",  __.getValue(fs), __.getUnit(fs), "px");
					return value/(__.getValue(conv)*.5);
				};
				conversionToPixels["ch"]=function(value, setting, element) {
					var element=document.createElement("span");
					element.style.display="inline-block";
					element.style.width="auto";
					element.style.fontSize=element.style.fontSize;
					element.style.visibility="hidden";
					element.innerText="0000000000000000000000000000000000000000";
					document.body.appendChild(element);
					var pxSize=(element.offsetWidth/40);
					document.body.removeChild(element);
					return value/pxSize;
				};
				conversionFromPixels["%"]=function(value, setting, element) {
					var converted;
					if (setting.match(/width|left/i) && typeof(element.parentNode)!=="undefined" && element.parentNode!==null) {
						converted=value/element.parentNode.offsetWidth*100;
					} else if (setting.match(/width|left/i)) {
						converted=value/document.body.offsetWidth*100;
					} else if (setting.match(/height|top/i) && !setting.match(/line-height/i) && typeof(element.parentNode)!=="undefined" && element.parentNode!==null) {
						converted=value/element.parentNode.offsetHeight*100;
					} else if (setting.match(/height|top/i) && !setting.match(/line-height/i)) {
						converted=value/document.body.offsetHeight*100;
					} else if (setting.match(/line-height/i)) {
						converted=value/parseFloat(__.css("font-size", "px", false, [element], null, false)[0])*100;
					} else if (element.parentNode!==null) {
						converted=value/element.parentNode.offsetWidth*100;
					} else {
						converted=value/document.body.offsetWidth*100;
					}
					return converted;
				};
				conversionFromPixels["em"]=function(value, setting, element) { 
					pxSize=false;
					em=1;
					if (typeof(element)=="object" && ("parentNode" in element)) {
						e=(!/font-?size/i.test(setting)?element:element.parentNode);
						while (e!==__.d.documentElement) {
							v=__.getStyle(e, "fontSize");
							unit=__.getUnit(v);
							if (unit=="em") {
								em/=__.getValue(v);
							} else if (unit=="px") {
								pxSize=__.getValue(v)/em;
								break;
							}
							if (e.parentNode.tagName.toLowerCase()=="html" && !pxSize) {
								v=__.getStyle(e.parentNode, "fontSize");
								pxSize=parseFloat(__.convertUnits(e.parentNode, "font-size", __.getValue(v), __.getUnit(v), "px"))/em;
							}
							if (("parentNode" in e) && e.parentNode!==null) {
								e=e.parentNode;
							} else {
								e=document.body;
							}
						}
					}
					return value/pxSize;
				};
				conversionFromPixels["rem"]=function(value, setting, element) {
					v=__.getStyle(__.d.documentElement, "fontSize");
					pxSize=parseFloat(__.convertUnits(__.d.documentElement, "font-size", __.getValue(v), __.getUnit(v), "px"));
					return value/pxSize;
				};
				conversionFromPixels["in"]=function(value, setting, element) {
					var dpi=__.getDpi();
					value/=dpi;
					return value;
				};
				conversionFromPixels["pc"]=function(value, setting, element) {
					var dpi=__.getDpi();
					value/=dpi;
					return value*6;
				};
				conversionFromPixels["pt"]=function(value, setting, element) {
					var dpi=__.getDpi();
					value/=dpi;
					return value*72;
				};
				conversionFromPixels["cm"]=function(value, setting, element) {
					var dpi=__.getDpi();
					value/=dpi;
					return value*25.4;
				};
				conversionFromPixels["mm"]=function(value, setting, element) {
					var dpi=__.getDpi();
					value/=dpi;
					return value*254;
				};
				conversionFromPixels["vw"]=function(value, setting, element) {
					var converted=value/window.innerWidth*100;
					return converted;
				};
				conversionFromPixels["vh"]=function(value, setting, element) {
					var converted=value/window.innerHeight*100;
					return converted;
				};
				conversionFromPixels["vmin"]=function(value, setting, element) {
					var converted=value/Math.min(window.innerWidth, window.innerHeight)/100;
					return converted;
				};
				conversionFromPixels["vmax"]=function(value, setting, element) {
					var converted=value/Math.max(window.innerWidth, window.innerHeight)/100;
					return converted;
				};
				return conversionFromPixels[destUnit](converted, setting, element);
			} else {
				return value;
			}
		},
		getDpi:function() {
			__.createNode("div", { id:"lib_get_dpi", style:"width:1in; height:0; visibility:hidden; position:absolute;" }, "", [document.body]);
			dpi=__.d.getElementById("lib_get_dpi").offsetWidth;
			__.remove([__.d.getElementById("lib_get_dpi")]);
			return dpi;
		},
		bezier:function(start, end, bezier, ratio) {
			var value=0;
			var p=[start].concat(bezier).concat([end]);
			for (var i=0; i<p.length; i++) {
				value+=__.bernstein(i, p.length-1, ratio)*p[i];
			}
			return value;
		},
		bernstein:function(i, n, r) {
			return __.binomial(i, n)*Math.pow(r, i)*Math.pow((1-r), n-i);
		},
		binomial:function(i, n) {
			return __.factorial(n)/(__.factorial(i)*__.factorial(n-i));
		},
		factorial:function(n) {
			n|=0;
			if (n > 1) {
		 		return n*__.factorial(n-1);
			} else {
		 		return 1;
		 	}
		},
		ltwh:function(elements) {
			var i=0;
			var res=[];
			while (i<elements.length) {
				var node=elements[i];
				var l=node.offsetLeft;
				var t=node.offsetTop;
				var w=node.offsetWidth;
				var h=node.offsetHeight;
				res[i]={ left:l, top:t, width:w, height:h };
				i++;
			}
			return res;
		},
		ltwhRelativeTo:function(elements, ref) {
			var i=0;
			var res=[];
			var node, w, h, l, t;
			var refBoundingClientRect=ref.getBoundingClientRect();
			while (i<elements.length) {
				node=elements[i];
				w=node.offsetWidth;
				h=node.offsetHeight;
				l=0;
				t=0;
				var nodeBoundingClientRect=node.getBoundingClientRect();
				res[i]={ left:nodeBoundingClientRect.left-refBoundingClientRect.left, top:nodeBoundingClientRect.top-refBoundingClientRect.top, width:w, height:h };
				i++;
			}
			return res;
		},
		parents:function(elements, optionalLength) {
			var i=0, c=0;
			targets=[];
			while (i<elements.length) {
				if (c<(typeof(optionalLength)==="number"?optionalLength:Math.pow(2,32))) {
					if ("parentNode" in elements[i] && elements[i].parentNode!==null) {
						targets[i]=elements[i].parentNode;
						c++;
					} else {
						targets[i]=null;
					}
				}
				i++;
			}
			return lib(targets);
		},
		commonAncestorWith:function(elements, element) {
			var i=0, a=[], e=element, r=[];
			while (e.parentNode!==__.d.documentElement) {
				e=e.parentNode;
				a.splice(0, 0, e);
			}
			while (i<elements.length) {
				e=elements[i].parentNode;
				while (a.indexOf(e)===-1 && e!==__.d.documentElement) {
					e=e.parentNode;
				}
				if (a.indexOf(e)!==-1) {
					r[i]=e;
				} else {
					r[i]=null;
				}
				i++;
			}
			return r;
		},
		ancestors:function(filter, elements) {
			var i=0;
			targets=[];
			var filtered=[];
			if (typeof(filter)==="string" && filter.length>0) {
				if (__.d.querySelectorAll) {
					try {
						var sel=__.d.querySelectorAll(filter);
						for (var i=0; i<sel.length; i++) {
							filtered.push(sel[i]);
						}
					} catch(e) {
						console.log(e);
					}
				} else {
					filtered=__.querySelectorAllReplacement(filter, false);
				}
			}
			while (i<elements.length) {
				targets[i]=elements[i].parentNode;
				while ("parentNode" in targets[i] && typeof(targets[i].parentNode)!=="undefined" && filtered.indexOf(targets[i])===-1) {
					targets[i]=targets[i].parentNode;
				}
				if (filtered.indexOf(targets[i])===-1) {
					targets[i]=null;
				}
				i++;
			}
			return lib(targets);
		},
		getTextNodes:function(elements, bool) {
			if (typeof(bool)==="undefined") {
				bool=false;
			}
			var i, j, textNodes=[];
			for (i=0; i<elements.length; i++) {
				textNodes[i]=[];
				for (j=0; j<elements[i].childNodes.length; j++) {
					if (elements[i].childNodes[j].nodeName=="#text") {
						textNodes[i].push(elements[i].childNodes[j]);
					} else if (!bool) {
						textNodes[i]=textNodes[i].concat(__.getTextNodes([elements[i].childNodes[j]])[0]);
					}
				}
			}
			return textNodes;
		},
		getNodesWithoutChildrenOrOnlyTextNodes:function(elements) {
			var i, j, nodes=[];
			for (i=0; i<elements.length; i++) {
				nodes[i]=[];
				for (j=0; j<elements[i].childNodes.length; j++) {
					if (!("childNodes" in elements[i].childNodes[j]) || elements[i].childNodes[j].childNodes.length==0 || __.getTextNodes([elements[i].childNodes[j]], true)[0].length===elements[i].childNodes[j].childNodes.length) {
						nodes[i].push(elements[i].childNodes[j]);
					} else {
						nodes[i]=nodes[i].concat(__.getNodesWithoutChildrenOrOnlyTextNodes([elements[i].childNodes[j]])[0]);
					}
				}
			}
			return nodes;
		},
		getIndexOfNodes:function(elements){
			var i=0;
			var res=[];
			while (i<elements.length) {
				if (elements[i]!==null && elements[i].parentNode!==null) {
					for (var j=0; j<elements[i].parentNode.childNodes.length; j++) {
						if (elements[i].parentNode.childNodes[j]==elements[i]) {
							res[i]=j;
						}
					}
				} else {
					res[i]=null;
				}
				i++;
			}
			return res;
		},
		each:function(fn, elements) {
			for (var p in elements) {
				if (window.navigator.userAgent.match(/trident/i) && ["indexOf","lastIndexOf","forEach","every","some","filter","map","reduce","reduceRight"].indexOf(p)==-1) {
					fn(elements[p]);
				} else {
					fn(elements[p]);
				}
			}
		},
		easing:{
			def: 'easeOutQuad',
			swing: function(t, b, c, d) {
				return __.easing[__.easing.def](t, b, c, d);
			},
			easeLinear: function(t, b, c, d) {
				return c*(t/=d) + b;
			},
			easeInQuad: function(t, b, c, d) {
				return c*(t/=d)*t + b;
			},
			easeOutQuad: function(t, b, c, d) {
				return -c*(t/=d)*(t-2) + b;
			},
			easeInOutQuad: function(t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			},
			easeInCubic: function(t, b, c, d) {
				return c*(t/=d)*t*t + b;
			},
			easeOutCubic: function(t, b, c, d) {
				return c*((t=t/d-1)*t*t + 1) + b;
			},
			easeInOutCubic: function(t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			},
			easeInQuart: function(t, b, c, d) {
				return c*(t/=d)*t*t*t + b;
			},
			easeOutQuart: function(t, b, c, d) {
				return -c * ((t=t/d-1)*t*t*t - 1) + b;
			},
			easeInOutQuart: function(t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			},
			easeInQuint: function(t, b, c, d) {
				return c*(t/=d)*t*t*t*t + b;
			},
			easeOutQuint: function(t, b, c, d) {
				return c*((t=t/d-1)*t*t*t*t + 1) + b;
			},
			easeInOutQuint: function(t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			},
			easeBeat:function(t, b, c, d) {
				var a=t/d;
				return c*a/5 * Math.pow(Math.E, -100*Math.PI*Math.pow((4*a)%0.5-0.25, 2)) + c*a + b;
			},
			easeInSine: function(t, b, c, d) {
				return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
			},
			easeOutSine: function(t, b, c, d) {
				return c * Math.sin(t/d * (Math.PI/2)) + b;
			},
			easeInOutSine: function(t, b, c, d) {
				return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
			},
			easeInExpo: function(t, b, c, d) {
				return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
			},
			easeOutExpo: function(t, b, c, d) {
				return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
			},
			easeInOutExpo: function(t, b, c, d) {
				if (t==0) return b;
				if (t==d) return b+c;
				if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
				return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
			},
			easeInCirc: function(t, b, c, d) {
				return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
			},
			easeOutCirc: function(t, b, c, d) {
				return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
			},
			easeInOutCirc: function(t, b, c, d) {
				if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
				return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
			},
			easeInElastic: function(t, b, c, d) {
				// correctif à la fonction easeInElastic de jquery.easing par Watilin (Matilin Torres) des forums developpez.com
				// les cas « triviaux » : on les teste le plus tôt possible
				if (!t) return b;
				if (t === d) return b + c;
				// ça c'est ma variable pour remplacer les affectations rapides
				var u = t/d - 1;
				return b - c * ( Math.pow(2,10*u)*Math.sin( (u/0.3 - 1/4) * 2*Math.PI ) );
			},
			easeOutElastic: function(t, b, c, d) {
				// correctif à la fonction easeInElastic de jquery.easing par Watilin (Matilin Torres) des forums developpez.com
				// les cas « triviaux » : on les teste le plus tôt possible
				if (!t) return b;
				if (t === d) return b + c;
				// ça c'est ma variable pour remplacer les affectations rapides
				var u = t/d;
				return b + c + c * ( Math.pow(2,-10*u)*Math.sin( (u/0.3 - 1/4) * 2*Math.PI ) );
			},
			easeInOutElastic: function(t, b, c, d) {
				 // correctif à la fonction easeInOutElastic de jquery.easing par Watilin (Matilin Torres) des forums developpez.com
				// les cas « triviaux » : on les teste le plus tôt possible
				if (!t) return b;
				if (t === d) return b + c;
				// ça c'est ma variable pour remplacer les affectations rapides
				var u = 2*t/d - 1;
				if (t/d<0.5) {
					return b - 0.5 * c * ( Math.pow(2,10*u)*Math.sin( (u/0.45 - 1/4) * 2*Math.PI ) );
				}
				else {
					return b + c + 0.5 * c * ( Math.pow(2,-10*u)*Math.sin( (u/0.45 - 1/4) * 2*Math.PI ) );
				}
			},
			easeInBack: function(t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*(t/=d)*t*((s+1)*t - s) + b;
			},
			easeOutBack: function(t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			easeInOutBack: function(t, b, c, d, s) {
				if (s == undefined) s = 1.70158; 
				if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
				return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
			},
			easeInBounce: function(t, b, c, d) {
				return c - __.easing.easeOutBounce(d-t, 0, c, d) + b;
			},
			easeOutBounce: function(t, b, c, d) {
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
				}
			},
			easeInOutBounce: function(t, b, c, d) {
				if (t < d/2) return __.easing.easeInBounce (t*2, 0, c, d) * .5 + b;
				return __.easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
			}
		},
		address:{	
			init:function(fn) {
				if (__.d.location.addEventListener) {
					__.d.location.addEventListener("init", fn, false);
				} else if (__.d.location.attachEvent) {
					__.d.location.attachEvent("oninit", fn);
				}
			},
			change:function(fn) {
				if ("onhashchange" in window) {
					window.onhashchange = function(e) {
						if (!window.navigator.userAgent.match(/trident/i)) {
							e.hash=e.newURL.substring(e.newURL.indexOf("#"));	
						} else {
							var e={};
							e.hash=__.d.location.href.substring(__.d.location.href.indexOf("#"));	
						}
						fn(e);
					}
				} else {
					var prevHash = window.location.hash;
					window.setInterval(function() {
		   				if (window.location.hash != prevHash) {
			  				var e;
			  				prevHash=window.location.hash;
			  				e.hash=window.location.hash;
			  				fn(e);
		   				}
	   				}, 100);
				}
			},
			hash:function() {
				return window.location.hash;
			},
			fullPath:function() {
				return window.location.protocol+'//'+window.location.host+window.location.pathname;
			},
			nohash:function() {
				return window.location.protocol+'//'+window.location.host+window.location.pathname+(window.location.search?window.location.search:"");
			},
			removeHash:function() {
				history.replaceState("", __.d.title, window.location.pathname+window.location.search);
			},
			setHash:function(val) {
				window.location.hash=val;
			},
			host:function() {
				return window.location.host;
			},
			hostname:function() {
				return window.location.hostname;
			},
			href:function() {
				return window.location.href;
			},
			origin:function() {
				return window.location.origin;
			},
			search:function() {
				return window.location.search.substring(1).split(/\&/);
			},
			pathName:function() {
				return window.location.pathname;
			},
			setPathName:function(str) {
				window.location.pathname=str;
			},
			port:function() {
				return window.location.port;
			},
			protocol:function() {
				return window.location.protocol;
			},
			setLocation:function(str) {
				window.location=str;
			}
		},
		ajax:function(obj) {
			if (!("type" in obj)) {
				obj.type="GET";
			} else {
				obj.type=obj.type.toUpperCase();
			}
			if (!("data" in obj)) {
				obj.data=null;
			} else {
				var str="";
				var count=0;
				for (var prop in obj.data) {
					str+=((count>0)?"&":"")+prop+"="+encodeURIComponent(obj.data[prop]);
					count++;
				}
				obj.data=str;
			}
			if (!("onsuccess" in obj)) {
				obj.onsuccess=null;
			}
			if (!("onpartial" in obj)) {
				obj.onpartial=null;
			}
			if (!("onfail" in obj)) {
				obj.onfail=null;
			}
			if (!("addparams" in obj)) {
				obj.addparams=[];
			}
			if (!("onuploadprogress" in obj)) {
				obj.onuploadprogress=null;
			}
			if (!("onprogress" in obj)) {
				obj.onprogress=null;
			}
			if (!("onloadstart" in obj)) {
				obj.onloadstart=null;
			}
			if (!("headers" in obj)) {
				obj.headers=[["X-Requested-With", "XMLHttpRequest"]];
			} else if (obj.headers.indexOf(["X-Requested-With", "XMLHttpRequest"])===-1) {
				obj.headers.push(["X-Requested-With", "XMLHttpRequest"]);
			}
			if (!("send" in obj)) {
				obj.send=null;
			}
			if (("url" in obj)) {
				var xhr;
				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (window.ActiveXObject) {
					try {
						xhr = new ActiveXObject("Msxml2.XMLHTTP");
					} catch(e) {
						xhr = new ActiveXObject("Microsoft.XMLHTTP");
					}
				}
				if (xhr) {
					if ("beforesend" in obj) {
						obj.beforesend(xhr);
					}
					if ("datatype" in obj) {
						xhr.responseType=obj.datatype;
					}
					if ("upload" in xhr) {
						xhr.upload.onprogress = function(e) {
							if (obj.onuploadprogress!=null) {
								if (e.lengthComputable){
									obj.info={ loaded:e.loaded, total:e.total };
									obj.onuploadprogress.call(this, obj.info);
								}
							}
						};
					}
					xhr.onloadstart = function(e) {
						if (obj.onloadstart!=null) {
							if (e.lengthComputable){
								obj.info={ loaded:e.loaded, total:e.total };
								obj.onloadstart.call(this, obj.info);
							}
						}
					};
					xhr.onprogress = function(e) {
						if (obj.onprogress!=null) {
							if (e.lengthComputable){
								obj.info={ loaded:e.loaded, total:e.total };
								obj.onprogress.call(this, obj.info);
							}
						}
					};
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 3) {
							(xhr.status == 200)
							?
								(function() {
									if (obj.onpartial!=null) {
										var d=xhr.responseText;
										obj.addparams.d=d;
										obj.onpartial.call(this, obj.addparams);
									}
								})()
							:
								(function() {
									if (obj.onfail!=null) {
										var d=xhr.statusText;
										obj.addparams.d=d;
										obj.onfail.call(this, obj.addparams);
									}
								})()
							;
						} else if (xhr.readyState == 4) {
							(xhr.status == 200)
							?
								(function() {
									if (obj.onsuccess!=null) {
										var d=xhr.responseText;
										obj.addparams.d=d;
										obj.onsuccess.call(this, obj.addparams);
									}
								})()
							:
								(function() {
									if (obj.onfail!=null) {
										var d=xhr.statusText;
										obj.addparams.d=d;
										obj.onfail.call(this, obj.addparams);
									}
								})()
							;
						}
					};
				}
				xhr.open(obj.type, obj.url+(obj.send!==null && obj.data!==null?"?"+obj.data:""), true);
				if (obj.type=="POST" && obj.headers.length===1) {
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					xhr.setRequestHeader(obj.headers[0][0], obj.headers[0][1]);
				} else {
					for (var i=0; i<obj.headers.length; i++) {
						xhr.setRequestHeader(obj.headers[i][0], obj.headers[i][1]);
					}
				}
				xhr.send((obj.send!==null?obj.send:obj.data));
			}
		},
		objToGetUrl:function(obj) {
			if (__.isObject(obj)) {
				var str="?";
				for (var p in obj) {
					str+=encodeURIComponent(p)+'='+encodeURIComponent(obj[p])+'&';
				}
				str=str.substring(0, str.length-1);
				return str;
			}
			return "";
		},
		refresh:function(how) {
			if (how===undefined || how=="exact") {
				__.d.location.reload();
			} else if (how=="clearParams") {
				var str=__.d.location.toString();
				if (str.indexOf('?')!=-1) {
					str=str.replace(/\?(.*)/, "");
				}
				if (str.indexOf('#')!=-1) {
					str=str.replace(/#(.*)/, "");
				}
				__.d.location=str;
			} else if (how=="clearParamsAndPage") {
				var str=__.d.location.toString();
				if (str.indexOf('?')!=-1) {
					str=str.replace(/\?(.*)/, "");
				}
				if (str.indexOf('#')!=-1) {
					str=str.replace(/#(.*)/, "");
				}
				str=str.substring(0, str.lastIndexOf("/")+1);
				__.d.location=str;
			}
		},
		pMT:[],
		preventMultipleThrowsDuringPeriod:function(fn, time) {
			time=time===undefined?500:time;
			if (!__.pMT[fn.toString()]) {
				__.pMT[fn.toString()]=0;
			}
			__.pMT[fn.toString()]++;
			if (__.pMT[fn.toString()]==1) {
				setTimeout(function() { __.reEnable(fn.toString()); }, time);
				fn();
			}
		},
		reEnable:function(index) {
			__.pMT[index]=0;
		},
		selection:function() {
			__.selection.getTextSelection=function() {
				var userSelection;
				if (window.getSelection) {  // all browsers, except IE before version 9
					userSelection=window.getSelection();
				}
				if (userSelection.rangeCount>0 && userSelection.getRangeAt) {
					var ranges=[];
					for (var i=0; i<userSelection.rangeCount; i++) {
					 	ranges[i]=userSelection.getRangeAt(i);
					}
					return { userSelection:userSelection, ranges:ranges };
				} else if (userSelection.rangeCount==0 && __.d.createRange) {
					return { userSelection:userSelection, ranges:__.d.createRange() };
				}
			};
			__.selection.saveSelectionContainerIndexes = function() {
				var start, end, startNode, endNode, startNodeIndex, endNodeIndex, selectionContainerIndexes=[], j, n, bool=false;
				for (var i=0; i<__.selection.main.ranges.length; i++) {
					if (typeof(__.selection.main.ranges[i])!="undefined") {
						start=__.selection.main.ranges[i].startOffset;
						end=__.selection.main.ranges[i].endOffset;
						startNode=__.selection.main.ranges[i].startContainer;
						endNode=__.selection.main.ranges[i].endContainer;
						startNodeIndex=-1;
						endIndex=-1;
						let startClone=__.objectDuplicate(startNode);
						for (j=0; j<startClone.childNodes.length; j++) {
							if (startClone.childNodes[j].nodeName!=="#text") {
								startClone.removeChild(startClone.childNodes[j]);
							}
						}
						if ("innerText" in startClone) {
							let startText=__.trim(startClone.innerText);
							if (start>startText.length) {
								startNode=startNode.childNodes[start];
								start=["input","textarea"].indexOf(startNode.tagName.toLowerCase())!==-1?startNode.value.length:startNode.innerText.length;
							}
						}
						let endClone=__.objectDuplicate(endNode);
						for (j=0; j<endClone.childNodes.length; j++) {
							if (endClone.childNodes[j].nodeName!=="#text") {
								endClone.removeChild(endClone.childNodes[j]);
							}
						}
						if ("innerText" in endClone) {
							let endText=__.trim(endClone.innerText);
							if (end>endText.length) {
								endNode=endNode.childNodes[end];
								end=["input","textarea"].indexOf(endNode.tagName.toLowerCase())!==-1?endNode.value.length:endNode.innerText.length;
							}
						}
						try {
							if ("tagName" in startNode && "tagName" in endNode) {
								bool=["input","textarea"].indexOf(startNode.tagName.toLowerCase())!==-1||["input","textarea"].indexOf(endNode.tagName.toLowerCase())!==-1;
							}
						} catch(e) {
							bool=true;
						}
						if (bool) {
							selectionContainerIndexes[i]={
								startOffset:start,
								endOffset:end,
								startNode:startNode,
								endNode:endNode,
								startParent:startNode.parentNode,
								endParent:endNode.parentNode,
								startNodeIndex:__.getIndexOfNodes([startNode])[0],
								endNodeIndex:__.getIndexOfNodes([endNode])[0],
								startParentIndex:__.getIndexOfNodes([startNode.parentNode])[0],
								endParentIndex:__.getIndexOfNodes([endNode.parentNode])[0]
							};
							continue;
						}
						if ("parentNode" in startNode && startNode.parentNode!==null && "parentNode" in endNode && endNode.parentNode!==null) {
							j=0;
							while (j<startNode.parentNode.childNodes.length) {
								if (startNode.parentNode.childNodes[j]==startNode) {
									startIndex=j;
								}
								j++;
							}
							j=0;
							while (j<endNode.parentNode.childNodes.length) {
								if (endNode.parentNode.childNodes[j]==endNode) {
									endIndex=j;
								}
								j++;
							}
							startParentIndex=__.getIndexOfNodes([startNode.parentNode])[0];
							endParentIndex=__.getIndexOfNodes([endNode.parentNode])[0];
							// fixes firefox
							if (navigator.userAgent.toLowerCase().indexOf('firefox')>-1) {
								if (__.selection.main.ranges[i].toString().length>0) {
									var nodes=__.selection.getNodes(i);
									var s="";
									for (j=0; j<nodes.length; j++) {
										s+=nodes[j].textContent;
									}
									var tmpIndex=0;
									if (s.substring(start).indexOf(__.selection.main.ranges[i].toString())!==-1) {
										tmpIndex=start+s.substring(start).indexOf(__.selection.main.ranges[i].toString());
										var l=0;
										for (j=0; j<nodes.length; j++) {
											if (l<=tmpIndex && l+nodes[j].textContent.length>=tmpIndex) {
												if (nodes[j].firstChild!==null && nodes[j].firstChild.textContent===nodes[j].textContent) {
													nodes[j]=nodes[j].firstChild;
												}
												startNode=nodes[j];
												startNodeIndex=__.getIndexOfNodes([startNode])[0];
												startParent=nodes[j].parentNode;
												startParentIndex=__.getIndexOfNodes([startParent])[0];
												start=tmpIndex-l;
											}
											if (l<=tmpIndex+__.selection.main.ranges[i].toString().length && l+nodes[j].textContent.length>=tmpIndex+__.selection.main.ranges[i].toString().length) {
												if (nodes[j].firstChild!==null && nodes[j].firstChild.textContent===nodes[j].textContent) {
													nodes[j]=nodes[j].firstChild;
												}
												endNode=nodes[j];
												endNodeIndex=__.getIndexOfNodes([endNode])[0];
												endParent=nodes[j].parentNode;
												endParentIndex=__.getIndexOfNodes([endParent])[0];
												end=tmpIndex+__.selection.main.ranges[i].toString().length-l;
											}
											l+=nodes[j].textContent.length;
										}
									}
								} else {
									startNode=__.selection.main.ranges[i].commonAncestorContainer;
									endNode=startNode;
									startNodeIndex=__.getIndexOfNodes([startNode])[0];
									endNodeIndex=__.getIndexOfNodes([endNode])[0];
									startParent=startNode.parentNode;
									endParent=endNode.parentNode;
								}
							}
							selectionContainerIndexes[i]={
								startOffset:start,
								endOffset:end,
								startNode:startNode,
								endNode:endNode,
								startParent:startNode.parentNode,
								endParent:endNode.parentNode,
								startNodeIndex:startIndex,
								endNodeIndex:endIndex,
								startParentIndex:startParentIndex,
								endParentIndex:endParentIndex
							};
						} else {
							selectionContainerIndexes[i]=null;
							continue;
						}
					} else {
						selectionContainerIndexes[i]=null;
						continue;
					}
				}
				return selectionContainerIndexes;
			};
			__.selection.restore=function(saved) {
				var index;
				if (__.isArray(saved) && 0 in saved) {
					for (var i=0; i<saved.length; i++) {
						if (saved[i].startOffset!==saved[i].endOffset || saved[i].startNode!==saved[i].endNode) {
							__.selection.setRange(saved[i].startNode, saved[i].startOffset, saved[i].endNode, saved[i].endOffset);
						} else {
							__.selection.setCaretPosition(saved[i].startNode, saved[i].startOffset);
						}
					}
				}
			};
			__.selection.setRange=function(startNode, startOffset, endNode, endOffset) {
				__.selection.main.userSelection.removeAllRanges();
				var range=("createRange" in __.selection.main.userSelection)?__.selection.main.userSelection.createRange():__.d.createRange();
				range.setStart(startNode, startOffset);
				range.setEnd(endNode, endOffset);
				__.selection.main.userSelection.addRange(range);
				__.selection.main.ranges=[range];
			};
			__.selection.remove=function() {
				__.selection.main.userSelection.removeAllRanges();
			};
			__.selection.setCaretPosition=function(element, caretPos) {
				if (element!==null && !("tagName" in element && ["input", "textarea"].indexOf(element.tagName.toLowerCase())!==-1)) {
					var range=__.d.createRange();
					range.setStart(element, caretPos);
					range.collapse(true);
					__.selection.main.userSelection.removeAllRanges();		
					__.selection.main.userSelection.addRange(range);
					__.selection.main.ranges=[range];
					while (element.parentNode!==null && !("contentEditable" in element && element.contentEditable==="true") && element!==document.body) {
						element=element.parentNode;
					}
					if (__.isObject(element) && "focus" in element) {
						element.focus();
					}
				} else if (element!==null && "tagName" in element && ["input", "textarea"].indexOf(element.tagName.toLowerCase())!==-1) {
					if (element.createTextRange) {
						var range = element.createTextRange();
						range.move('character', caretPos);
						range.select();
					} else if ("selectionStart" in element) {
						if (element.type==="number") {
							element.type="text";
							element.focus();
							element.setSelectionRange(caretPos, caretPos);
							element.type="number";
						} else {
							element.focus();
							element.setSelectionRange(caretPos, caretPos);
						}
					} else if (__.isObject(element) && "focus" in element) {
						element.focus();
					}
				}
			};
			__.selection.commonAncestorContainer=function(index) {
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				if (index in __.selection.main.ranges) {
					var start=__.selection.main.ranges[index].startContainer;
					var end=__.selection.main.ranges[index].endContainer;
					var cAC;
					if (start!==end) {
						var s=start;
						var e=end;
						var sDepth=0;
						var eDepth=0;
						while (s.toString()!="[object HTMLDocument]") {
							s=s.parentNode;
							sDepth++;
						}
						while (e.toString()!="[object HTMLDocument]") {
							e=e.parentNode;
							eDepth++;
						}
						s=start, e=end;
						if (sDepth>eDepth) {
							while (sDepth>eDepth) {
								s=s.parentNode;
								sDepth--;
							}
						} else if (eDepth>sDepth) {
							while (eDepth>sDepth) {
								e=e.parentNode;
								eDepth--;
							}
						}
						while (s!==e) {
							s=s.parentNode;
							e=e.parentNode;
						}
						cAC=s;
					} else if (start==end && start.toString()=="[object Text]") {
						cAC=start.parentNode;
					} else if (start==end) {
						cAC=start;
					}
				} else {
					cAC=null;
				}
				return cAC;
			};
			__.selection.getText=function(index) {
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				if (index in __.selection.main.ranges) {
					return __.selection.main.ranges[index].toString();
				} else {
					return "";
				}
			};
			__.selection.getHTML=function(index) {
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				var cac=__.selection.commonAncestorContainer(index), str="";
				if ((index in __.selection.main.ranges) && __.selection.main.ranges[index].startOffset!==__.selection.main.ranges[index].endOffset) {
					str=getHTMLContents(cac, __.selection.saved[index].startNode, __.selection.saved[index].endNode, __.selection.saved[index].startOffset, __.selection.saved[index].endOffset, false, false).s;
				}
				function getHTMLContents(container, startContainer, endContainer, startOffset, endOffset, startContainerMet, endContainerMet) {
					var s="", g;
					for (var i=0; i<container.childNodes.length; i++) {
						if (!startContainerMet && container.childNodes[i]===startContainer) {
							startContainerMet=true;
							if (container.childNodes[i].nodeName==="#text") {
								s+=container.childNodes[i].textContent.substring(startOffset);
							} else {
								if (container.childNodes[i].childNodes.length>0) {
									s+=container.childNodes[i].childNodes[0].textContent.substring(startOffset);
								} else {
									s+=container.childNodes[i].outerHTML;
								}
							}
							continue;
						}
						if (!endContainerMet && container.childNodes[i]===endContainer) {
							endContainerMet=true;
							if (container.childNodes[i].nodeName==="#text") {
								s+=container.childNodes[i].textContent.substring(0, endOffset);
							} else {
								if (container.childNodes[i].childNodes.length>0) {
									s+=container.childNodes[i].childNodes[0].textContent.substring(0, endOffset);
								} else {
									s+=container.childNodes[i].outerHTML;
								}
							}
							break;
						}
						if (!endContainerMet) {
							if (container.childNodes[i].childNodes.length>0) {
								s+=/^<[^>]+>/.exec(container.childNodes[i].outerHTML)[0];
								g=getHTMLContents(container.childNodes[i], startContainer, endContainer, startContainerMet, endContainerMet);
								s+=g.s;
								if (!g.endContainerMet) {
									s+=/<[^>]+>$/.exec(container.childNodes[i].outerHTML)[0];
								}
							} else if (container.childNodes[i].nodeName==="#text") {
								s+=container.childNodes[i].textContent;
							} else {
								s+=container.childNodes[i].outerHTML;
							}
						}
					}
					return { s:s, endContainerMet:endContainerMet };
				}
				return str;
			};
			__.selection.lookForNodes=function(n, s, e, cac, id, cond) {
				var ret=false;
				if (n!==null) {
					if (n===s) {
						__.selection.startNodeFound=true;
					} else if (n===e) {
						ret=true;
					}
					if (cond(n)) {
						if (__.selection.lastDepthNodes[id].indexOf(n)===-1) {
							__.selection.lastDepthNodes[id].push(n);
						}
					}
					if (!ret && "firstChild" in n && n.firstChild!==null) {
						return __.selection.lookForNodes(n.firstChild, s, e, cac, id, cond);
					} else if (!ret && "nextSibling" in n && n.nextSibling!==null) {
						return __.selection.lookForNodes(n.nextSibling, s, e, cac, id, cond);
					} else if (!ret) {
						while ("parentNode" in n  && n.parentNode!==null && n.parentNode.nextSibling===null) {
							if (n===e || n===cac) {
								return true;
							}
							n=n.parentNode;
						}
						if (n.parentNode!==null && n.parentNode!==cac) {
							return __.selection.lookForNodes(n.parentNode.nextSibling, s, e, cac, id, cond);
						} else {
							return true;
						}
					} else {
						return true;
					}
				} else {
					return true;
				}
			};
			__.selection.getNodes=function(index, cond) {
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				if (typeof(cond)!=="function") {
					cond=function(n) { return (n.nodeName==="#text" || ("firstChild" in n && n.firstChild===null)); };
				}
				if (typeof(__.selection.main.ranges[index])!="undefined") {
					var selectionContainerIndexes=[];
					start=__.selection.main.ranges[index].startOffset;
					end=__.selection.main.ranges[index].endOffset;
					startNode=__.selection.main.ranges[index].startContainer;
					endNode=__.selection.main.ranges[index].endContainer;
					startNodeIndex=-1;
					endIndex=-1;
					selectionContainerIndexes[index]={
						startOffset:start,
						endOffset:end,
						startNode:startNode,
						endNode:endNode,
						startParent:null,
						endParent:null,
						startNodeIndex:null,
						endNodeIndex:null,
						startParentIndex:null,
						endParentIndex:null
					};
					if ("parentNode" in startNode && startNode.parentNode!==null && "parentNode" in endNode && endNode.parentNode!==null) {
						j=0;
						while (j<startNode.parentNode.childNodes.length) {
							if (startNode.parentNode.childNodes[j]==startNode) {
								startIndex=j;
							}
							j++;
						}
						j=0;
						while (j<endNode.parentNode.childNodes.length) {
							if (endNode.parentNode.childNodes[j]==endNode) {
								endIndex=j;
							}
							j++;
						}
						startParentIndex=__.getIndexOfNodes([startNode.parentNode])[0];
						endParentIndex=__.getIndexOfNodes([endNode.parentNode])[0];
					}
					var startNode=selectionContainerIndexes[index].startNode;
					var start=selectionContainerIndexes[index].startOffset;
					var endNode=selectionContainerIndexes[index].endNode;
					var end=selectionContainerIndexes[index].endOffset;
					if (endNode.nodeName!=="#text" && endNode.tagName.toLowerCase()!=="br" && endNode.firstChild!==null && end===1) {
						endNode=endNode.firstChild;
						end=endNode.textContent.length;
					}
					if (startNode!=endNode) {
						var n=startNode;
						var s=startNode;
						var e=endNode;
						var cac=__.selection.commonAncestorContainer(index);
						if (n.nodeName=="#text") {
							n=n.parentNode;
						}
						__.selection.startNodeFound=false;
						if (!("lastDepthNodes" in __.selection)) {
							__.selection.lastDepthNodes=[];
						}
						__.selection.lastDepthNodes[index]=[];
						r=__.selection.lookForNodes(n, s, e, cac, index, cond);
						if (r) {
							return __.selection.lastDepthNodes[index];
						} else {
							return [];
						}
					} else {
						return [startNode];
					}
				} else {
					return [];
				}
			};
			__.selection.getParentNodes=function(index) {
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				var lastDepthNodes=__.selection.getNodes(index, function(n) { return (n.nodeName==="#text" || ("firstChild" in n && n.firstChild===null)); }), nodes=[];
				for (var i=0; i<lastDepthNodes.length; i++) {
					if (nodes.indexOf(lastDepthNodes[i].parentNode)===-1) {
						nodes.push(lastDepthNodes[i].parentNode);
					}
				}
				return nodes;
			};
			__.selection.setFontStyle=function(cssParam, value, editablecontainer, index) {
				var i, j, k, l, p, n1, n2, n3, c1, c2, c3, styles, ignoreNodes=0, toBeSplit, isStartSplitted, isEndSplitted, caretNode=false, caretIndex, clone, nodes=[], toReplace, findStartOffset, findEndOffset;
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				var container=__.selection.commonAncestorContainer(index), i;
				if (typeof(editablecontainer)!=="undefined" && editablecontainer!==null) {
					while (container!=editablecontainer && container.tagName.toLowerCase()!="html") {
						container=container.parentNode;
					}
				}
				if (container.tagName.toLowerCase()!="html") {
					var possibleStyles=["fontSize","fontWeight","fontStyle","textDecoration","color","fontFamily"];
					var n;
					__.selection.saved=__.selection.saveSelectionContainerIndexes();
					var saved=__.selection.saved[index];
					var startC=__.selection.main.ranges[index].startContainer;
					var endC=__.selection.main.ranges[index].endContainer;
					if (startC.nodeName=="#text") {
						startC=startC.parentNode;
					}
					if (endC.nodeName=="#text") {
						endC=endC.parentNode;
					}
					cssParam=cssParam.replace(/-[a-z]/gim, function(str) { return str.substring(1).toUpperCase(); });
					if (cssParam!="textAlign") {
						n=__.selection.getNodes(index, function(n) { return n.nodeName==="#text"; });
						if (["fontWeight", "fontStyle", "textDecoration"].indexOf(cssParam)!=-1) {
							var styled=0;
							for (var i=0; i<n.length; i++) {
								if (n[i].parentNode.style[cssParam]===value) {
									styled++;
								}
							}
							if (styled===n.length-ignoreNodes) {
								switch (cssParam) {
									case "fontWeight":
										value="normal";
									break;
									case "fontStyle":
										value="normal";
									break;
									case "textDecoration":
										value="none";
									break;
								}
							}
						}
						var nodeIndexes=[];
						for (i=0; i<n.length; i++) {
							nodeIndexes[i]=lib([n[i]]).getIndexOfNodes()[0];
						}
						for (i=0; i<n.length; i++) {
							if (!("firstChild" in n[i] && n[i].firstChild!==null && "className" in n[i].firstChild && /\bglyf_inline_image\b/.test(n[i].firstChild.className)) && !("tagName" in n[i] && n[i].tagName.toLowerCase()==="img")) {
								findStartOffset=false;
								findEndOffset=false;
								before="";
								after="";
								if (n[i].nodeName==="#text" && ((saved.startNode===n[i] && saved.startOffset>0 && saved.startOffset<n[i].textContent.length) || (saved.endNode===n[i] && saved.endOffset>0 && saved.endOffset<n[i].textContent.length))) {
									toBeSplit=true;
									isStartSplitted=(saved.startNode===n[i] && saved.startOffset>0);
									isEndSplitted=(saved.endNode===n[i] && saved.endOffset<n[i].textContent.length);
								} else {
									toBeSplit=false;
									isStartSplitted=false;
									isEndSplitted=false;
								}
								styles={};
								for (p in n[i].parentNode.style) {
									styles[p]=n[i].parentNode.style[p];
								}
								if (toBeSplit) {
									if (isStartSplitted && isEndSplitted) {
										c1=n[i].textContent.substring(0, saved.startOffset);
										c2=n[i].textContent.substring(saved.startOffset, saved.endOffset);
										c3=n[i].textContent.substring(saved.endOffset);
										n1=__.d.createElement("span");
										n2=__.d.createElement("span");
										n3=__.d.createElement("span");
										lib([n1]).addClass("createdFromLib");
										lib([n2]).addClass("createdFromLib");
										lib([n3]).addClass("createdFromLib");
									} else if (isStartSplitted) {
										c1=n[i].textContent.substring(0, saved.startOffset);
										c2=n[i].textContent.substring(saved.startOffset);
										n1=__.d.createElement("span");
										n2=__.d.createElement("span");
										n3=null;
										lib([n1]).addClass("createdFromLib");
										lib([n2]).addClass("createdFromLib");
									} else if (isEndSplitted) {
										c2=n[i].textContent.substring(0, saved.endOffset);
										c3=n[i].textContent.substring(saved.endOffset);
										n1=null;
										n2=__.d.createElement("span");
										n3=__.d.createElement("span");
										lib([n2]).addClass("createdFromLib");
										lib([n3]).addClass("createdFromLib");
									}
								} else if (n[i].nodeName==="#text" && !(n[i]===saved.startNode && n[i]===saved.endNode && saved.startOffset===saved.endOffset)) {
									c2=n[i].textContent;
									n1=null;
									n2=__.d.createElement("span");
									n3=null;
									lib([n2]).addClass("createdFromLib");
								} else if (n[i].nodeName==="#text") {
									c1=n[i].textContent;
									c2="";
									n1=__.d.createElement("span");
									n2=__.d.createElement("span");
									n3=null;
									lib([n1]).addClass("createdFromLib");
									lib([n2]).addClass("createdFromLib");
								} else {
									n1=null;
									n2=n[i].cloneNode(true);
									n3=null;
								}
								if (n[i].parentNode.tagName.toLowerCase()==="span" && !("appendToParent" in n[i])) {
									toReplace=n[i].parentNode;
									appendToParent=!1;
									for (j=i+1; j<n.length; j++) {
										if (n[j].parentNode===toReplace) {
											clone=n[j].cloneNode(true);
											if (n[j]===saved.endNode) {
												saved.endNode=clone;
											}
											clone.appendToParent=n[j].parentNode.parentNode;
											n[j]=clone;
										}
									}
								} else if (n[i].parentNode.tagName.toLowerCase()==="span" && ("appendToParent" in n[i])) {
									toReplace=!1;
									appendToParent=n[i].appendToParent;
								} else {
									toReplace=n[i];
									appendToParent=!1;
								}
								if (n2.tagName.toLowerCase()==="span") {
									if (typeof(c2)==="undefined" || c2.length===0) {
										c2="&#8203;";
										n2.innerHTML=c2;
									} else {
										n2.textContent=c2;
									}
									for (p in styles) {
										if (p!==cssParam) {
											n2.style[p]=styles[p];
										}
									}
									n2.style[cssParam]=value;
									if (n[i]===saved.startNode && n[i]===saved.endNode && saved.startOffset===saved.endOffset) {
										caretNode=n2;
										caretIndex=1;
									} else {
										if (n[i]===saved.startNode) {
											saved.startNode=n2.firstChild;
											saved.startParent=n2;
											saved.startOffset=0;
											saved.startIndex=0;
										}
										if (n[i]===saved.endNode) {
											saved.endNode=n2.firstChild;
											saved.endParent=n2;
											saved.endOffset=c2.length;
											saved.endIndex=0;
										}
									}
									if (!!toReplace) {
										toReplace.parentNode.replaceChild(n2, toReplace);
									} else {
										appendToParent.appendChild(n2);
									}
								} else {
									if (n[i].parentNode===saved.startNode) {
										if (!!toReplace) {
											saved.startNode=toReplace.parentNode;
											saved.startParent=toReplace.parentNode.parentNode;
											findStartOffset=true;
										} else {
											saved.startNode=appendToParent;
											saved.startParent=appendToParent.parentNode;
											findStartOffset=true;
										}
									}
									if (n[i].parentNode===saved.endNode) {
										if (!!toReplace) {
											saved.endNode=toReplace.parentNode;
											saved.endParent=toReplace.parentNode.parentNode;
											findEndOffset=true;
										} else {
											saved.endNode=appendToParent;
											saved.endParent=appendToParent.parentNode;
											findEndOffset=true;
										}
									}
									if (!!toReplace) {
										toReplace.parentNode.replaceChild(n2, toReplace);
									} else {
										appendToParent.appendChild(n2);
									}
									if (findStartOffset) {
										saved.startOffset=__.getIndexOfNodes([n2])[0];
									}
									if (findEndOffset) {
										saved.endOffset=__.getIndexOfNodes([n2])[0]+1;
									}
								}
								if (n1!==null) {
									n1.textContent=c1;
									for (p in styles) {
										n1.style[p]=styles[p];
									}
									n2.parentNode.insertBefore(n1, n2);
								}
								if (n3!==null) {
									n3.textContent=c3;
									for (p in styles) {
										n3.style[p]=styles[p];
									}
									if (n2.nextSibling===null) {
										n2.parentNode.appendChild(n3);
									} else {
										n2.parentNode.insertBefore(n3, n2.nextSibling);
									}
								}
								if (n1!==null) {
									if (n1.previousSibling!==null) {
										nodes.push(n1.previousSibling);
									}
									nodes.push(n1);
								} else if (n2.previousSibling!==null) {
									nodes.push(n2.previousSibling);
								}
								nodes.push(n2);
								if (n3!==null) {
									nodes.push(n3);
									if (n3.nextSibling!==null) {
										nodes.push(n3.nextSibling);
									}
								} else if (n2.nextSibling!==null) {
									nodes.push(n2.nextSibling);
								}
							}
						}
						for (i=0; i<nodes.length-1; i++) {
							if (nodes[i].nextSibling!==null && "tagName" in nodes[i].nextSibling && "tagName" in nodes[i] && nodes[i].tagName.toLowerCase()==="span" && nodes[i].tagName.toLowerCase()===nodes[i].nextSibling.tagName.toLowerCase()) {
								styles={};
								k=0;
								for (p in possibleStyles) {
									if ((["fontWeight","fontStyle","textDecoration"].indexOf(possibleStyles[p])!==-1 && /^normal|none$/.test(nodes[i].style[possibleStyles[p]])) || nodes[i].style[possibleStyles[p]]===null) {
										styles[possibleStyles[p]]="";
									} else {
										styles[possibleStyles[p]]=nodes[i].style[possibleStyles[p]];
									}
								}
								for (p in possibleStyles) {
									if ((["fontWeight","fontStyle","textDecoration"].indexOf(possibleStyles[p])!==-1 && /^normal|none$/.test(nodes[i].nextSibling.style[possibleStyles[p]])) || nodes[i].nextSibling.style[possibleStyles[p]]===null) {
										k+=(""===styles[possibleStyles[p]]?0:1);
									} else {
										k+=(nodes[i].nextSibling.style[possibleStyles[p]]===styles[possibleStyles[p]]?0:1);
									}
								}
								if (k===0 && !/[\.,;\:\!\?\:\(\)\{\}\[\]\_\-\–\—]/.test(nodes[i].firstChild.textContent.substring(0, nodes[i].firstChild.textContent.length-1))) {
									l=nodes[i].textContent.length;
									nodes[i].firstChild.textContent=nodes[i].firstChild.textContent+nodes[i].nextSibling.firstChild.textContent;
									if (nodes[i].nextSibling===caretNode) {
										caretNode=nodes[i];
										caretIndex+=l;
									} else {
										if (nodes[i].nextSibling.firstChild===saved.startNode) {
											saved.startNode=nodes[i].firstChild;
											saved.startParent=nodes[i];
											saved.startOffset+=l;
										}
										if (nodes[i].nextSibling.firstChild===saved.endNode) {
											saved.endNode=nodes[i].firstChild;
											saved.endParent=nodes[i];
											saved.endOffset+=l;
										}
									}
									if (nodes[i+1]===nodes[i].nextSibling) {
										nodes[i+1]=nodes[i];
									}
									if (nodes[i].parentNode===saved.endNode && __.getIndexOfNodes([nodes[i].nextSibling])[0]<saved.endOffset) {
										saved.endOffset-=1;
									}
									nodes[i].parentNode.removeChild(nodes[i].nextSibling);
								}
							}
						}
						if (!caretNode) {
							__.selection.setRange(saved.startNode, saved.startOffset, saved.endNode, saved.endOffset);
						} else {
							__.selection.setCaretPosition(caretNode.firstChild, caretIndex);
						}
					} else {
						n=__.selection.getNodes(index, function(n) { return (n.nodeName==="#text" || ("firstChild" in n && n.firstChild===null)); });
						var alreadyChecked=[];
						for (var i=0; i<n.length; i++) {
							var node=n[i];
							while (!("style" in node && node.style.display==="block") && ("tagName" in node?node.tagName.toLowerCase()!=="div":true)) {
								node=node.parentNode;
							}
							if (alreadyChecked.indexOf(node)==-1) {
								node.style[cssParam]=value;
								alreadyChecked.push(node);
							}
						}
						__.selection.setRange(saved.startNode, saved.startOffset, saved.endNode, saved.endOffset);
					}
					return value;
				}
			};
			__.selection.setEncapsulation=function(tagName, editablecontainer, index, attributes, optionnalTextToSelIfSelLengthNull) {
				var i, j, k, l, p, m1, m2, m3, n1, n2, n3, c1, c2, c3, styles, ignoreNodes=0, toBeSplit, isStartSplitted, isEndSplitted, caretNode=false, caretIndex, clone, nodes=[], parents=[], grandParentAttributes, toSplitOrReplace, tagsToDeleteAtEnd=[];
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				if (typeof(optionnalTextToSelIfSelLengthNull)!=="string") {
					optionnalTextToSelIfSelLengthNull="";
				}
				var container=__.selection.commonAncestorContainer(index), i;
				if (typeof(editablecontainer)!=="undefined" && editablecontainer!==null) {
					while (container!=editablecontainer && container.tagName.toLowerCase()!="html") {
						container=container.parentNode;
					}
				}
				if (!__.isObject(attributes)) {
					attributes={};
				}
				if (container.tagName.toLowerCase()!="html") {
					var c=container.parentNode;
					var n=__.selection.getNodes(index, function(n) { return n.nodeName==="#text"; });
					__.selection.saved=__.selection.saveSelectionContainerIndexes();
					var saved=__.selection.saved[index];
					var startC=__.selection.main.ranges[index].startContainer;
					var endC=__.selection.main.ranges[index].endContainer;
					if (startC.nodeName=="#text") {
						startC=startC.parentNode;
					}
					if (endC.nodeName=="#text") {
						endC=endC.parentNode;
					}
					i=0;
					var nodeIndexes=[];
					for (i=0; i<n.length; i++) {
						nodeIndexes[i]=lib([n[i].nodeName==="#text"?n[i].parentNode:n[i]]).getIndexOfNodes()[0];
					}
					for (i=0; i<n.length; i++) {
						before="";
						after="";
						previousSiblings=[];
						nextSiblings=[];
						if (n[i].nodeName==="#text" && (((saved.startNode===n[i] || n[i].startNode) && saved.startOffset>0 && saved.startOffset<n[i].textContent.length) || ((saved.endNode===n[i] || n[i].endNode) && saved.endOffset>0 && saved.endOffset<n[i].textContent.length))) {
							toBeSplit=true;
							isStartSplitted=((saved.startNode===n[i] || n[i].startNode) && saved.startOffset>0);
							isEndSplitted=((saved.endNode===n[i] || n[i].endNode) && saved.endOffset<n[i].textContent.length);
						} else {
							toBeSplit=false;
							isStartSplitted=false;
							isEndSplitted=false;
						}
						styles={};
						for (p in n[i].parentNode.style) {
							styles[p]=n[i].parentNode.style[p];
						}
						if (toBeSplit) {
							if (isStartSplitted && isEndSplitted) {
								c1=n[i].textContent.substring(0, saved.startOffset);
								c2=n[i].textContent.substring(saved.startOffset, saved.endOffset);
								c3=n[i].textContent.substring(saved.endOffset);
								n1=__.d.createElement("span");
								n2=__.d.createElement("span");
								n3=__.d.createElement("span");
								lib([n1]).addClass("createdFromLib");
								lib([n2]).addClass("createdFromLib");
								lib([n3]).addClass("createdFromLib");
							} else if (isStartSplitted) {
								c1=n[i].textContent.substring(0, saved.startOffset);
								c2=n[i].textContent.substring(saved.startOffset);
								n1=__.d.createElement("span");
								n2=__.d.createElement("span");
								n3=null;
								lib([n1]).addClass("createdFromLib");
								lib([n2]).addClass("createdFromLib");
							} else if (isEndSplitted) {
								c2=n[i].textContent.substring(0, saved.endOffset);
								c3=n[i].textContent.substring(saved.endOffset);
								n1=null;
								n2=__.d.createElement("span");
								n3=__.d.createElement("span");
								lib([n2]).addClass("createdFromLib");
								lib([n3]).addClass("createdFromLib");
							}
						
						} else if (n[i].nodeName==="#text" && !(n[i]===saved.startNode && n[i]===saved.endNode && saved.startOffset===saved.endOffset) && !(n[i]===saved.startNode && saved.startOffset===n[i].textContent.length)) {
							c2=n[i].textContent+optionnalTextToSelIfSelLengthNull;
							n1=null;
							n2=__.d.createElement("span");
							n3=null;
							lib([n2]).addClass("createdFromLib");
						} else if (n[i].nodeName==="#text") {
							c1=n[i].textContent;
							c2=optionnalTextToSelIfSelLengthNull;
							n1=__.d.createElement("span");
							n2=__.d.createElement("span");
							n3=null;
							lib([n1]).addClass("createdFromLib");
							lib([n2]).addClass("createdFromLib");
						} else {
							c2=optionnalTextToSelIfSelLengthNull;
							n1=null;
							n2=n[i].cloneNode(true);
							n3=null;
						}
						if (((n[i].nodeName==="#text" && ["span","a","h1","h2","h3","h4","h5","h6"].indexOf(n[i].parentNode.parentNode.tagName.toLowerCase())!==-1) || (n[i].nodeName!=="#text" && n[i].tagName.toLowerCase()==="img" && ["span","a","h1","h2","h3","h4","h5","h6"].indexOf(n[i].parentNode.tagName.toLowerCase())!==-1)) && !("appendToNode" in n[i])) {
							toSplitOrReplace=n[i].nodeName==="#text"?n[i].parentNode.parentNode:n[i].parentNode;
							m1=toSplitOrReplace.cloneNode(false);
							m2=__.d.createElement(tagName);
							m3=toSplitOrReplace.cloneNode(false);
							lib([m1]).addClass("createdFromLib");
							lib([m2]).addClass("createdFromLib");
							lib([m3]).addClass("createdFromLib");
							for (p in attributes) {
								if (p.toLowerCase()==="classname") {
									p="class";
									attributes[p]=attributes.className;
								}
								lib([m2]).targets[0].setAttribute(p, attributes[p]);
							}
							for (j=0; j<toSplitOrReplace.childNodes.length; j++) {
								if (toSplitOrReplace.childNodes[j].firstChild!==n[i] && toSplitOrReplace.childNodes[j]!==n[i]) {
									if (toSplitOrReplace.childNodes[j].firstChild!==null && n.indexOf(toSplitOrReplace.childNodes[j].firstChild)!==-1) {
										clone=toSplitOrReplace.cloneNode(true);
										if (toSplitOrReplace.childNodes[j].firstChild===saved.startNode && toSplitOrReplace.childNodes[j].firstChild===saved.endNode && saved.startOffset===saved.endOffset) {
											clone.childNodes[j].firstChild.caretNode=true;
											clone.childNodes[j].firstChild.caretIndex=0;
										} else {
											if (toSplitOrReplace.childNodes[j].firstChild===saved.startNode) {
												clone.childNodes[j].firstChild.startNode=true;
											}
											if (toSplitOrReplace.childNodes[j].firstChild===saved.endNode) {
												clone.childNodes[j].firstChild.endNode=true;
											}
										}
										clone.childNodes[j].firstChild.appendToNode=m2;
										n[n.indexOf(toSplitOrReplace.childNodes[j].firstChild)]=clone.childNodes[j].firstChild;
									} else if (toSplitOrReplace.childNodes[j].nodeName!=="#text" && toSplitOrReplace.childNodes[j].tagName.toLowerCase()==="img" && n.indexOf(toSplitOrReplace.childNodes[j])!==-1) {
										clone=toSplitOrReplace.cloneNode(true);
										if (toSplitOrReplace.childNodes[j]===saved.startNode && toSplitOrReplace.childNodes[j]===saved.endNode && saved.startOffset===saved.endOffset) {
											clone.childNodes[j].caretNode=true;
											clone.childNodes[j].caretIndex=0;
										} else {
											if (toSplitOrReplace.childNodes[j]===saved.startNode) {
												clone.childNodes[j].startNode=true;
											} else if (toSplitOrReplace===saved.startNode && saved.startOffset===j) {
												clone.childNodes[j].parentIsStartNode=true;
											}
											if (toSplitOrReplace.childNodes[j]===saved.endNode) {
												clone.childNodes[j].endNode=true;
											} else if (toSplitOrReplace===saved.endNode && saved.endOffset===j+1) {
												clone.childNodes[j].parentIsEndNode=true;
											}
										}
										clone.childNodes[j].appendToNode=m2;
										n[n.indexOf(toSplitOrReplace.childNodes[j])]=clone.childNodes[j];
									} else if (toSplitOrReplace.childNodes[j].firstChild!==null && n.indexOf(toSplitOrReplace.childNodes[j].firstChild)===-1 && j<nodeIndexes[i]) {
										clone=toSplitOrReplace.childNodes[j].cloneNode(true);
										if (toSplitOrReplace.childNodes[j].firstChild===saved.startNode && toSplitOrReplace.childNodes[j].firstChild===saved.endNode && saved.startOffset===saved.endOffset) {
											clone.firstChild.caretNode=true;
											clone.firstChild.caretIndex=0;
										} else {
											if (toSplitOrReplace.childNodes[j].firstChild===saved.startNode) {
												clone.childNodes[j].firstChild.startNode=true;
											}
											if (toSplitOrReplace.childNodes[j].firstChild===saved.endNode) {
												clone.childNodes[j].firstChild.endNode=true;
											}
										}
										previousSiblings.push(clone);
									} else if (toSplitOrReplace.childNodes[j].firstChild!==null && n.indexOf(toSplitOrReplace.childNodes[j].firstChild)===-1 && j>nodeIndexes[i]) {
										clone=toSplitOrReplace.childNodes[j].cloneNode(true);
										if (toSplitOrReplace.childNodes[j].firstChild===saved.startNode && toSplitOrReplace.childNodes[j].firstChild===saved.endNode && saved.startOffset===saved.endOffset) {
											clone.firstChild.caretNode=true;
											clone.firstChild.caretIndex=0;
										} else {
											if (toSplitOrReplace.childNodes[j].firstChild===saved.startNode) {
												clone.firstChild.startNode=true;
											}
											if (toSplitOrReplace.childNodes[j].firstChild===saved.endNode) {
												clone.firstChild.endNode=true;
											}
										}
										nextSiblings.push(clone);
									} else if (toSplitOrReplace.childNodes[j]!==null && n.indexOf(toSplitOrReplace.childNodes[j])===-1 && j<nodeIndexes[i]) {
										clone=toSplitOrReplace.childNodes[j].cloneNode(true);
										if (toSplitOrReplace.childNodes[j]===saved.startNode && toSplitOrReplace.childNodes[j]===saved.endNode && saved.startOffset===saved.endOffset) {
											clone.caretNode=true;
											clone.caretIndex=0;
										} else {
											if (toSplitOrReplace.childNodes[j]===saved.startNode) {
												clone.startNode=true;
											} else if (toSplitOrReplace===saved.startNode && saved.startOffset===j) {
												clone.parentIsStartNode=true;
											}
											if (toSplitOrReplace.childNodes[j]===saved.endNode) {
												clone.endNode=true;
											} else if (toSplitOrReplace===saved.endNode && saved.endOffset===j+1) {
												clone.parentIsEndNode=true;
											}
										}
										previousSiblings.push(clone);
									} else if (toSplitOrReplace.childNodes[j]!==null && n.indexOf(toSplitOrReplace.childNodes[j])===-1 && j>nodeIndexes[i]) {
										clone=toSplitOrReplace.childNodes[j].cloneNode(true);
										if (toSplitOrReplace.childNodes[j]===saved.startNode && toSplitOrReplace.childNodes[j]===saved.endNode && saved.startOffset===saved.endOffset) {
											clone.caretNode=true;
											clone.caretIndex=0;
										} else {
											if (toSplitOrReplace.childNodes[j]===saved.startNode) {
												clone.startNode=true;
											} else if (toSplitOrReplace===saved.startNode && saved.startOffset===j) {
												clone.parentIsStartNode=true;
											}
											if (toSplitOrReplace.childNodes[j]===saved.endNode) {
												clone.endNode=true;
											} else if (toSplitOrReplace===saved.endNode && saved.endOffset===j+1) {
												clone.parentIsEndNode=true;
											}
										}
										nextSiblings.push(clone);
									}
								}
							}
						} else if (((n[i].nodeName==="#text" && ["span","a","h1","h2","h3","h4","h5","h6"].indexOf(n[i].parentNode.parentNode.tagName.toLowerCase())!==-1) || (n[i].nodeName!=="#text" && n[i].tagName.toLowerCase()==="img" && ["span","a","h1","h2","h3","h4","h5","h6"].indexOf(n[i].parentNode.tagName.toLowerCase())!==-1)) && ("appendToNode" in n[i])) {
							toSplitOrReplace=!1;
							m1=__.d.createElement(n[i].nodeName==="#text"?n[i].parentNode.parentNode.tagName.toLowerCase():n[i].parentNode.tagName.toLowerCase());
							m2=n[i].appendToNode;
							m3=__.d.createElement(n[i].nodeName==="#text"?n[i].parentNode.parentNode.tagName.toLowerCase():n[i].parentNode.tagName.toLowerCase());
							lib([m1]).addClass("createdFromLib");
							lib([m2]).addClass("createdFromLib");
							lib([m3]).addClass("createdFromLib");
							for (p in attributes) {
								if (p.toLowerCase()==="classname") {
									p="class";
									attributes[p]=attributes.className;
								}
								lib([m2]).targets[0].setAttribute(p, attributes[p]);
							}
						} else if (n[i].parentNode.tagName.toLowerCase()==="span" && !("appendToNode" in n[i])) {
							toSplitOrReplace=n[i].parentNode;
							m1=null;
							m2=__.d.createElement(tagName);
							m3=null;
							lib([m2]).addClass("createdFromLib");
							for (p in attributes) {
								if (p.toLowerCase()==="classname") {
									p="class";
									attributes[p]=attributes.className;
								}
								lib([m2]).targets[0].setAttribute(p, attributes[p]);
							}
							for (j=i+1; j<n.length; j++) {
								if (n[j].parentNode===toSplitOrReplace) {
									clone=n[j].cloneNode(true);
									if (n[j]===saved.endNode) {
										saved.endNode=clone;
									} else if (toSplitOrReplace===saved.endNode && j+1===saved.endOffset) {
										saved.endNode=m2;
									}
									n[j]=clone;
									n[j].appendToNode=m2;
								}
							}
						} else if (n[i].parentNode.tagName.toLowerCase()==="span" && ("appendToNode" in n[i])) {
							toSplitOrReplace=!1;
							m1=__.d.createElement("span");
							m2=n[i].appendToNode;
							m3=__.d.createElement("span");
							lib([m1]).addClass("createdFromLib");
							lib([m2]).addClass("createdFromLib");
							lib([m3]).addClass("createdFromLib");
							for (p in attributes) {
								if (p.toLowerCase()==="classname") {
									p="class";
									attributes[p]=attributes.className;
								}
								lib([m2]).targets[0].setAttribute(p, attributes[p]);
							}
						} else if (!("appendToNode" in n[i])) {
							toSplitOrReplace=n[i];
							m1=null;
							m2=__.d.createElement(tagName);
							m3=null;
							lib([m2]).addClass("createdFromLib");
							for (p in attributes) {
								if (p.toLowerCase()==="classname") {
									p="class";
									attributes[p]=attributes.className;
								}
								lib([m2]).targets[0].setAttribute(p, attributes[p]);
							}
						} else {
							toSplitOrReplace=!1;
							m1=null;
							m2=n[i].appendToNode;
							m3=null;
							lib([m2]).addClass("createdFromLib");
							for (p in attributes) {
								if (p.toLowerCase()==="classname") {
									p="class";
									attributes[p]=attributes.className;
								}
								lib([m2]).targets[0].setAttribute(p, attributes[p]);
							}
						}
						if (!!toSplitOrReplace) {
							if (n2.tagName.toLowerCase()==="span") {
								if (typeof(c2)==="undefined" || c2.length===0) {
									c2="&#8203;";
									n2.innerHTML=c2;
								} else {
									n2.textContent=c2;
								}
								for (p in styles) {
									n2.style[p]=styles[p];
								}
								if (n[i]===saved.startNode && n[i]===saved.endNode && saved.startOffset===saved.endOffset) {
									caretNode=n2;
									caretIndex=0;
								} else {
									if (n[i]===saved.startNode) {
										saved.startNode=n2.firstChild;
										saved.startParent=n2;
										saved.startOffset=0;
									}
									if (n[i]===saved.endNode) {
										saved.endNode=n2.firstChild;
										saved.endParent=n2;
										saved.endOffset=c2.length;
									}
								}
								m2.appendChild(n2);
								toSplitOrReplace.parentNode.replaceChild(m2, toSplitOrReplace);
							} else {
								m2.appendChild(n2);
								if (toSplitOrReplace===saved.startNode && toSplitOrReplace===saved.endNode && saved.startOffset===saved.endOffset) {
									caretNode=m2.parentNode;
									caretIndex=0;
								} else {
									if (toSplitOrReplace===saved.startNode) {
										saved.startNode=m2;
										saved.startParent=toSplitOrReplace.parentNode;
										saved.startOffset=__.getIndexOfNodes([n2])[0];
									}
									if (toSplitOrReplace===saved.endNode) {
										saved.endNode=m2;
										saved.endParent=toSplitOrReplace.parentNode;
										saved.endOffset=__.getIndexOfNodes([n2])[0]+1;
									}
								}
								toSplitOrReplace.parentNode.replaceChild(m2, toSplitOrReplace);
							}
						} else {
							if (n2.tagName.toLowerCase()==="span") {
								if (typeof(c2)==="undefined" || c2.length===0) {
									c2="&#8203;";
									n2.innerHTML=c2;
								} else {
									n2.innerHTML=c2;
								}
								for (p in styles) {
									n2.style[p]=styles[p];
								}
							}
							m2.appendChild(n2);
							if (n[i].caretNode) {
								caretNode=n2.tagName.toLowerCase()==="span"?n2:m2.parentNode;
								caretIndex=n2.tagName.toLowerCase()==="span"?n[i].caretIndex:__.getIndexOfNodes([n2])[0];
							} else {
								if (n[i].startNode || n[i].parentIsStartNode) {
									saved.startNode=n2.tagName.toLowerCase()==="span"?n2.firstChild:m2;
									saved.startParent=n2.tagName.toLowerCase()==="span"?n2:m2.parentNode;
									saved.startOffset=n2.tagName.toLowerCase()==="span"?0:__.getIndexOfNodes([n2])[0];
								}
								if (n[i].endNode || n[i].parentIsStartNode) {
									saved.endNode=n2.tagName.toLowerCase()==="span"?n2.firstChild:m2;
									saved.endParent=n2.tagName.toLowerCase()==="span"?n2:m2.parentNode;
									saved.endOffset=n2.tagName.toLowerCase()==="span"?c2.length:__.getIndexOfNodes([n2])[0]+1;
								}
							}
						}
						if (n1!==null) {
							n1.innerHTML=c1;
							for (p in styles) {
								n1.style[p]=styles[p];
							}
							if (m1!==null) {
								if (m1.parentNode===null) {
									m2.parentNode.insertBefore(m1, m2);
								}
								m1.appendChild(n1);
							} else {
								m2.parentNode.insertBefore(n1, m2);
							}
						}
						if (n3!==null) {
							n3.innerHTML=c3;
							for (p in styles) {
								n3.style[p]=styles[p];
							}
							if (m3!==null) {
								if (m3.parentNode===null) {
									if (m2.nextSibling===null) {
										m2.parentNode.appendChild(m3);
									} else {
										m2.parentNode.insertBefore(m3, m2.nextSibling);
									}
								}
								m3.appendChild(n3);
							} else {
								if (m2.nextSibling===null) {
									m2.parentNode.appendChild(n3);
								} else {
									m2.parentNode.insertBefore(n3, m2.nextSibling);
								}
							}
						}
						if (previousSiblings.length>0) {
							m2.parentNode.insertBefore(m1, m2);
							while (previousSiblings.length>0) {
								ins=m1.appendChild(previousSiblings[0]);
								if (previousSiblings[0].caretNode) {
									caretNode=ins;
									caretIndex=previousSiblings[0].caretIndex;
								} else {
									if (previousSiblings[0].startNode) {
										saved.startNode=ins;
										saved.startParent=m1;
									} else if (previousSiblings[0].parentIsStartNode) {
										saved.startNode=m1;
										saved.startParent=m1.parentNode;
										saved.startOffset=lib([ins]).getIndexOfNodes()[0];
									}
									if (previousSiblings[0].endNode) {
										saved.endNode=ins;
										saved.endParent=m1;
									} else if (previousSiblings[0].parentIsEndNode) {
										saved.endNode=m1;
										saved.endParent=m1.parentNode;
										saved.endOffset=lib([ins]).getIndexOfNodes()[0]+1;
									}
									if (previousSiblings[0].firstChild.startNode) {
										saved.startNode=ins.firstChild;
										saved.startParent=ins;
									}
									if (previousSiblings[0].firstChild.endNode) {
										saved.endNode=ins.firstChild;
										saved.endParent=ins;
									}
								}
								previousSiblings.splice(0,1);
							}
						}
						if (nextSiblings.length>0) {
							if (m2.nextSibling===null) {
								m2.parentNode.appendChild(m3);
							} else {
								m2.parentNode.insertBefore(m3, m2.nextSibling);
							}
							while (nextSiblings.length>0) {
								ins=m3.appendChild(nextSiblings[0]);
								if (nextSiblings[0].caretNode) {
									caretNode=ins;
									caretIndex=nextSiblings[0].caretIndex;
								} else {
									if (nextSiblings[0].startNode) {
										saved.startNode=ins;
										saved.startParent=m1;
									} else if (nextSiblings[0].parentIsStartNode) {
										saved.startNode=m3;
										saved.startParent=m3.parentNode;
										saved.startOffset=lib([ins]).getIndexOfNodes()[0];
									}
									if (nextSiblings[0].endNode) {
										saved.endNode=ins;
										saved.endParent=m1;
									} else if (nextSiblings[0].parentIsEndNode) {
										saved.endNode=m3;
										saved.endParent=m3.parentNode;
										saved.endOffset=lib([ins]).getIndexOfNodes()[0]+1;
									}
									if (nextSiblings[0].firstChild.startNode) {
										saved.startNode=ins.firstChild;
										saved.startParent=ins;
									}
									if (nextSiblings[0].firstChild.endNode) {
										saved.endNode=ins.firstChild;
										saved.endParent=ins;
									}
								}
								nextSiblings.splice(0,1);
							}
						}
						if (n1!==null) {
							if (n1.previousSibling!==null) {
								nodes.push(n1.previousSibling);
							}
							nodes.push(n1);
						} else if (n2.previousSibling!==null) {
							nodes.push(n2.previousSibling);
						}
						nodes.push(n2);
						parents.push(m2);
						if (n3!==null) {
							nodes.push(n3);
							if (n3.nextSibling!==null) {
								nodes.push(n3.nextSibling);
							}
						} else if (n2.nextSibling!==null) {
							nodes.push(n2.nextSibling);
						}
						if (m2.tagName.toLowerCase()==="span" && tagsToDeleteAtEnd.indexOf(m2)===-1) {
							tagsToDeleteAtEnd.push(m2);
						}
					}
					if (parents[0].previousSibling!==null) {
						parents.splice(0, 0, parents[0].previousSibling);
					}
					if (parents[parents.length-1].nextSibling!==null) {
						parents.push(parents[parents.length-1].nextSibling);
					}
					while (tagsToDeleteAtEnd.length>0) {
						while (tagsToDeleteAtEnd[0].childNodes.length>0) {
							clone=tagsToDeleteAtEnd[0].childNodes[0].cloneNode(true);
							if (tagsToDeleteAtEnd[0].childNodes[0]===saved.startNode && tagsToDeleteAtEnd[0].childNodes[0]===saved.endNode && saved.startOffset===saved.endOffset) {
								caretNode=clone;
							} else if (tagsToDeleteAtEnd[0].childNodes[0].firstChild===saved.startNode && tagsToDeleteAtEnd[0].childNodes[0].firstChild===saved.endNode && saved.startOffset===saved.endOffset) {
								caretNode=clone.firstChild;
							} else {
								if (tagsToDeleteAtEnd[0].childNodes[0]===saved.startParent) {
									saved.startNode=clone.firstChild;
									saved.startParent=clone;
								} else if (tagsToDeleteAtEnd[0].childNodes[0]===saved.startNode) {
									saved.startNode=clone;
									saved.startParent=tagsToDeleteAtEnd[0].parentNode;
								}
								if (tagsToDeleteAtEnd[0].childNodes[0]===saved.endParent) {
									saved.endNode=clone.firstChild;
									saved.endParent=clone;
								} else if (tagsToDeleteAtEnd[0].childNodes[0]===saved.endNode) {
									saved.endNode=clone;
									saved.endParent=tagsToDeleteAtEnd[0].parentNode;
								}
							}
							tagsToDeleteAtEnd[0].parentNode.insertBefore(clone, tagsToDeleteAtEnd[0]);
							tagsToDeleteAtEnd[0].removeChild(tagsToDeleteAtEnd[0].childNodes[0]);
						}
						tagsToDeleteAtEnd[0].parentNode.removeChild(tagsToDeleteAtEnd[0]);
						tagsToDeleteAtEnd.splice(0, 1);
					}
					for (i=0; i<parents.length; i++) {
						if (parents[i].nextSibling!==null && typeof(parents[i].tagName)!=="undefined" && typeof(parents[i].nextSibling.tagName)!=="undefined" && parents[i].tagName.toLowerCase()===parents[i].nextSibling.tagName.toLowerCase()) {
							l=0;
							if (parents[i].nextSibling===saved.startNode) {
								saved.startNode=parents[i];
								saved.startOffset+=parents[i].childNodes.length;
							}
							if (parents[i].nextSibling===saved.endNode) {
								saved.endNode=parents[i];
								saved.endOffset+=parents[i].childNodes.length;
							}
							while (parents[i].nextSibling.childNodes.length>0) {
								if (parents[i].nextSibling.childNodes[0].nodeName!=="#text") {
									clone=parents[i].nextSibling.childNodes[0].cloneNode(true);
									if (nodes.indexOf(parents[i].nextSibling.childNodes[0])!==-1) {
										nodes[nodes.indexOf(parents[i].nextSibling.childNodes[0])]=clone;
									}
									if (parents[i].nextSibling.childNodes[0]===saved.startNode) {
										saved.startNode=clone;
									} else if (parents[i].nextSibling.childNodes[0].firstChild===saved.startNode) {
										saved.startNode=clone.firstChild;
									}
									if (parents[i].nextSibling.childNodes[0]===saved.endNode) {
										saved.endNode=clone;
									} else if (parents[i].nextSibling.childNodes[0].firstChild===saved.endNode) {
										saved.endNode=clone.firstChild;
									}
									parents[i].appendChild(clone);
								} else if (parents[i].lastChild.nodeName==="#text") {
									l=parents[i].lastChild.textContent.length;
									if (nodes.indexOf(parents[i].nextSibling.childNodes[0])!==-1) {
										nodes.splice(nodes.indexOf(parents[i].nextSibling.childNodes[0]), 1);
									}
									if (parents[i].nextSibling.childNodes[0]===saved.startNode) {
										saved.startNode=parents[i].lastChild;
										saved.startOffset+=l;
									}
									if (parents[i].nextSibling.childNodes[0]===saved.endNode) {
										saved.endNode=parents[i].lastChild;
										saved.endOffset+=l;
									}
									parents[i].lastChild.textContent=parents[i].lastChild.textContent+parents[i].nextSibling.childNodes[0].textContent;
								}
								parents[i].nextSibling.removeChild(parents[i].nextSibling.childNodes[0]);
							}
							if (parents[i+1]===parents[i].nextSibling) {
								parents[i+1]=parents[i];
							}
							parents[i].nextSibling.parentNode.removeChild(parents[i].nextSibling);
						}
					}
					for (i=0; i<nodes.length; i++) {
						if (nodes[i].nextSibling!==null && "tagName" in nodes[i] && "tagName" in nodes[i].nextSibling && nodes[i].tagName.toLowerCase()===nodes[i].nextSibling.tagName.toLowerCase()) {
							styles={};
							k=0;
							for (p in nodes[i].style) {
								if (["font-weight","font-style","text-decoration"].indexOf(p)!==-1 && /^normal|none$/.test(nodes[i].style[p])) {
									styles[p]="";
								} else {
									styles[p]=nodes[i].style[p];
								}
							}
							for (p in nodes[i].nextSibling.style) {
								if (["font-weight","font-style","text-decoration"].indexOf(p)!==-1 && /^normal|none$/.test(nodes[i].nextSibling.style[p])) {
									k+=(""===styles[p]?0:1);
								} else {
									k+=(nodes[i].nextSibling.style[p]===styles[p]?0:1);
								}
							}
							if (k===0 && !/[\.,;\:\!\?\:\(\)\{\}\[\]\_-\–\—]/.test(nodes[i].firstChild.textContent.substring(0, nodes[i].firstChild.textContent.length-1))) {
								l=nodes[i].textContent.length;
								nodes[i].firstChild.textContent=nodes[i].firstChild.textContent+nodes[i].nextSibling.firstChild.textContent;
								if (nodes[i].nextSibling===caretNode) {
									caretNode=nodes[i];
									caretIndex+=l;
								} else {
									if (nodes[i].nextSibling.firstChild===saved.startNode) {
										saved.startNode=nodes[i].firstChild;
										saved.startParent=nodes[i];
										saved.startOffset+=l;
									}
									if (nodes[i].nextSibling.firstChild===saved.endNode) {
										saved.endNode=nodes[i].firstChild;
										saved.endParent=nodes[i];
										saved.endOffset+=l;
									}
								}
								if (nodes[i+1]===nodes[i].nextSibling) {
									nodes[i+1]=nodes[i];
								}
								nodes[i].nextSibling.parentNode.removeChild(nodes[i].nextSibling);
							}
						}
					}
					if (!caretNode) {
						__.selection.setRange(saved.startNode, saved.startOffset, saved.endNode, saved.endOffset);
					} else {
						__.selection.setCaretPosition(caretNode, caretIndex);
					}
				}
			};
			__.selection.setString=function(string, editablecontainer, index) {
				var i, j, k, l, c, o, p, styles;
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				var container=__.selection.commonAncestorContainer(index), i;
				if (typeof(editablecontainer)!=="undefined") {
					while (container!=editablecontainer && container.tagName.toLowerCase()!="html") {
						container=container.parentNode;
					}
				}
				if (container.tagName.toLowerCase()!="html") {
					var n=__.selection.getNodes(index, function(n) { return n.nodeName==="#text"; });
					var saved=__.selection.saved[index];
					var startC=__.selection.main.ranges[index].startContainer;
					var endC=__.selection.main.ranges[index].endContainer;
					var nodes=[], node, nN, uN, caretNode;
					if (startC.nodeName=="#text") {
						startC=startC.parentNode;
					}
					if (endC.nodeName=="#text") {
						endC=endC.parentNode;
					}
					for (i=0; i<n.length; i++) {
						node=n[i];
						if (node.nodeName.toLowerCase()==="br" && n.length===1) {
							node=node.parentNode;
							node.innerHTML=string;
							caretNode=node;
						} else {
							if (i===0 && i===n.length-1) {
								node.textContent=node.textContent.substring(0, saved.startOffset)+string+node.textContent.substring(saved.endOffset);
								nodes.push(node);
								caretNode=node;
							} else if (i===0) {
								node.textContent=node.textContent.substring(0, saved.startOffset)+string;
								nodes.push(node);
								caretNode=node;
							} else if (i<n.length-1) {
								nN=node.parentNode;
								node.parentNode.removeChild(node);
								while (nN.childNodes.length===0) {
									uN=nN.parentNode;
									nN.parentNode.removeChild(nN);
									nN=uN;
								}
							} else {
								node.textContent=node.textContent.substring(saved.endOffset);
								nodes.push(node); 
							}
						}
					}
					__.selection.setCaretPosition(caretNode, saved.startOffset+1);
				}
			};
			__.selection.setHtml=function(html, editablecontainer, index) {
				var i, j, k, l, c, o, p, styles;
				if (isNaN(index) || index%1>0) {
					index=0;
				}
				var container=__.selection.commonAncestorContainer(index), i;
				if (typeof(editablecontainer)!=="undefined") {
					while (container!=editablecontainer && container.tagName.toLowerCase()!="html") {
						container=container.parentNode;
					}
				}
				if (container.tagName.toLowerCase()!="html") {
					var n=__.selection.getNodes(index);
					var saved=__.selection.saved[index];
					var startC=__.selection.main.ranges[index].startContainer;
					var endC=__.selection.main.ranges[index].endContainer;
					var nodes=[], node, nN, uN, caretNode;
					if (startC.nodeName=="#text") {
						startC=startC.parentNode;
					}
					if (endC.nodeName=="#text") {
						endC=endC.parentNode;
					}
					for (i=0; i<n.length; i++) {
						node=n[i];
						if (i===0 && i===n.length-1) {
							node.parentNode.innerHTML=node.textContent.substring(0, saved.startOffset)+html+node.textContent.substring(saved.endOffset);
							nodes.push(node.parentNode);
						} else if (i===0) {
							node.parentNode.innerHTML=node.textContent.substring(0, saved.startOffset)+html;
							nodes.push(node.parentNode);
						} else if (i<n.length-1) {
							nN=node.parentNode;
							node.parentNode.removeChild(node);
							while (nN.childNodes.length===0) {
								uN=nN.parentNode;
								nN.parentNode.removeChild(nN);
								nN=uN;
							}
						} else {
							node.textContent=node.textContent.substring(saved.endOffset);
							nodes.push(node); 
						}
					}
				}
			};
			__.selection.main=__.selection.getTextSelection();
			__.selection.saved=__.selection.saveSelectionContainerIndexes();
			return __.selection;
		},
		getNodesContainingTextNodesAndTextContent:function(elements, currentIndexes) {
			var i,j,cI,n,nodes=[];
			for (i=0; i<elements.length; i++) {
				if (currentIndexes==="") {
					currentIndexes=i.toString();
				}
				if ("childNodes" in elements[i]) {
					for (j=0; j<elements[i].childNodes.length; j++) {
						if (elements[i].childNodes[j].nodeName=="#text") {
							if (!(currentIndexes in nodes)) {
								nodes[currentIndexes]=[];
								nodes[currentIndexes]["textContent"]="";
							}
							nodes[currentIndexes]["node"]=elements[i];
							nodes[currentIndexes]["textContent"]+=elements[i].childNodes[j].textContent;
						} else {
							n=__.getNodesContainingTextNodesAndTextContent([elements[i].childNodes[j]], (currentIndexes!==""?currentIndexes+" ":"")+j.toString());
							nodes=__.concatArraysWithStringKeys([nodes, n]);
						}
					}
				}
			}
			return nodes;
		},
		htmlEntityDecode:function(str) {
			var id=Math.random().toString().substring(2);
			lib("body").createNode("textarea", { id:"lib_temp_container_"+id, style:"display:none;" }, str);
			var ret=lib("#lib_temp_container_"+id).targets[0].value;
			lib("#lib_temp_container_"+id).remove();
			return ret;
		},
		substrWithHtmlEntities:function(str, searchIndex, searchLength) {
			if (typeof(str)==="string") {
				if (typeof(searchLength)==="undefined") {
					searchLength=__.htmlEntityDecode(str).length;
				}
				if (!isNaN(searchIndex)) {
					searchIndex=searchIndex|0;
					var index=0, length=0, s=-1, e=-1, i=0, l, reg=/^&([a-z]{2,}|#[0-9]+|#x[0-9a-f]{5});/i;
					while (i<str.length) {
						if (reg.test(str.substring(i))) {
							l=reg.exec(str.substring(i))[0].length;
							length=l;
							i+=l;
							index++;
						} else {
							length=1;
							i++;
							index++;
						}
						if (index===searchIndex) {
							s=i;
						}
						if (index===searchIndex+searchLength) {
							e=i+length;
						}
					}
					if (s===-1 && searchIndex>0) {
						s=searchLength;
					}
					if (e===-1 && searchLength>0) {
						e=searchLength;
					}
					return str.substring(s, s+e);
				} else {
					__.error("argument searchIndex to substrWithHtmlEntities is not a number");
					return str;
				}
			} else {
				__.error("argument str to substrWithHtmlEntities is not a string");
				return str;
			}
		},
		unQuoteOrTranstype:function(obj) {
			if (typeof(obj)=="string") {
				var str=obj;
				if (/"|'/.test(str)) {
					if (/^\s*\"/.test(str) && /\"\s*$/.test(str)) {
						str=str.replace(/^\s*\"/, "").replace(/\"\s*$/, "");
					}
					if (/^\s*\'/.test(str) && /\'\s*$/.test(str)) {
						str=str.replace(/^\s*\'/, "").replace(/\'\s*$/, "");
					}
					return __.stripSlashes(str);
				} else if (/^\s*(false|true|null)\s*$/.test(str)) {
					return eval(/^\s*(false|true|null)\s*$/.exec(str)[1]);
				} else if (/\.[0-9]+/.test(str)) {
					return parseFloat(str);
				} else if (/[0-9]+/.test(str)) {
					return parseInt(str,10);
				} else {
					return str;
				}
			} else {
				return obj;
			}
		},
		hasNotNumericKeys:function(obj) {
			if (__.isArray(obj) || __.isObject(obj)) {
				for (var p in obj) {
					if (parseInt(p,10).toString()===p || (!isNaN(p) && p|0===p)) {
						continue;
					} else {
						return true;
					}
				}
				return false;
			}
		},
		json:{
			parse:function(source, reviver) { //function from the creator of JSON Douglas Crockford added to the library for old browsers not implementing it
				"use strict";
				// This is a function that can parse a JSON text, producing a JavaScript
				// data structure. It is a simple, recursive descent parser. It does not use
				// eval or regular expressions, so it can be used as a model for implementing
				// a JSON parser in other languages.

				// We are defining the function inside of another function to avoid creating
				// global variables.
				var at,	 // The index of the current character
					ch,	 // The current character
					escapee = {
						'"': '"',
						'\\': '\\',
						'/': '/',
						b: '\b',
						f: '\f',
						n: '\n',
						r: '\r',
						t: '\t'
					},
					text,
					error = function(m) { // Call error when something is wrong.
						throw {
							name: 'SyntaxError',
							message: m,
							at: at,
							text: text
						};
					},
					next = function(c) { // If a c parameter is provided, verify that it matches the current character.
						if (c && c !== ch) {
							error("Expected '" + c + "' instead of '" + ch + "'");
						}
						// Get the next character. When there are no more characters,
						// return the empty string.
						ch = text.charAt(at);
						at += 1;
						return ch;
					},
					number = function() { // Parse a number value.
						var number,
							string = '';
						if (ch === '-') {
							string = '-';
							next('-');
						}
						while (ch >= '0' && ch <= '9') {
							string += ch;
							next();
						}
						if (ch === '.') {
							string += '.';
							while (next() && ch >= '0' && ch <= '9') {
								string += ch;
							}
						}
						if (ch === 'e' || ch === 'E') {
							string += ch;
							next();
							if (ch === '-' || ch === '+') {
								string += ch;
								next();
							}
							while (ch >= '0' && ch <= '9') {
								string += ch;
								next();
							}
						}
						number = +string;
						if (!isFinite(number)) {
							error("Bad number");
						} else {
							return number;
						}
					},
					string = function() { // Parse a string value.
						var hex,
							i,
							string = '',
							uffff;
						// When parsing for string values, we must look for " and \ characters.
						if (ch === '"') {
							while (next()) {
								if (ch === '"') {
									next();
									return string;
								}
								if (ch === '\\') {
									next();
									if (ch === 'u') {
										uffff = 0;
										for (i = 0; i < 4; i += 1) {
											hex = parseInt(next(), 16);
											if (!isFinite(hex)) {
												break;
											}
											uffff = uffff * 16 + hex;
										}
										string += String.fromCharCode(uffff);
									} else if (typeof escapee[ch] === 'string') {
										string += escapee[ch];
									} else {
										break;
									}
								} else {
									string += ch;
								}
							}
						}
						error("Bad string");
					},
					white = function() { // Skip whitespace.
						while (ch && ch <= ' ') {
							next();
						}
					},
					word = function() { // true, false, or null.
						switch (ch) {
							case 't':
								next('t');
								next('r');
								next('u');
								next('e');
								return true;
							case 'f':
								next('f');
								next('a');
								next('l');
								next('s');
								next('e');
								return false;
							case 'n':
								next('n');
								next('u');
								next('l');
								next('l');
								return null;
						}
						error("Unexpected '" + ch + "'");
					},
					value,  // Place holder for the value function.
					array = function() { // Parse an array value.
						var array = [];
						if (ch === '[') {
							next('[');
							white();
							if (ch === ']') {
								next(']');
								return array;   // empty array
							}
							while (ch) {
								array.push(value());
								white();
								if (ch === ']') {
									next(']');
									return array;
								}
								next(',');
								white();
							}
						}
						error("Bad array");
					},
					object = function() { // Parse an object value.
						var key,
							object = {};
						if (ch === '{') {
							next('{');
							white();
							if (ch === '}') {
								next('}');
								return object;   // empty object
							}
							while (ch) {
								key = string();
								white();
								next(':');
								if (Object.hasOwnProperty.call(object, key)) {
									error('Duplicate key "' + key + '"');
								}
								object[key] = value();
								white();
								if (ch === '}') {
									next('}');
									return object;
								}
								next(',');
								white();
							}
						}
						error("Bad object");
					};
				value = function() { // Parse a JSON value. It could be an object, an array, a string, a number, or a word.
					white();
					switch (ch) {
						case '{':
							return object();
						case '[':
							return array();
						case '"':
							return string();
						case '-':
							return number();
						default:
							return ch >= '0' && ch <= '9' 
							? number() 
							: word();
					}
				};
				// Initialization
				var result;

				text = source;
				at = 0;
				ch = ' ';
				result = value();
				white();
				if (ch) {
					error("Syntax error");
				}
				// If there is a reviver function, we recursively walk the new structure,
				// passing each name/value pair to the reviver function for possible
				// transformation, starting with a temporary root object that holds the result
				// in an empty key. If there is not a reviver function, we simply return the
				// result.
				return typeof reviver === 'function'
				? (function walk(holder, key) {
					var k, v, value = holder[key];
					if (value && typeof value === 'object') {
						for (k in value) {
							if (Object.prototype.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if (v !== undefined) {
									value[k] = v;
								} else {
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder, key, value);
				}({'': result}, ''))
				: result;
			},
			stringify:function(obj, unicodeConv) {
				if (typeof(unicodeConv)=="undefined") {
					unicodeConv=false;
				}
				var str="",i;
				if (__.isArray(obj) && !__.hasNotNumericKeys(obj)) {
					// encode to array
					str+="[";
					for (i=0; i<obj.length; i++) {
						str+=__.json.stringify(obj[i], unicodeConv);
						if (i<obj.length-1) {
							str+=",";
						}
					}
					str+="]";
				} else if (__.isObject(obj) || __.hasNotNumericKeys(obj)) {
					// encode to object
					str+="{";
					i=0;
					for (var k in obj) {
						str+='"'+__.escapeDoubleQuotes(k.toString())+'":'+__.json.stringify(obj[k], unicodeConv);
						if (i<__.countProperties(obj)-1) {
							str+=",";
						}
						i++;
					}
					str+="}";
				} else if (typeof(obj)=="string") {
					str+='"'+__.json.escapeForJson(unicodeConv?__.convToUnicodeSequence(obj):obj)+'"';
				} else if (typeof(obj)=="number") {
					str+=obj.toString();
				} else if (typeof(obj)=="boolean") {
					str+=obj?"true":"false";
				} else if (obj==null) {
					str+="null";
				}
				return str;
			},
			escapeForJson:function(str) {
				return str.replace(/"|\\|\//g, function(c) { return "\\"+c }).replace(/[^\\](\\b|\\n|\\f|\\r|\\t|\\u)/g, function(c) {  return c[0]+c[1].substring(1); });
			}
		},
		setPixelColor:function(cv, x, y, c) {
			var ctx=cv.getContext("2d");
			var p=ctx.createImageData(1,1);
			p.data[0]=c.r;
			p.data[1]=c.g;
			p.data[2]=c.b;
			p.data[3]=c.a;
			ctx.putImageData(p,x,y);
		},
		getPixelColor:function(cv, x, y) {
			var ctx=cv.getContext("2d");
			var c=ctx.getImageData(x, y, 1, 1).data;
			return { r:c[0], g:c[1], b:c[2], a:c[3] };
		},
		vector:function(elements, interpretedSVG) {
			//setup
			__.vector.containers=elements;
			if (__.isObject(interpretedSVG)) {
				__.vector.svg=interpretedSVG;
			}
			__.vector.supportsSVG=(function() {
				return __.d.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
			})();
			__.vector.actualElements=[];
			//core functions and objects
			__.vector.core={
				normalize:function(o) {
					if ("x" in o && "y" in o) {
						if (!("z" in o)) {
							var sqrt=Math.sqrt(Math.pow(o.x, 2)+Math.pow(o.y, 2));
							var res={ x:o.x/sqrt, y:o.y/sqrt };
						} else {
							var sqrt=Math.sqrt(Math.pow(o.x, 2)+Math.pow(o.y, 2)+Math.pow(o.z, 2));
							var res={ x:o.x/sqrt, y:o.y/sqrt, z:o.z/sqrt };
						}
						return res;
					}
					return false;
				},
				compatibility:{
					lib:{
						//href:{ regexp:/.+/, index:0, counts:[1] },
						//target:{ regexp:/_blank|_parent/, index:0, counts:[1] },
						translation:{ regexp:/([0-9]*(?:\.[0-9]+)?) ?,?/, index:1, counts:[1,2], prefix:"", separator:", ", suffix:"" },
						scale:{ regexp:/([0-9]*(?:\.[0-9]+)?) ?,?/, index:1, counts:[1,2], prefix:"", separator:", ", suffix:"" },
						skewX:{ regexp:/[0-9]*(?:\.[0-9]+)?/, index:0, counts:[1], prefix:"", separator:"", suffix:"" },
						skewY:{ regexp:/[0-9]*(?:\.[0-9]+)?/, index:0, counts:[1], prefix:"", separator:"", suffix:"" },
						rotation:{ regexp:/([0-9]*(?:\.[0-9]+)?) ?deg/, index:1, counts:[1], prefix:"", separator:"", suffix:" deg" },
						matrix:{ regexp:/([0-9]*(?:\.[0-9]+)?) ?,?/, index:1, counts:[6], prefix:"", separator:", ", suffix:"" }
					},
					svg:{
						//href:function(target, originalValue) { var d={ attribute:"xlink:href", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.href.regExp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.href.counts)) { c++; values.push(ex[__.vector.core.compatibility.href.index]); } return { values:values, prefix:__.vector.core.compatibility.scale.prefix, separator:__.vector.core.compatibility.scale.separator, suffix:__.vector.core.compatibility.scale.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); },
						//target:function(target, originalValue) { var d={ attribute:"xlink:show", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.target.regExp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.target.counts)) { c++; values.push(ex[__.vector.core.compatibility.target.index]); } switch (values[0]) { case "_blank": values[0]="new"; break; case "_self": values[0]="replace"; break; default: values[0]="replace"; break; } return { values:values, prefix:__.vector.core.compatibility.scale.prefix, separator:__.vector.core.compatibility.scale.separator, suffix:__.vector.core.compatibility.scale.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); },
						translation:function(target, originalValue) { var d={ attribute:"transform", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.translation.lib.regexp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.lib.translation.counts)) { c++; values.push(ex[__.vector.core.compatibility.lib.translation.index]); } return { values:values, prefix:__.vector.core.compatibility.lib.translation.prefix, separator:__.vector.core.compatibility.lib.translation.separator, suffix:__.vector.core.compatibility.lib.translation.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); },
						scale:function(target, originalValue) { var d={ attribute:"transform", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.scale.lib.regexp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.lib.scale.counts)) { c++; values.push(ex[__.vector.core.compatibility.lib.scale.index]); } return { values:values, prefix:__.vector.core.compatibility.lib.scale.prefix, separator:__.vector.core.compatibility.lib.scale.separator, suffix:__.vector.core.compatibility.lib.scale.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); },
						skewX:function(target, originalValue) { var d={ attribute:"transform", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.skewX.lib.regexp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.lib.skewX.counts)) { c++; values.push(ex[__.vector.core.compatibility.lib.skewX.index]); } return { values:values, prefix:__.vector.core.compatibility.lib.skewX.prefix, separator:__.vector.core.compatibility.lib.skewX.separator, suffix:__.vector.core.compatibility.lib.skewX.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); },
						skewY:function(target, originalValue) { var d={ attribute:"transform", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.skewY.lib.regexp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.lib.skewY.counts)) { c++; values.push(ex[__.vector.core.compatibility.lib.skewY.index]); } return { values:values, prefix:__.vector.core.compatibility.lib.skewY.prefix, separator:__.vector.core.compatibility.lib.skewY.separator, suffix:__.vector.core.compatibility.lib.skewY.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); },
						rotation:function(target, originalValue) { var d={ attribute:"transform", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.rotation.lib.regexp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.lib.rotation.counts)) { c++; values.push(ex[__.vector.core.compatibility.lib.rotation.index]); } return { values:values, prefix:__.vector.core.compatibility.lib.rotation.prefix, separator:__.vector.core.compatibility.lib.rotation.separator, suffix:__.vector.core.compatibility.lib.rotation.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); },
						matrix:function(target, originalValue) { var d={ attribute:"transform", value:(function(originalValue) { var c=0, values=[]; while ((ex=__.vector.core.compatibility.matrix.lib.regexp.exec(originalValue))!==null && c<Math.max.apply(null, __.vector.core.compatibility.lib.matrix.counts)) { c++; values.push(ex[__.vector.core.compatibility.lib.matrix.index]); } return { values:values, prefix:__.vector.core.compatibility.lib.matrix.prefix, separator:__.vector.core.compatibility.lib.matrix.separator, suffix:__.vector.core.compatibility.lib.matrix.suffix }; })(originalValue) }; target.setAttributeNS("http://www.w3.org/2000/svg", d.attribute, d.value); }
					}
				},
				svgParams:function(shapeParams) {
					var shParams={};
					for (var param in shapeParams) {
						switch (param) {
							case "className":
								shParams["class"]=shapeParams[param];
							break;
							default:
								var mem=shapeParams[param];
								param=param.replace(/[A-Z]/g, function(c) {
									return "-"+c.toLowerCase();
								});
								shParams[param]=mem;
							break;
						}
					}
					return shParams;
				},
				svgParam:function(param) {
					param=param.replace(/[A-Z]/g, function(c) {
						return "-"+c.toLowerCase();
					});
					return param;
				},
				sameUnitAbsoluteValues:function(arr, lastPathData, vectorelement, isRelative) {
					for (var i=0; i<arr.length; i++) {
						if (lastPathData!==null) {
							if (arr[i][1]=="x") {
								var unit=__.getUnit(arr[i][0]);
								var val=__.getValue(arr[i][0]);
								var lastUnit=(__.isArray(lastPathData)?__.getUnit(lastPathData[lastPathData.length-1][0]):"");
								var lastVal=(__.isArray(lastPathData)?__.getValue(lastPathData[lastPathData.length-1][0]):0);
								if (lastUnit!==null && lastUnit.length>0) {
									val=__.convertUnits(vectorelement, "left", val, unit, lastUnit);
								}
								if (isRelative) val=lastVal+val;
								arr[i][0]=val+(lastUnit!==null?lastUnit:"");
							} else if (arr[i][1]=="y") {
								var unit=__.getUnit(arr[i][0]);
								var val=__.getValue(arr[i][0]);
								var lastUnit=(__.isArray(lastPathData)?__.getUnit(lastPathData[lastPathData.length-1][1]):"");
								var lastVal=(__.isArray(lastPathData)?__.getValue(lastPathData[lastPathData.length-1][1]):0);
								if (lastUnit!==null && lastUnit.length>0) {
									val=__.convertUnits(vectorelement, "top", val, unit, lastUnit);
								}
								if (isRelative) val=lastVal+val;
								arr[i][0]=val+(lastUnit!==null?lastUnit:"");
							} else if (arr[i][1]==null) {
								var unit=__.getUnit(arr[i][0]);
								var val=__.getValue(arr[i][0]);
								var lastUnit=(__.isArray(lastPathData)?__.getUnit(lastPathData[lastPathData.length-1][1]):"");
								if (lastUnit!==null && lastUnit.length>0) {
									val=__.convertUnits(vectorelement, "", val, unit, lastUnit);
								}
								arr[i][0]=val+(lastUnit!==null?lastUnit:"");
							}
							arr[i]=arr[i][0];
						} else {
							arr[i]=arr[i][0];
						}
						arr[i]=arr[i];
					}
					return arr;
				},
				fixPath:function(path) {
					var i,j,k;
					for (i=0; i<path.length; i++) {
						for (j=0; j<path[i][1].length; j++) {
							for (k=0; k<path[i][1][j].length; k++) {
								path[i][1][j][k]=parseFloat(parseFloat(path[i][1][j][k]).toFixed(9));
							}
						}
					}
					return path;
				},
				convertPathCommandToQuadraticCurveTo:function(typesAndCoordsParams, pathData) {
					var M="M", Q="Q", Z="Z";
					switch (typesAndCoordsParams[0].toLowerCase()) {
						case "moveto":
							if (("x" in typesAndCoordsParams[1]) && ("y" in typesAndCoordsParams[1])) {
								var dest=[];
								if (("relative" in typesAndCoordsParams[1]) && typesAndCoordsParams[1].relative) {
									var split=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									typesAndCoordsParams[1].x=parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x);
									typesAndCoordsParams[1].y=parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y);
								}
								pathData.push([M, [[parseFloat(typesAndCoordsParams[1].x), parseFloat(typesAndCoordsParams[1].y)]]]);
							}
						break;
						case "lineto":
							if (("x" in typesAndCoordsParams[1]) && ("y" in typesAndCoordsParams[1])) {
								if (("relative" in typesAndCoordsParams[1]) && typesAndCoordsParams[1].relative) {
									var split=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									typesAndCoordsParams[1].x=parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x);
									typesAndCoordsParams[1].y=parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y);
								}
								var current=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
								var b1x=parseFloat(current[0])+(parseFloat(typesAndCoordsParams[1].x)-parseFloat(current[0]))/2;
								var b1y=parseFloat(current[1])+(parseFloat(typesAndCoordsParams[1].y)-parseFloat(current[1]))/2;
								if (pathData.length>0) {
									pathData.push([Q, [[b1x, b1y], [parseFloat(typesAndCoordsParams[1].x), parseFloat(typesAndCoordsParams[1].y)]]]);
								} else {
									__.error("It is necessary to use moveto or another drawing function function before doing a lineto.");
								}
							}
						break;
						case "polylineto":
							var l=__.countProperties(typesAndCoordsParams[1]);
							for (var j=1; j<=(l/2)|0; j++) {
								if (("x"+j in typesAndCoordsParams[1]) && ("y"+j in typesAndCoordsParams[1])) {
									if (("relative" in typesAndCoordsParams[1]) && typesAndCoordsParams[1].relative) {
										var split=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
										typesAndCoordsParams[1]["x"+j]=parseFloat(split[0])+typesAndCoordsParams[1]["x"+j];
										typesAndCoordsParams[1]["y"+j]=parseFloat(split[1])+typesAndCoordsParams[1]["y"+j];
									}
									var current=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									var b1x=parseFloat(current[0])+(typesAndCoordsParams[1]["x"+j]-parseFloat(current[0]))/2;
									var b1y=parseFloat(current[1])+(typesAndCoordsParams[1]["y"+j]-parseFloat(current[1]))/2;
									if (pathData.length>0) {
										pathData.push([Q, [[b1x, b1y],[typesAndCoordsParams[1]["x"+j], typesAndCoordsParams[1]["y"+j]]]]);
									} else {
										__.error("It is necessary to use moveto or another drawing function function before doing a polylineto.");
									}
								}
							}
						break;
						case "arcto":
							// the native arc function in svg corrects arbitrary rx and ry (ellipse is scaled) if dest point is not in the elliptical path - thing to follow
							if (("rx" in typesAndCoordsParams[1]) && ("ry" in typesAndCoordsParams[1]) && ("x" in typesAndCoordsParams[1]) && ("y" in typesAndCoordsParams[1])) {
								if (parseFloat(typesAndCoordsParams[1]["rx"])==0 || parseFloat(typesAndCoordsParams[1]["ry"])==0) {
									if (("relative" in typesAndCoordsParams[1]) && typesAndCoordsParams[1].relative) {
										var split=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
										typesAndCoordsParams[1].x=parseFloat(split[0])+typesAndCoordsParams[1].x;
										typesAndCoordsParams[1].y=parseFloat(split[1])+typesAndCoordsParams[1].y;
									}
									var current=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									var b1x=parseFloat(current[0])+(typesAndCoordsParams[1].x-parseFloat(current[0]))/2;
									var b1y=parseFloat(current[1])+(typesAndCoordsParams[1].y-parseFloat(current[1]))/2;
									pathData.push([Q, [[b1x, b1y], [typesAndCoordsParams[1].x, typesAndCoordsParams[1].y]]]);
								} else {
									var matrix;
									if (("relative" in typesAndCoordsParams[1]) && typesAndCoordsParams[1].relative) {
										var split=pathData[pathData.length-1][pathData[pathData.length-1].length-1];
										typesAndCoordsParams[1].x=parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x);
										typesAndCoordsParams[1].y=parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y);
									}
									var radii=[parseFloat(typesAndCoordsParams[1]["rx"]),parseFloat(typesAndCoordsParams[1]["ry"])];
									if (!("xAxisRotation" in typesAndCoordsParams[1])) {
										typesAndCoordsParams[1]["xAxisRotation"]=0;
									}
									if (!("largeArcFlag" in typesAndCoordsParams[1])) {
										typesAndCoordsParams[1]["largeArcFlag"]=0;
									}
									if (!("sweepFlag" in typesAndCoordsParams[1])) {
										typesAndCoordsParams[1]["sweepFlag"]=0;
									}
									// check if rx and ry have to be corrected
									var current=pathData[pathData.length-1][1][pathData[pathData.length-1][1].length-1];
									var dest=[parseFloat(typesAndCoordsParams[1].x), parseFloat(typesAndCoordsParams[1].y)];
									matrix=__.matrix.setRotation(__.matrix.identity([2,2]), -typesAndCoordsParams[1]["xAxisRotation"]+"deg");
									var xyp=__.matrix.applyMatrixTo2DPoint(matrix, { x:(current[0]-dest[0])/2, y:(current[1]-dest[1])/2 });
									var delta=Math.pow(xyp.x,2)/Math.pow(radii[0],2)+Math.pow(xyp.y,2)/Math.pow(radii[1],2);
									if (delta>1) {//out-of-range radii
										radii[0]=Math.sqrt(delta)*radii[0];
										radii[1]=Math.sqrt(delta)*radii[1];
									}
									var rx2=Math.pow(radii[0],2);
									var ry2=Math.pow(radii[1],2);
									var xp2=Math.pow(xyp.x,2);
									var yp2=Math.pow(xyp.y,2);
									var multiplier;
									if (typesAndCoordsParams[1]["largeArcFlag"]!=typesAndCoordsParams[1]["sweepFlag"]) {
										multiplier=1;
									} else {
										multiplier=-1;
									}
									var cxp=multiplier*Math.sqrt((rx2*ry2-rx2*yp2-ry2*xp2)/(rx2*yp2+ry2*xp2))*(radii[0]*xyp.y/radii[1]);
									var cyp=multiplier*Math.sqrt((rx2*ry2-rx2*yp2-ry2*xp2)/(rx2*yp2+ry2*xp2))*(-radii[1]*xyp.x/radii[0]);
									matrix=__.matrix.setRotation(__.matrix.identity([2,2]), typesAndCoordsParams[1]["xAxisRotation"]+"deg");
									var center=__.matrix.applyMatrixTo2DPoint(matrix, { x:cxp, y:cyp });
									center.x+=(current[0]+dest[0])/2;
									center.y+=(current[1]+dest[1])/2;
									var r=typesAndCoordsParams[1]["xAxisRotation"]*Math.PI/180;
									// calculus of the angle from positive xRadius to current point and destination point
									var sign,vx,vy,ux,uy;
									ux=1;
									uy=0;
									vx=(xyp.x-cxp)/radii[0];
									vy=(xyp.y-cyp)/radii[1];
									sign=Math.round((ux*vy-uy*vx)/Math.abs(ux*vy-uy*vx));
									var theta=sign*Math.acos((ux*vx+uy*vy)/(Math.sqrt(Math.pow(ux,2)+Math.pow(uy,2))*Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2))));
									ux=1;
									uy=0;
									vx=(-xyp.x-cxp)/radii[0];
									vy=(-xyp.y-cyp)/radii[1];
									sign=Math.round((ux*vy-uy*vx)/Math.abs(ux*vy-uy*vx));
									var phi=sign*Math.acos((ux*vx+uy*vy)/(Math.sqrt(Math.pow(ux,2)+Math.pow(uy,2))*Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2))));
									var angleCurrent=theta;
									var angleDest=phi;
									// calculus of the bezier curveto equivalent
									var pointAx,pointAy,pointBx,pointBy,middleX,middleY,quadBezierX,quadBezierY,A,B,Am,Bm,mAB,mAmBm,b1x,b1y,b2x,b2y;
									var offset;
									//bezier drawing based on a cutting in eight parts of an ellipse 
									var c=(angleCurrent/Math.PI)*4;
									var d=(angleDest/Math.PI)*4;
									if (typesAndCoordsParams[1]["sweepFlag"]==1) {
										offset=1;
										if (d<c) {
											d+=8;
											angleDest+=Math.PI*2;
										}
										c=Math.floor(c);
										d=Math.ceil(d);
									} else {
										offset=-1;
										if (c<d) {
											c+=8;
											angleCurrent+=Math.PI*2;
										}
										c=Math.ceil(c);
										d=Math.floor(d);
									}
									if (pathData.length>0) {
										if (!isNaN(c) && !isNaN(d)) {
											for (var j=c; j!=d; j+=offset) {
												if (j==c) {
													A=angleCurrent;
													Am=-angleCurrent;
													B=(j+offset)/4*Math.PI;
													Bm=-(j+offset)/4*Math.PI;
												} else if (j!=d-offset) {
													A=j/4*Math.PI;
													Am=-j/4*Math.PI;
													B=(j+offset)/4*Math.PI;
													Bm=-(j+offset)/4*Math.PI;
												} else if (j==d-offset) {
													A=j/4*Math.PI;
													Am=-j/4*Math.PI;
													B=angleDest;
													Bm=-angleDest;
												}
												mAB=A+(B-A)/2;
												mAmBm=Am+(Bm-Am)/2;
												pointAx=center.x+(radii[0]+radii[1])/2*Math.cos(A+r)+(radii[0]-radii[1])/2*Math.cos(Am+r);
												pointAy=center.y+(radii[0]+radii[1])/2*Math.sin(A+r)+(radii[0]-radii[1])/2*Math.sin(Am+r);
												if (j!=d-offset) {
													pointBx=center.x+(radii[0]+radii[1])/2*Math.cos(B+r)+(radii[0]-radii[1])/2*Math.cos(Bm+r);
													pointBy=center.y+(radii[0]+radii[1])/2*Math.sin(B+r)+(radii[0]-radii[1])/2*Math.sin(Bm+r);
												} else {
													pointBx=dest[0];
													pointBy=dest[1];
												}
												middleX=center.x+(radii[0]+radii[1])/2*Math.cos(mAB+r)+(radii[0]-radii[1])/2*Math.cos(mAmBm+r);
												middleY=center.y+(radii[0]+radii[1])/2*Math.sin(mAB+r)+(radii[0]-radii[1])/2*Math.sin(mAmBm+r);
												quadBezierX=(middleX-(pointAx+pointBx)/4)*2;
												quadBezierY=(middleY-(pointAy+pointBy)/4)*2;
												pathData.push([Q, [[quadBezierX, quadBezierY], [pointBx, pointBy]]]);
											}
										}
									} else {
										__.error("It is necessary to use moveto or another drawing function function before doing an arcto.");
									}
								}
							}
						break;
						case "curvetoquadratic":
							if (("x1" in typesAndCoordsParams[1]) && ("y1" in typesAndCoordsParams[1]) && ("x" in typesAndCoordsParams[1]) && ("y" in typesAndCoordsParams[1])) {
								var bezier=[],dest=[];
								if (("relative" in typesAndCoordsParams[1]) && typesAndCoordsParams[1].relative) {
									var split=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									bezier=[parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x1), parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y1)];
									dest=[parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x), parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y)];
								} else {
									bezier=[parseFloat(typesAndCoordsParams[1].x1), parseFloat(typesAndCoordsParams[1].y1)];
									dest=[parseFloat(typesAndCoordsParams[1].x), parseFloat(typesAndCoordsParams[1].y)];
								}
								if (pathData.length>0) {
									pathData.push([Q, [[bezier[0],bezier[1]], [dest[0], dest[1]]]]);
								} else {
									__.error("It is necessary to use moveto or another drawing function function before doing a curvetoquadratic.");
								}
							}
						break;
						case "curvetocubic":
							if (("x1" in typesAndCoordsParams[1]) && ("y1" in typesAndCoordsParams[1]) && ("x2" in typesAndCoordsParams[1]) && ("y2" in typesAndCoordsParams[1]) && ("x" in typesAndCoordsParams[1]) && ("y" in typesAndCoordsParams[1])) {
								var bezier1=[],bezier2=[],dest=[];
								if (("relative" in typesAndCoordsParams[1]) && typesAndCoordsParams[1].relative) {
									var split=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									bezier1=[parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x1), parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y1)];
									bezier2=[parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x2), parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y2)];
									dest=[parseFloat(split[0])+parseFloat(typesAndCoordsParams[1].x), parseFloat(split[1])+parseFloat(typesAndCoordsParams[1].y)];
								} else {
									bezier1=[parseFloat(typesAndCoordsParams[1].x1), parseFloat(typesAndCoordsParams[1].y1)];
									bezier2=[parseFloat(typesAndCoordsParams[1].x2), parseFloat(typesAndCoordsParams[1].y2)];
									dest=[parseFloat(typesAndCoordsParams[1].x), parseFloat(typesAndCoordsParams[1].y)];
								}
								var p0, p1, p2, r1, r2;
								if (pathData.length>0) {
									var current=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									var b0=[parseFloat(current[0]), parseFloat(current[1])];
									var b1=bezier1;
									var b2=bezier2;
									var b3=dest;
									// convert to quadratic
									for (var j=0; j<4; j++) {
										p0=[parseFloat(current[0]), parseFloat(current[1])];
										r2=j/4+0.25;
										p2=[b0[0]*Math.pow(1-r2,3)+3*b1[0]*Math.pow(1-r2,2)*r2+3*b2[0]*(1-r2)*Math.pow(r2,2)+b3[0]*Math.pow(r2,3), b0[1]*Math.pow(1-r2,3)+3*b1[1]*Math.pow(1-r2,2)*r2+3*b2[1]*(1-r2)*Math.pow(r2,2)+b3[1]*Math.pow(r2,3)];
										r1=j/4+0.125;
										p1=[(b0[0]*Math.pow(1-r1,3)+3*b1[0]*Math.pow(1-r1,2)*r1+3*b2[0]*(1-r1)*Math.pow(r1,2)+b3[0]*Math.pow(r1,3)-p0[0]*0.25-p2[0]*0.25)*2, (b0[1]*Math.pow(1-r1,3)+3*b1[1]*Math.pow(1-r1,2)*r1+3*b2[1]*(1-r1)*Math.pow(r1,2)+b3[1]*Math.pow(r1,3)-p0[1]*0.25-p2[1]*0.25)*2];
										pathData.push([Q, [[p1[0], p1[1]], [p2[0], p2[1]]]]);
										current=pathData[pathData.length-1][pathData[pathData.length-1].length-1][pathData[pathData.length-1][pathData[pathData.length-1].length-1].length-1];
									}
								} else {
									__.error("It is necessary to use moveto or another drawing function function before doing a curvetocubic.");
								}
							}
						break;
						case "close":
							pathData.push([Z, []]);
						break;
						default:
						break;
					}
					return __.vector.core.fixPath(pathData);
				},
				convertDefinedShapeToQuadraticCurveTo:function(type, coordsParams, shapeParams, element) {
					var M="M",Q="Q",Z="Z";
					var pathData=[];
					var viewbox;
					if (element.getAttribute("viewBox")!==null) {
						viewbox=element.getAttribute("viewBox").split(" ");
					} else if (element.getAttribute("viewbox")!==null) {
						viewbox=element.getAttribute("viewbox").split(" ");
					}
					switch(type) {
						case "rect":
							if (("x" in coordsParams) && ("y" in coordsParams) && ("w" in coordsParams) && ("h" in coordsParams) && ("rx" in coordsParams) && ("ry" in coordsParams)) {
								if (!isNaN(parseFloat(coordsParams["w"])) && !isNaN(parseFloat(coordsParams["h"])) && parseFloat(coordsParams["w"])!=0 && parseFloat(coordsParams["h"])!=0) {
									var xy=[],x,y,wh=[],w,h,rxry=[],rx,ry;
									rxry=[__.getValue(coordsParams["rx"]),__.getValue(coordsParams["ry"])];
									xy=[__.getValue(coordsParams["x"]),__.getValue(coordsParams["y"])];
									wh=[__.getValue(coordsParams["w"]),__.getValue(coordsParams["h"])];
									var points=[
										[parseFloat(xy[0]), parseFloat(xy[1])],
										[parseFloat(xy[0])+parseFloat(wh[0]), parseFloat(xy[1])],
										[parseFloat(xy[0])+parseFloat(wh[0]), parseFloat(xy[1])+parseFloat(wh[1])], 
										[parseFloat(xy[0]), parseFloat(xy[1])+parseFloat(wh[1])]
									];
									if (parseFloat(rxry[0])==0 || parseFloat(rxry[1])==0) {
										pathData.push([M, [[xy[0],xy[1]]]]);
										for (var i=0; i<points.length; i++) {
											var A=points[i];
											var B=(i<points.length-1)?points[i+1]:points[0];
											var b1x=A[0]+(B[0]-A[0])/2;
											var b1y=A[1]+(B[1]-A[1])/2;
											pathData.push([Q, [[b1x, b1y], [B[0], B[1]]]]);
										}
										pathData.push([Z, []]);
									} else {
										pathData.push([M, [[(parseFloat(xy[0])+parseFloat(rxry[0])), xy[1]]]]);
										for (var i=0; i<points.length; i++) {
											var A,B,b1x,b1y;
											A=[points[i][0]+(i%2===0?parseFloat(rxry[0])*Math.pow(-1, ((i/2)|0)):0), points[i][1]+(i%2===1?parseFloat(rxry[1])*Math.pow(-1, ((i/2)|0)):0)];
											var pB=(i<points.length-1)?points[i+1]:points[0];
											B=[pB[0]+(i%2===0?parseFloat(rxry[0])*Math.pow(-1, 1-(i/2)|0):0), pB[1]+(i%2===1?parseFloat(rxry[1])*Math.pow(-1, 1-((i/2)|0)):0)];
											b1x=A[0]+(B[0]-A[0])/2;
											b1y=A[1]+(B[1]-A[1])/2;
											pathData.push([Q, [[b1x, b1y], [B[0], B[1]]]]);
											var curveFrom=B;
											var curveTo=[pB[0]+(i%2===1?parseFloat(rxry[0])*Math.pow(-1, 1-((i/2)|0)):0), pB[1]+(i%2===0?parseFloat(rxry[1])*Math.pow(-1, ((i/2)|0)):0)];
											var distBx=4/3*(2*parseFloat(rxry[0])/Math.sqrt(2)-parseFloat(rxry[0]));
											var distBy=4/3*(2*parseFloat(rxry[1])/Math.sqrt(2)-parseFloat(rxry[1]));
											b1x=curveFrom[0]+(i%2===0?distBx*Math.pow(-1, (i/2)|0):0);
											b1y=curveFrom[1]+(i%2===1?distBy*Math.pow(-1, (i/2)|0):0);
											b2x=curveTo[0]+(i%2===1?distBx*Math.pow(-1, (i/2)|0):0);
											b2y=curveTo[1]+(i%2===0?distBy*Math.pow(-1, 1-((i/2)|0)):0);
											// convert to quadratic bezier
											var b0=B;
											var b1=[b1x, b1y];
											var b2=[b2x, b2y];
											var b3=[curveTo[0], curveTo[1]];
											var current=b0;
											for (var j=0; j<4; j++) {
												p0=[parseFloat(current[0]), parseFloat(current[1])];
												r2=j/4+0.25;
												p2=[b0[0]*Math.pow(1-r2,3)+3*b1[0]*Math.pow(1-r2,2)*r2+3*b2[0]*(1-r2)*Math.pow(r2,2)+b3[0]*Math.pow(r2,3), b0[1]*Math.pow(1-r2,3)+3*b1[1]*Math.pow(1-r2,2)*r2+3*b2[1]*(1-r2)*Math.pow(r2,2)+b3[1]*Math.pow(r2,3)];
												r1=j/4+0.125;
												p1=[(b0[0]*Math.pow(1-r1,3)+3*b1[0]*Math.pow(1-r1,2)*r1+3*b2[0]*(1-r1)*Math.pow(r1,2)+b3[0]*Math.pow(r1,3)-p0[0]*0.25-p2[0]*0.25)*2, (b0[1]*Math.pow(1-r1,3)+3*b1[1]*Math.pow(1-r1,2)*r1+3*b2[1]*(1-r1)*Math.pow(r1,2)+b3[1]*Math.pow(r1,3)-p0[1]*0.25-p2[1]*0.25)*2];
												pathData.push([Q, [[p1[0], p1[1]], [p2[0], p2[1]]]]);
												current=pathData[pathData.length-1][1][pathData[pathData.length-1][1].length-1];
											}
										}
										pathData.push([Z, []]);
									}
								} else {
									__.error("rect : width and/or height are/is 0 or NaN");
								}
							} else {
								__.error("rect : missing parameter(s) ... "+" x:"+("x" in coordsParams)+" y:"+("y" in coordsParams)+" w:"+("w" in coordsParams)+" h:"+("h" in coordsParams)+" rx:"+("rx" in coordsParams)+" ry:"+("ry" in coordsParams));
							}
						break;
						case "circle":
							if (("x" in coordsParams) && ("y" in coordsParams) && ("r" in coordsParams)) {
								if (!isNaN(parseFloat(coordsParams["r"])) && parseFloat(coordsParams["r"])!=0) {
									var r=[];
									r=__.vector.core.sameUnitAbsoluteValues([[coordsParams["r"], null]], __.vector.core.getLastPath(__.vector.actualElements[0]), __.vector.actualElements[0], false);
									r=r[0];
									var xy=[];
									xy=__.vector.core.sameUnitAbsoluteValues([[coordsParams["x"], "x"],[coordsParams["y"], "y"]], __.vector.core.getLastPath(__.vector.actualElements[0]), __.vector.actualElements[0], false);
									var unit=__.getUnit(xy[0]);
									if (unit===null) {
										unit="";
									}
									var distBxy=4/3*(2*parseFloat(r)/Math.sqrt(2)-parseFloat(r));
									var points=[
										[parseFloat(xy[0])+parseFloat(r), parseFloat(xy[1])],
										[parseFloat(xy[0]), parseFloat(xy[1])+parseFloat(r)],
										[parseFloat(xy[0])-parseFloat(r), parseFloat(xy[1])], 
										[parseFloat(xy[0]), parseFloat(xy[1])-parseFloat(r)]
									];
									pathData.push([M, [[points[0][0],points[0][1]]]]);
									for (var i=0; i<points.length; i++) {
										var A,B,b1x,b1y,b2x,b2y;
										A=points[i];
										B=(i<points.length-1)?points[i+1]:points[0];
										b1x=A[0]+(i%2===1?distBxy*Math.pow(-1, 1-((i/2)|0)):0);
										b1y=A[1]+(i%2===0?distBxy*Math.pow(-1, (i/2)|0):0);
										b2x=B[0]+(i%2===0?distBxy*Math.pow(-1, (i/2)|0):0);
										b2y=B[1]+(i%2===1?distBxy*Math.pow(-1, (i/2)|0):0);
										// convert to quadratic bezier
										var b0=A;
										var b1=[b1x, b1y];
										var b2=[b2x, b2y];
										var b3=B;
										// convert to quadratic
										var current=b0;
										for (var j=0; j<4; j++) {
											p0=[parseFloat(current[0]), parseFloat(current[1])];
											r2=j/4+0.25;
											p2=[b0[0]*Math.pow(1-r2,3)+3*b1[0]*Math.pow(1-r2,2)*r2+3*b2[0]*(1-r2)*Math.pow(r2,2)+b3[0]*Math.pow(r2,3), b0[1]*Math.pow(1-r2,3)+3*b1[1]*Math.pow(1-r2,2)*r2+3*b2[1]*(1-r2)*Math.pow(r2,2)+b3[1]*Math.pow(r2,3)];
											r1=j/4+0.125;
											p1=[(b0[0]*Math.pow(1-r1,3)+3*b1[0]*Math.pow(1-r1,2)*r1+3*b2[0]*(1-r1)*Math.pow(r1,2)+b3[0]*Math.pow(r1,3)-p0[0]*0.25-p2[0]*0.25)*2, (b0[1]*Math.pow(1-r1,3)+3*b1[1]*Math.pow(1-r1,2)*r1+3*b2[1]*(1-r1)*Math.pow(r1,2)+b3[1]*Math.pow(r1,3)-p0[1]*0.25-p2[1]*0.25)*2];
											pathData.push([Q, [[p1[0], p1[1]], [p2[0], p2[1]]]]);
											current=pathData[pathData.length-1][1][pathData[pathData.length-1][1].length-1];
										}
									}
									pathData.push([Z, []]);
								} else {
									__.error("circle : r is 0 or NaN");
								}
							}
						break;
						case "ellipse":
							if (("rx" in coordsParams) && ("ry" in coordsParams) && ("x" in coordsParams) && ("y" in coordsParams)) {
								if (parseFloat(coordsParams["rx"])==0 || parseFloat(coordsParams["ry"])==0) {
									__.error("ellipse: rx and/or ry are/is null");
								} else {
									if (!("rotation" in coordsParams)) {
										coordsParams["rotation"]=0;
									}
									r=coordsParams["rotation"]*Math.PI/180;
									var radii=[];
									radii=__.vector.core.sameUnitAbsoluteValues([[coordsParams["rx"], null],[coordsParams["ry"], null]], (pathData.length>0?pathData[pathData.length-1]:null), __.vector.actualElements[0], false);
									var unitR=__.getUnit(radii[0]);
									radii=[Math.abs(parseFloat(radii[0]))+(unitR!=null?unitR:""),Math.abs(parseFloat(radii[1]))+(unitR!=null?unitR:"")];
									var radiiNoUnits=[parseFloat(radii[0]), parseFloat(radii[1])];
									var center=[];
									center=__.vector.core.sameUnitAbsoluteValues([[coordsParams["x"], "x"],[coordsParams["y"], "y"]], (pathData.length>0?pathData[pathData.length-1]:null), __.vector.actualElements[0], false);
									var unit=__.getUnit(center[0]);
									if (unit==null) {
										unit="";
									}
									var current=0,dest=8,offset=1;
									var pointAx,pointAy,pointBx,pointBy,middleX,middleY,quadBezierX,quadBezierY,A,B,Am,Bm,mAB,mAmBm,b1x,b1y,b2x,b2y;
									for (var j=current; j!=dest; j+=offset) {
										A=j/4*Math.PI;
										Am=-j/4*Math.PI;
										B=(j+offset)/4*Math.PI;
										Bm=-(j+offset)/4*Math.PI;
										mAB=A+(B-A)/2;
										mAmBm=Am+(Bm-Am)/2;
										pointAx=center[0]+(radiiNoUnits[0]+radiiNoUnits[1])/2*Math.cos(A+r)+(radiiNoUnits[0]-radiiNoUnits[1])/2*Math.cos(Am+r);
										pointAy=center[1]+(radiiNoUnits[0]+radiiNoUnits[1])/2*Math.sin(A+r)+(radiiNoUnits[0]-radiiNoUnits[1])/2*Math.sin(Am+r);
										if (j==current) {
											pathData.push([M, [[pointAx, pointAy]]]);
										}
										pointBx=center[0]+(radiiNoUnits[0]+radiiNoUnits[1])/2*Math.cos(B+r)+(radiiNoUnits[0]-radiiNoUnits[1])/2*Math.cos(Bm+r);
										pointBy=center[1]+(radiiNoUnits[0]+radiiNoUnits[1])/2*Math.sin(B+r)+(radiiNoUnits[0]-radiiNoUnits[1])/2*Math.sin(Bm+r);
										middleX=center[0]+(radiiNoUnits[0]+radiiNoUnits[1])/2*Math.cos(mAB+r)+(radiiNoUnits[0]-radiiNoUnits[1])/2*Math.cos(mAmBm+r);
										middleY=center[1]+(radiiNoUnits[0]+radiiNoUnits[1])/2*Math.sin(mAB+r)+(radiiNoUnits[0]-radiiNoUnits[1])/2*Math.sin(mAmBm+r);
										quadBezierX=(middleX-(pointAx+pointBx)/4)*2;
										quadBezierY=(middleY-(pointAy+pointBy)/4)*2;
										// draw quadratic bezier
										pathData.push([Q, [[quadBezierX, quadBezierY], [pointBx, pointBy]]]);
									}
									if (j==dest) {
										pathData.push([Z, []]);
									}
								}
							}
						break;
						case "polygon":
							if (("x1" in coordsParams) && ("y1" in coordsParams) && ("x2" in coordsParams) && ("y2" in coordsParams) && ("x3" in coordsParams) && ("y3" in coordsParams)) {
								var i=1;
								while (("x"+i in coordsParams) && ("y"+i in coordsParams)) {
									var dest=__.vector.core.sameUnitAbsoluteValues([[coordsParams["x"+i], "x"],[coordsParams["y"+i], "y"]], (pathData.length>0?pathData[pathData.length-1]:null), __.vector.actualElements[0], false);
									var unit=__.getUnit(dest[0]);
									if (unit==null) {
										unit="";
									}
									if (i==1) {
										pathData.push([M, [[parseFloat(dest[0]), parseFloat(dest[1])]]]);
									} else {
										var current=pathData[pathData.length-1][1][pathData[pathData.length-1][1].length-1];
										var b1x=parseFloat(current[0])+(dest[0]-parseFloat(current[0]))/2;
										var b1y=parseFloat(current[1])+(dest[1]-parseFloat(current[1]))/2;
										var unit=__.getUnit(dest[0]);
										if (unit===null) {
											unit="";
										}
										pathData.push([Q, [[b1x, b1y], [parseFloat(dest[0]), parseFloat(dest[1])]]]);
									}
									i++;
								}
								--i;
								if (coordsParams["x"+i]!==coordsParams["x1"] || coordsParams["y"+i]!==coordsParams["y1"]) {
									var dest=__.vector.core.sameUnitAbsoluteValues([[coordsParams["x1"], "x"],[coordsParams["y1"], "y"]], (pathData.length>0?pathData[pathData.length-1]:null), __.vector.actualElements[0], false);
									var unit=__.getUnit(dest[0]);
									var current=pathData[pathData.length-1][1][pathData[pathData.length-1][1].length-1];
									var b1x=parseFloat(current[0])+(dest[0]-parseFloat(current[0]))/2;
									var b1y=parseFloat(current[1])+(dest[1]-parseFloat(current[1]))/2;
									var unit=__.getUnit(dest[0]);
									if (unit===null) {
										unit="";
									}
									pathData.push([Q, [[b1x, b1y], [parseFloat(dest[0]), parseFloat(dest[1])]]]);
								}
								pathData.push([Z, []]);
							}
						break;
						case "polyline":
							if (("x1" in coordsParams) && ("y1" in coordsParams) && ("x2" in coordsParams) && ("y2" in coordsParams) && ("x3" in coordsParams) && ("y3" in coordsParams)) {
								var i=1;
								while (("x"+i in coordsParams) && ("y"+i in coordsParams)) {
									var dest=__.vector.core.sameUnitAbsoluteValues([[coordsParams["x"+i], "x"],[coordsParams["y"+i], "y"]], (pathData.length>0?pathData[pathData.length-1]:null), __.vector.actualElements[0], false);
									var unit=__.getUnit(dest[0]);
									if (unit==null) {
										unit="";
									}
									if (i==1) {
										pathData.push([M, [[parseFloat(dest[0]), parseFloat(dest[1])]]]);
									} else {
										var current=pathData[pathData.length-1][1][pathData[pathData.length-1][1].length-1];
										var b1x=parseFloat(current[0])+(dest[0]-parseFloat(current[0]))/2;
										var b1y=parseFloat(current[1])+(dest[1]-parseFloat(current[1]))/2;
										var unit=__.getUnit(dest[0]);
										if (unit===null) {
											unit="";
										}
										pathData.push([Q, [[b1x, b1y], [parseFloat(dest[0]), parseFloat(dest[1])]]]);
									}
									i++;
								}
								--i;
							}
						break;
						case "line":
							if (("x1" in coordsParams) && ("y1" in coordsParams) && ("x2" in coordsParams) && ("y2" in coordsParams)) {
								var i=1;
								while (("x"+i in coordsParams) && ("y"+i in coordsParams)) {
									var dest=__.vector.core.sameUnitAbsoluteValues([[coordsParams["x"+i], "x"],[coordsParams["y"+i], "y"]], (pathData.length>0?pathData[pathData.length-1]:null), __.vector.actualElements[0], false);
									var unit=__.getUnit(dest[0]);
									if (unit==null) {
										unit="";
									}
									if (i==1) {
										pathData.push([M, [[parseFloat(dest[0]), parseFloat(dest[1])]]]);
									} else {
										var current=pathData[pathData.length-1][1][pathData[pathData.length-1][1].length-1];
										var b1x=parseFloat(current[0])+(dest[0]-parseFloat(current[0]))/2;
										var b1y=parseFloat(current[1])+(dest[1]-parseFloat(current[1]))/2;
										var unit=__.getUnit(dest[0]);
										if (unit===null) {
											unit="";
										}
										pathData.push([Q, [[b1x, b1y], [parseFloat(dest[0]), parseFloat(dest[1])]]]);
									}
									i++;
								}
								--i;
							}
						break;
						case "image":
					
						break;
						case "text":
					
						break;
					}
					return __.vector.core.fixPath(pathData);
				},
				pathRegExp:{
					//moveto:/^m([^mlhvcsqtaz]+)[mlhvcsqtaz]/i,
					moveto:/^(m)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					lineto:/^(l)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					horizontal_lineto:/^(h)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					vertical_lineto:/^(v)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					cubic_curveto:/^(c)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					shorthand_smooth_cubic_curveto:/^(s)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					quadratic_curveto:/^(q)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					shorthand_smooth_quadratic_curveto:/^(t)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					elliptical_arc:/^(a)([^mlhvcsqtaz]+)[mlhvcsqtaz]?/i,
					close:/^(z)(\u0020|\u00x9|\u000D|\u000A)*/i
				},
				pathArgsNormalCount:{
					moveto:2,
					lineto:2,
					horizontal_lineto:1,
					vertical_lineto:1,
					cubic_curveto:6,
					shorthand_smooth_cubic_curveto:4,
					quadratic_curveto:4,
					shorthand_smooth_quadratic_curveto:2,
					elliptical_arc:7,
					close:0
				},
				getPathDataFromFreeShape:function(d) {
					var data=d,
						e,
						ex,
						cmd,
						numbers,
						n,
						count,
						isRelative,
						isRelativeLastPath,
						typesAndCoordsParamsArray,
						i,
						coords,
						s=false,
						pathOrigin=[],
						path=[],
						lastPath,
						lastBezierControl=[],
						lastPoint,
						lastPointLastPath,
						firstPointLastPath,
						firstControlPoint,
						secondControlPoint,
						destPoint;
					if (data.length>0) {
						while (data.length>0) {
							for (var p in __.vector.core.pathRegExp) {
								if (__.vector.core.pathRegExp[p].test(data)) {
									ex=__.vector.core.pathRegExp[p].exec(data);
									data=data.substring(ex[1].length+(2 in ex && typeof(ex[2])!=="undefined"?ex[2].length:0));
									cmd=ex[1];
									if (!s && cmd.toLowerCase()!=="m") {
										__.error("freeShape: series of commands should start by m or M");
									} else s=true;
									numbers=(2 in ex?ex[2]:"");
									n=[];
									while ((ex=/-?[0-9]+(?:\.[0-9]+)?/.exec(numbers))!==null) {
										numbers=numbers.substring(ex.index+ex[0].length);
										n.push(ex[0]);
									}
									if (!/z/i.test(cmd) && ((n.length/__.vector.core.pathArgsNormalCount[p])|0)!==n.length/__.vector.core.pathArgsNormalCount[p]) {
										__.error("freeShape: a command of type '"+cmd+"' has the wrong number of arguments");
									} else {
										isRelative=(cmd.toLowerCase()===cmd?true:false);
										if (/s|t/.test(cmd.toLowerCase())) {
											lastPath=pathOrigin.length>0?pathOrigin[pathOrigin.length-1]:null;
											lastPointLastPath=[lastPath[1][lastPath[1].length-2], lastPath[1][lastPath[1].length-1]];
											firstPointLastPath=[lastPath[1][0], lastPath[1][1]];
											isRelativeLastPath=(lastPath[0].toLowerCase()===lastPath[0]?true:false);
											if ((cmd.toLowerCase()=="s" && /c|s/i.test(lastPath[0])) || (cmd.toLowerCase()=="t" && /q|t/i.test(lastPath[0]))) {
												for (i=0; i<n.length; i+=(cmd.toLowerCase()=="s"?4:2)) {
													lastPoint=path[path.length-1][path[path.length-1].length-1][path[path.length-1][path[path.length-1].length-1].length-1];
													firstControlPoint=[];
													if (isRelativeLastPath===isRelative) {
														if (!isRelative) {
															firstControlPoint[0]=n[n.length-2]+(n[n.length-2]-parseFloat(lastBezierControl[0]));
															firstControlPoint[1]=n[n.length-1]+(n[n.length-1]-parseFloat(lastBezierControl[1]));
														} else {
															firstControlPoint[0]=parseFloat(lastPointLastPath[0])-(parseFloat(lastBezierControl[0])-parseFloat(lastPointLastPath[0]));
															firstControlPoint[1]=parseFloat(lastPointLastPath[1])-(parseFloat(lastBezierControl[1])-parseFloat(lastPointLastPath[1]));
														}
													} else {
														if (!isRelativeLastPath && isRelative) {
															firstControlPoint[0]=parseFloat(lastPointLastPath[0])-parseFloat(lastBezierControl[0]);
															firstControlPoint[1]=parseFloat(lastPointLastPath[1])-parseFloat(lastBezierControl[1]);
														} else {
															firstControlPoint[0]=n[n.length-2]-(parseFloat(lastPointLastPath[0])-parseFloat(lastBezierControl[0]));
															firstControlPoint[1]=n[n.length-1]-(parseFloat(lastPointLastPath[1])-parseFloat(lastBezierControl[1]));
														}
													}
													if (cmd.toLowerCase()=="s") {
														typesAndCoordsParams=["curvetocubic", { x1:firstControlPoint[0], y1:firstControlPoint[1], x2:n[i], y2:n[i+1], x:n[i+2], y:n[i+3], relative:isRelative }];
														path=__.vector.core.convertPathCommandToQuadraticCurveTo(typesAndCoordsParams, path);
														lastBezierControl=[n[i], n[i+1]];
													} else {
														typesAndCoordsParams=["curvetoquadratic", { x1:firstControlPoint[0], y1:firstControlPoint[1], x:n[i], y:n[i+1], relative:isRelative }];
														path=__.vector.core.convertPathCommandToQuadraticCurveTo(typesAndCoordsParams, path);
														lastBezierControl=[firstControlPoint[0], firstControlPoint[1]];
													}
												}
											}
										} else if (/h|v/.test(cmd.toLowerCase())) {
											lastPoint=path[path.length-1][path[path.length-1].length-1][path[path.length-1][path[path.length-1].length-1].length-1];
											for (i=0; i<n.length; i++) {
												typesAndCoordsParams=["lineto", { x:(cmd.toLowerCase()=="h"?n[i]:(!isRelative?lastPoint[0]:0)), y:(cmd.toLowerCase()=="v"?n[i]:(!isRelative?lastPoint[1]:0)), relative:isRelative }];
												path=__.vector.core.convertPathCommandToQuadraticCurveTo(typesAndCoordsParams, path);
											}
										} else {
											switch(cmd.toLowerCase()) {
												case "m":
													for (i=0; i<n.length; i+=2) {
														if (i==0) {
															path=__.vector.core.convertPathCommandToQuadraticCurveTo(["moveto", { x:n[i], y:n[i+1], relative:isRelative }], path);
														} else {
															path=__.vector.core.convertPathCommandToQuadraticCurveTo(["lineto", { x:n[i], y:n[i+1], relative:isRelative }], path);
														}
													}
												break;
												case "l":
													for (i=0; i<n.length; i+=2) {
														path=__.vector.core.convertPathCommandToQuadraticCurveTo(["lineto", { x:n[i], y:n[i+1], relative:isRelative }], path);
													}
												break;
												case "c":
													for (i=0; i<n.length; i+=6) {
														path=__.vector.core.convertPathCommandToQuadraticCurveTo(["curvetocubic", { x1:n[i], y1:n[i+1], x2:n[i+2], y2:n[i+3], x:n[i+4], y:n[i+5], relative:isRelative }], path);
														lastBezierControl=[n[i+2], n[i+3]];
													}
												break;
												case "q":
													for (i=0; i<n.length; i+=4) {
														path=__.vector.core.convertPathCommandToQuadraticCurveTo(["curvetoquadratic", { x1:n[i], y1:n[i+1], x:n[i+2], y:n[i+3], relative:isRelative }], path);
														lastBezierControl=[n[i], n[i+1]];
													}
												break;
												case "a":
													for (i=0; i<n.length; i+=7) {
														path=__.vector.core.convertPathCommandToQuadraticCurveTo(["arcto", { rx:n[i], ry:n[i+1], xAxisRotation:n[i+2], largeArcFlag:n[i+3], sweepFlag:n[i+4], x:n[i+5], y:n[i+6], relative:isRelative }], path);
													}
												break;
												case "z":
													path.push(["Z", []]);  
												break;
											}
										}
									}
									pathOrigin.push([cmd, n]);
								}
							}
							data=__.trim(data);
						}
						return path;
					} else {
						__.error("freeShape : the string of commands seems to be empty");
					}
				},
				getConvertedPathFromElement:function(element) {
					var parent=element;
					while ("parentNode" in parent && parent.parentNode!==null && parent.parentNode.tagName.toLowerCase()!=="svg") {
						parent=parent.parentNode;
					}
					if (__.vector.actualElements.length===0) {
						__.vector.actualElements[0]=parent;
					}
					var required={
						rect:["x","y","w","h","rx","ry"],
						circle:["x","y","r"],
						ellipse:["x","y","rx","xy"],
						polygon:["x1","y1","x2","y2","x3","y3"],
						polyline:["x1","y1","x2","y2"],
						line:["x1","y1","x2","y2"]
					}, req, p, e1, e2, a, points, axis;
					if ("tagName" in element && element.tagName.toLowerCase()!=="path") {
						req=required[element.tagName.toLowerCase()];
						conversionDic={
							cx:"x",
							cy:"y",
							width:"w",
							height:"h"
						};
						// definedShape
						coordsParams={};
						shapeParams={};
						for (a in element.attributes) {
							if (element.attributes[a].toString()==="[object Attr]" && "name" in element.attributes[a] && (["x","y","width","height","rx","ry","points","cx","cy","r"].indexOf(element.attributes[a].name)!==-1 || ["x", "y"].indexOf(element.attributes[a].name.substring(0, 1))!==-1)) {
								if (element.attributes[a].value===null) {
									coordsParams[element.attributes[a].name]=0;
								} else {
									if (element.attributes[a].name in conversionDic) {
										b=conversionDic[element.attributes[a].name];
										coordsParams[b]=element.attributes[a].value;
									} else if (element.attributes[a].name==="points") {
										coordsParams[element.attributes[a].name]=element.attributes[a].value;
										points=coordsParams.points.split(/[\s,]+/);
										for (p in points) {
											if (p%2===0) {
												axis="x";
											} else {
												axis="y";
											}
											coordsParams[axis+(Math.floor(p/2)+1)]=points[p];
										}
									} else {
										coordsParams[element.attributes[a].name]=element.attributes[a].value;
									}
								}
							} else if (element.attributes[a].toString()==="[object Attr]" && "name" in element.attributes[a]) {
								shapeParams[element.attributes[a].name]=element.attributes[a].value;
							}
						}
						for (p in req) {
							if (!(req[p] in coordsParams) && !(element.tagName.toLowerCase()==="polygon" && "points" in coordsParams)) {
								coordsParams[req[p]]=0;
							}
						}
						return __.vector().convertDefinedShapeToQuadraticCurveTo(element.tagName.toLowerCase(), coordsParams, shapeParams, parent);
					} else if ("tagName" in element && element.tagName.toLowerCase()==="path") {
						return __.vector().getPathDataFromFreeShape(element.getAttribute("d"));
					}
				
				},
				freeShape:function(d, shapeParams) {
					if (__.vector.actualElements.length===0) {
						__.error("It is necessary to create, load or interpret a vector object before doing that.");
						return false;
					} else {
						var path=__.vector.core.getPathDataFromFreeShape(d);
						for (var a=0; a<__.vector.actualElements.length; a++) {
							var shParams=__.vector.core.svgParams(shapeParams);
							shParams.d="";
							for (var i=0; i<path.length; i++) {
								shParams.d+=path[i][0];
								for (var j=0; j<path[i][1].length; j++) {
									shParams.d+=path[i][1][j].join(",")+",";
									if (j===path[i][1].length-1) {
										shParams.d=shParams.d.substring(0, shParams.d.length-1);
									}
								}
							}
							__.createNode("path", shParams, "", [__.vector.actualElements[a]], "http://www.w3.org/2000/svg");
						}
					}
					return __.vector.core;
				},
				freeShapeWithPathDataInput:function(selector, pathDataInput, shapeParams, viewBox) {
					if (typeof(selector)==="string") {
						__.vector.actualElements=lib(selector).targets;
					}
					if (__.vector.actualElements.length===0) {
						__.error("It is necessary to create, load or interpret a vector object before doing that.");
						return false;
					} else {
						var a, h, i, j, k;
						var from=pathDataInput.from;
						var to=pathDataInput.to;
						var r=__.vector.core.fixesIfMultiplePaths({ from:from, to:to }, "d", viewBox);
						var obj=__.vector.core.fixesForAnimation(r.obj, "d", r.ignoreRotationOfPoints);
						for (a=0; a<__.vector.actualElements.length; a++) {
							var shParams=__.vector.core.svgParams(shapeParams);
							shParams.d="";
							for (h=0; h<obj.from.d.length; h++) {
								for (i=0; i<obj.from.d[h].length; i++) {
									if (__.isNumericalArray(obj.from.d[h][i][0])) {
										for (j=0; j<obj.from.d[h][i][0].length; j++) {
											shParams.d+=obj.from.d[h][i][j][0];
											for (k=0; k<obj.from.d[h][i][j][1].length; k++) {
												shParams.d+=obj.from.d[h][i][j][1][k].join(",")+",";
												if (k===obj.from.d[h][i][j][1].length-1) {
													shParams.d=shParams.d.substring(0, shParams.d.length-1);
												}
											}
										}
									} else {
										shParams.d+=obj.from.d[h][i][0];
										for (j=0; j<obj.from.d[h][i][1].length; j++) {
											shParams.d+=obj.from.d[h][i][1][j].join(",")+",";
											if (j===obj.from.d[h][i][1].length-1) {
												shParams.d=shParams.d.substring(0, shParams.d.length-1);
											}
										}
									}
								}
							}
							__.createNode("path", shParams, "", [__.vector.actualElements[a]], "http://www.w3.org/2000/svg");
						}
					}
					return __.vector.core;
				},
				freeShapeWithPathDataInputCopy:function(selector, pathDataInput, shapeParams, viewBox) {
					if (typeof(selector)==="string") {
						__.vector.actualElements=lib(selector).targets;
					}
					if (__.vector.actualElements.length===0) {
						__.error("It is necessary to create, load or interpret a vector object before doing that.");
						return false;
					} else {
						var a, h, i, j, k;
						for (a=0; a<__.vector.actualElements.length; a++) {
							var shParams=__.vector.core.svgParams(shapeParams);
							shParams.d="";
							for (i=0; i<pathDataInput.length; i++) {
								if (__.isNumericalArray(pathDataInput[i][0])) {
									for (j=0; j<pathDataInput[i][0].length; j++) {
										shParams.d+=pathDataInput[i][j][0];
										for (k=0; k<pathDataInput[i][j][1].length; k++) {
											shParams.d+=pathDataInput[i][j][1][k].join(",")+",";
											if (k===pathDataInput[i][j][1].length-1) {
												shParams.d=shParams.d.substring(0, shParams.d.length-1);
											}
										}
									}
								} else {
									shParams.d+=pathDataInput[i][0];
									for (j=0; j<pathDataInput[i][1].length; j++) {
										shParams.d+=pathDataInput[i][1][j].join(",")+",";
										if (j===pathDataInput[i][1].length-1) {
											shParams.d=shParams.d.substring(0, shParams.d.length-1);
										}
									}
								}
							}
							__.createNode("path", shParams, "", [__.vector.actualElements[a]], "http://www.w3.org/2000/svg");
						}
					}
					return __.vector.core;
				},
				shapeToQuadraticCurveTo:function(typesAndCoordsParamsArray, shapeParams, destVectorType) {
					if (__.vector.actualElements.length===0) {
						__.error("It is necessary to create, load or interpret a vector object before doing that.");
						return false;
					} else {
						var M="M";
						var shParams={};
						var e;
						for (var param in shapeParams) {
							param=param.replace(/[A-Z]/g, function(c) {
								 return "-"+c.toLowerCase();
							});
							shParams[param]=shapeParams[param];
						}
						for (var a=0; a<__.vector.actualElements.length; a++) {
							var pathData=[];
							if (typesAndCoordsParamsArray[0][0].toLowerCase()!="moveto") {
								pathData.push([M, [0,0]]);
							}
							for (var i=0; i<typesAndCoordsParamsArray.length; i++) {
								pathData=__.vector.convertPathCommandToQuadraticCurveTo(typesAndCoordsParamsArray[i], pathData, a);
							}
							var shParams=__.vector.core.svgParams(shapeParams);
							shParams.d="";
							for (var i=0; i<pathData.length; i++) {
								shParams.d+=pathData[i][0]+pathData[i][1].join(" ")+" ";
							}
							shParams.d=shParams.d.substring(0, shParams.d.length-1);
							__.createNode("path", shParams, "", [__.vector.actualElements[a]], "http://www.w3.org/2000/svg");
						}
					}
				},
				shape:function(typesAndCoordsParamsArray, shapeParams) {
					__.vector.shapeToQuadraticCurveTo(typesAndCoordsParamsArray, shapeParams);
					return __.vector.core;
				},
				definedShape:function(type, coordsparams, shapeparams) {
					if (__.vector.actualElements.length===0) {
						__.error("It is necessary to create, load or interpret a vector object before doing that.");
						return false;
					} else {
						var path, shParams, i, a;
						shParams.d=shParams.d.substring(0, shParams.d.length-1);
						for (a=0; a<__.vector.actualElements.length; a++) {
							path=__.vector.convertDefinedShapeToQuadraticCurveTo(type, coordsparams, shapeparams, __.vector.actualElements[a]);
							shParams=__.vector.core.svgParams(shapeParams);
							shParams.d="";
							for (i=0; i<path.length; i++) {
								shParams.d+=path[i][0]+path[i][1].join(" ")+" ";
							}
							__.createNode("path", shParams, "", [__.vector.actualElements[a]], "http://www.w3.org/2000/svg");
						}
						return __.vector.core;
					}
				},
				getLastPath:function(actualelement) {
					var paths=__.findInternal("path", [actualelement]);
					if (paths.length>0) {
						var outerHTML=paths[paths.length-1].outerHTML;
						var d=/d=["|']([^'|"]*)["|']/g.exec(outerHTML);
						if (d!=null) {
							d=d[1];
							var lastPath=null;
							var lastExecStr=/([M])([0-9]*(?:\.[0-9]+)?, ?[0-9]*(?:\.[0-9]+ )?)?([0-9]*(?:\.[0-9]+)?, ?[0-9]*(?:\.[0-9]+)?)(?: ?Z)?$/i.exec(d);
							if (lastExecStr!==null && lastExecStr[1]!=null && lastExecStr[3]!=null) {
								lastPath=[];
								var bCoords=[];
								if (lastExecStr[2]!=null) {
									bCoords=lastExecStr[2].substring(0, lastExecStr[2].length-1).split(" ");
								}
								lastPath=[lastExecStr[1], bCoords.concat([lastExecStr[3]])];
							}
						}
						return lastPath;
					} else {
						return null;
					}
				},
				splitQuadraticBezier:function(pathItem) {
					m0={ x:0.25*pathItem[0][0]+0.5*pathItem[1][0]+0.25*pathItem[2][0], y:0.25*pathItem[0][1]+0.5*pathItem[1][1]+0.25*pathItem[2][1] };
					mA={ x:0.5625*pathItem[0][0]+0.375*pathItem[1][0]+0.0625*pathItem[2][0], y:0.5625*pathItem[0][1]+0.375*pathItem[1][1]+0.0625*pathItem[2][1] };
					mB={ x:0.0625*pathItem[0][0]+0.375*pathItem[1][0]+0.5625*pathItem[2][0], y:0.0625*pathItem[0][1]+0.375*pathItem[1][1]+0.5625*pathItem[2][1] };
					m1={ x:2*mA.x-0.5*m0.x-0.5*pathItem[0][0], y:2*mA.y-0.5*m0.y-0.5*pathItem[0][1] };
					m2={ x:2*mB.x-0.5*m0.x-0.5*pathItem[2][0], y:2*mB.y-0.5*m0.y-0.5*pathItem[2][1] };
					return [["Q", [[m1.x, m1.y], [m0.x, m0.y]]], ["Q", [[m2.x, m2.y], pathItem[2]]]];
				},
				calculateGravityCenters:function(obj, p, i) {
					var j, a;
					var pointsFrom=[];
					var pointsFromSameLevel=[];
					for (j=0; j<obj.from[p][i].length; j++) {
						pointsFrom[j]=[];
						if (obj.from[p][i][j][0]==="M") {
							a=[obj.from[p][i][j][1][0][0], obj.from[p][i][j][1][0][1]];
							pointsFrom[j].push(a);
							pointsFromSameLevel.push(a);
						} else if (obj.from[p][i][j][0]==="Q") {
							a=[0.25*obj.from[p][i][j-1][1][0][0]+0.5*obj.from[p][i][j][1][0][0]+0.25*obj.from[p][i][j][1][1][0], 0.25*obj.from[p][i][j-1][1][0][1]+0.5*obj.from[p][i][j][1][0][1]+0.25*obj.from[p][i][j][1][1][1]];
							pointsFrom[j].push(a);
							pointsFromSameLevel.push(a);
							a=[obj.from[p][i][j][1][1][0], obj.from[p][i][j][1][1][1]];
							pointsFrom[j].push(a);
							pointsFromSameLevel.push(a);
						}
						if (pointsFrom[j].length===0) {
							pointsFrom.splice(j, 1);
						}
					}
					var areaFrom=0;
					var gravityFrom={ x:0, y:0 };
					for (j=0; j<pointsFromSameLevel.length; j++) {
						a=pointsFromSameLevel[j][0]*pointsFromSameLevel[(j+1)%pointsFromSameLevel.length][1]-pointsFromSameLevel[(j+1)%pointsFromSameLevel.length][0]*pointsFromSameLevel[j][1];
						areaFrom+=a;
						gravityFrom.x+=a*(pointsFromSameLevel[j][0]+pointsFromSameLevel[(j+1)%pointsFromSameLevel.length][0]);
						gravityFrom.y+=a*(pointsFromSameLevel[j][1]+pointsFromSameLevel[(j+1)%pointsFromSameLevel.length][1]);
					}
					areaFrom=.5*Math.abs(areaFrom);
					gravityFrom.x/=6*(areaFrom!==0?areaFrom:areaFrom+0.0001);
					gravityFrom.y/=6*(areaFrom!==0?areaFrom:areaFrom+0.0001);
					var pointsTo=[];
					var pointsToSameLevel=[];
					for (j=0; j<obj.to[p][i].length; j++) {
						pointsTo[j]=[];
						if (obj.to[p][i][j][0]==="M") {
							a=[obj.to[p][i][j][1][0][0], obj.to[p][i][j][1][0][1]];
							pointsTo[j].push(a);
							pointsToSameLevel.push(a);
						} else if (obj.to[p][i][j][0]==="Q") {
							a=[0.25*obj.to[p][i][j-1][1][0][0]+0.5*obj.to[p][i][j][1][0][0]+0.25*obj.to[p][i][j][1][1][0], 0.25*obj.to[p][i][j-1][1][0][1]+0.5*obj.to[p][i][j][1][0][1]+0.25*obj.to[p][i][j][1][1][1]];
							pointsTo[j].push(a);
							pointsToSameLevel.push(a);
							a=[obj.to[p][i][j][1][1][0], obj.to[p][i][j][1][1][1]];
							pointsTo[j].push(a);
							pointsToSameLevel.push(a);
						}
						if (pointsTo[j].length===0) {
							pointsTo.splice(j, 1);
						}
					}
					areaTo=0;
					gravityTo={ x:0, y:0 };
					for (j=0; j<pointsToSameLevel.length; j++) {
						a=pointsToSameLevel[j][0]*pointsToSameLevel[(j+1)%pointsToSameLevel.length][1]-pointsToSameLevel[(j+1)%pointsToSameLevel.length][0]*pointsToSameLevel[j][1];
						areaTo+=a;
						gravityTo.x+=a*(pointsToSameLevel[j][0]+pointsToSameLevel[(j+1)%pointsToSameLevel.length][0]);
						gravityTo.y+=a*(pointsToSameLevel[j][1]+pointsToSameLevel[(j+1)%pointsToSameLevel.length][1]);
					}
					areaTo=.5*Math.abs(areaTo);
					gravityTo.x/=6*(areaTo!==0?areaTo:areaTo+0.0001);
					gravityTo.y/=6*(areaTo!==0?areaTo:areaTo+0.0001);
					return { pointsFrom:pointsFrom, pointsTo:pointsTo, gravityFrom:gravityFrom, gravityTo:gravityTo };
				},
				fixesForAnimation:function(obj, p, ignoreRotationOfPoints) {
					var res=[],Z,prefixes,less,more,dist,memDist,maxDist,index,from,to,h,i,j,k,l,m,m1,m2,mem,a,firstQ,records,offset,argFrom=[],argTo=[],from,lessZ,toZ,indexes;
					memDist=Number.POSITIVE_INFINITY;
					Z=false;
					fromValues=[];
					toValues=[];
					prefixes=[];
					if ("opt" in obj.from && obj.from.opt==="counterclockwise") {
						for (i=0; i<obj.from[p].length; i++) {
							firstQ=false;
							from=[];
							for (j=obj.from[p][i].length-1; j>0; j--) {
								if (!firstQ) {
									from.push(["M", [obj.from[p][i][0][1][0]]]);
									firstQ=true;
								}
								if (obj.from[p][i][j][0]==="Z") {
									Z=true;
								} else if (j>1) {
									from.push(["Q", [obj.from[p][i][j][1][0], obj.from[p][i][j-1][1][obj.from[p][i][j-1][1].length-1]]]);
								} else if (j===1) {
									from.push(["Q", [obj.from[p][i][j][1][0], obj.from[p][i][0][1][0]]]);
								}
							}
							if (Z) {
								from.push(["Z", []]);
							}
							obj.from[p][i]=from;
						}
					}
					if ("opt" in obj.to && obj.to.opt==="counterclockwise") {
						for (i=0; i<obj.to[p].length; i++) {
							firstQ=false;
							to=[];
							for (j=obj.to[p][i].length-1; j>0; j--) {
								if (!firstQ) {
									to.push(["M", [obj.to[p][i][0][1][0]]]);
									firstQ=true;
								}
								if (obj.to[p][i][j][0]==="Z") {
									Z=true;
								} else if (j>1) {
									to.push(["Q", [obj.to[p][i][j][1][0], obj.to[p][i][j-1][1][obj.to[p][i][j-1][1].length-1]]]);
								} else if (j===1) {
									to.push(["Q", [obj.to[p][i][j][1][0], obj.to[p][i][0][1][0]]]);
								}
							}
							if (Z) {
								to.push(["Z", []]);
							}
							obj.to[p][i]=to;
						}
					}
					for (i=0; i<obj.to[p].length; i++) {
						while (obj.from[p][i].length!==obj.to[p][i].length) {
							mem=(obj.from[p][i].length<obj.to[p][i].length?"from":"to");
							less=(obj.from[p][i].length<obj.to[p][i].length?__.objectDuplicate(obj.from[p][i], true, true):__.objectDuplicate(obj.to[p][i], true, true));
							lessZ=false;
							if (less[less.length-1][0]==="Z") {
								lessZ=true;
								less.splice(less.length-1, 1);
							}
							j=0;
							dist=0;
							records={ index:-1, points:null };
							maxDist=-0.00001;
							while (++j<less.length) {
								if (less[j][0]==="Q") {
									k=j-1;
									dist=Math.sqrt(Math.pow(less[j][1][less[j][1].length-1][0]-less[k][1][less[k][1].length-1][0],2)+Math.pow(less[j][1][less[j][1].length-1][1]-less[k][1][less[k][1].length-1][1],2));
									if (dist>maxDist) {
										maxDist=dist;
										records.index=j;
										m=__.objectDuplicate(less[j][1], true, true);
										m.splice(0, 0, __.objectDuplicate(less[k][1][less[k][1].length-1], true, true));
										records.points=m;
									}
								}
							}
							m0={ x:0.25*records.points[0][0]+0.5*records.points[1][0]+0.25*records.points[2][0], y:0.25*records.points[0][1]+0.5*records.points[1][1]+0.25*records.points[2][1] };
							mA={ x:0.5625*records.points[0][0]+0.375*records.points[1][0]+0.0625*records.points[2][0], y:0.5625*records.points[0][1]+0.375*records.points[1][1]+0.0625*records.points[2][1] };
							mB={ x:0.0625*records.points[0][0]+0.375*records.points[1][0]+0.5625*records.points[2][0], y:0.0625*records.points[0][1]+0.375*records.points[1][1]+0.5625*records.points[2][1] };
							m1={ x:2*mA.x-0.5*m0.x-0.5*records.points[0][0], y:2*mA.y-0.5*m0.y-0.5*records.points[0][1] };
							m2={ x:2*mB.x-0.5*m0.x-0.5*records.points[2][0], y:2*mB.y-0.5*m0.y-0.5*records.points[2][1] };
							less[records.index][1]=[[m1.x, m1.y], [m0.x, m0.y]];
							less.splice(records.index+1, 0, ["Q", [[m2.x, m2.y], records.points[2]]]);
							if (lessZ) {
								less[less.length]=["Z", []];
							}
							obj[mem][p][i]=less;
						}
						if (!ignoreRotationOfPoints) {
							res[i]=__.vector.core.calculateGravityCenters(obj, p, i);
							index=0;
							toZ=false;
							for (j=0; j<obj.to[p][i].length; j++) {
								if (obj.to[p][i][j][0]==="Z") {
									toZ=true;
								}
							}
							for (j=0; j<res[i].pointsFrom.length; j++) {
								dist=0;
								for (k=0; k<res[i].pointsFrom.length; k++) {
									if (res[i].pointsFrom[k].length===res[i].pointsTo[(k+j)%res[i].pointsFrom.length].length) {
										for (l=0; l<res[i].pointsFrom[k].length; l++) {
											dist+=Math.sqrt(Math.pow((res[i].pointsTo[(k+j)%res[i].pointsFrom.length][l][0]-(res[i].gravityTo.x-res[i].gravityFrom.x))-res[i].pointsFrom[k][l][0],2)+Math.pow((res[i].pointsTo[(k+j)%res[i].pointsFrom.length][l][1]-(res[i].gravityTo.y-res[i].gravityFrom.y))-res[i].pointsFrom[k][l][1],2));
										}
									}
								}
								if (dist<memDist) {
									memDist=dist;
									index=j;
								}
							}
							if (index>1 && index<obj.to[p][i].length-(1+(toZ?1:0))) {
								to=[];
								to[0]=["M", [[obj.to[p][i][index][1][obj.to[p][i][index][1].length-1][0],obj.to[p][i][index][1][obj.to[p][i][index][1].length-1][1]]]];
								for (j=index+1; j<obj.to[p][i].length+index; j++) {
									if (j<obj.to[p][i].length-(toZ?1:0)) {
										to[j-index]=obj.to[p][i][j];
									} else if (j>obj.to[p][i].length-(toZ?1:0) && j%obj.to[p][i].length!==0) {
										to[j-index-1]=obj.to[p][i][j%obj.to[p][i].length];
									} else if (j>obj.to[p][i].length-(toZ?1:0) && j%obj.to[p][i].length===0) {
										var start={ x:obj.to[p][i][0][1][obj.to[p][i][0][1].length-1][0], y:obj.to[p][i][0][1][obj.to[p][i][0][1].length-1][1] };
										to[j-index-1]=["Q",
											[
												[start.x,start.y],
												[start.x,start.y]
											]
										];
									}
								}
								to[to.length]=["Q", obj.to[p][i][index][1]];
								obj.from[p][i].splice(obj.from[p][i].length-(obj.from[p][i][obj.from[p][i].length-1][0]==="Z"?1:0), 0, 
								["Q",
									[
										[obj.from[p][i][0][1][obj.from[p][i][0][1].length-1][0],obj.from[p][i][0][1][obj.from[p][i][0][1].length-1][1]],
										[obj.from[p][i][0][1][obj.from[p][i][0][1].length-1][0],obj.from[p][i][0][1][obj.from[p][i][0][1].length-1][1]]
									]
								]);
								if (toZ) {
									to[to.length]=["Z", []];
								}
								obj.to[p][i]=to;
							}
						}
					}
					return obj;
				},
				makeConcordantPaths:function(obj, more, less, keyMore, viewbox) {
					function trySetIntersect(inter, intersects, p, i, j, g) {
						let dist=Math.sqrt(Math.pow(inter[1].x-g.x, 2)+Math.pow(inter[1].y-g.y, 2)), k;
						if (__.countPropertiesWhereValueEqualsRecursive(intersects[p].indexesI, i)<2) {
							intersects[p].points.push(inter[1]);
							intersects[p].indexesI.push(i);
							intersects[p].indexesJ.push(j);
							intersects[p].dists.push(dist);
							__.quicksort(intersects[p], ["dists"], "numerical", "ascending");
						} else {
							for (k=0; k<intersects[p].dists.length; k++) {
								if (dist<intersects[p].dists[k]) {
									intersects[p].points[k]=inter[1];
									intersects[p].indexesI[k]=i;
									intersects[p].indexesJ[k]=j;
									intersects[p].dists[k]=dist;
									break;
								}
							}
						}
					}
					let i, j, p, q, X, Y, approxGravityCentersMore=[], approxGravityCentersLess=[], path, polygon=[], boundingBox, offset, dist, tmp, firstPointCoords, lastPointCoords, minX=Math.pow(2, 32), minY=Math.pow(2, 32), maxX=-Math.pow(2, 32), maxY=-Math.pow(2, 32);
					let testPoint=function(point){
						if (point.x<minX) {
							minX=point.x;
						}
						if (point.y<minY) {
							minY=point.y;
						}
						if (point.x>maxX) {
							maxX=point.x;
						}
						if (point.y>maxY) {
							maxY=point.y;
						}
					};
					let getApproxGravityCenters=function(list) {
						let approxGravityCenters=[];
						polygon=[];
						for (i=0; i<list.length; i++) {
							for (j=0; j<list[i].length; j++) {
								if (["M", "Q", "Z"].indexOf(more[i][j][0])===-1) {
									__.error("Svgs for animation must be first converted to quadratic Bezier curves");
									return obj;
								}
								if (list[i][j][0]==="Q") {
									middlePoint={ x:__.bezier(lastPointCoords[0], list[i][j][1][1][0], [list[i][j][1][0][0]], 0.5), y:__.bezier(lastPointCoords[1], list[i][j][1][1][1], [list[i][j][1][0][1]], 0.5) };
									lastPointCoords=list[i][j][1][1];
									polygon.push(middlePoint);
									testPoint(polygon[polygon.length-1]);
									polygon.push({ x:lastPointCoords[0], y:lastPointCoords[1] });
									testPoint(polygon[polygon.length-1]);
								} else if (list[i][j][0]==="M") {
									if (j===0) {
										firstPointCoords=list[i][j][1][0];
									}
									lastPointCoords=list[i][j][1][0];
									polygon.push({ x:list[i][j][1][0][0], y:list[i][j][1][0][1] });
									testPoint(polygon[polygon.length-1]);
								} else if (list[i][j][0]==="Z") {
									if (firstPointCoords!==lastPointCoords) {
										polygon.push({ x:firstPointCoords[0], y:firstPointCoords[1] });
										testPoint(polygon[polygon.length-1]);
									}
								}
							}
							let points=[];
							boundingBox={ left:minX, top:minY, width:(maxX-minX), height:(maxY-minY) };
							for (p=minX; p<=maxX; p+=(maxX-minX)/25) {
								for (q=minY; q<=maxY; q+=(maxY-minY)/25) {
									point={ x:p, y:q };
									if (__.isInPolygon(point, polygon)) {
										points.push(point);
									}
								}
							}
							X=0;
							Y=0;
							for (j=0; j<points.length; j++) {
								X+=points[j].x;
								Y+=points[j].y;
							}
							X/=points.length;
							Y/=points.length;
							approxGravityCenters.push({ x:X, y:Y });
						}
						return approxGravityCenters;
					};
					approxGravityCentersMore=getApproxGravityCenters(more);
					approxGravityCentersLess=getApproxGravityCenters(less);
					let dists=[], indexes=[], offsets=[]; m=__.objectDuplicate(approxGravityCentersMore), l=__.objectDuplicate(approxGravityCentersLess), index=-1, o=0;
					while (m.length>0) {
						j=0;
						dist=Math.pow(2, 32);
						while (j<l.length) {
							deltaX=l[j].x-m[i].x;
							deltaY=l[j].y-m[i].y;
							tmp=Math.sqrt(deltaX*deltaX+deltaY*deltaY);
							if (tmp<dist) {
								dist=tmp;
								index=j;
							}
							j++;
						}
						if (m.length>=l.length) {
							dists.push(dist);
							let idx=index;
							for (i=0; i<offsets.length; i++) {
								if (offsets[i]<idx) {
									idx++;
								}
							}
							if (!(idx in indexes)) {
								indexes[idx]=[];
							}
							indexes[idx].push(o);
							m.splice(0, 1);
							o++;
							if (m.length===l.length) {
								l.splice(index, 1);
								offsets.push(idx);
							}
						}
					}
					let v=viewbox.split(" ");
					let diag=Math.sqrt(Math.pow(parseFloat(v[2]), 2)+Math.pow(parseFloat(v[3]), 2)), g, vector, angle, sortedIndexes=[], pointA, pointB, point1, point2, bezier, mid, range, delta, middlePointX, middlePointY, intersects=[], firstPoint;
					// indexes -> affectation of each in the "more" path list to one of the "less" path list
					// we will now order the gravity centers of "more" path list counterclockwise relative to the "less" path list 
					let splittedPath=[];
					//var counter=0;
					for (p in indexes) { // p is index in "less" path list, indexes[p] is list of indexes in "more" path list
						sortedIndexes[p]={ angle:[], index:[], gravityCenter:[] };
						g=approxGravityCentersLess[p];
						/*var pointer=lib("#splashscreen .anim").vector().create("animation-2", { viewbox:viewbox, style:"width:100%; height:100%; position:absolute; top:0; left:0;" });
						console.log(pointer);
						var data=pointer.convertDefinedShapeToQuadraticCurveTo("circle", { r:10, x:g.x, y:g.y }, { }, __.vector.actualElements[0]);
						pointer.freeShapeWithPathDataInputCopy("."+"animation-2", less[p], { fill:"grey", className:"_"+counter }, viewbox);
						counter++;
						pointer.freeShapeWithPathDataInputCopy("."+"animation-2", data, { fill:"red", className:"_"+counter }, viewbox);
						counter++;
						*/
						for (i=0; i<indexes[p].length; i++) {
							vector={ x:approxGravityCentersMore[indexes[p][i]].x-g.x, y:approxGravityCentersMore[indexes[p][i]].y-g.y };
							angle=Math.atan2(-vector.y, vector.x);
							sortedIndexes[p]["angle"].push(angle);
							sortedIndexes[p]["index"].push(i);
							sortedIndexes[p]["gravityCenter"].push(approxGravityCentersMore[indexes[p][i]]);
						}
						intersects[p]={ points:[], indexesI:[], indexesJ:[], dists:[] };
						__.quicksort(sortedIndexes[p], ["angle", "index"], "numerical", "ascending");
						for (i=0; i<sortedIndexes[p]["gravityCenter"].length; i++) {
							j=i<sortedIndexes[p]["gravityCenter"].length-1?i+1:0;
							vector={ x:sortedIndexes[p]["gravityCenter"][j].x-sortedIndexes[p]["gravityCenter"][i].x, y:sortedIndexes[p]["gravityCenter"][j].y-sortedIndexes[p]["gravityCenter"][i].y };
							angle=(Math.atan2(-vector.y, vector.x)+Math.PI/2)%(Math.PI*2);
							pointA={
								x:g.x,
								y:g.y
							};
							pointB={
								x:g.x+Math.cos(angle)*diag,
								y:g.y-Math.sin(angle)*diag
							};
							/*var data=pointer.convertDefinedShapeToQuadraticCurveTo("line", { x1:pointA.x, y1:pointA.y, x2:pointB.x, y2:pointB.y }, { }, __.vector.actualElements[0]);
							pointer.freeShapeWithPathDataInputCopy("."+"animation-2", data, { className:"_"+counter, stroke:"green" }, viewbox);
							counter++;*/
							for (j=0; j<less[p].length; j++) {
								if (less[p][j][0]==="M") {
									point1=less[p][j][1][0];
									firstPoint=point1;
								} else if (less[p][j][0]==="Q") {
									point2=less[p][j][1][1];
									bezier=less[p][j][1][0];
									if (point1.length===2 && point2.length===2) {
										if (__.lineIntersectsLine([{ x:point1[0], y:point1[1] }, { x:point2[0], y:point2[1] }], [pointA, pointB])[0]) {
											console.log(i);
											mid=0.5;
											range=0.5;
											delta=Math.pow(2, 32);
											while (delta>0.1) {
												middlePointX=__.bezier(point1[0], point2[0], [bezier[0]], mid);
												middlePointY=__.bezier(point1[1], point2[1], [bezier[1]], mid);
												range/=2;
												if ((inter=__.lineIntersectsLine([{ x:point1[0], y:point1[1] }, { x:middlePointX, y:middlePointY }], [pointA, pointB]))[0]) {
													mid-=range;
												} else if ((inter=__.lineIntersectsLine([{ x:middlePointX, y:middlePointY }, { x:point2[0], y:point2[1] }], [pointA, pointB]))[0]) {
													mid+=range;
												} else {
													break;
												}
												delta=Math.sqrt(Math.pow(inter[1].x-middlePointX, 2)+Math.pow(inter[1].y-middlePointY, 2));
												if (delta<0.1) {
													console.log("ok");
													trySetIntersect(inter, intersects, p, i, j, g);
												}
											}
										}
									}
									point1=less[p][j][1][1];
								} else if (less[p][j][0]==="Z" && point1!==firstPoint) {
									if ((inter=__.lineIntersectsLine([{ x:point1[0], y:point1[1] }, { x:firstPoint[0], y:firstPoint[1] }], [pointA, pointB]))[0]) {
										trySetIntersect(inter, intersects, p, i, j, g);
									}
								}
							}
						}
						__.quicksort(intersects[p], ["indexesJ"], "numerical", "ascending");
						let treated=[];
						let memSplitQuad=[];
						for (i=0; i<intersects[p].indexesJ.length; i++) {
							splittedPath[i]=[];
							if (__.countPropertiesWhereValueEqualsRecursive(intersects[p].indexesI, intersects[p].indexesI[i])===1) {
								let item=__.objectDuplicate(less[p][intersects[p].indexesJ[i]][1]);
								let prepend=less[p][intersects[p].indexesJ[i]-1>=0?intersects[p].indexesJ[i]-1:less[p].length-1];
								item.splice(0, 0, prepend[1][prepend[1].length-1]);
								let splitQuad=__.vector.core.splitQuadraticBezier(item);
								if (i===0) {
									memSplitQuad=__.objectDuplicate(splitQuad[0]);
								}
								splittedPath[i].push(["M", [splitQuad[0][1][1]]]);
								splittedPath[i].push(splitQuad[1]);
								if (i<intersects[p].indexesJ.length-1) {
									for (j=intersects[p].indexesJ[i]; j<intersects[p].indexesJ[i+1]; j++) {
										if (treated.indexOf(j)===-1) {
											splittedPath[i].push(less[p][j]);
											treated.push(j);
										}
									}
								} else if (i===intersects[p].indexesJ.length-1) {
									for (j=intersects[p].indexesJ[i]; j<less[p].length; j++) {
										if (treated.indexOf(j)===-1 && less[p][j][0]!=="Z") {
											splittedPath[i].push(less[p][j]);
											treated.push(j);
										}
									}
									for (j=0; j<intersects[p].indexesJ[0]; j++) {
										if (treated.indexOf(j)===-1) {
											if (j!==0) {
												splittedPath[i].push(less[p][j]);
												treated.push(j);
											}
										}
									}
								}
								if ((i+1)<intersects[p].indexesJ.length) {
									let item=__.objectDuplicate(less[p][intersects[p].indexesJ[i+1]][1]);
									let prepend=less[p][intersects[p].indexesJ[i+1]-1>=0?intersects[p].indexesJ[i+1]-1:less[p].length-1];
									item.splice(0, 0, prepend[1][prepend[1].length-1]);
									splitQuad=__.vector.core.splitQuadraticBezier(item);
									splittedPath[i].push(["Q", splitQuad[1][1]]);
								} else {
									splittedPath[i].push(memSplitQuad);
								}
								splittedPath[i].push(["Z", []]);
							}
						}
					}
					if (keyMore!=="from") {
						obj.from.d=splittedPath;
						obj.to.d=more;
					} else {
						obj.from.d=more;
						obj.to.d=splittedPath;
					}
					return obj;
				},
				fixesIfMultiplePaths:function(obj, p, viewbox) {
					var j, k=0, slices1=[[]], slices2=[[]], z1=[], z2=[];
					//check if more than one z occurs and split if yes
					for (j=0; j<obj.from[p].length; j++) {
						slices1[k].push(obj.from[p][j]);
						if (obj.from[p][j][0]==="Z") {
							z1.push(j);
							if (j<obj.from[p].length-1) {
								slices1[++k]=[];
							}
						}
					}
					k=0;
					for (j=0; j<obj.to[p].length; j++) {
						slices2[k].push(obj.to[p][j]);
						if (obj.to[p][j][0]==="Z") {
							z2.push(j);
							if (j<obj.to[p].length-1) {
								slices2[++k]=[];
							}
						}
					}
					var ignoreRotationOfPoints=false;
					if (z1.length>1 && z2.length>1 && z1.length===z2.length) {
						obj.from[p]=slices1;
						obj.to[p]=slices2;
					} else if (z1.length===0 && z2.length===0) {
						ignoreRotationOfPoints=true;
						obj.from[p]=[obj.from[p]];
						obj.to[p]=[obj.to[p]];
					} else if (z1.length===1 && z2.length===1) {
						obj.from[p]=[obj.from[p]];
						obj.to[p]=[obj.to[p]];
					} else if (z1.length>=1 && z2.length>=1) {
						ignoreRotationOfPoints=true;
						obj=__.vector.core.makeConcordantPaths(obj, z1.length>z2.length?slices1:slices2, z1.length>z2.length?slices2:slices1, z1.length>z2.length?"from":"to", viewbox);
					} else {
						__.error("Incompatibility of svgs for animation, a path is closed, and one other is opened");
						obj={ from:[], to:[] };
					}
					return { obj:obj, ignoreRotationOfPoints:ignoreRotationOfPoints };
				},
				animateFromTo:function(identifier, obj) {
					var toAnimate=[],fromValues=[],toValues=[],h,i,j,k,b,c,Z,prefixes=[],o,object, p, r;
					var elements=lib(identifier).targets;
					i=0;
					while (i<__.tQ.length) {
						j=0; 
						while (j<__.tQ[i][0].length) {
							if (__.tQ[i][0][j].target===elements[0] && __.tQ[i][0][j].type==="svg") {
								__.tQ[i][0].splice(j--, 1);
							}
							j++;
						}
						if (__.tQ[i][0].length===0) {
							__.tQ.splice(i, 1);
						} else {
							i++;
						}
					}
					if (!("duration" in obj)) {
						obj.duration=1000;
					}
					if (!("easing" in obj)) {
						obj.easing=false;
					}
					if (elements.length===1 && "from" in obj && "to" in obj) {
						t=elements[0];
						while (t.tagName.toLowerCase()!=="svg" && t.parentNode!==null) {
							t=t.parentNode;
						}
						let viewbox='';
						if (t.tagName.toLowerCase()==="svg") {
							viewbox=t.getAttribute("viewbox");
						}
						for (p in obj.from) {
							object=false;
							if (p==="d") {
								if (obj.treat) {
									r=__.vector.core.fixesIfMultiplePaths(obj, p, viewbox);
									obj=__.vector.core.fixesForAnimation(r.obj, p, r.ignoreRotationOfPoints);
									o={ from:obj.from, to:obj.to };
									for (var prop in obj) {
										if (["from","to"].indexOf(prop)===-1) {
											o[prop]=obj[prop];
										}
									}
									obj=o;
								}
								for (i=0; i<obj.from[p].length; i++) {
									for (j=0; j<obj.from[p][i].length; j++) {
										if (obj.to[p][i][j][0]!=="Z") {
											prefixes.push(obj.to[p][i][j][0]);
											if (obj.from[p][i][j][1].length===obj.to[p][i][j][1].length) {
												if (obj.from[p][i][j][1].length>0) {
													for (l=0; l<obj.from[p][i][j][1].length; l++) {
														fromValues.push(obj.from[p][i][j][1][l][0]);
														toValues.push(obj.to[p][i][j][1][l][0]);
														prefixes.push(",");
														fromValues.push(obj.from[p][i][j][1][l][1]);
														toValues.push(obj.to[p][i][j][1][l][1]);
														if (l<obj.from[p][i][j][1].length-1) {
															prefixes.push(",");
														}
													}
												}
											}
										} else {
											prefixes.push("Z");
											fromValues.push(null);
											toValues.push(null);
										}
									}
								}
								object={ 
									target:null,
									properties:[p],
									start:{ value:fromValues, unit:null, suffix:false, separator:"" },
									end:{ value:toValues, unit:null, suffix:false, separator:"" },
									prefixes:prefixes
								};
							} else if (p!=="opt") {
								start=__.getValueAndPrepareForAnimation(obj.from[p]);
								end=__.getValueAndPrepareForAnimation(obj.to[p]);
								if (end.prefix==start.prefix) {
									object={ 
										target:null,
										properties:[__.vector.core.svgParam(p)],
										start:start,
										end:end
									};
								}
							}
							if (object) {
								for (h=0; h<elements.length; h++) {
									object.target=elements[h];
									toAnimate.push(object);
								}
							}
						}
						var uid=__.guid();
						__.tQ.push([toAnimate, { startTime:new Date().getTime(), duration:obj.duration, easing:obj.easing }, uid]);
						if (!__.rAnimFrameID) {
							__.animLoop();
						}
						setTimeout(function() { __.timerComplete(uid); }, obj.duration);
					} else if (elements.length>1 && "from" in obj && "to" in obj) {
						for (h=0; h<elements.length; h++) {
							t=elements[h];
							while (t.tagName.toLowerCase()!=="svg" && t.parentNode!==null) {
								t=t.parentNode;
							}
							let viewbox='';
							if (t.tagName.toLowerCase()==="svg") {
								viewbox=t.getAttribute("viewbox");
							}
							for (p in obj.from) {
								object=false;
								if (p==="d") {
									if (obj.treat) {
										r=__.vector.core.fixesIfMultiplePaths(obj, p, viewbox);
										obj=__.vector.core.fixesForAnimation(r.obj, p, r.ignoreRotationOfPoints);
										o={ from:obj.from, to:obj.to };
										for (var prop in obj) {
											if (["from","to"].indexOf(prop)===-1) {
												o[prop]=obj[prop];
											}
										}
										obj=o;
									}
									for (i=0; i<obj.from[p].length; i++) {
										for (j=0; j<obj.from[p][i].length; j++) {
											if (obj.to[p][i][j][0]!=="Z") {
												prefixes.push(obj.to[p][i][j][0]);
												if (obj.from[p][i][j][1].length===obj.to[p][i][j][1].length) {
													if (obj.from[p][i][j][1].length>0) {
														for (l=0; l<obj.from[p][i][j][1].length; l++) {
															fromValues.push(obj.from[p][i][j][1][l][0]);
															toValues.push(obj.to[p][i][j][1][l][0]);
															prefixes.push(",");
															fromValues.push(obj.from[p][i][j][1][l][1]);
															toValues.push(obj.to[p][i][j][1][l][1]);
															if (l<obj.from[p][i][j][1].length-1) {
																prefixes.push(",");
															}
														}
													}
												}
											} else {
												prefixes.push("Z");
												fromValues.push(null);
												toValues.push(null);
											}
										}
									}
									object={ 
										target:null,
										properties:[p],
										start:{ value:fromValues, unit:null, suffix:false, separator:"" },
										end:{ value:toValues, unit:null, suffix:false, separator:"" },
										prefixes:prefixes
									};
								} else if (p!=="opt") {
									start=__.getValueAndPrepareForAnimation(obj.from[p]);
									end=__.getValueAndPrepareForAnimation(obj.to[p]);
									if (end.prefix==start.prefix) {
										object={ 
											target:null,
											properties:[__.vector.core.svgParam(p)],
											start:start,
											end:end
										};
									}
								}
								if (object) {
									object.target=elements[h];
									toAnimate.push(object);
								}
							}
							var uid=__.guid();
							__.tQ.push([toAnimate, { startTime:new Date().getTime(), duration:obj.duration, easing:obj.easing }, uid]);
							if (!__.rAnimFrameID) {
								__.animLoop();
							}
							setTimeout(function() { __.timerComplete(uid); }, obj.duration);
						}
					}
					return { from:obj.from.d, to:obj.to.d };
				},
				create:function(vectorClassName, params) {
					params["class"]=vectorClassName;
					params["version"]="1.1";
					params["xmlns"]="http://www.w3.org/2000/svg";
					params["xmlns:xlink"]="http://www.w3.org/1999/xlink";
					var elements=__.createNode("svg", params, "", __.vector.containers, "http://www.w3.org/2000/svg").targets;
					__.vector.actualElements=elements;
					return __.vector.core;
				},
				destroy:function(className) {
					var elements;
					if (__.d.querySelectorAll) {
						var e=__.d.querySelectorAll('.'+className);
						for (p in e) {
							elements.push(e[p]);
						}
					} else {
						elements=__.querySelectorAllReplacement('.'+className, __.d);
					}
					for (var i=0; i<elements.length; i++) {
						__.remove(elements[i]);
					}
					return __.vector.core;
				},
				selectGroupByClassName:function(groupClassName) {
					__.vector.actualElements=[];
					if (__.d.querySelectorAll) {
						var e=__.d.querySelectorAll('.'+groupClassName);
						for (p in e) {
							__.vector.actualElements.push(e[p]);
						}
					} else {
						__.vector.actualElements=__.querySelectorAllReplacement('.'+groupClassName, __.d);
					}
					return __.vector.core;
				},
				addGroup:function(vectorClassName, groupClassName, groupId="") {
					var nodes=[];
					for (var i=0; i<__.vector.actualElements.length; i++) {
						if ((nodes=lib("."+vectorClassName+" ."+groupClassName).targets).length===0) {
							nodes=nodes.concat(lib("."+vectorClassName).createNode("g", { className:groupClassName }, "", "http://www.w3.org/2000/svg").targets);
						}
					}
					return __.vector.core;
				},
				addClipPath:function(vectorClassName, clipPathClassName, clipPathId="") {
					var nodes=[];
					for (var i=0; i<__.vector.actualElements.length; i++) {
						if ((nodes=lib("."+vectorClassName+" ."+clipPathClassName).targets).length===0) {
							nodes=nodes.concat(lib("."+vectorClassName).createNode("clipPath", { className:clipPathClassName }, "", "http://www.w3.org/2000/svg").targets);
						}
					}
					return __.vector.core;
				},
				selectGroupsForVector:function(vectorClassName) {
					__.vector.actualElements=[];
					if (__.d.querySelectorAll) {
						var e=__.d.querySelectorAll('.'+vectorClassName+" g");
						for (p in e) {
							__.vector.actualElements.push(e[p]);
						}
					} else {
						__.vector.actualElements=__.querySelectorAllReplacement('.'+vectorClassName+" g", __.d);
					}
					return __.vector.core;
				},
				removeAllGroupsForVector:function(vectorClassName) {
					var elements=[];
					if (__.d.querySelectorAll) {
						var e=__.d.querySelectorAll('.'+vectorClassName+" g");
						for (p in e) {
							elements.push(e[p]);
						}
					} else {
						elements=__.querySelectorAllReplacement('.'+vectorClassName+" g", __.d);
					}
					__.remove(elements);
					return __.vector.core;
				},
				
				applyToActiveElement:function(params) {
					for (var i=0; i<__.vector.actualElements.length; i++) {
						for (var prop in params) {
							__.setPropertyValueDeep(params[prop], __.vector.actualElements[i], __.getPropertiesContainingValues(params, null));
						}
					}
					return __.vector.core;
				},
				applyToGroup:function(vectorClassName, params, groupClassName) {
					var elements=__.querySelectorAllReplacement('.'+vectorClassName+' .'+groupClassName, __.d);
					for (var i=0; i<elements.length; i++) {
						for (var prop in params) {
							__.setPropertyValueDeep(params[prop], elements[i], __.getPropertiesContainingValues(params, null));
						}
					}
					return __.vector.core;
				},
				applyToClipPath:function(vectorClassName, params, clipPathClassName) {
					var elements=__.querySelectorAllReplacement('.'+vectorClassName+' .'+clipPathClassName, __.d);
					for (var i=0; i<elements.length; i++) {
						for (var prop in params) {
							__.setPropertyValueDeep(params[prop], elements[i], __.getPropertiesContainingValues(params, null));
						}
					}
					return __.vector.core;
				},
				defs:function(selector) {
					if (typeof(selector)==="string") {
						__.vector.actualElements=lib(selector).targets;
					}
					if (__.vector.actualElements.length>0) {
						var nodes=[];
						if ((nodes=lib(__.vector.actualElements).find("defs").targets).length===0) {
							nodes=lib(__.vector.actualElements).createNodeAtIndex("defs", 0, { }, "", "http://www.w3.org/2000/svg").targets;
						}
						__.vector.actualElements=nodes;
					}
					return __.vector.core;
				},
				clipPath:function(selector, suffix) {
					if (typeof(selector)==="string") {
						__.vector.actualElements=lib(selector).targets;
					}
					if (__.vector.actualElements.length>0) {
						var nodes=[];
						if ((nodes=lib(__.vector.actualElements).find("clipPath").targets).length===0) {
							nodes=lib(__.vector.actualElements).createNode("clipPath", { id:"clipPath"+suffix }, "", "http://www.w3.org/2000/svg").targets;
						}
						__.vector.actualElements=nodes;
					}
					return __.vector.core;
				},
				mask:function(selector, suffix) {
					if (typeof(selector)==="string") {
						__.vector.actualElements=lib(selector).targets;
					}
					if (__.vector.actualElements.length>0) {
						var nodes=[];
						if ((nodes=lib(__.vector.actualElements).find("mask").targets).length===0) {
							nodes=lib(__.vector.actualElements).createNode("mask", { id:"mask"+suffix }, "", "http://www.w3.org/2000/svg").targets;
						}
						__.vector.actualElements=nodes;
					}
					return __.vector.core;
				},
				findRootNode:function(arborescence) {
					var svg;
					for (var i=0; i<arborescence.length; i++) {
						if (arborescence[i].type==="element" && arborescence[i].name==="svg") {
							svg=arborescence[i];
							return svg;
						} else if (!!(svg=__.vector.core.findRootNode(arborescence[i].content))) {
							return svg;
						}
					}
					return false;
				},
				loadSVG:function(src, overRideParams, callback) {
					__.ajax({ 
						type:"GET",
						data:null,
						url:src,
						onsuccess:function(data) {
							var res=__.parseMarkupLanguage(data.d);
							var parsedSVG=__.vector.core.findRootNode(res);
							if (__.isObject(parsedSVG)) {
								for (var i=0; i<parsedSVG.attributes.length; i++) {
									if (parsedSVG.attributes[i].name in data.params) {
										parsedSVG.attributes[i].value=data.params[parsedSVG.attributes[i].name];
										delete data.params[parsedSVG.attributes[i].name];
									}
								}
								for (var p in data.params) {
									index=parsedSVG.attributes.length;
									parsedSVG.attributes[index]={};
									parsedSVG.attributes[index].name=p;
									parsedSVG.attributes[index].type="attribute";
									parsedSVG.attributes[index].value=data.params[p];
								}
								if (typeof(callback)==="function") {
									callback(parsedSVG);
								}
							}
						},
						onfail:function(data) { __.error(data.d); },
						addparams:{ params:overRideParams }
					});
					return __.vector.core;
				},
				prepareSVG:function(svg, overRideParams, callback) {
					var res=__.parseMarkupLanguage(svg.outerHTML);
					var parsedSVG=__.vector.core.findRootNode(res);
					if (__.isObject(parsedSVG)) {
						for (var i=0; i<parsedSVG.attributes.length; i++) {
							if (parsedSVG.attributes[i].name in overRideParams) {
								parsedSVG.attributes[i].value=overRideParams[parsedSVG.attributes[i].name];
								delete overRideParams[parsedSVG.attributes[i].name];
							}
						}
						for (var p in overRideParams) {
							index=parsedSVG.attributes.length;
							parsedSVG.attributes[index]={};
							parsedSVG.attributes[index].name=p;
							parsedSVG.attributes[index].type="attribute";
							parsedSVG.attributes[index].value=overRideParams[p];
						}
						if (typeof(callback)==="function") {
							callback(parsedSVG);
						}
					}
				},
				add:function(loadedSVG, vectorClassName) {
					var i, params;
					if (__.isObject(loadedSVG)) {
						loadedSVG=__.vector.core.fixSVGForAnimation(loadedSVG, __.vector.containers);
						params={};
						for (i=0; i<loadedSVG.attributes.length; i++) {
							params[loadedSVG.attributes[i].name]=loadedSVG.attributes[i].value;
						}
						__.vector.core.create(vectorClassName, params);
						__.appendOrPrependHtmlRecursively(__.vector.actualElements, loadedSVG.content, true, "append");
					} else if (__.isObject(__.vector.svg)) {
						__.vector.svg=__.vector.core.fixSVGForAnimation(__.vector.svg, __.vector.containers);
						params={};
						for (i=0; i<__.vector.svg.attributes.length; i++) {
							params[__.vector.svg.attributes[i].name]=__.vector.svg.attributes[i].value;
						}
						__.vector.core.create(vectorClassName, params);
						__.appendOrPrependHtmlRecursively(__.vector.actualElements, __.vector.svg.content, true, "append");
					} else {
						__.error("add : You are required to load an element (method loadSVG) before adding it !");
					}
					return __.vector.core;
				},
				addNodesTo:function(nodes, target) {
					var element;
					for (var i=0; i<nodes.length; i++) {
						element=__.createNode(nodes[i].tagName, nodes[i].params, "", [target], "http://www.w3.org/2000/svg").targets;
						if (nodes[i].innerArborescence.length>0) {
							__.vector.core.addNodesTo(nodes[i].innerArborescence, element);
						}
					} 
				},
				fixSVGForAnimation:function(parsedSVG, containers) {
					var rootSVG=parsedSVG;
					var rootSVGviewbox;
					var browseSVG=function(parsedNode, currentTransforms, isRoot, withdrawal, baseAttributes) {
						var i,j,viewbox,enableBackground,preserveAspectRatio,width,height,transform;
						if (parsedNode.name.toLowerCase()==="svg") {
							for (i=0; i<parsedNode.attributes.length; i++) {
								switch (parsedNode.attributes[i].name.toLowerCase()) {
									case "viewbox":
										viewbox=parsedNode.attributes[i].value.split(" ");
										if (isRoot) {
											rootSVGviewbox=viewbox;
										}
									break;
									case "enable-background":
										enableBackground=parsedNode.attributes[i].value.split(" ");
									break;
									case "preserveaspectratio":
										preserveAspectRatio=parsedNode.attributes[i].value.split(" ");
									break;
									case "width":
										width=parsedNode.attributes[i].value;
									break;
									case "height":
										height=parsedNode.attributes[i].value;
									break;
									case "style":
										style=parsedNode.attributes[i].value.split(/ ?; ?/);
										for (j=0; j<style.length; j++) {
											style[j]=style[j].split(":");
											switch (style[j][0].toLowerCase()) {
												case "transform":
													transform=style[j][1].split(" ");
												break;
												case "width":
													if (typeof(width)==="undefined") {
														width=style[j][1];
													}
												break;
												case "height":
													if (typeof(height)==="undefined") {
														height=style[j][1];
													}
												break;
											}
										}
									break;
								}
							}
							if (viewbox && width && height) {
								var w,h;
								if (__.getUnit(width)===__.getUnit(height) && __.getUnit(width)!=="%") {
									w=width;
									h=height;
								} else {
									var tmp=__.createNode("div", { style:"width:"+width+"; height:"+height+";" }, "", [containers[0]]).targets;
									w=tmp[0].offsetWidth;
									h=tmp[0].offsetHeight;
									__.remove([tmp]);
								}
								if (parseInt(viewbox[2],10)/parseInt(viewbox[3],10)!==parseFloat(w)/parseFloat(h)) {
									if (!preserveAspectRatio) { // assume default values for preserve aspect ratio
										preserveAspectRatio=["xMidYMid","meet"];
									}
									if (!(1 in preserveAspectRatio)) {
										preserveAspectRatio[1]="meet";
									}
									switch (preserveAspectRatio[0].substring(0,4)) {
										case "none":
											currentTransforms.push({ scale:[1,(parseFloat(h)/parseFloat(w))] });
											viewbox[3]=parseInt(viewbox[2],10)*(parseFloat(h)/parseFloat(w));
										break;
										case "xMin":
											switch (preserveAspectRatio[1]) {
												case "meet":
												break;
												case "slice":
												break;
											}
										break;
										case "xMid":
											switch (preserveAspectRatio[1]) {
												case "meet":
												break;
												case "slice":
												break;
											}
										break;
										case "xMax":
											switch (preserveAspectRatio[1]) {
												case "meet":
												break;
												case "slice":
												break;
											}
										break;
									}
									if (preserveAspectRatio[0].length===8) {
										switch (preserveAspectRatio[0].substring(4,8)) {
											case "YMin":
												switch (preserveAspectRatio[1]) {
													case "meet":
													break;
													case "slice":
													break;
												}
											break;
											case "YMid":
												switch (preserveAspectRatio[1]) {
													case "meet":
													break;
													case "slice":
													break;
												}
											break;
											case "YMax":
												switch (preserveAspectRatio[1]) {
													case "meet":
													break;
													case "slice":
													break;
												}
											break;
										}
									}
								}
								for (i=0; i<parsedNode.content.length; i++) {
									browseSVG(parsedNode.content[i], currentTransforms, false, isRoot?0:-1+withdrawal, baseAttributes);
								}
							} else if (width && height) {
								var tmp=__.createNode("div", { style:"width:"+width+"; height:"+height+"; visibility:hidden;" }, "", [containers[0]]).targets;
								w=tmp[0].offsetWidth;
								h=tmp[0].offsetHeight;
								__.remove([tmp]);
								parsedNode.attributes.push({ name:"viewbox", type:"attribute", value:"0 0 "+w+" "+h });
								for (i=0; i<parsedNode.content.length; i++) {
									browseSVG(parsedNode.content[i], currentTransforms, false, isRoot?0:-1+withdrawal, baseAttributes);
								}
							} else if (!isRoot) {
								var x,y;
								for (i=0; i<parsedNode.attributes.length; i++) {
									switch (parsedNode.attributes[i].name.toLowerCase()) {
										case "x":
											x=parsedNode.attributes[i].value;
										break;
										case "y":
											y=parsedNode.attributes[i].value;
										break;
									}
								}
								if (x || y) {
									var findLastViewBox=function() {
										var r=parsedNode.parent,vb=false;
										while (r.parent!==null) {
											if (r.name==="svg") {
												for (i=0; i<r.attributes.length; i++) {
													if (r.attributes[i].name==="viewbox") {
														vb=r.attributes[i].value;
													}
												}
												if (vb) {
													break;
												}
											} else {
												r=r.parent;
											}
										}
										return vb;
									};
									var vb=findLastViewBox();
									if (vb) {
										vb=vb.split(" ");
									}
									if (x && __.getUnit(x)!==null) {
										if (!/%/.test(__.getUnit(x))) {
											x=__.convertUnits(containers[0], "left", x, __.getUnit(x), "px");
											x=x/containers[0].offsetHeight*rootSVGviewbox[2];
										} else {
											if (vb) {
												x=x/parseInt(vb[2],10)*100;
											}
										}
									}
									if (y && __.getUnit(y)!==null) {
									 	if (!/%/.test(__.getUnit(y))) {
											y=__.convertUnits(containers[0], "top", y, __.getUnit(y), "px");
											y=y/containers[0].offsetHeight*rootSVGviewbox[3];
										} else {
											var vb=findLastViewBox();
											if (vb) {
												y=y/parseInt(vb[3],10)*100;
											}
										}
									}
									currentTransforms.push({ translate:[x?x:0,y?y:0]});
								}
								for (i=0; i<parsedNode.content.length; i++) {
									browseSVG(parsedNode.content[i], currentTransforms, false, -1+withdrawal, baseAttributes);
								}
							} else {
								__.error("sorry, the loaded svg cannot be computed because either width, height or viewbox are not defined.");
								rootSVG=[];
							}
						} else if (/g|a/.test(parsedNode.name.toLowerCase())) {
							for (i=0; i<parsedNode.attributes.length; i++) {
								if (parsedNode.attributes[i].name.toLowerCase()==="transform") {
									transform=parsedNode.attributes[i].value.split(" ");
								} else if (!/href|target/.test(parsedNode.attributes[i].name)) {
									baseAttributes.push(parsedNode.attributes[i]);
								}
							}
							for (i=0; i<parsedNode.content.length; i++) {
								browseSVG(parsedNode.content[i], currentTransforms, false, -1+withdrawal, baseAttributes);
							}
						} else {
							switch (parsedNode.name.toLowerCase()) {
								case "rect":
									
								break;
								case "circle":
									
								break;
								case "ellipse":
									
								break;
								case "polygon":
									
								break;
								case "path":
									for (var p in __.vector.pathRegExp) {
										if (__.vector.pathRegExp[p].test(data)) {
										}
									}
								break;
							}
						}
					}
					browseSVG(rootSVG, [], true, 0, []);
					return rootSVG;
				}
			}
			if (!__.vector.supportsSVG) {
				for (var p in __.vector.core) {
					if (typeof(__.vector.core[p])==="function") {
						__.vector.core[p]=function() {
							__.error("sorry, svg is not supported in your environment");
							return __.vector.core;
						}
					}
				}
			}
			return __.vector.core;
		},
		pad:function(str, length, chr, pos) {
			while (str.length<length) {
				str=(pos=="before"?chr+str:str+chr);
			}
			return str;
		},
		unicodeInterpreter:function(str) {
			var i=0;
			while (i<str.length) {
				var sub=str.substring(i, i+7);
				if (/^[^\\]\\u[A-F0-9]{4}$/i.test(sub)) {
					var uni=String.fromCharCode(__.decToHex("0x"+sub.substring(3)));
					str=str.substring(0, i+1)+uni+str.substring(i+7);
					i-=7;
				}
				i++;
			}
			return str;
		},
		convToUnicodeSequence:function(str) {
			return str.replace(/[^\x00-\x7F]/g, function(c) { return "\\u"+__.pad(c.charCodeAt(0).toString(16), 4, "0", "before"); });
		},
		regMatchCount:function(reg, str) {
			var i=0;
			var count=0;
			if (str.match(reg)) {
				ex=reg.exec(str);
				while (ex!=null) {
					str=str.substring(ex.index+1);
					ex=reg.exec(str);
					count++;
				}
				return count;
			} else return 0;
		},
		matrix:{
			createNull:function(size) {
				var c, l, res=[];
				if (__.isArray(size) && size.length===2) {
					for (c=0; c<size[0]; c++) {
						res[c]=[];
						for (l=0; l<size[1]; l++) {
							res[c][l]=0;
						}
					}
					return res;
				} else {
					return false;
				}
			},
			identity:function(size) {
				var c, l, res=[];
				if (__.isArray(size) && size.length===2) {
					for (c=0; c<size[0]; c++) {
						res[c]=[];
						for (l=0; l<size[1]; l++) {
							if (c===l) {
								res[c][l]=1;
							} else {
								res[c][l]=0;
							}
						}
					}
					return res;
				} else {
					return false;
				}
			},
			size:function(m) {
				var c, size=[];
				size[0]=m.length;
				for (c=0; c<m.length; c++) {
					if (!(1 in size)) {
						size[1]=m[c].length;
					} else if (1 in size && size[1]!==m[c].length) {
						__.error("malformed matrix");
						return false;
					}
				}
				return size;
			},
			resize:function(m, size) {
				var c, l;
				var sizeO=__.matrix.size(m);
				if (size[0]>=sizeO[0] && size[1]>=sizeO[1]) {
					for (c=sizeO[0]; c<size[0]; c++) {
						m[c]=[];
						for (l=sizeO[1]; l<size[1]; l++) {
							if (c===l) {
								m[c][l]=1;
							} else {
								m[c][l]=0;
							}
						}
					}
				}
				return m;
			},
			parseMatrix:function(str) {
				if (/matrix(?:3d)?\((.+)\)/.test(str)) {
					var sub=/matrix(?:3d)?\((.+)\)/.exec(str)[1];
					var split=sub.split(/\s*,\s*/), res=[], c, l, lines;
					if (split.length===4) {
						lines=2;
					} else if (split.length===6) {
						lines=2;
					} else if (split.length===9) {
						lines=3;
					} else if (split.length===12) {
						lines=3;
					} else if (split.length===16) {
						lines=4;
					} else {
						return false;
					}
					for (var i=0; i<split.length; i++) {
						if (__.regs.jsNumber.test(split[i])) {
							c=i%lines;
							if (!(c in res)) {
								res[c]=[];
							}
							l=parseInt(i/lines, 10);
							res[c][l]=parseFloat(split[i]);
						} else {
							return false;
						}
					}
					return res;
				}
				return false;
			},
			pseudoequals:function(m1, m2, decimalsTolerance) {
				if (typeof(decimalsTolerance)==="undefined") {
					decimalsTolerance=3;
				}
				var size1=__.matrix.size(m1);
				var size2=__.matrix.size(m2);
				if (size1 && size2) {
					if (size1.join("|")!==size2.join("|")) {
						total1=size1[0]+size1[1];
						total2=size2[0]+size2[1];
						if (total1<total2) {
							m1=__.matrix.resize(m1, size2);
							size1=size2;
						} else {
							m2=__.matrix.resize(m2, size1);
							size2=size1;
						}
					}
					for (c=0; c<size1[0]; c++) {
						for (l=0; l<size1[1]; l++) {
							if (m1[c][l].toFixed(decimals)!==m2[c][l].toFixed(decimals)) {
								return false;
							}
						}
					}
					return true;
				} else {
					return false;
				}
			},
			setTranslate:function(m, tx, ty, tz) {
				var size=__.matrix.size(m);
				if (size) {
					for (var c=0; c<size[0]; c++) {
						for (var l=0; l<size[1]; l++) {
							if ((["3|2","3|3"].indexOf(size.join("|"))!==1?c===2:c===3) && l+1 in arguments && !isNaN(arguments[l+1])) {
								m[c][l]=arguments[l+1];
							}
						}
					}
					return m;
				}
				return false;
			},
			setScale:function(m, sx, sy, sz) {
				var size=__.matrix.size(m);
				if (size) {
					for (var c=0; c<size[0]; c++) {
						for (var l=0; l<size[1]; l++) {
							if (c===l && l+1 in arguments && !isNaN(arguments[l+1])) {
								m[c][l]=arguments[l+1];
							}
						}
					}
					return m;
				}
				return false;
			},
			setSkew:function(m, skewX, skewY) {
				if (arguments.length===2) {
					arguments.push('0deg');
				}
				if (/deg$/.test(arguments[1].toString())) {
					arguments[1]=parseFloat(arguments[1])*Math.PI/180;
				} else {
					arguments[1]=parseFloat(arguments[1]);
				}
				if (/deg$/.test(arguments[2].toString())) {
					arguments[2]=parseFloat(arguments[2])*Math.PI/180;
				} else {
					arguments[2]=parseFloat(arguments[2]);
				}
				var size=__.matrix.size(m);
				if (size) {
					for (var c=0; c<size[0]; c++) {
						for (var l=0; l<size[1]; l++) {
							if ((c===0 && l===1 || c===1 && l===0) && c+1 in arguments && !isNaN(arguments[c+1])) {
								m[c][l]=Math.tan(arguments[c+1]);
							}
						}
					}
					return m;
				}
				return false;
			},
			setRotation:function(m, a, x, y, z) {
				if (arguments.length>=2) {
					var radians;
					if (/deg$/.test(a.toString())) {
						radians=parseFloat(a)*Math.PI/180;
					} else {
						radians=parseFloat(a);
					}
					var size=__.matrix.size(m);
					if (size) {
						if (arguments.length===2) {
							var rot=[[Math.cos(radians),Math.sin(radians)],[-Math.sin(radians),Math.cos(radians)]];
							for (var c=0; c<size[0]; c++) {
								for (var l=0; l<size[1]; l++) {
									if (c<2 && l<2) {
										m[c][l]=rot[c][l];
									} else if (c===2 && l===2) {
										m[c][l]=1;
									} else {
										m[c][l]=0;
									}
								}
							}
							return m;
						} else if (arguments.length===5) {
							var normalized=__.vector().normalize({ x:x, y:y, z:z });
							x=normalized.x;
							y=normalized.y;
							z=normalized.z;
							var rot=[[1+(1-Math.cos(radians))*(Math.pow(x, 2)-1), -z*Math.sin(radians)+x*y*(1-Math.cos(radians)), y*Math.sin(radians)+x*z*(1-Math.cos(radians))], [z*Math.sin(radians)+x*y*(1-Math.cos(radians)), 1+(1-Math.cos(radians))*(Math.pow(y, 2)-1), -x*Math.sin(radians)+y*z*(1-Math.cos(radians))], [-y*Math.sin(radians)+x*z*(1-Math.cos(radians)), x*Math.sin(radians)+y*z*(1-Math.cos(radians)), 1+(1-Math.cos(radians))*(Math.pow(z, 2)-1)]];
							for (var c=0; c<size[0]; c++) {
								for (var l=0; l<size[1]; l++) {
									if (c<3 && l<3) {
										m[c][l]=rot[c][l];
									} else if (c===3 && l===3) {
										m[c][l]=1;
									} else {
										m[c][l]=0;
									}
								}
							}
							return m;
						}
						return false;
					}
					return false;
				}
				return false;
			},
			transpose:function(m) {
				var size=__.matrix.size(m);
				if (size) {
					var transposed=[];
					for (var l=0; l<size[1]; l++) {
						transposed[l]=[];
						for (var c=0; c<size[0]; c++) {
							transposed[l][c]=m[c][l];
						}
					}
					return transposed;
				}
				return false;
			},
			invert:function(m) {
				return __.matrix.multiplyByScalar(__.matrix.cofactorMatrix(m), 1/__.matrix.determinant(m));
			},
			cofactorMatrix:function(m) {
				var size=__.matrix.size(m);
				if (__.isArray(size) && size.length===2 && size[0]===size[1] && size[0]>=2) {
					var c, l, i, j, res=[];
					for (c=0; c<m.length; c++) {
						var tempMatrix=[];
						res[c]=[];
						for (l=0; l<m[0].length; l++) {
							i=0;
							tempMatrix[l]=[];
							for (j=0; j<m.length; j++) {
								if (j!=c) {
									tempMatrix[l][i]=m[c][j];
									i++;
								}
							}
							res[c][l]=Math.pow(-1, c+l)*__.matrix.determinant(tempMatrix);
						}
					}
					return res;
				}
				__.error("matrix: you should use a square matrix");
				return false;
			},
			multiplyByScalar:function(m, s) {
				var size=__.matrix.size(m), i, j;
				if (__.isArray(size) && size.length===2) {
					var res=[];
					for (c=0; c<m.length; c++) {
						res[c]=[];
						for (l=0; l<m[0].length; l++) {
							res[c][l]=m[c][l]*s;
						}
					}
					return res;
				}
				__.error("matrix: you should use a two dimensions matrix");
				return false;
			},
			product:function(m1, m2) {
				var res=[];
				var i,j,k;
				var size1=__.matrix.size(m1);
				var size2=__.matrix.size(m2);
				if (size1 && size2 && size1[1]===size2[0]) { 
					for (l=0; l<size1[1]; l++) {
						for (c=0; c<size2[0]; c++) {
							if (c<size1[0]) {
								if (!(c in res)) {
									res[c]=[];
								}
								N=size1[1];
								for (k=0; k<N; k++) {
									if (!(l in res[c])) {
										res[c][l]=0;
									}
									res[c][l]+=m1[c][k]*m2[k][l];
								}
							}
						}
					}
					return res;
				} else {
					__.error("matrix: column count of first matrix doesn't equal to line count of second matrix");
					return false;
				}
			},
			toFixed:function(m, decimals) {
				var size=__.matrix.size(m);
				if (size) {
					for (var c=0; c<size[0]; c++) {
						for (var l=0; l<size[1]; l++) {
							m[c][l]=parseFloat(m[c][l].toFixed(decimals));
							if (Math.abs(m[c][l])===0) {
								m[c][l]=0;
							}
						}
					}
					return m;
				}
				return false;
			},
			applyMatrixTo2DPoint:function(m, point2D) {
				var size=__.matrix.size(m), P;
				if (size && size[1]===3) {
					P=[[point2D.x,point2D.y,1]];
					var res=__.matrix.product(P,m);
					if (res) {
						return { x:res[0][0], y:res[0][1] };
					}
					return false;
				} else if (size && size[1]===2) {
					P=[[point2D.x,point2D.y]];
					var res=__.matrix.product(P,m);
					if (res) {
						return { x:res[0][0], y:res[0][1] };
					}
					return false;
				}
				return false;
			},
			applyMatrixTo3DPoint:function(m, point3D) {
				var P=[[point3D.x,point3D.y,point3D.z,1]];
				if (size && size[1]===4) {
					var res=__.matrix.product(P,m);
					if (res) {
						return { x:res[0][0], y:res[0][1], z:res[0][2] };
					}
					return false;
				}
				return false;
			},
			determinant:function(m) {
				var count=0;
				var i,j,k,l;
				for (i=0; i<m.length; i++) {
					if (i==0) {
						count=m[i].length;
					} else if (m[i].length!=count) {
						__.error("matrix: column count may not vary!");
						return false;
					} else if (i==m.length-1 && i+1!=count) {
						__.error("matrix: line count must equal column count!");
						return false;
					} else if (i==m.length-1 && count<2) {
						__.error("matrix: square matrix should be of second order minimum!");
						return false;
					}
				}
				var det=0;
				if (count>2) {
					for (i=0; i<m.length; i++) {
						var tempMatrix=[];
						for (j=1; j<m.length; j++) {
							l=0;
							tempMatrix[j-1]=[];
							for (k=0; k<m.length; k++) {
								if (k!=i) {
									tempMatrix[j-1][l]=m[j][k];
									l++;
								}
							}
						}
						det+=Math.pow(-1, i)*m[0][i]*__.matrix.determinant(tempMatrix);
					}
					return det;
				} else if (count==2) {
					return m[0][0]*m[1][1]-m[0][1]*m[1][0];
				}
			}
		},
		windowWH:function() {
			var width = window.innerWidth || __.d.documentElement.clientWidth || document.body.clientWidth;
			var height = window.innerHeight || __.d.documentElement.clientHeight || document.body.clientHeight;
			return { w:width, h:height };
		},
		truncationPreservingHTML:function(str, len) {
			var i=0,k=0,ex1;
			while (i<str.length) {
				if (str.substring(i).match(/<[^>]+>/)) {
					ex1=/<[^>]+>/.exec(str.substring(i));
					if (ex1!=null && !ex1[0].match(/script|style/)) {
						i+=ex1[0].length;
					} else if (ex1!=null && ex1[0].match(/script|style/)) {
						ex2=/script|style/.exec(ex1[0]);
						while (!str.substring(i).match(RegExp('^<\/'+ex2[0]+'>'))) {
							i++;
						}
					}
				} else {
					if (k>len) {
						str=str.subtr(0, i)+str.subtr(i+1);
					}
					k++;
					i++;
				}
			}
			return str;
		},
		trim:function(str) {
			return str.replace(/^\s+|\s+$/g,'');
		},
		querySelectorAllReplacement:function(v, base) {
			var i,str,pre,elements,element;
			if (base) {
				elements=[base];
			} else {
				elements=[];
			}
			if (typeof(v)==="string") {
				if (["window", "document"].indexOf(v)==-1) {
					pre=__.querySelectorParseMultiple(v, false);
					elements=__.querySelectorParseSubString(pre, elements, (elements.length>0?"filiation":null), true);
					var elementsCopy=__.objectDuplicate(elements, true);
					while (elementsCopy.length>0) {
						element=elementsCopy[0];
						elementsCopy.splice(0,1);
						if (elementsCopy.indexOf(element)!=-1 || element==null) {
							elements.splice(elements.indexOf(element),1);
						}
					}
					return elements;
				} else {
					switch(v) {
						case "window":
					 		return [window];
					 	break;
					 	case "document":
					 		return [__.d];
					 	break;
					}
				}
			} else {
				return [];
			}
		},
		multipleWordsSelectors:{
			filiation:/^([^\+~> ]*) +([^\+~>\s]+) *$/,
			after:/^([^\+~> ]*) *\+ *([^=\s]+) *$/,
			before:/^([^\+~> ]*) *~ *([^=\s]+) *$/,
			directFiliation:/^([^\+~> ]*) *> *(\S+) *$/
		},
		querySelectorParseMultiple:function(str, subProcess) {
			var o, selO, memIndex, ex;
			var ret=[];
			if (str!=="") {
				var exp=__.explode(",", str);
				for (var i=0; i<exp.length; i++) {
					exp[i]=__.trim(exp[i]);
					memIndex=10000;
					selO=[];
					for (var p in __.multipleWordsSelectors) {
						ex=__.multipleWordsSelectors[p].exec(exp[i]);
						if (ex!==null) {
							switch(p) {
								case "filiation":
									o={};
									o.node=__.querySelectorParseMultiple(exp[i].substring(0, ex.index), true)["node"];
									o.filiation=__.querySelectorParseMultiple(ex[2], true);
								break;
								case "directFiliation":
									o={};
									o.node=__.querySelectorParseMultiple(exp[i].substring(0, ex.index+(1 in ex && typeof(ex[1])!=="undefined"?ex[1].length:-ex.index)), true)["node"];
									o.directFiliation=__.querySelectorParseMultiple(ex[2], true);
								break;
								case "after":
									o={};
									o.node=__.querySelectorParseMultiple(exp[i].substring(0, ex.index+(1 in ex && typeof(ex[1])!=="undefined"?ex[1].length:-ex.index)), true)["node"];
									o.after=__.querySelectorParseMultiple(ex[2], true);
								break;
								case "before":
									o={};
									o.node=__.querySelectorParseMultiple(exp[i].substring(0, ex.index+(1 in ex && typeof(ex[1])!=="undefined"?ex[1].length:-ex.index)), true)["node"];
									o.before=__.querySelectorParseMultiple(ex[2], true);
								break;
							}
							if (ex.index+(1 in ex && typeof(ex[1])!=="undefined"?ex[1].length:0)<memIndex) {
								memIndex=ex.index+(1 in ex && typeof(ex[1])!=="undefined"?ex[1].length:0);
								selO=o;
							}
							break;
						}
					}
					ret[i]=[];
					if (__.countNotNullValues(selO)>0) {
						ret[i]=selO;
						selO=[];
					} else {
						ret[i]['node']=exp[i];
					}
				}
				if (ret.length==1 && subProcess) {
					return ret[0];
				} else {
					return ret;
				}
			} else {
				return { node:"this" };
			}
		},
		querySelectorParseSubString:function(pre, elements, relation, bool) {
			var ret=[];
			for (var i=0; i<pre.length; i++) {
				if ("node" in pre[i] && "filiation" in pre[i]) {
					ret=ret.concat(__.querySelectorParseSubString([pre[i]["filiation"]], pre[i]["node"]!=="this"?__.querySelectorParseAndGetSimple(pre[i]["node"], elements, relation):elements, "filiation", false));
				} else if ("node" in pre[i] && "directFiliation" in pre[i]) {
					ret=ret.concat(__.querySelectorParseSubString([pre[i]["directFiliation"]], pre[i]["node"]!=="this"?__.querySelectorParseAndGetSimple(pre[i]["node"], elements, relation):elements, "directFiliation", false));
				} else if ("node" in pre[i] && "before" in pre[i]) {
					ret=ret.concat(__.querySelectorParseSubString([pre[i]["before"]], pre[i]["node"]!=="this"?__.querySelectorParseAndGetSimple(pre[i]["node"], elements, relation):elements, "before", false));
				} else if ("node" in pre[i] && "after" in pre[i]) {
					ret=ret.concat(__.querySelectorParseSubString([pre[i]["after"]], pre[i]["node"]!=="this"?__.querySelectorParseAndGetSimple(pre[i]["node"], elements, relation):elements, "after", false));
				} else if ("node" in pre[i]) {
					ret=ret.concat(__.querySelectorParseAndGetSimple(pre[i]["node"], elements, relation, false));
				}
			}
			return ret;
		},
		simpleWordsSelectors:{ 
			all:/^\*/, 
			tagName:/^([^\.#\[\:]+)/, 
			className:/^\.([^\.#\[\:]+)/,
			id:/^#([^\.#\[\:]+)/, 
			attribute:/^\[([^=~\|\^\$\*\]]+)\]/, 
			attributeWithValue:/^\[([^=~\|\^\$\*]+)=([^=~\|\^\$\*\]]+)\]/g, 
			attributeContainingValue:/^\[([^=~\|\^\$\*]+)~=([^=~\|\^\$\*\]]+)\]/g, 
			attributeStartingWithValue:/^\[([^=~\|\^\$\*]+)\|=([^=~\|\^\$\*\]]+)\]/g, 
			attributeStartingWithSubstring:/^\[([^=~\|\^\$\*]+)\^=([^=~\|\^\$\*\]]+)\]/g, 
			attributeEndingWithSubstring:/^\[([^=~\|\^\$\*]+)\$=([^=~\|\^\$\*\]]+)\]/g, 
			attributeContainingSubstring:/^\[([^=~\|\^\$\*]+)\*=([^=~\|\^\$\*\]]+)\]/g,
			active:/^\:active/,
			checked:/^\:checked/,
			disabled:/^\:disabled/,
			enabled:/^\:enabled/,
			empty:/^\:empty/,
			firstChild:/^\:first-child/,
			firstOfType:/^\:first-of-type/,
			focus:/^\:focus/,
			hover:/^\:hover/,
			inRange:/^\:in-range/,
			invalid:/^\:invalid/,
			lang:/^\:lang\(([^\)]+)\)/,
			lastChild:/^\:last-child/,
			lastOfType:/^\:last-of-type/,
			link:/^\:link/,
			not:/^\:not\(([^\)]+)\)/,
			nthChild:/^\:nth-child\(([^\)]+)\)/,
			nthLastChild:/^\:nth-last-child\(([^\)]+)\)/,
			nthLastOfType:/^\:nth-last-of-type\(([^\)]+)\)/,
			nthOfType:/^\:nth-of-type\(([^\)]+)\)/,
			onlyOfType:/^\:only-of-type/,
			onlyChild:/^\:only-child/,
			optional:/^\:optional/,
			outOfRange:/^\:out-of-range/,
			readOnly:/^\:read-only/,
			readWrite:/^\:read-write/,
			required:/^\:required/,
			root:/^\:root/,
			target:/^\:target/,
			valid:/^\:valid/,
			visited:/^\:visited/
		},
		svgNoClass:["defs","marker","desc","filter","feblend","fecolormatrix","fecomponenttransfer","fecomposite","feconvolvematrix","fediffuselighting","fedisplacementmap","feflood","fegaussianblur","feimage","femerge","femorphology","feoffset","fespecularlighting","fetile","feturbulence"],
		svgFull:["svg","g","clipPath","image","path","line","polyline","rect","circle","ellipse","polygon","defs","marker","desc","filter","feblend","fecolormatrix","fecomponenttransfer","fecomposite","feconvolvematrix","fediffuselighting","fedisplacementmap","feflood","fegaussianblur","feimage","femerge","femorphology","feoffset","fespecularlighting","fetile","feturbulence"],
		svgAnim:["path","line","polyline","rect","circle","ellipse","polygon"],
		decisionTable: {
			all: {
				nil: function(elements, ret, ex, i, j, temp) {
					ret = [];
					temp = __.d.getElementsByTagName("*");
					return temp;
				},
				fiiation: function(elements, ret, ex, i, j, temp) {
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							ret = ret.concat(temp);
						}
					} else {
						ret = [];
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].childNodes;
							for (j = 0; j < temp.length; j++) {
								if (temp[j].nodeName!=="#text") {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						ret = [];
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if (__countProperties(t = __.getPreviousSiblingOmittingTextNodes(elements[i]))>0) {
								ret.push(t);
							}
						}
					} else {
						ret = [];
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if (__countProperties(t = __.getNextSiblingOmittingTextNodes(elements[i]))>0) {
								ret.push(t);
							}
						}
					} else {
						ret = [];
					}
					return ret;
				}
			},
			tagName: {
				nil: function(elements, ret, ex, i, j, temp) {
					ret = [];
					temp = __.d.getElementsByTagName(ex[1]);
					return temp;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName(ex[1]);
							ret = ret.concat(temp);
						}
					} else {
						ret = [];
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (elements.length > 0 && ret.length === 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ("childNodes" in elements[i]) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if ("tagName" in elements[i].childNodes[j] && elements[i].childNodes[j].tagName.toLowerCase() == ex[1].toLowerCase()) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((t = __.getPreviousSiblingOmittingTextNodes(elements[i])).tagName.toLowerCase() == ex[1].toLowerCase()) {
								ret.push(t);
							}
						}
					} else {
						ret = [];
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((t = __.getNextSiblingOmittingTextNodes(elements[i])).tagName.toLowerCase() == ex[1].toLowerCase()) {
								ret.push(t);
							}
						}
					} else {
						ret = [];
					}
					return ret;
				}
			},
			className: {
				nil: function(elements, ret, ex, i, j, temp) {
					var className;
					if (ret.length == 0) {
						if (elements.length > 0) {
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									if ((className = temp[j].getAttribute("class")) !== null) {
										if (className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
											ret.push(temp[j]);
										}
									}
								}
							}
						} else {
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if ((className = temp[j].getAttribute("class")) !== null) {
									if (className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
										ret.push(temp[j]);
									}
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if ((className = ret[i].getAttribute("class")) !== null) {
								if (!className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
									ret.splice(i, 1);
								} else {
									i++;
								}
							} else {
								ret.splice(i, 1);
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					var className;
					if (elements.length > 0 && ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if ("getAttribute" in temp[j] && (className = temp[j].getAttribute("class")) !== null) {
									if (className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
										ret.push(temp[j]);
									}
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if ("getAttribute" in ret[i] && (className = ret[i].getAttribute("class")) !== null) {
								if (!className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
									ret.splice(i, 1);
								} else {
									i++;
								}
							} else {
								ret.splice(i, 1);
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (elements.length > 0 && ret.length === 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if ("getAttribute" in elements[i].childNodes[j] && (className = elements[i].childNodes[j].getAttribute("class")) !== null) {
									if (className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if ("getAttribute" in ret[i] && (className = ret[i].getAttribute("class")) !== null) {
								if (!className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
									ret.splice(i, 1);
								} else {
									i++;
								}
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0 && ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((className = (t = __.getPreviousSiblingOmittingTextNodes(elements[i])).getAttribute("class")) !== null) {
								if (className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
									ret.push(t);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if ("getAttribute" in ret[i] && (className = ret[i].getAttribute("class")) !== null) {
								if (!className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
									ret.splice(i, 1);
								} else {
									i++;
								}
							} else {
								ret.splice(i, 1);
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0 && ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((className = (t = __.getNextSiblingOmittingTextNodes(elements[i])).getAttribute("class")) !== null) {
								if (className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
									ret.push(t);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if ("getAttribute" in ret[i] && (className = ret[i].getAttribute("class")) !== null) {
								if (!className.toString().match(RegExp('\\b' + ex[1] + '\\b'))) {
									ret.splice(i, 1);
								} else {
									i++;
								}
							} else {
								ret.splice(i, 1);
							}
						}
					}
					return ret;
				}
			},
			id: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementById(ex[1]) !== null ? [__.d.getElementById(ex[1])] : [];
					} else {
						i = 0;
						while (i < ret.length) {
							if (ret[i].id != ex[1]) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (elements.length > 0 && ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if (temp[j].id == ex[1]) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (ret[i].id != ex[1]) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (elements.length > 0 && ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if (elements[i].childNodes[j].id == ex[1]) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (ret[i].id != ex[1]) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0 && ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((t = __.getPreviousSiblingOmittingTextNodes(elements[i])).id == ex[1]) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (ret[i].id != ex[1]) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0 && ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((t = __.getNextSiblingOmittingTextNodes(elements[i])).id == ex[1]) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (ret[i].id != ex[1]) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			attribute: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							if (ex[1] in temp[j]) {
								ret.push(temp[j]);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if (ex[1] in temp[j]) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if (ex[1] in elements[i].childNodes[j]) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						for (i = 0; i < elements.length; i++) {
							if (ex[1] in (t = __.getPreviousSiblingOmittingTextNodes(elements[i]))) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if (ex[1] in (t = __.getNextSiblingOmittingTextNodes(elements[i]))) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			attributeWithValue: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							if ((ex[1] in temp[j]) && temp[j][ex[1]] === ex[2]) {
								ret.push(temp[j]);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] === ex[2])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							var temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if ((ex[1] in temp[j]) && temp[j][ex[1]] === ex[2]) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] == ex[2])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if ((ex[1] in elements[i].childNodes[j]) && elements[i].childNodes[j][ex[1]] == ex[2]) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] == ex[2])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getPreviousSiblingOmittingTextNodes(elements[i]))) && t[ex[1]] == ex[2]) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] === ex[2])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getNextSiblingOmittingTextNodes(elements[i]))) && t[ex[1]] == ex[2]) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] === ex[2])) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			attributeContainingValue: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							if ((ex[1] in temp[j]) && temp[j][ex[1]] !== null && temp[j][ex[1]].toString().indexOf(ex[2]) != -1) {
								ret.push(temp[j]);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) != -1)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if ((ex[1] in temp[j]) && temp[j][ex[1]] !== null && temp[j][ex[1]].toString().indexOf(ex[2]) != -1) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) != -1)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if ((ex[1] in elements[i].childNodes[j]) && ex[1] in elements[i].childNodes[j] && elements[i].childNodes[j][ex[1]].toString().indexOf(ex[2]) != -1) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) != -1)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getPreviousSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) != -1) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) != -1)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getNextSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) != -1) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) != -1)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			attributeStartingWithValue: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							if ((ex[1] in temp[j]) && temp[j][ex[1]] !== null && temp[j][ex[1]].toString().indexOf(ex[2]) == 0) {
								ret.push(temp[j]);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							var temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if ((ex[1] in temp[j]) && temp[j][ex[1]].toString().indexOf(ex[2]) == 0) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if ((ex[1] in elements[i].childNodes[j]) && ex[1] in elements[i].childNodes[j] && elements[i].childNodes[j][ex[1]].toString().indexOf(ex[2]) == 0) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getPreviousSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) == 0) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getNextSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) == 0) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			attributeStartingWithSubstring: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if ((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if ((ex[1] in elements[i].childNodes[j]) && ex[1] in elements[i].childNodes[j] && elements[i].childNodes[j][ex[1]].toString().indexOf(ex[2]) == 0) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getPreviousSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) == 0) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getNextSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) == 0) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]].toString().indexOf(ex[2]) == 0)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			attributeEndingWithSubstring: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							if (temp[j][ex[1]].toString().indexOf(ex[2]) == temp[j][ex[1]].toString().length - ex[2].length) {
								ret.push(temp[j]);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if (temp[j][ex[1]].toString().indexOf(ex[2]) == temp[j][ex[1]].toString().length - ex[2].length) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if ((ex[1] in elements[i].childNodes[j]) && elements[i].childNodes[j][ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getPreviousSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getNextSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) == ret[i][ex[1]].toString().length - ex[2].length)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			attributeContainingSubstring: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							if ((ex[1] in temp[j]) && temp[j][ex[1]] !== null && temp[j][ex[1]].toString().indexOf(ex[2]) != -1) {
								ret.push(temp[j]);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!((ex[1] in ret[i]) && ret[i][ex[1]] !== null && ret[i][ex[1]].toString().indexOf(ex[2]) != -1)) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							temp = elements[i].getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								if ((ex[1] in temp[j]) && temp[j][ex[1]].toString().indexOf(ex[2]) != -1) {
									ret.push(temp[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i]) || ret[i][ex[1]].toString().indexOf(ex[2]) == -1) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							for (j = 0; j < elements[i].childNodes.length; j++) {
								if (((ex[1] in elements[i].childNodes[j])) && elements[i].childNodes[j][ex[1]].toString().indexOf(ex[2]) != -1) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i]) || ret[i][ex[1]].toString().indexOf(ex[2]) == -1) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						var t;
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getPreviousSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) != -1) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i]) || ret[i][ex[1]].toString().indexOf(ex[2]) == -1) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						var t;
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((ex[1] in (t = __.getNextSiblingOmittingTextNodes(elements[i]))) && t[ex[1]].toString().indexOf(ex[2]) != -1) {
								ret.push(t);
							}
						}
					} else {
						i = 0;
						while (i < ret.length) {
							if (!(ex[1] in ret[i]) || ret[i][ex[1]].toString().indexOf(ex[2]) == -1) {
								ret.splice(i, 1);
							} else {
								i++;
							}
						}
					}
					return ret;
				}
			},
			active: {
				nil: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					var nohash = __.address.nohash();
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("a");
						var tmp = __.d.getElementsByTagName("area");
						for (var z = 0; z < tmp.length; z++) {
							ret.push(tmp[z]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].href != nohash && ret[i].href != nohash + hash) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					var nohash = __.address.nohash();
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("a");
							var tmp = __.d.getElementsByTagName("area");
							for (var z = 0; z < tmp.length; z++) {
								ret.push(tmp[z]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("a");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
								tmp = __.d.getElementsByTagName("area");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].href != nohash && ret[i].href != nohash + hash) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					var nohash = __.address.nohash();
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if ((elements[i].childNodes[j].tagName.toLowerCase() == "a" || elements[i].childNodes[j].tagName.toLowerCase() == "area") && (elements[i].childNodes[j].href == nohash || elements[i].childNodes[j].href == nohash + hash)) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					var nohash = __.address.nohash();
					var t;
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							t = __.getPreviousSiblingOmittingTextNodes(elements[i]);
							if ((t.tagName.toLowerCase() == "a" || t.tagName.toLowerCase() == "area") && (t.href == nohash || t.href == nohash + hash)) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						}
					} else {
						ret = [];
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					var nohash = __.address.nohash();
					var t;
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							t = __.getNextSiblingOmittingTextNodes(elements[i]);
							if ((t.tagName.toLowerCase() == "a" || t.tagName.toLowerCase() == "area") && (t.href == nohash || t.href == nohash + hash)) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						}
					} else {
						ret = [];
					}
					return ret;
				}
			},
			checked: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("input");
					}
					i = 0;
					while (i < ret.length) {
						if (["checkbox", "radio"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].checked) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("input");
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("input");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (["checkbox", "radio"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].checked) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if (elements[i].childNodes[j].tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(elements[i].childNodes[j].type.toString().toLowerCase()) != -1) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].checked) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								t = __.getPreviousSiblingOmittingTextNodes(elements[i]);
								if (t.tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(t.type.toString().toLowerCase()) != -1) {
									ret.push(t);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].checked) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								t = __.getNextSiblingOmittingTextNodes(elements[i]);
								if ((t.tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(t.type.toString().toLowerCase()) != -1)) {
									ret.push(t);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].checked) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			disabled: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("input");
					}
					i = 0;
					while (i < ret.length) {
						if (["checkbox", "radio"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("input");
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("input");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (["checkbox", "radio"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if (elements[i].childNodes[j].tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(elements[i].childNodes[j].type.toString().toLowerCase()) != -1) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								t = __.getPreviousSiblingOmittingTextNodes(elements[i]);
								if (t.tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(t.type.toString().toLowerCase()) != -1) {
									ret.push(t);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var t;
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								t = __.getNextSiblingOmittingTextNodes(elements[i]);
								if (t.tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(t.type.toString().toLowerCase()) != -1) {
									ret.push(t);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			enabled: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("input");
					}
					i = 0;
					while (i < ret.length) {
						if (["checkbox", "radio"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("input");
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("input");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (["checkbox", "radio"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if (elements[i].childNodes[j].tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(elements[i].childNodes[j].type.toString().toLowerCase()) != -1) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getPreviousSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(__.getPreviousSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getNextSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["checkbox", "radio"].indexOf(__.getNextSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].disabled) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			empty: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!("childNodes" in ret[i]) || ret[i].childNodes.length > 0) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!("childNodes" in ret[i]) || ret[i].childNodes.length > 0) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!("childNodes" in ret[i]) || ret[i].childNodes.length > 0) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!("childNodes" in ret[i]) || ret[i].childNodes.length > 0) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!("childNodes" in ret[i]) || ret[i].childNodes.length > 0) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			firstChild: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.firstChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.firstChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.firstChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.firstChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.firstChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			firstOfType: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.firstNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.firstNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.firstNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.firstNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.firstNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			focus: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.d.activeElement != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.d.activeElement != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.d.activeElement != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.d.activeElement != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.d.activeElement != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			inRange: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			invalid: {
				nil: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				before: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				after: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				}
			},
			lang: {
				nil: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				before: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				after: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				}
			},
			lastChild: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.lastChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.lastChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.lastChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.lastChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.lastChild != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			lastOfType: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.lastNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.lastNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.lastNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.lastNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.lastNodeOfType(ret[i].parentNode, ret[i].tagName) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			link: {
				nil: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				before: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				after: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				}
			},
			not: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isNot(ret[i], ex[1])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isNot(ret[i], ex[1])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isNot(ret[i], ex[1])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isNot(ret[i], ex[1])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!__.isNot(ret[i], ex[1])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			nthChild: {
				nil: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			nthLastChild: {
				nil: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastChild(ret[i].parentNode, n) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			nthLastOfType: {
				nil: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthLastOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			nthOfType: {
				nil: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var n = parseInt(ex[1], 10);
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && __.nthOfType(ret[i].parentNode, n, ret[i].tagName.toLowerCase()) != ret[i]) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			onlyOfType: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && !__.onlyNodeOfType(ret[i].parentNode, ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && !__.onlyNodeOfType(ret[i].parentNode, ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && !__.onlyNodeOfType(ret[i].parentNode, ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && !__.onlyNodeOfType(ret[i].parentNode, ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && !__.onlyNodeOfType(ret[i].parentNode, ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			onlyChild: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.childNodes.length != 1) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.childNodes.length != 1) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.childNodes.length != 1) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.childNodes.length != 1) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (("parentNode" in ret[i]) && ret[i].parentNode.childNodes.length != 1) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			optional: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("input");
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("input");
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("input");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if (elements[i].childNodes[j].tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(elements[i].childNodes[j].type.toString().toLowerCase()) != -1) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getPreviousSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getPreviousSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getNextSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getNextSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			outOfRange: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [];
						temp = __.d.getElementsByTagName("*");
						for (j = 0; j < temp.length; j++) {
							ret.push(temp[j]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = [];
							temp = __.d.getElementsByTagName("*");
							for (j = 0; j < temp.length; j++) {
								ret.push(temp[j]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								temp = elements[i].getElementsByTagName("*");
								for (j = 0; j < temp.length; j++) {
									ret.push(temp[j]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									ret.push(elements[i].childNodes[j]);
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (__.isInRange(ret[i])) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			readOnly: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("input");
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("input");
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("input");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if (elements[i].childNodes[j].tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(elements[i].childNodes[j].type.toString().toLowerCase()) != -1) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getPreviousSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getPreviousSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getNextSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getNextSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			readWrite: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("input");
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("input");
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("input");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if (elements[i].childNodes[j].tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(elements[i].childNodes[j].type.toString().toLowerCase()) != -1) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getPreviousSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getPreviousSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getNextSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getNextSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].readonly) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			required: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("input");
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("input");
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("input");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(ret[i].type.toString().toLowerCase()) == -1 || !ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if (elements[i].childNodes[j].tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(elements[i].childNodes[j].type.toString().toLowerCase()) != -1) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getPreviousSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getPreviousSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								if (__.getNextSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "input" && ["button", "checkbox", "color", "date", "datetime", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"].indexOf(__.getNextSiblingOmittingTextNodes(elements[i]).type.toString().toLowerCase()) != -1) {
									ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
								}
							}
						} else {
							ret = [];
						}
					}
					i = 0;
					while (i < ret.length) {
						if (!ret[i].required) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				}
			},
			root: {
				nil: function(elements, ret, ex, i, j, temp) {
					if (ret.length == 0) {
						ret = [__.d.documentElement];
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					__.error("Impossible scheme, this node is root");
					return [];
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					__.error("Impossible scheme, this node is root");
					return [];
				},
				before: function(elements, ret, ex, i, j, temp) {
					__.error("Impossible scheme, this node is root");
					return [];
				},
				after: function(elements, ret, ex, i, j, temp) {
					__.error("Impossible scheme, this node is root");
					return [];
				}
			},
			target: {
				nil: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					if (ret.length == 0) {
						ret = __.d.getElementsByTagName("a");
						var tmp = __.d.getElementsByTagName("area");
						for (var z = 0; z < tmp.length; z++) {
							ret.push(tmp[z]);
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].name != hash) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					if (ret.length == 0) {
						if (elements[0] == null) {
							ret = __.d.getElementsByTagName("a");
							var tmp = __.d.getElementsByTagName("area");
							for (var z = 0; z < tmp.length; z++) {
								ret.push(tmp[z]);
							}
						} else {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								var tmp = __.d.getElementsByTagName("a");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
								tmp = __.d.getElementsByTagName("area");
								for (var z = 0; z < tmp.length; z++) {
									ret.push(tmp[z]);
								}
							}
						}
					}
					i = 0;
					while (i < ret.length) {
						if (ret[i].name != hash) {
							ret.splice(i, 1);
						} else {
							i++;
						}
					}
					return ret;
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					if (ret.length == 0) {
						if (elements.length > 0) {
							ret = [];
							for (i = 0; i < elements.length; i++) {
								for (j = 0; j < elements[i].childNodes.length; j++) {
									if ((elements[i].childNodes[j].tagName.toLowerCase() == "a" || elements[i].childNodes[j].tagName.toLowerCase() == "area") && elements[i].childNodes[j].name == hash) {
										ret.push(elements[i].childNodes[j]);
									}
								}
							}
						} else {
							ret = [];
						}
					}
					return ret;
				},
				before: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((__.getPreviousSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "a" || __.getPreviousSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "area") && __.getPreviousSiblingOmittingTextNodes(elements[i]).name == hash) {
								ret.push(__.getPreviousSiblingOmittingTextNodes(elements[i]));
							}
						}
					} else {
						ret = [];
					}
					return ret;
				},
				after: function(elements, ret, ex, i, j, temp) {
					var hash = __.address.hash();
					if (elements.length > 0) {
						ret = [];
						for (i = 0; i < elements.length; i++) {
							if ((__.getNextSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "a" || __.getNextSiblingOmittingTextNodes(elements[i]).tagName.toLowerCase() == "area") && __.getNextSiblingOmittingTextNodes(elements[i]).name == hash) {
								ret.push(__.getNextSiblingOmittingTextNodes(elements[i]));
							}
						}
					} else {
						ret = [];
					}
					return ret;
				}
			},
			valid: {
				nil: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				before: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				after: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				}
			},
			visited: {
				nil: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				filiation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				directFiliation: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				before: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				},
				after: function(elements, ret, ex, i, j, temp) {
					__.error("Not implemented yet");
					return [];
				}
			}
		},
		getPreviousSiblingOmittingTextNodes:function(element) {
			var t=element.previousSibling;
			while (t!==null && t.nodeName==="#text" && t.previousSibling!==null) {
				t=t.previousSibling;
			}
			return t!==null && "tagName" in t?t:{};
		},
		getNextSiblingOmittingTextNodes:function(element) {
			var t=element.nextSibling;
			while (t!==null && t.nodeName==="#text" && t.nextSibling!==null) {
				t=t.nextSibling;
			}
			return t!==null && "tagName" in t?t:{};
		},
		querySelectorParseAndGetSimple:function(string, elements, relation) {
			var svgNodeTypes=__.svgFull;
			var temp,ret,ex,match;
			var ret=[];
			string=__.trim(string);
			if (string.length>0) {
				while (string.length>0) {
					match=false;
					for (var sWS in __.simpleWordsSelectors) {
						if ((ex=__.simpleWordsSelectors[sWS].exec(string))!=null) {
							if (/^attribute(.+)$/.test(sWS)) {
								ex[2]=ex[2].replace(/^['|"](.*)['|"]$/, "$1");
							}
							match=true;
							relation=(relation==null?"nil":relation);
							ret=__.decisionTable[sWS][relation](elements, ret, ex, temp);
							if (ret.length==0) {
								return ret;
							}
							if (ex.index==0) {
								string=string.substring(ex[0].length);
							}
							break;
						}
					}
					if (!match) {
						break;
					}
				}
				return ret;
			} else {
				return elements;
			}
		},
		firstNodeOfType:function(parent, tagName) {
			var ret=null;
			if (("childNodes" in parent) && parent.childNodes.length>0) {
				for (var i=0; i<parent.childNodes.length; i++) {
					if (ret!=null && parent.childNodes[i].tagName.toLowerCase()==tagName) {
						ret=parent.childNodes[i];
					}
				}
			}
			return ret;
		},
		lastNodeOfType:function(parent, tagName) {
			var ret=null;
			if (("childNodes" in parent) && parent.childNodes.length>0) {
				for (var i=0; i<parent.childNodes.length; i++) {
					if (parent.childNodes[i].tagName.toLowerCase()==tagName) {
						ret=parent.childNodes[i];
					}
				}
			}
			return ret;
		},
		onlyNodeOfType:function(parent, node) {
			var count=0;
			if (("childNodes" in parent) && parent.childNodes.length>0) {
				for (var i=0; i<parent.childNodes.length; i++) {
					if (parent.childNodes[i].tagName.toLowerCase()==node.tagName) {
						count++;
					}
				}
			}
			return (count==1?true:false);
		},
		isInRange:function(element) {
			var sel=__.selection();
			var textNodes=sel.getNodes();
			var inRange=[];
			var i, parent;
			for (i=0; i<textNodes.length; i++) {
				if (inRange.indexOf(textNodes[i].parentNode)==-1) {
					inRange.push(textNodes[i].parentNode);
					parent=textNodes[i].parentNode;
					while ((parent=parent.parentNode)!=sel.commonAncestorContainer()) {
						if (inRange.indexOf(parent)==-1) {
							inRange.push(parent);
						}
					}
				}
			}
			var ret=false;
			for (i=0; i<inRange.length; i++) {
				if (inRange[i]==element) {
					ret=true;
				}
			}
			return ret;
		},
		nthChild:function(parent, number) {
			var count=0;
			if (!isNaN(number) && ("childNodes" in parent) && parent.childNodes.length>0) {
				var i=0; while (i<parent.childNodes.length) {
					if (parent.childNodes[i].nodeName==="#text" && parent.childNodes[i].textContent.match(/^\s+$/)) {
						number++;
					} else {
						if (i==number-1) {
							return parent.childNodes[i];
						}
					}
					i++;
				}
			}
		},
		nthLastChild:function(parent, number) {
			var count=0;
			if (!isNaN(number) && ("childNodes" in parent) && parent.childNodes.length>0) {
				var i=parent.childNodes.length-1; while (i>=0) {
					if (parent.childNodes[i].nodeName==="#text" && parent.childNodes[i].textContent.match(/^\s+$/)) {
						number--;
					} else {
						if (i==number-1) {
							return parent.childNodes[i];
						}
					}
					i--;
				}
			}
		},
		nthOfType:function(parent, number, type) {
			var count=0;
			if (!isNaN(number) && ("childNodes" in parent) && parent.childNodes.length>0) {
				for (var i=0; i<parent.childNodes.length; i++) {
					if (parent.childNodes[i].nodeName==="#text" && parent.childNodes[i].textContent.match(/^\s+$/)) {
						number++;
					} else {
						if (parent.childNodes[i].tagName.toLowerCase()==type) {
							count++;
						}
						if (count==number) {
							return parent.childNodes[i];
						}
					}
					i++;
				}
			}
		},
		nthOfLastType:function(parent, number, type) {
			var count=parent.childNodes.length;
			if (!isNaN(number) && ("childNodes" in parent) && parent.childNodes.length>0) {
				for (var i=parent.childNodes.length-1; i>=0; i--) {
					if (parent.childNodes[i].nodeName==="#text" && parent.childNodes[i].textContent.match(/^\s+$/)) {
						number--;
					} else {
						if (parent.childNodes[i].tagName.toLowerCase()==type) {
							count--;
						}
						if (count==number) {
							return parent.childNodes[i];
						}
					}
					i--;
				}
			}
		},
		isNot:function(element, exp) {
			var svgNodeTypes=__.svgFull;
			var toMatch=0;
			var ret=0;
			var ex;
			for (var sWS in __.simpleWordsSelectors) {
				if ((ex=__.simpleWordsSelectors[sWS].exec(exp))!=null) {
					toMatch++;
					switch(sWS) {
					 	case "tagName":
					 		if (element.tagName.toLowerCase()!=ex[1].toLowerCase()) {
					 			ret++;
					 		}
					 	break;
					 	case "className":
					 		if (svgNodeTypes.indexOf(element.tagName.toLowerCase())==-1) {
								if (!element.className.toString().match(RegExp('\\b'+ex[1]+'\\b'))) {
									ret++;
								}
							} else {
								if (("baseVal" in element.className) && element.className.baseVal.match(RegExp('\\b'+ex[1]+'\\b'))) {
									ret++;
								} else if (!("baseVal" in element.className) && element.className.match(RegExp('\\b'+ex[1]+'\\b'))) {
									ret++;
								}
							}
					 	break;
					 	case "id":
					 		if (element.id!=ex[1]) {
					 			ret++;
					 		}
					 	break;
					 	case "attribute":
					 		if (!(ex[1] in element)) {
					 			ret++;
					 		}
					 	break;
					 	case "attributeWithValue":
					 		if (ex[1]=="class") {
					 			ex[1]="className";
					 		}
					 		ex[2]=ex[2].replace(/^['|"](.*)['|"]$/, "$1"); 
					 		if (!(ex[1] in element) || typeof(element[ex[1]])==="undefined" || element[ex[1]].toString()!==ex[2]) {
					 			ret++;
					 		}
					 	break;
					 	case "attributeContainingValue":
					 		if (ex[1]=="class") {
					 			ex[1]="className";
					 		}
					 		ex[2]=ex[2].replace(/^['|"](.*)['|"]$/, "$1"); 
					 		if (!(ex[1] in element) || typeof(element[ex[1]])==="undefined" || element[ex[1]].toString().indexOf(ex[2])==-1) {
					 			ret++;
					 		}
					 	break;
					 	case "attributeStartingWithValue":
					 		if (ex[1]=="class") {
					 			ex[1]="className";
					 		}
					 		ex[2]=ex[2].replace(/^['|"](.*)['|"]$/, "$1"); 
					 		if (!(ex[1] in element) || typeof(element[ex[1]])==="undefined" || element[ex[1]].toString().indexOf(ex[2])!=0) {
					 			ret++;
					 		}
					 	break;
					 	case "attributeStartingWithSubstring":
					 		if (ex[1]=="class") {
					 			ex[1]="className";
					 		}
					 		ex[2]=ex[2].replace(/^['|"](.*)['|"]$/, "$1"); 
					 		if (!(ex[1] in element) || typeof(element[ex[1]])==="undefined" || element[ex[1]].toString().indexOf(ex[2])!=0) {
					 			ret++;
					 		}
					 	break;
					 	case "attributeEndingWithSubstring":
					 		if (ex[1]=="class") {
					 			ex[1]="className";
					 		}
					 		ex[2]=ex[2].replace(/^['|"](.*)['|"]$/, "$1"); 
					 		if (!(ex[1] in element) || typeof(element[ex[1]])==="undefined" || element[ex[1]].toString().lastIndexOf(ex[2])!=element[ex[1]].length-ex[2].length) {
					 			ret++;
					 		}
					 	break;
					 	case "attributeContainingSubstring":
					 		if (ex[1]=="class") {
					 			ex[1]="className";
					 		}
					 		ex[2]=ex[2].replace(/^['|"](.*)['|"]$/, "$1"); 
					 		if (!(ex[1] in element) || typeof(element[ex[1]])==="undefined" || element[ex[1]].toString().indexOf(ex[2])==-1) {
					 			ret++;
					 		}
					 	break;
					 	case "active":
					 		var hash=__.address.hash();
							var nohash=__.address.nohash();
							if (["a","area"].indexOf(element.tagName.toLowerCase())==-1 || element.href!=nohash || element.href!=nohash+hash) {
					 			ret++;
					 		}
					 	break;
					 	case "checked":
					 		if (element.tagName.toLowerCase()!="input" || ["radio", "checkbox"].indexOf(element.type.toLowerCase())==-1 || element.checked) {
					 			ret++;
					 		}
					 	break;
					 	case "disabled":
					 		if (element.tagName.toLowerCase()!="input" || element.disabled) {
					 			ret++;
					 		}
					 	break;
					 	case "enabled":
					 		if (element.tagName.toLowerCase()!="input" || !element.disabled) {
					 			ret++;
					 		}
					 	break;
					 	case "empty":
					 		if (element.childNodes.length>0) {
					 			ret++;
					 		}
					 	break;
					 	case "firstChild":
					 		if (element.parentNode.firstChild!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "firstOfType":
					 		var parent=element.parentNode;
					 		if (__.firstNodeOfType(parent, element.tagName.toLowerCase())!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "focus":
					 		if (element!=__.d.activeElement) {
					 			ret++;
					 		}
					 	break;
					 	case "inRange":
					 		if (!__.isInRange(element)) {
					 			ret++;
					 		}
					 	break;
					 	case "lastChild":
					 		if (element.parentNode.lastChild!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "lastOfType":
					 		var parent=element.parentNode;
					 		if (__.lastNodeOfType(parent, element.tagName.toLowerCase())!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "nthChild":
					 		var n=parseInt(ex[1],10);
					 		if (__.nthChild(element.parentNode, n)!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "nthLastChild":
					 		var n=parseInt(ex[1],10);
					 		if (__.nthLastChild(element.parentNode, n)!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "nthLastOfType":
					 		var n=parseInt(ex[1],10);
					 		if (__.nthLastOfType(element.parentNode, n, element.tagName.toLowerCase())!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "nthOfType":
					 		var n=parseInt(ex[1],10);
					 		if (__.nthOfType(element.parentNode, n, element.tagName.toLowerCase())!=element) {
					 			ret++;
					 		}
					 	break;
					 	case "onlyOfType":
					 		if (!__.nthOfType(element.parentNode, element.tagName.toLowerCase())) {
					 			ret++;
					 		}
					 	break;
					 	case "onlyChild":
					 		var parent=element.parentNode;
					 		if (parent.childNodes.length==1 && parent.childNodes[0]==element) {
					 			ret++;
					 		}
					 	break;
					 	case "optional":
					 		if (element.required) {
					 			ret++;
					 		}
					 	break;
					 	case "outOfRange":
					 		if (__.isInRange(element)) {
					 			ret++;
					 		}
					 	break;
					 	case "readOnly":
					 		if (!element.readonly) {
					 			ret++;
					 		}
					 	break;
					 	case "readWrite":
					 		if (element.readonly) {
					 			ret++;
					 		}
					 	break;
					 	case "required":
					 		if (!element.required) {
					 			ret++;
					 		}
					 	break;
					 	case "root":
					 		if (element!=__.d.documentElement) {
					 			ret++;
					 		}
					 	break;
					 	case "target":
					 		var hash=__.address.hash();
							if (["a","area"].indexOf(element.tagName.toLowerCase())==-1 || element.name!=hash) {
					 			ret++;
					 		}
					 	break;	
					}
					if (ex.index==0) {
						exp=exp.substring(ex[0].length);
					}
				}
			}
			return (ret==toMatch?true:false);
		},
		printR:function(variable, depth) {
			var str="";
			var i,p;
			if (variable!=undefined) {
				if (__.isArray(variable)) {
					for (i=0; i<depth; i++) {
						str+="\t";
					}
					str+="["+"\n";
					if (__.countProperties(variable)>0) {
						for (p in variable) {
							for (i=0; i<=depth; i++) {
								str+="\t";
							}
							str+=(typeof(p)=="string"?'"':'')+p+(typeof(p)=="string"?'"':'')+"=>\n"+__.printR(variable[p], depth+1);
							str+=",\n";
						}
						str=str.substring(0, str.length-2)+"\n";
					}
					for (i=0; i<depth; i++) {
						str+="\t";
					}
					str+="]";
					return str;
				} else if (__.isObject(variable)) {
					for (i=0; i<depth; i++) {
						str+="\t";
					}
					str+="{"+"\n";
					if (__.countProperties(variable)>0) {
						for (p in variable) {
							for (i=0; i<=depth; i++) {
								str+="\t";
							}
							str+=p+":\n"+__.printR(variable[p], depth+1);
							str+=",\n";
						}
						str=str.substring(0, str.length-2)+"\n";
					}
					for (i=0; i<depth; i++) {
						str+="\t";
					}
					str+="}";
					return str;
				} else {
					for (i=0; i<depth; i++) {
						str+="\t";
					}
					if (typeof(variable)=="string") {
						str+='"'+variable.toString()+'"';
					} else {
						str+=variable.toString();
					}
					return str;
				}
			}
		},
		/**
		 * An implementation for Quicksort. Doesn't
		 * perform as well as the native Array.sort
		 * and also runs the risk of a stack overflow
		 *
		 * Tests with:
		 *
		 * var array = [];
		 * for(var i = 0; i < 20; i++) {
		 *   array.push(Math.round(Math.random() * 100));
		 * }
		 *
		 * lib().quicksort(array, null, "numerical", "ascending", true);
		 *
		 * @author Paul Lewis
		 * @modified Fabien Auréjac
		*/
		quicksort:function(array, keys, flag, order) {
			var i,j,p,q,arr,k;
			if (typeof(flag)!="string") {
				__.quicksort.flag="natural";
			} else {
				__.quicksort.flag=["natural","alphanumerical","numerical"].indexOf(flag)!=-1?flag:"natural";
			}
			if (typeof(order)!="string") {
				__.quicksort.order="ascending";
			} else {
				__.quicksort.order=["ascending","descending"].indexOf(order)!=-1?order:"ascending";
			}
			// if a key of the array doesn't exist, it is suppressed
			if (__.isArray(keys) && keys.length>0) {
				for (i=keys.length-1; i>=0; i--) {
					if (!(keys[i] in array)) {
						keys.splice(i, 1);
					}
				}
			}
		  	/**
		   	* Swaps two values in the heap
		   	*
		   	* @param {int} a Index of the first item to be swapped
		   	* @param {int} b Index of the second item to be swapped
		   	*/
		  	__.quicksort.swap=function(array, a, b) {
				var temp=array[a];
				array[a]=array[b];
				array[b]=temp;
		  	};
		  	/**
		   	* Partitions the (sub)array into values less than and greater
		   	* than the pivot value
		   	*
		   	* @param {Array} array The target array
		   	* @param {int} pivot The index of the pivot
		   	* @param {int} left The index of the leftmost element
		   	* @param {int} left The index of the rightmost element
		   	*/
		  	__.quicksort.partition=function(array, key, additionalKeys, pivot, left, right) {
				var storeIndex=left,pivotValue;
				if (key!=null) {
					pivotValue=array[key][pivot];
					// put the pivot on the right
					__.quicksort.swap(array[key], pivot, right);
					if (additionalKeys!=null) {
						for (p in additionalKeys) {
							__.quicksort.swap(array[additionalKeys[p]], pivot, right);
						}
					}
					// go through the rest
					for (var v=left; v<right; v++) {
						// if the value is less than the pivot's
						// value put it to the left of the pivot
						// point and move the pivot point along one
						value=array[key][v];
						if (__.quicksort.orderInferiorTo(value, pivotValue)) {
							__.quicksort.swap(array[key], v, storeIndex);
							if (additionalKeys!=null) {
								for (p in additionalKeys) {
									__.quicksort.swap(array[additionalKeys[p]], v, storeIndex);
								}
							}
							storeIndex++;
						}
					}
					// finally put the pivot in the correct place
					__.quicksort.swap(array[key], right, storeIndex);
					if (additionalKeys!=null) {
						for (p in additionalKeys) {
							__.quicksort.swap(array[additionalKeys[p]], right, storeIndex);
						}
					}
				} else {
					pivotValue=array[pivot];
					// put the pivot on the right
					__.quicksort.swap(array, pivot, right);
					// go through the rest
					for (var v=left; v<right; v++) {
						// if the value is less than the pivot's
						// value put it to the left of the pivot
						// point and move the pivot point along one
						value=array[v];
						if (__.quicksort.orderInferiorTo(value, pivotValue)) {
							__.quicksort.swap(array, v, storeIndex);
							storeIndex++;
						}
					}
					// finally put the pivot in the correct place
					__.quicksort.swap(array, right, storeIndex);
				}
				return storeIndex;
		  	};
		  	__.quicksort.orderInferiorTo=function(val1, val2) {
		  		var alphabet=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		  		var numbers=["0","1","2","3","4","5","6","7","8","9"];
		  		var c1,c2;
		  		if (__.quicksort.flag!="numerical") {
		  			val1=__.removeDiacritics(val1.toString()).toLowerCase();
		  			val2=__.removeDiacritics(val2.toString()).toLowerCase();
		  			var length=(val1.length>val2.length)?val2.length:val1.length;
		  			var i=0;
		  			var ex1,ex2,_1,_2;
		  			while (i<length) {
		  				if (__.quicksort.flag=="natural") {
		  					ex1=/^[0-9]+(?:\.[0-9]+)?/.exec(val1.substring(i));
		  					ex2=/^[0-9]+(?:\.[0-9]+)?/.exec(val2.substring(i));
		  					_1=alphabet.indexOf(val1.substring(i,i+1));
		  					_2=alphabet.indexOf(val2.substring(i,i+1));
		  					if (ex1!=null && ex2!=null && ((parseFloat(ex1[0])<parseFloat(ex2[0]) && __.quicksort.order=="ascending") || (parseFloat(ex1[0])>parseFloat(ex2[0]) && __.quicksort.order=="descending"))) {
		  						return true;
		  					} else if (_1!=-1 && _2!=-1 && ((_1<_2 && __.quicksort.order=="ascending") || (_1>_2 && __.quicksort.order=="descending"))) {
		  						return true;
		  					} else if ((_1!=-1 && _2==-1 && __.quicksort.order=="ascending") || (_1==-1 && _2!=-1 && __.quicksort.order=="descending")) {
		  						return true;
		  					} else if (_1==_2) {
		  						if (_1==-1) {
		  							c1=val1.substring(i,i+1).charCodeAt(0);
		  							c2=val2.substring(i,i+1).charCodeAt(0);
		  							if ((c1<c2 && __.quicksort.order=="ascending") || (c1>c2 && __.quicksort.order=="descending")) {
		  								return true;
		  							}
		  						} else {
		  							i++;
		  							continue;
		  						}
		  					} else {
		  						return false;
		  					}
		  					if (ex1!==null && ex2!==null) {
		  						val1=val1.substr(ex1[0].toString().length);
								val2=val1.substr(ex2[0].toString().length);
								length=(val1.length>val2.length)?val2.length:val1.length;
								i=0;
							}
		  				} else if (__.quicksort.flag=="alphanumerical") {
		  					_1=numbers.concat(alphabet).indexOf(val1.substring(i,i+1));
		  					_2=numbers.concat(alphabet).indexOf(val2.substring(i,i+1));
		  					if (_1!=-1 && _2!=-1 && ((_1<_2 && __.quicksort.order=="ascending") || (_1>_2 && __.quicksort.order=="descending"))) {
		  						return true;
		  					} else if ((_1!=-1 && _2==-1 && __.quicksort.order=="ascending") || (_1==-1 && _2!=-1 && __.quicksort.order=="descending")) {
		  						return true;
		  					} else if (_1==_2) {
		  						if (_1==-1) {
		  							c1=val1.substring(i,i+1).charCodeAt(0);
		  							c2=val2.substring(i,i+1).charCodeAt(0);
		  							if ((c1<c2 && __.quicksort.order=="ascending") || (c1>c2 && __.quicksort.order=="descending")) {
		  								return true;
		  							}
		  						} else {
		  							i++;
		  							continue;
		  						}
		  					} else {
		  						return false;
		  					}
		  				}
		  				i++;
		  			}
		  		} else if (__.quicksort.flag=="numerical") {
		  			val1=parseFloat(val1);
		  			val2=parseFloat(val2);
		  			if ((val1<val2 && __.quicksort.order=="ascending") || (val1>val2 && __.quicksort.order=="descending")) {
		  				return true;
		  			} else {
		  				return false;
		  			}
		  		} else {
		  			return false;
		  		}
		  	};
		  	/**
		   	* Sorts the (sub-)array
		   	*
		   	* @param {Array} array The target array
		   	* @param {int} left The index of the leftmost element, defaults 0
		   	* @param {int} left The index of the rightmost element,
		   	defaults array.length-1
		   	*/
		  	__.quicksort.sort=function(array, key, additionalKeys, left, right) {
				var pivot=null, p;
				if (typeof(left)!=='number') {
			  		left=0;
				}
				if (typeof(right)!=='number' && key!=null && __.isNumericalArray(array[key])) {
					right=array[key].length-1;
				} else if (typeof(right)!=='number' && key==null && __.isNumericalArray(array)) {
			  		right=array.length-1;
				}
				// effectively set our base
				// case here. When left == right
				// we'll stop
				if (left<right) {
			  		// pick a pivot between left and right
			  		// and update it once we've partitioned
			  		// the array to values < than or > than
			  		// the pivot value
			  		pivot=left+Math.ceil((right-left)*0.5);
			  		newPivot=__.quicksort.partition(array, key, additionalKeys, pivot, left, right);
			  		// recursively sort to the left and right
			  		__.quicksort.sort(array, key, additionalKeys, left, newPivot-1);
			  		__.quicksort.sort(array, key, additionalKeys, newPivot+1, right);
				}
		  	};
		  	if (__.isArray(keys) && keys.length>0) {
		  		//assume there's possible similarities between values
		  		var similarities=true;
		  		var keyIndex=0;
		  		var left=-1;
		  		var right=-1;
		  		k=[];
				for (p in array) {
					if (p!=keys[keyIndex]) {
						k.push(p);
					}
				}
		  		__.quicksort.sort(array, keys[keyIndex], k, null, null);
				memI=0;
		  		while (similarities && keyIndex<keys.length-1) {
		  			//assume there's no similarities after sorting
		  			similarities=false;
		  			i=memI;
		  			while (i<array[keys[keyIndex]].length-1) {
		  				while (array[keys[keyIndex]][i]===array[keys[keyIndex]][i+1]) {
		  					similarities=true;
		  					if (left===-1) {
		  						left=i;
		  					}
		  					right=++i;
		  				}
		  				if (left!==right) {
							memI=i;
							break;
						}
		  				i++;
		  			}
		  			keyIndex++;
					if (left!==-1 && right!==-1 && left!==right) {
						k=[];
						for (p in array) {
							if (p!=keys[keyIndex]) {
								k.push(p);
							}
						}
						__.quicksort.sort(array, keys[keyIndex], k, left, right);
						left=-1;
						right=-1;
					}
					if (i>=array[keys[keyIndex]].length-1) {
						keyIndex++;
						similarities=true;
						memI=0;
					}
		  		}
		  	} else {
		  		__.quicksort.sort(array, null, null, null, null);
		  	}
		},
		// original source at http://lehelk.com/2011/05/06/script-to-remove-diacritics/
		removeDiacritics:function(str) {
			var defaultDiacriticsRemovalMap = [
				{'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
				{'base':'AA','letters':/[\uA732]/g},
				{'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
				{'base':'AO','letters':/[\uA734]/g},
				{'base':'AU','letters':/[\uA736]/g},
				{'base':'AV','letters':/[\uA738\uA73A]/g},
				{'base':'AY','letters':/[\uA73C]/g},
				{'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
				{'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
				{'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
				{'base':'DZ','letters':/[\u01F1\u01C4]/g},
				{'base':'Dz','letters':/[\u01F2\u01C5]/g},
				{'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
				{'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
				{'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
				{'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
				{'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
				{'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
				{'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
				{'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
				{'base':'LJ','letters':/[\u01C7]/g},
				{'base':'Lj','letters':/[\u01C8]/g},
				{'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
				{'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
				{'base':'NJ','letters':/[\u01CA]/g},
				{'base':'Nj','letters':/[\u01CB]/g},
				{'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
				{'base':'OI','letters':/[\u01A2]/g},
				{'base':'OO','letters':/[\uA74E]/g},
				{'base':'OU','letters':/[\u0222]/g},
				{'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
				{'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
				{'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
				{'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
				{'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
				{'base':'TZ','letters':/[\uA728]/g},
				{'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
				{'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
				{'base':'VY','letters':/[\uA760]/g},
				{'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
				{'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
				{'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
				{'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
				{'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
				{'base':'aa','letters':/[\uA733]/g},
				{'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
				{'base':'ao','letters':/[\uA735]/g},
				{'base':'au','letters':/[\uA737]/g},
				{'base':'av','letters':/[\uA739\uA73B]/g},
				{'base':'ay','letters':/[\uA73D]/g},
				{'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
				{'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
				{'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
				{'base':'dz','letters':/[\u01F3\u01C6]/g},
				{'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
				{'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
				{'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
				{'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
				{'base':'hv','letters':/[\u0195]/g},
				{'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
				{'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
				{'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
				{'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
				{'base':'lj','letters':/[\u01C9]/g},
				{'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
				{'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
				{'base':'nj','letters':/[\u01CC]/g},
				{'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
				{'base':'oi','letters':/[\u01A3]/g},
				{'base':'ou','letters':/[\u0223]/g},
				{'base':'oo','letters':/[\uA74F]/g},
				{'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
				{'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
				{'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
				{'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
				{'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
				{'base':'tz','letters':/[\uA729]/g},
				{'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
				{'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
				{'base':'vy','letters':/[\uA761]/g},
				{'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
				{'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
				{'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
				{'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
			];
			for	(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
				str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
			}
			return str;
		},
		urlizeASCII:function(str, boolTrim) {
			if (typeof(boolTrim)==="undefined") {
				boolTrim=false;
			}
			str=lib().htmlEntityDecode(str);
			str=__.removeDiacritics(str).toLowerCase();
			ret=str.replace(/[^a-z0-9]+/gi, "-");
			if (boolTrim) {
				ret=ret.replace(/^(?:-+)?/, "").replace(/(?:-+)?$/, "");
			}
			return ret;
		},
		urlizeUTF:function(str, boolTrim, boolRemoveDiacritics) {
			if (typeof(boolTrim)==="undefined") {
				boolTrim=false;
			}
			if (typeof(boolRemoveDiacritics)==="undefined") {
				boolRemoveDiacritics=false;
			}
			str=lib().htmlEntityDecode(str);
			if (boolRemoveDiacritics) {
				str=__.removeDiacritics(str);
			}
			str=str.toLocaleLowerCase();
			ret=str.replace(/[^a-z0-9\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D58-\u0D5E\u0D66-\u0D78\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g, "-")
			if (boolTrim) {
				ret=ret.replace(/^(?:-+)?/, "").replace(/(?:-+)?$/, "");
			}
			return ret;
		},
		intervals:function(fnc, numberOfIntervals, totalTime, addParams) {
			if (typeof(fnc)=="function" && typeof(numberOfIntervals)=="number" && typeof(totalTime)=="number" && __.isArray(addParams)) {
				var id=setInterval(function() { fnc.apply(null, addParams); }, (totalTime/numberOfIntervals)|0);
				setTimeout(function() { clearInterval(id); }, totalTime|0);
			}
		},
		temporize:function(f, time) {
			if (!("temporized" in __)) {
				__.temporized={};
			}
			current=(new Date()).getTime();
			if (!(f.toString() in __.temporized) || time-(current-__.temporized[f.toString()])>25) {
				__.temporized[f.toString()]=current;
				if (f.toString()+"_timeout" in __.temporized) {
					clearTimeout(__.temporized[f.toString()+"_timeout"]);
				}
				__.temporized[f.toString()+"_timeout"]=setTimeout(function() { __.temporize(f, time); }, time);
			} else {
				f();
				__.temporized[f.toString()]=null;
				__.temporized[f.toString()+"_timeout"]=null;
				delete __.temporized[f.toString()];
				delete __.temporized[f.toString()+"_timeout"];
			}
		},
		wait:function(properties, f) {
			var x=window;
			var c=0;
			for (var i=0; i<properties.length; i++) {
				if (typeof(x[properties[i]])!=="undefined") {
					x=x[properties[i]];
				} else {
					break;
				}
				c++;
			}
			if (c===properties.length) {
				f();
				return true;
			} else {
				setTimeout(function() { __.wait(properties, f); }, 50);
			}
		},
		isInPolygon:function(point, points) {
			var isInPoly = false;
			var b = points.length- 1;
			for (a=0; a<points.length; a++) { 
				var v1x = points[a].x;
				var v1y = points[a].y;
				var v2x = points[b].x;
				var v2y = points[b].y;
				if (v1y < point.y && v2y >= point.y || v2y < point.y && v1y >= point.y)  {
					if (v1x + (point.y - v1y) / (v2y - v1y) * (v2x - v1x) < point.x) {
						isInPoly = !isInPoly;
					}
				}
				b = a;
			}
			return isInPoly;
		},
		lineIntersectsLine:function(line1, line2) {
			// line1, line2= [{ x:number, y:number }, { x:number, y:number }];
			var bool=false,lines=[line1,
				line2],slope=[],offsetX=[],offsetY=[],length=[],point={ x:null, y:null };
			if (lines[0][1].x-lines[0][0].x===0) {
				slope[0]=(lines[0][1].y>lines[0][0].y)?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;
			} else {
				slope[0]=(lines[0][1].y-lines[0][0].y)/(lines[0][1].x-lines[0][0].x);
			}
			if (lines[1][1].x-lines[1][0].x===0) {
				slope[1]=(lines[1][1].y>lines[1][0].y)?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;
			} else {
				slope[1]=(lines[1][1].y-lines[1][0].y)/(lines[1][1].x-lines[1][0].x);
			}
			offsetX[0]=(slope[0]===Number.POSITIVE_INFINITY ||
			slope[0]===Number.NEGATIVE_INFINITY?-lines[0][0].x:0);
			offsetX[1]=(slope[1]===Number.POSITIVE_INFINITY ||
			slope[1]===Number.NEGATIVE_INFINITY?-lines[1][0].x:0);
			offsetY[0]=(isFinite(slope[0]) && slope[0]!==0
					?lines[0][0].y-slope[0]*lines[0][0].x
					:lines[0][0].y
			);
			offsetY[1]=(isFinite(slope[1]) && slope[1]!==0
					?lines[1][0].y-slope[1]*lines[1][0].x
					:lines[1][0].y
			);
			length[0]=Math.sqrt(Math.pow(lines[0][1].x-lines[0][0].x,2)+Math.pow(lines[0][1].y-lines[0][0].y,2));
			length[1]=Math.sqrt(Math.pow(lines[1][1].x-lines[1][0].x,2)+Math.pow(lines[1][1].y-lines[1][0].y,2));
			if (isFinite(offsetY[0]) && isFinite(offsetY[1]) &&
				isFinite(slope[0]) && isFinite(slope[1])) {
				if (slope[0]!==slope[1]) {
					point.x=(offsetY[0]-offsetY[1])/(slope[1]-slope[0]);
					point.y=(!isNaN(slope[0]*(point.x+offsetX[0])+offsetY[0])
						?slope[0]*(point.x+offsetX[0])+offsetY[0]
							:(!isNaN(slope[1]*(point.x+offsetX[1])+offsetY[1])
							?slope[1]*(point.x+offsetX[1])+offsetY[1]
								:null
						)
					);
					point.x=point.x.toFixed(3);
					point.y=point.y.toFixed(3);
				} else if (offsetY[0]===offsetY[1]) {
					point.x=null;
					point.y=null;
				}
				if (!isNaN(point.x) && !isNaN(point.y)) {
					if (point.x>=Math.min(lines[0][0].x, lines[0][1].x)
						&& point.x<=Math.max(lines[0][0].x, lines[0][1].x) &&
						point.x>=Math.min(lines[1][0].x, lines[1][1].x) &&
						point.x<=Math.max(lines[1][0].x, lines[1][1].x) &&
						point.y>=Math.min(lines[0][0].y, lines[0][1].y) &&
						point.y<=Math.max(lines[0][0].y, lines[0][1].y) &&
						point.y>=Math.min(lines[1][0].y, lines[1][1].y) &&
						point.y<=Math.max(lines[1][0].y, lines[1][1].y)) {
						bool=true;
					}
				}
			} else if ((!isFinite(slope[0]) && isFinite(slope[1])) ||
				(isFinite(slope[0]) && !isFinite(slope[1]))) {
				var v=!isFinite(slope[0])?0:1;
				point.x=lines[v][0].x;
				point.y=slope[1-v]*lines[v][0].x+offsetY[1-v];
				point.x=point.x.toFixed(3);
				point.y=point.y.toFixed(3);
				if (!isNaN(point.x) && !isNaN(point.y)) {
					if (point.x>=Math.min(lines[v][0].x, lines[v][1].x)
						&& point.x<=Math.max(lines[v][0].x, lines[v][1].x) &&
						point.x>=Math.min(lines[1-v][0].x, lines[1-v][1].x) &&
						point.x<=Math.max(lines[1-v][0].x, lines[1-v][1].x) &&
						point.y>=Math.min(lines[v][0].y, lines[v][1].y) &&
						point.y<=Math.max(lines[v][0].y, lines[v][1].y) &&
						point.y>=Math.min(lines[1-v][0].y, lines[1-v][1].y) &&
						point.y<=Math.max(lines[1-v][0].y, lines[1-v][1].y)) {
						bool=true;
					}
				}
			} else if (!isFinite(slope[0]) && !isFinite(slope[1])) {
				if (lines[0][0].x==lines[1][0].x &&
					lines[1][0].y>=lines[0][0].y && lines[1][0].y<=lines[0][1].y) {
					point.x=lines[0][0].x;
					point.y=lines[1][0].y;
					point.x=point.x.toFixed(3);
					point.y=point.y.toFixed(3);
					bool=true;
				}
			}
			return [bool, point];
		},
		hitTest:function(element1, element2) {
			var ltwh1=__.ltwhRelativeTo([element1], document.body)[0];
			var ltwh2=__.ltwhRelativeTo([element2], document.body)[0];
			var lines1=[
				[{ x:ltwh1.left, y:ltwh1.top }, { x:ltwh1.left+ltwh1.width-1, y:ltwh1.top }],
				[{ x:ltwh1.left+ltwh1.width-1, y:ltwh1.top }, { x:ltwh1.left+ltwh1.width-1, y:ltwh1.top+ltwh1.height-1 }],
				[{ x:ltwh1.left+ltwh1.width-1, y:ltwh1.top+ltwh1.height-1 }, { x:ltwh1.left, y:ltwh1.top+ltwh1.height-1 }],
				[{ x:ltwh1.left, y:ltwh1.top+ltwh1.height-1 }, { x:ltwh1.left, y:ltwh1.top }]
			];
			var lines2= [
				[{ x:ltwh2.left, y:ltwh2.top }, { x:ltwh2.left+ltwh2.width-1, y:ltwh2.top }],
				[{ x:ltwh2.left+ltwh2.width-1, y:ltwh2.top }, { x:ltwh2.left+ltwh2.width-1, y:ltwh2.top+ltwh2.height-1 }],
				[{ x:ltwh2.left+ltwh2.width-1, y:ltwh2.top+ltwh2.height-1 }, { x:ltwh2.left, y:ltwh2.top+ltwh2.height-1 }],
				[{ x:ltwh2.left, y:ltwh2.top+ltwh2.height-1 }, { x:ltwh2.left, y:ltwh2.top }]
			];
			for (var i=0; i<lines1.length; i++) {
				for (var j=0; j<lines2.length; j++) {
					if (__.lineIntersectsLine(lines1[i], lines2[j])[0]) {
						return true;
					}
				}
			}
			var arr1=[{ x:ltwh1.left, y:ltwh1.top }, { x:ltwh1.left+ltwh1.width-1, y:ltwh1.top }, { x:ltwh1.left+ltwh1.width-1, y:ltwh1.top+ltwh1.height-1 }, { x:ltwh1.left, y:ltwh1.top+ltwh1.height-1 }];
			var arr2=[{ x:ltwh2.left, y:ltwh2.top }, { x:ltwh2.left+ltwh2.width-1, y:ltwh2.top }, { x:ltwh2.left+ltwh2.width-1, y:ltwh2.top+ltwh2.height-1 }, { x:ltwh2.left, y:ltwh2.top+ltwh2.height-1 }];
			if (__.isInPolygon({ x:ltwh2.left, y:ltwh2.top }, arr1) || __.isInPolygon({ x:ltwh2.left+ltwh2.width-1, y:ltwh2.top }, arr1) || __.isInPolygon({ x:ltwh2.left+ltwh2.width-1, y:ltwh2.top+ltwh2.height-1 }, arr1) || __.isInPolygon({ x:ltwh2.left, y:ltwh2.top+ltwh2.height-1 }, arr1) || __.isInPolygon({ x:ltwh1.left, y:ltwh1.top }, arr2) || __.isInPolygon({ x:ltwh1.left+ltwh1.width-1, y:ltwh1.top }, arr2) || __.isInPolygon({ x:ltwh1.left+ltwh1.width-1, y:ltwh1.top+ltwh1.height-1 }, arr2) || __.isInPolygon({ x:ltwh1.left, y:ltwh1.top+ltwh1.height-1 }, arr2)) {
				return true;
			}
			return false;
		},
		hitTestPolygons:function(points1, points2) {
			var lines1=[], i, j;
			for (i=0; i<points1.length; i++) {
				if (i<points1.length-1) {
					lines1.push([{ x:points1[i].x, y:points1[i].y }, { x:points1[i+1].x, y:points1[i+1].y }]);
				} else {
					lines1.push([{ x:points1[i].x, y:points1[i].y }, { x:points1[0].x, y:points1[0].y }]);
				}
			}
			var lines2= [];
			for (i=0; i<points2.length; i++) {
				if (i<points2.length-1) {
					lines2.push([{ x:points2[i].x, y:points2[i].y }, { x:points2[i+1].x, y:points2[i+1].y }]);
				} else {
					lines2.push([{ x:points2[i].x, y:points2[i].y }, { x:points2[0].x, y:points2[0].y }]);
				}
			}
			for (var i=0; i<lines1.length; i++) {
				for (var j=0; j<lines2.length; j++) {
					if (__.lineIntersectsLine(lines1[i], lines2[j])[0]) {
						return true;
					}
				}
			}
			for (i=0; i<points1.length; i++) {
				if (__.isInPolygon({ x:points1[i].x, y:points1[i].y }, points2)) {
					return true;
				}
			}
			for (i=0; i<points2.length; i++) {
				if (__.isInPolygon({ x:points2[i].x, y:points2[i].y }, points1)) {
					return true;
				}
			}
			return false;
		},
		touch:false,
		touchDetectionInit:function() {
			__.on("touchstart", __.touchDetection, false, __.d);
		},
		touchDetection:function(e) {
			if ("touches" in e && e.touches.length>0) {
				__.touch=true;
			}
		},
		nostopUidList:[]
	};
	__.touchDetectionInit();
	var lib=function(obj, nostop) {
		if (typeof(obj)!=='undefined') {
			var _lib=function(obj, nostop) {
				if (typeof(obj)!=="string") {
					_lib.targets=[].concat(obj);
				} else if (typeof(obj)==="string" && obj.length>0) {
					if (obj==="window") {
						_lib.targets=[window];
					} else if (obj==="document") {
						_lib.targets=[__.d];
					} else if (__.d.querySelectorAll) {
						try {
							var sel=__.d.querySelectorAll(obj);
							_lib.targets=[];
							for (var i=0; i<sel.length; i++) {
								_lib.targets.push(sel[i]);
							}
						} catch(e) {
							console.log(e);
						}
					} else {
						_lib.targets=__.querySelectorAllReplacement(obj, false);
					}
				}
				__.selector=obj;
				_lib.parents=function(optionalLength) { return __.parents(_lib.targets, optionalLength); };
				_lib.ancestors=function(filter) { return __.ancestors(filter, _lib.targets); };
				_lib.to=function(values, parameters) { __.to(values, parameters, _lib.targets, __.sel, nostop); return _lib; };
				_lib.from=function(values, parameters) { __.from(values, parameters, _lib.targets, __.sel, nostop); return _lib; };
				_lib.stop=function() { __.stop(_lib.targets); return _lib; };
				_lib.on=function(eventType, fn, useCapture) { if (typeof(useCapture)=="undefined") { useCapture=false; } __.on(eventType, fn, useCapture, _lib.targets); return _lib; };
				_lib.off=function(eventType, fn, useCapture) { if (typeof(useCapture)=="undefined") { useCapture=false; } __.off(eventType, fn, useCapture, _lib.targets); return _lib; };
				_lib.dispatch=function(eventType) { __.dispatch(eventType, _lib.targets); };
				_lib.vector=function(svg) { return __.vector(_lib.targets, svg); };
				_lib.addClass=function(className) { __.addClass(_lib.targets, className); return _lib; };
				_lib.removeClass=function(className) { __.removeClass(_lib.targets, className); return _lib; };
				_lib.hasClass=function(className) { return __.hasClass(_lib.targets, className); };
				_lib.css=function(obj, destUnit, computedOnly) { return __.css(obj, typeof(destUnit)=="string"?destUnit:null, computedOnly, _lib.targets, _lib); };
				_lib.remove=function(indexes) { if (typeof(indexes)=="object" && indexes.indexOf(-1)==-1) { __.removeAtIndexes(indexes, _lib.targets); } else { __.remove(_lib.targets); } };
				_lib.moveAtIndex=function(index) { return __.moveAtIndex(index, _lib.targets, _lib); };
				_lib.empty=function() { __.empty(_lib.targets); };
				_lib.find=function(str) { return __.find(str, _lib.targets, _lib); };
				_lib.getParentMatchingSelector=function(str) { return __.getParentMatchingSelector(str, _lib.targets, _lib); };
				_lib.text=function(str) { return __.text(str, _lib.targets); };
				_lib.html=function(str) { return __.html(str, _lib.targets); };
				_lib.value=function(str) { return __.value(str, _lib.targets); };
				_lib.appendText=function(str) { __.appendText(str, _lib.targets); };
				_lib.appendHtml=function(str) { __.appendHtml(str, _lib.targets); };
				_lib.prependText=function(str) { return __.prependText(str, _lib.targets); };
				_lib.prependHtml=function(str) { return __.prependHtml(str, _lib.targets); };
				_lib.append=function(elements) { __.append([].concat(elements), _lib.targets); };
				_lib.prepend=function(elements) { __.prepend([].concat(elements), _lib.targets); };
				_lib.htmlJsCss=function(str, ondone, classNameForExtraElements, onlyInsideId, optionalRemovalSelector, omitExtraElements) { return __.htmlScriptStyleLinkMetaTitle(str, ondone, _lib.targets, classNameForExtraElements, onlyInsideId, optionalRemovalSelector, false, omitExtraElements); };
				_lib.appendHtmlJsCss=function(str, ondone, classNameForExtraElements, omitExtraElements) { return __.htmlScriptStyleLinkMetaTitle(str, ondone, _lib.targets, classNameForExtraElements, "", "", "append", omitExtraElements); };
				_lib.insertHtmlJsCssBefore=function(str, beforeSelector, ondone, classNameForExtraElements, omitExtraElements) { return __.htmlScriptStyleLinkMetaTitle(str, ondone, _lib.targets, classNameForExtraElements, "", "", "append", omitExtraElements, beforeSelector); };
				_lib.prependHtmlJsCss=function(str, ondone, classNameForExtraElements, omitExtraElements) { return __.htmlScriptStyleLinkMetaTitle(str, ondone, _lib.targets, classNameForExtraElements, "", "", "prepend", omitExtraElements); };
				_lib.cloneTo=function(targetsList, boolCloneChildren, attr) { return __.cloneTo(targetsList, boolCloneChildren, attr, _lib.targets); };
				_lib.isChildOf=function(parent) { return __.isChildOf(parent, _lib.targets); };
				_lib.isChildOfDeepWIthIndexes=function(parent) { return __.isChildOfDeepWIthIndexes(parent, _lib.targets); };
				_lib.isParentOf=function(child) { return __.isParentOf(child, _lib.targets); };
				_lib.is=function(value) { __.is(value, _lib.targets); };
				_lib.insertNodeAtIndex=function(node, index) { __.insertNodeAtIndex(node, index, _lib.targets); };
				_lib.href=function(str) { return __.href(str, _lib.targets); };
				_lib.createNode=function(type, params, iHTML, NS) { return __.createNode(type, params, iHTML, _lib.targets, NS); };
				_lib.createNodeAtIndex=function(type, index, params, iHTML, NS) { return __.createNodeAtIndex(type, index, params, iHTML, _lib.targets, NS); };
				_lib.ltwh=function() { return __.ltwh(_lib.targets); };
				_lib.ltwhRelativeTo=function(container) { return __.ltwhRelativeTo(_lib.targets, container); };
				_lib.getTextNodes=function() { return __.getTextNodes(_lib.targets); };
				_lib.getNodesWithoutChildrenOrOnlyTextNodes=function() { return __.getNodesWithoutChildrenOrOnlyTextNodes(_lib.targets); };
				_lib.getIndexOfNodes=function() { return __.getIndexOfNodes(_lib.targets); };
				_lib.each=function(fn) { return __.each(fn, _lib.targets); };
				_lib.attr=function(obj) { return __.attr(obj, _lib.targets); };
				_lib.getNodesContainingTextNodesAndTextContent=function() { return __.getNodesContainingTextNodesAndTextContent(_lib.targets, ""); };
				_lib.commonAncestorWith=function(element) { return __.commonAncestorWith(_lib.targets, element); };
				return _lib;
			};
			return _lib(obj, nostop);
		} else {
			lib.address=lib.prototype.address=__.address;
			lib.ajax=lib.prototype.ajax=__.ajax;
			lib.RGBtoHSL=lib.prototype.RGBtoHSL=__.RGBtoHSL;
			lib.HSLtoRGB=lib.prototype.HSLtoRGB=__.HSLtoRGB;
			lib.colorToRGBa=lib.prototype.colorToRGBa=__.colorToRGBa;
			lib.roundTo=lib.prototype.roundTo=__.roundTo;
			lib.floorTo=lib.prototype.floorTo=__.floorTo;
			lib.ceilTo=lib.prototype.ceilTo=__.ceilTo;
			lib.hexToDec=lib.prototype.hexToDec=__.hexToDec;
			lib.decToHex=lib.prototype.decToHex=__.decToHex;
			lib.binToDec=lib.prototype.binToDec=__.binToDec;
			lib.decToBin=lib.prototype.decToBin=__.decToBin;
			lib.strToHex=lib.prototype.strToHex=__.strToHex;
			lib.hexToStr=lib.prototype.hexToStr=__.hexToStr;
			lib.utfToStr=lib.prototype.utfToStr=__.utfToStr;
			lib.utfToHtml=lib.prototype.utfToHtml=__.utfToHtml;
			lib.htmlEntitiesToXmlNumberedEntities=lib.prototype.htmlEntitiesToXmlNumberedEntities=__.htmlEntitiesToXmlNumberedEntities;
			lib.htmlEntitiesToUTF=lib.prototype.htmlEntitiesToUTF=__.htmlEntitiesToUTF;
			lib.capitalize=lib.prototype.capitalize=__.capitalize;
			lib.pad=lib.prototype.pad=__.pad;
			lib.matrix=lib.prototype.matrix=__.matrix;
			lib.gcd=lib.prototype.gcd=__.gcd;
			lib.lcm=lib.prototype.lcm=__.lcm;
			lib.htmlEntityDecode=lib.prototype.htmlEntityDecode=__.htmlEntityDecode;
			lib.substrWithHtmlEntities=lib.prototype.substrWithHtmlEntities=__.substrWithHtmlEntities;
			lib.trim=lib.prototype.trim=__.trim;
			lib.truncationPreservingHTML=lib.prototype.truncationPreservingHTML=__.truncationPreservingHTML;
			lib.stripSlashes=lib.prototype.stripSlashes=__.stripSlashes;
			lib.removeSlashes=lib.prototype.removeSlashes=__.removeSlashes;
			lib.escapeQuotes=lib.prototype.escapeQuotes=__.escapeQuotes;
			lib.escapeSimpleQuotes=lib.prototype.escapeSimpleQuotes=__.escapeSimpleQuotes;
			lib.escapeDoubleQuotes=lib.prototype.escapeDoubleQuotes=__.escapeDoubleQuotes;
			lib.unescapeQuotes=lib.prototype.unescapeQuotes=__.unescapeQuotes;
			lib.unescapeSimpleQuotes=lib.prototype.unescapeSimpleQuotes=__.unescapeSimpleQuotes;
			lib.unescapeDoubleQuotes=lib.prototype.unescapeDoubleQuotes=__.unescapeDoubleQuotes;
			lib.implode=lib.prototype.implode=__.implode;
			lib.explode=lib.prototype.explode=__.explode;
			lib.concatArraysWithStringKeys=lib.prototype.concatArraysWithStringKeys=__.concatArraysWithStringKeys;
			lib.arrayDuplicate=lib.prototype.arrayDuplicate=__.arrayDuplicate;
			lib.objectDuplicate=lib.prototype.objectDuplicate=__.objectDuplicate;
			lib.isArray=lib.prototype.isArray=__.isArray;
			lib.isNumericalArray=lib.prototype.isNumericalArray=__.isNumericalArray;
			lib.isObject=lib.prototype.isObject=__.isObject;
			lib.objToGetUrl=lib.prototype.objToGetUrl=__.objToGetUrl;
			lib.spliceAtKeys=lib.prototype.spliceAtKeys=__.spliceAtKeys;
			lib.spliceAtKeysRecursive=lib.prototype.spliceAtKeysRecursive=__.spliceAtKeysRecursive;
			lib.lastKeyIn=lib.prototype.lastKeyIn=__.lastKeyIn;
			lib.keyAtIndex=lib.prototype.keyAtIndex=__.keyAtIndex;
			lib.indexOfKey=lib.prototype.indexOfKey=__.indexOfKey;
			lib.hasNotNumericKeys=lib.prototype.hasNotNumericKeys=__.hasNotNumericKeys;
			lib.numericalIndexOfVal=lib.prototype.numericalIndexOfVal=__.numericalIndexOfVal;
			lib.indexesOfValRecursive=lib.prototype.indexesOfValRecursive=__.indexesOfValRecursive;
			lib.indexesOfKeyAndValRecursive=lib.prototype.indexesOfKeyAndValRecursive=__.indexesOfKeyAndValRecursive;
			lib.valueExistsIn=lib.prototype.valueExistsIn=__.valueExistsIn;
			lib.valueExistsInRecursive=lib.prototype.valueExistsIn=__.valueExistsIn;
			lib.countProperties=lib.prototype.countProperties=__.countProperties;
			lib.countNumberValues=lib.prototype.countNumberValues=__.countNumberValues;
			lib.countStringValues=lib.prototype.countStringValues=__.countStringValues;
			lib.countNotNullValues=lib.prototype.countNotNullValues=__.countNotNullValues;
			lib.countNotFunctionValues=lib.prototype.countNotFunctionValues=__.countNotFunctionValues;
			lib.countNotNumberValues=lib.prototype.countNotNumberValues=__.countNotNumberValues;
			lib.countNotStringValues=lib.prototype.countNotStringValues=__.countNotStringValues;
			lib.countPropertiesForValue=lib.prototype.countPropertiesForValue=__.countPropertiesForValue;
			lib.countPropertiesWhereValueEqualsRecursive=lib.prototype.countPropertiesWhereValueEqualsRecursive=__.countPropertiesWhereValueEqualsRecursive;
			lib.countPropertiesNamedRecursive=lib.prototype.countPropertiesNamedRecursive=__.countPropertiesNamedRecursive;
			lib.getPropertiesWhereValueEquals=lib.prototype.getPropertiesWhereValueEquals=__.getPropertiesWhereValueEquals;
			lib.searchItem=lib.prototype.searchItem=__.searchItem;
			lib.spliceInObjectWhereHas=lib.prototype.spliceInObjectWhereHas=__.spliceInObjectWhereHas;
			lib.selection=lib.prototype.selection=__.selection;
			lib.windowWH=lib.prototype.windowWH=__.windowWH;
			lib.json=lib.prototype.json=__.json;
			lib.unicodeInterpreter=lib.prototype.unicodeInterpreter=__.unicodeInterpreter;
			lib.regMatchCount=lib.prototype.regMatchCount=__.regMatchCount;
			lib.unQuoteOrTranstype=lib.prototype.unQuoteOrTranstype=__.unQuoteOrTranstype;
			lib.removeDiacritics=lib.prototype.removeDiacritics=__.removeDiacritics;
			lib.urlizeASCII=lib.prototype.urlizeASCII=__.urlizeASCII;
			lib.urlizeUTF=lib.prototype.urlizeUTF=__.urlizeUTF;
			lib.quicksort=lib.prototype.quicksort=__.quicksort;
			lib.preventMultipleThrowsDuringPeriod=lib.prototype.preventMultipleThrowsDuringPeriod=__.preventMultipleThrowsDuringPeriod;
			lib.refresh=lib.prototype.refresh=__.refresh;
			lib.intervals=lib.prototype.intervals=__.intervals;
			lib.temporize=lib.prototype.temporize=__.temporize;
			lib.wait=lib.prototype.wait=__.wait;
			lib.isInPolygon=lib.prototype.isInPolygon=__.isInPolygon;
			lib.lineIntersectsLine=lib.prototype.lineIntersectsLine=__.lineIntersectsLine;
			lib.printR=lib.prototype.printR=function(obj) { return __.printR(obj, 0); };
			lib.each=lib.prototype.each=function(obj, fn) { return __.each(fn, obj); };
			lib.guid=lib.prototype.guid=__.guid;
			lib.hitTest=lib.prototype.hitTest=__.hitTest;
			lib.hitTestPolygons=lib.prototype.hitTestPolygons=__.hitTestPolygons;
			lib.getDpi=lib.prototype.getDpi=__.getDpi;
			lib.getPixelColor=lib.prototype.getPixelColor=__.getPixelColor;
			lib.setPixelColor=lib.prototype.setPixelColor=__.setPixelColor;
			lib.getTouch=lib.prototype.getTouch=function() { return __.touch; };
			return lib;
		}
	};
}