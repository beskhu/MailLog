<?php
	if (isset($_POST['locale'])) {	
		if (file_exists('./session.php')) {
			include_once('./session.php');
		}
		if (array_key_exists('locales', $_SESSION)) {
			$locales=[];
			foreach ($_SESSION['locales'] as $k => $v) {
				$locales[$k]=$_SESSION['locales'][$k][$_POST['locale']];
			}
			echo json_encode(["locales"=>$locales]);
		}
	}
?>