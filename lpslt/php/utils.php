<?php
setlocale(LC_ALL, 'en_US.UTF8');
function strIndexOf($needle, $str, $offset=0) {	 
	for ($z=$offset; $z<strlen($str); $z++) {	
		if (substr($str, $z, strlen($needle)) == $needle) {   
			return $z;		 
		}
	}
	return -1;
}
function strIndexOfInArray($needle, $array, $offset=0) {   
	for ($y=$offset; $y<count($array); $y++) {   
		for ($z=0; $z<strlen((string)$array[$y]); $z++) { 
			if (substr((string)$array[$y], $z, strlen($needle)) == $needle) {	
				return $y; 
			}
		}
	}
	return -1;
}
function indexOfInArray($needle, $array, $offset=0) {   
	for ($y=$offset; $y<count($array); $y++) {   
		if ($array[$y] == $needle) {	
			return $y; 
		}
	}
	return -1;
}
function keyOfInArray($needle, $array) {   
	foreach ($array as $k => $v) {   
		if ($v == $needle) {	
			return $k; 
		}
	}
	return false;
}
function indexOfKeyInArray($needle, $arr) {
	$index=-1;
	$i=0;
	foreach ($arr as $key => $val) {
		if ($key==$needle) {
			$index=$i;
		}
		$i++;
	}
	return $index;
}
function lastIndexOfInArray($needle, $haystack, $offset=0) {
	if (isset($offset)) {
		if ($offset=="" || $offset==0 || $offset==null) $offset=count($haystack)-1;
	} else {
		$offset=count($haystack)-1;
	}
	for ($z=$offset; $z>=0; $z--) {
		if ($haystack[$z] == $needle) {
			return $z;
		}
	}
	return -1;
}
function indexOfInArrayWithArrInput($needles, $haystack, $offset=0) {   
	for ($z=$offset; $z<count($haystack); $z++) {
		if (in_array($haystack[$z], $needles)) {
			return $z;	
		}
	}
	return -1;
}
function lastIndexInArrayOfWithArrInput($needles, $haystack, $offset=null) {
	if ($offset=="" || $offset==0 || $offset==null) $offset=count($haystack)-1;
	for ($z=$offset; $z>=0; $z--) {
		if (in_array($haystack[$z],$needles)) {
			return $z;
		}
	}
	return -1;
}
function strIndexOfInArrayInsensitive($needle, $array, $offset=0) {   
	for ($y=$offset; $y<count($array); $y++) {   
		for ($z=0; $z<strlen((string)$array[$y]); $z++) {	
			if (strtolower(substr((string)$array[$y], $z, strlen($needle))) == strtolower($needle)) {  
				return $y; 
			}
		}
	}
	return -1;
}
function s4() {
	$tmp=dechex(floor((1+mt_rand(0, mt_getrandmax())/mt_getrandmax())*0x10000));
	return substr($tmp, 1, strlen($tmp)-1);
}
function guid() {
	return s4().s4().'-'.s4().'-'.s4().'-'.s4().'-'.s4().s4().s4();
}
function indexesOfInArray($needle, $haystack, $offset=0) { 
	$res=array();
	for ($z=$offset; $z<count($haystack); $z++) { 
		if ($haystack[$z] == $needle) {
			$res[].=$z;
		}
	}
	if (count($res)==0) {
		$res[].=-1;
	}
	return $res;
}
function countExcluding($arr, $itemsArray) {
	$count=0;
	for ($i=0; $i<count($arr); $i++) {
		if (!in_array($arr[$i], $itemsArray)) {
			$count++;
		}
	}
	return $count;
}
function countIncludingOnly($arr, $itemsArray) {
	$count=0;
	for ($i=0; $i<count($arr); $i++) {
		if (in_array($arr[$i], $itemsArray)) {
			$count++;
		}
	}
	return $count;
}
function uniqueArrayKeysFor($needles, $haystacks) {
	if (count($haystacks)>1) {
		for ($i=1; $i<count($haystacks); $i++) {
			if (count($haystacks[$i])!=count($haystacks[$i-1])) {
				return false;
			}
		}
	}
	$keys=array();
	for ($i=0; $i<count($needles); $i++) {
		for ($j=0; $j<count($haystacks[$i]); $j++) {
			if ($needles[$i]==$haystacks[$i][$j]) {
				$keys[].=$j;
			}
		}
	}
	$j=0;
	while ($j<count($keys)) {
		if (countIfValueEqual($keys,$keys[$j])<count($haystacks)) {
			array_splice($keys, $j, 1);
		} else {
			$j++;
		}
	}
	$j=0;
	while ($j<count($keys)) {
		while (lastIndexOfInArray($keys[$j], $keys)!=$j) {
			array_splice($keys, $j, 1);
		}
		$j++;
	}
	return $keys;
}
function countIfValueEqual($arr, $needle) {
	$count=0;
	for ($i=0; $i<count($arr); $i++) {
		if ($arr[$i]==$needle) $count++;
	}
	return $count;
}
function strToHex($string) {
	$hex='';
	for ($i=0; $i < strlen($string); $i++) {
		$hex .= dechex(ord($string[$i]));
	}
	return $hex;
}
function hexToStr($hex) {
	$string='';
	for ($i=0; $i < strlen($hex)-1; $i+=2) {
		$string .= chr(hexdec($hex[$i].$hex[$i+1]));
	}
	return $string;
}
function getExtension($str) {
	$exp=explode('.', $str);
	if (count($exp)>0) {
		$ext=$exp[count($exp)-1];
		return $ext;
	}
	return false;
}
function lastKeyOf($arr) {
	$count1=count($arr);
	$count2=0;
	foreach ($arr as $k => $v) {
		$count2++;
		if ($count2==$count1) return $k;
	}
	return null;
}
function nextKey($arr, $key) {
	$returnNext=false;
	foreach ($arr as $k => $v) {
		if ($returnNext) return $k;
		if ($k==$key) $returnNext=true;
	}
	return null;
}
function sortOn($array, $key, $sort_flags, $boolRemapNumerical) {
	if (array_key_exists($key, $array) && is_array($array[$key])) {
		asort($array[$key], $sort_flags);
		if (!$boolRemapNumerical) {
			$newArr=array();
			foreach ($array as $h => $u) {
				if (!array_key_exists($h, $newArr)) {
					$newArr[$h]=array();
				}
			}
			foreach ($array[$key] as $k => $v) {
				foreach ($array as $h => $u) {
					if (array_key_exists($k, $array[$h])) {
						$newArr[$h][$k]=$array[$h][$k];
					}
				} 
			}
		} else {
			$i=0;
			$newArr=array();
			foreach ($array as $h => $u) {
				if (!array_key_exists($h, $newArr)) {
					$newArr[$h]=array();
				}
			}
			foreach ($array[$key] as $k => $v) {
				foreach ($array as $h => $u) {
					if (array_key_exists($k, $array[$h])) {
						$newArr[$h][$i]=$array[$h][$k];
					}
				}
				$i++;
			}
			unset($i);
		}
		return $newArr;
	} else if (is_array($array)) {
		asort($array, $sort_flags);
		if (!$boolRemapNumerical) {
			return $array;
		} else {
			$i=0;
			$newArr=array();
			foreach ($array as $k => $v) {
				$newArr[$i]=$array[$k];
				$i++;
			}
			unset($i);
			return $newArr;
		}
	}
}
function gic($filename) {
	if (is_file($filename)) {
		ob_start();
		include $filename;
		$ob_contents = ob_get_contents();
			ob_end_clean();
			return $ob_contents;
	}
	return false;
}
function removeDiacritics($string) {
	$string=trim($string);
	$diacriticsEquivalent=array(
		0xc3 => array(
			0xc380 => 'A', 0xc381 => 'A', 0xc382 => 'A', 0xc383 => 'A', 0xc384 => 'A', 0xc385 => 'A', 0xc386 => 'AE', 0xc387 => 'C', 
			0xc388 => 'E', 0xc389 => 'E', 0xc38a => 'E', 0xc38b => 'E', 0xc38c => 'I', 0xc38d => 'I', 0xc38e => 'I', 0xc38f => 'I', 
			0xc390 => 'D', 0xc391 => 'N', 0xc392 => 'O', 0xc393 => 'O', 0xc394 => 'O', 0xc395 => 'O', 0xc396 => 'O', 0xc398 => 'O', 
			0xc399=> 'U', 0xc39a => 'U', 0xc39b => 'U', 0xc39c => 'U', 0xc39d => 'Y', 0xc39f => 'S', 0xc3a0 => 'a', 0xc3a1 => 'a', 
			0xc3a2 => 'a', 0xc3a3 => 'a', 0xc3a4 => 'a', 0xc3a5 => 'a', 0xc3a6 => 'ae', 0xc3a7 => 'c', 0xc3a8 => 'e', 0xc3a9 => 'e', 
			0xc3aa => 'e', 0xc3ab => 'e', 0xc3ac => 'i', 0xc3ad => 'i', 0xc3ae => 'i', 0xc3af => 'i', 0xc3b0 => 'o', 0xc3b1 => 'n', 
			0xc3b2 => 'o', 0xc3b3 => 'o', 0xc3b4 => 'o', 0xc3b5 => 'o', 0xc3b6 => 'o', 0xc3b8 => 'o', 0xc3b9 => 'u', 0xc3ba => 'u', 
			0xc3bb => 'u', 0xc3bc => 'u', 0xc3bd => 'y', 0xc3bf => 'y'
		),
		0xc4 => array(	
			0xc480 => 'A', 0xc481 => 'a', 0xc482 => 'A', 0xc483 => 'a', 0xc484 => 'A', 0xc485 => 'a', 0xc486 => 'C', 0xc487 => 'c',
			0xc488 => 'C', 0xc489 => 'c', 0xc48a => 'C', 0xc48b => 'c', 0xc48c => 'C', 0xc48d => 'c', 0xc48e => 'D', 0xc48f => 'd',
			0xc490 => 'D', 0xc491 => 'd', 0xc492 => 'E', 0xc493 => 'e', 0xc494 => 'E', 0xc495 => 'e', 0xc496 => 'E', 0xc497 => 'e',
			0xc498 => 'E', 0xc499 => 'e', 0xc49a => 'E', 0xc49b => 'e', 0xc49c => 'G', 0xc49d => 'g', 0xc49e => 'G', 0xc49f => 'g',
			0xc4a0 => 'G', 0xc4a1 => 'g', 0xc4a2 => 'G', 0xc4a3 => 'g', 0xc4a4 => 'H', 0xc4a5 => 'h', 0xc4a6 => 'H', 0xc4a7 => 'h',
			0xc4a8 => 'I', 0xc4a9 => 'i', 0xc4aa => 'I', 0xc4ab => 'i', 0xc4ac => 'I', 0xc4ad => 'i', 0xc4ae => 'I', 0xc4af => 'i',
			0xc4b0 => 'I', 0xc4b1 => 'i', 0xc4b2 => 'IJ', 0xc4b3 => 'ij', 0xc4b4 => 'J', 0xc4b5 => 'j', 0xc4b6 => 'K', 0xc4b7 => 'k',
			0xc4b8 => 'k', 0xc4b9 => 'L', 0xc4ba => 'l', 0xc4bb => 'L', 0xc4bc => 'l', 0xc4bd => 'L', 0xc4be => 'l', 0xc4bf => 'L'
		),
		0xc5 => array(	
			0xc580 => 'l', 0xc581 => 'L', 0xc582 => 'l', 0xc583 => 'N', 0xc584 => 'n', 0xc585 => 'N', 0xc586 => 'n', 0xc587 => 'N',
			0xc588 => 'n', 0xc589 => 'n', 0xc58a => 'N', 0xc58b => 'n', 0xc58c => 'O', 0xc58d => 'o', 0xc58e => 'O', 0xc58f => 'o',
			0xc590 => 'O', 0xc591 => 'o', 0xc592 => 'OE', 0xc593 => 'oe', 0xc594 => 'R', 0xc595 => 'r', 0xc596 => 'R', 0xc597 => 'r',
			0xc598 => 'R', 0xc599 => 'r', 0xc59a => 'S', 0xc59b => 's', 0xc59c => 'S', 0xc59d => 's', 0xc59e => 'S', 0xc59f => 's',
			0xc5a0 => 'S', 0xc5a1 => 's', 0xc5a2 => 'T', 0xc5a3 => 't', 0xc5a4 => 'T', 0xc5a5 => 't', 0xc5a6 => 'T', 0xc5a7 => 't',
			0xc5a8 => 'U', 0xc5a9 => 'u', 0xc5aa => 'U', 0xc5ab => 'u', 0xc5ac => 'U', 0xc5ad => 'u', 0xc5ae => 'U', 0xc5af => 'u',
			0xc5b0 => 'U', 0xc5b1 => 'u', 0xc5b2 => 'U', 0xc5b3 => 'u', 0xc5b4 => 'W', 0xc5b5 => 'w', 0xc5b6 => 'Y', 0xc5b7 => 'y',
			0xc5b8 => 'Y', 0xc5b9 => 'Z', 0xc5ba => 'z', 0xc5bb => 'Z', 0xc5bc => 'z', 0xc5bd => 'Z', 0xc5be => 'z', 0xc5bf => 's'
		),
		0xc6 => array(	
			0xc680 => 'b', 0xc681 => 'B', 0xc682 => 'B', 0xc683 => 'b', 0xc684 => 'B', 0xc685 => 'b', 0xc686 => 'O', 0xc687 => 'C',
			0xc688 => 'c', 0xc689 => 'D', 0xc68a => 'D', 0xc68b => 'd', 0xc68c => 'd', 0xc68d => 'd', 0xc68e => 'E', 0xc68f => 'E',
			0xc690 => 'E', 0xc691 => 'F', 0xc692 => 'f', 0xc693 => 'G', 0xc694 => 'G', 0xc695 => 'hv', 0xc696 => 'I', 0xc697 => 'I',
			0xc698 => 'K', 0xc699 => 'k', 0xc69a => 'l', 0xc69b => 'l', 0xc69c => 'M', 0xc69d => 'N', 0xc69e => 'n', 0xc69f => 'O',
			0xc6a0 => 'O', 0xc6a1 => 'o', 0xc6a2 => 'OI', 0xc6a3 => 'oi', 0xc6a4 => 'P', 0xc6a5 => 'p', 0xc6a6 => 'R', 0xc6a7 => 'S',
			0xc6a8 => 's', 0xc6a9 => 'S', 0xc6aa => 'S', 0xc6ab => 't', 0xc6ac => 'T', 0xc6ad => 't', 0xc6ae => 'T', 0xc6af => 'U',
			0xc6b0 => 'u', 0xc6b1 => 'U', 0xc6b2 => 'V', 0xc6b3 => 'Y', 0xc6b4 => 'y', 0xc6b5 => 'Z', 0xc6b6 => 'z', 
			0xc6bb => '2', 0xc6bc => '5', 0xc6bd => '5'
		),
		0xc7 => array(	
			0xc784 => 'DZ', 0xc785 => 'Dz', 0xc786 => 'dz', 0xc787 => 'LJ', 
			0xc788 => 'Lj', 0xc789 => 'lj', 0xc78a => 'NJ', 0xc78b => 'Nj', 0xc78c => 'nj', 0xc78d => 'A', 0xc78e => 'a', 0xc78f => 'I', 
			0xc790 => 'i', 0xc791 => 'O', 0xc792 => 'o', 0xc793 => 'U', 0xc794 => 'u', 0xc795 => 'U', 0xc796 => 'u', 0xc797 => 'U', 
			0xc798 => 'u', 0xc799 => 'U', 0xc79a => 'u', 0xc79b => 'U', 0xc79c => 'u', 0xc79d => 'e', 0xc79e => 'A', 0xc79f => 'a', 
			0xc7a0 => 'A', 0xc7a1 => 'a', 0xc7a2 => 'AE', 0xc7a3 => 'ae', 0xc7a4 => 'G', 0xc7a5 => 'g', 0xc7a6 => 'G', 0xc7a7 => 'g', 
			0xc7a8 => 'K', 0xc7a9 => 'k', 0xc7aa => 'O', 0xc7ab => 'o', 0xc7ac => 'O', 0xc7ad => 'o', 
			0xc7b0 => 'j', 0xc7b1 => 'DZ', 0xc7b2 => 'Dz', 0xc7b3 => 'dz', 0xc7b4 => 'G', 0xc7b5 => 'g', 0xc7b6 => 'H', 
			0xc7b8 => 'N', 0xc7b9 => 'n', 0xc7ba => 'A', 0xc7bb => 'a', 0xc7bc => 'AE', 0xc7bd => 'ae', 0xc7be => 'O', 0xc7bf => 'o'
		),
		0xc8 => array(	
			0xc880 => 'A', 0xc881 => 'a', 0xc882 => 'A', 0xc883 => 'a', 0xc884 => 'E', 0xc885 => 'e', 0xc886 => 'E', 0xc887 => 'e',
			0xc888 => 'I', 0xc889 => 'i', 0xc88a => 'I', 0xc88b => 'i', 0xc88c => 'O', 0xc88d => 'o', 0xc88e => 'O', 0xc88f => 'o',
			0xc890 => 'R', 0xc891 => 'r', 0xc892 => 'R', 0xc893 => 'r', 0xc894 => 'U', 0xc895 => 'u', 0xc896 => 'U', 0xc897 => 'u',
			0xc898 => 'S', 0xc899 => 's', 0xc89a => 'T', 0xc89b => 't', 0xc89e => 'H', 0xc89f => 'h',
			0xc8a0 => 'N', 0xc8a1 => 'd', 0xc8a2 => 'OU', 0xc8a3 => 'ou', 0xc8a4 => 'Z', 0xc8a5 => 'z', 0xc8a6 => 'A', 0xc8a7 => 'a',
			0xc8a8 => 'E', 0xc8a9 => 'e', 0xc8aa => 'O', 0xc8ab => 'o', 0xc8ac => 'O', 0xc8ad => 'o', 0xc8ae => 'O', 0xc8af => 'o',
			0xc8b0 => 'O', 0xc8b1 => 'o', 0xc8b2 => 'Y', 0xc8b3 => 'y', 0xc8b4 => 'l', 0xc8b5 => 'n', 0xc8b6 => 't', 0xc8b7 => 'j', 
			0xc8b8 => 'db', 0xc8b9 => 'qp', 0xc8ba => 'A', 0xc8bb => 'C', 0xc8bc => 'c', 0xc8bd => 'L', 0xc8be => 'T', 0xc8bf => 's'
		),
		0xc9 => array(	
			0xc980 => 'z', 0xc983 => 'B', 0xc984 => 'U', 0xc985 => 'V', 0xc986 => 'E', 0xc987 => 'e',
			0xc988 => 'J', 0xc989 => 'j', 0xc98a => 'Q', 0xc98b => 'q', 0xc98c => 'R', 0xc98d => 'R', 0xc98e => 'Y', 0xc98f => 'y',
			0xc990 => 'a', 0xc991 => 'a', 0xc992 => 'a', 0xc993 => 'b', 0xc994 => 'o', 0xc995 => 'c', 0xc996 => 'd', 0xc997 => 'd',
			0xc998 => 'e', 0xc999 => 'e', 0xc99a => 'e', 0xc99b => 'e', 0xc99e => 'e', 0xc99f => 'j',
			0xc9a0 => 'g', 0xc9a1 => 'g', 0xc9a2 => 'G', 0xc9a3 => 'g', 0xc9a4 => 'g', 0xc9a5 => 'h', 0xc9a6 => 'h', 0xc9a7 => 'h',
			0xc9a8 => 'i', 0xc9a9 => 'i', 0xc9aa => 'i', 0xc9ab => 'l', 0xc9ac => 'l', 0xc9ad => 'l', 0xc9ae => 'lz', 0xc9af => 'm',
			0xc9b0 => 'm', 0xc9b1 => 'm', 0xc9b2 => 'n', 0xc9b3 => 'n', 0xc9b4 => 'N', 0xc9b5 => 'o', 0xc9b6 => 'OE', 0xc9b7 => 'o', 
			0xc9b8 => 'p', 0xc9b9 => 'r', 0xc9ba => 'r', 0xc9bb => 'r', 0xc9bc => 'r', 0xc9bd => 'r', 0xc9be => 'r', 0xc9bf => 'r'
		),
		0xca => array(	
			0xca80 => 'R', 0xca81 => 'R', 0xca82 => 's', 0xca84 => 'j', 0xca87 => 't',
			0xca88 => 't', 0xca89 => 'u', 0xca8a => 'u', 0xca8b => 'v', 0xca8c => 'v', 0xca8d => 'w', 0xca8e => 'y', 0xca8f => 'y',
			0xca90 => 'z', 0xca91 => 'z', 0xca97 => 'c',
			0xca99 => 'B', 0xca9a => 'e', 0xca9b => 'G', 0xca9c => 'H', 0xca9d => 'j', 0xca9e => 'k', 0xca9f => 'L',
			0xcaa0 => 'q', 0xcaa3 => 'dz', 0xcaa4 => 'dz', 0xcaa5 => 'dz', 0xcaa6 => 'ts', 0xcaa7 => 'tf',
			0xcaa8 => 'tc', 0xcaa9 => 'fn', 0xcaaa => 'ls', 0xcaab => 'lz', 0xcaae => 'h', 0xcaaf => 'h',
			0xcab0 => 'h', 0xcab1 => 'h', 0xcab2 => 'j', 0xcab3 => 'r', 0xcab4 => 'r', 0xcab5 => 'r', 0xcab6 => 'r', 0xcab7 => 'w', 
			0xcab8 => 'y', 0xcab9 => '', 0xcaba => '', 0xcabb => '', 0xcabc => '', 0xcabd => '', 0xcabe => '', 0xcabf => ''
		),
		0xcb => array(	
			0xcb80 => '', 0xcb81 => '', 0xcb82 => '', 0xcb83 => '', 0xcb84 => '', 0xcb85 => '', 0xcb86 => '', 0xcb87 => '',
			0xcb88 => '', 0xcb89 => '', 0xcb8a => '', 0xcb8b => '', 0xcb8c => '', 0xcb8d => '', 0xcb8e => '', 0xcb8f => '',
			0xcb90 => '', 0xcb91 => '', 0xcb92 => '', 0xcb93 => '', 0xcb94 => '', 0xcb95 => '', 0xcb96 => '', 0xcb97 => '',
			0xcb98 => '', 0xcb99 => '', 0xcb9a => '', 0xcb9b => '', 0xcb9c => '', 0xcb9d => '', 0xcb9e => '', 0xcb9f => '',
			0xcba0 => '', 0xcba1 => '', 0xcba2 => '', 0xcba3 => '', 0xcba4 => '', 0xcba5 => '', 0xcba6 => '', 0xcba7 => '',
			0xcba8 => '', 0xcba9 => '', 0xcbaa => '', 0xcbab => '', 0xcbac => '', 0xcbad => '', 0xcbae => '', 0xcbaf => '',
			0xcbb0 => '', 0xcbb1 => '', 0xcbb2 => '', 0xcbb3 => '', 0xcbb4 => '', 0xcbb5 => '', 0xcbb6 => '', 0xcbb7 => '',
			0xcbb8 => '', 0xcbb9 => '', 0xcbba => '', 0xcbbb => '', 0xcbbc => '', 0xcbbd => '', 0xcbbe => '', 0xcbbf => ''
		),
		0xcc => array(	
			0xcc80 => '', 0xcc81 => '', 0xcc82 => '', 0xcc83 => '', 0xcc84 => '', 0xcc85 => '', 0xcc86 => '', 0xcc87 => '',
			0xcc88 => '', 0xcc89 => '', 0xcc8a => '', 0xcc8b => '', 0xcc8c => '', 0xcc8d => '', 0xcc8e => '', 0xcc8f => '',
			0xcc90 => '', 0xcc91 => '', 0xcc92 => '', 0xcc93 => '', 0xcc94 => '', 0xcc95 => '', 0xcc96 => '', 0xcc97 => '',
			0xcc98 => '', 0xcc99 => '', 0xcc9a => '', 0xcc9b => '', 0xcc9c => '', 0xcc9d => '', 0xcc9e => '', 0xcc9f => '',
			0xcca0 => '', 0xcca1 => '', 0xcca2 => '', 0xcca3 => '', 0xcca4 => '', 0xcca5 => '', 0xcca6 => '', 0xcca7 => '',
			0xcca8 => '', 0xcca9 => '', 0xccaa => '', 0xccab => '', 0xccac => '', 0xccad => '', 0xccae => '', 0xccaf => '',
			0xccb0 => '', 0xccb1 => '', 0xccb2 => '', 0xccb3 => '', 0xccb4 => '', 0xccb5 => '', 0xccb6 => '', 0xccb7 => '',
			0xccb8 => '', 0xccb9 => '', 0xccba => '', 0xccbb => '', 0xccbc => '', 0xccbd => '', 0xccbe => '', 0xccbf => ''
		),
		0xe1 => array(	
			0xe1b880 => 'A', 0xe1b881 => 'a', 0xe1b882 => 'B', 0xe1b883 => 'b', 0xe1b884 => 'B', 0xe1b885 => 'b', 0xe1b886 => 'B', 0xe1b887 => 'b', 
			0xe1b888 => 'C', 0xe1b889 => 'c', 0xe1b88a => 'D', 0xe1b88b => 'd', 0xe1b88c => 'D', 0xe1b88d => 'd', 0xe1b88e => 'D', 0xe1b88f => 'd', 
			0xe1b890 => 'D', 0xe1b891 => 'd', 0xe1b892 => 'D', 0xe1b893 => 'd', 0xe1b894 => 'E', 0xe1b895 => 'e', 0xe1b896 => 'E', 0xe1b897 => 'e',
			0xe1b898 => 'E', 0xe1b899 => 'e', 0xe1b89a => 'E', 0xe1b89b => 'e', 0xe1b89c => 'E', 0xe1b89d => 'e', 0xe1b89e => 'F', 0xe1b89f => 'f',
			0xe1b8a0 => 'G', 0xe1b8a1 => 'g', 0xe1b8a2 => 'H', 0xe1b8a3 => 'h', 0xe1b8a4 => 'H', 0xe1b8a5 => 'h', 0xe1b8a6 => 'H', 0xe1b8a7 => 'h',
			0xe1b8a8 => 'H', 0xe1b8a9 => 'h', 0xe1b8aa => 'H', 0xe1b8ab => 'h', 0xe1b8ac => 'I', 0xe1b8ad => 'i', 0xe1b8ae => 'I', 0xe1b8af => 'i',
			0xe1b8b0 => 'K', 0xe1b8b1 => 'k', 0xe1b8b2 => 'K', 0xe1b8b3 => 'k', 0xe1b8b4 => 'K', 0xe1b8b5 => 'k', 0xe1b8b6 => 'L', 0xe1b8b7 => 'l',
			0xe1b8b8 => 'L', 0xe1b8b9 => 'l', 0xe1b8ba => 'L', 0xe1b8bb => 'l', 0xe1b8bc => 'L', 0xe1b8bd => 'l', 0xe1b8be => 'M', 0xe1b8bf => 'm',
			0xe1b980 => 'M', 0xe1b981 => 'm', 0xe1b982 => 'M', 0xe1b983 => 'm', 0xe1b984 => 'N', 0xe1b985 => 'n', 0xe1b986 => 'N', 0xe1b987 => 'n', 
			0xe1b988 => 'N', 0xe1b989 => 'n', 0xe1b98a => 'N', 0xe1b98b => 'n', 0xe1b98c => 'O', 0xe1b98d => 'o', 0xe1b98e => 'O', 0xe1b98f => 'o', 
			0xe1b990 => 'O', 0xe1b991 => 'o', 0xe1b992 => 'O', 0xe1b993 => 'o', 0xe1b994 => 'P', 0xe1b995 => 'p', 0xe1b996 => 'P', 0xe1b997 => 'p',
			0xe1b998 => 'R', 0xe1b999 => 'r', 0xe1b99a => 'R', 0xe1b99b => 'r', 0xe1b99c => 'R', 0xe1b99d => 'r', 0xe1b99e => 'R', 0xe1b99f => 'r',
			0xe1b9a0 => 'S', 0xe1b9a1 => 's', 0xe1b9a2 => 'S', 0xe1b9a3 => 's', 0xe1b9a4 => 'S', 0xe1b9a5 => 's', 0xe1b9a6 => 'S', 0xe1b9a7 => 's',
			0xe1b9a8 => 'S', 0xe1b9a9 => 's', 0xe1b9aa => 'T', 0xe1b9ab => 't', 0xe1b9ac => 'T', 0xe1b9ad => 't', 0xe1b9ae => 'T', 0xe1b9af => 't',
			0xe1b9b0 => 'T', 0xe1b9b1 => 't', 0xe1b9b2 => 'U', 0xe1b9b3 => 'u', 0xe1b9b4 => 'U', 0xe1b9b5 => 'u', 0xe1b9b6 => 'U', 0xe1b9b7 => 'u',
			0xe1b9b8 => 'U', 0xe1b9b9 => 'u', 0xe1b9ba => 'U', 0xe1b9bb => 'u', 0xe1b9bc => 'V', 0xe1b9bd => 'v', 0xe1b9be => 'V', 0xe1b9bf => 'v',
			0xe1ba80 => 'W', 0xe1ba81 => 'w', 0xe1ba82 => 'W', 0xe1ba83 => 'w', 0xe1ba84 => 'W', 0xe1ba85 => 'w', 0xe1ba86 => 'W', 0xe1ba87 => 'w', 
			0xe1ba88 => 'W', 0xe1ba89 => 'w', 0xe1ba8a => 'X', 0xe1ba8b => 'x', 0xe1ba8c => 'X', 0xe1ba8d => 'x', 0xe1ba8e => 'Y', 0xe1ba8f => 'y', 
			0xe1ba90 => 'Z', 0xe1ba91 => 'z', 0xe1ba92 => 'Z', 0xe1ba93 => 'z', 0xe1ba94 => 'Z', 0xe1ba95 => 'z', 0xe1ba96 => 'h', 0xe1ba97 => 't',
			0xe1ba98 => 'w', 0xe1ba99 => 'y', 0xe1ba9a => 'a', 0xe1ba9b => 's', 0xe1ba9c => 's', 0xe1ba9d => 's', 0xe1ba9e => 'S', 0xe1ba9f => 'd',
			0xe1baa0 => 'A', 0xe1baa1 => 'a', 0xe1baa2 => 'A', 0xe1baa3 => 'a', 0xe1baa4 => 'A', 0xe1baa5 => 'a', 0xe1baa6 => 'A', 0xe1baa7 => 'a',
			0xe1baa8 => 'A', 0xe1baa9 => 'a', 0xe1baaa => 'A', 0xe1baab => 'a', 0xe1baac => 'A', 0xe1baad => 'a', 0xe1baae => 'A', 0xe1baaf => 'a',
			0xe1bab0 => 'A', 0xe1bab1 => 'a', 0xe1bab2 => 'A', 0xe1bab3 => 'a', 0xe1bab4 => 'A', 0xe1bab5 => 'a', 0xe1bab6 => 'A', 0xe1bab7 => 'a',
			0xe1bab8 => 'E', 0xe1bab9 => 'e', 0xe1baba => 'E', 0xe1babb => 'e', 0xe1babc => 'E', 0xe1babd => 'e', 0xe1babe => 'E', 0xe1babf => 'e',
			0xe1bb80 => 'E', 0xe1bb81 => 'e', 0xe1bb82 => 'E', 0xe1bb83 => 'e', 0xe1bb84 => 'E', 0xe1bb85 => 'e', 0xe1bb86 => 'E', 0xe1bb87 => 'e', 
			0xe1bb88 => 'I', 0xe1bb89 => 'i', 0xe1bb8a => 'I', 0xe1bb8b => 'i', 0xe1bb8c => 'O', 0xe1bb8d => 'o', 0xe1bb8e => 'O', 0xe1bb8f => 'o', 
			0xe1bb90 => 'O', 0xe1bb91 => 'o', 0xe1bb92 => 'O', 0xe1bb93 => 'o', 0xe1bb94 => 'O', 0xe1bb95 => 'o', 0xe1bb96 => 'O', 0xe1bb97 => 'o',
			0xe1bb98 => 'O', 0xe1bb99 => 'o', 0xe1bb9a => 'O', 0xe1bb9b => 'o', 0xe1bb9c => 'O', 0xe1bb9d => 'o', 0xe1bb9e => 'O', 0xe1bb9f => 'o',
			0xe1bba0 => 'O', 0xe1bba1 => 'o', 0xe1bba2 => 'O', 0xe1bba3 => 'o', 0xe1bba4 => 'U', 0xe1bba5 => 'u', 0xe1bba6 => 'U', 0xe1bba7 => 'u',
			0xe1bba8 => 'U', 0xe1bba9 => 'u', 0xe1bbaa => 'U', 0xe1bbab => 'u', 0xe1bbac => 'U', 0xe1bbad => 'u', 0xe1bbae => 'U', 0xe1bbaf => 'u',
			0xe1bbb0 => 'U', 0xe1bbb1 => 'u', 0xe1bbb2 => 'Y', 0xe1bbb3 => 'y', 0xe1bbb4 => 'Y', 0xe1bbb5 => 'y', 0xe1bbb6 => 'Y', 0xe1bbb7 => 'y',
			0xe1bbb8 => 'Y', 0xe1bbb9 => 'y', 0xe1bbba => 'LL', 0xe1bbbb => 'll', 0xe1bbbc => 'V', 0xe1bbbd => 'v', 0xe1bbbe => 'Y', 0xe1bbbf => 'y'
		)
	);
	$i=0;
	$strlen=strlen($string);
	$str="";
	$changes=array();
	$changes['lengthBefore']=array();
	$changes['lengthAfter']=array();
	$changes['indexAfter']=array();
	while ($i<$strlen) {
		$ord=ord($string[$i]);
		if ($i+1<$strlen) {
			$ord2=ord($string[$i+1]);
		} else {
			$ord2=0;
		}
		if (($ord>=195 && $ord<=204) || ($ord===225 && $ord2>=184 && $ord2<=187)) {
			$memI=$i;
			$length=1;
			$hex=dechex($ord);
			while ($i<$strlen-1) {
				if (ord($string[$i+1])>=128 && ord($string[$i+1])<=192) {
					$hex=$hex.dechex(ord($string[$i+1]));
					$i++;
					$length++;
				} else {
					break;
				}
			}
			foreach ($diacriticsEquivalent as $key => $arr) {
				if (strlen($hex)===4 && hexdec($hex)>>8==$key || strlen($hex)===6 && hexdec($hex)>>16==$key) {
					foreach ($arr as $k => $v) {
						if (hexdec($hex)==$k) {
							$str.=$v;
							$changes['lengthBefore'][$memI]=$length;
							$changes['lengthAfter'][$memI]=strlen($v);
							$changes['indexAfter'][$memI]=strlen($str)-strlen($v);
							break;
						}
					}
					break;
				}
			}
			unset($memI);
		} else {
			$str.=$string[$i];
		}
		$i++;
	}
	return array($str, $changes);
}
function pad($s, $chr, $length, $pos) {
	while (strlen($s)<$length) {
		if ($pos=="before") {
			$s=$chr.$s;
		} else if ($pos=="after") {
			$s.=$chr;
		} 
	}
	return $s;
}
function limitChars($str, $length) {
	$enc=mb_detect_encoding($str);
	if (mb_strlen($str, $enc)>$length) {
		$str=mb_substr($str, 0, $length, $enc).'...';
	}
	return $str;
}
function prepareForOut($s) {
	$s=str_replace(',', '&#44;', $s);
	$s=str_replace('<', '&lt;', $s);
	$s=str_replace('>', '&gt;', $s);
	$s=str_replace('[b]', '<b>', $s);
	$s=str_replace('[/b]', '</b>', $s);
	return trim($s);
}
function urlize($str) {
	$woUTF=removeDiacritics(trim(html_entity_decode($str)));
	$woUTF=strtolower($woUTF[0]);
	$ret=preg_replace('/[^a-z0-9]+/', "-", $woUTF);
	$ret=preg_replace('/^(?:-+)?/', "", preg_replace('/(?:-+)?$/', "", $ret));
	return $ret;
}
function rrm($path) {
	if (is_dir($path)) {
		if (substr($path, strlen($path)-1,1)!=="/") {
			$path.="/";
		}
		$i=0;
		$j=0;
		if ($dh=opendir($path)) {
			while (($file=readdir($dh))!==false) {
				if (indexOfInArray($file, array(".",".."))==-1) {
					$i++;
					if (rrm($path.$file)) {
						$j++;
					}
				}
			}
			closedir($dh);
			if ($i===$j && (@rmdir($path) || (@chmod($path, 0777) && @rmdir($path)))) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		if (@unlink($path) || (@chmod($path, 0777) && @unlink($path))) {
			return true;
		} else {
			return false;
		}
	}
}
function makeWritableParentDir($path) {
	$exp=explode('/', $path);
	$c=count($exp);
	$ch=0;
	$i=0;
	$mem="";
	while ($i<count($exp)) {
		if (strlen($exp[$i])>0) {
			$v=$exp[$i];
			array_splice($exp, $i, 1);
			if ($v!==".." && is_dir($mem.$v)) {
				if (is_writable($mem.$v) || @chmod($mem.$v, 0777)) {
					$ch++;
				}
			} else {
				$c--;
			}
			$mem.=$v."/";
		} else {
			$c--;
			array_splice($exp, $i, 1);
		}
	}
	return $ch===$c;
}
function rmove($path1, $path2) {
	if (is_dir($path1)) {
		$i=0;
		$j=0;
		if (((is_dir($path2) && is_writable($path2)) || (makeWritableParentDir($path2) && @mkdir($path2) && @chmod($path2, 0777))) && $dh=opendir($path1)) {
			$toMove=array();
			while (($file=readdir($dh))!==false) {
				if (indexOfInArray($file, array(".",".."))==-1) {
					$toMove[$i]=array($path1."/".$file, $path2."/".$file);
					$i++;
				}
			}
			closedir($dh);
			foreach ($toMove as $v) {
				if (rmove($v[0], $v[1])) {
					$j++;
				}
			}
			if ($i===$j && @rmdir($path1)) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} else {
		if (!file_exists($path2)) {
			if (@rename($path1, $path2) || (@chmod($path1, 0777) && @chmod(dirname($path2), 0777) && @rename($path1, $path2))) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
}
function colorToRGBa($color) {
	$colorStrings=array(
		"aliceblue"=>array(240,248,255),
		"antiquewhite"=>array(250,235,215),
		"aqua"=>array(0,255,255),
		"aquamarine"=>array(127,255,212),
		"azure"=>array(240,255,255),
		"beige"=>array(245,245,220),
		"bisque"=>array(255,228,196),
		"black"=>array(0,0,0),
		"blanchedalmond"=>array(255,235,205),
		"blue"=>array(0,0,255),
		"blueviolet"=>array(138,43,226),
		"brown"=>array(165,42,42),
		"burlywood"=>array(222,184,135),
		"cadetblue"=>array(95,158,160),
		"chartreuse"=>array(127,255,0),
		"chocolate"=>array(210,105,30),
		"coral"=>array(255,127,80),
		"cornflowerblue"=>array(100,149,237),
		"cornsilk"=>array(255,248,220),
		"crimson"=>array(220,20,60),
		"cyan"=>array(0,255,255),
		"darkblue"=>array(0,0,139),
		"darkcyan"=>array(0,139,139),
		"darkgoldenrod"=>array(184,134,11),
		"darkgray"=>array(169,169,169),
		"darkgreen"=>array(0,100,0),
		"darkgrey"=>array(169,169,169),
		"darkkhaki"=>array(189,183,107),
		"darkmagenta"=>array(139,0,139),
		"darkolivegreen"=>array(85,107,47),
		"darkorange"=>array(255,140,0),
		"darkorchid"=>array(153,50,204),
		"darkred"=>array(139,0,0),
		"darksalmon"=>array(233,150,122),
		"darkseagreen"=>array(143,188,143),
		"darkslateblue"=>array(72,61,139),
		"darkslategray"=>array(47,79,79),
		"darkslategrey"=>array(47,79,79),
		"darkturquoise"=>array(0,206,209),
		"darkviolet"=>array(148,0,211),
		"deeppink"=>array(255,20,147),
		"deepskyblue"=>array(0,191,255),
		"dimgray"=>array(105,105,105),
		"dimgrey"=>array(105,105,105),
		"dodgerblue"=>array(30,144,255),
		"firebrick"=>array(178,34,34),
		"floralwhite"=>array(255,250,240),
		"forestgreen"=>array(34,139,34),
		"fuchsia"=>array(255,0,255),
		"gainsboro"=>array(220,220,220),
		"ghostwhite"=>array(248,248,255),
		"gold"=>array(255,215,0),
		"goldenrod"=>array(218,165,32),
		"gray"=>array(128,128,128),
		"grey"=>array(128,128,128),
		"green"=>array(0,128,0),
		"greenyellow"=>array(173,255,47),
		"honeydew"=>array(240,255,240),
		"hotpink"=>array(255,105,180),
		"indianred"=>array(205,92,92),
		"indigo"=>array(75,0,130),
		"ivory"=>array(255,255,240),
		"khaki"=>array(240,230,140),
		"lavender"=>array(230,230,250),
		"lavenderblush"=>array(255,240,245),
		"lawngreen"=>array(124,252,0),
		"lemonchiffon"=>array(255,250,205),
		"lightblue"=>array(173,216,230),
		"lightcoral"=>array(240,128,128),
		"lightcyan"=>array(224,255,255),
		"lightgoldenrodyellow"=>array(250,250,210),
		"lightgray"=>array(211,211,211),
		"lightgreen"=>array(144,238,144),
		"lightgrey"=>array(211,211,211),
		"lightpink"=>array(255,182,193),
		"lightsalmon"=>array(255,160,122),
		"lightseagreen"=>array(32,178,170),
		"lightskyblue"=>array(135,206,250),
		"lightslategray"=>array(119,136,153),
		"lightslategrey"=>array(119,136,153),
		"lightsteelblue"=>array(176,196,222),
		"lightyellow"=>array(255,255,224),
		"lime"=>array(0,255,0),
		"limegreen"=>array(50,205,50),
		"linen"=>array(250,240,230),
		"magenta"=>array(255,0,255),
		"maroon"=>array(128,0,0),
		"mediumaquamarine"=>array(102,205,170),
		"mediumblue"=>array(0,0,205),
		"mediumorchid"=>array(186,85,211),
		"mediumpurple"=>array(147,112,219),
		"mediumseagreen"=>array(60,179,113),
		"mediumslateblue"=>array(123,104,238),
		"mediumspringgreen"=>array(0,250,154),
		"mediumturquoise"=>array(72,209,204),
		"mediumvioletred"=>array(199,21,133),
		"midnightblue"=>array(25,25,112),
		"mintcream"=>array(245,255,250),
		"mistyrose"=>array(255,228,225),
		"moccasin"=>array(255,228,181),
		"navajowhite"=>array(255,222,173),
		"navy"=>array(0,0,128),
		"oldlace"=>array(253,245,230),
		"olive"=>array(128,128,0),
		"olivedrab"=>array(107,142,35),
		"orange"=>array(255,165,0),
		"orangered"=>array(255,69,0),
		"orchid"=>array(218,112,214),
		"palegoldenrod"=>array(238,232,170),
		"palegreen"=>array(152,251,152),
		"paleturquoise"=>array(175,238,238),
		"palevioletred"=>array(219,112,147),
		"papayawhip"=>array(255,239,213),
		"peachpuff"=>array(255,218,185),
		"peru"=>array(205,133,63),
		"pink"=>array(255,192,203),
		"plum"=>array(221,160,221),
		"powderblue"=>array(176,224,230),
		"purple"=>array(128,0,128),
		"red"=>array(255,0,0),
		"rosybrown"=>array(188,143,143),
		"royalblue"=>array(65,105,225),
		"saddlebrown"=>array(139,69,19),
		"salmon"=>array(250,128,114),
		"sandybrown"=>array(244,164,96),
		"seagreen"=>array(46,139,87),
		"seashell"=>array(255,245,238),
		"sienna"=>array(160,82,45),
		"silver"=>array(192,192,192),
		"skyblue"=>array(135,206,235),
		"slateblue"=>array(106,90,205),
		"slategrey"=>array(112,128,144),
		"slategray"=>array(112,128,144),
		"snow"=>array(255,250,250),
		"springgreen"=>array(0,255,127),
		"steelblue"=>array(70,130,180),
		"tan"=>array(210,180,140),
		"teal"=>array(0,128,128),
		"thistle"=>array(216,191,216),
		"tomato"=>array(255,99,71),
		"turquoise"=>array(64,224,208),
		"violet"=>array(238,130,238),
		"wheat"=>array(245,222,179),
		"white"=>array(255,255,255),
		"whitesmoke"=>array(245,245,245),
		"yellow"=>array(255,255,0),
		"yellowgreen"=>array(154,205,50),
		"transparent"=>array(0,0,0,0)
	);
	$cssColorHex6='/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i';
	$cssColorHex3='/#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})/i';
	$cssColorRGB='/rgb\(([0-9]{1,3}),[ ]?([0-9]{1,3}),[ ]?([0-9]{1,3})\)/i';
	$cssColorRGBa='/rgba\(([0-9]{1,3}),[ ]?([0-9]{1,3}),[ ]?([0-9]{1,3}),[ ]?((?:1(?:\.0+)?)|0(?:\.[0-9]+)?)\)/i';
	if (gettype($color)==="string") {
		if (array_key_exists($color, $colorStrings)) {
			$o=array( "r"=>(int)($colorStrings[$color][0]), "g"=>(int)($colorStrings[$color][1]), "b"=>(int)($colorStrings[$color][2]), "a"=>(array_key_exists(3, $colorStrings[$color])?(float)$colorStrings[$color][3]:1) );
		} else if (preg_match($cssColorHex6, $color)) {
			$matches=array();
			preg_match($cssColorHex6, $color, $matches);
			$o=array( "r"=>hexdec($matches[1]), "g"=>hexdec($matches[2]), "b"=>hexdec($matches[3]), "a"=>1 );
		} else if (preg_match($cssColorHex3, $color)) {
			$matches=array();
			preg_match($cssColorHex3, $color, $matches);
			$o=array( "r"=>hexdec($matches[1].$matches[1]), "g"=>hexdec($matches[2].$matches[2]), "b"=>hexdec($matches[3].$matches[3]), "a"=>1 );
		} else if (preg_match($cssColorRGB, $color)) {
			$matches=array();
			preg_match($cssColorRGB, $color, $matches);
			$o=array( "r"=>(int)$matches[1], "g"=>(int)$matches[2], "b"=>(int)$matches[3], "a"=>1 );
		} else if (preg_match($cssColorRGBa, $color)) {
			$matches=array();
			preg_match($cssColorRGBa, $color, $matches);
			$o=array( "r"=>(int)$matches[1], "g"=>(int)$matches[2], "b"=>(int)$matches[3], "a"=>(float)$matches[4] );
		}
		return $o;
	}
	return false;
}
function escapeForRegExp($str) {
	$specialChars=array('\\','[',']','{','}','(',')','?','*','+','/','|','^','$');
	for ($i=0; $i<count($specialChars); $i++) {
		if (preg_match('/\\'.$specialChars[$i].'/', $str)) {
			$str=preg_replace('/\\'.$specialChars[$i].'/', "\\".$specialChars[$i], $str);
		}
	}
	return $str;
}
?>