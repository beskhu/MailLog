<?php
	if (file_exists(__DIR__.'/../php/session.php')) {
		include_once(__DIR__.'/../php/session.php');
	}
	$baseDir=__DIR__.'/';
	$loadDir=__DIR__.'/../load/';
	$_SESSION['js']=array();
	if (array_key_exists('prefixJs', $_SESSION)) {
		foreach ($_SESSION['prefixJs'] as $k=>$v) {
			$filesizeBase=filesize($baseDir.$v.'.js');
			$filesizeLastWritten=0;
			$lastFile='';
			$lastWrittenFile='';
			$contentsJsLastWritten='';
			if ($dh=opendir($loadDir)) {
				while (($file=readdir($dh))!==false) {
					if ($file==$v.'_last_written.js') {
						$filesizeLastWritten=filesize($loadDir.$v.'_last_written.js');
						$lastWrittenFile=$loadDir.$v.'_last_written.js';
					} else if (preg_match('/'.$v.'\.js/', $file)) {
						$lastFile=$file;
					}
					unset($file);
				}
				closedir($dh);
			}
			$fhBase=fopen($baseDir.$v.'.js', 'r');
			$contentsJs=fread($fhBase, $filesizeBase);
			fclose($fhBase);
			if ($lastWrittenFile!='' && $filesizeLastWritten!=0) {
				$fhLastWritten=fopen($loadDir.$v.'_last_written.js', 'r');
				$contentsJsLastWritten=fread($fhLastWritten, $filesizeLastWritten);
				fclose($fhLastWritten);
			}
			if ($filesizeLastWritten!=$filesizeBase || empty($lastFile) || ($contentsJsLastWritten!="" && $contentsJs!="" && strcmp($contentsJsLastWritten,$contentsJs)!=0)) {
				$time=time();
				$uuid=uniqid();
				$fhWrite=fopen($loadDir.$v.'.js', 'w+');
				if (fwrite($fhWrite, $contentsJs, strlen($contentsJs))!==false) {
					copy($baseDir.$v.'.js', $loadDir.$v.'_last_written.js');
					$_SESSION['js'][$k]="\t".'<script type="text/javascript" src="lpslt/load/'.$v.'.js?mod='.filemtime($loadDir.$v.'.js').'"></script>'."\n";
				} else {
					$_SESSION['js'][$k]="\t".'<script type="text/javascript" src="lpslt/load/'.$lastFile.'?mod='.filemtime($loadDir.$lastFile).'"></script>'."\n";
				}
				fclose($fhWrite);
			} else if (!empty($lastFile)) {
				$_SESSION['js'][$k]="\t".'<script type="text/javascript" src="lpslt/load/'.$lastFile.'?mod='.filemtime($loadDir.$lastFile).'"></script>'."\n";
			}
		}
	}
?>