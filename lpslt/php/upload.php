<?php
	// modified version of qqFileUploader php file
	class fileUploaderCore {
		/**
		 * Save the file to the specified path
		 * returns boolean true on success
		 */
		function uploadCompleted($time, $isBase64Encoded) {
			$input=fopen("php://input", "r");
			if ($temp=fopen("../temp/".$time.".tmp" , "w+")) {
				$realSize=$this->pipe_streams($input, $temp, $isBase64Encoded);
				fclose($temp);
			}
			fclose($input);
			if ($realSize!=$this->getSize() && !$isBase64Encoded) {			
				return false;
			} else {
				return true;
			}
		}
		function pipe_streams($in, $out, $isBase64Encoded) {
			$size = 0;
			while (!feof($in)) {
				$c=fread($in,8192);
				$size+=strlen($c);
				fwrite($out,($isBase64Encoded?base64_decode($c):$c));
			}
			return $size;
		}
		function save($path, $time) {
			$temp=fopen("../temp/".$time.".tmp" , "r");
			$get=$this->decryptGet();
			if (((int)$get['chunkIndex']===0 || (int)$get['chunkIndex']===-1) && file_exists($path)) {
				unlink($path);
			}
			$target=fopen($path, "a+");
			fseek($temp, 0, SEEK_SET);
			stream_copy_to_stream($temp, $target);
			fclose($target);
			fclose($temp);
			if (file_exists("../temp/".$time.".tmp")) {
				unlink("../temp/".$time.".tmp");
			}
			return true;
		}
		function decryptGet() {
			if (file_exists(__DIR__.'/decrypt.php') && file_exists(__DIR__.'/session.php')) {
				include_once(__DIR__.'/session.php');
				include_once(__DIR__.'/decrypt.php');
				$params=decryptAESandParseJSON($_GET['data'], $_SESSION['passphrase']);
			} else {
				die(json_encode(array('message'=>'includeOfDependenciesImpossible')));
			}
			return $params;
		}
		function getSize() {
			if (isset($_SERVER["CONTENT_LENGTH"])){
				return (int)$_SERVER["CONTENT_LENGTH"];			
			} else {
				throw new Exception('Getting content length is not supported.');
			}	  
		}   
	}
	class fileUploader {
		private $disAllowedExtensions = array();
		private $file;
		private $typeTarget;
		private static $sizeLimit;
		function __construct(){				
			self::$sizeLimit=$this->getPostSize();
			$params=$this->decryptGet();  
			if (isset($params['name'])) {
				$this->file=new fileUploaderCore();
			} else {
				$this->file=false; 
			}
		}
		private function decryptGet() {
			if (file_exists(__DIR__.'/decrypt.php') && file_exists(__DIR__.'/session.php')) {
				include_once(__DIR__.'/session.php');
				include_once(__DIR__.'/decrypt.php');
				$params=decryptAESandParseJSON($_GET['data'], $_SESSION['passphrase']);
			} else {
				die(json_encode(array('message'=>'includeOfDependenciesImpossible')));
			}
			return $params;
		}	
		private function getPostSize(){		
			$postSize = $this->toBytes(ini_get('post_max_size'));	   
			return $postSize;
		}	
		private function toBytes($str){
			$val=(float)trim($str);
			$last=strtolower($str[strlen($str)-1]);
			switch($last) {
				case 'g': $val *= 1024;
				case 'm': $val *= 1024;
				case 'k': $val *= 1024;		
			}
			return $val;
		}
		function handleUpload($isBase64Encoded){
			set_time_limit(240);
			if (!$this->file){
				return 'noFile';
			}
			$size=$this->file->getSize();
			if ($size==0) {
				return 'emptyFile';
			}
			if ($size>self::$sizeLimit) {
				return 'fileTooBig';
			}
			$time=time();
			if ($this->file->uploadCompleted($time, $isBase64Encoded)) {
				include_once("../php/utils.php");
				$params=$this->file->decryptGet();
				$pathinfo=pathinfo($params['name']);
				$ext=strtolower($pathinfo['extension']);
				if ($ext!=="php") {
					$filename=urlize(strtolower($pathinfo['filename']));
					$uploadDirectory='../'.$params['dir'];
					if (!is_dir($uploadDirectory)) {
						return 'destDirDoesntExist';
					} else if (!is_writable($uploadDirectory) && substr(sprintf('%o', fileperms($uploadDirectory)), -3)!=="664" && !@chmod($uploadDirectory, 0664)) {
						return 'destDirNotWritable';
					}
					if (!empty($filename)) {
						if ($this->file->save($uploadDirectory.$filename.'.'.$ext, $time)) {
							@chmod($uploadDirectory.$filename.'.'.$ext, 0774);
							return 'path:'.$uploadDirectory.$filename.'.'.$ext;
						} else {
							return 'fileNotWritten';
						}
					} else {
						return 'undefinedFileName';
					}
				} else {
					return 'unauthorizedExtension';
				}
			} else {
				return 'uploadNotCompleted';
			}
		}	
	}
	if (file_exists(__DIR__.'/decrypt.php') && file_exists(__DIR__.'/session.php')) {
		include_once(__DIR__.'/session.php');
		include_once(__DIR__.'/decrypt.php');
		$params=decryptAESandParseJSON($_GET['data'], $_SESSION['passphrase']);
	} else {
		die(json_encode(array('message'=>'includeOfDependenciesImpossible')));
	}
	if (isset($_SESSION['auth'], $_SESSION['passphrase'], $_SESSION['token']) && array_key_exists('token', $params) && $params['token']===$_SESSION['token']) {
		$uploader = new fileUploader();
		$result = $uploader->handleUpload((int)$params['chunkIndex']>-1);
		echo json_encode(array("message"=>$result));
	}
?>