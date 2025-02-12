<?php
error_reporting(E_ALL);
include_once(__DIR__.'/session.php');
include_once(__DIR__.'/decrypt.php');
include_once(__DIR__.'/encrypt.php');
include_once(__DIR__.'/mysql_utils.php');
include_once(__DIR__.'/getDatabaseAESkeyAndIv.php');
if (isset($_SESSION['auth'], $_POST['encrypted']) && $_SESSION['auth']) {
	$res=[];
	$data=$_POST['encrypted'];
	$keyAndIv=getDatabaseAESkeyAndIv();
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	if (!!$keyAndIv && gettype($decrypted)==="array" && array_key_exists("identifier", $decrypted) && array_key_exists("password", $decrypted) && array_key_exists("server", $decrypted) && array_key_exists("port", $decrypted) && array_key_exists("ssl_cert", $decrypted) && array_key_exists("active", $decrypted)) {
		$mysql=new mysqlUtils();
		$whereArray=[
			[
				"name"=>"id",
				"operator"=>"=",
				"value"=>1,
				"and|or"=>null
			]
		];
		$keyValueArray=[
			"identifier"=>$decrypted['identifier'],
			"password"=>encryptAES($decrypted['password'], $keyAndIv["key"], $keyAndIv["iv"]),
			"server"=>$decrypted['server'],
			"port"=>$decrypted['port'],
			"ssl_cert"=>$decrypted['ssl_cert'],
			"active"=>$decrypted['active'],
			"report_locale"=>$decrypted['report_locale'],
			"recipients"=>$decrypted['recipients']
		];
		$r=$mysql::updateWhere("data_smtp_account", $keyValueArray, $whereArray, null);
		$res["update"]=$r;
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