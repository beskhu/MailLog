<?php
include_once(__DIR__.'/../php/session.php');
include_once(__DIR__.'/../php/mysql_utils.php');
include_once(__DIR__.'/../php/locales.php'); 
if (!isset($_SESSION['auth']) || !$_SESSION['auth'] || (int)$_SESSION['level']<1 || preg_match('/protected\//', $_SERVER["REQUEST_URI"])) {
	header('Location: '.(isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS'])==="on"?'https':'http').'://'.$_SERVER['HTTP_HOST'].substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/protected')).'/'.'401');
}
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
					<div id="page_title" class="textC">
						<?php echo $_SESSION['locales']["servicesConfiguration"][$_SESSION['current-language']]; ?>		
					</div>
					<div class="container_100" id="customers">
						<?php
							$mysql=new mysqlUtils();
							$rCustomers=$mysql::selectAllWhere("data_customers", [["name"=>"admin_user_id","operator"=>"=","value"=>$_SESSION["user_id"],"and|or"=>null]], null);
							$rCustomers=sortOn($rCustomers, "name", SORT_NATURAL, true);
							$rImapAccounts=$mysql::selectAllWhere("data_imap_accounts", [["name"=>"admin_user_id","operator"=>"=","value"=>$_SESSION["user_id"],"and|or"=>null]], null);
							if (array_key_exists("id", $rImapAccounts) && count($rImapAccounts["id"])>0) {
								echo 
						'<script type="text/javascript">
							var imap_data=\''.addslashes(json_encode($rImapAccounts)).'\';
						</script>
';
							} else {
								echo 
						'<script type="text/javascript">
							var imap_data=\'\';
						</script>
';
							}
						?>
						<div style="text-align:left; border-bottom:1px solid lightgrey;" class="textB"><span class="light_title"><?php echo $_SESSION['locales']["customersAndServices"][$_SESSION['current-language']]; ?></span></div>
						<div id="customers_list">
							<?php
							if (array_key_exists("id", $rCustomers) && count($rCustomers["id"])>0) {
								echo 
							'<script type="text/javascript">
								var customer_data=\''.addslashes(json_encode($rCustomers)).'\';
							</script>
							<form autocomplete="off">
';
								for ($i=0; $i<count($rCustomers["id"]); $i++) {
									echo 
							'
								<div class="box customer set" id="box_'.$i.'" data-id="'.$rCustomers["id"][$i].'" style="color:rgb(255,255,255); background-color:rgb(127,127,127);">
									<span class="field_10" style="text-align:center;">
										<button onclick="lpslt.toggleBox('.$i.', \'_white\'); return false;" style="display:inline-block; vertical-align:middle; box-sizing:content-box; width:100%; height:1.5rem; font-size:1rem; border-radius:0.25em;">
											<img src="lpslt/media/box_arrow_right_white.png" style="width:auto; height:100%;" alt="arrow" />
										</button>
									</span>
									<span class="field_45">
										<input type="text" name="name_'.$rCustomers["id"][$i].'" class="name textA" autocomplete="off" value="'.$rCustomers["name"][$i].'" />
									</span>
									<span class="field_25" style="text-align:center;">
										<button class="toggle" onclick="lpslt.checkText(\'#active_'.$rCustomers["id"][$i].'\', [\''.$_SESSION['locales']["inactive"][$_SESSION['current-language']].'\', \''.$_SESSION['locales']["active"][$_SESSION['current-language']].'\']); return false;" style="display:inline-block; box-sizing:content-box; margin-top:1px; width:auto; height:2rem; font-size:0.75em;">
											<span class="textA">'.$_SESSION['locales']["status"][$_SESSION['current-language']].' : </span><span id="active_'.$rCustomers["id"][$i].'" class="textA">'.($rCustomers["active"][$i]=="1"?$_SESSION['locales']["active"][$_SESSION['current-language']]:$_SESSION['locales']["inactive"][$_SESSION['current-language']]).'</span>
										</button>
										<script type="text/javascript">onLoadedFunctions.push(function() { lpslt.checkboxStates[\'active_'.$rCustomers["id"][$i].'\']='.$rCustomers["active"][$i].'; });</script>
									</span>
									<span class="field_20" style="text-align:center;">
										<button onclick="admin.deleteCustomer(\''.$rCustomers["id"][$i].'\', \'#box_'.$i.'\'); return false;" style="display:inline-block; box-sizing:content-box; margin-top:1px; width:auto; height:2rem; font-size:0.75em; border-radius:0.25em;">
											<span class="textA">'.$_SESSION['locales']["delete"][$_SESSION['current-language']].'</span>
										</button>
									</span>
									<span class="lpslt_clearboth"></span>
									<div class="box_content">';
									$rServices=$mysql::selectAllWhere("data_services", [["name"=>"customer_id","operator"=>"=","value"=>$rCustomers["id"][$i],"and|or"=>null]], null);
									if (array_key_exists("id", $rServices) && count($rServices["id"])>0) {
										for ($j=0; $j<count($rServices["id"]); $j++) {
											echo '
										<span class="basic_indent_full_width_container" style="font-weight:200;"><button onclick="admin.editMonitoringItem('.$rServices["id"][$j].', '.$rCustomers["id"][$i].', \''.addslashes($rCustomers["name"][$i]).'\'); return false;" class="textA multiple">'.$rServices["service_or_machine_name"][$j].'</button>&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;<button onclick="admin.deleteMonitoringItem('.$rServices["id"][$j].', '.$rCustomers["id"][$i].', \''.addslashes($rCustomers["name"][$i]).'\'); return false;" class="textA multiple">'.$_SESSION['locales']["delete"][$_SESSION['current-language']].'</button></span>		
';
										}
									} else {
										echo '
										<span class="basic_indent_full_width_container textA" style="font-weight:200;" id="none"><i>'.$_SESSION['locales']["noItemDefinedYet"][$_SESSION['current-language']].'</i></span>
';
									}
									echo '
										<button class="basic_indent_full_width_container textA" onclick="admin.addMonitoringItem('.$rCustomers["id"][$i].', \''.addslashes($rCustomers["name"][$i]).'\'); return false;">'.$_SESSION['locales']["addItem"][$_SESSION['current-language']].'</button>
									</div>
								</div>';
								}
								echo '
								<script type="text/javascript">	
									onLoadedFunctions.push(function() {
										lib(".customer .name").on("keyup", function(e) { admin.setNameAtRightIfMonitoringOpened(e.libTarget); });
										lib(".customer .name").on("change", function(e) { admin.setNameAtRightIfMonitoringOpened(e.libTarget); });
										lib(".customer .name").on("paste", function(e) { admin.setNameAtRightIfMonitoringOpened(e.libTarget); });
									});
								</script>
							</form>';
							} else {
							 	echo 
							'<script type="text/javascript">
								var customer_data=\'\';
							</script>
							<form autocomplete="off">
							</form>';
							}
							?>
						</div>
						<?php
							echo 
						'<div class="basic_full_width_container">
							<input class="textA button" type="button" onclick="admin.createNewCustomer();" value="'.$_SESSION['locales']["setNewCustomer"][$_SESSION['current-language']].'" style="margin-top:0.5em;" />&nbsp;
							<input class="textA button" type="button" onclick="admin.applyCustomerChanges();" value="'.$_SESSION['locales']["apply"][$_SESSION['current-language']].'" style="margin-top:0.5em;" />
						</div>
';
							$mysql::closeMysql();
						?>
					</div>
					<div class="container_100" id="service_item">
					</div>
					<span class="lpslt_clearboth"></span>
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
		onLoadedFunctions.push(function () { admin.init(function() { }, "reload"); });
    </script>',"\n";
        } else if (isset($_SESSION['auth'], $_SESSION['passphrase']) && $_SESSION['auth'] && !$_SESSION['direct']) {
        	echo "\t",'<script type="text/javascript" class="lpslt_admin_script">
		onLoadedFunctions.push(function () { admin.init(function() { }, "ajax"); });
    </script>',"\n";
        }
?>
</body>
</html>