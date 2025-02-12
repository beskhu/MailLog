var lpslt={
	paths:[],
	d1:[],
	d2:[],
	renewSessionIntervalId:-1,
	checkVisibilityStateId:-1,
	visible:!!1,
	connexionsLost:0,
	onLoaded:function(bool) {
		lpslt.locale=locale;
		lpslt.wrapper=lib("#wrapper").targets[0];
		lpslt.wrapperContent=lib("#wrapper .content").targets[0];
		lpslt.background=lib("#background").targets[0];
		lpslt.headerAndMenu=lib("#headerAndMenu").targets[0];
		lpslt.header=lib("#header").targets[0];
		lpslt.menu=lib("#menu").targets[0];
		lib("#loader").to({ style: { opacity:0 }}, { duration:500, oncomplete:function() { lib(".loading").remove(); } });
		lib([lpslt.wrapper, lpslt.background, lpslt.headerAndMenu]).css({ display:"block" });
		lib([lpslt.wrapper, lpslt.background, lpslt.headerAndMenu]).to({ style: { opacity:1 } }, { duration:250 });
		lib("#subwrapper").to({ style: { opacity:1 } }, { duration:250 });
		lpslt.tweaks();
		lpslt.tweakLinks();
		lpslt.history=("history" in window && "pushState" in window.history && typeof(window.history.pushState)==="function")?window.history:("History" in window && "pushState" in window.History && typeof(window.History.pushState)==="function"?window.History:null);
		for (var p in onLoadedFunctions) {
			if (typeof(onLoadedFunctions[p]==="function")) {
				onLoadedFunctions[p]();
			}
		}
		if (typeof(onUnloadFunctions)!=="undefined" && __.isArray(onUnloadFunctions) && onUnloadFunctions.length>0) {
			lpslt.onUnloadFunctions=onUnloadFunctions;
		}
		if (!bool) {
			lib("window").on("keydown", lpslt.keydown);
			lib("window").on("keyup", lpslt.keyup);
			lib("window").on("resize", lpslt.tweaks);
			lib([window, document.documentElement, document.body]).on("scroll", function() { lpslt.scrollTweaks(); });
			lib("#subwrapper").find("button").on("click", function(e) { e.preventDefault(); e.stopPropagation(); });
			var addr=lib().address.pathName();
			addr=addr.replace(/^.*\//, "");
			lpslt.currentPage=addr;
			lpslt.currentTitle=document.title;
			lpslt.history.replaceState({ addr:addr }, document.title, addr);
			lib().address.change(function(event) {
				var addr=lib().address.hash().substr(1);
				lpslt.ajax(addr, true);
			});
			lib("window").on("popstate", function(event) {
				if (event.state!==null) {
					var addr=event.state.addr.replace(/^.*\//, "");
					lpslt.ajax(addr, false);
				}
			});
		}
		lpslt.visible=document.visibilityState==="visible";
		lpslt.checkVisibilityStateId=setInterval(function() {
			if (log.logged && lpslt.visible===!1 && document.visibilityState==="visible") {
				admin.init(function() { return true; }, "reload");
			}
			lpslt.visible=document.visibilityState==="visible";
		}, 100);
		lpslt.renewSessionIntervalId=setInterval(function() {
			lib().ajax({ type:"GET", url:"./lpslt/php/session.php", data:null, onsuccess:function (data) { return true; }, onfail:function(data) { lpslt.connexionsLost++; if (lpslt.connexionsLost<3) { lpslt.error(locales["errorHasOccured"]+locales["connexionLost"]); } else if (lpslt.connexionsLost>=3) { document.location.reload(); } } }); 
		}, 600000);
		 lpslt.scrollTop();
	},
	keys:[],
	keydown:function(event) {
		var key=("which" in event && typeof(event.which)!=="undefined")?event.which:event.key;
		lpslt.keys[key]=true;
	},
	keyup:function(event) {
		var key=("which" in event && typeof(event.which)!=="undefined")?event.which:event.key;
		lpslt.keys[key]=false;
	},
	tweaks:function() {
		lpslt.setFontSize();
		lib("#blank").css({ height:(5*parseFloat(lib("#header_part_1").css("font-size", "px")[0])+3*parseFloat(lib("#header_part_2").css("font-size", "px")[0]))/parseFloat(lib("#blank").css("font-size", "px")[0])+"em" });
		lpslt.fixForScrollBars(true);
		lpslt.scrollTweaks(true);
	},
	setFontSize:function() {
		var ltwh=lib("#wrapper").ltwhRelativeTo(document.body)[0];
		lpslt.fs=ltwh.width/100;
		lib("body").css({ fontSize:lpslt.fs+"px" });
	},
	emptyIf:function(element, str) {
		if (element.value===str) {
			element.value="";
		}
	},
	fillIfEmpty:function(element, str) {
		if (element.value==="") {
			element.value=str;
		}
	},
	reloadMenu:function() {
		lib().ajax({
			type:"GET",
			url:"./lpslt/dependencies/headerAndMenu.php", 
			data:null,
			onsuccess:function(data) { 
				lib("#headerAndMenu").html(data.d.replace(/<div id="headerAndMenu">(.+)<\/div>\n/, "$1"));
			},
			onfail:function(data) {
				lpslt.message.simple(data.d+locales['contactAdministrator'], "red", null);
			}
		}); 
	},
	lastBodyWidth:false,
	menuOpened:false,
	isTouchDevice:'ontouchstart' in document.documentElement,
	ltwhWrapperContent:{},
	scrollableHorizontally:[],
	scrollableVertically:[],
	scrollBarWidth:[],
	scrollBarHeight:[],
	ajax:function(addr, boolState, historyAction) {
		addr=addr.toLowerCase();
		var add;
		if (addr==="") addr="accueil";
		if (!/^deconnexion|lpslt|logout$/i.test(addr)) {
			if (/--[a-z0-9-]+/.test(addr)) {
				var ex=/(.+)--([a-z0-9-]+)/.exec(addr);
				addr=ex[1];
				add=ex[2];
			} else {
				add="";
			}
			lib().ajax({
				type:"POST", 
				url:"./lpslt/php/ajax-page.php",
				data: { page:addr, add:add },
				onsuccess:function(data) {
					if (data.d!=="") {
						if (!lpslt.waitUntilAdminInitiated) {
							if (!/\{.+\}/.test(data.d)) {
								d=lpslt.decryptAjaxResponse(data.d);
							} else {
								try { var d=lib().json.parse(data.d); } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); }
							}
							if (boolState && typeof(historyAction)==="undefined") { lpslt.history.pushState({ addr:addr+(add.length>0?"--"+add:"") }, (lib().isObject(d) && "title" in d?d.title:""), addr+(add.length>0?"--"+add:"")); }
							else if (boolState && typeof(historyAction)!=="undefined") { lpslt.history.replaceState({ addr:addr+(add.length>0?"--"+add:"") }, (lib().isObject(d) && "title" in d?d.title:""), addr+(add.length>0?"--"+add:"")); }
							if (lib().isObject(d)) {
								if ("contents" in d) {
									lpslt.currentPage=addr+(add.length>0?"--"+add:"");
									lpslt.page(d.contents, lpslt.currentPage);
									if ("slug" in d) {
										lpslt.history.replaceState({ addr:d.slug+(add.length>0?"--"+add:"") }, (lib().isObject(d) && "title" in d?d.title:""), d.slug+(add.length>0?"--"+add:""));
									}
								} else if ("alert" in d) {
									lpslt.notice(d.alert);
									lpslt.history.replaceState({ addr:lpslt.currentPage }, lpslt.currentTitle, lpslt.currentPage);
								}
							} else if (log.logged) {
								if (lpslt.reloadInterval>-1) {
									clearInterval(lpslt.reloadInterval);
									lpslt.reloadInterval=-1;
								}
								lpslt.reloadInterval=setInterval(function() { admin.init(function() { lpslt.ajax(addr, true); }, "reload"); }, 3000);
							}
						} else {
							lpslt.message.temporary(locales["waitUntilAdminInitiated"], "orange", function() {}, 3000);
						}
					} else {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
						if (boolState) { lpslt.history.pushState({ addr:addr+(add.length>0?"--"+add:"") }, locales["parsingError"]+locales["emptyString"], addr+(add.length>0?"--"+add:"")); }
					}
				},
				onfail:function(data) {
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
					var path=lib().address.pathName();
					if (boolState) { lpslt.history.replaceState({ addr:path+(add.length>0?"--"+add:"") }, lpslt.currentTitle, path+(add.length>0?"--"+add:"")); }
				}
			});
		} else if (addr==="lpslt") {
			var path=lib().address.pathName();
			if (boolState) { lpslt.history.replaceState({ addr:path }, lpslt.currentTitle, path); }
		} else if (addr==="deconnexion" || addr==="logout") {
			log.logout();
			if (boolState && typeof(historyAction)==="undefined") { lpslt.history.pushState({ addr:addr }, locales["deconnection"], addr); }
			else if (boolState && typeof(historyAction)!=="undefined") { lpslt.history.replaceState({ addr:addr }, locales["deconnection"], addr); }
		}
	},
	preventDefaultOnImg:function() {
		lib("img").on("dragenter", function(e) { e.preventDefault(); });
		lib("img").on("mousedown", function(e) { e.preventDefault(); });
	},
	page:function(contents, name) {
	    var i, img, c;
		if (contents) {
			lib("#subwrapper").to({ style: { opacity:0 } }, { duration:250, oncomplete:function() {
				for (i=0; i<lpslt.onUnloadFunctions.length; i++) {
					typeof(lpslt.onUnloadFunctions[i])==="function" && lpslt.onUnloadFunctions[i]();
					lpslt.onUnloadFunctions[i]=[];
				}
				onLoadedFunctions=[];
				lib(".frontend_extra").remove();
				lib(".lg_script").remove();
				lib("#subwrapper").htmlJsCss(contents, null, "frontend_extra", "subwrapper");
				lib("#subwrapper").find("button").on("click", function(e) { e.preventDefault(); e.stopPropagation(); });
				lpslt.fixForScrollBars(true);
				var loader=lib("body").createNode("div", { id:"loader", className:"loading", style:"display:block; position:absolute; opacity:1; width:100%; height:100%; color:#fff; z-index:32768;" }, "").targets[0];
				var wTot=window.innerWidth;
				var hTot=window.innerHeight;
				var dim=(hTot+wTot)/2;
				var str="";
				var percent=0;
				var tQ=[];
				if (!/iphone|ipod|ipad|blackberry|galaxy|android|mobile/i.test(navigator.userAgent)) {
					loader.style.left="40%";
					loader.style.top=Math.round(window.innerHeight*0.4)+"px";
					loader.style.width="20%";
					loader.style.height=Math.round(window.innerHeight*0.2)+"px";
				} else {
					loader.style.left="30%";
					loader.style.top=Math.round(window.innerHeight*0.3)+"px";
					loader.style.width="40%";
					loader.style.height=Math.round(window.innerHeight*0.4)+"px";
				}
				str+="\n\t\t"+'<span style="position:absolute; width:'+Math.round(dim*0.2)+'px; height:'+Math.round(dim*0.2)+'px; left:50%; margin-left:'+Math.round(-dim*0.1)+'px; top:50%; margin-top:'+Math.round(-dim*0.1)+'px; font-size:'+Math.round(dim*0.025)+'px;"><canvas width=500 height=500 style="width:100%; height:100%;" id="_arc"></canvas></span>';
				str+="\n\t\t"+'<span id="_pct" style="position:absolute; width:'+Math.round(dim*0.2)+'px; height:'+Math.round(dim*0.025)+'px; left:50%; margin-left:'+Math.round(-dim*0.1)+'px; top:50%; margin-top:'+Math.round(-dim*0.0175)+'px; font-size:'+Math.round(dim*0.025)+'px; font-weight:bold; text-align:center; font-family:Arial; color:#000;"></span>';
				loader.innerHTML=str;
				var rounds=[];
				for (var i=18; i<=360; i+=18) {
					rounds[i]=document.getElementById('_____'+i);
				}
				var percentCont=document.getElementById("_pct");
				var arc=document.getElementById("_arc");
				var ctx=arc.getContext("2d");
				function drawPercent(pct) {
					var currentAngle=pct/100*Math.PI*2;
					ctx.clearRect(0, 0, 500, 500);
					ctx.beginPath();
					ctx.lineWidth=10;
					ctx.strokeStyle="#000";
					ctx.arc(250, 250, 240, 0, currentAngle);
					ctx.stroke();
					percentCont.innerHTML=Math.round(pct)+"%";
				}
				img=lib("#subwrapper img").targets;
				c=0;
				var linearEasing=function () {
					if (typeof(tQ)!=undefined && tQ.length==6) {
						if (tQ[3]<tQ[4]) {
							var value;
							tQ[3]+=25;
							value=tQ[1]+(tQ[2]-tQ[1])*(tQ[3]/tQ[4]);
							tQ[0](value);
						} else {
							if (tQ[5]!=false) {
								tQ[5]();
								tQ=[];
							}
						}
					}
				};
				easingTimerId=setInterval(linearEasing, 25);
				if (img.length>0) {
					for (i=0; i<img.length; i++) {
						img[i].onload=img[i].onerror=function() {
							c++;
							var old_percent=percent;
							percent=Math.ceil(c/img.length*100);
							if (percent>=100) percent=100;
							tQ=(tQ[2]!=percent)
								?[function (pct) { drawPercent(pct); }, old_percent, percent, 0, 250, function () { if (c===img.length) { lpslt.onLoaded(true); clearInterval(easingTimerId); }}]
								:tQ
							;
						}
					}
				} else {
					tQ=[function (pct) { drawPercent(pct); }, 0, 100, 0, 250, function() { lpslt.onLoaded(true); clearInterval(easingTimerId); }];
				}
			} });
		}
	},
	tweakLinks:function() {
		var hasHref=lib(":not(link):not(img)[href]").targets;
		var nohash=lib().address.nohash().replace(/[^\/]+$/, "");
		var href;
		if (hasHref.hasOwnProperty("length")) {
			for (var i=0; i<hasHref.length; i++) {
				if ((hasHref[i].href.toString().indexOf(nohash)!=-1 || hasHref[i].href.toString().replace(/[^\/]+$/, "")==="") && !/#[a-z0-9-]+$/.test(hasHref[i].href.toString()) && hasHref[i].href.toString().replace(nohash, "")!=="") {
					lib([hasHref[i]]).off("click", function(e) { e.preventDefault(); var t=e.libTarget; if ("href" in t) { lpslt.ajax(t.href.toString().replace(/^(?:.+\/)?([a-z0-9-]+)$/, "$1"), true); } });
					lib([hasHref[i]]).on("click", function(e) { e.preventDefault(); var t=e.libTarget; if ("href" in t) { lpslt.ajax(t.href.toString().replace(/^(?:.+\/)?([a-z0-9-]+)$/, "$1"), true); } });
				}
			}
		}
		lib('a[href$="#lpslt"]').on("click", function(e) { e.preventDefault(); });
	},
	getScrollBarWidth:function() {
		var inner = document.createElement('p');
		lib([inner]).css({ width:"100%", height:"200px" });
		var outer = document.createElement('div');
		lib([outer]).css({ position:"absolute", top:"0px", left:"0px", visibility:"hidden", width:"200px", height:"150px", overflow:"hidden" });
		outer.appendChild(inner);
		document.body.appendChild(outer);
		var w1=inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2=inner.offsetWidth;
		if (w1==w2) w2=outer.clientWidth;
		document.body.removeChild (outer);
		return (w1 - w2);
	},
	fixForScrollBars:function(now) {
		var scrollBarWidth=lpslt.getScrollBarWidth();
		var fs=(document.documentElement.offsetWidth-scrollBarWidth)/document.documentElement.offsetWidth;
		if (document.documentElement.offsetHeight<lpslt.wrapperContent.offsetHeight && document.documentElement.offsetHeight<(lpslt.wrapperContent.offsetHeight)*fs) {
			if (now) { 
				lib([lpslt.wrapperContent]).css({ fontSize:fs+"em" });
				lib([lpslt.headerAndMenu]).css({ fontSize:fs+"em" });
				lib([lpslt.headerAndMenu]).css({ width:lpslt.wrapper.offsetWidth+"px" });
			} else { 
				lib([lpslt.wrapperContent]).to({ style: { fontSize:fs+"em" } }, { duration:250 });
				lib([lpslt.headerAndMenu]).to({ style: { fontSize:fs+"em" } }, { duration:250 });
				lib([lpslt.headerAndMenu]).to({ style: { width:lpslt.wrapper.offsetWidth+"px" } }, { duration:250 });
			}
		} else {
			if (now) {
				lib([lpslt.wrapperContent]).css({ fontSize:"1em" });
				lib([lpslt.headerAndMenu]).css({ fontSize:"1em" });
				lib([lpslt.headerAndMenu]).css({ width:lpslt.wrapper.offsetWidth+"px" });
			} else { 
				lib([lpslt.wrapperContent]).to({ style: { fontSize:"1em" } }, { duration:250 });
				lib([lpslt.headerAndMenu]).to({ style: { fontSize:"1em" } }, { duration:250 });
				lib([lpslt.headerAndMenu]).to({ style: { width:lpslt.wrapper.offsetWidth+"px" } }, { duration:250 });
			}
		}
	},
	elementFixForScrollBars:function(now, element) {
		var scrollBarWidth=lpslt.getScrollBarWidth();
		var fs=(element.offsetWidth-scrollBarWidth)/element.offsetWidth;
		if (element.offsetHeight<element.querySelector(".lpslt_content").offsetHeight && element.offsetHeight<(element.querySelector(".lpslt_content").offsetHeight)*fs) {
			if (now) { 
				lib([element]).find(".lpslt_content").css({ fontSize:fs+"em" });
			} else { 
				lib([element]).find(".lpslt_content").to({ style: { fontSize:fs+"em" } }, { duration:250 });
			}
		} else {
			if (now) {
				lib([element]).find(".lpslt_content").css({ fontSize:"1em" });
			} else { 
				lib([element]).find(".lpslt_content").to({ style: { fontSize:"1em" } }, { duration:250 });
			}
		}
	},
	scrollTop:function() {
		lib("html").to({ scrollTop:0 }, { duration:200 });
	},
	scrollTo:function(v) {
		lib("html").to({ scrollTop:v }, { duration:200 });
	},
	scrollTweaks:function(now) {
		var scrollTop=Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		var scrollLeft=Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		if (typeof(now)==="undefined" || !now) {
			if (scrollTop>0) {
				lib("#header_part_1").to({ style: { height:"0em" }}, { duration:200 });
				lib([lpslt.header]).to({ style: { height:parseFloat(lib("#header_part_2").css("height", "px")[0])/parseFloat(lib("#header").css("font-size", "px")[0])+"em" }}, { duration:200 });
				if (lib('#lpslt_bubble_content').targets[0].childNodes.length>0) {
					lib("#lpslt_searchResults").to({ style: { top:parseFloat(lib("#header_part_2").css("height","px")[0])/lpslt.fs+"em" } }, { duration:200 });
				}
				lib("#logo, #title, #logout").to({ style: { opacity:0 } }, { duration:200, oncomplete:function() { lib("#logo, #title, #logout").css({ visibility:"hidden" }); } });
			} else {
				lib("#header_part_1").to({ style: { height:"5em" }}, { duration:200 });
				lib([lpslt.header]).to({ style: { height:(5*parseFloat(lib("#header_part_1").css("font-size", "px")[0])+parseFloat(lib("#header_part_2").css("height", "px")[0]))/parseFloat(lib("#header").css("font-size", "px")[0])+"em" }}, { duration:200 });
				if (lib('#lpslt_bubble_content').targets[0].childNodes.length>0) {
					lib("#lpslt_searchResults").to({ style: { top:(parseFloat(lib("#header_part_2").css("height","px")[0])+5*parseFloat(lib("#header_part_1").css("font-size", "px")[0]))/lpslt.fs+"em" } }, { duration:200 });
				}
				lib("#logo, #title, #logout").css({ visibility:"visible" });
				lib("#logo, #title, #logout").to({ style: { opacity:1 } }, { duration:200 });
			}
			lib([lpslt.headerAndMenu]).to({ style: { left:-scrollLeft+"px" } }, { duration:200 });
		} else {
			if (scrollTop>0) {
				lib("#header_part_1").css({ height:"0em" });
				lib([lpslt.header]).css({ height:parseFloat(lib("#header_part_2").css("height", "px")[0])/parseFloat(lib("#header").css("font-size", "px")[0])+"em" });
				if (lib('#lpslt_bubble_content').targets[0].childNodes.length>0) {
					lib("#lpslt_searchResults").css({ top:parseFloat(lib("#header_part_2").css("height","px")[0])/lpslt.fs+"em" });
				}
				lib("#logo, #title, #logout").css({ opacity:0, visibility:"hidden" });
			} else {
				lib("#header_part_1").css({ height:"5em" });
				lib([lpslt.header]).css({ height:(5*parseFloat(lib("#header_part_1").css("font-size", "px")[0])+parseFloat(lib("#header_part_2").css("height", "px")[0]))/parseFloat(lib("#header").css("font-size", "px")[0])+"em" });
				if (lib('#lpslt_bubble_content').targets[0].childNodes.length>0) {
					lib("#lpslt_searchResults").css({ top:(parseFloat(lib("#header_part_2").css("height","px")[0])+5*parseFloat(lib("#header_part_1").css("font-size", "px")[0]))/lpslt.fs+"em" });
				}
				lib("#logo, #title, #logout").css({ opacity:1, visibility:"visible" });
			}
			lib([lpslt.headerAndMenu]).css({ left:-scrollLeft+"px" });
		}
    },
    lastSearchValue:"",
	searchQueue:[],
	checkAndSearch:function(elm) {
		lib("#lpslt_searchEngine").off("mouseout", lpslt.searchVanish);
		var v=elm.innerHTML;
		if (v!=lpslt.lastSearchValue && v.length>=2 && lpslt.searchQueue.indexOf(v)==-1) {
			lpslt.searchQueue.push(v);
			var l=lpslt.searchQueue.length;
			setTimeout(function(len) { lpslt.search(l); }, 1000);
			lpslt.lastSearchValue=v;
		} else if (v!=lpslt.lastSearchValue && v.length<2) {
			lpslt.searchQueue=[];
			lpslt.lastSearchValue=v;
		}
	},
	searchAnimated:false,
	toggleSearch:function() {
		if (parseFloat(lib("#lpslt_search_cont").css("width")[0])===0) {
			lpslt.searchShow();
		} else {
			lpslt.searchVanish();
		}
	},
	searchShow:function() {
		if (!lpslt.searchAnimated) {
			lpslt.searchAnimated=true;
			lib("#lpslt_search_cont").to({ style: { backgroundColor:"#ffffff", width:"5em", opacity:1 }}, { duration:250 });
			lib("#lpslt_search").to({ style: { color:"#000000" }}, { duration:250 });
			lib("#lpslt_search").off("keydown", function(e) { e.preventDefault(); });
			setTimeout(function() { lpslt.searchAnimated=false; }, 300);
		}
	},
	searchVanish:function() {
		if (!lpslt.searchAnimated) {
			lpslt.searchAnimated=true;
			lib("#lpslt_search").targets[0].blur();
			lib("#lpslt_search_cont").to({ style: { backgroundColor:"#666666", width:"0em", opacity:0 }}, { duration:250 });
			lib("#lpslt_search").to({ style: { color:"#ffffff" }}, { duration:250 });
			lib("#lpslt_search").on("keydown", function(e) { e.preventDefault(); });
			setTimeout(function() { lpslt.searchAnimated=false; }, 300);
		}
	},
	searchFocus:function() {
		if (lib("#lpslt_search").targets[0].innerHTML==locales["search"]) {
			lib("#lpslt_search").targets[0].innerHTML="";
		}
	},
	searchBlur:function() {
		if (lib("#lpslt_search").targets[0].innerHTML=="") {
			lib("#lpslt_search").targets[0].innerHTML=locales["search"];
		}
	},
	search:function(len) {
		if (lpslt.searchQueue.length==len && lpslt.searchQueue[lpslt.searchQueue.length-1]==lpslt.lastSearchValue) {
			var s=lpslt.searchQueue[lpslt.searchQueue.length-1];
			lib().ajax({ url:"./lpslt/php/ajax-search.php", type:"POST", data: { search:s }, onsuccess:function(data) { lpslt.searchRes(data.d, data.s); }, onfail:function(data) { lpslt.searchRes(lib().json.stringify([locales["errorHasOccured"]+"<b>"+data.d+"</b>"]), s); }, addparams:{s:s} });
			lpslt.searchQueue=[];
		}
	},
	searchRes:function(results, s) {
		var tab=[];
		var i=0;
		var str=locales["noResult"];
		var boolRes=false;
		try { var res=lib().json.parse(results); } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); }
		for (var prop in res) {
			if (res[prop]==locales['noSearchResult'] || res[prop].indexOf(locales["errorHasOccured"])!=-1) {
				tab[i]=[res[prop]];
				boolRes=false;
			} else if (res[prop]!=undefined && res[prop]!="") {
				tab[i]=[];
				for (var key in res[prop]) {
					tab[i][key]=res[prop][key];
				}
				i++;
				boolRes=true;
			}
		}
		for (i=0; i<tab.length; i++) {
			if (tab[i].length>1) {
				// unicode conversion
				tab[i][4]=lib().unicodeInterpreter(tab[i][4]);
				tab[i][5]=lib().unicodeInterpreter(tab[i][5]);
				// agencement d'un résultat: 0=>chaîne cherchée, 1=>points, 2=>levenshtein, 3=>id article, 4=>titre article, 5=>chaîne partielle à afficher, 6=>timestamp
			}
		}
		lpslt.searchDisplay(boolRes, tab, s);
	},
	searchDisplay:function(boolRes, obj, s) {
		var arr=[];
		lib('#lpslt_searchResults').css({ display:"block", right:"1.5em", opacity:1 });
		var fsSR=parseFloat(lib("#lpslt_searchResults").css("font-size", "em")[0]);
		if (!boolRes) {
			arr.push('<a href="#lpslt" onclick="lpslt.searchClose();" class="link_result_line"><span class="lpslt_result_title">'+obj[0]+'</span></a>');
		} else {
			var lt='<';
			var gt='>';
			for (var i=0; i<obj.length; i++) {
				var chaine=obj[i][5];
				var content='<span style="font-size:1em;">'+chaine+'</span>';
				var title=obj[i][4];
				var urlizedTitle=lib().urlize(title);
				arr.push('<a href="#'+urlizedTitle+'" class="link_result_line"><span class="lpslt_result_title">'+title+'</span><span class="lpslt_result_line">'+content+'</span></a>');
			}
		}
		var strResClose='<span class="lpslt_result_line"><span style="display:block; font-weight:400;"><i>'+locales['searchResults']+'</i></span><a href="#lpslt" onclick="lpslt.searchClose();"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.75em" height="1.75em" viewBox="0 0 300 300" xml:space="preserve" style="display:block; position:absolute; right:0.6em; top:-0.2em;"><defs></defs><g fill="none" stroke="#000" stroke-width="25" stroke-miterlimit="10"><rect fill="none" x="0" y="0" width="300" height="300" style="visibility:hidden;"/><circle cx="150" cy="150" r="100"/><line x1="100" y1="100" x2="200" y2="200"/><line x1="200" y1="100" x2="100" y2="200"/></g></svg></a>';
		var str=strResClose+lib().implode('', arr);
		lib('#lpslt_searchResults').createNode("span", { id:"lpslt_invisible", style:"display:block; visibility:visible; width:18em; height:auto; position:absolute;" }, str);
		var h=lib('#lpslt_invisible').targets[0].offsetHeight;
		lib('#lpslt_invisible').remove();
		var ltwh=lib('#lpslt_searchEngine').ltwhRelativeTo(document.body)[0];
		if (lib('#lpslt_bubble_content').targets[0].childNodes.length==0) {
			lib("#lpslt_searchResults").css({ top:((ltwh.top+ltwh.height)/(lpslt.fs*fsSR)-1/fsSR)+"em" });
			lib('#lpslt_bubble_top').to({ style: { height:"4em" }}, { duration:250, easing:"easeOutQuad" });
			lib('#lpslt_bubble_middle').to({ style: { height:h/(lpslt.fs*fsSR)+"em" }}, { duration:500, oncomplete:function() {
				lib('#lpslt_bubble_content').appendHtml(str);
				lib('a[href$="#lpslt"]').off("click", function(e) { e.preventDefault(); });
				lib('a[href$="#lpslt"]').on("click", function(e) { e.preventDefault(); });
				lib('#lpslt_bubble_content').to({ style: { opacity:1 }}, { duration:250, easing:"easeOutQuad" });
				lib('#lpslt_bubble_middle').css({ height:"auto" });
			}});
			lib('#lpslt_bubble_bottom').to({ style: { height:"0.9em" }}, { duration:250, easing:"easeOutQuad" });
		} else {
			lib('#lpslt_bubble_content').to({ style: { opacity:0 }}, { duration:250, easing:"easeOutQuad", oncomplete:function() {
				lib("#lpslt_searchResults").css({ top:((ltwh.top+ltwh.height)/(lpslt.fs*fsSR)-1/fsSR)+"em" });
				lib('#lpslt_bubble_middle').css({ height:lib('#lpslt_bubble_middle').targets[0].offsetHeight/(parseFloat(lib('#lpslt_bubble_middle').css("font-size", "px")[0]))+"em" });
				lib('#lpslt_bubble_content').html(''); 
				lib('#lpslt_bubble_middle').to({ style: { height:h/(lpslt.fs*fsSR)+"em" }}, { duration:250, easing:"easeOutQuad", oncomplete:function() {
					lib('#lpslt_bubble_content').appendHtml(str);
					lib('a[href$="#lpslt"]').off("click", function(e) { e.preventDefault(); });
					lib('a[href$="#lpslt"]').on("click", function(e) { e.preventDefault(); });
					lib('#lpslt_bubble_content').to({ style: { opacity:1 }}, { duration:250, easing:"easeOutQuad" });
					lib('#lpslt_bubble_middle').css({ height:"auto" });
				}}); 
			}});	
		}
	},
	searchClose:function() {
		if (lib('#lpslt_searchResults').targets[0]) {
			lib('#lpslt_searchResults').to({ style: { opacity:0, right:"-15em" }}, { duration:333, oncomplete:function() { lib('#lpslt_bubble_content').empty(); lib('#lpslt_bubble_top').css({ height:"0em" }); lib('#lpslt_bubble_bottom').css({ height:"0em" }); lib('#lpslt_searchResults').css({ display:"none" }); }} );
			lib("#lpslt_search").off("focus", lpslt.searchFocus);
			lib("#lpslt_search").off("blur", lpslt.searchBlur);
			lib("#lpslt_search").on("focus", lpslt.searchFocus);
			lib("#lpslt_search").on("blur", lpslt.searchBlur);
		}
	},
	currentMessages:[],
	error:function(str, endFunction) {
		var identifier=lib().escapeQuotes(str.replace(/[\r\n]/gm, "")+(typeof(endFunction)==="function"?endFunction.toString():""));
		if (lpslt.currentMessages.indexOf(identifier)===-1) {
			lpslt.currentMessages.push(identifier);
			lpslt.message.simple(str, "red", endFunction, identifier);
		}
	},
	notice:function(str, endFunction) {
		var identifier=lib().escapeQuotes(str+(typeof(endFunction)==="function"?endFunction.toString():""));
		if (lpslt.currentMessages.indexOf(identifier)===-1) {
			lpslt.currentMessages.push(identifier);
			lpslt.message.temporary(str, "orange", endFunction, 10000, identifier);
		}
	},
	message: {
		// le tableau disabledRemovals sert à ne pas lancer deux fois la suppression d'une boite de dialogue dans le cas où l'utilisateur a cliqué sur la croix
		disabledRemovals:[],
		endFn:[],
		timeout:[],
		// fonction de boite de dialogue, la couleur de bordure est réglable via la chaine de caractère border color, pour le reste la chaîne str est affichée ainsi qu'une croix pour la fermeture, qui si cliquée remplace la fonction de suppression auto, lancée en fin de cette fonction
		temporary:function(str, bordercolor, endFunction, time, identifier) {
			if (lib("#lpslt_csl").targets.length==0) {
				lib("body").createNode("div", { id:"lpslt_csl" }, "");
			}
			var fsCsl=parseFloat(lib("#lpslt_csl").css("font-size", "em")[0]);
			var trgts=lib("#lpslt_csl").find(".lpslt_csl").targets;
			var idSuffix=(trgts.length>0?parseInt(trgts[trgts.length-1].id.substr(trgts[trgts.length-1].id.lastIndexOf("_")+1),10)+1:0);
			if (trgts.length>0) {
				var LTWH=lib(trgts[trgts.length-1]).ltwh();
				var top=(parseFloat(lib(trgts[trgts.length-1]).attr("data-top")[0])*lpslt.fs*fsCsl+LTWH[0].height)/(lpslt.fs*fsCsl)+0.25;
			} else {
				var top=0.25;
			}
			if (lpslt.message.disabledRemovals.indexOf(idSuffix)!=-1) {
				lpslt.message.disabledRemovals.splice(lpslt.message.disabledRemovals.indexOf(idSuffix),1);
			}
			if ("_"+idSuffix in lpslt.message.timeout) {
				clearTimeout(lpslt.message.timeout["_"+idSuffix]);
				lpslt.message.timeout=lib().spliceAtKeys(lpslt.message.timeout, "_"+idSuffix, 1);
			}
			lib("#lpslt_csl").createNode("div", { id:"lpslt_csl_"+idSuffix, className:"lpslt_csl", style:"border:3px solid "+bordercolor+"; top:"+top+"em;" }, '<span class="lpslt_cslText">'+str+'</span><a href="#lpslt" class="lpslt_cross" onclick="lpslt.message.remove('+idSuffix+(typeof(identifier)==="string"?',\''+identifier+'\'':'')+');"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.5em" height="1.5em" viewBox="0 0 300 300" xml:space="preserve" style="display:block; position:absolute;"><g fill="none" stroke="#000" stroke-width="25" stroke-miterlimit="10"><rect fill="none" x="0" y="0" width="300" height="300" style="visibility:hidden;"/><circle cx="150" cy="150" r="100"/><line x1="100" y1="100" x2="200" y2="200"/><line x1="200" y1="100" x2="100" y2="200"/></g></svg></a><span class="lpslt_clearboth"></span>');
			lib("#lpslt_csl_"+idSuffix).attr('{"data-top":"'+top+'"}');
			lib("#lpslt_csl_"+idSuffix).to({ style: { opacity:1, filter:"alpha(opacity=100)" }},{ duration:250 });
			if (typeof(endFunction)!=="undefined" && endFunction!=null) {
				lpslt.message.endFn[idSuffix]=endFunction;
			} else {
				lpslt.message.endFn[idSuffix]=null;
			}
			lpslt.tweakLinks();
			if (typeof(identifier)==="undefined") {
				lpslt.message.timeout["_"+idSuffix]=setTimeout(function() { lpslt.message.remove(idSuffix); }, (typeof(time)!=="undefined"?time:10000));
			} else {
				lpslt.message.timeout["_"+idSuffix]=setTimeout(function() { lpslt.message.remove(idSuffix, identifier); }, (typeof(time)!=="undefined"?time:10000));
			}
		},
		simple:function(str, bordercolor, endFunction, identifier) {
			if (lib("#lpslt_csl").targets.length==0) {
				lib("body").createNode("div", { id:"lpslt_csl" }, "");
			}
			var fsCsl=parseFloat(lib("#lpslt_csl").css("font-size", "em")[0]);
			var trgts=lib("#lpslt_csl").find(".lpslt_csl").targets;
			var idSuffix=(trgts.length>0?parseInt(trgts[trgts.length-1].id.substr(trgts[trgts.length-1].id.lastIndexOf("_")+1),10)+1:0);
			if (trgts.length>0) {
				var LTWH=lib(trgts[trgts.length-1]).ltwh();
				var top=(parseFloat(lib(trgts[trgts.length-1]).attr("data-top")[0])*lpslt.fs*fsCsl+LTWH[0].height)/(lpslt.fs*fsCsl)+0.25;
			} else {
				var top=0.25;
			}
			if (lpslt.message.disabledRemovals.indexOf(idSuffix)!=-1) {
				lpslt.message.disabledRemovals.splice(lpslt.message.disabledRemovals.indexOf(idSuffix),1);
			}
			if ("_"+idSuffix in lpslt.message.timeout) {
				clearTimeout(lpslt.message.timeout["_"+idSuffix]);
				lpslt.message.timeout=lib().spliceAtKeys(lpslt.message.timeout, "_"+idSuffix, 1);
			}
			lib("#lpslt_csl").createNode("div", { id:"lpslt_csl_"+idSuffix, className:"lpslt_csl", style:"border:3px solid "+bordercolor+"; top:"+top+"em;" }, '<span class="lpslt_cslText">'+str+'</span><a href="#lpslt" class="lpslt_cross" onclick="lpslt.message.remove('+idSuffix+(typeof(identifier)==="string"?',\''+identifier+'\'':'')+');"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.5em" height="1.5em" viewBox="0 0 300 300" xml:space="preserve" style="display:block; position:absolute;"><g fill="none" stroke="#000" stroke-width="25" stroke-miterlimit="10"><rect fill="none" x="0" y="0" width="300" height="300" style="visibility:hidden;"/><circle cx="150" cy="150" r="100"/><line x1="100" y1="100" x2="200" y2="200"/><line x1="200" y1="100" x2="100" y2="200"/></g></svg></a><span class="lpslt_clearboth"></span>');
			lib("#lpslt_csl_"+idSuffix).attr('{"data-top":"'+top+'"}');
			lib("#lpslt_csl_"+idSuffix).to({ style: { opacity:1, filter:"alpha(opacity=100)" }},{ duration:250 });
			if (endFunction && endFunction!=null) {
				lpslt.message.endFn[idSuffix]=endFunction;
			}
			lpslt.tweakLinks();
		},
		// deux tableaux; toApprobate contient les fonctions à approuver ainsi que les arguments, askForApprobation contient un identifier relatifs à la conversion en chaîne des arguments et de la fonction pour éviter de multiples lancements si plusieurs clicks
		toApprobate:[],
		askForApprobation:[],
		waitForApprobation:function(fn, cancelFn, args, str, subfn, fromAdmin) {
			var identifier=lib().implode("", args)+fn.toString();
			if (lpslt.message.askForApprobation.indexOf(identifier)==-1) {
				lpslt.message.askForApprobation.push(identifier);
				if (lib("#lpslt_csl").targets.length==0) {
					lib("body").createNode("div", { id:"lpslt_csl" }, "");
				}
				var fsCsl=parseFloat(lib("#lpslt_csl").css("font-size", "em")[0]);
				var trgts=lib("#lpslt_csl").find(".lpslt_csl").targets;
				var idSuffix=(trgts.length>0?parseInt(trgts[trgts.length-1].id.substr(trgts[trgts.length-1].id.lastIndexOf("_")+1),10)+1:0);
				if (trgts.length>0) {
					var LTWH=lib(trgts[trgts.length-1]).ltwh();
					var top=(parseFloat(lib(trgts[trgts.length-1]).attr("data-top")[0])*lpslt.fs*fsCsl+LTWH[0].height)/(lpslt.fs*fsCsl)+0.25;
				} else {
					var top=0.25;
				}
				if (lpslt.message.disabledRemovals.indexOf(idSuffix)!=-1) {
					lpslt.message.disabledRemovals.splice(lpslt.message.disabledRemovals.indexOf(idSuffix),1);
				}
				if ("_"+idSuffix in lpslt.message.timeout) {
					clearTimeout(lpslt.message.timeout["_"+idSuffix]);
					lpslt.message.timeout=lib().spliceAtKeys(lpslt.message.timeout, "_"+idSuffix, 1);
				}
				lpslt.message.toApprobate["_"+idSuffix.toString()]=[fn, args, cancelFn];
				lib("window").on("keypress", function(event) { if (event.which==13) { lpslt.message.approbate(idSuffix); } });
				lib("#lpslt_csl").createNode("div", { id:"lpslt_csl_"+idSuffix, className:"lpslt_csl", style:"border:3px solid orange; top:"+top+"em;" }, '<span class="lpslt_cslTextDialog">'+str+'<span class="lpslt_ok_cancel"><input type="button" onclick="lpslt.message.approbate('+idSuffix+');" class="lpslt_ok" value="'+(typeof(fromAdmin)!=="undefined" && fromAdmin?locales['ok']:locales['ok'])+'"/>&nbsp;<input type="button" onclick="lpslt.message.refuse('+idSuffix+');" class="lpslt_cancel" value="'+(typeof(fromAdmin)!=="undefined" && fromAdmin?locales['cancel']:locales['cancel'])+'"/></span></span>');
				lib("#lpslt_csl_"+idSuffix).attr('{"data-top":"'+top+'"}');
				lib("#lpslt_csl_"+idSuffix).to({ style: { opacity:1, filter:"alpha(opacity=100)" }},{ duration:500, oncomplete:function() { if (typeof(subfn)==="function") { subfn(); } }, oncompleteparams:{ subfn:subfn } });
			}
		},
		// approbate, la fonction est lancée et la boite est ensuite supprimée, ainsi que les variables liées
		approbate:function(idSuffix) {
			lib("window").off("keypress", function(event) { if (event.which==13) { lpslt.message.approbate(idSuffix); } });
			lpslt.message.toApprobate["_"+idSuffix.toString()][0].apply(this, lpslt.message.toApprobate["_"+idSuffix.toString()][1]);
			var identifier=lib().implode("", lpslt.message.toApprobate["_"+idSuffix.toString()][1])+lpslt.message.toApprobate["_"+idSuffix.toString()][0].toString();
			lpslt.message.askForApprobation.splice(lpslt.message.askForApprobation.indexOf(identifier),1);
			lpslt.message.toApprobate.splice("_"+idSuffix.toString(),1);
			lpslt.message.remove(idSuffix);
		},
		// refuse, la fonction n'est pas lancée et la boite est supprimée, ainsi que les variables liées
		refuse:function(idSuffix) {
			lib("window").off("keypress", function(event) { if (event.which==13) { lpslt.message.approbate(idSuffix); } });
			typeof(lpslt.message.toApprobate["_"+idSuffix.toString()][2])==="function" && lpslt.message.toApprobate["_"+idSuffix.toString()][2]();
			var identifier=lib().implode("", lpslt.message.toApprobate["_"+idSuffix.toString()][1])+lpslt.message.toApprobate["_"+idSuffix.toString()][0].toString();
			lpslt.message.askForApprobation.splice(lpslt.message.askForApprobation.indexOf(identifier),1);
			lpslt.message.toApprobate.splice("_"+idSuffix.toString(),1);
			lpslt.message.remove(idSuffix);
		},
		// destruction de la boite de dialogue
		remove:function(idSuffix, identifier) {
			if (lpslt.message.disabledRemovals.indexOf(idSuffix)==-1 && lib("#lpslt_csl_"+idSuffix).targets.length>0) {
				if (typeof(identifier)==="string") {
					lpslt.currentMessages.splice(lpslt.currentMessages.indexOf(identifier), 1);
				}
				if ("_"+idSuffix in lpslt.message.timeout) {
					clearTimeout(lpslt.message.timeout["_"+idSuffix]);
					lpslt.message.timeout.splice("_"+idSuffix, 1);
				}
				lpslt.message.disabledRemovals.push(idSuffix);
				lib("#lpslt_csl_"+idSuffix).to({ style: { opacity:0, filter:"alpha(opacity=0)", left:"100%" }},{ duration:250, oncomplete:function(ret) {
					var idSuffix=ret.idSuffix;
					var fsCsl=parseFloat(lib("#lpslt_csl").css("font-size", "em")[0]);
					var LTWH=lib("#lpslt_csl_"+idSuffix).ltwhRelativeTo(lib("#lpslt_csl").targets[0]);
					var height=LTWH[0].height/(lpslt.fs*fsCsl);
					var trgts=lib("#lpslt_csl").find(".lpslt_csl").targets;
					var i=0;
					while (i<trgts.length) {
						var idSuffixElm=parseInt(trgts[i].id.substr(trgts[i].id.lastIndexOf("_")+1),10);
						if (idSuffixElm>idSuffix) {
							lib("#lpslt_csl_"+idSuffixElm).attr('{"data-top":"'+(parseFloat(lib("#lpslt_csl_"+idSuffixElm).attr("data-top")[0])-(height+0.25))+'"}');
							lib("#lpslt_csl_"+idSuffixElm).to({ style: { top:parseFloat(lib("#lpslt_csl_"+idSuffixElm).attr("data-top")[0])+"em", filter:"alpha(opacity=0)" }},{ duration:250 });
						}
						i++;
					}
					lib("#lpslt_csl_"+idSuffix).remove();
					if (lib(".lpslt_csl").targets.length==0) { lib("#lpslt_csl").remove(); }
					if (lpslt.message.endFn[idSuffix] && lpslt.message.endFn[idSuffix]!=null) { lpslt.message.endFn[idSuffix](); lpslt.message.endFn.splice(idSuffix, 1); }
				}, oncompleteparams:{idSuffix:idSuffix} });
			}
		}
	},
	wait:function(variable, refs, fn) {
		var ref=window;
		for (var p in refs) {
			if (refs[p]!=="" && typeof(refs[p])==="string") {
				if (refs[p] in ref) {
					ref=ref[refs[p]];
				} else {
					setTimeout(function() { lpslt.wait(variable, refs, fn); }, 100);
					return;
				}
			}
		}
		if (variable in ref) {
			fn();
		} else {
			setTimeout(function() { lpslt.wait(variable, refs, fn); }, 100);
		}
	},
	prepareConnect:function(callback) {
		lib().ajax({
			type:"POST", 
			url:"./lpslt/php/login.php",
			data: { give_me_a_public_key_and_some_salt_please:true },
			onsuccess:function(data) {
				if (data.d!=="") {
					try { var d=lib().json.parse(data.d); } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); }
					if ("publicKey" in d && "salt" in d) {
						log.salt=d.salt;
						log.publicKey=d.publicKey;
						log.prepareLoginSend(callback);
					}
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			},
			onfail:function(data) {
				lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
			}
		});
	},
	connect:function() {
		lib("#connect").to({ style: { backgroundColor:"#666" }}, { duration:500 });
		lib().temporize(function() {
			lpslt.prepareConnect(function() {
				var identifiant=lib("#identifiant").targets, password=lib("#password").targets;
				if (identifiant.length>0 && password.length>0 && identifiant[0].value.length>0 && password[0].value.length>0 && identifiant[0].value!=="identifiant" && password[0].value!=="••••••••••") {
					log.pass=password[0].value;
					log.email=identifiant[0].value;
					if (log.sendable) {
						log.loginSend();
					}
				} else {
					lpslt.error("Veuillez renseigner un identifiant et un mot de passe svp !");
				}
			});
		}, 2000);
	},
	getLocale:function() {
		lib().ajax({
			type:"GET", 
			url:"./lpslt/php/getLocale.php",
			data: null,
			onsuccess:function(data) {
				if (data.d!=="") {
					try { var d=lib().json.parse(data.d); } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); }
					if ("locale" in d) {
						lpslt.locale=d.locale;
					}
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			},
			onfail:function(data) {
				lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
			}
		});
	},
	setLocale:function(lg) {
		lib().ajax({
			type:"POST", 
			url:"./lpslt/php/setLocale.php",
			data: { lg:lg },
			onsuccess:function(data) {
				if (data.d!=="") {
					try { var d=lib().json.parse(data.d); } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); }
					if ("page" in d) {
						lpslt.locale=lg;
						lpslt.ajax(d.page, true, "replace");
						lpslt.reloadMenu();
					} else if ("error" in d) {
						lpslt.error(d.error);
					}
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			},
			onfail:function(data) {
				lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
			}
		});
	},
	checkboxStates:{},
	switchCheckBox:function(element, identifier) {
		if (parseInt(lib([element]).css("opacity")[0])===0) {
			lib([element]).css({ opacity:1 });
			lpslt.checkboxStates[identifier]=1;
		} else {
			lib([element]).css({ opacity:0 });
			lpslt.checkboxStates[identifier]=0;
		}
	},
	checkText:function(identifier, options) {
		if (lib(identifier).html()[0]===options[1]) {
			lib(identifier).html(options[0]);
			lpslt.checkboxStates[identifier.substr(1)]=0;
		} else {
			lib(identifier).html(options[1]);
			lpslt.checkboxStates[identifier.substr(1)]=1;
		}
	},
	encryptForAjax:function(obj) {
		if ("cryptoKey" in log && typeof(log.cryptoKey)==="string" && log.cryptoKey.length>=64) {
			var str=lib().json.stringify(obj);
			var iv=log.cryptoKey.substr(0,32);
			str=CryptoJS.AES.encrypt(str, CryptoJS.enc.Hex.parse(log.cryptoKey), { iv:CryptoJS.enc.Hex.parse(iv) }).toString();
			str=window.btoa(str);
			str=lib().strToHex(str);
			return str;
		} else {
			lpslt.error(locales['cryptoKeyTooShort']);
			return "";
		}
	},
	decryptAjaxResponse:function(str) {
		str=lib().hexToStr(str);
		if (str.length%4!==0) {
			str=str.substr(0, str.length-str.length%4);
		}
		var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(str) });
		var decrypted=CryptoJS.AES.decrypt(cipherParams, CryptoJS.enc.Hex.parse(log.cryptoKey), { iv:CryptoJS.enc.Hex.parse(log.cryptoKey.substr(0,32)) }).toString();
		decrypted=lib().hexToStr(decrypted);
		if (decrypted.length>0) {
			if (/^[\{\[].*[\}\]]$/.test(decrypted)) {
				var obj=lib().json.parse(decrypted);
				return obj;
			} else {
				lpslt.error(locales['notJson']);
			}
		} else {
			lpslt.error(locales['unableToDecrypt']);
			if (lpslt.retry<2) {
				lpslt.retry++;
				admin.init(function() { lpslt.message.temporary(locales['keyRegenerated'], "green", null); lpslt.retry=0; }, "reload");
			}
			return {};
		}
	},
	expandReduce:function(id) {
		if (parseFloat(lib("#"+id).css("height")[0])===0) {
			lib("#"+id).to({ style: { height:"auto" }}, { duration:200 });
		} else {
			lib("#"+id).to({ style: { height:0 }}, { duration:200 });
		}
	},
	toggleBox:function(id, suffix) {
		if (typeof(suffix)==="undefined") {
			suffix="";
		}
		if (admin.fixFloat(parseFloat(lib("#box_"+id).css("height", "em")[0]), 1)===3) {
			var height=parseFloat(lib("#box_"+id+">.box_content").css("height", "px")[0])/parseFloat(lib("#box_"+id+">.box_content").css("font-size", "px")[0]);
			lib("#box_"+id).to({ style: { height:(3+height)+"em" } }, { duration:333, oncomplete:function(r) { lib("#box_"+r.id).css({ height:"auto" }); }, oncompleteparams:{ id:id } });
			lib("#box_"+id+" button>img").attr({ src:"lpslt/media/box_arrow_down"+suffix+".png" });
		} else {
			lib("#box_"+id).to({ style: { height:3+"em" } }, { duration:333 });
			lib("#box_"+id+" button>img").attr({ src:"lpslt/media/box_arrow_right"+suffix+".png" });
		}
	},
	mediumBoxChoices:[],
	buildMediumBox:function(index, choices, defaultChoice, additionnalClass) {
		var strMediumBox='<span class="mediumbox'+(typeof(additionnalClass)==="string" && additionnalClass.length>0?" "+additionnalClass:"")+'" id="mediumbox_'+index+'"><button onclick="lpslt.toggleMediumBox(\''+index+'\'); return false;"><span class="choice">'+locales[defaultChoice]+'</span><span class="arrow"><img src="lpslt/media/arrow_right_black.png" /></span></button><span class="mediumbox_content">';
		for (var i=0; i<choices.length; i++) {
			strMediumBox+='<button data-value="'+choices[i]+'" onclick="lpslt.choiceInMediumBox(this, \''+index+'\'); return false;">'+locales[choices[i]]+'</button>';
		}
		strMediumBox+='</span></span>';
		lpslt.mediumBoxChoices["_"+index]=defaultChoice;
		return strMediumBox;
	},
	choiceInMediumBox:function(element, id) {
		lpslt.mediumBoxChoices["_"+id]=element.getAttribute("data-value");
		lib("#mediumbox_"+id).find(".choice").html(element.innerHTML);
		lib("#mediumbox_"+id).to({ style: { height:1.86+"em" } }, { duration:333 });
		lib("#mediumbox_"+id+" button img").attr({ src:"lpslt/media/arrow_down_black.png" });
	},
	toggleMediumBox:function(id) {
		if (admin.fixFloat(parseFloat(lib("#mediumbox_"+id).css("height", "em")[0]), 1)===1.9) {
			var height=parseFloat(lib("#mediumbox_"+id+">.mediumbox_content").css("height", "em")[0]);
			lib("#mediumbox_"+id).to({ style: { height:(1.86+height)+"em" } }, { duration:333 });
			lib("#mediumbox_"+id+" button img").attr({ src:"lpslt/media/arrow_down_black.png" });
		} else {
			lib("#mediumbox_"+id).to({ style: { height:1.86+"em" } }, { duration:333 });
			lib("#mediumbox_"+id+" button img").attr({ src:"lpslt/media/arrow_right_black.png" });
		}
	},
	miniBoxChoices:[],
	buildMiniBox:function(index, choices, defaultChoice, additionnalClass) {
		var strMiniBox='<span class="minibox'+(typeof(additionnalClass)==="string" && additionnalClass.length>0?" "+additionnalClass:"")+'" id="minibox_'+index+'"><button onclick="lpslt.toggleMiniBox(\''+index+'\'); return false;"><span class="choice">'+locales[defaultChoice]+'</span><span class="arrow"><img src="lpslt/media/arrow_right_black.png" /></span></button><span class="minibox_content">';
		for (var i=0; i<choices.length; i++) {
			strMiniBox+='<button data-value="'+choices[i]+'" onclick="lpslt.choiceInMiniBox(this, \''+index+'\'); return false;">'+locales[choices[i]]+'</button>';
		}
		strMiniBox+='</span></span>';
		lpslt.miniBoxChoices["_"+index]=defaultChoice;
		return strMiniBox;
	},
	choiceInMiniBox:function(element, id) {
		lpslt.miniBoxChoices["_"+id]=element.getAttribute("data-value");
		lib("#minibox_"+id).find(".choice").html(element.innerHTML);
		lib("#minibox_"+id).to({ style: { height:1.2+"em" } }, { duration:333 });
		lib("#minibox_"+id+" button img").attr({ src:"lpslt/media/arrow_right_black.png" });
	},
	toggleMiniBox:function(id) {
		if (admin.fixFloat(parseFloat(lib("#minibox_"+id).css("height", "em")[0]), 1)===1.2) {
			var height=parseFloat(lib("#minibox_"+id+">.minibox_content").css("height", "em")[0]);
			lib("#minibox_"+id).to({ style: { height:(1.2+height)+"em" } }, { duration:200, oncomplete:function(r) { lib("#minibox_"+r.id).css({ height:"auto" }); }, oncompleteparams:{ id:id } });
			lib("#minibox_"+id+" button img").attr({ src:"lpslt/media/arrow_down_black.png" });
		} else {
			lib("#minibox_"+id).to({ style: { height:1.2+"em" } }, { duration:200 });
			lib("#minibox_"+id+" button img").attr({ src:"lpslt/media/arrow_right_black.png" });
		}
	},
	overlay:function(content, callback) {
		var fs=lpslt.fs;
		var scrollBarWidth=lpslt.getScrollBarWidth();
		lib("#subwrapper").createNode('div', { id:"lpslt_overlay", style:"position:fixed; left:50%; top:50%; width:0em; height:0em; background-color:rgba(0,0,0,0.75); z-index:32767;" }, '<div id="lpslt_overlay_container" class="lpslt_resizable" style="width:calc(100% + '+scrollBarWidth+'px);"><div id="lpslt_overlay_content" class="lpslt_content"></div><a href="#lpslt" onclick="lpslt.overlayClose();" style="position:absolute; display:block; width:3em; height:3em; right:2em; top:1em; opacity:1; z-index:100000;"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="3em" height="3em" viewBox="0 0 250 250" xml:space="preserve" style="display:block; position:absolute;"><defs><filter id="f" x="0" y="0"><feOffset result="offOut" in="SourceAlpha" dx="3" dy="3" /><feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" /><feBlend in="SourceGraphic" in2="blurOut" mode="normal" /></filter></defs><g fill="none" stroke="#fff" stroke-width="10" stroke-miterlimit="10" filter="url(#f)"><rect fill="none" x="0" y="0" width="250" height="250" style="visibility:hidden;"/><circle cx="125" cy="125" r="100"/><line x1="65.714" y1="65.714" x2="184.285" y2="184.285"/><line x1="184.285" y1="65.714" x2="65.714" y2="184.285"/></g></svg></a>');
		lib("#lpslt_overlay").to({ style: { width:"100%", height:"100%", left:"0%", top:"0%" } }, { duration:250, oncomplete:function(ret) { lpslt.overlayPutContent(ret.string, ret.callback); }, oncompleteparams:{ string:content, callback:callback } });
		lib("window").on("resize", function() { lpslt.overlayScrollTweaks(null, false); });
	},
	overlayPutContent:function(string, callback) {
		lib("#lpslt_overlay #lpslt_overlay_content").html(string);
		lib("#lpslt_overlay #lpslt_overlay_content").css({ display:"block", visibility:"visible" });
		lib("#lpslt_overlay #lpslt_overlay_content").to({ style: { opacity:1 }}, { duration:250 });
		if (typeof(callback)==="function") {
			callback();
		}
		lpslt.elementFixForScrollBars(false, lib("#lpslt_overlay").targets[0]);
	},
	overlayClose:function() {
		lib("window").off("resize", function() { lpslt.overlayScrollTweaks(null, false); });
		lib("#lpslt_overlay #lpslt_overlay_container").to({ style: { opacity:0 }}, { duration:250, oncomplete:function() { lib("#lpslt_overlay").to({ style: { left:(window.innerWidth/lpslt.fs)*0.5+"em", top:(window.innerHeight/lpslt.fs)*0.5+"em", width:"0em", height:"0em" }}, { duration:250, oncomplete:function() { lib("#lpslt_overlay").remove(); } }); } });
	},
	scrollValue:0,
	overlayScrollTweaks:function(e, now) {
		if (typeof(e)!=="undefined" && e!==null) {
			if (e.type==="touchmove") {
				if (e.touches.length===1) {
					lpslt.scrollValue+=lpslt.touchClientY-e.touches[0].clientY;
					lpslt.touchClientY=e.touches[0].clientY;
				}
			} else if (e.type==="wheel" && "deltaY" in e && !isNaN(e.deltaY) && e.deltaY!==0) {
				lpslt.scrollValue+=e.deltaY;
			}
		}
		if (lib("#lpslt_overlay_content").targets.length>0) {
			if (lpslt.scrollValue<0) {
				lpslt.scrollValue=0;
			} else if (lpslt.scrollValue>Math.max(lib("#lpslt_overlay_content").targets[0].offsetHeight-window.innerHeight,0)) {
				lpslt.scrollValue=Math.max(lib("#lpslt_overlay_content").targets[0].offsetHeight-window.innerHeight,0);
			}
			if (lib("#lpslt_overlay_content").targets[0].offsetHeight>window.innerHeight) {
				if (typeof(now)==="undefined" || !now) {
					lib("#lpslt_overlay_content").to({ style: { top: { value:-lpslt.scrollValue+"px", treatment:function(v) { return Math.round(v); } } } }, { duration:333 });
				} else {
					lib("#lpslt_overlay_content").css({ top:-lpslt.scrollValue+"px" });
				}
			} else {
				lib("#lpslt_overlay_content").to({ style: { top: { value:"0px", treatment:function(v) { return Math.round(v); } } } }, { duration:333 });
			}
		}
	},
	reloadInterval:-1,
	onUnloadFunctions:[],
	getIndexInLocales:function(s) {
		var p;
		for (p in locales) {
			if (locales[p]===s) {
				return p;
			}
		}
		return '';
	},
	getLocales:function(data, callback) {
		lib().ajax({ 
			type:"POST",
			url:"./lpslt/php/getLocales.php", 
			data:{ locale:data.language },
			onsuccess:function(data) {
				try { var d=lib().json.parse(data.d); } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); }
				if ("locales" in d) {
					locales=d.locales;
					lpslt.locale=locale;
					if ("data" in data && "callback" in data && typeof(data.callback)==="function") {
						data.callback(data.data);
					}
				}
			},
			onfail:function(data) {
				lpslt.message.simple(locales['localesMissing']+locales['contactAdministrator'], "red", null);
			},
			addparams:{ callback:callback, data:data }
		}); 
	}
};
var log={
	salt:false,
	token:false,
	pass:null,
	cryptoKey:null,
	uploadToken:null,
	numberOfFilesLoaded:0,
	sendable:false,
	callback:null,
	prepareLoginSend:function(callback) {
		lib().preventMultipleThrowsDuringPeriod(
			function() {
				log.callback=callback;
				if (/msie ?9/i.test(navigator.userAgent)) log.fixIE9();
				if (lib("script[src='lpslt/js/jsencrypt.js']").targets.length==0 && lib("script[src='lpslt/js/sha256.min.js']").targets.length==0) {
					log.numberOfLoadedFiles=0;
					lib("body").createNode("script", { type:"text/javascript", className:"admin_script", src:"lpslt/js/jsencrypt.js", onload:"log.setSendable(2);" }, "");
					lib("body").createNode("script", { type:"text/javascript", className:"admin_script", src:"lpslt/js/sha256.min.js", onload:"log.setSendable(2);" }, "");
				} else {
					log.setSendable();
				}
			},
			500
		);
	},
	setSendable:function(numberOfFilesToLoad) {
		if (typeof(numberOfFilesToLoad)!=="undefined") {
			log.numberOfLoadedFiles++;
		} else {
			numberOfFilesToLoad=log.numberOfLoadedFiles;
		}
		if (log.numberOfLoadedFiles===numberOfFilesToLoad) {
			log.sendable=true;
			if (typeof(log.callback)==="function") {
				log.callback();
			}
		}
	},
	checkEnterAndValid:function(e) {
		var key=("which" in e && typeof(e.which)!=="undefined")?e.which:e.key;
		if (key==13) {
			lpslt.connect();
		}
	},
	loginSend:function(numberOfFilesToLoad) {
		lpslt.wait("sha256", [""], function() {
			lpslt.wait("JSEncrypt", [""], function() {
				var JSE=new JSEncrypt();
				JSE.setPublicKey(log.publicKey);
				var encryptedPass=JSE.encrypt(log.pass);
				var encryptedMail=JSE.encrypt(log.email);
				JSE = new JSEncrypt({ default_key_size:1024 });
				JSE.getKey();
				log.privateKey=JSE.getPrivateKey();
				log.publicKey=JSE.getPublicKey();
				lib().ajax({ type:"POST", url:"./lpslt/php/login.php", data : { encryptedPass:encryptedPass, encryptedMail:encryptedMail, publicKey:log.publicKey }, onsuccess:function(data) { log.loginResponse(data); }, onfail:function(data) { lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null); } });
			});
		});
	},
	loginResponse:function(data) {
		var res, status;
		lib("#connect").to({ style: { backgroundColor:"#000" }}, { duration:500 });
		try { var d=lib().json.parse(data.d); res=true; } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); res=false; }
		if (res && "message" in d) {
			data=d.message;
			var fn=function(d) {
				var o={
					error:[locales['mysqlError'], locales['passwordDbError'], locales['openssl_certError'], locales['loginSucceeded']+locales['cryptoKeyCouldNotBeGenerated']],
					fail:[locales['incorrectPassword'], locales['seemsToBeBot'], locales['tooMuchAttempts']],
					ok:[locales['loginSucceeded']]
				};
				for (var p in o) {
					for (var i=0; i<o[p].length; i++) {
						if (data.indexOf(o[p][i])!==-1) {
							status=p;
						}
					}
				}
				if (status==="error") {
					lpslt.message.simple(data+locales['contactAdministrator'], "red", null);
				} else if (status==="fail") {
					lpslt.message.simple(data, "red", function() { });
				} else if (status==="ok") {
					log.logged=true;
					if ("encrypted" in d && d.encrypted.length>0) {
						lpslt.wait("JSEncrypt", [""], function() {
							var JSE = new JSEncrypt({ default_key_size:1024 });
							JSE.setPrivateKey(log.privateKey);
							log.cryptoKey=JSE.decrypt(window.btoa(lib().hexToStr(d.encrypted)));
							log.uploadToken=JSE.decrypt(window.btoa(lib().hexToStr(d.encryptedToken)));
							if (log.cryptoKey.length>=64) {
								log.pass=null;
								log.privateKey=null;
								log.publicKey=null;
								lpslt.message.temporary(data, "green", null);
								lpslt.ajax(lpslt.locale==="fr"?"accueil":"home", true);
								//admin.getTokenAndLaunchMonitoring();
								lpslt.reloadMenu();
							} else {
								lpslt.message.temporary(data+adminLocales['butCryptoKeyIsNotAsLongAsExpected'], "red", null);
							}
						});
					} else {
						lpslt.message.temporary(data+locales['butCryptoKeyIsEmpty'], "red", null);
					}
				} else {
					lpslt.message.simple(locales["errorHasOccured"]+"<b>"+locales["emptyResponseOrUnknowError"]+"</b>", "red", null);
				}
			};
			if ("language" in d && d.language!==locale) {
				lpslt.getLocales(d, function(d) {
					fn(d);
				});
			} else if ("language" in d && d.language===locale) {
				fn(d);
			} else {
				lpslt.message.simple(locales["errorHasOccured"]+"<b>"+locales["missingParameter"]+"</b>", "red", null);
			}
		}
	},
	logout:function(boolRelog, callback) {
		if (typeof(boolRelog)==="undefined") {
			boolRelog=false;
		}
		if (typeof(callback)==="undefined") {
			callback=function() { return false; };
		}
		if (log.logged) {
			lib().preventMultipleThrowsDuringPeriod(
				(function (boolRelog, callback) { 
					return function() {
						var str=locales['confirmLogout'];
						lpslt.message.waitForApprobation(function() { 
							lib().ajax({ 
								type:"POST",
								url:"./lpslt/php/login.php", 
								data:{ disconnect:true },
								onsuccess:function(data) { 
									try { var d=lib().json.parse(data.d); } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); }
									var path=lib().address.pathName().replace(/[^\/]+$/, ""); 
									log.logoutResponse(d.message, data.boolRelog, data.callback);
									log.logged=false;
								},
								onfail:function(data) {
									lpslt.message.simple(data.d+locales['contactAdministrator'], "red", null);
								},
								addparams:{ boolRelog:boolRelog, callback:callback }
							}); 
						}, function() { lpslt.history.replaceState({ addr:lpslt.currentPage }, lpslt.currentTitle, lpslt.currentPage); }, [], str);
					}
				})(boolRelog, callback),
				1000
			);
		}
	},
	askForRelog:function() {
		setTimeout(function() { window.location=window.location.href.replace(/[a-z0-9-]+$/, "index"); }, 3000); 
	},
	logoutResponse:function(data, boolRelog, callback) {
		if (data==locales['loggedOut']) {
			lpslt.message.temporary(data, "green", null);
			var path=lib().address.pathName().replace(/[^\/]+$/, "");
			log.logged=false;
			if (lpslt.reloadInterval>-1) {
				clearInterval(lpslt.reloadInterval);
				lpslt.reloadInterval=-1;
			}
			lpslt.ajax("index", true);
			lpslt.reloadMenu();
		} else {
			lpslt.message.temporary(data, "red", null);
		}
	},
	clearFunctionsInObject:function(obj) {
		for (var p in obj) {
			if (typeof(obj[p])==="function") {
				obj[p]=function() { return false; };
			} else if (typeof(obj[p])==="object") {
				log.clearFunctionsInObject(obj[p]);
			}
		}
	},
	logged:false,
	fixIE9:function() {
		//for IE 9 Only
		(function() {
			try {
				var a = new Uint8Array(1);
				return; //no need
			} catch(e) { }

			function subarray(start, end) {
				return this.slice(start, end);
			}

			function set_(array, offset) {
				if (arguments.length < 2) offset = 0;
				for (var i = 0, n = array.length; i < n; ++i, ++offset)
					this[offset] = array[i] & 0xFF;
			}

			// we need typed arrays
			function TypedArray(arg1) {
				var result;
				if (typeof arg1 === "number") {
					result = new Array(arg1);
					for (var i = 0; i < arg1; ++i)
						result[i] = 0;
				} else
				result = arg1.slice(0);
				result.subarray = subarray;
				result.buffer = result;
				result.byteLength = result.length;
				result.set = set_;
				if (typeof arg1 === "object" && arg1.buffer)
					result.buffer = arg1.buffer;
				return result;
			}

			window.Uint8Array = TypedArray;
			window.Uint32Array = TypedArray;
			window.Int32Array = TypedArray;
		})();
		if (!("btoa" in window) && !("atob" in window)) {
			"use strict";
			/*\
			|*|
			|*|  utilitaires de manipulations de chaînes base 64 / binaires / UTF-8
			|*|
			|*|  https://developer.mozilla.org/fr/docs/Décoder_encoder_en_base64
			|*|
			\*/

			/* Décoder un tableau d'octets depuis une chaîne en base64 */

			function b64ToUint6 (nChr) {
				return nChr > 64 && nChr < 91 ?
				nChr - 65
				: nChr > 96 && nChr < 123 ?
				nChr - 71
				: nChr > 47 && nChr < 58 ?
				nChr + 4
				: nChr === 43 ?
				62
				: nChr === 47 ?
				63
				:
				0;
			}
			function base64DecToArr (sBase64, nBlocksSize) {
				var
				sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length,
				nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);
				for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
					nMod4 = nInIdx & 3;
					nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
					if (nMod4 === 3 || nInLen - nInIdx === 1) {
						for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
							taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
						}
						nUint24 = 0;
					}
				}
				return taBytes;
			}
			/* encodage d'un tableau en une chaîne en base64 */
			function uint6ToB64 (nUint6) {
				return nUint6 < 26 ?
				nUint6 + 65
				: nUint6 < 52 ?
				nUint6 + 71
				: nUint6 < 62 ?
				nUint6 - 4
				: nUint6 === 62 ?
				43
				: nUint6 === 63 ?
				47
				:
				65;
			}
			function base64EncArr(aBytes) {
				var nMod3 = 2, sB64Enc = "";
				for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
					nMod3 = nIdx % 3;
					if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
					nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
					if (nMod3 === 2 || aBytes.length - nIdx === 1) {
						sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
						nUint24 = 0;
					}
				}
				return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
			}
			/* Tableau UTF-8 en DOMString et vice versa */
			function UTF8ArrToStr(aBytes) {
				var sView = "";
				for (var nPart, nLen = aBytes.length, nIdx = 0; nIdx < nLen; nIdx++) {
					nPart = aBytes[nIdx];
					sView += String.fromCharCode(
						nPart > 251 && nPart < 254 && nIdx + 5 < nLen ? /* six bytes */
						/* (nPart - 252 << 32) n'est pas possible pour ECMAScript donc, on utilise un contournement... : */
						(nPart - 252) * 1073741824 + (aBytes[++nIdx] - 128 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 247 && nPart < 252 && nIdx + 4 < nLen ? /* five bytes */
						(nPart - 248 << 24) + (aBytes[++nIdx] - 128 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 239 && nPart < 248 && nIdx + 3 < nLen ? /* four bytes */
						(nPart - 240 << 18) + (aBytes[++nIdx] - 128 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 223 && nPart < 240 && nIdx + 2 < nLen ? /* three bytes */
						(nPart - 224 << 12) + (aBytes[++nIdx] - 128 << 6) + aBytes[++nIdx] - 128
						: nPart > 191 && nPart < 224 && nIdx + 1 < nLen ? /* two bytes */
						(nPart - 192 << 6) + aBytes[++nIdx] - 128
						: /* nPart < 127 ? */ /* one byte */
						nPart
					);
				}

				return sView;
			}
			function strToUTF8Arr(sDOMStr) {
				var aBytes, nChr, nStrLen = sDOMStr.length, nArrLen = 0;
				/* mapping... */
				for (var nMapIdx = 0; nMapIdx < nStrLen; nMapIdx++) {
					nChr = sDOMStr.charCodeAt(nMapIdx);
					nArrLen += nChr < 0x80 ? 1 : nChr < 0x800 ? 2 : nChr < 0x10000 ? 3 : nChr < 0x200000 ? 4 : nChr < 0x4000000 ? 5 : 6;
				}
				aBytes = new Uint8Array(nArrLen);
				/* transcription... */
				for (var nIdx = 0, nChrIdx = 0; nIdx < nArrLen; nChrIdx++) {
					nChr = sDOMStr.charCodeAt(nChrIdx);
					if (nChr < 128) {
						  /* one byte */
						  aBytes[nIdx++] = nChr;
					} else if (nChr < 0x800) {
						  /* two bytes */
						  aBytes[nIdx++] = 192 + (nChr >>> 6);
						  aBytes[nIdx++] = 128 + (nChr & 63);
					} else if (nChr < 0x10000) {
						  /* three bytes */
						  aBytes[nIdx++] = 224 + (nChr >>> 12);
						  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
						  aBytes[nIdx++] = 128 + (nChr & 63);
					} else if (nChr < 0x200000) {
						  /* four bytes */
						  aBytes[nIdx++] = 240 + (nChr >>> 18);
						  aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
						  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
						  aBytes[nIdx++] = 128 + (nChr & 63);
					} else if (nChr < 0x4000000) {
						  /* five bytes */
						  aBytes[nIdx++] = 248 + (nChr >>> 24);
						  aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
						  aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
						  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
						  aBytes[nIdx++] = 128 + (nChr & 63);
					} else /* if (nChr <= 0x7fffffff) */ {
						  /* six bytes */
						  aBytes[nIdx++] = 252 + /* (nChr >>> 32) is not possible in ECMAScript! So...: */ (nChr / 1073741824);
						  aBytes[nIdx++] = 128 + (nChr >>> 24 & 63);
						  aBytes[nIdx++] = 128 + (nChr >>> 18 & 63);
						  aBytes[nIdx++] = 128 + (nChr >>> 12 & 63);
						  aBytes[nIdx++] = 128 + (nChr >>> 6 & 63);
						  aBytes[nIdx++] = 128 + (nChr & 63);
					}
				}
				return aBytes;
			}
			window.atob=function(str) {
				var UTF8 = base64DecToArr(str);
				return UTF8ArrToStr(UTF8);
			};
			window.btoa=function(str) {
				var UTF8 = strToUTF8Arr(str);
				return base64EncArr(UTF8);
			};
		}
	}
};
var admin={
	init:function(callback, flag) {
		if (typeof(flag)==="string" && flag==="reload") {
			fn=function(f) {
				lpslt.wait("JSEncrypt", [""], function() {
					var JSE = new JSEncrypt({ default_key_size:1024 });
					JSE.getKey();
					log.privateKey=JSE.getPrivateKey();
					log.publicKey=JSE.getPublicKey();
					lib().ajax({ type:"POST", url:"./lpslt/php/getCryptoKey.php", data:{ publicKey:log.publicKey }, onsuccess:function(data) {
						var res;
						try { var d=lib().json.parse(data.d); res=true; } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); res=false; }
						res && (function(data) {
							if (d.message==="ok") {
								if (lpslt.reloadInterval>-1) {
									clearInterval(lpslt.reloadInterval);
									lpslt.reloadInterval=-1;
								}
								var JSE = new JSEncrypt({ default_key_size:1024 });
								JSE.setPrivateKey(log.privateKey);
								log.cryptoKey=JSE.decrypt(window.btoa(lib().hexToStr(d.encrypted)));
								log.uploadToken=JSE.decrypt(window.btoa(lib().hexToStr(d.encryptedToken)));
								if (!log.logged) {
									log.logged=true;
								}
								lpslt.waitUntilAdminInitiated=false;
								data.f();
							} else {
								if (d.message===locales["authNeeded"]) {
									lpslt.error(d.message);
									log.askForRelog();
								} else {
									if (lpslt.reloadInterval===-1) {
										lpslt.reloadInterval=setInterval(function() { admin.init(function() { lpslt.ajax(addr, true); }, "reload"); }, 3000);
									}
									lpslt.error(d.message);
								}
							}
						})(data);
					}, onfail:function (data) { data.d=data.d.replace(" ", ""); data.d=data.d.substr(0,1).toLowerCase()+data.d.substr(1); lpslt.error(locales["errorHasOccured"]+((data.d in locales)?locales[data.d]:locales["unknownError"])); setTimeout(function() { window.location=window.location.href.replace(/[^\/]+$/, ""); }, 3000); }, addparams:{ f:f } });	
				});
			};
		} else {
			fn=function(f) {
				f();
			};
		}
		fn(callback);
	},
	regenerateCronToken:function() {
		lib().ajax({ type:"GET", url:"./lpslt/php/genToken.php", data:null,
			onsuccess:function(data) {
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					var id, index;
					if (__.isObject(decrypted)) {
						if ("message" in decrypted && decrypted.message==="ok" && "token" in decrypted) {
							lpslt.message.temporary(locales['tokenUpdateSucceeded'], "green", null);
							lib(".token").html(decrypted.token);
						} else if ("message" in decrypted[p] && decrypted.message==="ko") {
							lpslt.error(decrypted.error);
						}
					} else {
						lpslt.error(locales["parsingError"]+locales["notObject"]);
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			}, onfail:function(data) { 
				lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
			}
		});
	},
	userLocale:{},
	setUserLocale:function(lg, dbid) {
		lib("#user_locale_"+dbid+"_"+admin.userLocale["_"+dbid]).css({ border:"4px solid transparent", marginTop:"-4px" });
		lib("#user_locale_"+dbid+"_"+lg).css({ border:"4px solid white", marginTop:"-4px" });
		admin.userLocale["_"+dbid]=lg;
	},
	deleteUser:function(id) {
		encrypted=lpslt.encryptForAjax({ id:id });
		lpslt.message.waitForApprobation(function() {
			lib().ajax({ 
				url:"lpslt/php/delete-user.php", 
				type:"POST", 
				data:{ encrypted:encrypted }, 
				onsuccess:function(data) {
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						if (__.isObject(decrypted)) {
							if ("message" in decrypted && decrypted.message==="ok") {
								lpslt.message.temporary(locales['mysqlDeleteSucceeded'], "green", null);
								lpslt.ajax(lpslt.currentPage, true, "replace");
							} else if ("message" in decrypted && decrypted.message==="ko" && "error" in decrypted) {
								lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted.error);
							} else if ("message" in decrypted && decrypted.message==="ko") {
								lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
							} else if ("error" in decrypted) {
								lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
							}
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				}, 
				onfail:function(data) { 
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				}
			 });
		}, null, [], locales["areYouSureYouWantToDeleteThisUser"]);
	},
	deleteImap:function(id) {
		encrypted=lpslt.encryptForAjax({ id:id });
		lpslt.message.waitForApprobation(function() {
			lib().ajax({ 
				url:"lpslt/php/delete-imap.php", 
				type:"POST", 
				data:{ encrypted:encrypted }, 
				onsuccess:function(data) {
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						if (__.isObject(decrypted)) {
							if ("message" in decrypted && decrypted.message==="ok") {
								lpslt.message.temporary(locales['mysqlDeleteSucceeded'], "green", null);
								lpslt.ajax(lpslt.currentPage, true, "replace");
							} else if ("message" in decrypted && decrypted.message==="ko" && "error" in decrypted) {
								lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted.error);
							} else if ("message" in decrypted && decrypted.message==="ko") {
								lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
							} else if ("error" in decrypted) {
								lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
							}
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				}, 
				onfail:function(data) { 
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				}
			 });
		}, null, [], locales["areYouSureYouWantToDeleteThisImapConnection"]);
	},
	checkImaps:function() {
		if (imap_data.length>0) {
			var imap_data_obj=lib().json.parse(lib().stripSlashes(imap_data));
			if (imap_data_obj.id.length>0) {
				var encrypted=lpslt.encryptForAjax(imap_data_obj);
				lib().ajax({ 
					url:"lpslt/php/check-imaps.php", 
					type:"POST", 
					data:{ encrypted:encrypted }, 
					onsuccess:function(data) {
						if (data.d!=="" && data.d!=="noAuth") {
							var decrypted=lpslt.decryptAjaxResponse(data.d);
							var id, index;
							if (__.isObject(decrypted)) {
								for (var p in decrypted) {
									if (p.substr(0,5)==="check") {
										if ("result" in decrypted[p] && /^Array\s\(/.test(decrypted[p].result)) {
											id=p.substr(p.lastIndexOf("_")+1);
											lib("#imap_account_status_"+id).to({ style: { backgroundColor:"green" }}, { duration:333 });
										} else if ("error" in decrypted[p]) {
											id=p.substr(p.lastIndexOf("_")+1);
											index=imap_data_obj.id.indexOf(id);
											if (/No such host as .* in /.test(decrypted[p].error)) {
												lpslt.error(locales["imapError"]+locales["noSuchHost"]+imap_data_obj.server[index]);
											} else if (/TLS\/SSL failure for .*: .* in /.test(decrypted[p].error)) {
												lpslt.error(locales["imapError"]+locales["ssltlsFailure"]+imap_data_obj.server[index]);
											} else if (/Certificate failure/.test(decrypted[p].error)) {
												lpslt.error(locales["imapError"]+locales["certificateFailure"]+imap_data_obj.server[index]);
											} else if (/SSL negotiation failed/.test(decrypted[p].error)) {
												lpslt.error(locales["imapError"]+locales["sslNegotiationFailed"]+imap_data_obj.server[index]);
											} else if (/\[AUTHENTICATIONFAILED\]/.test(decrypted[p].error) || /password wrong or not a valid user/.test(decrypted[p].error)) {
												lpslt.error(locales["imapError"]+locales["authFailed"]+imap_data_obj.identifier[index]+" @ "+imap_data_obj.server[index]);
											} else if (/Connection failed to .*,[0-9]+: Connection refused in /.test(decrypted[p].error)) {
												lpslt.error(locales["imapError"]+locales["connectionFailed"]+imap_data_obj.identifier[index]+" @ "+imap_data_obj.server[index]);
											} else {
												lpslt.error(locales["imapError"]+locales["unknownImapError"]+imap_data_obj.identifier[index]+" @ "+imap_data_obj.server[index]+locales["detail"]+decrypted[p].error);
											}
											lib("#imap_account_status_"+id).to({ style: { backgroundColor:"red" }}, { duration:333 });
										}
									} else if (p==="error") {
										lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
									} 
								}
							} else {
								lpslt.error(locales["parsingError"]+locales["notObject"]);
							}
						} else if (data.d==="") {
							lpslt.error(locales["parsingError"]+locales["emptyString"]);
						} else if (data.d==="noAuth") {
							lpslt.error(locales["authNeeded"]);
							log.askForRelog();
						}
					}, 
					onfail:function(data) { 
						lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
					}
				 });
			}
		}
	},
	applyUserChanges:function() {
		var value,
			users=lib(".user_account").targets,
		    index,
		    user_data_obj=user_data.length>0?lib().json.parse(lib().stripSlashes(user_data)):{ id:[], admin_user_id:[], lastname:[], firstname:[], pass:[], email:[], prefered_locale:[], status:[], level:[] };
		    current_user_data_obj={ id:[], admin_user_id:[], lastname:[], firstname:[], pass:[], email:[], prefered_locale:[], status:[], level:[], is_new:[] },
		    i,
		    newToBeDeleted=!1;
		for (var i=0; i<users.length; i++) {
			if (/\bset\b/.test(users[i].className)) {
				index=user_data_obj.id.indexOf(parseInt(users[i].getAttribute("data-dbid"), 10));
				current_user_data_obj.id[index]=users[i].getAttribute("data-dbid");
				current_user_data_obj.is_new[index]=0;
				for (var p in current_user_data_obj) {
					if (["firstname","lastname","pass","email"].indexOf(p)!==-1) {
						current_user_data_obj[p][index]=users[i].querySelector("."+(p==="pass"?"password":p)).value;
						if (users[i].querySelector("."+(p==="pass"?"password":p)).value==="") {
							lpslt.message.temporary(locales["emptyString"].substr(0,1).toLocaleUpperCase()+locales["emptyString"].substr(1)+" : "+locales[p], "orange", null);
							return false;
						} else if (users[i].querySelector("."+(p==="pass"?"password":p)).value==="••••••••••") {
							lpslt.message.temporary(locales["passwordWillNotBeChanged"], "orange", null);
						}
					} else if (p==="status") {
						if (users[i].querySelector("."+p+"_"+users[i].getAttribute("data-id")+" .choice")!==null) {
							current_user_data_obj[p][index]=lpslt.mediumBoxChoices["_"+users[i].getAttribute("data-id")];
							current_user_data_obj.level[index]=current_user_data_obj[p][index]==="admin"?1:0;
							if (current_user_data_obj[p][index]!==user_data_obj[p][index]) {
								user_data_obj[p][index]=current_user_data_obj[p][index];
								user_data=lib().json.stringify(user_data_obj);
							}
						} else {
							current_user_data_obj[p][index]="superadmin";
							current_user_data_obj.level[index]=2;
						}
					} else if (p==="prefered_locale") {
						current_user_data_obj[p][index]=admin.userLocale["_"+users[i].getAttribute("data-dbid")];
					}
				}
			} else if (/\bnew\b/.test(users[i].className)) {
				index=current_user_data_obj.id.length;
				current_user_data_obj.id[index]="new";
				current_user_data_obj.is_new[index]=1;
				for (var p in current_user_data_obj) {
					if (["firstname","lastname","pass","email"].indexOf(p)!==-1) {
						current_user_data_obj[p][index]=users[i].querySelector("."+(p==="pass"?"password":p)).value;
						if (users[i].querySelector("."+(p==="pass"?"password":p)).value==="" && !newToBeDeleted) {
							lpslt.message.temporary(locales["emptyString"].substr(0,1).toLocaleUpperCase()+locales["emptyString"].substr(1)+" : "+locales["ignoringNewEntry"], "orange", null);
							newToBeDeleted=!0;
						}
					} else if (p==="status") {
						if (users[i].querySelector("."+p+"_"+users[i].getAttribute("data-id")+" .choice")!==null) {
							current_user_data_obj[p][index]=lpslt.mediumBoxChoices["_new"];
							current_user_data_obj.level[index]=current_user_data_obj[p][index]==="admin"?1:0;
						}
					} else if (p==="prefered_locale") {
						current_user_data_obj[p][index]=admin.userLocale["_new"];
					}
				}
			}
		}
		if (newToBeDeleted) {
			for (var p in current_user_data_obj) {
				current_user_data_obj[p].splice(current_user_data_obj[p].length-1,1);
			}
		}
		if (current_user_data_obj.id.length>0) {
			var encrypted=lpslt.encryptForAjax(current_user_data_obj);
			lib().ajax({ 
				url:"lpslt/php/insert-update-users.php", 
				type:"POST", 
				data:{ encrypted:encrypted }, 
				onsuccess:function(data) {
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						var upd=0, ins, id, index;
						if (__.isObject(decrypted)) {
							for (var p in decrypted) {
								if (p.substr(0,6)==="update") {
									if ("message" in decrypted[p] && decrypted[p].message==="ok") {
										upd++;
									} else if ("error" in decrypted[p]) {
										lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted[p].error);
									} else {
										lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
									}
								} else if (p.substr(0,6)==="insert") {
									if ("message" in decrypted[p] && decrypted[p].message==="ok") {
										ins=true;
									} else if ("error" in decrypted[p]) {
										lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted[p].error);
									} else {
										lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
									}
								} else if (p.substr(0, 5)==="error") {
									lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
								} 
							}
							if (ins) {
								lpslt.message.temporary(locales['mysqlInsertSucceeded'], "green", null);
							}
							if (upd>0) {
								lpslt.message.temporary(upd+" "+locales['mysqlUpdatesSucceeded'], "green", null);
							}
							if (ins) {
								lpslt.ajax(lpslt.currentPage, true, "replace");
							}
						} else {
							lpslt.error(locales["parsingError"]+locales["notObject"]);
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				}, 
				onfail:function(data) { 
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				}
			 });
		}
	},
	applyImapChanges:function() {
		var imaps=lib(".imap_account").targets,
		    index,
		    imap_data_obj=imap_data.length>0?lib().json.parse(lib().stripSlashes(imap_data)):{ id:[], identifier:[], password:[], server:[], port:[], ssl_cert:[], check_cert:[], active:[] };
		    current_imap_data_obj={ id:[], imap_identifier:[], imap_password:[], server:[], port:[], ssl_cert:[], check_cert:[], active:[], is_new:[], to_be_tested:[] },
		    i,
		    newToBeDeleted=!1;
		for (var i=0; i<imaps.length; i++) {
			if (/\bset\b/.test(imaps[i].className)) {
				index=imap_data_obj.id.indexOf(parseInt(imaps[i].getAttribute("data-id"), 10));
				current_imap_data_obj.to_be_tested[index]=0;
				current_imap_data_obj.id[index]=imaps[i].getAttribute("data-id");
				for (var p in current_imap_data_obj) {
					if (["imap_identifier","imap_password","server","port"].indexOf(p)!==-1) {
						current_imap_data_obj[p][index]=imaps[i].querySelector("."+p).value;
						if (current_imap_data_obj[p][index]!==imap_data_obj[p.replace(/imap_/, "")][index]) {
							imap_data_obj[p.replace(/imap_/, "")][index]=current_imap_data_obj[p][index];
							imap_data=lib().json.stringify(imap_data_obj);
							current_imap_data_obj.to_be_tested[index]=1;
						}
						if (imaps[i].querySelector("."+p).value==="") {
							lpslt.message.temporary(locales["emptyString"].substr(0,1).toLocaleUpperCase()+locales["emptyString"].substr(1)+" : "+locales[p], "orange", null);
							return false;
						}
					} else if (["id","is_new","to_be_tested"].indexOf(p)===-1) {
						current_imap_data_obj[p][index]=lpslt.checkboxStates[p+"_"+imaps[i].getAttribute("data-id")];
						if (["ssl_cert","check_cert"].indexOf(p)!==-1 && parseInt(current_imap_data_obj[p][index],10)!==parseInt(imap_data_obj[p.replace(/imap_/, "")][index],10)) {
							imap_data_obj[p.replace(/imap_/, "")][index]=current_imap_data_obj[p][index];
							imap_data=lib().json.stringify(imap_data_obj);
							current_imap_data_obj.to_be_tested[index]=1;
						}
					} else if (["id","to_be_tested"].indexOf(p)===-1) {
						current_imap_data_obj[p][index]=0;
					}
				}
			} else if (/\bnew\b/.test(imaps[i].className)) {
				current_imap_data_obj.id[current_imap_data_obj.id.length]="new";
				for (var p in current_imap_data_obj) {
					if (["imap_identifier","imap_password","server","port"].indexOf(p)!==-1 && !newToBeDeleted) {
						if (imaps[i].querySelector("."+p).value==="") {
							lpslt.message.temporary(locales["emptyString"].substr(0,1).toLocaleUpperCase()+locales["emptyString"].substr(1)+" : "+locales["ignoringNewEntry"], "orange", null);
							newToBeDeleted=!0;
						}
						current_imap_data_obj[p][current_imap_data_obj[p].length]=imaps[i].querySelector("."+p).value;
					} else if (["active","is_new","to_be_tested"].indexOf(p)!==-1) {
						current_imap_data_obj[p][current_imap_data_obj[p].length]=1;
					} else if (p!=="id") {
						current_imap_data_obj[p][current_imap_data_obj[p].length]=lpslt.checkboxStates[p+"_new"];
					}
				}
			}
		}
		if (newToBeDeleted) {
			for (var p in current_imap_data_obj) {
				current_imap_data_obj[p].splice(current_imap_data_obj[p].length-1,1);
			}
		}
		if (current_imap_data_obj.id.length>0) {
			var encrypted=lpslt.encryptForAjax(current_imap_data_obj);
			lib().ajax({ 
				url:"lpslt/php/insert-update-imaps-test-server-list-mailboxes.php", 
				type:"POST", 
				data:{ encrypted:encrypted }, 
				onsuccess:function(data) {
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						var upd=0, check=0, ins, id, index;
						if (__.isObject(decrypted)) {
							for (var p in decrypted) {
								if (p.substr(0,5)==="check") {
									if ("result" in decrypted[p] && /^Array\s\(/.test(decrypted[p].result)) {
										check++;
										id=p.substr(p.lastIndexOf("_")+1);
										if (id!=="new") {
											lib("#imap_account_status_"+id).to({ style: { backgroundColor:"green" }}, { duration:333 });
										}
									} else if ("error" in decrypted[p]) {
										id=p.substr(p.lastIndexOf("_")+1);
										if (id!=="new") {
											lib("#imap_account_status_"+id).to({ style: { backgroundColor:"red" }}, { duration:333 });
										}
										index=current_imap_data_obj.id.indexOf(id);
										if (/No such host as .* in /.test(decrypted[p].error)) {
											lpslt.error(locales["imapError"]+locales["noSuchHost"]+current_imap_data_obj.server[index]);
										} else if (/TLS\/SSL failure for .*: .* in /.test(decrypted[p].error)) {
											lpslt.error(locales["imapError"]+locales["ssltlsFailure"]+current_imap_data_obj.server[index]);
										} else if (/Certificate failure/.test(decrypted[p].error)) {
											lpslt.error(locales["imapError"]+locales["certificateFailure"]+imap_data_obj.server[index]);
										} else if (/SSL negotiation failed/.test(decrypted[p].error)) {
											lpslt.error(locales["imapError"]+locales["sslNegotiationFailed"]+current_imap_data_obj.server[index]);
										} else if (/\[AUTHENTICATIONFAILED\]/.test(decrypted[p].error) || /password wrong or not a valid user/.test(decrypted[p].error)) {
											lpslt.error(locales["imapError"]+locales["authFailed"]+current_imap_data_obj.imap_identifier[index]+" @ "+current_imap_data_obj.server[index]);
										} else if (/Connection failed to .*,([0-9]+): Connection refused in /.test(decrypted[p].error)) {
											lpslt.error(locales["imapError"]+locales["connectionFailed"]+current_imap_data_obj.imap_identifier[index]+" @ "+current_imap_data_obj.server[index]);
										} else {
											lpslt.error(locales["imapError"]+locales["unknownImapError"]+current_imap_data_obj.imap_identifier[index]+" @ "+current_imap_data_obj.server[index]+locales["detail"]+decrypted[p].error);
										}
									}
								} else if (p.substr(0,6)==="update") {
									if ("message" in decrypted[p] && decrypted[p].message==="ok") {
										upd++;
									} else if ("error" in decrypted[p]) {
										lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted[p].error);
									} else {
										lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
									}
								} else if (p.substr(0,6)==="insert") {
									if ("message" in decrypted[p] && decrypted[p].message==="ok") {
										ins=true;
									} else if ("error" in decrypted[p]) {
										lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted[p].error);
									} else {
										lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
									}
								} else if (p==="error") {
									lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
								} 
							}
							if (ins) {
								lpslt.message.temporary(locales['mysqlInsertSucceeded'], "green", null);
							}
							if (upd>0) {
								lpslt.message.temporary(upd+" "+locales['mysqlUpdatesSucceeded'], "green", null);
							}
							if (check>0) {
								lpslt.message.temporary(check+locales['imapChecksSucceeded'], "green", null);
							}
							if (ins) {
								lpslt.ajax(lpslt.currentPage, true, "replace");
							}
						} else {
							lpslt.error(locales["parsingError"]+locales["notObject"]);
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				}, 
				onfail:function(data) { 
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				}
			 });
		}
	},
	applySmtpChanges:function() {
		var current_smtp_data_obj={ id:1, identifier:lib().trim(lib(".smtp_identifier").targets[0].value), password:lib().trim(lib(".smtp_password").targets[0].value), server:lib().trim(lib(".smtp_server").targets[0].value), port:lib().trim(lib(".smtp_port").targets[0].value), ssl_cert:lpslt.checkboxStates["smtp_ssl_cert"], active:lpslt.checkboxStates["smtp_active"], report_locale:lpslt.reportLocale, recipients:lib().trim(lib(".smtp_recipients").targets[0].value) };
		var encrypted=lpslt.encryptForAjax(current_smtp_data_obj);
		lib().ajax({ 
			url:"lpslt/php/update-smtp.php", 
			type:"POST", 
			data:{ encrypted:encrypted }, 
			onsuccess:function(data) {
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					if (__.isObject(decrypted)) {
						for (var p in decrypted) {
							if (p==="update") {
								if ("message" in decrypted[p] && decrypted[p].message==="ok") {
									lpslt.message.temporary(locales['mysqlUpdateSucceeded'], "green", null);
								} else if ("error" in decrypted[p]) {
									lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted[p].error);
								} else {
									lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
								}
							} else if (p==="error") {
								lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
							} 
						}
					} else {
						lpslt.error(locales["parsingError"]+locales["notObject"]);
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			}, 
			onfail:function(data) { 
				lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
			}
		});
	},
	postMaxSize:0,
	uploadMaxFileSize:0,
	getIniValuesForUpload:function(callback) {
		var settings=["post_max_size","upload_max_filesize"];
		settings=lpslt.encryptForAjax(settings);
		lib().ajax({ type:"POST", url:"./lpslt/php/iniGet.php", data:{ encrypted:settings }, onsuccess:function(data) {
			var res;
			try { var d=lib().json.parse(data.d); res=true; } catch (e) { lpslt.error(adminLocales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); res=false; }
			res && (function() {
				if ("message" in d) {
					if (d.message==="ok") {
						d=lpslt.decryptAjaxResponse(d.encrypted);
						if (lib().isObject(d) && "post_max_size" in d && "upload_max_filesize" in d) {
							admin.postMaxSize=admin.computerUnitsToBytes(d.post_max_size);
							admin.uploadMaxFileSize=admin.computerUnitsToBytes(d.upload_max_filesize);
							typeof(data.callback)==="function" && data.callback();
						}
					} else {
						lpslt.error(d.message);
					}
				} else {
					lpslt.error(locales['notObject']);
				}
			})();
		}, onfail:function(data) { lpslt.error(locales['errorHasOccured']+data.d); }, addparams:{ callback:callback }});
	},
	fileList:null,
	fileStr:"",
	dataURL:[],
	thumbDataURL:[],
	computingThumbDataURL:[],
	computingDataURL:[],
	uploadStatus:"",
	prepareFilesStatus:{},
	thumb:false,
	prepareFiles:function(event) {
		admin.uploadStatus="waitingForClick";
		admin.prepareFilesStatus={};
		admin.fileList=(("target" in event) && ("files" in event.target)?event.target.files:event.dataTransfer.files);
		var file, nm;
		admin.fileStr="";
		if (0 in admin.fileList) {
			file=admin.fileList[0];
			if ('name' in file) {
				nm=file.name;
			} else {
				nm=file.fileName;
			}
			if (nm.indexOf(".")!==-1 && ["jpg", "jpeg", "png", "gif"].indexOf(nm.substr(nm.lastIndexOf(".")+1).toLowerCase())!==-1) {
				admin.thumb=true;
				admin.preparePNG(0);
			}
			lpslt.wait("ready", ["admin","prepareFilesStatus"], function() {
				lib("#upload").css({ visibility:"visible" });
				lib("#upload").to({ style: { opacity:1 }}, { duration:500 });
			});
		} else {
			lib("#upload").to({ style: { opacity:0 }}, { duration:500, oncomplete:function(){ lib("#upload").css({ visibility:"hidden" }); } });
		}
	},
	preparePNG:function() {
		file=admin.fileList[0];
		if ('name' in file) {
			nm=file.name;
		} else {
			nm=file.fileName;
		}
		if (nm.indexOf(".")!==-1 && ["jpg", "jpeg", "png", "gif"].indexOf(nm.substr(nm.lastIndexOf(".")+1).toLowerCase())!==-1) {
			var fileReader=new FileReader();
			admin.computingThumbDataURL.push(0);
			fileReader.onload=function(e) {
				var img=new Image();
				img.src=e.target.result;
				img.onload=function() {
					var w,h;
					if (this.width>this.height) {
						w=256;
						h=Math.round((this.height/this.width)*256);
					} else {
						h=256;
						w=Math.round((this.width/this.height)*256);
					}
					lib("body").createNode("canvas", { id:'canvas', className:"toDelete", style:"position:absolute; display:none; width:"+Math.max(w, h)+"px; height:"+Math.max(w, h)+"px;", width:Math.max(w, h), height:Math.max(w, h) }, "");
					var cv=lib('#canvas').targets[0];
					var ctx=cv.getContext("2d");
					if (ctx) {
						ctx.fillStyle="white";
						ctx.fillRect(0, 0, this.width, this.height);
						ctx.drawImage(this, 0, 0, this.width, this.height, (Math.max(w, h)-w)/2, (Math.max(w, h)-h)/2, w, h);
					}
					admin.thumbDataURL[0]=cv.toDataURL("image/png");
					admin.computingThumbDataURL.splice(admin.computingThumbDataURL.indexOf(0), 1);
					lib('#canvas').remove();
					if (this.width/this.height>2) {
						w=512;
						h=Math.round((512/this.width)*this.height);
					} else {
						h=256;
						w=Math.round((this.width/this.height)*256);
					}
					lib("body").createNode("canvas", { id:'canvas', className:"toDelete", style:"position:absolute; display:none; width:"+w+"px; height:"+h+"px;", width:w, height:h }, "");
					var cv=lib('#canvas').targets[0];
					var ctx=cv.getContext("2d");
					if (ctx) {
						ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, w, h);
					}
					admin.dataURL[0]=cv.toDataURL("image/png");
					admin.computingDataURL.splice(admin.computingDataURL.indexOf(0), 1);
					lib('#canvas').remove();
					lib(".progressThumb .greenbar").to({ style: { width:"100%" } }, { duration:500 });
					admin.prepareFilesStatus={ ready:true };
				};
			};
			fileReader.readAsDataURL(admin.fileList[0]);
		}
	},
	initUpload:function() {
		if (admin.uploadStatus==="waitingForClick") {
			admin.uploadStatus="uploading";
			var chunkSize=256*1024, chunkIndex=-1, offset=0, index=-1, chunksProgress=[], chunksTotal=[], name, size;
			function seek() {
				var data, name;
				offset=0;
				index++;
				if (index<admin.fileList.length) {
					var thumbName="favicon.png";
					data={ chunkIndex:0, encrypted:false, dir:"media/", name:thumbName, token:log.uploadToken };
					data=lpslt.encryptForAjax(data);
					if (["computing", "unavailable"].indexOf(admin.thumbDataURL[index])===-1) {
						lib().ajax({ 
							type:"POST", 
							url:"./lpslt/php/upload.php", 
							data:{ data:data }, 
							onsuccess:function(data) {
								var res;
								try { var d=lib().json.parse(data.d); res=true; } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); res=false; }
								res && (function() {
									if (d.message.substr(0,5)!=="path:") {
										lpslt.error(locales['couldNotUploadFile']+thumbName+"<br />"+(d.message in locales?locales[d.message]:d.message)); 
									}
								})();
							},
							onfail:function(data) {
								lpslt.error(locales['errorHasOccured']+data.d); 
							},
							onuploadprogress:function(data) {
								updateProgress(0.5, data.loaded/data.total);
							},
							headers:[["X-File-Name", encodeURIComponent(thumbName)],["Content-Type", "image/png"]],
							send:admin.thumbDataURL[index].replace('data:image/png;base64,', '')
						});
					}
					name="logo.png";
					data={ chunkIndex:0, encrypted:false, dir:"media/", name:name, token:log.uploadToken };
					data=lpslt.encryptForAjax(data);
					if (["computing", "unavailable"].indexOf(admin.dataURL[index])===-1) {
						lib().ajax({ 
							type:"POST", 
							url:"./lpslt/php/upload.php", 
							data:{ data:data }, 
							onsuccess:function(data) {
								var res;
								try { var d=lib().json.parse(data.d); res=true; } catch (e) { lpslt.error(locales["parsingError"]+(e.name.toLowerCase()!==e.message.replace(/\s/, "").toLowerCase()?e.name+" "+e.message:e.message)); res=false; }
								res && (function() {
									if (d.message.substr(0,5)!=="path:") {
										lpslt.error(locales['couldNotUploadFile']+thumbName+"<br />"+(d.message in locales?locales[d.message]:d.message)); 
									} else {
										seek();
									}
								})();
							},
							onfail:function(data) {
								lpslt.error(locales['errorHasOccured']+data.d); 
							},
							onuploadprogress:function(data) {
								updateProgress(0, data.loaded/data.total);
							},
							headers:[["X-File-Name", encodeURIComponent(name)],["Content-Type", "image/png"]],
							send:admin.dataURL[index].replace('data:image/png;base64,', '')
						});
					}
				} else {
					admin.uploadStatus="finished";
					lpslt.message.temporary(locales['uploadComplete']+locales['refresh'], "green", null, 6000);
					setTimeout(function() { window.location.reload(); }, 3000);
				}
			}
			function updateProgress(offset, ratio) {
				lib("#_"+index+" .progressUpload .greenbar").to({ style: { width:(offset+ratio)*100+"%" }}, { duration:125 });
				lib("#_"+index+" .progressUpload .absolute").html(admin.fixFloat((offset+ratio)*100,0)+"%");
			}
			seek();
		}
	},
	fixFloat:function(number, digits) {
		return Math.round(number*Math.pow(10, digits))/Math.pow(10, digits);
	},
	computerUnitsToBytes:function(str) {
		var ex;
		if ((ex=/([0-9]+)(k|m|g|t|p)/i.exec(str))!==null) {
			var arr=["k","m","g","t","p"];
			return parseInt(ex[1], 10)*Math.pow(1024, arr.indexOf(ex[2].toLowerCase())+1);
		} else if (parseInt(str,10)>0) {
			return parseInt(str,10);
		}
	},
	deleteCustomer:function(dbId, identifier) {
		if (!isNaN(dbId)) {
			encrypted=lpslt.encryptForAjax({ id:dbId });
			lpslt.message.waitForApprobation(function() {
				if (dbId!=="new") {
					lib().ajax({ 
						url:"lpslt/php/delete-customer.php", 
						type:"POST", 
						data:{ encrypted:encrypted }, 
						onsuccess:function(data) {
							if (data.d!=="" && data.d!=="noAuth") {
								var decrypted=lpslt.decryptAjaxResponse(data.d);
								if (__.isObject(decrypted)) {
									if ("message" in decrypted && decrypted.message==="ok") {
										lpslt.message.temporary(locales['mysqlDeleteSucceeded'], "green", null);
										lpslt.ajax(lpslt.currentPage, true, "replace");
									} else if ("message" in decrypted && decrypted.message==="ko" && "error" in decrypted) {
										lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted.error);
									} else if ("message" in decrypted && decrypted.message==="ko") {
										lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
									} else if ("error" in decrypted) {
										lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
									}
								}
							} else if (data.d==="") {
								lpslt.error(locales["parsingError"]+locales["emptyString"]);
							} else if (data.d==="noAuth") {
								lpslt.error(locales["authNeeded"]);
								log.askForRelog();
							}
						}, 
						onfail:function(data) { 
							lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
						}
					 });
				} else {
					lib(identifier).to({ style: { height:"0em", marginBottom:"0em", paddingBottom:"0em" }}, { duration:250, oncompleteparams:{ identifier:identifier }, oncomplete:function(r) { lib(r.identifier).remove(); } });
				}
			}, null, [], locales["areYouSureYouWantToDeleteThisCustomer"]);
		} else {
			lib(identifier).to({ style: { height:"0em" } }, { easing:"easeOutQuad", duration:250, oncompleteparams:{ identifier:identifier }, oncomplete:function(r) { lib(r.identifier).remove(); } });
		}
	},
	createNewCustomer:function() {
		var str='';
		var t=lib(".customer").targets, i;
		if (t.length>0) {
			i=parseInt(t[t.length-1].getAttribute("data-id").replace("new_", ""), 10)+1;
		} else {
			i=0;
		}
		var boxes=lib(".box").targets;
		var memI=0;
		for (j=0; j<boxes.length; j++) {
			if (parseInt(boxes[j].id.substr(4), 10)>memI) {
				memI=parseInt(boxes[j].id.substr(4), 10);
			}
		}
		memI++;
		str+='<div class="box customer new" data-id="new_'+i+'" id="box_'+memI+'" style="color:rgb(255,255,255); background-color:rgb(127,127,127);">';
		str+='<span class="field_10" style="text-align:center;">';
		str+='<button onclick="lpslt.toggleBox('+memI+', \'_white\'); return false;" style="display:inline-block; vertical-align:middle; box-sizing:content-box; width:100%; height:1.5em; font-size:1em; border-radius:0.25em;">';
		str+='<img src="lpslt/media/box_arrow_right_white.png" style="width:auto; height:100%;" alt="arrow" />';
		str+='</button>';
		str+='</span>';
		str+='<span class="field_50">';
		str+='<input type="text" name="name_'+i+'" class="name textA" autocomplete="off" value="" placeholder="'+locales["specifyName"]+'" />';
		str+='</span>';
		str+='<span class="field_20" style="text-align:center;">';
		str+='<button class="toggle" onclick="lpslt.checkText(\'#active_new_'+i+'\', [\''+locales["inactive"]+'\', \''+locales["active"]+'\']); return false;" style="display:inline-block; box-sizing:content-box; margin-top:1px; width:auto; height:1.4em; font-size:0.75em;">';
		str+='<span class="textA">'+locales["status"]+' : </span><span id="active_new_'+i+'" class="textA">'+locales["active"]+'</span>';
		str+='</button>';
		str+='<script type="text/javascript">lpslt.checkboxStates[\'active_new_'+i+'\']=1;</script>';
		str+='</span>';
		str+='<span class="field_20" style="text-align:center;">';
		str+='<button onclick="admin.deleteCustomer(\'new\', \'#box_'+memI+'\'); return false;" style="display:inline-block; box-sizing:content-box; margin-top:1px; width:auto; height:1.4em; font-size:0.75em; border-radius:0.25em;">';
		str+='<span class="textA">'+locales["delete"]+'</span>';
		str+='</button>';
		str+='</span>';
		str+='<span class="lpslt_clearboth"></span>';
		str+='<div class="box_content">';
		str+='<span class="basic_indent_full_width_container textA" style="font-weight:200;" id="none"><i>'+locales["noItemDefinedYet"]+'</i></span>';
		str+='<button class="basic_indent_full_width_container textA" onclick="admin.addMonitoringItem(this.parentNode.parentNode.getAttribute(\'data-id\'), lib(\'#box_'+memI+' .field_50 .name\').targets[0].value); return false;">'+locales["addItem"]+'</button>';
		str+='</div>';
		str+='</div>';
		lib("#customers_list>form").appendHtmlJsCss(str);
		lib(".customer .name").on("keyup", function(e) { admin.setNameAtRightIfMonitoringOpened(e.libTarget); });
		lib(".customer .name").on("change", function(e) { admin.setNameAtRightIfMonitoringOpened(e.libTarget); });
		lib(".customer .name").on("paste", function(e) { admin.setNameAtRightIfMonitoringOpened(e.libTarget); });
	},
	setNameAtRightIfMonitoringOpened:function(element) {
		var id=element.name.split(/_/)[1];
		var customerId=admin.currentCustomerId.toString().indexOf("_")!==-1?admin.currentCustomerId.toString().split(/_/)[1]:admin.currentCustomerId;
		if (lib("#service_item form>div:nth-child(1)>span.responsive50_50_0dot5>.overlay_sub_content").targets.length>0 && customerId===id) {
			lib("#service_item form>div:nth-child(1)>span.responsive50_50_0dot5>.overlay_sub_content").html(element.value);
		}
	},
	applyCustomerChanges:function() {
		var customers=lib(".customer").targets,
		    index,
		    customer_data_obj=customer_data.length>0?lib().json.parse(lib().stripSlashes(customer_data)):{ id:[], name:[], active:[] };
		    current_customer_data_obj={ id:[], name:[], active:[], is_new:[] },
		    i,
		    newToBeDeleted=!1;
		for (var i=0; i<customers.length; i++) {
			if (/\bset\b/.test(customers[i].className)) {
				index=customer_data_obj.id.indexOf(parseInt(customers[i].getAttribute("data-id"), 10));
				current_customer_data_obj.id[index]=customers[i].getAttribute("data-id");
				for (var p in current_customer_data_obj) {
					if (p==="name") {
						current_customer_data_obj[p][index]=customers[i].querySelector("."+p).value;
						if (customers[i].querySelector("."+p).value==="") {
							lpslt.message.temporary(locales["emptyString"].substr(0,1).toLocaleUpperCase()+locales["emptyString"].substr(1)+" : "+locales[p], "orange", null);
							return false;
						}
					} else if (p==="active") {
						current_customer_data_obj[p][index]=lpslt.checkboxStates[p+"_"+customers[i].getAttribute("data-id")];
						if (parseInt(current_customer_data_obj[p][index],10)!==parseInt(customer_data_obj[p][index],10)) {
							customer_data_obj[p][index]=current_customer_data_obj[p][index];
							customer_data=lib().json.stringify(customer_data_obj);
						}
					} else if (p==="is_new") {
						current_customer_data_obj[p][current_customer_data_obj[p].length]=0;
					}
				}
			} else if (/\bnew\b/.test(customers[i].className)) {
				current_customer_data_obj.id[current_customer_data_obj.id.length]=customers[i].getAttribute("data-id");
				for (var p in current_customer_data_obj) {
					if (p==="name" && !newToBeDeleted) {
						if (customers[i].querySelector("."+p).value==="") {
							lpslt.message.temporary(locales["emptyString"].substr(0,1).toLocaleUpperCase()+locales["emptyString"].substr(1)+" : "+locales["ignoringNewEntry"], "orange", null);
							newToBeDeleted=!0;
						}
						current_customer_data_obj[p][current_customer_data_obj[p].length]=customers[i].querySelector("."+p).value;
					} else if (p==="active") {
						current_customer_data_obj[p][current_customer_data_obj[p].length]=lpslt.checkboxStates[p+"_"+customers[i].getAttribute("data-id")];
					} else if (p==="is_new") {
						current_customer_data_obj[p][current_customer_data_obj[p].length]=1;
					}
				}
			}
		}
		if (newToBeDeleted) {
			for (var p in current_customer_data_obj) {
				current_customer_data_obj[p].splice(current_customer_data_obj[p].length-1,1);
			}
		}
		if (current_customer_data_obj.id.length>0) {
			var encrypted=lpslt.encryptForAjax(current_customer_data_obj);
			console.log(current_customer_data_obj);
			lib().ajax({ 
				url:"lpslt/php/insert-update-customers.php", 
				type:"POST", 
				data:{ encrypted:encrypted }, 
				onsuccess:function(data) {
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						var upd=0, ins, id, index;
						if (__.isObject(decrypted)) {
							for (var p in decrypted) {
								if (p.substr(0,6)==="update") {
									if ("message" in decrypted[p] && decrypted[p].message==="ok") {
										upd++;
									} else if ("error" in decrypted[p]) {
										lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted[p].error);
									} else {
										lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
									}
								} else if (p.substr(0,6)==="insert") {
									if ("message" in decrypted[p] && decrypted[p].message==="ok") {
										ins=true;
										if (!isNaN(decrypted[p].id)) {
											if (admin.currentCustomerId==decrypted[p].ref_id) {
												admin.currentCustomerId=decrypted[p].id;
											}
											lib("[data-id='"+decrypted[p].ref_id+"']").removeClass("new");
											lib("[data-id='"+decrypted[p].ref_id+"']").addClass("set");
											lib("[data-id='"+decrypted[p].ref_id+"']").targets[0].setAttribute("data-id", decrypted[p].id);
										}
									} else if ("error" in decrypted[p]) {
										lpslt.error(locales["mysqlError"]+locales["mysqlSays"]+decrypted[p].error);
									} else {
										lpslt.error(locales["mysqlError"]+locales["mysqlEmpty"]);
									}
								} else if (p==="error") {
									lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
								} 
							}
							if (ins) {
								lpslt.message.temporary(locales['mysqlInsertSucceeded'], "green", null);
							}
							if (upd>0) {
								lpslt.message.temporary(upd+" "+locales['mysqlUpdatesSucceeded'], "green", null);
							}
						} else {
							lpslt.error(locales["parsingError"]+locales["notObject"]);
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				}, 
				onfail:function(data) { 
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				}
			 });
		}
	},
	currentCustomerId:-1,
	deleteMonitoringItem:function(id, customerId, customerName) {
		lpslt.message.waitForApprobation(function() {
			var encrypted=lpslt.encryptForAjax({ id:id });
			lib().ajax({ 
				url:"lpslt/php/delete-monitoring.php", 
				type:"POST", 
				data:{ encrypted:encrypted },
				onsuccess:function(data) {
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						if ("message" in decrypted && decrypted.message==="ok") {
							lpslt.message.temporary(locales['mysqlDeleteSucceeded'], "green", null);
							lpslt.ajax(lpslt.currentPage, true, "replace");
						} else if ("error" in decrypted) {
							lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
						} else {
							lpslt.error(locales["parsingError"]+locales["notObject"]);
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				}, 
				onfail:function(data) { 
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				},
				addparams:{
					id:id,
					customerId:customerId,
					customerName:customerName
				}
			});
		}, null, [], locales["areYouSureYouWantToDeleteThisService"]);
	},
	addMonitoringItem:function(customerId, customerName) {
		admin.currentCustomerId=-1;
		admin.currentUsedImapId=-1;
		admin.currentFolder="";
		var str='<div style="font-size:1.5em; text-align:left; border-bottom:1px solid lightgrey;"><span class="light_title">'+locales["addEmailMonitoring"]+'</span></div>',
		    imap_data_obj=imap_data.length>0?lib().json.parse(lib().stripSlashes(imap_data)):{ id:[], identifier:[], password:[], server:[], port:[], ssl_cert:[], check_cert:[], active:[] },
			i,
			strIMAP="";
		var boxes=lib(".box").targets;
		var memI=0;
		for (i=0; i<boxes.length; i++) {
			if (parseInt(boxes[i].id.substr(4), 10)>memI && lib([boxes[i]]).isChildOf(lib("#customers").targets[0])[0]) {
				memI=parseInt(boxes[i].id.substr(4), 10);
			}
		}
		if (imap_data_obj.id.length>0) {
			for (i=0; i<imap_data_obj.id.length; i++) {
				strIMAP+='<span style="padding-left:0em;" class="textA"><button onclick="admin.setCurrentUsedImapId('+imap_data_obj.id[i]+', this, '+(memI+1)+'); return false;" style="font-size:1em;">'+imap_data_obj.identifier[i]+' '+locales['on']+' '+imap_data_obj.server[i]+':'+imap_data_obj.port[i]+'</button><span style="display:block; position:absolute; width:0; height:100%; right:-2px; top:0; overflow:visible;"><img src="lpslt/media/getSvgGradient.php?color1=rgb(255,255,255)&color2=rgb(255,255,255)&opacity1=0&opacity2=1&widthNoUnit=2&heightNoUnit=2&widthUnit=2em&heightUnit=100%&pos=right" style="right:-2px; width:2em; height:100%; position:absolute;" /></span></span>';
			}
		}
		if (strIMAP.length===0) {
			strIMAP+='<span style="padding-left:0em;" class="textA">'+locales["noImapAccountDefinedYet"]+'</span>';
		}
		var identification=admin.buildIdentificationString("", 0, "");
		var monitoring=admin.buildMonitoringString("", "", 1, identification.memI);
		var cleaning=admin.buildCleaningString("72", "", monitoring.memI);
		var strIdentification=identification.string, strMonitoring=monitoring.string, strCleaning=cleaning.string;
		str+='<div style="font-size:1.414em; color:#000;"><form autocomplete="off">';
		str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["customerName"]+'</span></span><span class="responsive50_50_0dot5"><span class="overlay_sub_content textA">'+customerName+'</span></span><span class="lpslt_clearboth"></span></div>';
		str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["serviceName"]+'</span></span><span class="responsive50_50_0dot5"><input type="text" value="" name="service_or_machine_name" id="service_or_machine_name" autocomplete="off" class="overlay_input textA"  style="width:calc(100% - 1em); padding-left:0.5em; padding-right:0.5em;" /></span><span class="lpslt_clearboth"></span></div>';
		str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["imapAccount"]+'</span></span><span class="responsive50_50_0dot5"><span class="box" id="box_'+(memI+1)+'" style="width:calc(100% - 1em); background-color:white; margin-bottom:0em; padding-left:0.5em; padding-right:0.5em; border-radius:0.5em;"><button onclick="lpslt.toggleBox('+(memI+1)+'); return false;" class="textA"><span class="very_large_field" style="display:inline-block; position:relative; width:calc(100% - 2.5em); padding-left:0em;">'+locales["choose"]+'</span><span class="white_mask"><span style="display:block; position:absolute; width:0; height:100%; left:0; top:0; overflow:visible;"><img src="lpslt/media/getSvgGradient.php?color1=rgb(255,255,255)&color2=rgb(255,255,255)&opacity1=0&opacity2=1&widthNoUnit=2&heightNoUnit=2&widthUnit=2em&heightUnit=100%&pos=right" style="right:0; width:2em; height:100%; position:absolute;" /></span></span><img src="lpslt/media/box_arrow_right.png" /></button><span class="box_content">'+strIMAP+'</span></span></span><span class="lpslt_clearboth"></span></div>';
		str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="margedPaddedRoundedWhite"><span class="title textA">'+locales["folderList"]+'</span><span class="limited_content" id="folders"><span class="title textA">'+locales["waitingForImapAccountChoice"]+'</span></span></span></span><span class="responsive50_50_0dot5"><span class="margedPaddedRoundedWhite"><span class="title textA">'+locales["listOf10lastMails"]+'</span><span class="limited_content" id="last_messages"><span class="title textA">'+locales["waitingForFolderChoice"]+'</span></span></span></span><span class="lpslt_clearboth"></span></div>';
		str+='<div class="basic_full_width_container" id="identificationRules"><span class="responsive50_50"><span class="sub_title_right_on_desktop"><span class="textA">'+locales["identificationRules"]+'</span></span></span><span class="responsive50_50_0dot5"></span><span class="lpslt_clearboth"></span><span class="margedPaddedRoundedWhite _0dot75fs alignleft marginbottom1em lineHeight150pct">'+strIdentification+'</span></div>';
		str+='<div class="basic_full_width_container" id="monitoringRules"><span class="responsive50_50"><span class="sub_title_right_on_desktop"><span class="textA">'+locales["monitoringRules"]+'</span></span></span><span class="responsive50_50_0dot5"></span><span class="lpslt_clearboth"></span><span class="margedPaddedRoundedWhite _0dot75fs alignleft marginbottom1em lineHeight150pct">'+strMonitoring+'</span></div>';
		str+='<div class="basic_full_width_container" id="cleaningRules"><span class="responsive50_50"><span class="sub_title_right_on_desktop"><span class="textA">'+locales["cleaningRules"]+'</span></span></span><span class="responsive50_50_0dot5"></span><span class="lpslt_clearboth"></span><span class="margedPaddedRoundedWhite _0dot75fs alignleft marginbottom1em lineHeight150pct">'+strCleaning+'</span></div>';
		str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["periodicity"]+'</span></span><span class="responsive50_50_0dot5"><input type="number" value="24" id="periodicity_hours" class="overlay_input textA"  style="width:calc(100% - 1em); padding-left:0.5em; padding-right:0.5em;" /></span><span class="lpslt_clearboth"></span></div>';
		str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["failTimeout"]+'</span></span><span class="responsive50_50_0dot5"><input type="number" value="48" id="fail_timeout_hours" class="overlay_input textA"  style="width:calc(100% - 1em); padding-left:0.5em; padding-right:0.5em;" /></span><span class="lpslt_clearboth"></span></div>';
		str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["active"]+'</span></span><span class="responsive50_50_0dot5" style="text-align:left;"><button onclick="lpslt.switchCheckBox(this.querySelector(\'.dot\'), \'current_monitoring_active\'); return false;" style="display:inline-block; box-sizing:content-box; margin-top:1px; background-color:#fff; width:2em; height:2em; font-size:1em; border-radius:0.5em;" id="current_monitoring_active" class="textA"><span class="dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.5em; opacity:1"></span></button></span><span class="lpslt_clearboth"></span></div>';
		str+='<div class="basic_full_width_container" style="text-align:center;"><input class="textB button" type="button" onclick="admin.addMonitoring(); return false;" value="'+locales["apply"]+'" style="margin-top:0.5em;" /></div>';
		str+='</form></div>';
		lib("#subwrapper .content #service_item").htmlJsCss(str);
		var ltwh=lib("#service_item").ltwhRelativeTo(document.body)[0];
		lpslt.scrollTo(ltwh.top-10*lpslt.fs);
		lpslt.tweakLinks();
		admin.currentCustomerId=customerId.toString();
	},
	editMonitoringItem:function(id, customerId, customerName) {
		admin.currentCustomerId=-1;
		var encrypted=lpslt.encryptForAjax({ id:id });
		lib().ajax({ 
			url:"lpslt/php/get-monitoring.php", 
			type:"POST", 
			data:{ encrypted:encrypted }, 
			onsuccess:function(data) {
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					if (__.isObject(decrypted) && "service_or_machine_name" in decrypted) {
						var str='<div style="font-size:1.5em; text-align:left; border-bottom:1px solid lightgrey;"><span class="light_title">'+locales["editEmailMonitoring"]+'</span></div>',
							imap_data_obj=imap_data.length>0?lib().json.parse(lib().stripSlashes(imap_data)):{ id:[], identifier:[], password:[], server:[], port:[], ssl_cert:[], check_cert:[], active:[] },
							i,
							strIMAP="";
						var boxes=lib(".box").targets;
						var memI=0;
						for (i=0; i<boxes.length; i++) {
							if (parseInt(boxes[i].id.substr(4), 10)>memI && lib([boxes[i]]).isChildOf(lib("#customers").targets[0])[0]) {
								memI=parseInt(boxes[i].id.substr(4), 10);
							}
						}
						if (imap_data_obj.id.length>0) {
							for (i=0; i<imap_data_obj.id.length; i++) {
								strIMAP+='<span style="padding-left:0em;" class="textA"><button onclick="admin.setCurrentUsedImapId('+imap_data_obj.id[i]+', this, '+(memI+1)+'); return false;" style="font-size:1em;" id="imap_choice_'+imap_data_obj.id[i]+'" class="imap_choice">'+imap_data_obj.identifier[i]+' '+locales['on']+' '+imap_data_obj.server[i]+':'+imap_data_obj.port[i]+'</button><span style="display:block; position:absolute; width:0; height:100%; right:-2px; top:0; overflow:visible;"><img src="lpslt/media/getSvgGradient.php?color1=rgb(255,255,255)&color2=rgb(255,255,255)&opacity1=0&opacity2=1&widthNoUnit=2&heightNoUnit=2&widthUnit=2em&heightUnit=100%&pos=right" style="right:-2px; width:2em; height:100%; position:absolute;" /></span></span>';
							}
						}
						if (strIMAP.length===0) {
							strIMAP+='<span style="padding-left:0em;" class="textA">'+locales["noImapAccountDefinedYet"]+'</span>';
						}
						var identification=admin.buildIdentificationString(decrypted.identification_rules[0], decrypted.let_status_green_if_not_identified[0],decrypted.identification_actions[0]);
						var monitoring=admin.buildMonitoringString(decrypted.monitoring_rules[0], decrypted.monitoring_actions[0], decrypted.monitoring_status_if_matched[0], identification.memI);
						var cleaning=admin.buildCleaningString(decrypted.cleaning_timeout_hours[0], decrypted.cleaning_actions[0], monitoring.memI);
						var strIdentification=identification.string, strMonitoring=monitoring.string, strCleaning=cleaning.string;
						str+='<div style="font-size:1.414em; color:#000;"><form autocomplete="off">';
						str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["customerName"]+'</span></span><span class="responsive50_50_0dot5"><span class="overlay_sub_content textA">'+data.customerName+'</span></span><span class="lpslt_clearboth"></span></div>';
						str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["serviceName"]+'</span></span><span class="responsive50_50_0dot5"><input type="text" value="'+decrypted.service_or_machine_name[0]+'" name="service_or_machine_name" id="service_or_machine_name" autocomplete="off" class="overlay_input textA"  style="width:calc(100% - 1em); padding-left:0.5em; padding-right:0.5em;" /></span><span class="lpslt_clearboth"></span></div>';
						str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["imapAccount"]+'</span></span><span class="responsive50_50_0dot5"><span class="box" id="box_'+(memI+1)+'" style="width:calc(100% - 1em); background-color:white; margin-bottom:0em; padding-left:0.5em; padding-right:0.5em; border-radius:0.5em;"><button onclick="lpslt.toggleBox('+(memI+1)+'); return false;" class="textA"><span class="very_large_field" style="display:inline-block; position:relative; width:calc(100% - 2.5em); padding-left:0em;">'+(!isNaN(parseInt(decrypted.imap_account_id[0],10))?imap_data_obj.identifier[imap_data_obj.id.indexOf(decrypted.imap_account_id[0])]:locales["choose"])+'</span><span class="white_mask"><span style="display:block; position:absolute; width:0; height:100%; left:0; top:0; overflow:visible;"><img src="lpslt/media/getSvgGradient.php?color1=rgb(255,255,255)&color2=rgb(255,255,255)&opacity1=0&opacity2=1&widthNoUnit=2&heightNoUnit=2&widthUnit=2em&heightUnit=100%&pos=right" style="right:-2px; width:2em; height:100%; position:absolute;" /></span></span><img src="lpslt/media/box_arrow_right.png" /></button><span class="box_content">'+strIMAP+'</span></span></span><span class="lpslt_clearboth"></span></div>';
						str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="margedPaddedRoundedWhite"><span class="title textA">'+locales["folderList"]+'</span><span class="limited_content" id="folders"><span class="title textA">'+locales["waitingForImapAccountLoading"]+'</span></span></span></span><span class="responsive50_50_0dot5"><span class="margedPaddedRoundedWhite"><span class="title textA">'+locales["listOf10lastMails"]+'</span><span class="limited_content" id="last_messages"><span class="title textA">'+locales["waitingForImapFolderLoading"]+'</span></span></span></span><span class="lpslt_clearboth"></span></div>';
						str+='<div class="basic_full_width_container" id="identificationRules"><span class="responsive50_50"><span class="sub_title_right_on_desktop"><span class="textA">'+locales["identificationRules"]+'</span></span></span><span class="responsive50_50_0dot5"></span><span class="lpslt_clearboth"></span><span class="margedPaddedRoundedWhite _0dot75fs alignleft marginbottom1em lineHeight150pct">'+strIdentification+'</span></div>';
						str+='<div class="basic_full_width_container" id="monitoringRules"><span class="responsive50_50"><span class="sub_title_right_on_desktop"><span class="textA">'+locales["monitoringRules"]+'</span></span></span><span class="responsive50_50_0dot5"></span><span class="lpslt_clearboth"></span><span class="margedPaddedRoundedWhite _0dot75fs alignleft marginbottom1em lineHeight150pct">'+strMonitoring+'</span></div>';
						str+='<div class="basic_full_width_container" id="cleaningRules"><span class="responsive50_50"><span class="sub_title_right_on_desktop"><span class="textA">'+locales["cleaningRules"]+'</span></span></span><span class="responsive50_50_0dot5"></span><span class="lpslt_clearboth"></span><span class="margedPaddedRoundedWhite _0dot75fs alignleft marginbottom1em lineHeight150pct">'+strCleaning+'</span></div>';
						str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["periodicity"]+'</span></span><span class="responsive50_50_0dot5"><input type="number" value="'+decrypted.periodicity_hours[0]+'" id="periodicity_hours" class="overlay_input textA"  style="width:calc(100% - 1em); padding-left:0.5em; padding-right:0.5em;" /></span><span class="lpslt_clearboth"></span></div>';
						str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["failTimeout"]+'</span></span><span class="responsive50_50_0dot5"><input type="number" value="'+decrypted.fail_timeout_hours[0]+'" id="fail_timeout_hours" class="overlay_input textA"  style="width:calc(100% - 1em); padding-left:0.5em; padding-right:0.5em;" /></span><span class="lpslt_clearboth"></span></div>';
						str+='<div class="basic_full_width_container"><span class="responsive50_50"><span class="sub_title_right_on_desktop textA">'+locales["active"]+'</span></span><span class="responsive50_50_0dot5" style="text-align:left;"><button onclick="lpslt.switchCheckBox(this.querySelector(\'.dot\'), \'current_monitoring_active\'); return false;" style="display:inline-block; box-sizing:content-box; margin-top:1px; background-color:#fff; width:2em; height:2em; font-size:1em; border-radius:0.5em;" id="current_monitoring_active" class="textA"><span class="dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.5em; opacity:'+decrypted.active[0]+'"></span></button></span><span class="lpslt_clearboth"></span></div>';
						str+='<div class="basic_full_width_container" style="text-align:center;"><input class="textB button" type="button" onclick="admin.updateMonitoring(); return false;" value="'+locales["apply"]+'" style="margin-top:0.5em;" /></div>';
						str+='</form></div>';
						admin.currentMonitoringId=data.id;
						admin.currentCustomerId=data.customerId;
						lpslt.checkboxStates['current_monitoring_active']=parseInt(decrypted.active[0],2);
						lib("#subwrapper .content #service_item").htmlJsCss(str);
						lpslt.tweakLinks();
						if (lib("#imap_choice_"+decrypted.imap_account_id[0]).targets.length>0) { 
							admin.setCurrentUsedImapId(
								decrypted.imap_account_id[0],
								lib("#imap_choice_"+decrypted.imap_account_id[0]).targets[0],
								(memI+1),
								function() {
									admin.setFolderAndCheckMark({ libTarget:lib("span.folder>button[data-path='"+decrypted.imap_path[0]+"']").targets[0] });
									admin.toggleFoldingRecursive(decrypted.imap_path[0]);
								},
								true
							);
						}
						var ltwh=lib("#service_item").ltwhRelativeTo(document.body)[0];
						lpslt.scrollTo(ltwh.top-10*lpslt.fs);
					} else {
						lpslt.error(locales["parsingError"]+locales["notObject"]);
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			}, 
			onfail:function(data) { 
				lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
			},
			addparams:{
				id:id,
				customerId:customerId,
				customerName:customerName
			}
		});
	},
	rulesAssociations:["oneOf","allOf"],
	rulesOperators:["contains","doesNotContain","startsWith","endsWith","equals","doesNotEqual","matchesRegex","doesNotMatchRegex"],
	rulesVariables:["from","to","object","messageBody"],
	rulesActionsWithoutDelete:["moveToImapFolder","setFlag","clearFlag","markAsRead"],
	rulesActionsWithDelete:["moveToImapFolder","setFlag","clearFlag","markAsRead","deleteMessage"],
	buildIdentificationString:function(identification_rules, letStatusGreenIfNotIdentified, identification_actions) {
		var rules;
		if (identification_rules.length>0) {
			rules=lib().json.parse(identification_rules);
		} else {
			rules={};
		}
		var actions;
		if (identification_actions.length>0) {
			actions=lib().json.parse(identification_actions);
		} else {
			actions={};
		}
		var memI=-1, i, j, strRulesAssociations='', subStrRulesAssociations='', strRulesOperators='', strRulesVariables='', strRulesActionsWithoutDelete='', miniBoxes=lib(".minibox").targets;
		for (i=0; i<miniBoxes.length; i++) {
			if (parseInt(miniBoxes[i].id.substr(8), 10)>memI) {
				memI=parseInt(miniBoxes[i].id.substr(8), 10);
			}
		}
		for (i=0; i<admin.rulesAssociations.length; i++) {
			if (__.countProperties(rules)===0 || rules.association!==admin.rulesAssociations[i]) {
				if (__.countProperties(rules)===0 && i===0) {
					defaultChoice=admin.rulesAssociations[i];
				}
			} else {
				defaultChoice=admin.rulesAssociations[i];
			}
		}
		strRulesAssociations=lpslt.buildMiniBox(memI+1, admin.rulesAssociations, defaultChoice, "rulesAssociations");
		memI++;
		strRulesVariables=lpslt.buildMiniBox((memI+1)+"a", admin.rulesVariables, admin.rulesVariables[0], "rulesVariables");
		strRulesOperators=lpslt.buildMiniBox((memI+1)+"b", admin.rulesOperators, admin.rulesOperators[0], "rulesOperators");
		var string='<span class="basic_full_width_container textA"><span>'+locales["if"]+'</span>&nbsp;'+strRulesAssociations+'&nbsp;<span>'+locales["nextConditionsIsAreMatched"]+'&nbsp;:</span></span>';
		if (!(__.countProperties(rules)>0 && rules.items.length>0)) {
			string+='<span class="basic_full_width_container textA marginTop0dot5em">'+strRulesVariables+'&nbsp;'+strRulesOperators+'&nbsp;<input id="rulesValues_'+(memI+1)+'" class="rulesValues miniInput" type="text" value="" />&nbsp;<button onclick="admin.deleteRule(this.parentNode); return false;"><b>－</b></button></span>';
			memI++;
		} else {
			for (i=0; i<rules.items.length; i++) {
				strRulesVariables='';
				strRulesOperators='';
				for (j=0; j<admin.rulesVariables.length; j++) {
					if (rules.items[i].variable===admin.rulesVariables[j]) {
						defaultChoice=admin.rulesVariables[j];
					}
				}
				strRulesVariables=lpslt.buildMiniBox((memI+1)+"a", admin.rulesVariables, defaultChoice, "rulesVariables");
				for (j=0; j<admin.rulesOperators.length; j++) {
					if (rules.items[i].operator===admin.rulesOperators[j]) {
						defaultChoice=admin.rulesOperators[j];
					}
				}
				strRulesOperators=lpslt.buildMiniBox((memI+1)+"b", admin.rulesOperators, defaultChoice, "rulesOperators");
				string+='<span class="basic_full_width_container textA marginTop0dot5em">'+strRulesVariables+'&nbsp;'+strRulesOperators+'&nbsp;<input id="rulesValues_'+(memI+1)+'" class="rulesValues miniInput" type="text" value="'+rules.items[i].value+'" />&nbsp;<button onclick="admin.deleteRule(this.parentNode); return false;"><b>－</b></button></span>';
				memI++;
			}
		}
		string+='<button onclick="admin.addRule(this); return false;" class="textA"><b>+ '+locales["addRule"]+'</b></button>';
		string+='<span class="basic_full_width_container textA">'+locales["letStatusGreenIfNotIdentified"]+'&nbsp;<button class="toggle" onclick="lpslt.checkText(\'#letStatusGreenIfNotIdentified\', [\''+locales["no"]+'\', \''+locales["yes"]+'\']); return false;" style="display:inline-block; box-sizing:content-box; margin-top:1px; width:auto; height:2rem; font-size:0.75em;">';
		string+='<span id="letStatusGreenIfNotIdentified" class="textA">'+(parseInt(letStatusGreenIfNotIdentified, 10)==1?locales["yes"]:locales["no"])+'</span>';
		lpslt.checkboxStates['letStatusGreenIfNotIdentified']=parseInt(letStatusGreenIfNotIdentified, 10);
		string+='</button></span>',
		string+='<span class="basic_full_width_container textA"><span>'+locales["performTheFollowingActions"]+'&nbsp;:</span></span>';
		if (__.countProperties(actions)===0 || actions.length===0) {
			memI++;
		} else {
			for (i=0; i<actions.length; i++) {
				for (j=0; j<admin.rulesActionsWithoutDelete.length; j++) {
					if (actions[i].action===admin.rulesActionsWithoutDelete[j]) {
						defaultChoice=admin.rulesActionsWithoutDelete[j];
					}
				}
				string+='<span class="basic_full_width_container textA">'+lpslt.buildMiniBox((memI+1), admin.rulesActionsWithoutDelete, defaultChoice, "rulesActions")+'&nbsp;<input id="optionalArgument_'+(memI+1)+'" type="text" class="optionalArgument miniInput" placeholder="'+locales["optionalArgument"]+'" value="'+actions[i].argument+'" />&nbsp;<button onclick="admin.deleteAction(this.parentNode); return false;"><b>－</b></button></span>';
				memI++;
			}
		}
		string+='<button onclick="admin.addAction(this, false); return false;" class="textA"><b>+ '+locales["addAction"]+'</b></button>';
		return { string:string, memI:memI };
	},
	buildMonitoringString:function(monitoring_rules, monitoring_actions, monitoring_status_if_matched, memI) {
		var rules;
		if (monitoring_rules.length>0) {
			rules=lib().json.parse(monitoring_rules);
		} else {
			rules={};
		}
		var actions;
		if (monitoring_actions.length>0) {
			actions=lib().json.parse(monitoring_actions);
		} else {
			actions={};
		}
		var i, j, strRulesAssociations='', subStrRulesAssociations='', strRulesOperators='', strRulesVariables='', strRulesActionsWithoutDelete='';
		for (i=0; i<admin.rulesAssociations.length; i++) {
			if (__.countProperties(rules)===0 || rules.association!==admin.rulesAssociations[i]) {
				if (__.countProperties(rules)===0 && i===0) {
					defaultChoice=admin.rulesAssociations[i];
				}
			} else {
				defaultChoice=admin.rulesAssociations[i];
			}
		}
		strRulesAssociations=lpslt.buildMiniBox(memI+1, admin.rulesAssociations, defaultChoice, "rulesAssociations");
		memI++;
		strRulesVariables=lpslt.buildMiniBox((memI+1)+"a", admin.rulesVariables, admin.rulesVariables[0], "rulesVariables");
		strRulesOperators=lpslt.buildMiniBox((memI+1)+"b", admin.rulesOperators, admin.rulesOperators[0], "rulesOperators");
		var string='<span class="basic_full_width_container textA"><span>'+locales["if"]+'</span>&nbsp;'+strRulesAssociations+'&nbsp;<span>'+locales["nextConditionsIsAreMatched"]+'&nbsp;:</span></span>';
		if (!(__.countProperties(rules)>0 && rules.items.length>0)) {
			string+='<span class="basic_full_width_container textA marginTop0dot5em">'+strRulesVariables+'&nbsp;'+strRulesOperators+'&nbsp;<input id="rulesValues_'+(memI+1)+'" class="rulesValues miniInput" type="text" value="" />&nbsp;<button onclick="admin.deleteRule(this.parentNode); return false;"><b>－</b></button></span>';
			memI++;
		} else {
			for (i=0; i<rules.items.length; i++) {
				strRulesVariables='';
				strRulesOperators='';
				for (j=0; j<admin.rulesVariables.length; j++) {
					if (rules.items[i].variable===admin.rulesVariables[j]) {
						defaultChoice=admin.rulesVariables[j];
					}
				}
				strRulesVariables=lpslt.buildMiniBox((memI+1)+"a", admin.rulesVariables, defaultChoice, "rulesVariables");
				for (j=0; j<admin.rulesOperators.length; j++) {
					if (rules.items[i].operator===admin.rulesOperators[j]) {
						defaultChoice=admin.rulesOperators[j];
					}
				}
				strRulesOperators=lpslt.buildMiniBox((memI+1)+"b", admin.rulesOperators, defaultChoice, "rulesOperators");
				string+='<span class="basic_full_width_container textA marginTop0dot5em">'+strRulesVariables+'&nbsp;'+strRulesOperators+'&nbsp;<input id="rulesValues_'+(memI+1)+'" class="rulesValues miniInput" type="text" value="'+rules.items[i].value+'" />&nbsp;<button onclick="admin.deleteRule(this.parentNode); return false;"><b>－</b></button></span>';
				memI++;
			}
		}
		string+='<button onclick="admin.addRule(this); return false;" class="textA"><b>+ '+locales["addRule"]+'</b></button>';
		string+='<span class="basic_full_width_container textA"><span>'+locales["performTheFollowingActions"]+'&nbsp;:</span></span>';
		if (__.countProperties(actions)===0 || actions.length===0) {
			memI++;
		} else {
			for (i=0; i<actions.length; i++) {
				for (j=0; j<admin.rulesActionsWithoutDelete.length; j++) {
					if (actions[i].action===admin.rulesActionsWithoutDelete[j]) {
						defaultChoice=admin.rulesActionsWithoutDelete[j];
					}
				}
				string+='<span class="basic_full_width_container textA">'+lpslt.buildMiniBox((memI+1), admin.rulesActionsWithoutDelete, defaultChoice, "rulesActions")+'&nbsp;<input id="optionalArgument_'+(memI+1)+'" class="optionalArgument miniInput" type="text" placeholder="'+locales["optionalArgument"]+'" value="'+actions[i].argument+'" />&nbsp;<button onclick="admin.deleteAction(this.parentNode); return false;"><b>－</b></button><br /></span>';
				memI++;
			}
		}
		string+='<button onclick="admin.addAction(this, false); return false;" class="textA"><b>+ '+locales["addAction"]+'</b></button>';
		if (parseInt(monitoring_status_if_matched, 10)===1) {
			defaultChoice="success";
		} else {
			defaultChoice="fail";
		}
		string+='<span class="basic_full_width_container textA">'+locales["thenMarkStatusAs"]+lpslt.buildMiniBox((memI+1), ["success", "fail"], defaultChoice, "monitoringStatus")+" "+locales["ifTheseRulesAreMatched"]+'</span>';
		memI++;
		return { string:string, memI:memI };
	},
	buildCleaningString:function(cleaning_timeout_hours, cleaning_actions, memI) {
		if (cleaning_actions.length>0) {
			actions=lib().json.parse(cleaning_actions);
		} else {
			actions=[];
		}
		var i, j, rulesActionsWithDelete=[], string='<span class="basic_full_width_container textA"><span>'+locales["passed"]+'</span>&nbsp;<input type="text" id="timeCleaning" class="timeCleaning miniInput" placeholder="'+locales["inputNumberHere"]+'" value="'+cleaning_timeout_hours+'" /><span>&nbsp;'+locales["hours"]+',</span><br /><span>'+locales["performTheFollowingActions"]+'&nbsp;:</span></span>';
		if (__.countProperties(actions)===0 || actions.length===0) {
			memI++;
		} else {
			for (i=0; i<actions.length; i++) {
				for (j=0; j<admin.rulesActionsWithDelete.length; j++) {
					if (actions[i].action===admin.rulesActionsWithDelete[j]) {
						defaultChoice=admin.rulesActionsWithDelete[j];
					}
				}
				string+='<span class="basic_full_width_container textA">'+lpslt.buildMiniBox((memI+1), admin.rulesActionsWithDelete, defaultChoice, "rulesActions")+'&nbsp;<input id="optionalArgument_'+(memI+1)+'" class="optionalArgument miniInput" type="text" placeholder="'+locales["optionalArgument"]+'" value="'+actions[i].argument+'" />&nbsp;<button onclick="admin.deleteAction(this.parentNode); return false;"><b>－</b></button></span>';
				memI++;
			}
		}
		string+='<button onclick="admin.addAction(this, true); return false;" class="textA"><b>+ '+locales["addAction"]+'</b></button>';
		return { string:string, memI:memI };
	},
	addRule:function(element) {
		var memI=-1, index=lib([element]).getIndexOfNodes()[0], miniBoxes=lib(".minibox").targets;
		for (i=0; i<miniBoxes.length; i++) {
			if (parseInt(miniBoxes[i].id.substr(8), 10)>memI) {
				memI=parseInt(miniBoxes[i].id.substr(8), 10);
			}
		}
		var strRulesVariables=lpslt.buildMiniBox((memI+1)+"a", admin.rulesVariables, admin.rulesVariables[0], "rulesVariables"), strRulesOperators=lpslt.buildMiniBox((memI+1)+"b", admin.rulesOperators, admin.rulesOperators[0], "rulesOperators");
		var str=strRulesVariables+'&nbsp;'+strRulesOperators+'&nbsp;<input id="rulesValues_'+(memI+1)+'" class="rulesValues miniInput" type="text" value="" />&nbsp;<button onclick="admin.deleteRule(this.parentNode); return false;"><b>－</b></button>';
		lib([element.parentNode]).createNodeAtIndex("span", index, { className:"basic_full_width_container textA marginTop0dot5em" }, str);
	},
	deleteRule:function(element) {
		lib([element]).css({ overflow:"hidden" });
		lib([element]).to({ style: { height:0 } }, { duration:250, oncompleteparams:{ element:element }, oncomplete:function(r) { lib([r.element]).remove(); } });
	},
	addAction:function(element, withDelete) {
		var memI=-1, index=lib([element]).getIndexOfNodes()[0], miniBoxes=lib(".minibox").targets;
		for (i=0; i<miniBoxes.length; i++) {
			if (parseInt(miniBoxes[i].id.substr(8), 10)>memI) {
				memI=parseInt(miniBoxes[i].id.substr(8), 10);
			}
		}
		var strRulesActions;
		if (!withDelete) {
			strRulesActions=lpslt.buildMiniBox((memI+1), admin.rulesActionsWithoutDelete, admin.rulesActionsWithoutDelete[0], "rulesActions");
		} else {
			strRulesActions=lpslt.buildMiniBox((memI+1), admin.rulesActionsWithDelete, admin.rulesActionsWithDelete[0], "rulesActions");
		}
		var str=strRulesActions+'&nbsp;<input id="optionalArgument_'+(memI+1)+'" class="optionalArgument miniInput" type="text" placeholder="'+locales["optionalArgument"]+'" />&nbsp;<button onclick="admin.deleteAction(this.parentNode); return false;"><b>－</b></button>';
		lib([element.parentNode]).createNodeAtIndex("span", index, { className:"basic_full_width_container textA marginTop0dot5em" }, str);
	},
	deleteAction:function(element) {
		lib([element]).css({ overflow:"hidden" });
		lib([element]).to({ style: { height:0 } }, { duration:250, oncompleteparams:{ element:element }, oncomplete:function(r) { lib([r.element]).remove(); } });
	},
	currentUsedImapId:-1,
	setCurrentUsedImapId:function(id, element, index, callback, doNotToggle) {
		admin.currentUsedImapId=id;
		lib("#box_"+index).find(".very_large_field").html(element.innerHTML);
		if (!(typeof(doNotToggle)!=="undefined" && doNotToggle)) {
			lpslt.toggleBox(index);
		}
		admin.getImapContent(id, callback);
	},
	getImapContent:function(id, callback) {
		admin.currentUsedImapId=id;
		var encrypted=lpslt.encryptForAjax({ id:id });
		var p, q, i, j, reg, ex, split, tmp=[], paths={};
		lib().ajax({ 
			url:"lpslt/php/test-server-list-mailboxes.php", 
			type:"POST", 
			data:{ encrypted:encrypted }, 
			onsuccess:function(data) {
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					var check=0, id, index;
					if (__.isObject(decrypted)) {
						for (p in decrypted) {
							if (p.substr(0,5)==="check") {
								if ("result" in decrypted[p] && "separator" in decrypted[p] && lib().isArray(decrypted[p].result)) {
									check++;
									id=p.substr(p.lastIndexOf("_")+1);
									reg=/\{[^\}]+\}(.+)$/;
									admin.separator=decrypted[p].separator;
									console.log(admin.separator);
									for (i=0; i<decrypted[p].result.length; i++) {
										ex=reg.exec(decrypted[p].result[i]);
										if (ex!==null && 1 in ex && ex[1].length>0) {
											if (ex[1].indexOf(admin.separator)!==-1) {
												split=ex[1].split(admin.separator);
											} else {
												split=[ex[1]];
											}
											tmp.push([split, ex[1]]);
										} else {
											tmp.push(null);
										}
									}
									for (i=0; i<tmp.length; i++) {
										j=-1;
										q=paths;
										if (tmp[i]!==null) {
											tmpPath="";
											while (++j<tmp[i][0].length) {
												tmpPath+=tmp[i][0][j]+admin.separator;
												if (/^[0-9]+$/.test(tmp[i][0][j])) {
													if (!("_integer_"+tmp[i][0][j] in q)) {
														q["_integer_"+tmp[i][0][j]]={ content:{} };
													}
													q=q["_integer_"+tmp[i][0][j]];
												} else {
													if (!(tmp[i][0][j] in q)) {
														q[tmp[i][0][j]]={ content:{} };
													}
													q=q[tmp[i][0][j]];
												}
												if (j===tmp[i][0].length-1) {
													q.path=tmp[i][1];
												} else {
													q.path=tmpPath.substr(0, tmpPath.length-1);
												}
												q=q.content;
											}
										}
									}
									lib("#last_messages").html('<span class="title textA">'+locales["waitingForImapFolderLoading"]+'</span>');
									if (lib().countProperties(paths)>0) {
										lib("#folders").html("");
										admin.drawFoldersRecursive(paths, lib("#folders").targets[0]);
									}
									if (typeof(data.callback)==="function") {
										data.callback();
									}
								} else if ("error" in decrypted[p]) {
									id=p.substr(p.lastIndexOf("_")+1);
									index=imap_data_obj.id.indexOf(id);
									if (/No such host as .* in /.test(decrypted[p].error)) {
										lpslt.error(locales["imapError"]+locales["noSuchHost"]+imap_data_obj.server[index]);
									} else if (/TLS\/SSL failure for .*: .* in /.test(decrypted[p].error)) {
										lpslt.error(locales["imapError"]+locales["ssltlsFailure"]+imap_data_obj.server[index]);
									} else if (/Certificate failure/.test(decrypted[p].error)) {
										lpslt.error(locales["imapError"]+locales["certificateFailure"]+imap_data_obj.server[index]);
									} else if (/SSL negotiation failed/.test(decrypted[p].error)) {
										lpslt.error(locales["imapError"]+locales["sslNegotiationFailed"]+imap_data_obj.server[index]);
									} else if (/\[AUTHENTICATIONFAILED\]/.test(decrypted[p].error) || /password wrong or not a valid user/.test(decrypted[p].error)) {
										lpslt.error(locales["imapError"]+locales["authFailed"]+imap_data_obj.identifier[index]+" @ "+imap_data_obj.server[index]);
									} else if (/Connection failed to .*,[0-9]+: Connection refused in /.test(decrypted[p].error)) {
										lpslt.error(locales["imapError"]+locales["connectionFailed"]+imap_data_obj.identifier[index]+" @ "+imap_data_obj.server[index]);
									} else {
										lpslt.error(locales["imapError"]+locales["unknownImapError"]+imap_data_obj.identifier[index]+" @ "+imap_data_obj.server[index]+locales["detail"]+decrypted[p].error);
									}
								}
							} else if (p==="error") {
								lpslt.error(locales["errorHasOccured"]+locales[decrypted[p]]);
							} 
						}
					} else {
						lpslt.error(locales["parsingError"]+locales["notObject"]);
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			}, 
			onfail:function(data) { 
				lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
			},
			addparams:{
				callback:callback
			}
		 });
	},
	drawFoldersRecursive:function(obj, target) {
		var contentTarget, s, span, o=[], p;
		for (p in obj) {
			o.push(p);
		}
		lib().quicksort(o, null, "natural", "ascending", true, true);
		for (var i=0; i<o.length; i++) {
			s=o[i].replace(/^_integer_/, "");
			span=lib([target]).createNode("span", { className:"folder textA" }, '<span class="horizontal_line"></span><span class="vertical_line"></span><button><span class="textA">'+s+'</span></button><span class="check_mark">&#10003;</span>').targets[0];
			data={};
			data["data-path"]=obj[o[i]].path;
			lib([span]).find("button").attr(data);
			lib([span]).find("button").on("click", admin.setFolderAndCheckMark);
			if ("content" in obj[o[i]] && lib().countProperties(obj[o[i]].content)>0) {
				lib([span]).createNode("button", { className:"folder_arrow" }, '');
				lib([span]).find("button.folder_arrow").on("click", admin.toggleFolding);
				contentTarget=lib([target]).createNode("span", { className:"folder_content textA" }, "").targets[0];
				admin.drawFoldersRecursive(obj[o[i]].content, contentTarget);
			}
		}		
	},
	currentFolder:"",
	toggleFoldingRecursive:function(path) {
		if (admin.separator.length>0 && path.indexOf(admin.separator)!==-1) {
			var explodedPath=path.split(admin.separator);
			tempPath=explodedPath[0];
			var element=lib("[data-path='"+tempPath+"']").targets[0].parentNode;
			admin.toggleFolding({ libTarget:lib([element]).find("button.folder_arrow").targets[0] });
			for (var i=1; i<explodedPath.length-1; i++) {
				tempPath+=admin.separator+explodedPath[i];
				element=lib("[data-path='"+tempPath+"']").targets[0].parentNode;
				admin.toggleFolding({ libTarget:lib([element]).find("button.folder_arrow").targets[0] });
			}
		}
	},
	toggleFolding:function(e, only0) {
		if ("preventDefault" in e) {
			e.preventDefault();
		}
		var button=e.libTarget;
		var content=button.parentNode.nextSibling;
		if (content.offsetHeight===0 && typeof(only0)==="undefined") {
			var nodes=lib(content).find(">span").targets;
			var ltwh=lib(nodes).ltwhRelativeTo(nodes[0].parentNode)[nodes.length-1];
			lib([content]).to({ style: { height:((ltwh.top+ltwh.height)/parseFloat(lib([content]).css("font-size", "px")[0]))+"em" } }, { duration:250, oncompleteparams:{ content:content }, oncomplete:function(r) { lib([r.content]).css({ height:"auto" }); } });
			button.style.backgroundImage="url(lpslt/media/arrow_down_black.png)";
		} else {
			lib([content]).to({ style: { height:"0em" } }, { duration:250 });
			button.style.backgroundImage="url(lpslt/media/arrow_right_black.png)";
			if (18 in lpslt.keys && lpslt.keys[18] && typeof(only0)==="undefined") {
				var elements=lib([content]).find("button.folder_arrow").targets;
				for (var p in elements) {
					admin.toggleFolding({ libTarget:elements[p] }, true);
				}
			}
		}
	},
	getMessagesOffset:0,
	setFolderAndCheckMark:function(e) {
		if ("preventDefault" in e) {
			e.preventDefault();
		}
		var span=e.libTarget.parentNode;
		if (!lib([span]).find(".check_mark").hasClass("checked")[0]) {
			admin.getMessagesOffset=0;
			if (lib(".check_mark.checked_mark").targets.length>0) {
				lib(".check_mark.checked_mark").to({ style: { opacity:0 } }, { duration:333 });
				lib(".check_mark.checked_mark").removeClass("checked_mark");
			}
			lib([span]).find(".check_mark").to({ style: { opacity:1 } }, { duration:333 });
			lib([span]).find(".check_mark").addClass("checked_mark");
			admin.currentFolder=lib([e.libTarget]).attr("data-path")[0];
			var encrypted=lpslt.encryptForAjax({ id:admin.currentUsedImapId, folder:admin.currentFolder, offset:admin.getMessagesOffset });
			lib().ajax({
				type:"POST",
				url:"lpslt/php/get-last-messages.php",
				data:{ encrypted:encrypted },
				onsuccess:function(data) {
					var i;
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						lib("#last_messages").html("");
						if ("result" in decrypted && decrypted.result.length>0) {
							for (i=0; i<decrypted.result.length; i++) {
								lib("#last_messages").createNode("div", { className:"message" }, '<span class="message_from textA"><span>'+locales["from"]+" : "+decrypted.result[i].from+'</span></span><span class="message_title textA"><span>'+locales["object"]+" : "+decrypted.result[i].subject+'</span></span><span class="message_content textA"><span>'+decrypted.result[i].body.replace(/\n+/, "<br />")+'</span></span><button class="full_message" onclick="admin.seeFullMessage(\''+decrypted.result[i].uid+'\'); return false;">'+locales["seeFullMessage"]+'</button>');
							}
							lib("#last_messages").createNode("button", { onclick:"admin.seeMoreMessages(); return false;", className:"seeMore textA" }, locales["seeMore"]);
						} else if ("result" in decrypted && decrypted.result.length===0) {
							lib("#last_messages").createNode("div", { className:"textA" }, locales["noMessage"]);
						} else if ("error" in decrypted) {
							lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				},
				onfail:function(data) {
					if (data.d.length>0) {
						lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
					} else {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					}
				}
			});
		}
	},
	seeMoreMessages:function() {
		admin.getMessagesOffset+=10;
		var encrypted=lpslt.encryptForAjax({ id:admin.currentUsedImapId, folder:admin.currentFolder, offset:admin.getMessagesOffset });
		lib().ajax({
			type:"POST",
			url:"lpslt/php/get-last-messages.php",
			data:{ encrypted:encrypted },
			onsuccess:function(data) {
				var i;
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					if ("result" in decrypted && decrypted.result.length>0) {
						for (i=0; i<decrypted.result.length; i++) {
							lib("#last_messages").createNodeAtIndex("div", lib(".seeMore").getIndexOfNodes()[0], { className:"message" }, '<span class="message_from textA"><span>'+locales["from"]+" : "+decrypted.result[i].from+'</span></span><span class="message_title textA"><span>'+locales["object"]+" : "+decrypted.result[i].subject+'</span></span><span class="message_content textA"><span>'+decrypted.result[i].body.replace(/\n+/, "<br />")+'</span></span><button class="full_message" onclick="admin.seeFullMessage(\''+decrypted.result[i].uid+'\'); return false;">'+locales["seeFullMessage"]+'</button>');
						}
					} else if ("result" in decrypted && decrypted.result.length===0) {
						lib("#last_messages").createNodeAtIndex("div", lib(".seeMore").getIndexOfNodes()[0], {}, locales["noAdditionalMessage"]);
					} else if ("error" in decrypted) {
						lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			},
			onfail:function(data) {
				if (data.d.length>0) {
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			}
		});
	},
	seeFullMessageInit:function(uid, folder, imapId) {
		var encrypted=lpslt.encryptForAjax({ id:imapId, folder:folder, uid:uid });
		admin.seeFullMessageGeneric(encrypted);
	},
	seeFullMessage:function(uid) {
		var encrypted=lpslt.encryptForAjax({ id:admin.currentUsedImapId, folder:admin.currentFolder, uid:uid });
		admin.seeFullMessageGeneric(encrypted);
	},
	seeFullMessageGeneric:function(encrypted) {
		lib().ajax({
			type:"POST",
			url:"lpslt/php/get-full-message.php",
			data:{ encrypted:encrypted },
			onsuccess:function(data) {
				var i;
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					if ("result" in decrypted && __.countProperties(decrypted.result)>0) {
						var iframe=document.createElement('iframe');
						iframe.style.width="100%";
						iframe.style.height="80vh";
						iframe.style.backgroundColor="white";
						var html=decrypted.result.body;
						if (!/<html>/.test(html)) {
							html=html.replace(/\v/, "<br />");
						}
						if (/<script/.test(html)) {
							html=html.replace(/<script(?:.*)>(?:.*)<\/script>/, "");
						}
						iframe.src='data:text/html;charset=utf-8,'+encodeURIComponent(html);
						var string='<div style="margin:2em;"><span style="color:#fff; font-weight:bold;">date&nbsp;:&nbsp;'+decrypted.result.date+'</span><br /><span style="color:#fff; font-weight:bold;">'+locales["from"]+'&nbsp;:&nbsp;'+decrypted.result.from+'</span><br /><span style="color:#fff; font-weight:normal;">'+locales["object"]+'&nbsp;:&nbsp;'+decrypted.result.subject+'</span><br /></div>';
						lpslt.overlay(string, function() { lib("#lpslt_overlay_content>div").targets[0].appendChild(iframe); });
					} else if ("error" in decrypted) {
						lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			},
			onfail:function(data) {
				if (data.d.length>0) {
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			}
		});
	},
	addMonitoring:function() {
		var i, index;
		var identificationRulesAssociation=lib("#identificationRules .rulesAssociations .choice").targets[0].innerHTML;
		var identificationRulesVariables=lib("#identificationRules .rulesVariables .choice").html();
		var identificationRulesOperators=lib("#identificationRules .rulesOperators .choice").html();
		var identificationRulesValues=lib("#identificationRules .rulesValues").value();
		var identificationRulesActions=lib("#identificationRules .rulesActions .choice").html();
		var identificationRulesActionsElements=lib("#identificationRules .rulesActions .choice").targets;
		var identificationRulesActionsOptionalArguments=[];
		for (i=0; i<identificationRulesValues.length; i++) {
			if (identificationRulesValues[i]==="") {
				lpslt.error(locales["errorHasOccured"]+locales["identificationRulesValueNotSet"]);
				return false;
			}
		}
		for (i=0; i<identificationRulesActionsElements.length; i++) {
			if ([locales["deleteMessage"], locales["markAsRead"]].indexOf(identificationRulesActionsElements[i].innerHTML)===-1) {
				index=identificationRulesActionsElements[i].parentNode.parentNode.id.replace(/[^0-9]+/, "");
				identificationRulesActionsOptionalArguments[i]=lib("#optionalArgument_"+index).targets[0].value;
				if (identificationRulesActionsOptionalArguments[i]==="") {
					lpslt.error(locales["errorHasOccured"]+locales["identificationRulesActionsOptionalArgumentNotSet"]);
					return false;
				}
			} else {
				identificationRulesActionsOptionalArguments[i]="";
			}
		}
		var monitoringRulesAssociation=lib("#monitoringRules .rulesAssociations .choice").targets[0].innerHTML;
		var monitoringRulesVariables=lib("#monitoringRules .rulesVariables .choice").html();
		var monitoringRulesOperators=lib("#monitoringRules .rulesOperators .choice").html();
		var monitoringRulesValues=lib("#monitoringRules .rulesValues").value();
		var monitoringRulesActions=lib("#monitoringRules .rulesActions .choice").html();
		var monitoringRulesActionsElements=lib("#monitoringRules .rulesActions .choice").targets;
		var monitoringRulesActionsOptionalArguments=[];
		var monitoringStatusIfMatched=lib("#monitoringRules .monitoringStatus .choice").html()[0];
		for (i=0; i<monitoringRulesValues.length; i++) {
			if (monitoringRulesValues[i]==="") {
				lpslt.error(locales["errorHasOccured"]+locales["monitoringRulesValueNotSet"]);
				return false;
			}
		}
		for (i=0; i<monitoringRulesActionsElements.length; i++) {
			if ([locales["deleteMessage"], locales["markAsRead"]].indexOf(monitoringRulesActionsElements[i].innerHTML)===-1) {
				index=monitoringRulesActionsElements[i].parentNode.parentNode.id.replace(/[^0-9]+/, "");
				monitoringRulesActionsOptionalArguments[i]=lib("#optionalArgument_"+index).targets[0].value;
				if (monitoringRulesActionsOptionalArguments[i]==="") {
					lpslt.error(locales["errorHasOccured"]+locales["monitoringRulesActionsOptionalArgumentNotSet"]);
					return false;
				}
			} else {
				monitoringRulesActionsOptionalArguments[i]="";
			}
		}
		var cleaningRulesTimeout=lib("#cleaningRules #timeCleaning").targets[0].value;
		var cleaningRulesActions=lib("#cleaningRules .rulesActions .choice").html();
		var cleaningRulesActionsElements=lib("#cleaningRules .rulesActions .choice").targets;
		var cleaningRulesActionsOptionalArguments=[];
		for (i=0; i<cleaningRulesActionsElements.length; i++) {
			if ([locales["deleteMessage"], locales["markAsRead"]].indexOf(cleaningRulesActionsElements[i].innerHTML)===-1) {
				index=cleaningRulesActionsElements[i].parentNode.parentNode.id.replace(/[^0-9]+/, "");
				cleaningRulesActionsOptionalArguments[i]=lib("#optionalArgument_"+index).targets[0].value;
				if (cleaningRulesActionsOptionalArguments[i]==="") {
					lpslt.error(locales["errorHasOccured"]+locales["cleaningRulesActionsOptionalArgumentNotSet"]);
					return false;
				}
			} else {
				cleaningRulesActionsOptionalArguments[i]="";
			}
		}
		var identificationRulesItems=[];
		for (i=0; i<identificationRulesVariables.length; i++) {
			identificationRulesItems.push({ variable:lpslt.getIndexInLocales(identificationRulesVariables[i]), operator:lpslt.getIndexInLocales(identificationRulesOperators[i]), value:identificationRulesValues[i] });
		}
		var identificationRules=lib().json.stringify({ association:lpslt.getIndexInLocales(identificationRulesAssociation), items:identificationRulesItems });
		var identificationActionsItems=[];
		for (i=0; i<identificationRulesActions.length; i++) {
			identificationActionsItems.push({ action:lpslt.getIndexInLocales(identificationRulesActions[i]), argument:identificationRulesActionsOptionalArguments[i] });
		}
		var identificationActions=lib().json.stringify(identificationActionsItems);
		var monitoringRulesItems=[];
		for (i=0; i<monitoringRulesVariables.length; i++) {
			monitoringRulesItems.push({ variable:lpslt.getIndexInLocales(monitoringRulesVariables[i]), operator:lpslt.getIndexInLocales(monitoringRulesOperators[i]), value:monitoringRulesValues[i] });
		}
		var monitoringRules=lib().json.stringify({ association:lpslt.getIndexInLocales(monitoringRulesAssociation), items:monitoringRulesItems });
		var monitoringActionsItems=[];
		for (i=0; i<monitoringRulesActions.length; i++) {
			monitoringActionsItems.push({ action:lpslt.getIndexInLocales(monitoringRulesActions[i]), argument:monitoringRulesActionsOptionalArguments[i] });
		}
		var monitoringActions=lib().json.stringify(monitoringActionsItems);
		var cleaningActionsItems=[];
		for (i=0; i<cleaningRulesActions.length; i++) {
			cleaningActionsItems.push({ action:lpslt.getIndexInLocales(cleaningRulesActions[i]), argument:cleaningRulesActionsOptionalArguments[i] });
		}
		var cleaningActions=lib().json.stringify(cleaningActionsItems);
		if (admin.currentCustomerId===-1) {
			lpslt.error(locales["errorHasOccured"]+locales["customerNotSelected"]);
		} else if (isNaN(admin.currentCustomerId)) {
			lpslt.error(locales["errorHasOccured"]+locales["customerNotSaved"]);
		} else if (admin.currentUsedImapId===-1) {
			lpslt.error(locales["errorHasOccured"]+locales["imapAccountNotSelected"]);
		} else if (admin.currentFolder==="") {
			lpslt.error(locales["errorHasOccured"]+locales["folderNotSelected"]);
		} else if (lib("#service_or_machine_name").targets[0].value.replace(/\s/,"")==="") {
			lpslt.error(locales["errorHasOccured"]+locales["serviceNameNotSet"]);
		} else if (lib("#periodicity_hours").targets[0].value.toString().replace(/\s/,"")==="" || !/^[0-9]+$/.test(lib("#periodicity_hours").targets[0].value.toString()) || parseInt(lib("#periodicity_hours").targets[0].value,10)<1) {
			lpslt.error(locales["errorHasOccured"]+locales["periodicityShouldBeSetAndSuperiorTo0"]);
		} else if (lib("#fail_timeout_hours").targets[0].value.toString().replace(/\s/,"")==="" || !/^[0-9]+$/.test(lib("#fail_timeout_hours").targets[0].value.toString()) || parseInt(lib("#fail_timeout_hours").targets[0].value,10)<1) {
			lpslt.error(locales["errorHasOccured"]+locales["failTimeoutShouldBeSetAndSuperiorTo0"]);
		} else {
			var encrypted=lpslt.encryptForAjax({ customerId:admin.currentCustomerId, imapId:admin.currentUsedImapId, imapFolder:admin.currentFolder, serviceOrMachineName:lib("#service_or_machine_name").targets[0].value.replace(/^\s+/,"").replace(/\s+$/,""), identification_rules:identificationRules, let_status_green_if_not_identified:lpslt.checkboxStates['letStatusGreenIfNotIdentified'], identification_actions:identificationActions, monitoring_rules:monitoringRules, monitoring_status_if_matched:monitoringStatusIfMatched===locales["success"]?1:0, monitoring_actions:monitoringActions, cleaning_timeout_hours:cleaningRulesTimeout, cleaning_actions:cleaningActions, periodicityHours:lib("#periodicity_hours").targets[0].value.toString().replace(/^\s+/,"").replace(/\s+$/,""), failTimeout:lib("#fail_timeout_hours").targets[0].value.toString().replace(/^\s+/,"").replace(/\s+$/,""), active:lib("#current_monitoring_active .dot").css("opacity")[0] });
			lib().ajax({
				type:"POST",
				url:"lpslt/php/insert-monitoring.php",
				data:{ encrypted:encrypted },
				onsuccess:function(data) {
					var i;
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						if ("message" in decrypted && decrypted.message==="ok") {
							lpslt.message.temporary(locales['mysqlInsertSucceeded'], "green", null);
							lpslt.ajax(lpslt.currentPage, true, "replace");
						} else if ("error" in decrypted) {
							lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				},
				onfail:function(data) {
					if (data.d.length>0) {
						lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
					} else {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					}
				}
			});
		}
	},
	updateMonitoring:function() {
		var i, index;
		var identificationRulesAssociation=lib("#identificationRules .rulesAssociations .choice").targets[0].innerHTML;
		var identificationRulesVariables=lib("#identificationRules .rulesVariables .choice").html();
		var identificationRulesOperators=lib("#identificationRules .rulesOperators .choice").html();
		var identificationRulesValues=lib("#identificationRules .rulesValues").value();
		var identificationRulesActions=lib("#identificationRules .rulesActions .choice").html();
		var identificationRulesActionsElements=lib("#identificationRules .rulesActions .choice").targets;
		var identificationRulesActionsOptionalArguments=[];
		for (i=0; i<identificationRulesValues.length; i++) {
			if (identificationRulesValues[i]==="") {
				lpslt.error(locales["errorHasOccured"]+locales["identificationRulesValueNotSet"]);
				return false;
			}
		}
		for (i=0; i<identificationRulesActionsElements.length; i++) {
			if ([locales["deleteMessage"], locales["markAsRead"]].indexOf(identificationRulesActionsElements[i].innerHTML)===-1) {
				index=identificationRulesActionsElements[i].parentNode.parentNode.id.replace(/[^0-9]+/, "");
				identificationRulesActionsOptionalArguments[i]=lib("#optionalArgument_"+index).targets[0].value;
				if (identificationRulesActionsOptionalArguments[i]==="") {
					lpslt.error(locales["errorHasOccured"]+locales["identificationRulesActionsOptionalArgumentNotSet"]);
					return false;
				}
			} else {
				identificationRulesActionsOptionalArguments[i]="";
			}
		}
		var monitoringRulesAssociation=lib("#monitoringRules .rulesAssociations .choice").targets[0].innerHTML;
		var monitoringRulesVariables=lib("#monitoringRules .rulesVariables .choice").html();
		var monitoringRulesOperators=lib("#monitoringRules .rulesOperators .choice").html();
		var monitoringRulesValues=lib("#monitoringRules .rulesValues").value();
		var monitoringRulesActions=lib("#monitoringRules .rulesActions .choice").html();
		var monitoringRulesActionsElements=lib("#monitoringRules .rulesActions .choice").targets;
		var monitoringRulesActionsOptionalArguments=[];
		var monitoringStatusIfMatched=lib("#monitoringRules .monitoringStatus .choice").html()[0];
		for (i=0; i<monitoringRulesValues.length; i++) {
			if (monitoringRulesValues[i]==="") {
				lpslt.error(locales["errorHasOccured"]+locales["monitoringRulesValueNotSet"]);
				return false;
			}
		}
		for (i=0; i<monitoringRulesActionsElements.length; i++) {
			if ([locales["deleteMessage"], locales["markAsRead"]].indexOf(monitoringRulesActionsElements[i].innerHTML)===-1) {
				index=monitoringRulesActionsElements[i].parentNode.parentNode.id.replace(/[^0-9]+/, "");
				monitoringRulesActionsOptionalArguments[i]=lib("#optionalArgument_"+index).targets[0].value;
				if (monitoringRulesActionsOptionalArguments[i]==="") {
					lpslt.error(locales["errorHasOccured"]+locales["monitoringRulesActionsOptionalArgumentNotSet"]);
					return false;
				}
			} else {
				monitoringRulesActionsOptionalArguments[i]="";
			}
		}
		var cleaningRulesTimeout=lib("#cleaningRules #timeCleaning").targets[0].value;
		var cleaningRulesActions=lib("#cleaningRules .rulesActions .choice").html();
		var cleaningRulesActionsElements=lib("#cleaningRules .rulesActions .choice").targets;
		var cleaningRulesActionsOptionalArguments=[];
		for (i=0; i<cleaningRulesActionsElements.length; i++) {
			if ([locales["deleteMessage"], locales["markAsRead"]].indexOf(cleaningRulesActionsElements[i].innerHTML)===-1) {
				index=cleaningRulesActionsElements[i].parentNode.parentNode.id.replace(/[^0-9]+/, "");
				cleaningRulesActionsOptionalArguments[i]=lib("#optionalArgument_"+index).targets[0].value;
				if (cleaningRulesActionsOptionalArguments[i]==="") {
					lpslt.error(locales["errorHasOccured"]+locales["cleaningRulesActionsOptionalArgumentNotSet"]);
					return false;
				}
			} else {
				cleaningRulesActionsOptionalArguments[i]="";
			}
		}
		var identificationRulesItems=[];
		for (i=0; i<identificationRulesVariables.length; i++) {
			identificationRulesItems.push({ variable:lpslt.getIndexInLocales(identificationRulesVariables[i]), operator:lpslt.getIndexInLocales(identificationRulesOperators[i]), value:identificationRulesValues[i] });
		}
		var identificationRules=lib().json.stringify({ association:lpslt.getIndexInLocales(identificationRulesAssociation), items:identificationRulesItems });
		var identificationActionsItems=[];
		for (i=0; i<identificationRulesActions.length; i++) {
			identificationActionsItems.push({ action:lpslt.getIndexInLocales(identificationRulesActions[i]), argument:identificationRulesActionsOptionalArguments[i] });
		}
		var identificationActions=lib().json.stringify(identificationActionsItems);
		var monitoringRulesItems=[];
		for (i=0; i<monitoringRulesVariables.length; i++) {
			monitoringRulesItems.push({ variable:lpslt.getIndexInLocales(monitoringRulesVariables[i]), operator:lpslt.getIndexInLocales(monitoringRulesOperators[i]), value:monitoringRulesValues[i] });
		}
		var monitoringRules=lib().json.stringify({ association:lpslt.getIndexInLocales(monitoringRulesAssociation), items:monitoringRulesItems });
		var monitoringActionsItems=[];
		for (i=0; i<monitoringRulesActions.length; i++) {
			monitoringActionsItems.push({ action:lpslt.getIndexInLocales(monitoringRulesActions[i]), argument:monitoringRulesActionsOptionalArguments[i] });
		}
		var monitoringActions=lib().json.stringify(monitoringActionsItems);
		var cleaningActionsItems=[];
		for (i=0; i<cleaningRulesActions.length; i++) {
			cleaningActionsItems.push({ action:lpslt.getIndexInLocales(cleaningRulesActions[i]), argument:cleaningRulesActionsOptionalArguments[i] });
		}
		var cleaningActions=lib().json.stringify(cleaningActionsItems);
		if (admin.currentMonitoringId===-1) {
			lpslt.error(locales["errorHasOccured"]+locales["monitoringNotFound"]);
		} else if (admin.currentCustomerId===-1) {
			lpslt.error(locales["errorHasOccured"]+locales["customerNotSelected"]);
		} else if (admin.currentUsedImapId===-1) {
			lpslt.error(locales["errorHasOccured"]+locales["imapAccountNotSelected"]);
		} else if (admin.currentFolder==="") {
			lpslt.error(locales["errorHasOccured"]+locales["folderNotSelected"]);
		} else if (lib("#service_or_machine_name").targets[0].value.replace(/\s/,"")==="") {
			lpslt.error(locales["errorHasOccured"]+locales["serviceNameNotSet"]);
		} else if (lib("#periodicity_hours").targets[0].value.replace(/\s/,"")==="" || !/^[0-9]+$/.test(lib("#periodicity_hours").targets[0].value.toString()) || parseInt(lib("#periodicity_hours").targets[0].value,10)<1) {
			lpslt.error(locales["errorHasOccured"]+locales["periodicityShouldBeSetAndSuperiorTo0"]);
		} else if (lib("#fail_timeout_hours").targets[0].value.toString().replace(/\s/,"")==="" || !/^[0-9]+$/.test(lib("#fail_timeout_hours").targets[0].value.toString()) || parseInt(lib("#fail_timeout_hours").targets[0].value,10)<1) {
			lpslt.error(locales["errorHasOccured"]+locales["failTimeoutShouldBeSetAndSuperiorTo0"]);
		} else {
			var encrypted=lpslt.encryptForAjax({ id:admin.currentMonitoringId, customerId:admin.currentCustomerId, imapId:admin.currentUsedImapId, imapFolder:admin.currentFolder, serviceOrMachineName:lib("#service_or_machine_name").targets[0].value.replace(/^\s+/,"").replace(/\s+$/,""), identification_rules:identificationRules, let_status_green_if_not_identified:lpslt.checkboxStates['letStatusGreenIfNotIdentified'], identification_actions:identificationActions, monitoring_rules:monitoringRules, monitoring_status_if_matched:monitoringStatusIfMatched===locales["success"]?1:0, monitoring_actions:monitoringActions, cleaning_timeout_hours:cleaningRulesTimeout, cleaning_actions:cleaningActions, periodicityHours:lib("#periodicity_hours").targets[0].value.toString().replace(/^\s+/,"").replace(/\s+$/,""), failTimeout:lib("#fail_timeout_hours").targets[0].value.toString().replace(/^\s+/,"").replace(/\s+$/,""), active:lib("#current_monitoring_active .dot").css("opacity")[0] });
			lib().ajax({
				type:"POST",
				url:"lpslt/php/update-monitoring.php",
				data:{ encrypted:encrypted },
				onsuccess:function(data) {
					if (data.d!=="" && data.d!=="noAuth") {
						var decrypted=lpslt.decryptAjaxResponse(data.d);
						if ("message" in decrypted && decrypted.message==="ok") {
							lpslt.message.temporary(locales['mysqlUpdateSucceeded'], "green", null);
							lpslt.ajax(lpslt.currentPage, true, "replace");
						} else if ("error" in decrypted) {
							lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
						}
					} else if (data.d==="") {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					} else if (data.d==="noAuth") {
						lpslt.error(locales["authNeeded"]);
						log.askForRelog();
					}
				},
				onfail:function(data) {
					if (data.d.length>0) {
						lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
					} else {
						lpslt.error(locales["parsingError"]+locales["emptyString"]);
					}
				}
			});
		}
	},
	setReportLocale:function(locale) {
		if (locale!==lpslt.reportLocale) {
			lib("#report_locale_"+lpslt.reportLocale).css({ border:"4px solid transparent", marginTop:"-4px" });
			lib("#report_locale_"+locale).css({ border:"4px solid white", marginTop:"-4px" });
			lpslt.reportLocale=locale;
		}
	},
	getTokenAndLaunchMonitoring:function() {
		var encrypted=lpslt.encryptForAjax({ getToken:"true" });
		lib().ajax({
			type:"POST",
			url:"lpslt/php/getToken.php",
			data:{ encrypted:encrypted },
			onsuccess:function(data) {
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					if ("token" in decrypted && decrypted.token.length>0) {
						var str='<div style="position:relative; width:100%; height:100vh; line-height:100vh; text-align:center;"><span class="progress"><span class="progressBar"></span><span class="progressText">0%</span></span></div>';
						lpslt.overlay(str, function() { admin.launchMonitoring(decrypted.token, 0, null, null); });
					} else if ("error" in decrypted) {
						lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			},
			onfail:function(data) {
				if (data.d.length>0) {
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			}
		});
	},
	mem:"",
	launchMonitoring:function(token, start, mem_imap_account_id_plus_path, statuses) {
		var obj={ token:token, start:start };
		if (typeof(mem_imap_account_id_plus_path)!=="undefined" && typeof(statuses)!=="undefined") {
			obj.mem_imap_account_id_plus_path=mem_imap_account_id_plus_path;
			obj.statuses=statuses;
		}
		var encrypted=lpslt.encryptForAjax(obj);
		lib().ajax({
			type:"POST",
			url:"lpslt/php/cron.php",
			data:{ encrypted:encrypted },
			onpartial:function(data) {
				if (data.d!=="") {
					lpslt.last=data.d.replace(lpslt.mem, "");
					var split=lpslt.last.split("|");
					split=split[split.length-2];
					if (split!=="" && /time elapsed:([0-9]+)-/.test(split) && /\{.+\}/.test(split)) {
						lpslt.mem=data.d;
						var exec=/time elapsed:([0-9]+)-/gm.exec(split);
						split=split.replace(exec[0], "");
						var time=parseInt(exec[1], 10);
						exec=/\{.+\}/gm.exec(split);
						var json=lib().json.parse(exec[0]);
						lib(".progressBar").to({ style: { width:((time/15+parseInt(json.start, 10))/parseInt(json.total, 10)*100)+"%" }}, { duration: 500 });
						lib(".progressText").html(Math.round((time/15+parseInt(json.start, 10))/parseInt(json.total, 10)*100)+"%");
					}
				}
			},
			onsuccess:function(data) {
				var split=data.d.split("|");
				split=split[split.length-1];
				if (split!=="" && /\{.+\}$/.test(split)) {
					var json=lib().json.parse(split);
					if ("start" in json && "total" in json) {
						lib(".progressBar").to({ style: { width:(parseInt(json.start, 10)/parseInt(json.total, 10)*100)+"%" }}, { duration: 500 });
						lib(".progressText").html(Math.round(parseInt(json.start, 10)/parseInt(json.total, 10)*100)+"%");
					}
					if ("mem_imap_account_id_plus_path" in json && "statuses" in json) {
						admin.launchMonitoring(data.token, json.start, json.mem_imap_account_id_plus_path, json.statuses);
					}
				} else if (split!=="" && split!=="badToken" && split.indexOf("done")!==-1) {
					lib(".progressBar").to({ style: { width:"100%" }}, { duration: 500 });
					lib(".progressText").html("100%");
					lpslt.message.temporary(locales['taskExecutedCorrectly'], "green", null);
					setTimeout(function() { lpslt.ajax(lpslt.locale==="en"?"home":"accueil", true); }, 1500);
				} else if (split!=="" && split!=="badToken" && split.indexOf("done")===-1) {
					lpslt.error(locales["taskNotExecutedCorrectly"]);
				} else if (split==="") {
					lpslt.error(locales["errorHasOccured"]+locales["emptyString"]);
				} else if (split==="badToken") {
					lpslt.error(locales["badToken"]);
				}
			},
			onfail:function(data) {
				if (data.d.length>0) {
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			},
			addparams:{
				token:token
			}
		});
	},
	cleaningCount:0,
	getTokenAndLaunchCleaning:function() {
		var encrypted=lpslt.encryptForAjax({ getToken:"true" });
		lib().ajax({
			type:"POST",
			url:"lpslt/php/getToken.php",
			data:{ encrypted:encrypted },
			onsuccess:function(data) {
				if (data.d!=="" && data.d!=="noAuth") {
					var decrypted=lpslt.decryptAjaxResponse(data.d);
					if ("token" in decrypted && decrypted.token.length>0) {
						var str='<div style="position:relative; width:100%; height:100vh; line-height:100vh; text-align:center;"><span class="progress"><span class="progressBar"></span><span class="progressText">0%</span><span class="numberTreated">'+("0 "+locales["mailsTreated"])+'</span></span></div>';
						lpslt.overlay(str, function() { admin.launchCleaning(decrypted.token, 0, null); });
						admin.cleaningCount=0;
					} else if ("error" in decrypted) {
						lpslt.error(locales["errorHasOccured"]+(decrypted.error in locales?locales[decrypted.error]:decrypted.error));
					}
				} else if (data.d==="") {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				} else if (data.d==="noAuth") {
					lpslt.error(locales["authNeeded"]);
					log.askForRelog();
				}
			},
			onfail:function(data) {
				if (data.d.length>0) {
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			}
		});
	},
	launchCleaning:function(token, start, mem_imap_account_id_plus_path) {
		var encrypted=lpslt.encryptForAjax({ token:token, start:start });
		lib().ajax({
			type:"POST",
			url:"lpslt/php/cron-cleaning.php",
			data:{ encrypted:encrypted },
			onpartial:function(data) {
				if (data.d!=="") {
					lpslt.last=data.d.replace(lpslt.mem, "");
					var split=lpslt.last.split("|");
					split=split[split.length-2];
					if (split!=="" && /time elapsed:([0-9]+)-/.test(split) && /\{.+\}/.test(split)) {
						lpslt.mem=data.d;
						var exec=/time elapsed:([0-9]+)-/gm.exec(split);
						split=split.replace(exec[0], "");
						var time=parseInt(exec[1], 10);
						exec=/\{.+\}/gm.exec(split);
						var json=lib().json.parse(exec[0]);
						lib(".progressBar").to({ style: { width:((time/15+parseInt(json.start, 10))/parseInt(json.total, 10)*100)+"%" }}, { duration: 500 });
						lib(".progressText").html(Math.round((time/15+parseInt(json.start, 10))/parseInt(json.total, 10)*100)+"%");
					}
				}
			},
			onsuccess:function(data) {
				var split=lpslt.last.split("|");
				split=split[split.length-1];
				if (split!=="" && /^\{.+\}$/.test(split)) {
					var json=lib().json.parse(split);
					if ("start" in json && "total" in json && "treated" in json) {
						lib(".progressBar").to({ style: { width:(parseInt(json.start, 10)/parseInt(json.total, 10)*100)+"%" }}, { duration: 500 });
						lib(".progressText").html(Math.round(parseInt(json.start, 10)/parseInt(json.total, 10)*100)+"%");
						admin.cleaningCount+=parseInt(json.treated, 10);
						lib(".numberTreated").html(admin.cleaningCount+" "+locales["mailsTreated"]);
					}
					if ("mem_imap_account_id_plus_path" in json) {
						admin.launchCleaning(data.token, json.start, json.mem_imap_account_id_plus_path);
					}
				} else if (split!=="" && split!=="badToken" && split.indexOf("done")!==-1) {
					lib(".progressBar").to({ style: { width:"100%" }}, { duration: 500 });
					lib(".progressText").html("100%");
					lpslt.message.temporary(locales['taskExecutedCorrectly'], "green", null);
					lpslt.ajax(lpslt.locale==="en"?"home":"accueil", true);
				} else if (split!=="" && split!=="badToken" && split.indexOf("done")===-1) {
					lpslt.error(locales["taskNotExecutedCorrectly"]);
				} else if (split==="") {
					lpslt.error(locales["errorHasOccured"]+locales["emptyString"]);
				} else if (split==="badToken") {
					lpslt.error(locales["badToken"]);
				}
			},
			onfail:function(data) {
				if (data.d.length>0) {
					lpslt.error(locales["errorHasOccured"]+"<b>"+data.d+"</b>", null);
				} else {
					lpslt.error(locales["parsingError"]+locales["emptyString"]);
				}
			}
		});
	}
};