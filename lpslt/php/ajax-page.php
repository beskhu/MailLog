<?php
	if (isset($_POST['page'])) {
		include_once(__DIR__.'/mysql_utils.php');
		include_once(__DIR__.'/utils.php');
		include_once(__DIR__.'/session.php');
		include_once(__DIR__.'/locales.php');
		include_once(__DIR__.'/encrypt.php');
		$mysql=new mysqlUtils();
		$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context='.(isset($_SESSION['auth']) && $_SESSION['auth']?'1':'0').' and slug="'.$_POST['page'].'" and locale="'.$_SESSION['current-language'].'"', null);
		$pageAllLanguages=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context='.(isset($_SESSION['auth']) && $_SESSION['auth']?'1':'0').' and slug="'.$_POST['page'].'"', null);
		if (array_key_exists("id", $page) && count($page["id"])===1) {
			if (file_exists(__DIR__.'/../protected/'.$page['file'][0].'.php')) {
				$_SESSION['direct']=false;
				if (!empty($_POST['add'])) {
					$_SESSION['add']=$_POST['add'];
				} else {
					$_SESSION['add']="";
				}
				$_SESSION['slug']=$_POST['page'];
				$_SESSION['page_id']=$page["id"][0];
				$_SESSION['currentPageTitle']=$page["title"][0];
				$contents=gic(__DIR__.'/../protected/'.$page['file'][0].'.php');
				if (isset($_SESSION['auth']) && $_SESSION['auth'] && isset($_SESSION['passphrase'])) {
					$encrypted=encodeToJSONifArrayAndEncryptAES(['contents'=>$contents, 'title'=>$_SESSION['currentPageTitle']], $_SESSION['passphrase']);
					echo $encrypted;
				} else {
					echo json_encode(['contents'=>$contents, 'title'=>$_SESSION['currentPageTitle']]);
				}
			} else {
				$contents=gic(__DIR__.'/../protected/404.php');
				echo json_encode(['contents'=>$contents, 'title'=>'404']);
			}
		} else if (array_key_exists("id", $pageAllLanguages) && count($pageAllLanguages["id"])===1) {
			$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context='.(isset($_SESSION['auth']) && $_SESSION['auth']?'1':'0').' and file="'.$pageAllLanguages["file"][0].'" and locale="'.$_SESSION['current-language'].'"', null);
			if (array_key_exists("id", $page) && count($page["id"])===1) {
				if (file_exists(__DIR__.'/../protected/'.$page['file'][0].'.php')) {
					$_SESSION['direct']=false;
					if (!empty($_POST['add'])) {
						$_SESSION['add']=$_POST['add'];
					} else {
						$_SESSION['add']="";
					}
					$_SESSION['slug']=$page["slug"][0];
					$_SESSION['page_id']=$page["id"][0];
					$_SESSION['currentPageTitle']=$page["title"][0];
					$contents=gic(__DIR__.'/../protected/'.$page['file'][0].'.php');
					if (isset($_SESSION['auth']) && $_SESSION['auth'] && isset($_SESSION['passphrase'])) {
						$encrypted=encodeToJSONifArrayAndEncryptAES(['contents'=>$contents, 'title'=>$_SESSION['currentPageTitle']], $_SESSION['passphrase']);
						echo $encrypted;
					} else {
						echo json_encode(['contents'=>$contents, 'title'=>$_SESSION['currentPageTitle']]);
					}
				} else {
					$contents=gic(__DIR__.'/../protected/404.php');
					echo json_encode(['contents'=>$contents, 'title'=>'404']);
				}
			} else {
				$contents=gic(__DIR__.'/../protected/404.php');
				echo json_encode(['contents'=>$contents, 'title'=>'404']);
			}
		} else {
			$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context='.(!(isset($_SESSION['auth']) && $_SESSION['auth'])?'1':'0').' and slug="'.$_POST['page'].'" and locale="'.$_SESSION['current-language'].'"', null);
			if (array_key_exists("id", $page) && count($page["id"])==1) {
				echo json_encode(['alert'=>$_SESSION['locales'][(!(isset($_SESSION['auth']) && $_SESSION['auth'])?'loginNeeded':'noNeedSinceLogged')][$_SESSION['current-language']]]);
			} else {
				$contents=gic(__DIR__.'/../protected/404.php');
				$encrypted=encodeToJSONifArrayAndEncryptAES(['contents'=>$contents, 'title'=>'404'], $_SESSION['passphrase']);
				echo $encrypted;
			}
		}
	}
?>