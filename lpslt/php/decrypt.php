<?php
	function decryptAESandParseJSON($str, $passphrase) {
		$decrypted=decryptAES($str, $passphrase, substr($passphrase,0,32), true);
		if (strlen($decrypted)>0) {
			$json=json_decode($decrypted, true);
			return $json;
		} else {
			error_log("unable to decrypt client request in file 'php/decrypt.php'",0);
			return array();
		}
	}
	function decryptAES($str, $key, $iv, $b64=true) {
		if (strlen($str)%2!==0) {
			$str="0".$str;
		}
		$str=hex2bin($str);
		if ($b64) {
			$str=base64_decode($str);
		}
		$decrypted=openssl_decrypt($str, "aes-256-cbc", hex2bin($key), 0, hex2bin($iv));
		return $decrypted;
	}
?>