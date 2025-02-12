# ************************************************************
# Sequel Ace SQL dump
# Version 20080
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Hôte: 127.0.0.1 (MySQL 8.4.2)
# Base de données: maillog
# Temps de génération: 2025-02-12 04:53:35 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump de la table crypto_keys
# ------------------------------------------------------------

DROP TABLE IF EXISTS `crypto_keys`;

CREATE TABLE `crypto_keys` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `crypto_key` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `crypto_iv` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `crypto_keys` WRITE;
/*!40000 ALTER TABLE `crypto_keys` DISABLE KEYS */;

INSERT INTO `crypto_keys` (`id`, `crypto_key`, `crypto_iv`)
VALUES
	(1,SUBSTRING(SHA2(RAND(), 512), 1, 64),SUBSTRING(SHA2(RAND(), 512), 1, 32));

/*!40000 ALTER TABLE `crypto_keys` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table data_customers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data_customers`;

CREATE TABLE `data_customers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` int DEFAULT NULL,
  `allowed_user_ids_json` tinytext COLLATE utf8mb4_general_ci,
  `name` tinytext COLLATE utf8mb4_general_ci,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump de la table data_imap_accounts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data_imap_accounts`;

CREATE TABLE `data_imap_accounts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` int DEFAULT NULL,
  `identifier` tinytext COLLATE utf8mb4_general_ci,
  `password` tinytext COLLATE utf8mb4_general_ci,
  `server` tinytext COLLATE utf8mb4_general_ci,
  `port` int DEFAULT NULL,
  `ssl_cert` tinyint(1) DEFAULT NULL,
  `check_cert` tinyint(1) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump de la table data_reports
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data_reports`;

CREATE TABLE `data_reports` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `date_sent_AAAAMMJJHHii` bigint DEFAULT NULL,
  `time_sent` bigint DEFAULT NULL,
  `has_bad_status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump de la table data_services
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data_services`;

CREATE TABLE `data_services` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` int DEFAULT NULL,
  `allowed_user_ids_json` tinytext COLLATE utf8mb4_general_ci,
  `customer_id` int DEFAULT NULL,
  `imap_account_id` int DEFAULT NULL,
  `imap_path` tinytext COLLATE utf8mb4_general_ci,
  `service_or_machine_name` tinytext COLLATE utf8mb4_general_ci,
  `identification_rules` text COLLATE utf8mb4_general_ci,
  `let_status_green_if_not_identified` tinyint(1) DEFAULT '0',
  `identification_actions` text COLLATE utf8mb4_general_ci,
  `identification_status` tinyint(1) DEFAULT NULL,
  `monitoring_rules` text COLLATE utf8mb4_general_ci,
  `monitoring_status_if_matched` tinyint(1) DEFAULT NULL,
  `monitoring_actions` text COLLATE utf8mb4_general_ci,
  `monitoring_status` tinyint(1) DEFAULT NULL,
  `cleaning_timeout_hours` int DEFAULT NULL,
  `cleaning_actions` text COLLATE utf8mb4_general_ci,
  `periodicity_hours` int DEFAULT NULL,
  `fail_timeout_hours` int DEFAULT NULL,
  `last_success_time` bigint DEFAULT '0',
  `last_success_date_AAAAMMJJHHii` bigint DEFAULT NULL,
  `last_check_time` bigint DEFAULT '0',
  `last_check_date_AAAAMMJJHHii` bigint DEFAULT NULL,
  `last_check_matched_values` mediumtext COLLATE utf8mb4_general_ci,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump de la table data_smtp_account
# ------------------------------------------------------------

DROP TABLE IF EXISTS `data_smtp_account`;

CREATE TABLE `data_smtp_account` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `identifier` tinytext COLLATE utf8mb4_general_ci,
  `password` tinytext COLLATE utf8mb4_general_ci,
  `server` tinytext COLLATE utf8mb4_general_ci,
  `port` int DEFAULT NULL,
  `ssl_cert` tinyint(1) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `report_locale` varchar(2) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recipients` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `data_smtp_account` WRITE;
/*!40000 ALTER TABLE `data_smtp_account` DISABLE KEYS */;

INSERT INTO `data_smtp_account` (`id`, `identifier`, `password`, `server`, `port`, `ssl_cert`, `active`, `report_locale`, `recipients`)
VALUES
	(1,'','','',465,1,1,'','');

/*!40000 ALTER TABLE `data_smtp_account` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table ip_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ip_log`;

CREATE TABLE `ip_log` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `ip` tinytext,
  `timestamp` bigint DEFAULT NULL,
  `fails` tinyint(1) DEFAULT NULL,
  `bot` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump de la table layout
# ------------------------------------------------------------

DROP TABLE IF EXISTS `layout`;

CREATE TABLE `layout` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `logoImage` tinytext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

LOCK TABLES `layout` WRITE;
/*!40000 ALTER TABLE `layout` DISABLE KEYS */;

INSERT INTO `layout` (`id`, `logoImage`)
VALUES
	(1,X'6D656469612F6C6F676F2E706E67');

/*!40000 ALTER TABLE `layout` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table locales
# ------------------------------------------------------------

DROP TABLE IF EXISTS `locales`;

CREATE TABLE `locales` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `en` text COLLATE utf8mb4_general_ci,
  `fr` text COLLATE utf8mb4_general_ci,
  `index` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index` (`index`(64))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `locales` WRITE;
/*!40000 ALTER TABLE `locales` DISABLE KEYS */;

INSERT INTO `locales` (`id`, `en`, `fr`, `index`)
VALUES
	(5,'Your password :','Votre mot de passe :','askForPassword'),
	(6,'... please contact the website administrator','... veuillez joindre l\'administrateur de ce site web','contactAdministrator'),
	(7,'Ok','Valider','ok'),
	(8,'Cancel','Annuler','cancel'),
	(9,'Default font','Police par défaut','defaultFontString'),
	(10,'current font','police courante','currentFontString'),
	(11,'english','french','language'),
	(14,'dimensions for a window of 2000px width : ','dimensions pour une fenêtre de largeur 2000px : ','dimensionsNotice'),
	(15,'An error has occured&nbsp;: ','Une erreur est survenue&nbsp;: ','errorHasOccured'),
	(17,'Current font','Police courante','currentFont'),
	(18,'Monday','Lundi','day_1'),
	(19,'Tuesday','Mardi','day_2'),
	(20,'Wednesday','Mercredi','day_3'),
	(21,'Thursday','Jeudi','day_4'),
	(22,'Friday','Vendredi','day_5'),
	(23,'Saturday','Samedi','day_6'),
	(24,'Sunday','Dimanche','day_7'),
	(25,'Mon','Lun','mon'),
	(26,'Tue','Mar','tue'),
	(27,'Wed','Mer','wed'),
	(28,'Thu','Jeu','thu'),
	(29,'Fri','Ven','fri'),
	(30,'Sat','Sam','sat'),
	(31,'Sun','Dim','sun'),
	(32,'Save','Enregistrer','save'),
	(33,'Delete','Effacer','delete'),
	(34,'New','Nouveau','new'),
	(35,'Used languages','Langages utilisés','usedLanguages'),
	(36,'January','Janvier','month_1'),
	(37,'February','Février','month_2'),
	(38,'March','Mars','month_3'),
	(39,'April','Avril','month_4'),
	(40,'May','Mai','month_5'),
	(41,'June','Juin','month_6'),
	(42,'July','Juillet','month_7'),
	(43,'August','Août','month_8'),
	(44,'September','Septembre','month_9'),
	(45,'October','Octobre','month_10'),
	(46,'November','Novembre','month_11'),
	(47,'December','Décembre','month_12'),
	(48,'Sorry, no result matched this search.','Désolé, cette recherche n\'a retourné aucun résultat.','noSearchResult'),
	(49,'Move','Déplacer','move'),
	(50,'Search results :','Résultats de recherche :','searchResults'),
	(51,'Fail&nbsp;: incorrect password&nbsp;!','Échec&nbsp;: mot de passe incorrect&nbsp;!','incorrectPassword'),
	(52,' For security reasons you can attempt to log still ',' Pour des raisons de sécurité il vous reste ','security_1'),
	(53,' times after what you will be unable to login for 1 hour.',' tentatives au-delà desquelles il faudra attendre une heure pour tenter de nouveau.','security_2'),
	(54,'Fail&nbsp;: login has been temprary disabled because you have tried 6 times to login with an incorrect password... You will be able to try again one hour after your last failed attempt.','Échec&nbsp;: l\'authentification est bloquée temporairement car vous avez tenté de vous connecter 6 fois ou plus avec un mot de passe erroné... Vous pourrez tenter de vous connecter de nouveau une heure après la dernière tentaive échouée.','tooMuchAttempts'),
	(55,'Fail&nbsp;: login has been disabled because you have tried to login in a so short interval that we suspect you\\\'re a bot.','Échec&nbsp;: l\'authentification est bloquée car vous avez tenté de vous connecter dans un lapse de temps suffisamment court pour que nous suspections que vous êtes un robot.','seemsToBeBot'),
	(56,'success&nbsp;: correct identification.','succès&nbsp;: identification correcte.','loginSucceeded'),
	(57,'MySQL error : ','Erreur MySQL : ','mysqlError'),
	(58,'Database error : no password is set on the serveur side.','Erreur de base de données : aucun mot de passe n\'est défini côté serveur.','passwordDbError'),
	(59,'Signed out !','Deconnexion réussie !','loggedOut'),
	(60,'Confirm sign out ?','Confirmer déconnexion ?','confirmLogout'),
	(61,'Browsing is disabled in edit mode&nbsp;!','La navigation est désactivée en mode d\'édition&nbsp;!','browsingDisabled'),
	(62,'MySQL says ','MySQL dit ','mysqlSays'),
	(63,'a dependency has not been found.','une dépendance est introuvable.','dependencyError'),
	(64,'unknown argument','argument inconnu','unknownArgument'),
	(65,'the response isn\'t as expected','la réponse n\'est pas au format attendu','responseNotAsExpected'),
	(66,'login','connexion','login'),
	(67,'logout','deconnexion','logout'),
	(68,'You were already signed out.','Vous étiez déjà déconnecté.','alreadyLoggedOut'),
	(69,'Load','Charger','load'),
	(70,'Lock','Verrouiller','lock'),
	(71,'Edit','Éditer','edit'),
	(73,'Unlock','Déverrouiller','unlock'),
	(74,'Z-index','Z-index','zIndex'),
	(75,'Styles','Styles','styles'),
	(76,'Cancel resizing','Annuler le redimensionnement','cancelResize'),
	(77,'Move/resize mode','Mode déplacement/redimensionnement','moveResizeMode'),
	(78,'Are you sure you want to delete this ?','Êtes-vous sûr(e) de vouloir supprimer ceci ?','askForDeletion'),
	(79,'Choose','Choisir','choose'),
	(80,'Upload an image file for the background :','Téléverser une image de fond :','uploadBackgroundImage'),
	(81,'search','rechercher','search'),
	(82,'background image','image de fond','backgroundImage'),
	(83,'block styles','styles de bloc','blockStyles'),
	(84,'the string \'table\' should not contain unescaped spaces','la chaine \'table\' ne doit pas contenir d\'espace non échappé','tableStringContainingUnescapedSpaces'),
	(85,'include of dependencies impossible','inclusion de dépendances impossible','includeOfDependenciesImpossible'),
	(86,'failed to connect','connexion impossible','failedToConnect'),
	(87,'Site','Site','site'),
	(88,'Page','Page','page'),
	(89,'Library','Bibliothèque','library'),
	(90,'Updates','Mises à jour','updates'),
	(91,'The administration script couldn\'t be loaded.','Le script d\'administration n\'a pu être chargé.','administrationScriptCoudntBeloaded'),
	(92,'Authentification is needed to access to this fonctionnality','L\'authentification est nécessaire pour accéder à cette fonctionnalité.','authNeeded'),
	(93,'The last security key seems to be wrong. The access to this functionnality has been disabled this time.','La dernière clé de sécurité semble être fausse. L\'accès à cette fonctionnalité a été bloqué cette fois-ci.','wrongPassphrase'),
	(94,'new page','nouvelle page','newPage'),
	(95,'load a page','charger une page','loadPage'),
	(96,'delete current page','effacer la page courante','delPage'),
	(97,'add file(s)','ajouter fichier(s)','addFiles'),
	(98,'delete file(s)','supprimer fichier(s)','deleteFiles'),
	(99,'new folder','nouveau dossier','newFolder'),
	(100,'delete folder(s)','supprimer dossier(s)','deleteFolders'),
	(101,'parent folder','dossier parent','parentFolder'),
	(102,'trash','corbeille','trash'),
	(103,'specified path doesn\'t exist !','le chemin spécifié semble ne pas exister !','wrongPath'),
	(104,'You\'re already at the root folder for uploaded files !','Vous êtes déjà à la racine de l\'espace pour les fichiers téléversés !','alreadyAtRootOfUploads'),
	(105,'The elements selected have been moved into the target directory.','L\'ensemble des éléments sélectionnés a bien été déplacé dans le dossier cible.','filesOrFoldersMoved'),
	(106,'unknown error','erreur inconnue','unknownError'),
	(107,'A parsing error has occured&nbsp;: ','Une erreur de parsing est survenue&nbsp;: ','parsingError'),
	(108,'empty string','chaine vide','emptyString'),
	(109,'Mysql returned no results','Mysql n\'a pas retourné de résultats','mysqlEmpty'),
	(110,'Sorry, nothing was returned for this keyword.','Désolé, aucun résultat ne correspond à ce mot-clé.','noResult'),
	(111,'MySQL “Where” clause badly written','Clause MySQL ”Where” mal formulée','whereClauseBadlyWritten'),
	(112,'No home page has been defined','Aucune page d\'accueil n\'a été définie','noHomePage'),
	(113,'Click to expand','cliquer pour afficher','clickToExpand'),
	(114,'next','suivant','next'),
	(115,'previous','précédent','previous'),
	(116,'Failed to create folder','Échec lors de la création du dossier','failedToCreateFolder'),
	(117,'Folder created','Dossier créé','folderCreated'),
	(118,'This folder already exists','Ce dossier existe déjà','folderAlreadyExisting'),
	(119,'Upload','Téléverser','upload'),
	(120,'Site style','Styles du site','siteStyle'),
	(121,'file not found','fichier non trouvé','notFound'),
	(122,'save page','enregistrer la page','savePage'),
	(123,'background color','couleur de fond','backgroundColor'),
	(124,'Loading font color','Couleur de la police de chargement','loadingFontColor'),
	(125,'Default font family','Famille de police par défaut','defaultFontFamily'),
	(126,'Glyf could not open the folder :','Glyf n\'a pas pu ouvrir le dossier : ','couldNotOpenFolder'),
	(127,'Glyf could not find the folder :','Glyf n\'a pas pu trouver le dossier : ','couldNotFindFolder'),
	(128,'Text direction','Direction du texte','textDirection'),
	(129,'Expected parameters could not be found.','Les parametres attendus n\'ont pu être trouvés.','wrongParameters'),
	(130,'Left','Gauche','left'),
	(131,'Top','Haut','top'),
	(132,'Width','Largeur','width'),
	(133,'Height','Hauteur','height'),
	(134,'px if window width=2000px','px pour largeur fenêtre=2000px','pxFor2000W'),
	(135,'in units of type','en unités de type','inUnits'),
	(136,'or drag & drop','ou glissez-déposez','orDragDrop'),
	(137,'The file could not be read : ','Le fichier n\'a pas pu être lu : ','couldNotReadFile'),
	(138,'A chunk from this file could not be uploaded : ','Une partie de ce fichier n\'a pu être téléversée : ','couldNotUploadChunkOfFile'),
	(139,'The upload completed with success.','Le téléversement s\'est terminé avec succès.','uploadComplete'),
	(140,'Server response could not be decrypted.','Impossible de décrypter la réponse du serveur.','unableToDecrypt'),
	(141,'The received object isn\'t JSON formated.','L\'objet reçu n\'est pas au format JSON.','notJson'),
	(142,'This file could not be uploaded : ','Ce fichier n\'a pu être téléversé : ','couldNotUploadFile'),
	(143,'Parent','Parent','parent'),
	(144,'text & image','texte & image','text_image'),
	(145,'slideshow','diaporama','slideshow'),
	(146,'video','vidéo','video'),
	(147,'audio','audio','audio'),
	(148,'iframe','iframe','iframe'),
	(149,'html & javascript','html & javascript','html_js'),
	(150,'php include','php include','php_include'),
	(151,'code display','affichage de code','code_display'),
	(152,'math','mathématiques','math'),
	(153,'container','conteneur','container'),
	(154,'The selection contains a locked element','La sélection contient un élément verrouillé.','selectionContainingLockedElement'),
	(155,'Max value for the bottom position of a block is 2500em, corresponding to 50000 pixels in a window of 2000 pixels of width.','La valeur maximale pour une hauteur cumulée est de 2500em, soit 50000 pixels pour une fenêtre de 2000 pixels de largeur.','maxHeight'),
	(156,'Error in Openssl has been encountered !','Une erreur a été rencontrée par Openssl','opensslError'),
	(157,'Destination directory doesn\'t exist','Le répertoire de destination n\'existe pas','destDirDoesntExist'),
	(158,'Destination directory isn\'t writable','Le répertoire de destination n\'est pas accessible en écriture','destDirNotWritable'),
	(159,'The file could not be written','Le fichier n\'a pas pu être écrit','fileNotWritten'),
	(160,'Undefined file name','Nom de fichier non défini','undefinedFileName'),
	(161,'Upload could not finish correctly','Le téléversement ne s\'est pas terminé correctement','uploadNotCompleted'),
	(162,'Welcome to the admin','Bienvenue sur l\'admin','welcomeToGlyfAdmin'),
	(163,'Enter here the text of your link','Saisissez ici le texte de votre lien','enterYourLinkText'),
	(164,'Enter here the url of your link','Saisissez ici l\'url de votre lien','enterYourLinkUrl'),
	(165,'Specify some link text, please','Spécifiez un texte pour le lien, svp','specifySomeLinkText'),
	(166,'Specify an address for the link, please','Spécifiez une adresse pour le lien, svp','specifySomeLinkUrl'),
	(167,'Default text color','Couleur par défaut du texte','defaultTextColor'),
	(169,'Default link color','Couleur par défaut des liens','defaultLinkColor'),
	(170,'Default hover link color','Couleur par défaut des liens au survol','defaultLinkColorHover'),
	(171,'Menu font color','Couleur de police du menu','menuFontColor'),
	(172,'Menu hover font color','Couleur de police du menu au survol','menuFontColorHover'),
	(173,'Menu background color','Couleur de fond du menu','menuBackgroundColor'),
	(174,'Menu hover background color','Couleur de fond du menu au survol','menuBackgroundColorHover'),
	(175,'Main zone background color','Couleur de fond de la zone principale','mainZoneBackgroundColor'),
	(176,'Some used file(s) and/or folder(s) are missing','Des dossier(s) et/ou des fichier(s) utilisés sont manquants','missingUsedFilesOrFolders'),
	(177,'Some unused file(s) and/or folder(s) are missing, so their references in the database have been deleted','Des dossier(s) et/ou des fichier(s) inutilisés sont manquants, leurs références en base de données ont donc été effacées','missingUnusedFilesOrFolders'),
	(377,'The elements selected have been deleted.','L\'ensemble des éléments sélectionnés a bien été effacé.','filesOrFoldersDeleted'),
	(428,'The elements selected have not been deleted.','L\'ensemble des éléments sélectionnés n\'a pu être effacé.','filesOrFoldersNotDeleted'),
	(429,'The elements selected have not been moved into the target directory.','L\'ensemble des éléments sélectionnés n\'a pu être déplacé dans le dossier cible.','filesOrFoldersNotMoved'),
	(430,'Deselect','Désélectionner','deselect'),
	(431,'connexion lost.','connexion perdue.','connexionLost'),
	(432,'Upload files','Téléverser des fichiers','uploadFiles'),
	(433,'Folder added','Dossier ajouté','folderAdded'),
	(434,'Set the name of the folder (some characters are not allowed)','Définir le nom du dossier (certains caractères ne sont pas autorisés)','setNameOfFolder'),
	(516,'Welcome, please login','Bienvenue, svp connectez-vous','welcome'),
	(517,'Logs management','Gestion des logs','baseTitle'),
	(518,'Login is needed to access this page','La connection par mot de passe est nécessaire pour accéder à cette page','loginNeeded'),
	(519,'It is not necessary to access this page as long as you\'re logged in','Il n\'est pas nécessaire de revenir sur cette page tant que vous êtes connecté','noNeedSinceLogged'),
	(520,'Access denied','Accès refusé','refused401'),
	(521,'Not found','Page Introuvable','notfound404'),
	(522,'Welcome, you\'re already logged in','Bienvenue, vous êtes déjà connecté','welcomeAuth'),
	(523,'Unable to find the translated page','Impossible de trouver la traduction de cette page','unableToFindTranslatedPage'),
	(524,'You are now logged out. You will be redirected in 3 seconds...','Vous êtes désormais déconnecté. Redirection dans 3 secondes...','nowLoggedout'),
	(525,'email address','adresse email','emailAddress'),
	(526,'connection','connexion','connection'),
	(527,'Customers','Clients','customers'),
	(528,'Settings','Paramètres','settings'),
	(529,'Services configuration','Configuration des services','servicesConfiguration'),
	(530,'Overview','Aperçu','overview'),
	(531,'Import','Importer','import'),
	(532,'Export','Exporter','export'),
	(533,'No data has been set for monitoring yet','Aucune donnée n\'a été enregistrée pour la surveillance jusqu\'à présent','noDataYet'),
	(534,'Identifier','Identifiant','identifier'),
	(535,'Password','Mot de passe','password'),
	(536,'Server','Serveur','server'),
	(537,'Port','Port','port'),
	(538,'Active','Actif','active'),
	(539,'Apply','Appliquer','apply'),
	(540,'Set a new IMAP account','Définir un nouveau compte IMAP','setNewImapAccount'),
	(541,'IMAP accounts','Comptes IMAP','imapAccounts'),
	(542,'Check','Vérifier','check'),
	(543,'SSL','SSL','SSL'),
	(544,'Client request could not be decrypted','La requête du client n\'a pas pu être décryptée.','unableToDecryptClientRequest'),
	(545,' But unfortunately, the cryptographic key could not be generated. Please check your PHP version.',' Mais malheureusement, la clé de cryptographie n\'a pas pu être générée. SVP vérifiez votre version de PHP.','butCryptoKeyCouldNotBeGenerated'),
	(546,' But unfortunately, the cryptographic key seems to be empty. We cannot continue. Please solve this problem.',' Mais malheureusement, la clé de cryptographie reçu semble vide. Nous ne pouvons continuer. Veuillez résoudre ce problème.','butCryptoKeyIsEmpty'),
	(547,' But unfortunately, the cryptographic key is not as long as expected. We cannot continue. Please solve this problem.',' Mais malheureusement, la clé de cryptographie reçue b\'a pas la longueur attendue. Nous ne pouvons continuer. Veuillez résoudre ce problème.','butCryptoKeyIsNotAsLongAsExpected'),
	(548,'the new entry will be ignored','la nouvelle entrée va être ignorée','ignoringNewEntry'),
	(549,'the response is not an object','la réponse n\'est pas un objet','notObject'),
	(550,'IMAP error : ','Erreur IMAP : ','imapError'),
	(551,'Unable to reach host ','impossible de trouver l\'hôte  ','noSuchHost'),
	(552,'SSL/TLS failure for host ','erreur SSL/TLS pour l\'hôte ','ssltlsFailure'),
	(553,'SSL negotiation failed for host ','échec de la négociation SSL pour l\'hôte ','sslNegotiationFailed'),
	(554,'Authentication failed for ','échec de l\'authentification pour ','authFailed'),
	(555,'Connection failed for ','échec de la connexion pour ','connectionFailed'),
	(556,'unknown IMAP error for ','erreur IMAP inconnue pour ','unknownImapError'),
	(557,'. Detail : ','. Détail : ','detail'),
	(558,' IMAP check(s) with success',' vérification(s) IMAP effectuée(s) avec succès','imapChecksSucceeded'),
	(559,'Insert succeeded','L\'insertion a réussi','mysqlInsertSucceeded'),
	(560,'update(s) succeeded',' mise(s) à jour effectuée(s) avec succès','mysqlUpdatesSucceeded'),
	(561,'Delete succeeded','Effacement effectué avec succès','mysqlDeleteSucceeded'),
	(562,'Are you sure you want to delete this IMAP connection ?','Êtes-vous certain(e) de vouloir supprimer cette connexion IMAP ?','areYouSureYouWantToDeleteThisImapConnection'),
	(563,'empty response or unknown error','réponse vide ou erreur inconnue','emptyResponseOrUnknowError'),
	(564,'You have been landed here for security reasons.<br />Ajax browsing will now handle communication with cryptography.','Vous avez été redirigé(e) ici pour des raisons de sécurité<br />La navigation Ajax va désormais gérer la communication avec cryptographie.','landingAuth'),
	(565,'The cryptographic key has been regenerated, please retry','La clé de cryptographie a été régénérée, veuillez réessayer svp','keyRegenerated'),
	(566,'certificate failure for host ','erreur de certificat pour l\'hôte ','certificateFailure'),
	(567,'the cryptographic keyis not as long as expected. We cannot continue. Please solve this problem.','La clé de cryptographie n\'a pas la longueur attendue. Nous ne pouvons continuer. Veuillez résoudre ce problème.','cryptoKeyTooShort'),
	(568,'Change logo (image upload)','Changer le logo (téléversement d\'image)','changeLogo'),
	(569,'No file','Pas de fichier','noFile'),
	(570,'Empty file','Fichier vide','emptyFile'),
	(571,'The file is too big','Fichier trop volumineux','fileTooBig'),
	(572,' ... The page will be reloaded',' ... La page va être rechargée','refresh'),
	(573,'Customers that are already set','Clients déjà définis','alreadySetCustomers'),
	(574,'Set a new customer','Définir un nouveau client','setNewCustomer'),
	(575,'Name','Nom','name'),
	(576,'Are you sure you want to delete this customer ?','Êtes-vous certain(e) de vouloir supprimer ce client ?','areYouSureYouWantToDeleteThisCustomer'),
	(577,'Monitoring','Surveillance','monitoring'),
	(578,'No item has been defined yet','Aucun élément n\'a été défini jusqu\'à présent','noItemDefinedYet'),
	(579,'Add an item','Ajouter un élément','addItem'),
	(580,'Add email monitoring','Ajouter un monitoring email','addEmailMonitoring'),
	(581,'Customer name :','Nom du client :','customerName'),
	(582,'Service name :','Nom du service :','serviceName'),
	(583,'IMAP account :','Compte IMAP :','imapAccount'),
	(584,'on','sur','on'),
	(585,'Mail list','Liste des mails','mailList'),
	(586,'Folder list','Liste des dossiers','folderList'),
	(587,'Waiting for IMAP account choice','En attente du choix de compte IMAP','waitingForImapAccountChoice'),
	(588,'Waiting for folder choice','En attente du choix de dossier','waitingForFolderChoice'),
	(589,'Please wait until cryptography is initiated','SVP attendez durant l\'initialisation de la cryptographie','waitUntilAdminInitiated'),
	(590,'Connection lost... Reload needed','Connexion perdue... Rechargement nécessaire','connexionLostReloadNeeded'),
	(591,'You will be redirected shortly...','Vous allez être redirigé dans peu de temps...','redirectedShortly'),
	(592,'No message in this IMAP folder','Pas de message dans ce dossier IMAP','noMessage'),
	(593,'Rules set','Jeu de règles','searchRulesSet'),
	(595,'Periodicity of check in hours','Périodicité de la vérification en heures','periodicity'),
	(596,'If one of the two next values is not set, service state will be based on the matches to the other value','Si l\'une des deux valeurs suivantes n\'est pas renseignée, c\'est la correspondance à l\'autre valeur recherchée qui définira l\'état du service','searchValuesInfo'),
	(597,'customer is not selected','client non sélectionné','customerNotSelected'),
	(598,'IMAP account not selected','compte IMAP non sélectionné','imapAccountNotSelected'),
	(599,'IMAP folder not selected','dossier IMAP non sélectionné','folderNotSelected'),
	(600,'service name not set','nom du service non renseigné','serviceNameNotSet'),
	(601,'at least one of the test strings or regular expressions should be set','au moins l\'une des chaines ou expressions régulières de test doit être renseignée','atLeastOneOfTheTestStringsOrRegexShouldBeSet'),
	(602,'the periodicity should be set in number of hours and superior to 0','la périodicité doit être renseignée en nombre d\'heures et supérieure à 0','periodicityShouldBeSetAndSuperiorTo0'),
	(603,'monitoring not found','monitoring introuvable','monitoringNotFound'),
	(604,'update succeeded','Mise à jour des données effectuée avec succès','mysqlUpdateSucceeded'),
	(605,'Waiting for IMAP account loading','En attente du chargement du compte IMAP','waitingForImapAccountLoading'),
	(606,'Waiting for IMAP folder loading','En attente du chargement du dossier IMAP','waitingForImapFolderLoading'),
	(607,'SMTP account (for daily reports sending)','compte SMTP (pour l\'envoi des rapports journaliers)','smtpAccount'),
	(608,'SMTP check succeeded','Vérification SMTP effectuée avec succès','smtpCheckSucceeded'),
	(609,'SMTP error : ','Erreur SMTP : ','smtpError'),
	(610,'Daily report for the monitored services','Rapport quotidien pour les services surveillés','dailyReport'),
	(611,'error(s) detected','erreur(s) détectée(s)','errorDetected'),
	(612,'no error detected','pas d\'erreur détectée','noErrorDetected'),
	(613,'status','statut','status'),
	(614,'service','service','service'),
	(615,'matches','résultats','matches'),
	(616,'Language','Langage','reportLanguage'),
	(617,'Destination email adresses (comma-separated)','Adresses email de destination (séparées par des virgules)','destEmailAdresses'),
	(618,'unable to find a token in database','impossible de trouver un token dans la base de données','couldNotGetTokenFromDatabase'),
	(619,'The task was executed correctly','La tâche a été exécutée correctement','taskExecutedCorrectly'),
	(620,'The task was not executed correctly','La tâche n\'a pas été exécutée correctement','taskNotExecutedCorrectly'),
	(621,'Bad token','Mauvais ticket','badToken'),
	(622,'Date of last success','Date du dernier succès','lastSuccessDate'),
	(623,'Date of last check','Date de la dernière vérification','lastCheckDate'),
	(624,'Never','Jamais','never'),
	(625,'In order to properly execute the software at regular intervals, you must set a crontab under unix/linux systems, or a launchDaemon using curl command under macOS X, or any process of scheduled task depending on the system you are using :','Pour que le logiciel s\'éxécute à intervalles réguliers, vous devez régler une crontab sous unix/linux, ou un launchDaemon utilisant la commande curl sous macOS X, ou tout procédé de tache ordonnancée selon le système que vous utilisez :','cronSettings'),
	(626,'for crontabs :','pour les tâches cron :','forCrontabs'),
	(627,'the_path_of_this_webservice/','le_chemin_du_service_web/','pathOfThisWebService'),
	(628,'for curl callings :','pour les appels curl :','forCurlCallings'),
	(629,'http://local_url_of_web_service/','http://l_url_locale_du_service_web/','localUrlOfWebService'),
	(630,'Token update succeeded','Succès lors de la mise à jour du token','tokenUpdateSucceeded'),
	(631,'Token update failed','Échec lors de la mise à jour du token','tokenUpdateFailed'),
	(632,'Timeout for fail state in hours','Temps de mise en échec en heures','failTimeout'),
	(633,'no mail received before timeout','pas de mail reçu avant expiration','noMailReceivedBeforeTimeout'),
	(634,'Regenerate token (preferable if first install)','Régénerer le token (préférable en première installation)','regenerateToken'),
	(635,'Unable to get the messages','Impossible d\'obtenir les messages','unableToGetMessages'),
	(636,'Rules','Règles','rules'),
	(637,'No rule has been set up yet.','Aucune règle n\'a été définie jusqu\'à présent.','noRuleHasBeenSetUpYet'),
	(638,'Monitoring rules','Règles de surveillance','monitoringRules'),
	(639,'Customers and services','Clients et services','customersAndServices'),
	(640,'Inactive','Inactif','inactive'),
	(641,'Specify a name','Renseignez un nom','specifyName'),
	(642,'Edit email monitoring','Éditer un monitoring email','editEmailMonitoring'),
	(643,'No imap account is defined for this admin yet','Aucun compte imap n\'est défini pour cet admin','noImapAccountDefinedYet'),
	(644,'No search rules set is defined for this admin yet','Aucun jeu de règles de tri n\'est défini pour cet admin','noSearchRulesSetDefinedYet'),
	(645,'10 last mails list','Liste 10 derniers messages','listOf10lastMails'),
	(646,'Identification rules','Règles d\'identification','identificationRules'),
	(647,'Actions','Actions','actions'),
	(648,'Cleaning rules','Règles de nettoyage','cleaningRules'),
	(649,'If','Si','if'),
	(650,'one of','l\'une des','oneOf'),
	(651,'all of','toutes les','allOf'),
	(652,'next condition(s) is(are) matched','condition(s) suivante(s) est(sont) remplie(s)','nextConditionsIsAreMatched'),
	(653,'Throw following action(s)','Lancer l\'(les) action(s) suivante(s)','throwFollowingActions'),
	(654,'contains','contient','contains'),
	(655,'equals','est égal à','equals'),
	(656,'starts with','commence par','startsWith'),
	(657,'ends with','finit par','endsWith'),
	(658,'matches regex','correspond à l\'expression régulière','matchesRegex'),
	(659,'does not contain','ne contient pas','doesNotContain'),
	(660,'does not match regex','ne correspond pas à l\'expression régulière','doesNotMatchRegex'),
	(661,'does not equal','n\'est pas égal à','doesNotEqual'),
	(662,'from','de','from'),
	(663,'to','à','to'),
	(664,'object','objet','object'),
	(665,'message body','corps du message','messageBody'),
	(666,'move to IMAP folder','déplacer vers le dossier IMAP','moveToImapFolder'),
	(667,'delete message','effacer le message','deleteMessage'),
	(668,'set flag','appliquer le drapeau','setFlag'),
	(669,'mark as read','marquer comme lu','markAsRead'),
	(670,'add rule','ajouter une règle','addRule'),
	(671,'Perform the following action(s)','Effectuer l\'(les) action(s) suivante(s)','performTheFollowingActions'),
	(672,'Optional argument','Argument optionnel','optionalArgument'),
	(673,'Then mark status as&nbsp;','puis définir le statut sur&nbsp;','thenMarkStatusAs'),
	(674,'input a number here','entrez un nombre ici','inputNumberHere'),
	(675,'Passed','Passés','passed'),
	(676,'days','jours','days'),
	(677,'add action','ajouter une action','addAction'),
	(678,'see more','voir plus','seeMore'),
	(679,'no additional message','pas de message supplémentaire','noAdditionalMessage'),
	(680,'see full message','voir le message complet','seeFullMessage'),
	(681,'Unable to get message','Impossible d\'obtenir le message','unableToGetMessage'),
	(682,'Email','Courriel','email'),
	(683,'First name','Prénom','firstName'),
	(684,'Last name','Nom','lastName'),
	(685,'User accounts','Comptes utilisateurs','userAccounts'),
	(686,'Set a new user account','Définir un nouveau compte utilisateur','setNewUserAccount'),
	(687,'Role','Rôle','role'),
	(688,'Admin','Admin','admin'),
	(689,'Guest','Invité','guest'),
	(690,'You are not allowed to add an user with this kind of permissions','Vous n\'êtes pas autorisé(e) à ajouter un utilisateur doté de ce niveau d\'autorisations','notAllowedToAddUserOfThisLevel'),
	(691,'You are not allowed to modify this user','Vous n\'êtes pas autorisé(e) à modifier cet utilisateur','notAllowedToModifyThisUser'),
	(692,'Language','Langage','userLanguage'),
	(693,'Are you sure you want to delete this user ?','Êtes-vous certain(e) de vouloir effacer cet utilisateur ?','areYouSureYouWantToDeleteThisUser'),
	(694,'an identification rule value is not set','une valeur de règle d\'identification n\'est pas définie','identificationRulesValueNotSet'),
	(695,'a monitoring rule value is not set','une valeur de règle de monitoring n\'est pas définie','monitoringRulesValueNotSet'),
	(696,'a cleaning rule value is not set','une valeur de règle de nettoyage n\'est pas définie','cleaningRulesValueNotSet'),
	(697,'an optional argument of action after identification is not set','un argument optionnel d\'action après identification n\'est pas défini','identificationRulesActionsOptionalArgumentNotSet'),
	(698,'an optional argument of action after monitoring is not set','un argument optionnel d\'action après monitoring n\'est pas défini','monitoringRulesActionsOptionalArgumentNotSet'),
	(699,'an optional argument of cleaning action is not set','un argument optionnel d\'action de nettoyage n\'est pas défini','cleaningRulesActionsOptionalArgumentNotSet'),
	(700,'clear flag','supprimer le drapeau','clearFlag'),
	(701,'Password will not be changed','Le mot de passe ne sera pas changé','passwordWillNotBeChanged'),
	(702,'hours','heures','hours'),
	(703,'Locales variables are missing','Les variables de localisation sont manquantes','localesMissing'),
	(704,'missing parameter','paramètre manquant','missingParameter'),
	(705,'Please login as SuperAdmin','S.V.P. identifiez-vous comme SuperAdmin','pleaseLoginAsSuperAdmin'),
	(706,'Launch monitoring task manually','Lancer la tâche de surveillance manuellement','LaunchMonitoringTaskManually'),
	(707,'Launch cleaning task manually','Lancer la tâche de nettoyage manuellement ','LaunchCleaningTaskManually'),
	(708,'(these actions can take some time)','(ces actions peuvent prendre un certain temps)','theseActionsCanTakeSomeTime'),
	(709,'emails treated','emails traités','mailsTreated'),
	(710,'customer is not saved','client non sauvegardé','customerNotSaved'),
	(711,'unauthorized extension','extension non autorisée','unauthorizedExtension'),
	(712,'if these rules are matched','si ces règles sont remplies','ifTheseRulesAreMatched'),
	(713,'success','succès','success'),
	(714,'fail','échec','fail'),
	(715,'Let status green if not identified : ','Laisser le statut vert si non identifié : ','letStatusGreenIfNotIdentified'),
	(716,'yes','oui','yes'),
	(717,'no','non','no'),
	(718,'Are you sure you want to delete this service ?','Êtes-vous certain(e) de vouloir effacer ce service ?','areYouSureYouWantToDeleteThisService');

/*!40000 ALTER TABLE `locales` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table pages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pages`;

CREATE TABLE `pages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` tinytext COLLATE utf8mb4_general_ci,
  `title` tinytext COLLATE utf8mb4_general_ci,
  `icon_path` tinytext COLLATE utf8mb4_general_ci,
  `file` tinytext COLLATE utf8mb4_general_ci,
  `active` tinyint(1) DEFAULT NULL,
  `show_in_menu` tinyint(1) DEFAULT NULL,
  `auth_context` tinyint(1) DEFAULT NULL,
  `user_level` tinyint(1) DEFAULT NULL,
  `is_a_category` tinyint(1) DEFAULT NULL,
  `is_graphical` tinyint DEFAULT NULL,
  `ordering` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `locale` varchar(2) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;

INSERT INTO `pages` (`id`, `slug`, `title`, `icon_path`, `file`, `active`, `show_in_menu`, `auth_context`, `user_level`, `is_a_category`, `is_graphical`, `ordering`, `parent_id`, `locale`)
VALUES
	(1,'deconnexion','Se déconnecter','media/logout.png','logout',1,0,1,0,0,0,2,NULL,'fr'),
	(2,'logout','Logout','media/logout.png','logout',1,0,1,0,0,0,2,NULL,'en'),
	(3,'accueil','Accueil','media/monitoring.png','home',1,1,1,0,0,0,1,NULL,'fr'),
	(4,'home','Home','media/monitoring.png','home',1,1,1,0,0,0,1,NULL,'en'),
	(5,'index','Index',NULL,'index',1,1,0,-1,0,0,0,NULL,'fr'),
	(6,'index','Index',NULL,'index',1,1,0,-1,0,0,0,NULL,'en'),
	(7,'401','401 accès refusé',NULL,'401',1,0,0,-1,0,0,0,NULL,'fr'),
	(8,'401','401 access denied',NULL,'401',1,0,0,-1,0,0,0,NULL,'en'),
	(9,'404','404 page introuvable',NULL,'404',1,0,0,-1,0,0,0,NULL,'fr'),
	(10,'404','404 not found',NULL,'404',1,0,0,-1,0,0,0,NULL,'en'),
	(11,'parametres','Paramètres','media/settings.png','settings',1,1,1,1,0,0,3,NULL,'fr'),
	(12,'settings','Settings','media/settings.png','settings',1,1,1,1,0,0,3,NULL,'en'),
	(13,'services','Services','media/customers.png','service',1,1,1,1,0,0,2,NULL,'fr'),
	(14,'services','Services','media/customers.png','service',1,1,1,1,0,0,2,NULL,'en');

/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table token
# ------------------------------------------------------------

DROP TABLE IF EXISTS `token`;

CREATE TABLE `token` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `token` tinytext COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;

INSERT INTO `token` (`id`, `token`)
VALUES
	(1,UUID());

/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;


# Dump de la table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` int DEFAULT NULL,
  `lastname` tinytext COLLATE utf8mb4_general_ci,
  `firstname` tinytext COLLATE utf8mb4_general_ci,
  `pass` text COLLATE utf8mb4_general_ci,
  `email` tinytext COLLATE utf8mb4_general_ci,
  `prefered_locale` varchar(2) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinytext COLLATE utf8mb4_general_ci,
  `level` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
SET @v1=SUBSTRING(SHA2(RAND(), 512), 1, 16);
INSERT INTO `users` (`id`, `admin_user_id`, `lastname`, `firstname`, `pass`, `email`, `prefered_locale`, `status`, `level`)
VALUES
	(1,1,'Somebody','Example',CONCAT('$6$', @v1, '$', SHA2(CONCAT(@v1, 'modify_me_if_you_dont_want_to_be_hacked'), 512)),'somebody@example.com','en','superadmin',2);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
