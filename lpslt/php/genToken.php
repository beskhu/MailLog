<?php 
	include_once(__DIR__.'/session.php');
	include_once(__DIR__.'/locales.php');
	include_once(__DIR__.'/decrypt.php');
	include_once(__DIR__.'/encrypt.php');
	if (isset($_SESSION['auth']) && $_SESSION['auth']) {
		include_once(__DIR__.'/mysql_utils.php');
		include_once(__DIR__.'/utils.php');
		$token=guid();
		$mysql=new mysqlUtils();
		$r=$mysql::updateWhere("token", ["token"=>$token], [["name"=>"id","operator"=>"=","value"=>"1","and|or"=>null]]);
		if (array_key_exists("message", $r) && $r["message"]==="ok") {
			$res=["message"=>"ok", "token"=>$token];
		} else if (array_key_exists("error", $r)) {
			$res=["message"=>"ko", "error"=>$r["error"]];
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