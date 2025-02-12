<?php
if (isset($_SERVER['REQUEST_URI']) && preg_match('/index\.php/', $_SERVER['REQUEST_URI'])) {
	header('Location: ./');
}
if (file_exists(__DIR__.'/lpslt/php/session.php')) {
	include_once(__DIR__.'/lpslt/php/session.php');
}
if (file_exists(__DIR__.'/lpslt/php/utils.php')) {
    include_once(__DIR__.'/lpslt/php/utils.php');
}
if (file_exists(__DIR__.'/lpslt/php/mysql_utils.php')) {
	include_once(__DIR__.'/lpslt/php/mysql_utils.php');
}
$f=__DIR__.'/lpslt/protected/main.php';
$msg=false;
$failLoad='<span style="font-family:Arial; font-size:12px; color:#000;">We\'re sorry this website could not be loaded.<br />Nous sommes désolés, ce site n\'a pu être chargé.<br /></span>';
$_SESSION['baseDir']=__DIR__;
$mysql=new mysqlUtils();
if (isset($_GET['page'])) {
	$page=preg_replace('/^\//', "", $_GET['page']);
	if (isset($page)) {
		if (preg_match('/--/', $page)) {
			$exp=explode("--", $page);
			$_SESSION['slug']=$exp[0];
			array_splice($exp, 0, 1);
			$_SESSION['add']=implode("--", $exp);
		} else {
			$_SESSION['slug']=$page;
			$_SESSION['add']="";
		}
	}
}
if (empty($_SESSION['slug'])) {
	$_SESSION['slug']="index";
}
$reg='/^[a-z0-9-]+$/i';
if (!preg_match($reg, $_SESSION['slug']) || (!empty($_SESSION['add']) && !preg_match($reg, $_SESSION['add']))) {
	$page=$mysql::selectAllPlusString("pages", ' where active=1 and slug="401"', null);
	if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
		$_SESSION['direct']=true;
		$_SESSION['page_id']=$page["id"][0];
		$_SESSION['page_file']=$page["file"][0];
		$_SESSION['currentPageTitle']=$page["title"][0];
	}
} else {
	$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context=0 and slug="'.$_SESSION['slug'].'"', null);
	if (array_key_exists("id", $page) && count($page["id"])>=1) {
		if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
			$_SESSION['direct']=true;
			$_SESSION['page_id']=$page["id"][0];
			$_SESSION['page_file']=$page["file"][0];
			$_SESSION['currentPageTitle']=$page["title"][0];
		} else {
			$page=$mysql::selectAllPlusString("pages", ' where active=1 and slug="404"', null);
			if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
				$_SESSION['direct']=true;
				$_SESSION['page_id']=$page["id"][0];
				$_SESSION['page_file']=$page["file"][0];
				$_SESSION['currentPageTitle']=$page["title"][0];
			}
		}
	} else if (!(isset($_SESSION['auth']) && $_SESSION['auth'])) {
		$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context=1 and slug="'.$_SESSION['slug'].'"', null);
		if (array_key_exists("id", $page) && count($page["id"])>=1) {
			$page=$mysql::selectAllPlusString("pages", ' where active=1 and slug="401"', null);
			if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
				$_SESSION['direct']=true;
				$_SESSION['page_id']=$page["id"][0];
				$_SESSION['page_file']=$page["file"][0];
				$_SESSION['currentPageTitle']=$page["title"][0];
			}
		} else {
			$page=$mysql::selectAllPlusString("pages", ' where active=1 and slug="404"', null);
			if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
				$_SESSION['direct']=true;
				$_SESSION['page_id']=$page["id"][0];
				$_SESSION['page_file']=$page["file"][0];
				$_SESSION['currentPageTitle']=$page["title"][0];
			}
		}
	} else if (!(isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS'])==="on")) {
		$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context=1 and slug="'.$_SESSION['slug'].'"', null);
		if (array_key_exists("id", $page) && count($page["id"])>=1) {
			$_SESSION['redirect']=true;
			$_SESSION['savedSlug']=$_SESSION['slug'];
			header('Location: http://'.$_SERVER['HTTP_HOST'].preg_replace('/[a-z0-9-]+$/', "", $_SERVER['REQUEST_URI']).'index');
			die();
		} else {
			$page=$mysql::selectAllPlusString("pages", ' where active=1 and slug="404"', null);
			if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
				$_SESSION['direct']=true;
				$_SESSION['page_id']=$page["id"][0];
				$_SESSION['page_file']=$page["file"][0];
				$_SESSION['currentPageTitle']=$page["title"][0];
			}
		}
	} else {
		$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context=1 and slug="'.$_SESSION['slug'].'"', null);
		if (array_key_exists("id", $page) && count($page["id"])>=1) {
			if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
				$_SESSION['direct']=true;
				$_SESSION['page_id']=$page["id"][0];
				$_SESSION['page_file']=$page["file"][0];
				$_SESSION['currentPageTitle']=$page["title"][0];
			} else {
				$page=$mysql::selectAllPlusString("pages", ' where active=1 and slug="404"', null);
				if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
					$_SESSION['direct']=true;
					$_SESSION['page_id']=$page["id"][0];
					$_SESSION['page_file']=$page["file"][0];
					$_SESSION['currentPageTitle']=$page["title"][0];
				}
			}
		} else {
			$page=$mysql::selectAllPlusString("pages", ' where active=1 and slug="404"', null);
			if (file_exists('./lpslt/protected/'.$page["file"][0].'.php')) {
				$_SESSION['direct']=true;
				$_SESSION['page_id']=$page["id"][0];
				$_SESSION['page_file']=$page["file"][0];
				$_SESSION['currentPageTitle']=$page["title"][0];
			}
		}
	}
}
function findDependencies($str) {
	$files=array();
	$files['path']=array();
	$files['pathAttr']=array();
	$files['pathAttrIndex']=array();
	$files['filesize']=array();
	$files['endTagIndex']=array();
	$files['endTag']=array();
	$files['type']=array();
	$regImg='/<img(?:[^>]*)(src="([^"]*)")(?:[^>]*)([\/]?>)/isU';
	$regScript='/<script(?:[^>]*)(src="([^"]*)")(?:[^>]*)([\/]?>)/isU';
	$regLink='/<link(?:[^>]*)(href="([^"]*)")(?:[^>]*)([\/]?>)/isU';
	$regHtmlComments='/<!--.*-->/isU';
	$regBackgroundImage='/background-image:url\(([^\)]*)\);/isU';
	$matchesImg=array();
	$matchesScript=array();
	$matchesLink=array();
	$matchesHtmlComments=array();
	$matchesBackgroundImage=array();
	preg_match_all($regImg, $str, $matchesImg, PREG_OFFSET_CAPTURE);
	preg_match_all($regScript, $str, $matchesScript, PREG_OFFSET_CAPTURE);
	preg_match_all($regLink, $str, $matchesLink, PREG_OFFSET_CAPTURE);
	preg_match_all($regHtmlComments, $str, $matchesHtmlComments, PREG_OFFSET_CAPTURE);
	$b=count($matchesHtmlComments[0]);
	$c=count($matchesImg[2]);
	$j=0;
	$total=0;
	$commented=false;
	for ($i=0; $i<$c; $i++) {
		for ($k=0; $k<$b; $k++) {
			if ((int)$matchesImg[1][$i][1]<(int)$matchesHtmlComments[0][$k][1] && (int)$matchesImg[1][$i][1]+strlen($matchesImg[1][$i][0])<(int)$matchesHtmlComments[0][$k][1]+strlen($matchesHtmlComments[0][$k][0])) {
				$commented=true;
				break;
			}
		}
		if (!$commented) {
			if (preg_match('/(.*)\?.*$/', $matchesImg[2][$i][0])) {
				$file=preg_replace('/(.*)\?.*$/', "$1", $matchesImg[2][$i][0]);
			} else {
				$file=$matchesImg[2][$i][0];
			}
			if (file_exists($file)) {
				if (indexOfInArray($matchesImg[2][$i][0], $files['path'])==-1) {
					$files['path'][$j]=$matchesImg[2][$i][0];
					$files['pathAttr'][$j]=$matchesImg[1][$i][0];
					$files['pathAttrIndex'][$j]=(int)$matchesImg[1][$i][1];
					$files['filesize'][$j]=filesize($file);
					$total+=$files['filesize'][$j];
					$files['endTagIndex'][$j]=(int)$matchesImg[3][$i][1];
					$files['endTag'][$j]=$matchesImg[3][$i][0];
					$files['type'][$j]='img';
					$j++;
				} else {
					$files['path'][$j]=$matchesImg[2][$i][0];
					$files['pathAttr'][$j]=$matchesImg[1][$i][0];
					$files['pathAttrIndex'][$j]=(int)$matchesImg[1][$i][1];
					$files['filesize'][$j]=filesize($file);
					$files['endTagIndex'][$j]=(int)$matchesImg[3][$i][1];
					$files['endTag'][$j]=$matchesImg[3][$i][0];
					$files['type'][$j]='img';
				}
			}
		}
	}
	$c=count($matchesScript[2]);
	$commented=false;
	for ($i=0; $i<$c; $i++) {
		for ($k=0; $k<$b; $k++) {
			if ((int)$matchesScript[1][$i][1]<(int)$matchesHtmlComments[0][$k][1] && (int)$matchesScript[1][$i][1]+strlen($matchesScript[1][$i][0])<(int)$matchesHtmlComments[0][$k][1]+strlen($matchesHtmlComments[0][$k][0])) {
				$commented=true;
				break;
			}
		}
		if (!$commented) {
			if (preg_match('/(.*)\?.*$/', $matchesScript[2][$i][0])) {
				$file=preg_replace('/(.*)\?.*$/', "$1", $matchesScript[2][$i][0]);
			} else {
				$file=$matchesScript[2][$i][0];
			}
			if (file_exists($file)) {
				if (indexOfInArray($matchesScript[2][$i][0], $files['path'])==-1) {
					$files['path'][$j]=$matchesScript[2][$i][0];
					$files['pathAttr'][$j]=$matchesScript[1][$i][0];
					$files['pathAttrIndex'][$j]=(int)$matchesScript[1][$i][1];
					$files['filesize'][$j]=filesize($file);
					$total+=$files['filesize'][$j];
					$files['endTagIndex'][$j]=(int)$matchesScript[3][$i][1];
					$files['endTag'][$j]=$matchesScript[3][$i][0];
					$files['type'][$j]='script';
					$j++;
				} else {
					$files['path'][$j]=$matchesScript[2][$i][0];
					$files['pathAttr'][$j]=$matchesScript[1][$i][0];
					$files['pathAttrIndex'][$j]=(int)$matchesScript[1][$i][1];
					$files['filesize'][$j]=filesize($file);
					$files['endTagIndex'][$j]=(int)$matchesScript[3][$i][1];
					$files['endTag'][$j]=$matchesScript[3][$i][0];
					$files['type'][$j]='script';
					$j++;
				}
			}
		}
	}
	$levels=array();
	$dirs=array();
	$c=count($matchesLink[2]);
	$commented=false;
	$l=0;
	for ($i=0; $i<$c; $i++) {
		for ($k=0; $k<$b; $k++) {
			if ((int)$matchesLink[1][$i][1]<(int)$matchesHtmlComments[0][$k][1] && (int)$matchesLink[1][$i][1]+strlen($matchesLink[1][$i][0])<(int)$matchesHtmlComments[0][$k][1]+strlen($matchesHtmlComments[0][$k][0])) {
				$commented=true;
				break;
			}
		}
		if (!$commented) {
			if (preg_match('/(.*)\?.*$/', $matchesLink[2][$i][0])) {
				$file=preg_replace('/(.*)\?.*$/', "$1", $matchesLink[2][$i][0]);
			} else {
				$file=$matchesLink[2][$i][0];
			}
			if (file_exists($file)) {
				$ext=getExtension($file);
				if ($ext=="css") {
					if (file_exists($file)) {
						if (indexOfInArray($matchesLink[2][$i][0], $files['path'])==-1) {
							$files['path'][$j]=$matchesLink[2][$i][0];
							$files['pathAttr'][$j]=$matchesLink[1][$i][0];
							$files['pathAttrIndex'][$j]=(int)$matchesLink[1][$i][1];
							$files['filesize'][$j]=filesize($file);
							$total+=$files['filesize'][$j];
							$files['endTagIndex'][$j]=(int)$matchesLink[3][$i][1];
							$files['endTag'][$j]=$matchesLink[3][$i][0];
							$files['type'][$j]='css';
							$j++;
						} else {
							$files['path'][$j]=$matchesLink[2][$i][0];
							$files['pathAttr'][$j]=$matchesLink[1][$i][0];
							$files['pathAttrIndex'][$j]=(int)$matchesLink[1][$i][1];
							$files['filesize'][$j]=filesize($file);
							$files['endTagIndex'][$j]=(int)$matchesLink[3][$i][1];
							$files['endTag'][$j]=$matchesLink[3][$i][0];
							$files['type'][$j]='css';
							$j++;
						}
					}
					$fh=fopen($file, 'r');
					if ($fh) {
						$matchesBackgroundImage[$l]=array();
						$dirs[$l]=substr($matchesLink[2][$i][0], 0, strrpos($matchesLink[2][$i][0], '/')+1);
						$nocontext_contentsCss=fread($fh, filesize($file));
						preg_match_all($regBackgroundImage, $nocontext_contentsCss, $matchesBackgroundImage[$l], PREG_OFFSET_CAPTURE);
						$l++;
					}
				}
			}
		}
	}
	$c1=count($matchesBackgroundImage);
	$cssImages=array();
	$cssImages['path']=array();
	$cssImages['filesize']=array();
	for ($i=0; $i<$c1; $i++) {
		if (array_key_exists(1, $matchesBackgroundImage[$i])) {
			$c2=count($matchesBackgroundImage[$i][1]);
			for ($j=0; $j<$c2; $j++) {
				$path=$dirs[$i].$matchesBackgroundImage[$i][1][$j][0];
				$pos=strrpos($path, '../');
				while ($pos!==false && $pos!=0) {
					$path=substr($path, 0, strrpos($path, '/', strlen($path)-$pos)+1).substr($path, $pos+2, strlen($path)-($pos+2));
					$pos=strrpos($path, '../');
				}
				if (file_exists($path)) {
					if (indexOfInArray($path, $files['path'])==-1 && indexOfInArray($path, $cssImages['path'])==-1) {
						$cssImages['path'][].=$path;
						$cssImages['filesize'][].=filesize($path);
						$total+=$cssImages['filesize'][count($cssImages['filesize'])-1];
					} else {
						$cssImages['path'][].=$path;
						$cssImages['filesize'][].=filesize($path);
					}
				}
				unset($pos, $path);
			}
		}
	}
	$files=sortOn($files, 'pathAttrIndex', SORT_NUMERIC, true);
	$ret=array("files"=>$files, "cssImages"=>$cssImages, "total"=>$total);
	unset($i, $j, $k, $l, $b, $c, $c1, $c2, $files, $cssImages, $matchesBackgroundImage, $regImg, $regScript, $regLink, $regBackgroundImage, $matchesImg, $matchesScript, $matchesLink, $matchesBackgroundImage);
	return $ret;
}
$regEndOpenBodyTag='/<body(?:[^>]*)(>)/isU';
$regStartCloseBodyTag='/<\/body>/isU';
$matchesEndOpenBodyTag=array();
$matchesStartCloseBodyTag=array();
$uA=$_SERVER['HTTP_USER_AGENT'];
$patternIE5_8='/msie [5-8]/i';
if (!preg_match($patternIE5_8, $uA)) {
	if ($context_contents=gic($f)) {
		$fD_context=findDependencies($context_contents);
		preg_match($regEndOpenBodyTag, $context_contents, $matchesEndOpenBodyTag, PREG_OFFSET_CAPTURE);
		$regIsInJS='/<script type="text\/javascript"><\/script>/isU';
		$matchesIsInJS=array();
		preg_match_all($regIsInJS, $context_contents, $matchesIsInJS, PREG_OFFSET_CAPTURE);
		$c=count($matchesIsInJS[0]);
		$js=array();
		for ($i=0; $i<$c; $i++) {
		    $js[$i]=array((int)$matchesIsInJS[0][$i][1], strlen($matchesIsInJS[0][$i][0]));
		}
		$afterBodyIndex=(int)$matchesEndOpenBodyTag[1][1];
		$c=count($fD_context["files"]['path']);
		$totalOffset=0;
		$offsets=array(0 => 0);
		$j=0;
		$memOffsetBB=0;
		$memPath=array();
		$memType=array();
		for ($i=0; $i<$c; $i++) {
		    if ($fD_context["files"]['pathAttrIndex'][$i]<$afterBodyIndex) {
			$memPath[$j]=$fD_context["files"]['path'][$i];
			$memType[$j]=$fD_context["files"]['type'][$i];
			$context_contents=substr($context_contents, 0, $fD_context["files"]['pathAttrIndex'][$i]+$totalOffset).'id="bBpath_'.$j.'"'.substr($context_contents, $fD_context["files"]['pathAttrIndex'][$i]+strlen($fD_context["files"]['pathAttr'][$i])+$totalOffset, strlen($context_contents)-($fD_context["files"]['pathAttrIndex'][$i]+strlen($fD_context["files"]['pathAttr'][$i])+$totalOffset));
			$totalOffset+=strlen('id="bBpath_'.$j.'"')-strlen($fD_context["files"]['pathAttr'][$i]);
			$j++;
		    }
		    switch ($fD_context["files"]['type'][$i]) {
			case 'img':
			    $str=' onload="onLoading('.$fD_context["files"]['filesize'][$i].', \'html\', this.src);"';
			break;
			case 'script':
			    $str=' onload="onLoading('.$fD_context["files"]['filesize'][$i].', \'html\', this.src);"';
			break;
			case 'css':
			    $str=' onload="onLoading('.$fD_context["files"]['filesize'][$i].', \'html\', this.href);"';
			break;
		    }
		    $isInJS=false;
		    for ($k=0; $k<count($js); $k++) {
			if ($fD_context["files"]['endTagIndex'][$i]>$js[$k][0] && $fD_context["files"]['endTagIndex'][$i]<$js[$k][0]+$js[$k][1]) {
			    $isInJS=true;
			}
		    }
		    if (!$isInJS || $fD_context["files"]['type'][$i]=="script") {
			$context_contents=substr($context_contents, 0, $fD_context["files"]['endTagIndex'][$i]+$totalOffset).$str.substr($context_contents, $fD_context["files"]['endTagIndex'][$i]+$totalOffset, strlen($context_contents)-($fD_context["files"]['endTagIndex'][$i]+$totalOffset));
			$totalOffset+=strlen($str);
		    }
		}
		$c=count($fD_context["files"]['path']);
		$cssPathStr=count($fD_context["cssImages"]['path'])>0?'["'.implode('","',$fD_context["cssImages"]['path']).'"]':'[]';
		$cssFilesizeStr=count($fD_context["cssImages"]['filesize'])>0?'["'.implode('","',$fD_context["cssImages"]['filesize']).'"]':'[]';
		$bBpathStr=count($memPath)>0?'["'.implode('","',$memPath).'"]':'[]';
		$bBtypeStr=count($memType)>0?'["'.implode('","',$memType).'"]':'[]';
		$toAdd='
	<div id="loader" style="position:absolute; width:100%; height:100%;" class="loading">
	</div>
	<script type="text/javascript" class="onLoading">
		var isTouchDevice="ontouchstart" in document.documentElement;
	    var originalTime=(new Date()).getTime();
		var loader=document.getElementById("loader");
		var wTot=window.innerWidth;
		var hTot=window.innerHeight;
		var dim=(hTot+wTot)/2;
		var str="";
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
		str+="\n\t\t"+\'<span style="position:absolute; width:\'+Math.round(dim*0.2)+\'px; height:\'+Math.round(dim*0.2)+\'px; left:50%; margin-left:\'+Math.round(-dim*0.1)+\'px; top:50%; margin-top:\'+Math.round(-dim*0.1)+\'px; font-size:\'+Math.round(dim*0.025)+\'px;"><canvas width=500 height=500 style="width:100%; height:100%;" id="_arc"></canvas></span>\';
		str+="\n\t\t"+\'<span id="_pct" style="position:absolute; width:\'+Math.round(dim*0.2)+\'px; height:\'+Math.round(dim*0.025)+\'px; left:50%; margin-left:\'+Math.round(-dim*0.1)+\'px; top:50%; margin-top:\'+Math.round(-dim*0.0175)+\'px; font-size:\'+Math.round(dim*0.025)+\'px; font-weight:bold; text-align:center; font-family:Arial; color:#000;"></span>\';
		loader.innerHTML=str;
		var percentCont=document.getElementById("_pct");
		var arc=document.getElementById("_arc");
		var ctx=arc.getContext("2d");
		var cssImages=false;
		var loaded=0;
		var totalToLoad=0.000000001;
		var timerId=false;
		var easingId=false;
		var timeElapsed=0;
		var memLoaded=0;
		var memTimeElapsed=0;
		var loadPerMs=200;
		var loadedEstimation=0;
		var filesLoaded=[];
		var percent=0;
		var timer=function() {
			var time=(new Date()).getTime();
			timeElapsed=time-originalTime;
			if (loadPerMs>0 && timeElapsed!=memTimeElapsed) {
				estim=Math.round(loadPerMs*(timeElapsed-memTimeElapsed));
				onLoading(estim, \'estimation\', null);
			}
		}
		memLoaded=loaded;
		memTimeElapsed=0;
		var tQ=[];
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
		totalToLoad='.$fD_context["total"].';
		var cssImages=[];
		cssImages["path"]='.$cssPathStr.';
		cssImages["filesize"]='.$cssFilesizeStr.';
		if (cssImages["path"].length>0) {
			for (var i=0; i<cssImages["path"].length; i++) {
				var currentSize=cssImages["filesize"][i];
				var path=cssImages["path"][i];
				var origin="css";
				(function (c, o, p) {
					var img=new Image;
					img.onload=function() {
						onLoading(c, o, p);
					}
					img.src=path;
				})(currentSize, origin, path);
			}
		}
		var bBpath='.$bBpathStr.';
		var bBtype='.$bBtypeStr.';
		if (bBpath.length>0) {
			for (var i=0; i<bBpath.length; i++) {
				if (bBtype[i]=="css") {
					document.getElementById("bBpath_"+i).href=bBpath[i];
				} else if (bBtype[i]=="script") {
					document.getElementById("bBpath_"+i).src=bBpath[i];
				}
			}
		}
		function onLoading(size, origin, filePath) {
			var time=(new Date()).getTime();
			timeElapsed=time-originalTime;
			if ((filesLoaded.indexOf(filePath)==-1 && (origin=="html" || origin=="css")) || origin=="estimation") {
				if (origin=="html" || origin=="css") { 
					filesLoaded.push(filePath);
					loadedEstimation+=parseInt(size, 10);
					if (loaded!=memLoaded && timeElapsed!=memTimeElapsed) {
						loadPerMs=(loaded-memLoaded)/(timeElapsed-memTimeElapsed);
						memLoaded=loaded;
						memTimeElapsed=timeElapsed;
					} else if (loadPerMs==0) {
					    loadPerMs=2000;
					}
				} else {
					loadedEstimation+=parseInt(size, 10);
					memTimeElapsed=timeElapsed;
				}
				var old_percent=percent;
				percent=Math.ceil(loadedEstimation/totalToLoad*100);
				if (percent>=100) percent=100;
				tQ=(percent<100)
					?(tQ[2]!=percent)
						?[function (pct) { drawPercent(pct); }, old_percent, percent, 0, 250, false]
						:tQ
					:(tQ[2]!=100)
						?[function (pct) { drawPercent(pct); }, old_percent, percent, 0, 250, function () { complete(); }]
						:tQ
				;
				if (percent==100) {
					clearInterval(timerId);
				}
			}
		}
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
		function complete() {
			clearInterval(easingTimerId);
			if ("lpslt" in window && "onLoaded" in window.lpslt) {
				lpslt.onLoaded(false);
			} else {
				setTimeout(function() { complete(); }, 100);
			}
		}
		if (isTouchDevice) {
			window.onload=complete;
		}
		timerId=setInterval(timer, 50);
		easingTimerId=setInterval(linearEasing, 25);
	</script>
	<noscript class="onLoading">
		<style type="text/css">
			body {
				overflow:auto;
			}
			#wrapper {
				display:block;
				opacity:1;
			}
			#background {
				display:block;
				opacity:1;
			}
			#header {
				display:block;
				opacity:1;
			}
			#menu {
				display:block;
				opacity:1;
			}
			.content {
				display:block;
				opacity:1;
			}
		</style>
	</noscript>';
		preg_match($regEndOpenBodyTag, $context_contents, $matchesEndOpenBodyTag, PREG_OFFSET_CAPTURE);
		$toPutIndex=(int)$matchesEndOpenBodyTag[1][1]+strlen($matchesEndOpenBodyTag[1][0]);
		$context_contents=substr($context_contents, 0, $toPutIndex).$toAdd.substr($context_contents, $toPutIndex, strlen($context_contents)-$toPutIndex);
		$contents=$context_contents;
		unset($context_contents);
    } else if (!$_SESSION['redirect']) {
		header('Content-Type: text/html; charset=utf-8');
		echo $failLoad;
		$msg=true;
	}
} else if (preg_match($patternIE5_8, $uA)) {
	header("Location: ./lpslt/old-IE.html");
}
if (isset($contents) && !empty($contents)) {
	echo $contents;
} else {
	header('Content-Type: text/html; charset=utf-8');
	if (!$msg) { echo $failLoad; }
}
unset($contents);
?>