<?php
error_reporting(E_ALL);
include_once(__DIR__.'/session.php');
include_once(__DIR__.'/decrypt.php');
include_once(__DIR__.'/encrypt.php');
include_once(__DIR__.'/mysql_utils.php');
if (isset($_SESSION['auth'], $_POST['encrypted']) && $_SESSION['auth']) {
	$res=[];
	$data=$_POST['encrypted'];
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	if (gettype($decrypted)==="array" && array_key_exists("id", $decrypted)) {
		$mysql=new mysqlUtils();
		for ($i=0; $i<count($decrypted['id']); $i++) {
			if ((int)$decrypted['is_new'][$i]===1) {
				$keyValueArray=[
					"admin_user_id"=>$_SESSION['user_id'],
					"name"=>$decrypted['name'][$i],
					"active"=>$decrypted['active'][$i]
				];
				$r=$mysql::insertAll("data_customers", $keyValueArray);
				$r["ref_id"]=$decrypted['id'][$i];
				$res["insert"]=$r;
			} else {
				$whereArray=[
					[
						"name"=>"id",
						"operator"=>"=",
						"value"=>$decrypted['id'][$i],
						"and|or"=>null
					]
				];
				$keyValueArray=[
					"name"=>$decrypted['name'][$i],
					"active"=>$decrypted['active'][$i]
				];
				$r=$mysql::updateWhere("data_customers", $keyValueArray, $whereArray, null);
				$res["update_".$decrypted['id'][$i]]=$r;
			}
		}
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