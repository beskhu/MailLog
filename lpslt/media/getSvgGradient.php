<?php
function getSvgGradient($color1, $color2, $opacity1, $opacity2, $widthNoUnit, $heightNoUnit, $widthUnit, $heightUnit, $pos) {
	$file=__DIR__.'/gradient.svg';
	if (file_exists($file)) {
		switch ($pos) {
			case "left":
				$x1=1;
				$y1=0;
				$x2=0;
				$y2=0;
			break;
			case "top":
				$x1=0;
				$y1=1;
				$x2=0;
				$y2=0;
			break;
			case "right":
				$x1=0;
				$y1=0;
				$x2=1;
				$y2=0;
			break;
			case "bottom":
				$x1=0;
				$y1=0;
				$x2=0;
				$y2=1;
			break;
		}
		$widthNoUnit=(float)$widthNoUnit;
		$heightNoUnit=(float)$heightNoUnit;
		while (strpos((string)$widthNoUnit, ".")!==false || strpos((string)$heightNoUnit, ".")!==false) {
			$widthNoUnit*=10;
			$heightNoUnit*=10;
		}
		$id=preg_replace('/\./', "", substr(uniqid(mt_rand(0,mt_getrandmax()), true), 0, 9));
		$fh=fopen($file,'r');
		$contents=fread($fh, filesize($file));
		$contents=preg_replace('/\[\[color1\]\]/isU', $color1, $contents);
		$contents=preg_replace('/\[\[color2\]\]/isU', $color2, $contents);
		$contents=preg_replace('/\[\[opacity1\]\]/isU', $opacity1, $contents);
		$contents=preg_replace('/\[\[opacity2\]\]/isU', $opacity2, $contents);
		$contents=preg_replace('/\[\[widthUnit\]\]/isU', $widthUnit, $contents);
		$contents=preg_replace('/\[\[heightUnit\]\]/isU', $heightUnit, $contents);
		$contents=preg_replace('/\[\[widthNoUnit\]\]/isU', $widthNoUnit, $contents);
		$contents=preg_replace('/\[\[heightNoUnit\]\]/isU', $heightNoUnit, $contents);
		$contents=preg_replace('/\[\[x1\]\]/isU', $x1, $contents);
		$contents=preg_replace('/\[\[y1\]\]/isU', $y1, $contents);
		$contents=preg_replace('/\[\[x2\]\]/isU', $x2, $contents);
		$contents=preg_replace('/\[\[y2\]\]/isU', $y2, $contents);
		$contents=preg_replace('/\[\[pos\]\]/isU', $pos, $contents);
		$contents=preg_replace('/\[\[id\]\]/isU', $id, $contents);
		$matches=array();
		preg_match('/<svg(?:.*)<\/svg>/isU', $contents, $matches);
		return $matches[0];
	}
}
if (isset($_POST['color1'], $_POST['color2'], $_POST['opacity1'], $_POST['opacity2'], $_POST['widthNoUnit'], $_POST['heightNoUnit'], $_POST['widthUnit'], $_POST['heightUnit'], $_POST['pos'])) {
	echo getSvgGradient($_POST['color1'], $_POST['color2'], $_POST['opacity1'], $_POST['opacity2'], $_POST['widthNoUnit'], $_POST['heightNoUnit'], $_POST['widthUnit'], $_POST['heightUnit'], $_POST['pos']);
} else if (isset($_GET['color1'], $_GET['color2'], $_GET['opacity1'], $_GET['opacity2'], $_GET['widthNoUnit'], $_GET['heightNoUnit'], $_GET['widthUnit'], $_GET['heightUnit'], $_GET['pos'])) {
	$svg=getSvgGradient($_GET['color1'], $_GET['color2'], $_GET['opacity1'], $_GET['opacity2'], $_GET['widthNoUnit'], $_GET['heightNoUnit'], $_GET['widthUnit'], $_GET['heightUnit'], $_GET['pos']);
	header('Content-type: image/svg+xml');
	echo '<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'.$svg;
}
?>