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
			if ((int)$decrypted['is_new'][$i]===1 && $_SESSION['level']>=1) {
				if ((int)$decrypted['level'][$i]<=$_SESSION['level']-1) {
					$salt=substr(hash("sha512", mt_rand(0, mt_getrandmax())), 0, 16);
					error_log($decrypted['pass'][$i], 0);
					$keyValueArray=[
						"admin_user_id"=>$_SESSION['user_id'],
						"firstname"=>$decrypted['firstname'][$i],
						"lastname"=>$decrypted['lastname'][$i],
						"email"=>$decrypted['email'][$i],
						"pass"=>"$6$".$salt."$".hash("sha512", $salt.$decrypted['pass'][$i]),
						"prefered_locale"=>$decrypted['prefered_locale'][$i],
						"status"=>$decrypted['status'][$i],
						"level"=>$decrypted['level'][$i]
					];
					$r=$mysql::insertAll("users", $keyValueArray);
					$res["insert"]=$r;
				} else {
					$res=["error_".$decrypted['id'][$i]=>"notAllowedToAddUserOfThisLevel"];
				}
			} else {
				$rTest=$mysql::selectAllForId("users", $decrypted['id'][$i], null);
				if ((array_key_exists("admin_user_id", $rTest) && (int)$rTest["admin_user_id"][0]===(int)$_SESSION['user_id']) || $_SESSION['level']===2) {
					$whereArray=[
						[
							"name"=>"id",
							"operator"=>"=",
							"value"=>$decrypted['id'][$i],
							"and|or"=>null
						]
					];
					if ((int)$decrypted['level'][$i]<=$_SESSION['level']-1 || $_SESSION['level']===2) {
						$salt=substr(hash("sha512", mt_rand(0, mt_getrandmax())), 0, 16);
						$keyValueArray=[
							"firstname"=>$decrypted['firstname'][$i],
							"lastname"=>$decrypted['lastname'][$i],
							"email"=>$decrypted['email'][$i],
							"prefered_locale"=>$decrypted['prefered_locale'][$i],
							"status"=>$decrypted['status'][$i],
							"level"=>$decrypted['level'][$i]
						];
						if ($decrypted['pass'][$i]!=="••••••••••") {
							$keyValueArray["pass"]="$6$".$salt."$".hash("sha512", $salt.$decrypted['pass'][$i]);
						}
						$r=$mysql::updateWhere("users", $keyValueArray, $whereArray, null);
						$res["update_".$decrypted['id'][$i]]=$r;
					}
				} else {
					$res=["error_".$decrypted['id'][$i]=>"notAllowedToModifyThisUser"];
				}
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