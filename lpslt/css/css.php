<?php
	if (file_exists(__DIR__.'/../php/session.php')) {
		include_once(__DIR__.'/../php/session.php');
	}
	$baseDir=__DIR__.'/../css/';
	$loadDir=__DIR__.'/../load/';
	$filesizeBase=filesize($baseDir.$_SESSION['prefixCss'].'.css');
	$filesizeLastWritten=0;
	$lastFile='';
	$lastWrittenFile='';
	if ($dh=opendir($loadDir)) {
		while (($file=readdir($dh))!==false) {
			if ($file==$_SESSION['prefixCss'].'_last_written.css') {
				$filesizeLastWritten=filesize($loadDir.$_SESSION['prefixCss'].'_last_written.css');
				$lastWrittenFile=$loadDir.$_SESSION['prefixCss'].'_last_written.css';
			} else if (preg_match('/'.$_SESSION['prefixCss'].'\.css/', $file)) {
				$lastFile=$file;
			}
			unset($file);
		}
		closedir($dh);
	}
	$fhBase=fopen($baseDir.$_SESSION['prefixCss'].'.css', 'r');
	$contentsCss=fread($fhBase, $filesizeBase);
	fclose($fhBase);
	$contentsCssLastWritten='';
	if ($lastWrittenFile!='' && $filesizeLastWritten!=0) {
		$fhLastWritten=fopen($loadDir.$_SESSION['prefixCss'].'_last_written.css', 'r');
		$contentsCssLastWritten=fread($fhLastWritten, $filesizeLastWritten);
		fclose($fhLastWritten);
	}
	if (file_exists(__DIR__.'/../php/mysql_utils.php')) {
		include_once(__DIR__.'/../php/mysql_utils.php');
	}
	$mysql=new mysqlUtils();
	$rLayout=$mysql::selectAll("layout", null);
	$mysql::closeMysql();
	foreach ($rLayout as $k => $v) {
		$_SESSION['layout'][$k]=$v[0];
	}
	if (count($_SESSION['layout'])>0) {
		foreach ($_SESSION['layout'] as $k => $v) {
			if ($v!=="" && $v!==null) {
				$matches=[];
				preg_match_all("/[\\n|\\r]+[^\\n]+(\[\[".$k."(?:([\*\/\+-])([0-9]+(?:\.[0-9]+)?))?\]\])[^;]*;/isU", $contentsCss, $matches, PREG_OFFSET_CAPTURE);
				$offsetsAndLengths=[];
				set_time_limit(1);
				for ($i=0; $i<count($matches[1]); $i++) {
					$length=strlen($matches[1][$i][0]);
					$index=$matches[1][$i][1];
					$offset=0;
					if (array_key_exists(2, $matches) && is_array($matches[2]) && array_key_exists($i, $matches[2]) && is_array($matches[2][$i]) && array_key_exists(0, $matches[2][$i]) && strlen($matches[2][$i][0])===1 && array_key_exists(3, $matches) && is_array($matches[3]) && array_key_exists($i, $matches[3]) && is_array($matches[3][$i]) && array_key_exists(0, $matches[3][$i]) && strlen($matches[3][$i][0])>0) {
						$m=[];
						preg_match('/([0-9]+(?:\.[0-9]+)?)(px|em|ex|in|cm|mm|pt|pc|px|vw|vh|%)?/i', $v, $m);
						$value=(float)$m[1];
						$unit=(array_key_exists(2, $m)?$m[2]:"");
						switch ($matches[2][$i][0]) {
							case "*":
								$value*=(float)$matches[3][$i][0];
							break;
							case "/":
								$value/=(float)$matches[3][$i][0];
							break;
							case "+":
								$value+=(float)$matches[3][$i][0];
							break;
							case "-":
								$value-=(float)$matches[3][$i][0];
							break;
							default:
							break;
						}
					} else {
						$value=$v;
						$unit=null;
					}
					for ($j=0; $j<count($offsetsAndLengths); $j++) {
						if ($offsetsAndLengths[$j][0]<$index) {
							$offset-=$offsetsAndLengths[$j][1];
						}
					}
					$vBis=(string)$value.($unit!==null?$unit:"");
					$l=strlen($vBis);
					$contentsCss=substr($contentsCss, 0, $index+$offset).$vBis.substr($contentsCss, $index+$length+$offset, strlen($contentsCss)-($index+$length+$offset));
					for ($j=0; $j<count($offsetsAndLengths); $j++) {
						if ($offsetsAndLengths[$j][0]>=$index+$offset) {
							$offsetsAndLengths[$j][0]-=$length-$l;
						}
					}
					$offsetsAndLengths[count($offsetsAndLengths)]=[$index+$offset, $length-$l];
				}
			} else {
				$matches=[];
				preg_match_all("/[\\n|\\r]+[^\\n]+(\[\[".$k."\]\])[^;]*;/isU", $contentsCss, $matches, PREG_OFFSET_CAPTURE);
				$offsetsAndLengths=[];
				for ($i=0; $i<count($matches[1]); $i++) {
					$length=strlen($matches[1][$i][0]);
					$index=$matches[1][$i][1];
					$offset=0;
					for ($j=0; $j<count($offsetsAndLengths); $j++) {
						if ($offsetsAndLengths[$j][0]<$index) {
							$offsetsAndLengths-=$offsetsAndLengths[$j][1];
						}
					}
					$contentsCss=substr($contentsCss, 0, $index+$offset).substr($contentsCss, $index+$length+$offset, strlen($contentsCss)-($index+$length+$offset));
					for ($j=0; $j<count($offsetsAndLengths); $j++) {
						if ($offsetsAndLengths[$j][0]>=$index+$offset) {
							$offsetsAndLengths[$j][0]-=$length;
						}
					}
					$offsetsAndLengths[count($offsetsAndLengths)]=[$index+$offset, $length];
				}
			}
		}
		if ($contentsCss!==$contentsCssLastWritten) {
			$fhWrite=fopen($loadDir.$_SESSION['prefixCss'].'.css', 'w+');
			if (fwrite($fhWrite, $contentsCss, strlen($contentsCss))!==false && copy($loadDir.$_SESSION['prefixCss'].'.css', $loadDir.$_SESSION['prefixCss'].'_last_written.css')) {
				$_SESSION['css']="\t".'<link rel="stylesheet" type="text/css" href="./lpslt/load/'.$_SESSION['prefixCss'].'.css?mod='.filemtime($loadDir.$_SESSION['prefixCss'].".css").'" media="all"/>'."\n";
			} else {
				$_SESSION['css']="\t".'<link rel="stylesheet" type="text/css" href="./lpslt/load/'.$lastFile.'?mod='.filemtime($loadDir.$lastFile).'" media="all"/>'."\n";
			}
			fclose($fhWrite);
		} else {
			$_SESSION['css']="\t".'<link rel="stylesheet" type="text/css" href="./lpslt/load/'.$lastFile.'?mod='.filemtime($loadDir.$lastFile).'" media="all"/>'."\n";
		}
	} else {
		$_SESSION['css']="\t".'<link rel="stylesheet" type="text/css" href="./lpslt/load/'.$lastFile.'?mod='.filemtime($loadDir.$lastFile).'" media="all"/>'."\n";
	}
?>