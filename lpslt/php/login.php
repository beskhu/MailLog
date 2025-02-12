<?php
	header('Content-type: text/html; charset=utf-8;');
	include_once(__DIR__.'/session.php');
	include_once(__DIR__.'/generateCryptoKey.php');
	if (!isset($_SESSION['locales']) || !isset($_SESSION['locales'])) {
		include_once(__DIR__.'/locales.php');
	}
	if (isset($_POST['give_me_a_public_key_and_some_salt_please'])) {
		/* Create the private and public key */
		$_SESSION['rsa']=generateRsa(1024);
		$_SESSION['salt']=uniqid(md5(rand(1,999999999)));
		echo json_encode(array("publicKey"=>$_SESSION['rsa']['public'], "salt"=>$_SESSION['salt']));
	} else if (isset($_POST['encryptedMail'], $_POST['encryptedPass'])) {
		$triesAllowed=60;
		include_once(__DIR__.'/utils.php');
		include_once(__DIR__.'/mysql_utils.php');
		$mysqlUtils=new mysqlUtils();
		if ($mysqlUtils::$statusReturn[0]) {
			$ip=$_SERVER['REMOTE_ADDR'];
			$del=$mysqlUtils::deleteWhereString("ip_log", time()."-timestamp>3600 and bot=0");
			$check=$mysqlUtils::selectAllWhere("ip_log", array(array("name"=>"ip", "operator"=>"=", "value"=>$ip, "and|or"=>null)), null);
			$fails=(array_key_exists('fails', $check)?(int)$check['fails'][0]:0);
			if (array_key_exists('message', $check) && $check['message']==="ok") {
				echo json_encode(array("message"=>$_SESSION['locales']['mysqlError'][$_SESSION['current-language']].(indexOfKeyInArray($check["error"], $_SESSION['locales'])==-1?$check["error"]:$_SESSION['locales'][$check["error"]]), "language"=>$_SESSION['current-language']));
			} else if (array_key_exists('fails', $check) && (int)$check['fails'][0]>=$triesAllowed && array_key_exists('bot', $check) && (int)$check['bot'][0]==0) {
				echo json_encode(array("message"=>$_SESSION['locales']['tooMuchAttempts'][$_SESSION['current-language']], "language"=>$_SESSION['current-language']));
			} else if (array_key_exists('bot', $check) && (int)$check['bot'][0]==1) {
				echo json_encode(array("message"=>$_SESSION['locales']['seemsToBeBot'][$_SESSION['current-language']], "language"=>$_SESSION['current-language']));
			} else {
				$m=$_POST['encryptedMail'];
				$p=$_POST['encryptedPass'];
				$_SESSION['auth']=false;
				$accounts=$mysqlUtils::selectAll("users", null);
				if (array_key_exists('pass', $accounts) && array_key_exists("rsa", $_SESSION)) {
					$privkey=openssl_pkey_get_private($_SESSION['rsa']['private']);
					if ($privkey && openssl_private_decrypt(base64_decode($m), $decryptedM, $privkey) && openssl_private_decrypt(base64_decode($p), $decryptedP, $privkey)) {
						$accounts=$mysqlUtils::selectAllPlusString("users", "where email='".$decryptedM."' and pass=concat('$6$', substring(pass, 4, 16), '$', sha2(concat(substring(pass, 4, 16), '".$decryptedP."'), 512))", null);
						if (array_key_exists("pass", $accounts) && count($accounts['pass'])>0) {
							$_SESSION['auth']=true;
							$passphrase=generateCryptoKey();
							$token=getToken();
							if (substr($passphrase, 0, 6)!=="Error") {
								$encrypted="";
								$encryptedToken="";
								openssl_public_encrypt($passphrase, $encrypted, $_POST['publicKey']);
								openssl_public_encrypt($token, $encryptedToken, $_POST['publicKey']);
								$_SESSION['firstname']=$accounts['firstname'][0];
								$_SESSION['lastname']=$accounts['lastname'][0];
								$_SESSION['user_id']=$accounts['id'][0];
								$_SESSION['status']=$accounts['status'][0];
								$_SESSION['level']=(int)$accounts['level'][0];
								$_SESSION['current-language']=$accounts['prefered_locale'][0];
								setcookie("locale", $_SESSION['current-language'], time()+90*24*60*60, substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/php')).'/', preg_replace('/:[0-9]+$/', "", $_SERVER['HTTP_HOST']), 0, 1);
								$json=json_encode(array("message"=>$accounts['firstname'][0].' '.$accounts['lastname'][0].', '.$_SESSION['locales']['loginSucceeded'][$_SESSION['current-language']], "encrypted"=>bin2hex($encrypted), "encryptedToken"=>bin2hex($encryptedToken), "language"=>$_SESSION['current-language']));
								echo $json;
								if (array_key_exists('fails', $check)) {
									$del=$mysqlUtils::deleteWhere("ip_log", array(array("name"=>"ip", "operator"=>"=", "value"=>$ip, "and|or"=>null)));
								}
								$_SESSION['rsa']['public']=false;
							} else {
								$json=json_encode(array("message"=>$accounts['firstname'][0].' '.$accounts['lastname'][0].', '.$_SESSION['locales']['loginSucceeded'][$_SESSION['current-language']].$_SESSION['locales']['butCryptoKeyCouldNotBeGenerated'][$_SESSION['current-language']], "language"=>$_SESSION['current-language']));
								echo $json;
							}
						}
						if (!$_SESSION['auth']) {
							if (!array_key_exists('fails', $check)) {
								$ins=$mysqlUtils::insertAll("ip_log", array("ip"=>$ip, "timestamp"=>time(), "fails"=>1, "bot"=>0));
								echo json_encode(array("message"=>$_SESSION['locales']['incorrectPassword'][$_SESSION['current-language']].$_SESSION['locales']['security_1'][$_SESSION['current-language']].(string)($triesAllowed-1).$_SESSION['locales']['security_2'][$_SESSION['current-language']], "language"=>$_SESSION['current-language']));
							} else if (array_key_exists('fails', $check) && time()-(int)$check['timestamp'][0]<2) {
								echo json_encode(array("message"=>$_SESSION['locales']['seemsToBeBot'][$_SESSION['current-language']]));
								$upd=$mysqlUtils::updateWhere("ip_log", array("bot"=>1), array(array("name"=>"ip", "operator"=>"=", "value"=>$ip, "and|or"=>null)));
							} else {
								echo json_encode(array("message"=>$_SESSION['locales']['incorrectPassword'][$_SESSION['current-language']].$_SESSION['locales']['security_1'][$_SESSION['current-language']].($triesAllowed-((int)$check['fails'][0]+1)).$_SESSION['locales']['security_2'][$_SESSION['current-language']], "language"=>$_SESSION['current-language']));
								$upd=$mysqlUtils::updateWhere("ip_log", array("fails"=>(int)$check['fails'][0]+1), array(array("name"=>"ip", "operator"=>"=", "value"=>$ip, "and|or"=>null)));
							}
						}
					} else {
						echo json_encode(array("message"=>$_SESSION['locales']['opensslError'][$_SESSION['current-language']], "language"=>$_SESSION['current-language']));
					}
				} else if (!array_key_exists('pass', $accounts)) {
					echo json_encode(array("message"=>$_SESSION['locales']['passwordDbError'][$_SESSION['current-language']], "language"=>$_SESSION['current-language']));
				} else if (array_key_exists(0, $accounts) && $accounts[0]==false) {
					echo json_encode(array("message"=>$_SESSION['locales']['mysqlError'][$_SESSION['current-language']].$accounts[1], "language"=>$_SESSION['current-language']));
				} else if (array_key_exists("message", $accounts) && $accounts["message"]=="ko") {
					echo json_encode(array("message"=>$_SESSION['locales']['mysqlError'][$_SESSION['current-language']].(indexOfKeyInArray($accounts["error"], $_SESSION['locales'])==-1?$accounts["error"]:$_SESSION['locales'][$accounts["error"]][$_SESSION['current-language']]), "language"=>$_SESSION['current-language']));
				}
			}
		} else if (!$mysqlUtils::$statusReturn[0]) {
			echo json_encode(array("message"=>$_SESSION['locales']['mysqlError'][$_SESSION['current-language']].$_SESSION['locales'][$mysqlUtils::$statusReturn[1]][$_SESSION['current-language']]));
		}
	} else if (isset($_POST['disconnect'])) {
		if (isset($_SESSION['auth'])) {
			unset($_SESSION['auth']);
			echo json_encode(array("message"=>$_SESSION['locales']['loggedOut'][$_SESSION['current-language']]));
		} else {
			echo json_encode(array("message"=>$_SESSION['locales']['alreadyLoggedOut'][$_SESSION['current-language']]));
		}
	}
?>