<?php
	if (file_exists(__DIR__.'/../php/session.php')) {
		include_once(__DIR__.'/../php/session.php');
	}
	$cssFonts="";
	if (is_dir(__DIR__.'/../fonts/')) {
		$dir=__DIR__.'/../fonts/';
	}
	foreach (glob($dir."*") as $file) {
		if (!is_dir($file) && strtolower(substr($file, strrpos($file, ".")+1, strlen($file)-(strrpos($file, ".")+1)))=="css") {
			$fh=fopen($file, 'r');
			if ($fh) {
				$cssFonts.=fread($fh, filesize($file))."\n";
			}
		}
	}
	$cssFonts="\t\t".preg_replace('/\\n/s', "\n\t\t", trim($cssFonts));
	$_SESSION['fontsCss']="\t".'<style type="text/css">'."\n".$cssFonts."\n\t".'</style>'."\n"; 
?>