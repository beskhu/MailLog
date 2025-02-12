<?php
	if (isset($_POST['lg'])) {
		include_once(__DIR__.'/session.php');
		include_once(__DIR__.'/locales.php');
		include_once(__DIR__.'/mysql_utils.php');
		include_once(__DIR__.'/utils.php');
		$mysql=new mysqlUtils();
		setcookie("locale", $_POST['lg'], time()+90*24*60*60, substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/php')).'/', preg_replace('/:[0-9]+$/', "", $_SERVER['HTTP_HOST']), 0, 1);
		$_SESSION['current-language']=$_POST['lg'];
		if (isset($_SESSION['auth']) && $_SESSION['auth']) {
			$upd=$mysql::updateWhere("users", ["prefered_locale"=>$_POST['lg']], [["name"=>"id","operator"=>"=","value"=>$_SESSION['user_id'],"and|or"=>null]]);
		}
		$page=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context='.(isset($_SESSION['auth']) && $_SESSION['auth']?'1':'0').' and slug="'.$_SESSION['slug'].'"', null);
		if (array_key_exists("id", $page) && count($page["id"])>0) {
			$translatedPage=$mysql::selectAllPlusString("pages", ' where active=1 and auth_context='.(isset($_SESSION['auth']) && $_SESSION['auth']?'1':'0').' and file="'.$page['file'][0].'" and locale="'.$_SESSION['current-language'].'"', null);
			if (array_key_exists("id", $translatedPage) && count($translatedPage["id"])==1) {
				echo json_encode(array('page'=>$translatedPage['slug'][0]));
			} else {
				echo json_encode(array('error'=>$_SESSION['locales']['unableToFindTranslatedPage'][$_SESSION['current-language']]));
			}
		} else {
			echo json_encode(array('error'=>$_SESSION['locales']['unableToFindTranslatedPage'][$_SESSION['current-language']]));
		}
	}
?>