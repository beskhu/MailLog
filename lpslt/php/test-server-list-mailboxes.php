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
	if (!!$keyAndIv && gettype($decrypted)==="array" && array_key_exists("id", $decrypted)) {
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
				$imapSeparator="guess";
				try {
					$mailboxes=$server->listMailBoxes();
					for ($i=0; $i<count($mailboxes); $i++) {
						if (preg_match('/\&[^\s]*-/i', $mailboxes[$i])) {
							$utf8=imap_mutf7_to_utf8($mailboxes[$i]);
							$mailboxes[$i]=$utf8;
						}
						if (preg_match('/\&[^;]*;/i', $mailboxes[$i])) {
							$utf8=html_entity_decode($mailboxes[$i]);
							$mailboxes[$i]=$utf8;
						}
						if ($server->setMailBox(preg_replace('/^\{.+\}(.+)/', "$1", $mailboxes[$i]))) {
							if ($imapSeparator==="guess" && preg_match("/^.*\}(?:[^\/\.]+)([\/\.]{1}).+$/", $mailboxes[$i])) {
								$imapSeparator=preg_replace("/^.*\}(?:[^\/\.]+)([\/\.]{1}).+$/", "$1", $mailboxes[$i]);
							}
							continue;
						} else {
							//let's suppose the mailbox does not exist, due to a bad separator interpretation
							array_splice($mailboxes, $i--, 1);
						}
					}
					$res["check_".$r['id'][0]]=["result"=>$mailboxes,"separator"=>$imapSeparator];
				} catch (RuntimeException $e) {
					$res["check_".$r['id'][0]]=["error"=>(string)$e];
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