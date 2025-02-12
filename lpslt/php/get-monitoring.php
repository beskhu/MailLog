<?php
include_once(__DIR__.'/session.php');
include_once(__DIR__.'/decrypt.php');
include_once(__DIR__.'/encrypt.php');
include_once(__DIR__.'/mysql_utils.php');
if (isset($_SESSION['auth'], $_POST['encrypted'], $_SESSION['passphrase']) && $_SESSION['auth']) {
	$res=[];
	$data=$_POST['encrypted'];
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	if (gettype($decrypted)==="array" && array_key_exists("id", $decrypted)) {
		$mysql=new mysqlUtils();
		$r=$mysql::selectAllWhere("data_services", [["name"=>"id","operator"=>"=","value"=>$decrypted["id"],"and|or"=>"and"], ["name"=>"admin_user_id","operator"=>"=","value"=>$_SESSION["user_id"],"and|or"=>null]], null);
		$res=$r;
		$mysql::closeMysql();
	} else {
		$res=["error"=>"unableToDecryptClientRequest"];
	}
	$encrypted=encodeToJSONifArrayAndEncryptAES($res, $_SESSION['passphrase']);
	echo $encrypted;
} else {
	echo 'noAuth';
}
?>