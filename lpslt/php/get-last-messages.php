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
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	$keyAndIv=getDatabaseAESkeyAndIv();
	if (!!$keyAndIv && gettype($decrypted)==="array" && array_key_exists("id", $decrypted) && array_key_exists("folder", $decrypted)) {
		$mysql=new mysqlUtils();
		$r=$mysql::selectAllForId("data_imap_accounts", $decrypted["id"], null);
		if (array_key_exists("id", $r) && count($r["id"])===1) {
			$server = new Server($r['server'][0], $r['port'][0]);
			if ((int)$r['ssl_cert'][0]===1) {
				$server->setFlag("ssl");
			}
			if ((int)$r['check_cert'][0]===0) {
				$server->setFlag("novalidate-cert");
			}
			$server->setAuthentication($r['identifier'][0], decryptAES($r['password'][0], $keyAndIv["key"], $keyAndIv["iv"]));
			if (is_object($server)) {
				try {
					if ($server->setMailBox($decrypted["folder"])) {
						$msg=$server->getOrderedMessages(SORTARRIVAL, true, (int)$decrypted["offset"]+10);
						$messages=[];
						if (is_array($msg)) {
							foreach ($msg as $m) {
								if (is_object($m)) {
									$uid=(string)$m->getUid();
									$from=(string)$m->getAddresses("from", true);
									$subject=(string)$m->getSubject();
									$body=(string)$m->getMessageBody(true);
									$body=preg_replace('/<style(?:[^>]*)>(.*)<\/style>/isU', "", $body);
									$body=trim(preg_replace('/\v+/s', "\n", preg_replace('/<[^>]+>/isU', "\n", $body)));
									$messages[]=["uid"=>$uid,"from"=>$from,"subject"=>$subject,"body"=>mb_substr($body, 0, 325)."…"];
								}
							}
							$res["result"]=$messages;
						} else {
							$res["error"]="unableToGetMessages";
						}
					} else {
						$res["error"]="unableToGetMessages";
					}
				} catch (RuntimeException $e) {
					$res["error"]=(string)$e;
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