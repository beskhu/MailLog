<?php
header('X-Accel-Buffering: no');
@ini_set('zlib.output_compression',0);
date_default_timezone_set("Europe/Paris");
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
function prepareForRegex($str) {
	$str=preg_replace_callback('/[\-\^\$\(\)\{\}\[\]\.\?\+\*\/\|\\\]/', function($m) { return "\\".$m[0]; }, $str);
	$str=preg_replace('/\h+/', "(?:\\h|\\xC2\\xA0|\\v|&nbsp;|<br ?\/?>)+", $str);
	return $str;
}
function detectDate($matches, $month) {
	if (strlen($matches[1])>=3) {
		$line=$matches[0];
		$regHour='/\b([0-1]?[0-9]|2[0-3])\:([0-5][0-9])(?:\:([0-5][0-9]))?\b/';
		$m=[];
		$hoursMinutesSeconds="";
		$hours="";
		$minutes="";
		$seconds="";
		if (preg_match($regHour, $line, $m)) {
			$hoursMinutesSeconds=$m[0];
			$hours=$m[1];
			$minutes=$m[2];
			$seconds=$m[3];
			$line=substr($line, 0, strpos($line, $hoursMinutesSeconds)).substr($line, strpos($line, $hoursMinutesSeconds)+strlen($hoursMinutesSeconds), strlen($line)-(strpos($line, $hoursMinutesSeconds)+strlen($hoursMinutesSeconds)));
		}
		$regDay='/\b[0-9]|[1-2][0-9]|3[0-1]\b/';
		$m=[];
		$day="";
		if (preg_match($regDay, $line, $m)) {
			$day=$m[0];
			$line=substr($line, 0, strpos($line, $day)).substr($line, strpos($line, $day)+strlen($day), strlen($line)-(strpos($line, $day)+strlen($day)));
		}
		$regYear='/\b[0-9]{4}\b/';
		$m=[];
		$year="";
		if (preg_match($regYear, $line, $m)) {
			$year=$m[0];
			$line=substr($line, 0, strpos($line, $year)).substr($line, strpos($line, $year)+strlen($year), strlen($line)-(strpos($line, $year)+strlen($year)));
		}
		return ["hours"=>(int)$hours,"minutes"=>(int)$minutes,"seconds"=>(int)$seconds,"day"=>(int)$day,"month"=>$month,"year"=>(int)$year];
	} else {
		return [];
	}
}
function detectHoursMinutesSeconds($line) {
	$regHour='/\b([0-1]?[0-9]|2[0-3])\:([0-5][0-9])(?:\:([0-5][0-9]))?\b/';
	$m=[];
	$hoursMinutesSeconds="";
	$hours="";
	$minutes="";
	$seconds="";
	if (preg_match($regHour, $line, $m)) {
		$hoursMinutesSeconds=$m[0];
		$hours=$m[1];
		$minutes=$m[2];
		$seconds=$m[3];
		$line=substr($line, 0, strpos($line, $hoursMinutesSeconds)).substr($line, strpos($line, $hoursMinutesSeconds)+strlen($hoursMinutesSeconds), strlen($line)-(strpos($line, $hoursMinutesSeconds)+strlen($hoursMinutesSeconds)));
	}
	return ["hours"=>(int)$hours,"minutes"=>(int)$minutes,"seconds"=>(int)$seconds];
}
function extractStrings($m) {
	$s='';
	for ($h=0; $h<count($m); $h++) {
		if (array_key_exists(1, $m[$h])) {
			for ($i=0; $i<count($m[$h][1]); $i++) {
				$s.=$m[$h][1][$i][0].(!($i===count($m[$h][1])-1 && $h===count($m)-1)?', ':'');
			}
		}
	}
	return $s;
}
if (isset($_SESSION['auth'], $_POST['encrypted']) && $_SESSION['auth']) {
	$data=$_POST['encrypted'];
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	if (gettype($decrypted)==="array" && array_key_exists("token", $decrypted)) {
		$token=$decrypted['token'];
		$start=$decrypted['start'];
		if (array_key_exists('mem_imap_account_id_plus_path', $decrypted)) {
			$mem_imap_account_id_plus_path=$decrypted['mem_imap_account_id_plus_path'];
		}
		if (array_key_exists('statuses', $decrypted)) {
			$statuses=$decrypted['statuses'];
		}
	} else {
		$token="";
	}
	$commandline=false;
} else if (isset($_POST['token'])) {
	$token=$_POST['token'];
	$commandline=false;
} else if (isset($_GET['token'])) {
	$token=$_GET['token'];
	$commandline=false;
} else if (isset($argc) && $argc>1 && preg_match('/^token=[a-z0-9-]+$/', $argv[1])) {
	$commandline=true;
	$token=preg_replace('/^token=([a-z0-9-]+)$/', "$1", $argv[1]);
}
if (!isset($start)) {
	if (isset($_POST['start'])) {
		$start=(int)$_POST['start'];
	} else if (isset($_GET['start'])) {
		$start=(int)$_GET['start'];
	} else {
		$start=0;
	}
}
if (!$commandline) {
	$_SESSION['dayOffset']=0;
}
$fh=fopen("./log.txt", "w");
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
	$timeCheck=time();
	$reports=$mysql::selectAllPlusString("data_reports", "order by date_sent_AAAAMMJJHHii desc", null);
	$smtp_account=$mysql::selectAllForId("data_smtp_account", 1, null);
	$w1=[
		[
			"name"=>"active",
			"operator"=>"=",
			"value"=>"1",
			"and|or"=>null
		]
	];
	$r1=$mysql::selectAllPlusString("data_services", "where active=1 order by imap_account_id, imap_path desc", null);
	if (array_key_exists("id", $r1) && count($r1["id"])>0) {
		$errorDetected=false;
		if (!isset($mem_imap_account_id_plus_path)) {
			$mem_imap_account_id_plus_path=null;
		}
		$mem_imap_account_id=null;
		$lastIdentifiedMail=[];
		for ($i=$start; $i<count($r1['id']); $i++) {
			$r3=$mysql::selectAllWhere("data_customers", [["name"=>"id", "operator"=>"=", "value"=>$r1['customer_id'][$i], "and|or"=>null]], null);
			if (array_key_exists("active", $r3) && (int)$r3["active"][0]===1) {
				$lc=json_decode($r1["last_check_matched_values"][$i], true);
				if (is_array($lc)) {
					foreach ($lc as $k=>$v) {
						if (is_array($lc[$k])) {
							for ($z=0; $z<count($lc[$k]); $z++) {
								if (is_string($lc[$k][$z]) && preg_match('/^\[.*\]$/', $lc[$k][$z])) {
									$lc[$k][$z]=json_decode($lc[$k][$z], true);
								}
							}
						}
					}
				}
				$r1["statuses"][$i]=["identificationStatus"=>$r1["identification_status"][$i],"monitoringStatus"=>$r1["monitoring_status"][$i],"matches"=>["identification"=>(is_array($lc) && array_key_exists("identification", $lc)?$lc["identification"]:[]),"monitoring"=>(is_array($lc) && array_key_exists("monitoring", $lc)?$lc["monitoring"]:[])],"customer"=>$r3["name"][0]];
				$r1["identification_rules"][$i]=json_decode($r1["identification_rules"][$i], true);
				$r1["identification_actions"][$i]=json_decode($r1["identification_actions"][$i], true);
				$r1["monitoring_rules"][$i]=json_decode($r1["monitoring_rules"][$i], true);
				$r1["monitoring_actions"][$i]=json_decode($r1["monitoring_actions"][$i], true);
				$r1["cleaning_actions"][$i]=json_decode($r1["cleaning_actions"][$i], true);
				if (($timeCheck-(int)$r1["last_check_time"][$i])/3600>=(int)$r1["periodicity_hours"][$i]) {
					if ((int)$r1['imap_account_id'][$i]>0 && $r1['imap_account_id'][$i].'|'.$r1['imap_path'][$i]!==$mem_imap_account_id_plus_path) {
						$mem_imap_account_id_plus_path=$r1['imap_account_id'][$i].'|'.$r1['imap_path'][$i];
						if ($mem_imap_account_id!==$r1['imap_account_id'][$i]) {
							$mem_imap_account_id=$r1['imap_account_id'][$i];
							$r2=$mysql::selectAllForId("data_imap_accounts", $r1['imap_account_id'][$i], null);
							if (array_key_exists("id", $r2) && count($r2["id"])===1 && array_key_exists("active", $r2) && (int)$r2["active"][0]===1) {
								$server=new Server($r2['server'][0], $r2['port'][0]);
								if ((int)$r2['ssl_cert'][0]===1) {
									$server->setFlag("ssl");
								}
								if ((int)$r2['check_cert'][0]===0) {
									$server->setFlag("novalidate-cert");
								}
								$server->setAuthentication($r2['identifier'][0], decryptAES($r2['password'][0], $keyAndIv["key"], $keyAndIv["iv"]));
							} else {
								$server=false;
							}
						}
						if (is_object($server)) {
							$memTime=time();
							$msg=[];
							$toBeContinued=true;
							try { // to catch any error
								if ($server->setMailBox($r1["imap_path"][$i])) {
									while ($toBeContinued) {
										if (!$commandline) { //getOrderedMessagesFromDateToDate
											$msg=array_merge(
												$msg,
												$server->getOrderedMessagesSinceDateBeforeDate(
													SORTARRIVAL,
													1,
													-1,
													date(
														"Ymd",
														$timeCheck-($_SESSION['dayOffset']+1)*24*3600
													),
													date(
														"Ymd",
														$timeCheck-($_SESSION['dayOffset']-1)*24*3600
													)
												)
											);
											if (time()-$memTime<15) {
												echo "time elapsed:".(time()-$memTime)."-".json_encode(["start"=>$i, "total"=>count($r1['id'])])."|";
												ob_flush();
												flush();
												$toBeContinued=true;
												$_SESSION['dayOffset']+=2;
												if ($_SESSION['dayOffset']>3650) {
													$toBeContinued=false;
												}
											} else {
												$toBeContinued=false;
											}
										} else {
											$msg=$server->getOrderedMessages(SORTARRIVAL, 1, 1000);
											$toBeContinued=false;
										}
									}
								}
							} catch (RuntimeException $e) {
								error_log((string)$e, 0);
								$toBeContinued=false;
							}
						}
					}
					$monitoringMatches=[];
					$monitoringStatus=0;
					$identificationMatches=[];
					$identificationStatus=0;
					try {
						if (count($msg)>0) {
							$willBreak=false;
							for ($k=0; $k<count($msg); $k++) {
								$subject=$msg[$k]->getSubject();
								$subject=iconv(mb_detect_encoding($subject), "UTF-8//IGNORE", $subject);
								$body=$msg[$k]->getMessageBody(true);
								$body=preg_replace('/<style(?:[^>]*)>(.*)<\/style>/isU', "", $body);
								$body=trim(preg_replace('/(\r|\n)+/isU', "\n", preg_replace('/<[^>]+>/isU', "\n", $body)));
								$time=(int)$msg[$k]->getDate();// an unix timestamp
								$from=$msg[$k]->getAddresses("from");// an array
								$to=$msg[$k]->getAddresses("to");// an array
								$uid=$msg[$k]->getUid();
								$subjectNoDiacritics=strtolower(removeDiacritics($subject)[0]);
								$bodyNoDiacritics=strtolower(removeDiacritics($body)[0]);
								$boolTryToDetectDate=false;//change to true to try to detect date from email subject or body
								if ($boolTryToDetectDate) {
									$bool=false;
									$reg1='/^[^\v]+\b([0-9]|[1-2][0-9]|3[0-1])-(0?[1-9]|1[1-2])-([0-9]{4})[^\v]+$/';
									$reg2='/^[^\v]+\b([0-9]|[1-2][0-9]|3[0-1])\/(0?[1-9]|1[1-2])\/([0-9]{4})[^\v]+$/';
									$months=[
										"monthsENabbr"=>["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],
										"monthsEN"=>["january","february","march","april","may","june","july","august","september","october","november","december"],
										"monthsFR"=>["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"],
									];
									$matches=[];
									if (preg_match($reg1, $subjectNoDiacritics, $matches) || preg_match($reg2, $subjectNoDiacritics, $matches)) {
										$line=$matches[0];
										$dateObj=["day"=>(int)$matches[1],"month"=>(int)$matches[2],"year"=>(int)(int)$matches[3]];
										$complement=detectHoursMinutesSeconds($line);
										if (!is_nan((int)$complement["hours"])) {
											$dateObj["hours"]=(int)$complement["hours"];
										}
										if (!is_nan((int)$complement["minutes"])) {
											$dateObj["minutes"]=(int)$complement["minutes"];
										}
										if (!is_nan((int)$complement["seconds"])) {
											$dateObj["seconds"]=(int)$complement["seconds"];
										}
									}
									if (!$bool) {
										foreach ($months as $k=>$v) {
											for ($j=0; $j<count($v); $j++) {
												$reg='/^[^\v]+\b('.$v[$j].')\b[^\v]+$/i';
												$matches=[];
												if (preg_match($reg, $subjectNoDiacritics, $matches)) {
													$bool=true;
													$dateObj=detectDate($matches, $j+1);
												}
											}
										}
									}
									$matches=[];
									if (!$bool) {
										if (preg_match($reg1, $bodyNoDiacritics, $matches) || preg_match($reg2, $bodyNoDiacritics, $matches)) {
											$line=$matches[0];
											$dateObj=["day"=>(int)$matches[1],"month"=>(int)$matches[2],"year"=>(int)(int)$matches[3]];
											$complement=detectHoursMinutesSeconds($line);
											if (!is_nan((int)$complement["hours"])) {
												$dateObj["hours"]=(int)$complement["hours"];
											}
											if (!is_nan((int)$complement["minutes"])) {
												$dateObj["minutes"]=(int)$complement["minutes"];
											}
											if (!is_nan((int)$complement["seconds"])) {
												$dateObj["seconds"]=(int)$complement["seconds"];
											}
										}
									}
									if (!$bool) {
										foreach ($months as $k=>$v) {
											for ($j=0; $j<count($v); $j++) {
												$reg='/^[^\v]+\b('.$v[$j].')\b[^\v]+$/i';
												$matches=[];
												if (preg_match($reg, $bodyNoDiacritics, $matches)) {
													$bool=true;
													$dateObj=detectDate($matches, $j+1);
												}
											}
										}
									}
									if ($bool) {
										//we override time since some date is mentionned in the mail
										if (!is_nan($dateObj["year"]) && !is_nan($dateObj["month"]) && !is_nan($dateObj["day"])) {
											$time=strtotime(str_pad((string)$dateObj["day"], 2, "0", STR_PAD_LEFT)."-".str_pad((string)$dateObj["month"], 2, "0", STR_PAD_LEFT)."-".(string)$dateObj["year"]);
											if (!is_nan($dateObj["hours"])) {
												$time+=$dateObj["hours"]*3600;
											}
											if (!is_nan($dateObj["minutes"])) {
												$time+=$dateObj["minutes"]*60;
											}
											if (!is_nan($dateObj["seconds"])) {
												$time+=$dateObj["seconds"];
											}
										}
									}
								}
								if ($time+(int)$r1["fail_timeout_hours"][$i]*3600<$timeCheck) {
									$status=0;
									$r1["statuses"][$i]["matches"]=["noMailReceivedBeforeTimeout"];
									$identificationMatches=["noMailReceivedBeforeTimeout"];
								} else {
									if (is_array($r1["identification_rules"][$i]) 
									&& array_key_exists("association", $r1["identification_rules"][$i])
									&& array_key_exists("items", $r1["identification_rules"][$i])) {
										$match=0;
										for ($j=0; $j<count($r1["identification_rules"][$i]["items"]); $j++) {
											switch ($r1["identification_rules"][$i]["items"][$j]["operator"]) {
												case "contains":
													$regexPrefix="/";
													$regexSuffix="/i";
													$expectedResult=true;
												break;
												case "doesNotContain":
													$regexPrefix="/";
													$regexSuffix="/i";
													$expectedResult=false;
												break;
												case "startsWith":
													$regexPrefix="/^";
													$regexSuffix="/i";
													$expectedResult=true;
												break;
												case "endsWidth":
													$regexPrefix="/";
													$regexSuffix="$/i";
													$expectedResult=true;
												break;
												case "equals":
													$regexPrefix="/^";
													$regexSuffix="$/i";
													$expectedResult=true;
												break;
												case "doesNotEqual":
													$regexPrefix="/^";
													$regexSuffix="$/i";
													$expectedResult=false;
												break;
												case "matchesRegex":
													$regexPrefix="";
													$regexSuffix="";
													$expectedResult=true;
												break;
												case "doesNotMatchRegex":
													$regexPrefix="";
													$regexSuffix="";
													$expectedResult=false;
												break;
											}
											$m=0;
											$regex=$regexPrefix.(preg_match('/regex/i', $r1["identification_rules"][$i]["items"][$j]["operator"])?$r1["identification_rules"][$i]["items"][$j]["value"]:prepareForRegex($r1["identification_rules"][$i]["items"][$j]["value"])).$regexSuffix;
											switch ($r1["identification_rules"][$i]["items"][$j]["variable"]) {
												case "messageBody":
													$bodyLines=explode("\n", $body);
													$c=0;
													for ($l=0; $l<count($bodyLines); $l++) {
														$n=$l;
														$teststr="";
														while ($n<count($bodyLines)) {
															$teststr.=$bodyLines[$n]."\n";
															$n++;
														}
														$c++;
														$matches=[];
														if (preg_match($regex, $teststr, $matches, PREG_OFFSET_CAPTURE)==$expectedResult && ($expectedResult?(!preg_match('/\n/', mb_substr($teststr, 0, (int)$matches[0][1]))):true)) {
															if ($expectedResult) {
																$m++;
																$identificationMatches[]=json_encode(["line ".$c, $matches]);
															} else {
																$identificationMatches[]=json_encode(["line ".$c, $matches]);
															}
														} else if (!$expectedResult) {
															$m++;
														}
													}
												break;
												case "object":
													$matches=[];
													if (preg_match($regex, $subject, $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
														if ($expectedResult) {
															$m++;
															$identificationMatches[]=json_encode(["line 0", $matches]);
														} else {
															$identificationMatches[]=json_encode(["line 0", $matches]);
														}
													} else if (!$expectedResult) {
														$m++;
													}
												break;
												case "from":
													$matches=[];
													if (preg_match($regex, $from["address"], $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
														if ($expectedResult) {
															$m++;
															$identificationMatches[]=json_encode(["line 0", $matches]);
														} else {
															$identificationMatches[]=json_encode(["line 0", $matches]);
														}
													} else if (preg_match($regex, $from["name"], $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
														if ($expectedResult) {
															$m++;
															$identificationMatches[]=json_encode(["line 0", $matches]);
														} else {
															$identificationMatches[]=json_encode(["line 0", $matches]);
														}
													} else if (!$expectedResult) {
														$m++;
													}
												break;
												case "to":
													foreach($to as $v) {
														$matches=[];
														if (preg_match($regex, $v["address"], $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
															if ($expectedResult) {
																$m++;
																$identificationMatches[]=json_encode(["line 0", $matches]);
															} else {
																$identificationMatches[]=json_encode(["line 0", $matches]);
															}
														} else if (!$expectedResult) {
															$m++;
														}
													}
												break;
											}
											if (!$expectedResult && $m===0) {
												$match++;
											} else if ($expectedResult && $m>0) {
												$match++;
											}
										}
										if ($r1["identification_rules"][$i]["association"]=="allOf" && $match==count($r1["identification_rules"][$i]["items"])) {
											$identificationStatus=1;
											$mailUid=$uid;
										} else if ($r1["identification_rules"][$i]["association"]=="oneOf" && $match>0) {
											$identificationStatus=1;
											$mailUid=$uid;
										} else {
											$identificationStatus=0;
											$mailUid="";
										}
									}
									$identificationActions=[];
									if ($identificationStatus===1 && !array_key_exists($i, $lastIdentifiedMail)) {
										$lastIdentifiedMail[$i]=$msg[$k];
										$willBreak=true;
									}
									if ($identificationStatus===1 && is_array($r1["identification_actions"][$i]) && count($r1["identification_actions"][$i])>0) {
										for ($j=0; $j<count($r1["identification_actions"][$i]); $j++) {
											if (array_key_exists("action", $r1["identification_actions"][$i][$j])) {
												switch($r1["identification_actions"][$i][$j]["action"]) {
													case "moveToImapFolder":
														if (!$server->hasMailBox($r1["identification_actions"][$i][$j]["argument"])) {
															$server->createMailBox($r1["identification_actions"][$i][$j]["argument"]);
														}
														$actionStatus=$msg[$k]->moveToMailBox($r1["identification_actions"][$i][$j]["argument"]);
													break;
													case "setFlag":
														$actionStatus=$msg[$k]->setFlag($r1["identification_actions"][$i][$j]["argument"], true);
													break;
													case "clearFlag":
														$actionStatus=$msg[$k]->setFlag($r1["identification_actions"][$i][$j]["argument"], false);
													break;
													case "markAsRead":
														$r1["identification_actions"][$i][$j]["argument"]="\\Seen";
														$actionStatus=$msg[$k]->setFlag($r1["identification_actions"][$i][$j]["argument"], true);
													break;
												}
												$identificationActions[$r1["identification_actions"][$i][$j]["action"]." ".$r1["identification_actions"][$i][$j]["argument"]]=$actionStatus;
											}
										}
									}
								}
								if ($willBreak) {
									break;
								}
							}
						} else {
							echo "No message to treat"."<br />\r\n";
							ob_flush();
        					flush();
						}
					} catch (RuntimeException $e) {
						error_log((string)$e, 0);
					}
					if (isset($identificationStatus) && $identificationStatus===1 && is_array($r1["monitoring_rules"][$i]) && array_key_exists("association", $r1["monitoring_rules"][$i]) && array_key_exists("items", $r1["monitoring_rules"][$i])) {
						$subject=$lastIdentifiedMail[$i]->getSubject();
						$body=$lastIdentifiedMail[$i]->getMessageBody(true);
						$body=preg_replace('/<style(?:[^>]*)>(.*)<\/style>/isU', "", $body);
						$body=trim(preg_replace('/(\r|\n)+/isU', "\n", preg_replace('/<[^>]+>/isU', "\n", $body)));
						$time=(int)$lastIdentifiedMail[$i]->getDate();// an unix timestamp
						$from=$lastIdentifiedMail[$i]->getAddresses("from");// an array
						$to=$lastIdentifiedMail[$i]->getAddresses("to");// an array
						$uid=$lastIdentifiedMail[$i]->getUid();
						$subjectNoDiacritics=strtolower(removeDiacritics($subject)[0]);
						$bodyNoDiacritics=strtolower(removeDiacritics($body)[0]);
						$match=0;
						for ($j=0; $j<count($r1["monitoring_rules"][$i]["items"]); $j++) {
							switch ($r1["monitoring_rules"][$i]["items"][$j]["operator"]) {
								case "contains":
									$regexPrefix="/";
									$regexSuffix="/i";
									$expectedResult=true;
								break;
								case "doesNotContain":
									$regexPrefix="/";
									$regexSuffix="/i";
									$expectedResult=false;
								break;
								case "startsWith":
									$regexPrefix="/^";
									$regexSuffix="/i";
									$expectedResult=true;
								break;
								case "endsWidth":
									$regexPrefix="/";
									$regexSuffix="$/i";
									$expectedResult=true;
								break;
								case "equals":
									$regexPrefix="/^";
									$regexSuffix="$/i";
									$expectedResult=true;
								break;
								case "doesNotEqual":
									$regexPrefix="/^";
									$regexSuffix="$/i";
									$expectedResult=false;
								break;
								case "matchesRegex":
									$regexPrefix="";
									$regexSuffix="";
									$expectedResult=true;
								break;
								case "doesNotMatchRegex":
									$regexPrefix="";
									$regexSuffix="";
									$expectedResult=false;
								break;
							}
							$m=0;
							$regex=$regexPrefix.(preg_match('/regex/i', $r1["monitoring_rules"][$i]["items"][$j]["operator"])?$r1["monitoring_rules"][$i]["items"][$j]["value"]:prepareForRegex($r1["monitoring_rules"][$i]["items"][$j]["value"])).$regexSuffix;
							switch ($r1["monitoring_rules"][$i]["items"][$j]["variable"]) {
								case "messageBody":
									$bodyLines=explode("\n", $body);
									$c=0;
									for ($l=0; $l<count($bodyLines); $l++) {
										$n=$l;
										$teststr="";
										while ($n<count($bodyLines)) {
											$teststr.=$bodyLines[$n]."\n";
											$n++;
										}
										$c++;
										$matches=[];
										if (preg_match($regex, $teststr, $matches, PREG_OFFSET_CAPTURE)==$expectedResult && ($expectedResult?(!preg_match('/\n/', mb_substr($teststr, 0, (int)$matches[0][1]))):true)) {
											if ($expectedResult) {
												$m++;
												$monitoringMatches[]=json_encode(["line ".$c, $matches]);
											} else {
												$monitoringMatches[]=json_encode(["line ".$c, $matches]);
											}
										} else if (!$expectedResult) {
											$m++;
										}
									}
								break;
								case "object":
									$matches=[];
									if (preg_match($regex, $subject, $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
										if ($expectedResult) {
											$m++;
											$monitoringMatches[]=json_encode(["line 0", $matches]);
										} else {
											$monitoringMatches[]=json_encode(["line 0", $matches]);
										}
									} else if (!$expectedResult) {
										$m++;
									}
								break;
								case "from":
									$matches=[];
									if (preg_match($regex, $from["address"], $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
										if ($expectedResult) {
											$m++;
											$monitoringMatches[]=json_encode(["line 0", $matches]);
										} else {
											$monitoringMatches[]=json_encode(["line 0", $matches]);
										}
									} else if (preg_match($regex, $from["name"], $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
										if ($expectedResult) {
											$m++;
											$monitoringMatches[]=json_encode(["line 0", $matches]);
										} else {
											$monitoringMatches[]=json_encode(["line 0", $matches]);
										}
									} else if (!$expectedResult) {
										$m++;
									}
								break;
								case "to":
									foreach($to as $v) {
										$matches=[];
										if (preg_match($regex, $v["address"], $matches, PREG_OFFSET_CAPTURE)==$expectedResult) {
											if ($expectedResult) {
												$m++;
												$monitoringMatches[]=json_encode(["line 0", $matches]);
											} else {
												$monitoringMatches[]=json_encode(["line 0", $matches]);
											}
										} else if (!$expectedResult) {
											$m++;
										}
									}
								break;
							}
							if (!$expectedResult && $m===0) {
								$match++;
							} else if ($expectedResult && $m>0) {
								$match++;
							}
						}
						if ($r1["monitoring_rules"][$i]["association"]=="allOf" && $match==count($r1["monitoring_rules"][$i]["items"])) {
							$monitoringStatus=1;
						} else if ($r1["monitoring_rules"][$i]["association"]=="oneOf" && $match>0) {
							$monitoringStatus=1;
						} else {
							$monitoringStatus=0;
						}
						$monitoringStatus=(int)$r1["monitoring_status_if_matched"][$i]===1?$monitoringStatus:(1-$monitoringStatus);
						$r1["statuses"][$i]=["identificationStatus"=>$identificationStatus,"monitoringStatus"=>$monitoringStatus,"matches"=>["identification"=>$identificationMatches,"monitoring"=>$monitoringMatches],"customer"=>$r3["name"][0]];
						$monitoringActions=[];
						if ($identificationStatus===1 && $monitoringStatus===1 && is_array($r1["monitoring_actions"][$i]) && count($r1["monitoring_actions"][$i])>0) {
							for ($j=0; $j<count($r1["monitoring_actions"][$i]); $j++) {
								if (array_key_exists("action", $r1["monitoring_actions"][$i][$j])) {
									switch($r1["monitoring_actions"][$i][$j]["action"]) {
										case "moveToImapFolder":
											if (!$server->hasMailBox($r1["monitoring_actions"][$i][$j]["argument"])) {
												$server->createMailBox($r1["monitoring_actions"][$i][$j]["argument"]);
											}
											$actionStatus=$lastIdentifiedMail[$i]->moveToMailBox($r1["monitoring_actions"][$i][$j]["argument"]);
										break;
										case "setFlag":
											$actionStatus=$lastIdentifiedMail[$i]->setFlag($r1["monitoring_actions"][$i][$j]["argument"], true);
										break;
										case "clearFlag":
											$actionStatus=$lastIdentifiedMail[$i]->setFlag($r1["monitoring_actions"][$i][$j]["argument"], false);
										break;
										case "markAsRead":
											$r1["monitoring_actions"][$i][$j]["argument"]="\\Seen";
											$actionStatus=$lastIdentifiedMail[$i]->setFlag($r1["monitoring_actions"][$i][$j]["argument"], true);
										break;
									}
									$monitoringActions[$r1["monitoring_actions"][$i][$j]["action"]." ".$r1["monitoring_actions"][$i][$j]["argument"]]=$actionStatus;
								}
							}
						}
						if ($identificationStatus===1 && $monitoringStatus===1) {
							$w4=[
								[
									"name"=>"id",
									"operator"=>"=",
									"value"=>$r1["id"][$i],
									"and|or"=>null
								]
							];
							$kv4=[
								"last_success_time"=>$timeCheck,
								"last_success_date_AAAAMMJJHHii"=>(int)date("YmdHi", $timeCheck)
							];
							$r4=$mysql::updateWhere("data_services", $kv4, $w4);
						}
					}
					$w5=[
						[
							"name"=>"id",
							"operator"=>"=",
							"value"=>$r1["id"][$i],
							"and|or"=>null
						]
					];
					$kv5=[
						"last_check_date_AAAAMMJJHHii"=>(int)date("YmdHi", $timeCheck),
						"last_check_time"=>$timeCheck,
						"last_check_matched_values"=>json_encode(["identification"=>$identificationMatches,"monitoring"=>$monitoringMatches,"uid"=>$mailUid]),
						"identification_status"=>$identificationStatus,
						"monitoring_status"=>$monitoringStatus
					];
					$r5=$mysql::updateWhere("data_services", $kv5, $w5);
				}
				if (!$commandline && $i+1<count($r1['imap_account_id']) && (int)$r1['imap_account_id'][$i+1]>0 && $r1['imap_account_id'][$i+1].'|'.$r1['imap_path'][$i+1]!==$mem_imap_account_id_plus_path) {
					echo json_encode(["start"=>$i+1, "total"=>count($r1['id']), "mem_imap_account_id_plus_path"=>$mem_imap_account_id_plus_path, "statuses"=>$r1["statuses"]]);
					ob_end_flush();
					exit();
				}
			}
		}
		if (array_key_exists("id", $reports) && count($reports["id"])>0) {
			if ((int)date("Ymd")>(int)substr($reports["date_sent_AAAAMMJJHHii"][0], 0, 8)) {
				$boolSend=true;
			} else {
				$boolSend=false;
			}
		} else {
			$boolSend=true;
		}
		if ($boolSend && (int)$smtp_account["active"][0]===1) {
			for ($i=0; $i<count($r1["statuses"]); $i++) {
				if ((int)$r1["statuses"][$i]["monitoringStatus"]===0 && (int)$r1["statuses"][$i]["identificationStatus"]===1) {
					$errorDetected=true;
				} else if ((int)$r1["statuses"][$i]["identificationStatus"]===0) {
					$errorDetected=true;
				}
			}
			try {
				require_once(__DIR__.'/vendor/autoload.php');
				$transport = (new Swift_SmtpTransport($smtp_account["server"][0], (int)$smtp_account["port"][0], ((int)$smtp_account["ssl_cert"][0]===1?"ssl":"tls")))
					->setUsername($smtp_account["identifier"][0])
					->setPassword(decryptAES($smtp_account["password"][0], $keyAndIv["key"], $keyAndIv["iv"]));
				$mailer = new Swift_Mailer($transport);
				// Create the message
				$reportSubject=$_SESSION['locales']["dailyReport"][$smtp_account["report_locale"][0]]." : ".($errorDetected?$_SESSION['locales']["errorDetected"][$smtp_account["report_locale"][0]]:$_SESSION['locales']["noErrorDetected"][$smtp_account["report_locale"][0]]);
				$message='<html>';
				$message.='<head>';
				$message.='<style type="text/css">';
				$message.='body { font-family:Arial, Helvetica, Sans-serif; font-size:13px; }';
				$message.='table { width:800px; border:none; }';
				$message.='tr.even { background-color:#ddd; }';
				$message.='tr.odd { background-color:#ccc; }';
				$message.='td { padding:5px; }';
				$message.='td.even { background-color:rgba(255,255,255,0.2); }';
				$message.='td.odd { background-color:rgba(255,255,255,0.1); }';
				$message.='td>span { display:inline-block; vertical-align:baseline; border-radius:7px; overflow:hidden; width:14px; height:14px; }';
				$message.='</style>';
				$message.='</head>';
				$message.='<body>';
				$message.='<table>';
				$message.='<tbody>';
				$message.='<tr>';
				$message.='<td><b>'.$_SESSION['locales']["service"][$smtp_account["report_locale"][0]].'</b></td>';
				$message.='<td><b>'.$_SESSION['locales']["status"][$smtp_account["report_locale"][0]].'</b></td>';
				$message.='<td><b>'.$_SESSION['locales']["matches"][$smtp_account["report_locale"][0]].'</b></td>';
				$message.='<td><b>'.$_SESSION['locales']["lastCheckDate"][$smtp_account["report_locale"][0]].'</b></td>';
				$message.='<td><b>'.$_SESSION['locales']["lastSuccessDate"][$smtp_account["report_locale"][0]].'</b></td>';
				$message.='</tr>'."\n";
				for ($i=0; $i<count($r1["statuses"]); $i++) {
					if (array_key_exists("identificationStatus", $r1["statuses"][$i]) && array_key_exists("monitoringStatus", $r1["statuses"][$i])) {
						if ((int)$r1["statuses"][$i]["monitoringStatus"]===1) {
							$color="green";
						} else if ((int)$r1["statuses"][$i]["monitoringStatus"]===0 && (int)$r1["statuses"][$i]["identificationStatus"]===1) {
							$color="red";
						} else if ((int)$r1["statuses"][$i]["identificationStatus"]===0 && (int)$r1["let_status_green_if_not_identified"][$i]===0) {
							$color="darkred";
						} else {
							$color="green";
						}
						if ($i===0 || $r1["statuses"][$i-1]["customer"]!==$r1["statuses"][$i]["customer"]) {
							$message.='<tr class="'.($i%2===0?"even":"odd").'">';
							$message.='<td class="even" colspan="5" style="font-weight:bold;">'.$r1["statuses"][$i]["customer"].'</td>';
							$message.='</tr>'."\n";
						}
						if (array_key_exists('monitoring', $r1["statuses"][$i]["matches"])) {
							$m=$r1["statuses"][$i]["matches"]['monitoring'];
							$s=extractStrings($m);
						}
						$message.='<tr class="'.($i%2===0?"even":"odd").'">';
						$message.='<td class="even">'.$r1['service_or_machine_name'][$i].'</td>';
						$message.='<td class="odd"><span style="background-color:'.$color.';"></span></td>';
						$message.='<td class="even"><i>'.(!(array_key_exists(0, $r1["statuses"][$i]["matches"]) && $r1["statuses"][$i]["matches"][0]==="noMailReceivedBeforeTimeout")?$s:$_SESSION['locales']["noMailReceivedBeforeTimeout"][$smtp_account["report_locale"][0]]).'</i></td>';
						$message.='<td class="even">'.date('d/m/Y H:i:s', (int)$r1['last_check_time'][$i]).'</td>';
						$message.='<td class="odd">'.((int)$r1['last_success_time'][$i]!==0?date('d/m/Y H:i:s', (int)$r1['last_success_time'][$i]):$_SESSION['locales']["never"][$smtp_account["report_locale"][0]]).'</td>';
						$message.='</tr>'."\n";
					}
				}
				$message.='</tbody>';
				$message.='</table>';
				$message.='</body>';
				$message.='</html>';
				$msg = (new Swift_Message($reportSubject))
					// Set the From address with an associative array
					->setFrom(array($smtp_account["identifier"][0]=>$smtp_account["identifier"][0]))
					// Give it a body
					->setBody($message,'text/html');
				$dest=explode(",", $smtp_account["recipients"][0]);
				$msg->setBcc($dest);
				if ($mailer->send($msg, $failures)) {
					$kv6=[
						"date_sent_AAAAMMJJHHii"=>(int)date("YmdHi"),
						"time_sent"=>time(),
						"has_bad_status"=>$errorDetected
					];
					$r6=$mysql::insertAll("data_reports", $kv6, null);
					echo "Report sent<br />\r\n";
				} else {
					error_log(implode(",", $failures),0);
					echo "Error : ".implode(",", $failures)."<br />\r\n";
				}
			} catch (Exception $e) {
				error_log($e,0);
				echo "Error : ".$e."<br />\r\n";
			}
		}
	}
	echo "done";
	ob_end_flush();
} else {
	echo "badToken";
}
$mysql::closeMysql();
fclose($fh);
?>