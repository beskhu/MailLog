<?php
header('X-Accel-Buffering: no');
@ini_set('zlib.output_compression',0);
error_reporting(E_ALL);
include_once(__DIR__.'/Fetch/autoload.php');
use Fetch\Server;
use Fetch\Message;
include_once(__DIR__.'/session.php');
include_once(__DIR__.'/decrypt.php');
include_once(__DIR__.'/encrypt.php');
include_once(__DIR__.'/getDatabaseAESkeyAndIv.php');
include_once(__DIR__.'/mysql_utils.php');
include_once(__DIR__.'/utils.php');
include_once(__DIR__.'/locales.php');
$mysql=new mysqlUtils();
if (isset($_SESSION['auth'], $_POST['encrypted']) && $_SESSION['auth']) {
	$data=$_POST['encrypted'];
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	if (gettype($decrypted)==="array" && array_key_exists("token", $decrypted)) {
		$token=$decrypted['token'];
		$start=$decrypted['start'];
		if (array_key_exists('mem_imap_account_id_plus_path', $decrypted)) {
			$mem_imap_account_id_plus_path=$decrypted['mem_imap_account_id_plus_path'];
		}
	} else {
		$token="";
	}
	$commandline=false;
} else if (isset($_POST['token'])) {
	$token=$_POST['token'];
	$commandline=false;
	$start=0;
} else if (isset($_GET['token'])) {
	$token=$_GET['token'];
	$commandline=false;
	$start=0;
} else if (isset($argc) && $argc>1 && preg_match('/^token=[a-z0-9-]+$/', $argv[1])) {
	$commandline=true;
	$token=preg_replace('/^token=([a-z0-9-]+)$/', "$1", $argv[1]);
	$start=0;
	$dayOffset=0;
}
if (!$commandline) {
	$_SESSION['dayOffset']=-1;
}
if (isset($token)) {
	$w0=[
		[
			"name"=>"token",
			"operator"=>"=",
			"value"=>$token,
			"and|or"=>null
		]
	];
	$r0=$mysql::selectAllWhere("token", $w0, null);
	if (array_key_exists("id", $r0) && count($r0["id"])>0) {
		$_SESSION["cronAuth"]=true;
	}
}
$keyAndIv=getDatabaseAESkeyAndIv();
if (!!$keyAndIv && isset($_SESSION["cronAuth"]) && $_SESSION["cronAuth"]) {
	ob_start();
	$time=time();
	$c=0;
	$w1=[
		[
			"name"=>"active",
			"operator"=>"=",
			"value"=>"1",
			"and|or"=>null
		]
	];
	$r1=$mysql::selectAllWhere("data_services", $w1, null);
	if (array_key_exists("id", $r1) && count($r1["id"])>0) {
		if (!isset($mem_imap_account_id_plus_path)) {
			$mem_imap_account_id_plus_path=null;
		}
		$errorDetected=false;
		for ($i=$start; $i<count($r1['id']); $i++) {
			if ((int)$r1['imap_account_id'][$i]>0 && $r1['imap_account_id'][$i].'|'.$r1['imap_path'][$i]!==$mem_imap_account_id_plus_path && preg_match('/[0-9]+/', $r1["cleaning_timeout_hours"][$i])) {
				$r1["cleaning_actions"][$i]=json_decode($r1["cleaning_actions"][$i], true);
				$r2=$mysql::selectAllForId("data_imap_accounts", $r1['imap_account_id'][$i], null);
				if (array_key_exists("id", $r2) && count($r2["id"])===1 && array_key_exists("active", $r2) && (int)$r2["active"][0]===1) {
					$server = new Server($r2['server'][0], $r2['port'][0]);
					if ((int)$r2['ssl_cert'][0]===1) {
						$server->setFlag("ssl");
					}
					if ((int)$r2['check_cert'][0]===0) {
						$server->setFlag("novalidate-cert");
					}
					$server->setAuthentication($r2['identifier'][0], decryptAES($r2['password'][0], $keyAndIv["key"], $keyAndIv["iv"]));
					if (is_object($server)) {
						try { // to catch any error
							if ($server->setMailBox($r1["imap_path"][$i])) {
								set_time_limit(180);//allow 180 seconds for cleaning each loop iteration;
								$toBeContinued=true;
								$memTime=time();
								$msg=[];
								while ($toBeContinued) {
									if ($commandline) { //getOrderedMessagesFromDateToDate
										$msg=array_merge(
											$msg,
											$server->getOrderedMessagesSinceDateBeforeDate(
												SORTARRIVAL,
												1,
												-1,
												date(
													"Ymd",
													$time-($dayOffset+1)*24*3600
												),
												date(
													"Ymd",
													$time-($dayOffset)*24*3600
												)
											)
										);
										if (time()-$memTime<15) {
											echo "time elapsed:".(time()-$memTime)."-".json_encode(["start"=>$i, "total"=>count($r1['id'])])."|";
											ob_flush();
											flush();
											$toBeContinued=true;
											$dayOffset++;
											if ($dayOffset>3650) {
												$toBeContinued=false;
											}
										} else {
											$toBeContinued=false;
										}
									} else {
										$msg=array_merge(
											$msg,
											$server->getOrderedMessagesSinceDateBeforeDate(
												SORTARRIVAL,
												1,
												-1,
												date(
													"Ymd",
													$time-($_SESSION['dayOffset']+1)*24*3600
												),
												date(
													"Ymd",
													$time-($_SESSION['dayOffset'])*24*3600
												)
											)
										);
										if (time()-$memTime<15) {
											echo "time elapsed:".(time()-$memTime)."-".json_encode(["start"=>$i, "total"=>count($r1['id'])])."|";
											ob_flush();
											flush();
											$toBeContinued=true;
											$_SESSION['dayOffset']++;
											if ($_SESSION['dayOffset']>3650) {
												$toBeContinued=false;
											}
										} else {
											$toBeContinued=false;
										}
									}
								}
								for ($k=0; $k<count($msg); $k++) {
									$time=(int)$msg[$k]->getDate();// an int
									if ($time+(int)$r1["cleaning_timeout_hours"][$i]*3600<time() && is_array($r1["cleaning_actions"][$i])) {
										for ($j=0; $j<count($r1["cleaning_actions"][$i]); $j++) {
											if (array_key_exists("action", $r1["cleaning_actions"][$i][$j])) {
												switch($r1["cleaning_actions"][$i][$j]["action"]) {
													case "moveToImapFolder":
														$actionStatus=$msg[$k]->moveToMailBox($r1["cleaning_actions"][$i][$j]["argument"]);
														$c++;
													break;
													case "setFlag":
														$actionStatus=$msg[$k]->setFlag($r1["cleaning_actions"][$i][$j]["argument"], true);
														$c++;
													break;
													case "clearFlag":
														$actionStatus=$msg[$k]->setFlag($r1["cleaning_actions"][$i][$j]["argument"], false);
														$c++;
													break;
													case "markAsRead":
														$r1["cleaning_actions"][$i][$j]["argument"]="\\Seen";
														$actionStatus=$msg[$k]->setFlag($r1["cleaning_actions"][$i][$j]["argument"], true);
														$c++;
													break;
													case "deleteMessage":
														$r1["cleaning_actions"][$i][$j]["argument"]="\\Deleted";
														$c++;
														$actionStatus=$msg[$k]->delete();
													break;
												}
												$cleaningActions[$r1["cleaning_actions"][$i][$j]["action"]." ".$r1["cleaning_actions"][$i][$j]["argument"]]=$actionStatus;
											}
										}
									}
								}
								$server->expunge();
								echo json_encode(["start"=>$i+1, "total"=>count($r1['id']), "treated"=>$c, "mem_imap_account_id_plus_path"=>$mem_imap_account_id_plus_path]);
								ob_end_flush();
								exit();
							}
						} catch (RuntimeException $e) {
							echo "Error : ".(string)$e."<br />\r\n";
						}
					}
				}
			}
		}
	}
	echo "done";
	ob_end_flush();
	exit();
} else {
	echo "badToken";
}
$mysql::closeMysql();
?>