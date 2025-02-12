<?php
include_once(__DIR__.'/session.php');
include_once(__DIR__.'/decrypt.php');
include_once(__DIR__.'/encrypt.php');
include_once(__DIR__.'/mysql_utils.php');
if (isset($_SESSION['auth'], $_POST['encrypted']) && $_SESSION['auth']) {
	$res=[];
	$data=$_POST['encrypted'];
	$decrypted=decryptAESandParseJSON($data, $_SESSION['passphrase']);
	if (gettype($decrypted)==="array" && array_key_exists("id", $decrypted) && array_key_exists("customerId", $decrypted) && array_key_exists("imapId", $decrypted) && array_key_exists("imapFolder", $decrypted) && array_key_exists("serviceOrMachineName", $decrypted) && array_key_exists("periodicityHours", $decrypted)) {
		$mysql=new mysqlUtils();
		$whereArray=[
			[
				"name"=>"id",
				"operator"=>"=",
				"value"=>$decrypted['id'],
				"and|or"=>null
			]
		];
		$keyValueArray=[
			"customer_id"=>$decrypted['customerId'],
			"imap_account_id"=>$decrypted['imapId'],
			"imap_path"=>$decrypted['imapFolder'],
			"service_or_machine_name"=>$decrypted['serviceOrMachineName'],
			"identification_rules"=>$decrypted['identification_rules'],
			"identification_actions"=>$decrypted['identification_actions'],
			"monitoring_rules"=>$decrypted['monitoring_rules'],
			"monitoring_status_if_matched"=>$decrypted['monitoring_status_if_matched'],
			"monitoring_actions"=>$decrypted['monitoring_actions'],
			"cleaning_timeout_hours"=>$decrypted['cleaning_timeout_hours'],
			"cleaning_actions"=>$decrypted['cleaning_actions'],
			"periodicity_hours"=>$decrypted['periodicityHours'],
			"fail_timeout_hours"=>$decrypted['failTimeout'],
			"active"=>$decrypted['active'],
			"last_check_time"=>0
		];
		$r=$mysql::updateWhere("data_services", $keyValueArray, $whereArray, null);
		$res=$r;
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