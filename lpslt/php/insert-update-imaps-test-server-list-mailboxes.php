<?php
error_reporting(E_ALL);
include_once(__DIR__.'/Fetch/autoload.php');
use Fetch\Server;
use Fetch\Message;
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
	if (!!$keyAndIv && gettype($decrypted)==="array" && array_key_exists("id", $decrypted)) {
		$mysql=new mysqlUtils();
		for ($i=0; $i<count($decrypted['id']); $i++) {
			if ((int)$decrypted['to_be_tested'][$i]===1) {
				$server = new Server($decrypted['server'][$i], $decrypted['port'][$i]);
				if ((int)$decrypted['ssl_cert'][$i]===1) {
					$server->setFlag("ssl");
				}
				if ((int)$decrypted['check_cert'][$i]===0) {
					$server->setFlag("novalidate-cert");
				}
				$server->setAuthentication($decrypted['imap_identifier'][$i], $decrypted['imap_password'][$i]);
				if (is_object($server)) {
					try {
						$mailboxes=$server->listMailBoxes();
						$res["check_".$decrypted['id'][$i]]=["result"=>print_r($mailboxes, true)];
					} catch (RuntimeException $e) {
						$res["check_".$decrypted['id'][$i]]=["error"=>(string)$e];
					}
				}
			}
			if ((int)$decrypted['is_new'][$i]===1) {
				$keyValueArray=[
					"admin_user_id"=>$_SESSION['user_id'],
					"identifier"=>$decrypted['imap_identifier'][$i],
					"password"=>encryptAES($decrypted['imap_password'][$i], $keyAndIv["key"], $keyAndIv["iv"]),
					"server"=>$decrypted['server'][$i],
					"port"=>$decrypted['port'][$i],
					"ssl_cert"=>$decrypted['ssl_cert'][$i],
					"check_cert"=>$decrypted['check_cert'][$i],
					"active"=>$decrypted['active'][$i]
				];
				$r=$mysql::insertAll("data_imap_accounts", $keyValueArray);
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
					"admin_user_id"=>$_SESSION['user_id'],
					"identifier"=>$decrypted['imap_identifier'][$i],
					"password"=>encryptAES($decrypted['imap_password'][$i], $keyAndIv["key"], $keyAndIv["iv"]),
					"server"=>$decrypted['server'][$i],
					"port"=>$decrypted['port'][$i],
					"ssl_cert"=>$decrypted['ssl_cert'][$i],
					"check_cert"=>$decrypted['check_cert'][$i],
					"active"=>$decrypted['active'][$i]
				];
				$r=$mysql::updateWhere("data_imap_accounts", $keyValueArray, $whereArray, null);
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