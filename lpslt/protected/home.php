<?php
include_once(__DIR__.'/../php/session.php');
include_once(__DIR__.'/../php/mysql_utils.php');
include_once(__DIR__.'/../php/locales.php'); 
if (!isset($_SESSION['auth']) || !$_SESSION['auth'] || (int)$_SESSION['level']<0 || preg_match('/protected\//', $_SERVER["REQUEST_URI"])) {
	header('Location: '.(isset($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS'])==="on"?'https':'http').'://'.$_SERVER['HTTP_HOST'].substr($_SERVER['REQUEST_URI'], 0, strpos($_SERVER['REQUEST_URI'], '/protected')).'/'.'401');
}
function extractStrings($m) {
	$s='';
	for ($h=0; $h<count($m); $h++) {
		if (array_key_exists(1, $m[$h])) {
			for ($i=0; $i<count($m[$h][1]); $i++) {
				$s.=$m[$h][1][$i][0].(!($i===count($m[$h][1])-1 && $h===count($m)-1)?', ':'');
			}
		}
	}
	return $s;
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
		.table { width:100%; border:none; }
		.tr { overflow:hidden; }
		.tr.even { background-color:#ddd; }
		.tr.odd { background-color:#ccc; }
		.td { box-sizing:border-box; text-align:left; }
		.td>span:not(.back) {
			z-index:2;
			display:inline-block;
			margin:0.35em;
		}
		.td>b {
			display:inline-block;
			margin:0.35em;
		}
		.td.even { overflow:visible; }
		.td.even .back { position:absolute; left:0; width:100%; height:999999px; background-color:rgba(255,255,255,0.2); }
		.td.odd { overflow:visible; }
		.td.odd .back { position:absolute; left:0; width:100%; height:999999px; background-color:rgba(255,255,255,0.1); }
		.td>span.status { display:block; position:absolute; right:0; vertical-align:baseline; border-radius:0.5em; overflow:hidden; width:1em; height:1em; }
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
						<?php echo $_SESSION['locales']["overview"][$_SESSION['current-language']]; ?>
					</div>
					<div>
						<button class="button textB" onclick="admin.getTokenAndLaunchMonitoring();"><?php echo $_SESSION['locales']["LaunchMonitoringTaskManually"][$_SESSION['current-language']]; ?></button><br />
						<button class="button textB" onclick="admin.getTokenAndLaunchCleaning();"><?php echo $_SESSION['locales']["LaunchCleaningTaskManually"][$_SESSION['current-language']]; ?></button><br />
						<span class="italic"><?php echo $_SESSION['locales']["theseActionsCanTakeSomeTime"][$_SESSION['current-language']]; ?></span>
					</div>
					<div class="container first">
						<?php
							$mysql=new mysqlUtils();
							$smtp_account=$mysql::selectAllForId("data_smtp_account", 1, null);
							$rDataCustomers=$mysql::selectAllPlusString("data_customers", "where active=1 and (admin_user_id='".$_SESSION['user_id']."' or allowed_user_ids_json REGEXP '[[:<:]]".$_SESSION['user_id']."[[:>:]]')", null);
							$rDataCustomers=sortOn($rDataCustomers, "name", SORT_NATURAL, true);
							$mysql::closeMysql();
							if (array_key_exists("id", $smtp_account) && count($smtp_account["id"])>0 && array_key_exists("id", $rDataCustomers) && count($rDataCustomers["id"])>0) {
								$html="\t\t\t\t\t\t".'<div class="table" style="position:relative; max-width:100%; width:100%;">'."\n";
								$html.="\t\t\t\t\t\t\t".'<div class="tr" style="position:relative; max-width:100%; width:100%;">'."\n";
								$html.="\t\t\t\t\t\t\t\t".'<span class="td even" style="position:relative; max-width:49.9%; width:49.9%;"><b class="textA">'.$_SESSION['locales']["customerName"][$_SESSION['current-language']].'</b></span>'."\n";
								$html.="\t\t\t\t\t\t\t\t".'<span class="td odd" style="position:relative; max-width:49.9%; width:49.9%;"><b class="textA">'.$_SESSION['locales']["status"][$_SESSION['current-language']].' :</b></span>'."\n";
								$html.="\t\t\t\t\t\t\t".'</div>'."\n";
								for ($i=0; $i<count($rDataCustomers["id"]); $i++) {
									$rDataServices=$mysql::selectAllWhere("data_services", [["name"=>"active","operator"=>"=","value"=>1,"and|or"=>"and"],["name"=>"customer_id","operator"=>"=","value"=>$rDataCustomers["id"][$i],"and|or"=>null]], null);
									$color=array_key_exists('id', $rDataServices) && count($rDataServices["id"])>0?"green":"orange";
									if (array_key_exists('id', $rDataServices)) {
										for ($j=0; $j<count($rDataServices["id"]); $j++) {
											if ((int)$rDataServices["monitoring_status"][$j]===0 && !((int)$rDataServices["identification_status"][$j]===0 && (int)$rDataServices["let_status_green_if_not_identified"][$j]===1)) {
												$color="red";
											}
											if ((int)$rDataServices['last_check_time'][$j]===0 || is_nan((int)$rDataServices['last_check_time'][$j])) {
												$color="orange";
											}
										}
									}
									$html.="\t\t\t\t\t\t\t".'<button style="display:block; width:100%; margin:0;" onclick="lpslt.expandReduce(\'_'.$i.'\');"><div class="tr '.($i%2===0?"even":"odd").'" style="position:relative; max-width:100%; width:100%;">'."\n";
									$html.="\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:80%; width:80%;">'."\n";
									$html.="\t\t\t\t\t\t\t\t\t".'<span class="textB">'.$rDataCustomers["name"][$i].'</span>'."\n";
									$html.="\t\t\t\t\t\t\t\t".'</span>'."\n";
									$html.="\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:20%; width:20%; text-align:right;">'."\n";
									$html.="\t\t\t\t\t\t\t\t\t".'<span class="textB status" style="background-color:'.$color.';"></span>'."\n";
									$html.="\t\t\t\t\t\t\t\t".'</span>'."\n";
									$html.="\t\t\t\t\t\t\t".'</div></button>'."\n";
									if (array_key_exists('id', $rDataServices) && count($rDataServices["id"])>0) {
										$html.="\t\t\t\t\t\t\t".'<div class="tr '.($i%2===0?"even":"odd").'" style="max-width:100%; width:100%;">'."\n";
										$html.="\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:100%; width:100%;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t".'<div id="_'.$i.'" class="expand" style="position:relative; max-width:100%; width:100%; height:0; overflow:hidden;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t".'<div class="table" style="max-width:100%; width:100%;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t".'<div class="tr" style="max-width:100%; width:100%;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:20%; width:20%;"><b class="textA">'.$_SESSION['locales']["service"][$_SESSION['current-language']].'</b></span>'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:20%; width:20%;"><b class="textA">'.$_SESSION['locales']["matches"][$_SESSION['current-language']].'</b></span>'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:20%; width:20%;"><b class="textA">'.$_SESSION['locales']["lastCheckDate"][$_SESSION['current-language']].'</b></span>'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:20%; width:20%;"><b class="textA">'.$_SESSION['locales']["lastSuccessDate"][$_SESSION['current-language']].'</b></span>'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:20%; width:20%;"><b class="textA">'.$_SESSION['locales']["status"][$_SESSION['current-language']].'</b></span>'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t".'</div>'."\n";
									} else {
										$html.="\t\t\t\t\t\t\t".'<div class="tr '.($i%2===0?"even":"odd").'" style="position:relative; max-width:100%; width:100%; height:0; overflow:hidden;">'."\n";
										$html.="\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:100%; width:100%;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t".'<div id="_'.$i.'" class="expand" style="max-width:100%; width:100%; height:0; overflow:hidden;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t".'<div class="table" style="max-width:100%; width:100%;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t".'<div class="tr" style="max-width:100%; width:100%;">'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td" style="max-width:100%; width:100%;"><span class="textA">'.$_SESSION['locales']["noItemDefinedYet"][$_SESSION['current-language']].'</span></span>'."\n";
										$html.="\t\t\t\t\t\t\t\t\t\t\t".'</div>'."\n";
									}
									if (array_key_exists('id', $rDataServices)) {
										for ($j=0; $j<count($rDataServices["id"]); $j++) {
											$matches=preg_match('/^\{(.*)\}$/', $rDataServices["last_check_matched_values"][$j])?json_decode($rDataServices["last_check_matched_values"][$j], true):[""];
											if (array_key_exists(0, $matches["identification"]) && $matches["identification"][0]==="noMailReceivedBeforeTimeout") {
												$color="orange";
											} else if ((int)$rDataServices["monitoring_status"][$j]===0 && !((int)$rDataServices["identification_status"][$j]===0 && (int)$rDataServices["let_status_green_if_not_identified"][$j]===1)) {
												$color="red";
											} else if ((int)$rDataServices["monitoring_status"][$j]===1) {
												$color="green";
											} else {
												$color="green";
											}
											$html.="\t\t\t\t\t\t\t\t\t\t\t".'<div class="tr '.($j%2===0?"even":"odd").'" style="max-width:100%; width:100%;">'."\n";
											$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td even" style="max-width:20%; width:20%;"><span class="back"></span><span class="textA">'.$rDataServices['service_or_machine_name'][$j].'</span></span>'."\n";
											$m=$matches["monitoring"];
											for ($z=0; $z<count($m); $z++) {
												if (is_string($m[$z]) && preg_match('/^\[.*\]$/', $m[$z])) {
													$m[$z]=json_decode($m[$z], true);
												}
											}
											$s=extractStrings($m);
											$uid=$matches["uid"];
											$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td even" style="max-width:20%; width:20%;"><span class="back"></span><span class="textA"><i>'.(!(array_key_exists(0, $matches["identification"]) && $matches["identification"][0]==="noMailReceivedBeforeTimeout")?$s.(!empty($uid)?'<br /><button onclick="admin.seeFullMessageInit(\''.$uid.'\', \''.$rDataServices["imap_path"][$j].'\', \''.$rDataServices["imap_account_id"][$j].'\');">Voir le message</button>':''):$_SESSION['locales']["noMailReceivedBeforeTimeout"][$_SESSION['current-language']]).'</i></span></span>'."\n";
											$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td odd" style="max-width:20%; width:20%;"><span class="back"></span><span class="textA">'.date('d/m/Y H:i:s', (int)$rDataServices['last_check_time'][$j]).'</span></span>'."\n";
											$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td even" style="max-width:20%; width:20%;"><span class="back"></span><span class="textA">'.((int)$rDataServices['last_success_time'][$j]!==0?date('d/m/Y H:i:s', (int)$rDataServices['last_success_time'][$j]):$_SESSION['locales']["never"][$_SESSION['current-language']]).'</span></span>'."\n";
											$html.="\t\t\t\t\t\t\t\t\t\t\t\t".'<span class="td odd" style="max-width:20%; width:20%; text-align:right;"><span class="back"></span><span class="status" style="background-color:'.$color.';"></span></span>'."\n";
											$html.="\t\t\t\t\t\t\t\t\t\t\t".'</div>'."\n";
										}
									}
									$html.="\t\t\t\t\t\t\t\t\t\t".'</div>'."\n";
									$html.="\t\t\t\t\t\t\t\t\t".'</div>'."\n";
									$html.="\t\t\t\t\t\t\t\t".'</span>'."\n";
									$html.="\t\t\t\t\t\t\t".'</div>'."\n";
								}
								$html.="\t\t\t\t\t\t".'</div>'."\n";
								echo $html;
							} else {
								echo $_SESSION['locales']["noDataYet"][$_SESSION['current-language']];
							}
						?>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="lpslt_searchResults" style="display:none; width:auto; height:auto; position:fixed; z-index:10001;">
		<div id="lpslt_searchResultsCont" style="width:18em;">
			<div id="lpslt_bubble_top" style="width:100%; height:0px; position:relative; text-align:left;"><img src="lpslt/media/bubble_top.png" style="border:none; width:100%; height:100%;"/></div><div id="lpslt_bubble_middle" style="top:-1px; width:100%; height:0px; position:relative; text-align:left;"><img src="lpslt/media/bubble_middle.png" style="border:none; width:100%; height:100%; position:absolute; left:0%;"/><span id="lpslt_bubble_content" style="display:block; width:100%; height:100%; position:relative; top:0em; opacity:0;"></span></div><div id="lpslt_bubble_bottom" style="top:-1px; width:100%; height:0px; position:relative; text-align:left;"><img src="lpslt/media/bubble_bottom.png" style="border:none; width:100%; height:100%; position:absolute;"/></div>
		</div>
	</div><?php
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