<?php
	function encodeToJSONifArrayAndEncryptAES($obj, $passphrase) {
		if (is_array($obj)) {
			$str=json_encode($obj);
		} else {
			$str=(string)$obj;
		}
		return encryptAES($str, $passphrase, substr($passphrase, 0, 32), false);
	}
	function encryptAES($str, $key, $iv, $b64=true) {
		$encrypted=openssl_encrypt($str, "aes-256-cbc", hex2bin($key), 0, hex2bin($iv));
		if ($b64) {
			$encrypted=base64_encode($encrypted);
		}
		return bin2hex($encrypted);
	}
?>