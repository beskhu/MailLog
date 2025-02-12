<?php
	include_once(__DIR__.'/../php/session.php');
	if (isset($_SESSION['page_file'])) {
		include_once(__DIR__.'/../protected/'.$_SESSION['page_file'].'.php');
	}
?>