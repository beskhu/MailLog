<?php
	@include_once(__DIR__.'/../php/mysql_utils.php');
	@include_once(__DIR__.'/../php/utils.php');
	@include_once(__DIR__.'/../php/session.php');
	@include_once(__DIR__.'/../php/locales.php');
	$mysql=new mysqlUtils();
	$logout=$mysql::selectAllPlusString("pages", ' where file="logout" and active=1 and parent_id is null and locale="'.$_SESSION['current-language'].'" order by ordering', null);
	$pages=$mysql::selectAllPlusString("pages", ' where show_in_menu=1 and active=1 and auth_context='.(isset($_SESSION['auth']) && $_SESSION['auth']?'1':'0').' and parent_id is null and locale="'.$_SESSION['current-language'].'" order by ordering', null);
	$layout=$mysql::selectAllPlusString("layout", ' where id=1', null);
	if (array_key_exists('id', $layout) && count($layout['id'])===1) {
		$logo=$layout['logoImage'][0];
	} else {
		$logo=null;
	}
	echo	
		'<div id="headerAndMenu">
			<div id="header" class="lpslt_resizable">
				<div id="header_part_1">
					<div id="logo" style="'.($logo!==null?'background-image:url(lpslt/'.$logo.'?mod='.filemtime(__DIR__.'/../'.$logo).');':'').'">
					</div>
					<div id="title">
						<span class="textC bold">'.$_SESSION['locales']['baseTitle'][$_SESSION['current-language']].'</span>
					</div>'.(isset($_SESSION['auth']) && $_SESSION['auth']?'
					<div id="logout">
						<a href="'.$logout["slug"][0].'">'.(!empty($logout['icon_path'][0])?'&nbsp;<img alt="'.$pages['title'][0].'" src="lpslt/'.$logout['icon_path'][0].'" />':'').'</a>
					</div>':'').'
				</div>
				<div id="header_part_2">
					<ul>';
						if (array_key_exists('id', $pages)) {
							for ($i=0; $i<count($pages['id']); $i++) {
								if ((isset($_SESSION['auth']) && $_SESSION['auth'] && (int)$pages['user_level'][$i]<=$_SESSION['level']) || !isset($_SESSION['auth'])) {
									echo '
						<li class="lpslt_menu_item">
							<a href="'.$pages['slug'][$i].'">'.(!empty($pages['icon_path'][$i])?'<img alt="'.$pages['title'][$i].'" src="lpslt/'.$pages['icon_path'][$i].'" />&nbsp;':'').'<span class="textA">'.$pages['title'][$i].'</span></a>
						</li>';
								}
							}
						}
						echo
						'
						<li class="lpslt_menu_item">
							<button onclick="lpslt.setLocale(\'en\');"><img src="lpslt/media/en.png" style="width:auto; height:1.2em; margin-top:-0.2em;'.($_SESSION['current-language']==="en"?" border:2px solid white;":"").'"/></button>
						</li>
						<li class="lpslt_menu_item">
							<button onclick="lpslt.setLocale(\'fr\');"><img src="lpslt/media/fr.png" style="width:auto; height:1.2em; margin-top:-0.2em;'.($_SESSION['current-language']==="fr"?" border:2px solid white;":"").'"/></button>
						</li>
					</ul>
				</div>
			</div>
		</div>
';
	$mysql::closeMysql();
?>