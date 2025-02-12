<?php
include_once(__DIR__.'/../php/session.php');
include_once(__DIR__.'/../php/mysql_utils.php');
include_once(__DIR__.'/../php/locales.php');
?>
<!DOCTYPE HTML>
<html lang="<?php echo $_SESSION['current-language']; ?>">
<head>
	<title>Api Fetching Mail - <?php echo $_SESSION['currentPageTitle']; ?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
	<meta charset="UTF-8"/>
	<meta name="description" content=""/>
	<meta name="keywords" content=""/>
	<meta name="robots" content="index, follow, all"/>
	<meta name="revisit-after" content=""/>
	<meta name="category" content=""/>
	<meta name="rating" content=""/>
	<meta name="author" content=""/>
	<link rel="icon" type="image/png" href="./lpslt/media/favicon.png?mod=<?php echo filemtime(__DIR__.'/../media/favicon.png'); ?>"/>
	<script type="text/javascript">var onLoadedFunctions=[]; var onUnloadFunctions=[];</script>
<?php
	$_SESSION['prefixCss']="lpslt";
	$_SESSION['prefixJs']=["lib"=>"lib", "lpslt"=>"lpslt", "jsencrypt"=>"jsencrypt", "aes"=>"aes"];
	if (preg_match('/msie 9/i', $_SERVER['HTTP_USER_AGENT'])) {
		$_SESSION['prefixJs']['history']='history';
		$_SESSION['prefixJs']['history.adapter.native']='history.adapter.native';
	}
	if (file_exists(__DIR__.'/../css/css.php')) {
		include_once(__DIR__.'/../css/css.php');
	}
	echo $_SESSION['css'];
	if (file_exists(__DIR__.'/../js/js.php')) {
		include_once(__DIR__.'/../js/js.php');
	}
	echo $_SESSION['js']['lib'].$_SESSION['js']['lpslt'].$_SESSION['js']['jsencrypt'].$_SESSION['js']['aes'].(preg_match('/msie 9/i', $_SERVER['HTTP_USER_AGENT'])?$_SESSION['js']['history.adapter.native'].$_SESSION['js']['history']:'');
	echo 
	"\t",'<script type="text/javascript" class="lg_script">
		var locales={',"\n";
	$i=0;
	$languages=array();
	foreach ($_SESSION['locales'] as $k => $v) {
	    if ($i==0) {
		foreach ($_SESSION['locales'][$k] as $l => $w) {
		    $languages[].=$l;
		}
	    }
	    $i++;
	    echo "\t\t\t",$k,':"',preg_replace('/"/', '\"', $_SESSION['locales'][$k][$_SESSION['current-language']]),'"';
	    if ($i<count($_SESSION['locales'])) {
		echo ',';
	    }
	    echo "\n";
	}
	echo "\t\t",'};
		var locale="'.$_SESSION['current-language'].'";
	</script>';
	if (file_exists(dirname(__FILE__).'/../php/fonts.php')) {
		include_once(dirname(__FILE__).'/../php/fonts.php');
		echo $_SESSION['fontsCss'];
    }
?>

	<style type="text/css" class="frontend_extra normal_loading">
		#background {
			display:none;
			opacity:0;
		}
		#wrapper {
			display:none;
			opacity:0;
		}
	</style>
</head>
<body>
	<div id="background"></div>
	<div id="wrapper">
		<?php include_once(__DIR__.'/../dependencies/headerAndMenu.php'); ?>
		<div id="subwrapper" style="height:100%;">
			<div class="content">
				<div id="blank"></div>
				<div style="text-align:center; color:#000;" id="lpslt_container" class="lpslt_resizable">
					<?php
						if (!isset($_SESSION['auth']) || !$_SESSION['auth']) {
							echo '
					<span style="font-size:2em;">'.$_SESSION['locales']['welcome'][$_SESSION['current-language']].'</span><br />
';
?>					
					<script>onLoadedFunctions.push(function() { lib("window").on("keyup", log.checkEnterAndValid); }); onUnloadFunctions.push(function() { lib("window").off("keyup", log.checkEnterAndValid); });</script>
					<input type="text" onfocus="lpslt.emptyIf(this, '<?php echo $_SESSION['locales']['emailAddress'][$_SESSION['current-language']]; ?>');" onblur="lpslt.fillIfEmpty(this, '<?php echo $_SESSION['locales']['emailAddress'][$_SESSION['current-language']]; ?>');" name="identifiant" id="identifiant" value="<?php echo $_SESSION['locales']['emailAddress'][$_SESSION['current-language']]; ?>" style="padding:0.25em; margin:0.25em; height:auto; width:12.5em; font-size:1.25em; border-radius:0.5em; border:1px solid #666; background-color:#eee;"/><br />
					<input type="password" onfocus="lpslt.emptyIf(this, '••••••••••');" onblur="lpslt.fillIfEmpty(this, '••••••••••');" name="password" id="password" value="••••••••••" style="padding:0.25em; margin:0.25em; height:auto; width:12.5em; font-size:1.25em; border-radius:0.5em; border:1px solid #666; background-color:#eee;"/><br />
					<button id="connect" onclick="lpslt.connect();" style="box-sizing:content-box; padding:0.25em; padding-bottom:0.4em; margin:0.25em; height:auto; width:12.5em; font-size:1.25em; color:#fff; line-height:1.25em; height:auto; border-radius:0.5em; border:1px solid #666; background-color:#000;"><?php echo $_SESSION['locales']['connection'][$_SESSION['current-language']]; ?></button>
				
<?php
						} else {
							echo '
					<span style="font-size:2em;">'.$_SESSION['locales']['welcomeAuth'][$_SESSION['current-language']].(!(isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS'])==="on")?'
						<br /><span style="font-size:0.5em;">'.$_SESSION['locales']['landingAuth'][$_SESSION['current-language']].'</span>
':'
').'</span>';	
						}
					?>
				</div>
			</div>
		</div>
	</div>
	<div id="lpslt_searchResults" style="display:none; width:auto; height:auto; position:fixed; z-index:10001;">
		<div id="lpslt_searchResultsCont" style="width:18em;">
			<div id="lpslt_bubble_top" style="width:100%; height:0px; position:relative; text-align:left;"><img src="lpslt/media/bubble_top.png" style="border:none; width:100%; height:100%;"/></div><div id="lpslt_bubble_middle" style="top:-1px; width:100%; height:0px; position:relative; text-align:left;"><img src="lpslt/media/bubble_middle.png" style="border:none; width:100%; height:100%; position:absolute; left:0%;"/><span id="lpslt_bubble_content" style="display:block; width:100%; height:100%; position:relative; top:0em; opacity:0;"></span></div><div id="lpslt_bubble_bottom" style="top:-1px; width:100%; height:0px; position:relative; text-align:left;"><img src="lpslt/media/bubble_bottom.png" style="border:none; width:100%; height:100%; position:absolute;"/></div>
		</div>
	</div>
<?php
	if (isset($_SESSION['auth'], $_SESSION['passphrase']) && $_SESSION['auth'] && $_SESSION['direct']) {
		echo "\t",'<script type="text/javascript" class="lpslt_admin_script">
		onLoadedFunctions.push(function () { lpslt.waitUntilAdminInitiated=true; setTimeout(function() { admin.init(function() { '.(isset($_SESSION['redirect']) && $_SESSION['redirect']?'lpslt.ajax(\''.$_SESSION['savedSlug'].'\', true); lpslt.reloadMenu();':'').' }, "reload"); }, 2000); });
</script>',"\n";
		$_SESSION['redirect']=false;
	} else if (isset($_SESSION['auth'], $_SESSION['passphrase']) && $_SESSION['auth'] && !$_SESSION['direct']) {
		echo "\t",'<script type="text/javascript" class="lpslt_admin_script">
		onLoadedFunctions.push(function () { admin.init(function() { }, "ajax"); });
	</script>',"\n";
	}
?>
</body>
</html>