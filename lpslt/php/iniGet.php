<?php
	include_once(__DIR__.'/session.php');
	if (isset($_SESSION['auth'], $_SESSION['passphrase'], $_POST['encrypted']) && $_SESSION['auth']) {
		include_once('./decrypt.php');
		$params=decryptAESandParseJSON($_POST['encrypted'], $_SESSION['passphrase']);
		if (count($params)>0) {
			$array=[];
			foreach($params as $v) {
				$array[$v]=ini_get($v);
			}
			include_once(__DIR__.'/encrypt.php');
			$encrypted=encodeToJSONifArrayAndEncryptAES($array, $_SESSION['passphrase']);
			echo json_encode(array("message"=>"ok", "encrypted"=>$encrypted));
		} else {
			if (!isset($_SESSION['locales']) && file_exists(__DIR__.'/locales.php')) {
				include_once(__DIR__.'/locales.php');
			}
			echo json_encode(array("message"=>$_SESSION['locales']['unableToDecryptClientRequest'][$_SESSION['current-language']]));
		}
	} else {
		if (!isset($_SESSION['locales']) && file_exists(__DIR__.'/locales.php')) {
			include_once(__DIR__.'/locales.php');
		}
		echo json_encode(array("message"=>$_SESSION['adminLocales']['authNeeded'][$_SESSION['current-language']]));
	}
?>