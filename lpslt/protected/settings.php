<?php
include_once(__DIR__.'/../php/session.php');
include_once(__DIR__.'/../php/mysql_utils.php');
include_once(__DIR__.'/../php/getDatabaseAESkeyAndIv.php');
include_once(__DIR__.'/../php/decrypt.php');
include_once(__DIR__.'/../php/encrypt.php');
include_once(__DIR__.'/../php/locales.php'); 
if (!isset($_SESSION['auth']) || !$_SESSION['auth'] || (int)$_SESSION['level']<1 || preg_match('/protected\//', $_SERVER["REQUEST_URI"])) {
	header('Location: '.(isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS'])==="on"?'https':'http').'://'.$_SERVER['HTTP_HOST'].substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/protected')).'/'.'401');
}
function buildMediumBox($index, $choices, $defaultChoice, $additionnalClass) {
	include_once(__DIR__.'/../php/session.php');
	$strMediumBox='<span class="mediumbox'.(gettype($additionnalClass)==="string" && strlen($additionnalClass)>0?" ".$additionnalClass:"").'" id="mediumbox_'.$index.'"><button onclick="lpslt.toggleMediumBox(\''.$index.'\'); return false;"><span class="choice">'.$_SESSION['locales'][$defaultChoice][$_SESSION['current-language']].'</span><span class="arrow"><img src="lpslt/media/arrow_down_black.png" /></span></button><span class="mediumbox_content">';
	for ($i=0; $i<count($choices); $i++) {
		$strMediumBox.='<button data-value="'.$choices[$i].'" onclick="lpslt.choiceInMediumBox(this, \''.$index.'\'); return false;">'.$_SESSION['locales'][$choices[$i]][$_SESSION['current-language']].'</button>';
	}
	$strMediumBox.='</span></span>';
	return ["html"=>$strMediumBox, "js"=>'lpslt.mediumBoxChoices["_'.$index.'"]="'.$defaultChoice.'";'];
}
function replacePassWithPoints($pass) {
	return '••••••••••';
}
$keyAndIv=getDatabaseAESkeyAndIv();
?>
<!DOCTYPE HTML>
<html lang="<?php echo $_SESSION['current-language']; ?>">
<head>
	<title><?php echo $_SESSION['locales']['baseTitle'][$_SESSION['current-language']]." - ".$_SESSION['currentPageTitle']; ?></title>
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
	<script type="text/javascript">var onLoadedFunctions=[];</script>
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
		<?php include_once(dirname(__FILE__).'/../dependencies/headerAndMenu.php'); ?>
		<div id="subwrapper" style="height:100%;">
			<div class="content">
				<div id="blank"></div>
				<div style="text-align:center; color:#000;" id="lpslt_container" class="lpslt_resizable">
					<div id="administration_menu">
						<!--coming soon-->
						<!--<a href="<?php echo ($_SESSION['current-language']==="fr"?"importer":"import"); ?>"><img src="lpslt/media/import.png"/><span><?php echo $_SESSION['locales']["import"][$_SESSION['current-language']]; ?></span></a>
						<a href="<?php echo ($_SESSION['current-language']==="fr"?"exporter":"export"); ?>"><img src="lpslt/media/export.png"/><span><?php echo $_SESSION['locales']["export"][$_SESSION['current-language']]; ?></span></a>-->
						<span class="lpslt_clearboth"></span>
					</div>
					<div id="page_title" class="textC">
						<?php echo $_SESSION['locales']["settings"][$_SESSION['current-language']]; ?>
					</div>
					<div class="container first">
						<form autocomplete="off">
						<?php
							$mysql=new mysqlUtils();
							$rUserAccounts=$mysql::selectAllWhere("users", [["name"=>"admin_user_id","operator"=>"=","value"=>$_SESSION["user_id"],"and|or"=>"or"],["name"=>"id","operator"=>"=","value"=>$_SESSION["user_id"],"and|or"=>null]], null);
							if (array_key_exists("id", $rUserAccounts) && count($rUserAccounts["id"])>0) {
								echo '
						<script type="text/javascript">
							var user_data=\''.addslashes(json_encode($rUserAccounts)).'\';
						</script>
						<div style="text-align:left; border-bottom:1px solid lightgrey;" class="textC"><span class="light_title">'.$_SESSION['locales']["userAccounts"][$_SESSION['current-language']].'</span></div>
';
								for ($i=0; $i<count($rUserAccounts["id"]); $i++) {
									echo '
							<div class="user_account set" data-dbid="'.$rUserAccounts["id"][$i].'" data-id="'.$i.'">
								<span class="field_15_35">
									<label class="textA" for="email">'.$_SESSION['locales']["email"][$_SESSION['current-language']].'</label><br />
									<input type="text" name="email_'.$i.'" class="textA email" value="'.$rUserAccounts["email"][$i].'" />
								</span>
								<span class="field_15_35">
									<label class="textA" for="password">'.$_SESSION['locales']["password"][$_SESSION['current-language']].'</label><br />
									<input type="password" name="password_'.$i.'" autocomplete="new-password" class="textA password" onfocus="lpslt.emptyIf(this, \'••••••••••\');" onblur="lpslt.fillIfEmpty(this, \'••••••••••\');" value="'.replacePassWithPoints($rUserAccounts["pass"][$i]).'" />
								</span>
								<span class="field_15_30">
									<label class="textA" for="status_'.$i.'">'.$_SESSION['locales']["role"][$_SESSION['current-language']].'</label><br />
									';
									if ($_SESSION['status']==="superadmin" && $rUserAccounts["status"][$i]!=="superadmin") {
										$mediumBox=buildMediumBox($i, ["admin","guest"], $rUserAccounts["status"][$i], "textA status_".$i);
										echo $mediumBox["html"].'
									<script type="text/javascript">onLoadedFunctions.push(function() { '.$mediumBox["js"].' });</script>';
									} else {
										echo '<input type="text" name="status_'.$i.'" class="textA status_'.$i.'" value="'.ucfirst($rUserAccounts["status"][$i]).'" readonly="readonly" />
									<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.mediumBoxChoices["_'.$i.'"]="'.$rUserAccounts["status"][$i].'"; });</script>';
									}
									echo '
								</span>
								<br class="hide_on_high_res" />
								<span class="field_15_35">
									<label class="textA" for="email">'.$_SESSION['locales']["firstName"][$_SESSION['current-language']].'</label><br />
									<input type="text" name="firstname_'.$i.'" class="textA firstname" value="'.$rUserAccounts["firstname"][$i].'" />
								</span>
								<span class="field_15_35">
									<label class="textA" for="email">'.$_SESSION['locales']["lastName"][$_SESSION['current-language']].'</label><br />
									<input type="text" name="lastname_'.$i.'" class="textA lastname" value="'.$rUserAccounts["lastname"][$i].'" />
								</span>
								<span class="medium_field">
									<label class="textA">'.$_SESSION['locales']["userLanguage"][$_SESSION['current-language']].'</label><br />
									<span>
										<button class="localeButton textA" onclick="admin.setUserLocale(\'en\', \''.$rUserAccounts["id"][$i].'\');"><img src="lpslt/media/en.png" style="vertical-align:middle; width:auto; height:calc(1.5em - 2px);'.($rUserAccounts["prefered_locale"][$i]==="fr"?" border:4px solid transparent; margin-top:-4px;":" border:4px solid white; margin-top:-4px;").'" id="user_locale_'.$rUserAccounts["id"][$i].'_en"/></button>&nbsp; &nbsp;
										<button class="localeButton textA" onclick="admin.setUserLocale(\'fr\', \''.$rUserAccounts["id"][$i].'\');"><img src="lpslt/media/fr.png" style="vertical-align:middle; width:auto; height:calc(1.5em - 2px);'.($rUserAccounts["prefered_locale"][$i]==="fr"?" border:4px solid white; margin-top:-4px;":" border:4px solid transparent; margin-top:-4px;").'" id="user_locale_'.$rUserAccounts["id"][$i].'_fr"/></button>
									</span>
									<script type="text/javascript">onLoadedFunctions.push(function() { admin.userLocale[\'_'.$rUserAccounts["id"][$i].'\']=\''.$rUserAccounts["prefered_locale"][$i].'\'; });</script>
								</span>
								<span class="field_10_15" style="text-align:center;">';
									if ($rUserAccounts["status"][$i]!=="superadmin") {
										echo '
									<label class="textA">'.$_SESSION['locales']["delete"][$_SESSION['current-language']].'</label><br />
									<button class="delButton" onclick="admin.deleteUser(\''.$rUserAccounts["id"][$i].'\');" style="display:inline-block; box-sizing:content-box; margin-top:0em; width:1.36em; height:1.36em; border-radius:0.25em;">
										<img src="lpslt/media/suppress.png" style="width:100%; height:100%;" />
									</button>';
									}
									echo '
								</span>
								<span class="lpslt_clearboth"></span>
							</div>
';
								}
							} else {
							 echo '
						<script type="text/javascript">
							var user_data=\'\';
						</script>
';
							}
							if ($_SESSION['status']==="superadmin") {
								echo '
						<div style="text-align:left; border-bottom:1px solid lightgrey;" class="textC"><span class="light_title">'.$_SESSION['locales']["setNewUserAccount"][$_SESSION['current-language']].'</span></div>
						<div class="user_account new" data-id="new">
							<span class="field_15_35">
								<label class="textA" for="email">'.$_SESSION['locales']["email"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="email" class="textA email" value="" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="password">'.$_SESSION['locales']["password"][$_SESSION['current-language']].'</label><br />
								<input type="password" name="password" autocomplete="new-password" class="textA password" value="" />
							</span>
							<span class="field_15_30">
								<label class="textA" for="status_new">'.$_SESSION['locales']["role"][$_SESSION['current-language']].'</label><br />
								';
								$mediumBox=buildMediumBox("new", ["admin","guest"], "guest", "textA status_new");
								echo $mediumBox["html"].'
								<script type="text/javascript">onLoadedFunctions.push(function() { '.$mediumBox["js"].' });</script>
							</span>
							<br class="hide_on_high_res" />
							<span class="field_15_35">
								<label class="textA" for="email">'.$_SESSION['locales']["firstName"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="firstname" class="textA firstname" value="" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="email">'.$_SESSION['locales']["lastName"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="lastname" class="textA lastname" value="" />
							</span>
							<span class="medium_field">
								<label class="textA">'.$_SESSION['locales']["userLanguage"][$_SESSION['current-language']].'</label><br />
								<span>
									<button class="localeButton textA" onclick="admin.setUserLocale(\'en\', \'new\');"><img src="lpslt/media/en.png" style="vertical-align:middle; width:auto; height:calc(1.5em - 2px); border:4px solid white; margin-top:-4px;" id="user_locale_new_en"/></button>&nbsp; &nbsp;
									<button class="localeButton textA" onclick="admin.setUserLocale(\'fr\', \'new\');"><img src="lpslt/media/fr.png" style="vertical-align:middle; width:auto; height:calc(1.5em - 2px); border:4px solid transparent; margin-top:-4px;" id="user_locale_new_fr"/></button>
								</span>
								<script type="text/javascript">onLoadedFunctions.push(function() { admin.userLocale[\'_new\']=\'en\'; });</script>
							</span>
							<span class="lpslt_clearboth"></span>
						</div>
';
							}
							echo '
						<div class="basic_full_width_container">
							<input class="textB button" type="button" onclick="admin.applyUserChanges();" value="'.$_SESSION['locales']["apply"][$_SESSION['current-language']].'" style="margin-top:0.5em;" />
						</div>';
						?>
						</form>
					</div>
					<div class="container">	
						<?php
							$rImapAccounts=$mysql::selectAllWhere("data_imap_accounts", [["name"=>"admin_user_id","operator"=>"=","value"=>$_SESSION["user_id"]]], null);
							if (array_key_exists("id", $rImapAccounts) && count($rImapAccounts["id"])>0) {
								for ($i=0; $i<count($rImapAccounts["id"]); $i++) {
									if (!!$keyAndIv) {
										$rImapAccounts["password"][$i]=decryptAES($rImapAccounts["password"][$i], $keyAndIv["key"], $keyAndIv["iv"]);									
									}
								}
								echo '
						<script type="text/javascript">
							var imap_data=\''.addslashes(json_encode($rImapAccounts)).'\';
						</script>
						<div style="text-align:left; border-bottom:1px solid lightgrey;" class="textC"><span class="light_title">'.$_SESSION['locales']["imapAccounts"][$_SESSION['current-language']].'</span></div>
';
								for ($i=0; $i<count($rImapAccounts["id"]); $i++) {
									echo '
						<div class="imap_account set" data-id="'.$rImapAccounts["id"][$i].'">
							<span class="field_15_35">
								<label class="textA" for="identifier">'.$_SESSION['locales']["identifier"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="imap_identifier" class="textA imap_identifier" value="'.$rImapAccounts["identifier"][$i].'" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="imap_password">'.$_SESSION['locales']["password"][$_SESSION['current-language']].'</label><br />
								<input type="password" name="imap_password" autocomplete="new-password" class="textA imap_password" value="'.$rImapAccounts["password"][$i].'" />
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA">'.$_SESSION['locales']["SSL"][$_SESSION['current-language']].'</label><br />
								<button class="dotButton" onclick="lpslt.switchCheckBox(this.querySelector(\'.dot\'), \'ssl_cert_'.$rImapAccounts["id"][$i].'\');" style="display:inline-block; box-sizing:content-box; margin-top:0em; background-color:#fff; width:1.36em; height:1.36em; border-radius:0.25em;">
									<span class="textA dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.25em; opacity:'.$rImapAccounts["ssl_cert"][$i].'"></span>
								</button>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates[\'ssl_cert_'.$rImapAccounts["id"][$i].'\']='.$rImapAccounts["ssl_cert"][$i].'; });</script>
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA">'.$_SESSION['locales']["check"][$_SESSION['current-language']].'</label><br />
								<button class="dotButton" onclick="lpslt.switchCheckBox(this.querySelector(\'.dot\'), \'check_cert_'.$rImapAccounts["id"][$i].'\');" style="display:inline-block; box-sizing:content-box; margin-top:0em; background-color:#fff; width:1.36em; height:1.36em; border-radius:0.25em;">
									<span class="textA dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.25em; opacity:'.$rImapAccounts["check_cert"][$i].'"></span>
								</button>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates[\'check_cert_'.$rImapAccounts["id"][$i].'\']='.$rImapAccounts["check_cert"][$i].'; });</script>
							</span>
							<br class="hide_on_high_res" />
							<span class="field_15_35">
								<label class="textA" for="server">'.$_SESSION['locales']["server"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="server" class="textA server" value="'.$rImapAccounts["server"][$i].'" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="port">'.$_SESSION['locales']["port"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="port" class="textA port" value="'.$rImapAccounts["port"][$i].'" />
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA">'.$_SESSION['locales']["active"][$_SESSION['current-language']].'</label><br />
								<button class="dotButton" onclick="lpslt.switchCheckBox(this.querySelector(\'.dot\'), \'active_'.$rImapAccounts["id"][$i].'\');" style="display:inline-block; box-sizing:content-box; margin-top:0em; background-color:#fff; width:1.36em; height:1.36em; border-radius:0.25em;">
									<span class="textA dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.25em; opacity:'.$rImapAccounts["active"][$i].'"></span>
								</button>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates[\'active_'.$rImapAccounts["id"][$i].'\']='.$rImapAccounts["active"][$i].'; });</script>
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA">'.$_SESSION['locales']["delete"][$_SESSION['current-language']].'</label><br />
								<button class="delButton" onclick="admin.deleteImap(\''.$rImapAccounts["id"][$i].'\');" style="display:inline-block; box-sizing:content-box; margin-top:0em; width:1.36em; height:1.36em; font-size:1em; border-radius:0.25em;">
									<img src="lpslt/media/suppress.png" style="width:100%; height:100%;" />
								</button>
							</span>
							<span class="lpslt_clearboth"></span>
							<span class="imap_account_status" id="imap_account_status_'.$rImapAccounts["id"][$i].'"></span>
						</div>
';
								}
							} else {
							 echo '
						<script type="text/javascript">
							var imap_data=\'\';
						</script>
';
							}
							echo '
						<div style="text-align:left; border-bottom:1px solid lightgrey;" class="textC"><span class="light_title">'.$_SESSION['locales']["setNewImapAccount"][$_SESSION['current-language']].'</span></div>
						<div class="imap_account new" data-id="new">
							<span class="field_15_35">
								<label class="textA" for="identifier">'.$_SESSION['locales']["identifier"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="imap_identifier" class="textA imap_identifier" value="" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="password">'.$_SESSION['locales']["password"][$_SESSION['current-language']].'</label><br />
								<input type="password" name="imap_password" class="textA imap_password" value="" />
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA">'.$_SESSION['locales']["SSL"][$_SESSION['current-language']].'</label><br />
								<button class="dotButton" onclick="lpslt.switchCheckBox(this.querySelector(\'.dot\'), \'ssl_cert_new\');" style="display:inline-block; box-sizing:content-box; margin-top:0em; background-color:#fff; width:1.36em; height:1.36em; border-radius:0.25em;">
									<span class="textA dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.25em; opacity:0"></span>
								</button>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates[\'ssl_cert_new\']=0; });</script>
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA">'.$_SESSION['locales']["check"][$_SESSION['current-language']].'</label><br />
								<button class="dotButton" onclick="lpslt.switchCheckBox(this.querySelector(\'.dot\'), \'check_cert_new\');" style="display:inline-block; box-sizing:content-box; margin-top:0em; background-color:#fff; width:1.36em; height:1.36em; border-radius:0.25em;">
									<span class="textA dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.25em; opacity:0"></span>
								</button>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates[\'check_cert_new\']=0; });</script>
							</span>
							<br class="hide_on_high_res" />
							<span class="field_15_35">
								<label class="textA" for="server">'.$_SESSION['locales']["server"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="server" class="textA server" value="" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="port">'.$_SESSION['locales']["port"][$_SESSION['current-language']].'</label><br />
								<input type="text" name="port" class="textA port" value="" />
							</span>
							<span class="lpslt_clearboth"></span>
						</div>
						<div class="basic_full_width_container">
							<input class="textB button" type="button" onclick="admin.applyImapChanges();" value="'.$_SESSION['locales']["apply"][$_SESSION['current-language']].'" style="margin-top:0.5em;" />
						</div>
';
						?>
					</div>
					<?php
						$rSMTP=$mysql::selectAllForId("data_smtp_account", 1, null);
						$mysql::closeMysql();
						if ($_SESSION['status']==="superadmin") {
							if (!!$keyAndIv) {
								$rSMTP["password"][0]=decryptAES($rSMTP["password"][0], $keyAndIv["key"], $keyAndIv["iv"]);									
							}
					?>
					<div class="container">
						<div style="text-align:left; border-bottom:1px solid lightgrey;" class="textC"><span class="light_title"><?php echo $_SESSION['locales']["smtpAccount"][$_SESSION['current-language']]; ?></span></div>
						<div id="smtp_account">
							<span class="field_15_35">
								<label class="textA" for="identifier"><?php echo $_SESSION['locales']["identifier"][$_SESSION['current-language']]; ?></label><br />
								<input type="text" name="smtp_identifier" class="textA smtp_identifier" value="<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?$rSMTP["identifier"][0]:""); ?>" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="password"><?php echo $_SESSION['locales']["password"][$_SESSION['current-language']]; ?></label><br />
								<input type="password" name="smtp_password" class="textA smtp_password" value="<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?$rSMTP["password"][0]:""); ?>" />
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA"><?php echo $_SESSION['locales']["SSL"][$_SESSION['current-language']]; ?></label><br />
								<button class="dotButton" onclick="lpslt.switchCheckBox(this.querySelector('.dot'), 'smtp_ssl_cert');" style="display:inline-block; box-sizing:content-box; margin-top:0em; background-color:#fff; width:1.36em; height:1.36em; border-radius:0.25em;">
									<span class="textA dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.25em; opacity:<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?(int)$rSMTP["ssl_cert"][0]:0); ?>"></span>
								</button>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates['smtp_ssl_cert']=<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?(int)$rSMTP["ssl_cert"][0]:0); ?>; });</script>
							</span>
							<span class="field_10_15" style="text-align:center;">
								<label class="textA"><?php echo $_SESSION['locales']["active"][$_SESSION['current-language']]; ?></label><br />
								<button class="dotButton" onclick="lpslt.switchCheckBox(this.querySelector('.dot'), 'smtp_active');" style="display:inline-block; box-sizing:content-box; margin-top:0em; background-color:#fff; width:1.36em; height:1.36em; border-radius:0.25em;">
									<span class="textA dot" style="display:block; margin:15%; width:70%; height:70%; background-color:#000; border-radius:0.25em; opacity:<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?(int)$rSMTP["active"][0]:0); ?>"></span>
								</button>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates['smtp_active']=<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?(int)$rSMTP["active"][0]:0); ?>; });</script>
							</span>
							<br class="hide_on_high_res" />
							<span class="field_15_35">
								<label class="textA" for="server"><?php echo $_SESSION['locales']["server"][$_SESSION['current-language']]; ?></label><br />
								<input type="text" name="smtp_server" class="textA smtp_server" value="<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?$rSMTP["server"][0]:""); ?>" />
							</span>
							<span class="field_15_35">
								<label class="textA" for="port"><?php echo $_SESSION['locales']["port"][$_SESSION['current-language']]; ?></label><br />
								<input type="text" name="smtp_port" class="textA smtp_port" value="<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?$rSMTP["port"][0]:""); ?>" />
							</span>
							<span class="medium_field" style="text-align:center;">
								<label class="textA"><?php echo $_SESSION['locales']["reportLanguage"][$_SESSION['current-language']]; ?></label><br />
								<span>
									<button class="localeButton textA" onclick="admin.setReportLocale('en');"><img src="lpslt/media/en.png" style="vertical-align:middle; width:auto; height:calc(1.5em - 2px);<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0 && $rSMTP["report_locale"][0]==="fr"?" border:4px solid transparent; margin-top:-4px;":" border:4px solid white; margin-top:-4px;"); ?>" id="report_locale_en"/></button>&nbsp; &nbsp;
									<button class="localeButton textA" onclick="admin.setReportLocale('fr');"><img src="lpslt/media/fr.png" style="vertical-align:middle; width:auto; height:calc(1.5em - 2px);<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0 && $rSMTP["report_locale"][0]==="fr"?" border:4px solid white; margin-top:-4px;":" border:4px solid transparent; margin-top:-4px;"); ?>" id="report_locale_fr"/></button>
								</span>
								<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.reportLocale='<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?$rSMTP["report_locale"][0]:"en"); ?>'; });</script>
							</span>
							<span class="lpslt_clearboth"></span>
							<div class="basic_full_width_container">
								<label class="textA"><?php echo $_SESSION['locales']["destEmailAdresses"][$_SESSION['current-language']]; ?></label><br />
								<input type="text" name="smtp_recipients" class="textA smtp_recipients" value="<?php echo (array_key_exists("id", $rSMTP) && count($rSMTP["id"])>0?$rSMTP["recipients"][0]:""); ?>" />
							</div>
						</div>
						<div class="basic_full_width_container">
							<input class="textB button" type="button" onclick="admin.applySmtpChanges();" value="<?php echo $_SESSION['locales']["apply"][$_SESSION['current-language']]; ?>" style="margin-top:0.5em;" />
						</div>
					</div>
					<div class="container">
						<div style="font-size:1.5em; text-align:left; border-bottom:1px solid lightgrey;"><span class="light_title"><?php echo $_SESSION['locales']["changeLogo"][$_SESSION['current-language']]; ?></span></div>
						<div id="_0" class="upload">
							<span class="choice"><?php echo $_SESSION['locales']["choose"][$_SESSION['current-language']]; ?></span>
							<span class="progressThumb"><span class="greenbar"></span></span>
							<span class="progressUpload"><span class="greenbar"></span><span class="absolute">0%</span></span>
							<input type="file" onchange="admin.prepareFiles(event);" />
						</div>
						<div class="basic_full_width_container">
							<?php
								echo '
							<input id="upload" class="textB button" type="button" onclick="admin.getIniValuesForUpload(admin.initUpload);" value="'.$_SESSION['locales']['apply'][$_SESSION['current-language']].'" style="margin-top:0.5em;" />
'; 
							?>
						</div>
					</div>
					<?php
						}
						$rToken=$mysql::selectAllForId("token", 1, null);
						if (array_key_exists("token", $rToken)) {
									echo '
					<div class="container">
						<div class="textA basic_full_width_container">
							'.$_SESSION['locales']["cronSettings"][$_SESSION['current-language']].'<br /><br />
							'.$_SESSION['locales']["forCrontabs"][$_SESSION['current-language']]." 0 */1 * * * ".$_SESSION['locales']["pathOfThisWebService"][$_SESSION['current-language']].'php/cron.php token=<span class="token">'.$rToken["token"][0].'</span><br /><br />
							'.$_SESSION['locales']["forCurlCallings"][$_SESSION['current-language']]." curl '".$_SESSION['locales']["localUrlOfWebService"][$_SESSION['current-language']].'php/cron.php?token=<span class="token">'.$rToken["token"][0]."</span>'".'<br /><br />
							<button class="textB button" onclick="admin.regenerateCronToken();">'.$_SESSION['locales']["regenerateToken"][$_SESSION['current-language']].'</button>
						</div>
					</div>';			
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
                onLoadedFunctions.push(function () { admin.init(function() { admin.checkImaps(); }, "reload"); });
        </script>',"\n";
        } else if (isset($_SESSION['auth'], $_SESSION['passphrase']) && $_SESSION['auth'] && !$_SESSION['direct']) {
        	echo "\t",'<script type="text/javascript" class="lpslt_admin_script">
                onLoadedFunctions.push(function () { admin.init(function() { admin.checkImaps(); }, "ajax"); });
        </script>',"\n";
        }
?>
</body>
</html>