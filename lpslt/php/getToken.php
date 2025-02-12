<?php 
	include_once(__DIR__.'/session.php');
	include_once(__DIR__.'/locales.php');
	include_once(__DIR__.'/decrypt.php');
	include_once(__DIR__.'/encrypt.php');
	if (isset($_SESSION['auth'], $_POST['encrypted']) && $_SESSION['auth']) {
		$data=$_POST['encrypted'];
		$res=[];
		$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
		if (gettype($decrypted)==="array" && array_key_exists("getToken", $decrypted) && $decrypted["getToken"]==="true") {
			include_once(__DIR__.'/mysql_utils.php');
			$mysql=new mysqlUtils();
			$r=$mysql::SelectAllForId("token", 1, null);
			if (array_key_exists("id", $r) && count($r["id"])>0) {
				$res=["token"=>$r["token"][0]];
			} else if (array_key_exists("error", $r)) {
				$res=["error"=>$r["error"]];
			} else {
				$res=["error"=>"couldNotGetTokenFromDatabase"];
			}
		} else {
			$res=["error"=>"unableToDecryptClientRequest"];
		}
		$encrypted=encodeToJSONifArrayAndEncryptAES($res, $_SESSION['passphrase']);
		echo $encrypted;
	} else {
		if (!isset($_SESSION['locales']) && file_exists(__DIR__.'/locales.php')) {
			include_once(__DIR__.'/locales.php');
		}
		echo json_encode(array("message"=>$_SESSION['locales']['authNeeded'][$_SESSION['current-language']]));
	}
?>