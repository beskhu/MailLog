<?php	
	if (file_exists(__DIR__.'/session.php')) {
		include_once(__DIR__.'/session.php');
	}
	if (file_exists(__DIR__.'/utils.php')) {
		include_once(__DIR__.'/utils.php');
	}
	if (file_exists(__DIR__.'/mysql_utils.php')) {
		include_once(__DIR__.'/mysql_utils.php');
	}
	$mysql=new mysqlUtils();
	$rLocales=$mysql::selectAll("locales", null);
	$mysql::closeMysql();
	$_SESSION['locales']=array();
	for ($i=0; $i<count($rLocales['id']); $i++) {
		$_SESSION['locales'][$rLocales['index'][$i]]=array();
		foreach ($rLocales as $k => $v) {
			if (indexOfInArray($k, array('id', 'index'))===-1) {
				$_SESSION['locales'][$rLocales['index'][$i]][$k]=preg_replace('/(.+) (.)$/', "$1&nbsp;$2", $rLocales[$k][$i]);
			}
		}
	}
	if (!isset($_SESSION['current-language'])) {
		if (isset($_SERVER['REQUEST_URI'], $_SERVER['HTTP_HOST']) && !isset($_SESSION['current-language'], $_COOKIE['locale'])) {
			$rAdmin=$mysql::selectAllWhere("users", [["name"=>"id","operator"=>"=","value"=>1,"and|or"=>null]], null);
			$_SESSION['current-language']=(array_key_exists("prefered_locale", $rAdmin) && count($rAdmin["prefered_locale"])>0)?$rAdmin["prefered_locale"][0]:"en";
			setcookie("locale", $_SESSION['current-language'], time()+90*24*60*60, substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/php')).'/', preg_replace('/:[0-9]+$/', "", $_SERVER['HTTP_HOST']), 0, 1);
		} else if (isset($_SERVER['REQUEST_URI'], $_SERVER['HTTP_HOST']) && !isset($_SESSION['current-language']) && isset($_COOKIE['locale'])) {
			$_SESSION['current-language']=$_COOKIE['locale'];
			setcookie("locale", $_COOKIE['locale'], time()+90*24*60*60, substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/php')).'/', preg_replace('/:[0-9]+$/', "", $_SERVER['HTTP_HOST']), 0, 1);
		} else if (isset($_SERVER['REQUEST_URI'], $_SERVER['HTTP_HOST'])) {
			$rAdmin=$mysql::selectAllWhere("users", [["name"=>"id","operator"=>"=","value"=>1,"and|or"=>null]], null);
			$_SESSION['current-language']=(array_key_exists("prefered_locale", $rAdmin) && count($rAdmin["prefered_locale"])>0)?$rAdmin["prefered_locale"][0]:"en";
			setcookie("locale", $_SESSION['current-language'], time()+90*24*60*60, substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/php')).'/', preg_replace('/:[0-9]+$/', "", $_SERVER['HTTP_HOST']), 0, 1);
		}
	}
?>