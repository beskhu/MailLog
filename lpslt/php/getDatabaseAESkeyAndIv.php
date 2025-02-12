<?php
function getDatabaseAESkeyAndIv() {
	include_once(__DIR__.'/mysql_utils.php');
	$mysql=new mysqlUtils();
	$r=$mysql::selectAllForId("crypto_keys", 1, null);
	if (array_key_exists("id", $r) && count($r["id"])===1) {
		return ["key"=>preg_replace('/[^a-f0-9]/is', "", $r["crypto_key"][0]), "iv"=>preg_replace('/[^a-f0-9]/is', "", $r["crypto_iv"][0])];
	} else return false;
}
?>