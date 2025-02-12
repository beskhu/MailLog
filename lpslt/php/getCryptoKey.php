<?php 
	include_once(__DIR__.'/session.php');
	include_once(__DIR__.'/locales.php');
	if (isset($_SESSION['auth'], $_POST['publicKey']) && $_SESSION['auth']) {
		include_once(__DIR__.'/generateCryptoKey.php');
		$passphrase=generateCryptoKey();
		$token=getToken();
		$encrypted="";
		$encryptedToken="";
		openssl_public_encrypt($passphrase, $encrypted, $_POST['publicKey']);
		openssl_public_encrypt($token, $encryptedToken, $_POST['publicKey']);
		echo json_encode(array("message"=>"ok", "encrypted"=>bin2hex($encrypted), "encryptedToken"=>bin2hex($encryptedToken)));
	} else {
		if (!isset($_SESSION['locales']) && file_exists(__DIR__.'/locales.php')) {
			include_once(__DIR__.'/locales.php');
		}
		echo json_encode(array("message"=>$_SESSION['locales']['authNeeded'][$_SESSION['current-language']]));
	}
?>