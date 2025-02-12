<?php
error_reporting(E_ALL);
include_once(__DIR__.'/Fetch/autoload.php');
use Fetch\Server;
use Fetch\Message;
include_once(__DIR__.'/session.php');
include_once(__DIR__.'/decrypt.php');
include_once(__DIR__.'/encrypt.php');
if (isset($_SESSION['auth'], $_POST['encrypted']) && $_SESSION['auth']) {
	$res=[];
	$data=$_POST['encrypted'];
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	if (gettype($decrypted)==="array" && array_key_exists("id", $decrypted)) {
		for ($i=0; $i<count($decrypted['id']); $i++) {
			$server = new Server($decrypted['server'][$i], $decrypted['port'][$i]);
			if ((int)$decrypted['ssl_cert'][$i]===1) {
				$server->setFlag("ssl");
			}
			if ((int)$decrypted['check_cert'][$i]===0) {
				$server->setFlag("novalidate-cert");
			}
			$server->setAuthentication($decrypted['identifier'][$i], $decrypted['password'][$i]);
			if (is_object($server)) {
				try {
					$mailboxes=$server->listMailBoxes();
					$res["check_".$decrypted['id'][$i]]=["result"=>print_r($mailboxes, true)];
				} catch (RuntimeException $e) {
					$res["check_".$decrypted['id'][$i]]=["error"=>(string)$e];
				}
			}
		}
	} else {
		$res=["error"=>"unableToDecryptClientRequest"];
	}
	$encrypted=encodeToJSONifArrayAndEncryptAES($res, $_SESSION['passphrase']);
	echo $encrypted;
} else {
	echo 'noAuth';
}
?>