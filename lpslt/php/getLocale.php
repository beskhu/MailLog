<?php
	include_once(__DIR__.'/session.php');
	echo json_encode(array('locale'=>$_SESSION['current-language']));
?>