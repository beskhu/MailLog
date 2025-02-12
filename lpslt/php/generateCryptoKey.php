<?php
	include_once(__DIR__.'/session.php');
	function uniqidReal($length = 13) {
	    // uniqid gives 13 chars, but you could adjust it to your needs.
	    if (function_exists("random_bytes")) {
			$bytes = random_bytes(ceil($length / 2));
	    } elseif (function_exists("openssl_random_pseudo_bytes")) {
			$bytes = openssl_random_pseudo_bytes(ceil($length / 2));
	    } else {
			throw new Exception("no cryptographically secure random function available");
	    }
	    return substr(bin2hex($bytes), 0, $length);
	}
	function generateRsa($pkbits=512) {
	   	$rsaKey = array('private' => '', 'public' => '', 'error' => '');
	   	$pkbits = intval($pkbits);
	   	if ($pkbits != 512 && $pkbits != 1024 && $pkbits != 2048) {
	      		$rsaKey['error'] = 'Private key bits must be 512, 1024 or 2048';
	      		return $rsaKey;
	   	}
	   	$res = openssl_pkey_new(array('private_key_bits' => $pkbits));
 
	   	// Get private key
	   	openssl_pkey_export($res, $privkey);
 
	   	// Get public key
	   	$pubkey = openssl_pkey_get_details($res);
	   	
	   	$rsaKey['private'] = $privkey;
	   	$rsaKey['public'] = $pubkey['key'];
	   	return $rsaKey;
	}
	function generateCryptoKey() {
		try {
			$passphrase=uniqidReal(64);
			$_SESSION['passphrase']=$passphrase;
			return $passphrase;
		} catch(Exception $e) {
			return "Error: ".$e;
		}
	}
	function getToken() {
		try {
			$token=uniqidReal(32);
			$_SESSION['token']=$token;
			return $token;
		} catch(Exception $e) {
			return "Error: ".$e;
		}
	}
?>