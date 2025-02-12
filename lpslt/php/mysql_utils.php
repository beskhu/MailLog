<?php
class mysqlUtils {
	public static $statusReturn=array(false, "not intiated");
	public static $mysqlLink=false;
	public static $mysqlBase=false;
	function __construct($base="") {
		self::connection($base);
	}
	private static function connection($base, $charset="UTF8") {
		if (file_exists(__DIR__.'/utils.php') && file_exists(__DIR__.'/mysql_credentials.php')) {
			include_once(__DIR__.'/utils.php');
			include_once(__DIR__.'/mysql_credentials.php');
			$mysqlCredentials=new mysqlCredentials();
			self::$mysqlBase=(!empty($base)?$base:$mysqlCredentials::$base);
			try {
				$dsn = 'mysql:dbname='.self::$mysqlBase.';host='.$mysqlCredentials::$host;
				$dbh = new PDO($dsn.';charset='.$charset, $mysqlCredentials::$user, $mysqlCredentials::$pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES=>false]);
				self::$mysqlLink=$dbh;
				self::$statusReturn=array(true, self::$mysqlLink);
			} catch (PDOException $e) {
				self::$statusReturn=array(false, "failedToConnect", $e->getMessage());
			}
		} else {
			self::$statusReturn=array(false, "includeOfDependenciesImpossible");
		}
	}
	public static function beginTransaction() {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			self::$mysqlLink->beginTransaction();
			return array("message"=>"ok"); 
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function commit() {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0] && self::$mysqlLink->inTransaction()) {
			self::$mysqlLink->commit();
			return array("message"=>"ok"); 
		} else if (self::$statusReturn[0] && !self::$mysqlLink->inTransaction()) {
			return array("message"=>"ko","error"=>"notInTransaction"); 
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function rollback() {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0] && self::$mysqlLink->inTransaction()) {
			self::$mysqlLink->rollback();
			return array("message"=>"ok"); 
		} else if (self::$statusReturn[0] && !self::$mysqlLink->inTransaction()) {
			return array("message"=>"ko","error"=>"notInTransaction"); 
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function query($query) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			$statement=self::$mysqlLink->prepare($query);
			$res=array();
			try {
				$statement->execute();
				while ($r=$statement->fetch(PDO::FETCH_ASSOC)) {
					foreach ($r as $k=>$v) {
						if (!array_key_exists($k, $res)) {
							$res[$k]=[];
						}
						$res[$k][]=$v;
					}
				}
				return array("result"=>$res);
			} catch (PDOException $e) {
				return array("message"=>"ko","error"=>$e->getMessage());
			}
			$statement->closeCursor();
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectCount($table, $field) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$sql="select count(".$field.") from ".$table;
				$statement=self::$mysqlLink->prepare($sql);
				$res=array();
				try {
					$statement->execute();
					$res=$statement->fetchColumn();
					if (preg_match('/[0-9]+/', $res)) {
						return array("message"=>"ok","count"=>$res);
					} else if (empty($res)) {
						return array("message"=>"ko","error"=>"tableDoesNotExist");
					} else {
						return array("message"=>"ko","error"=>"unknownError");
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
				$statement->closeCursor();
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectCountPlusString($table, $field, $string) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$sql="select count(".$field.") from ".$table." ".$string;
				$statement=self::$mysqlLink->prepare($sql);
				$res=array();
				try {
					$statement->execute();
					$res=$statement->fetchColumn();
					if (preg_match('/[0-9]+/', $res)) {
						return array("message"=>"ok","count"=>$res);
					} else if (empty($res)) {
						return array("message"=>"ko","error"=>"tableDoesNotExist");
					} else {
						return array("message"=>"ko","error"=>"unknownError");
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
				$statement->closeCursor();
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectAll($table, $treatmentFunction, $sortParameters=array("boolean"=>false, "key"=>null, "sort_flags"=>null, "boolean_remap_numerical"=>false)) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$sql="select * from ".$table;
				$statement=self::$mysqlLink->prepare($sql);
				$res=array();
				try {
					$statement->execute();
					while ($r=$statement->fetch(PDO::FETCH_ASSOC)) {
						if (is_array($r)) {
							foreach($r as $k => $v) {
								if (!array_key_exists($k, $res)) {
									$res[$k]=array();
								}
								$res[$k][]=(($treatmentFunction!=null)?$treatmentFunction($v):$v);
							}
						}
					}
					unset($r);
					if ($sortParameters["boolean"]==false) {
						return $res;
					} else {
						if (is_array($sortParameters["key"])) {
							$sortParameters["key"]=array_reverse($sortParameters["key"]);
							foreach($sortParameters["key"] as $k=>$v) {
								$res=sortOn($res, $sortParameters["key"][$k], $sortParameters["sort_flags"], $sortParameters["boolean_remap_numerical"]);
							}
						}
						return $res;
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
				$statement->closeCursor();
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectOnFields($tableAndFields, $treatmentFunction, $sortParameters=array("boolean"=>false, "key"=>null, "sort_flags"=>null, "boolean_remap_numerical"=>false)) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $tableAndFields[0])) {
				$sql="select ";
				for ($i=0; $i<count($tableAndFields[1]); $i++) {
					$sql.=$tableAndFields[1][$i];
					if ($i<count($tableAndFields[1])-1) {
						$sql.=', ';
					}
				}
				$sql.=" from ".$tableAndFields[0];
				$statement=self::$mysqlLink->prepare($sql);
				$res=array();
				try {
					$statement->execute();
					while ($r=$statement->fetch(PDO::FETCH_ASSOC)) {
						if (is_array($r)) {
							foreach($r as $k => $v) {
								if (!array_key_exists($k, $res)) {
									$res[$k]=array();
								}
								$res[$k][]=(($treatmentFunction!=null)?$treatmentFunction($v):$v);
							}
						}
					}
					unset($r);
					if ($sortParameters["boolean"]==false) {
						return $res;
					} else {
						if (is_array($sortParameters["key"])) {
							$sortParameters["key"]=array_reverse($sortParameters["key"]);
							foreach($sortParameters["key"] as $k=>$v) {
								$res=sortOn($res, $sortParameters["key"][$k], $sortParameters["sort_flags"], $sortParameters["boolean_remap_numerical"]);
							}
						}
						return $res;
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
				$statement->closeCursor();
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectAllForId($table, $id, $treatmentFunction, $sortParameters=array("boolean"=>false, "key"=>null, "sort_flags"=>null, "boolean_remap_numerical"=>false)) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$statement=self::$mysqlLink->prepare("select * from ".$table." where id=:id");
				$statement->bindParam(':id', $id, PDO::PARAM_INT);
				$req=$statement->execute();
				if (!$req) {
					return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
				} else {
					try {
						$r=$statement->fetch(PDO::FETCH_ASSOC);
						$res=array();
						if (is_array($r)) {
							foreach($r as $k => $v) {
								if (!array_key_exists($k, $res)) {
									$res[$k]=array();
								}
								$res[$k][]=(($treatmentFunction!=null)?$treatmentFunction($v):$v);
							}
						}
						unset($r);
						$statement->closeCursor();
						if ($sortParameters["boolean"]==false) {
							return $res;
						} else {
							if (is_array($sortParameters["key"])) {
								$sortParameters["key"]=array_reverse($sortParameters["key"]);
								foreach($sortParameters["key"] as $k=>$v) {
									$res=sortOn($res, $sortParameters["key"][$k], $sortParameters["sort_flags"], $sortParameters["boolean_remap_numerical"]);
								}
							}
							return $res;
						}
					} catch (PDOException $e) {
						return array("message"=>"ko","error"=>$e->getMessage());
					}
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectAllWhere($table, $whereArray, $treatmentFunction, $sortParameters=array("boolean"=>false, "key"=>null, "sort_flags"=>null, "boolean_remap_numerical"=>false)) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$intTypes=array("tinyint","smallint","mediumint","int","bigint");
				$sql="select * from ".$table." where ";
				$typeWhere=array();
				foreach ($whereArray as $k => $v) {
					$statement=self::$mysqlLink->prepare("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='".self::$mysqlBase."' and TABLE_NAME=:table and column_name=:column");
					$statement->bindParam(':table', $table, PDO::PARAM_STR);
					$statement->bindParam(':column', $whereArray[$k]["name"], PDO::PARAM_STR);
					try {
						$statement->execute();
						$r=$statement->fetch(PDO::FETCH_ASSOC);
						$typeWhere[$k]=$r['DATA_TYPE'];
						$statement->closeCursor();
					} catch (PDOException $e) {
						return array("message"=>"ko","error"=>$e->getMessage());
					}
					if (strlen($typeWhere[$k])>0 && in_array(strtolower($typeWhere[$k]),$intTypes)) {
						$typeWhere[$k]=PDO::PARAM_INT;
					} else {
						$typeWhere[$k]=PDO::PARAM_STR;
					}
					if ($whereArray[$k]["operator"]==="is" || $whereArray[$k]["operator"]==="is not") {
						$sql.="`".$whereArray[$k]["name"]."` ".$whereArray[$k]["operator"]." ".($whereArray[$k]["value"]===null?"null":(string)$whereArray[$k]["value"]);
					} else {
						$sql.="`".$whereArray[$k]["name"]."` ".$whereArray[$k]["operator"]." :".$whereArray[$k]["name"].$k;
					}
					if ($k<count($whereArray)-1) {
						$sql.=" ".$whereArray[$k]["and|or"]." ";
					}
				}
				$statement=self::$mysqlLink->prepare($sql);
				foreach ($whereArray as $k => $v) {
					if (!($whereArray[$k]["operator"]==="is" || $whereArray[$k]["operator"]==="is not")) {
						$whereArray[$k]["value"]=($typeWhere[$k]===PDO::PARAM_INT?(int)$whereArray[$k]["value"]:(string)$whereArray[$k]["value"]);
						$statement->bindParam(":".$whereArray[$k]["name"].$k, $whereArray[$k]["value"], $typeWhere[$k]);
					}
				}
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$res=array();
						while ($r=$statement->fetch(PDO::FETCH_ASSOC)) {
							if (is_array($r)) {
								foreach($r as $k => $v) {
									if (!array_key_exists($k, $res)) {
										$res[$k]=array();
									}
									$res[$k][]=(($treatmentFunction!=null)?$treatmentFunction($v):$v);
								}
							}
							unset($r);
						}
						$statement->closeCursor();
						if ($sortParameters["boolean"]==false) {
							return $res;
						} else {
							if (is_array($sortParameters["key"])) {
								$sortParameters["key"]=array_reverse($sortParameters["key"]);
								foreach($sortParameters["key"] as $k=>$v) {
									$res=sortOn($res, $sortParameters["key"][$k], $sortParameters["sort_flags"], $sortParameters["boolean_remap_numerical"]);
								}
							}
							return $res;
						}
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectOnFieldsWhere($tableAndFields, $whereArray, $treatmentFunction, $sortParameters=array("boolean"=>false, "key"=>null, "sort_flags"=>null, "boolean_remap_numerical"=>false)) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $tableAndFields[0])) {
				$intTypes=array("tinyint","smallint","mediumint","int","bigint");
				$sql="select ";
				for ($i=0; $i<count($tableAndFields[1]); $i++) {
					$sql.=$tableAndFields[1][$i];
					if ($i<count($tableAndFields[1])-1) {
						$sql.=', ';
					}
				}
				$sql.=" from ".$tableAndFields[0]." where ";
				$typeWhere=array();
				foreach ($whereArray as $k => $v) {
					$statement=self::$mysqlLink->prepare("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='".self::$mysqlBase."' and TABLE_NAME=:table and column_name=:column");
					$statement->bindParam(':table', $tableAndFields[0], PDO::PARAM_STR);
					$statement->bindParam(':column', $whereArray[$k]["name"], PDO::PARAM_STR);
					try {
						$statement->execute();
						$r=$statement->fetch(PDO::FETCH_ASSOC);
						$typeWhere[$k]=$r['DATA_TYPE'];
						$statement->closeCursor();
					} catch (PDOException $e) {
						return array("message"=>"ko","error"=>$e->getMessage());
					}
					if (strlen($typeWhere[$k])>0 && in_array(strtolower($typeWhere[$k]),$intTypes)) {
						$typeWhere[$k]=PDO::PARAM_INT;
					} else {
						$typeWhere[$k]=PDO::PARAM_STR;
					}
					$sql.="`".$whereArray[$k]["name"]."` ".$whereArray[$k]["operator"]." :".$whereArray[$k]["name"].$k;
					if ($k<count($whereArray)-1) {
						$sql.=" ".$whereArray[$k]["and|or"]." ";
					}
				}
				$statement=self::$mysqlLink->prepare($sql);
				foreach ($whereArray as $k => $v) {
					$whereArray[$k]["value"]=($typeWhere[$k]===PDO::PARAM_INT?(int)$whereArray[$k]["value"]:(string)$whereArray[$k]["value"]);
					$statement->bindParam(":".$whereArray[$k]["name"].$k, $whereArray[$k]["value"], $typeWhere[$k]);
				}
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$res=array();
						while ($r=$statement->fetch(PDO::FETCH_ASSOC)) {
							if (is_array($r)) {
								foreach($r as $k => $v) {
									if (!array_key_exists($k, $res)) {
										$res[$k]=array();
									}
									$res[$k][]=(($treatmentFunction!=null)?$treatmentFunction($v):$v);
								}
							}
							unset($r);
						}
						$statement->closeCursor();
						if ($sortParameters["boolean"]==false) {
							return $res;
						} else {
							if (is_array($sortParameters["key"])) {
								$sortParameters["key"]=array_reverse($sortParameters["key"]);
								foreach($sortParameters["key"] as $k=>$v) {
									$res=sortOn($res, $sortParameters["key"][$k], $sortParameters["sort_flags"], $sortParameters["boolean_remap_numerical"]);
								}
							}
							return $res;
						}
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectAllPlusString($table, $string, $treatmentFunction, $sortParameters=array("boolean"=>false, "key"=>null, "sort_flags"=>null, "boolean_remap_numerical"=>false)) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$sql="select * from ".$table." ";
				$sql.=$string;
				$statement=self::$mysqlLink->prepare($sql);
				try {
					$statement->execute();
					$res=array();
					while ($r=$statement->fetch(PDO::FETCH_ASSOC)) {
						foreach($r as $k => $v) {
							if (!array_key_exists($k, $res)) {
								$res[$k]=array();
							}
							$res[$k][]=(($treatmentFunction!=null)?$treatmentFunction($v):$v);
						}
						unset($r);
					}
					$statement->closeCursor();
					if ($sortParameters["boolean"]==false) {
						return $res;
					} else {
						if (is_array($sortParameters["key"])) {
							$sortParameters["key"]=array_reverse($sortParameters["key"]);
							foreach($sortParameters["key"] as $k=>$v) {
								$res=sortOn($res, $sortParameters["key"][$k], $sortParameters["sort_flags"], $sortParameters["boolean_remap_numerical"]);
							}
						}
						return $res;
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function selectOnFieldsPlusString($tableAndFields, $string, $treatmentFunction, $sortParameters=array("boolean"=>false, "key"=>null, "sort_flags"=>null, "boolean_remap_numerical"=>false)) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $tableAndFields[0])) {
				$sql="select ";
				for ($i=0; $i<count($tableAndFields[1]); $i++) {
					$sql.=$tableAndFields[1][$i];
					if ($i<count($tableAndFields[1])-1) {
						$sql.=', ';
					}
				}
				$sql.=" from ".$tableAndFields[0]." ";
				$sql.=$string;
				$statement=self::$mysqlLink->prepare($sql);
				try {
					$statement->execute();
					$res=array();
					while ($r=$statement->fetch(PDO::FETCH_ASSOC)) {
						if (is_array($r)) {
							foreach($r as $k => $v) {
								if (!array_key_exists($k, $res)) {
									$res[$k]=array();
								}
								$res[$k][]=(($treatmentFunction!=null)?$treatmentFunction($v):$v);
							}
						}
						unset($r);
					}
					$statement->closeCursor();
					if ($sortParameters["boolean"]==false) {
						return $res;
					} else {
						if (is_array($sortParameters["key"])) {
							$sortParameters["key"]=array_reverse($sortParameters["key"]);
							foreach($sortParameters["key"] as $k=>$v) {
								$res=sortOn($res, $sortParameters["key"][$k], $sortParameters["sort_flags"], $sortParameters["boolean_remap_numerical"]);
							}
						}
						return $res;
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function insertAll($table, $keyValueArray) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$intTypes=array("tinyint","smallint","mediumint","int","bigint");
				$ins="insert into ".$table." (";
				$i=0;
				foreach ($keyValueArray as $k => $v) {
					$ins.="`".$k."`";
					if ($i<count($keyValueArray)-1) {
						$ins.=", ";
					}
					$i++;
				}
				$ins.=") values (";
				$i=0;
				$type=array();
				foreach ($keyValueArray as $k => $v) {
					$statement=self::$mysqlLink->prepare("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='".self::$mysqlBase."' and TABLE_NAME=:table and column_name=:column");
					$statement->bindParam(':table', $table, PDO::PARAM_STR);
					$statement->bindParam(':column', $k, PDO::PARAM_STR);
					try {
						$statement->execute();
						$r=$statement->fetch(PDO::FETCH_ASSOC);
						$type[$k]=$r['DATA_TYPE'];
						$statement->closeCursor();
					} catch (PDOException $e) {
						return array("message"=>"ko","error"=>$e->getMessage());
					}
					$quotes=false;
					if (strlen($type[$k])>0 && in_array(strtolower($type[$k]),$intTypes)) {
						$type[$k]=PDO::PARAM_INT;
					} else {
						$type[$k]=PDO::PARAM_STR;
					}
					$ins.=':'.$k;
					if ($i<count($keyValueArray)-1) {
						$ins.=", ";
					}
					$i++;
				}
				$ins.=")";
				$statement=self::$mysqlLink->prepare($ins);
				foreach ($keyValueArray as $k => $v) {
					if ($type[$k]===PDO::PARAM_INT && $keyValueArray[$k]==="") {
						$keyValueArray[$k]=null;
					}
					$keyValueArray[$k]=($keyValueArray[$k]!==null?($type[$k]===PDO::PARAM_INT?(int)$keyValueArray[$k]:(string)$keyValueArray[$k]):$keyValueArray[$k]);
					$statement->bindParam(':'.$k, $keyValueArray[$k], ($keyValueArray[$k]!==null?$type[$k]:PDO::PARAM_NULL));
				}
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$id=self::query("select last_insert_id();")["result"]["last_insert_id()"][0];
						return array("message"=>"ok","id"=>$id);
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","id"=>null,"error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","id"=>null,"error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function updateWhere($table, $keyValueArray, $whereArray, $additionnalString="") {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$intTypes=array("tinyint","smallint","mediumint","int","bigint");
				$upd="update ".$table." set ";
				$type=array();
				$uniqid=array();
				foreach ($keyValueArray as $k => $v) {
					if (substr($k, 0, 5)!="where") {
						$statement=self::$mysqlLink->prepare("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='".self::$mysqlBase."' and TABLE_NAME=:table and column_name=:column");
						$statement->bindParam(':table', $table, PDO::PARAM_STR);
						$statement->bindParam(':column', $k, PDO::PARAM_STR);
						try {
							$statement->execute();
							$r=$statement->fetch(PDO::FETCH_ASSOC);
							$type[$k]=$r['DATA_TYPE'];
							$statement->closeCursor();
						} catch (PDOException $e) {
							return array("message"=>"ko","error"=>$e->getMessage());
						}
						$quotes=false;
						if (strlen($type[$k])>0 && in_array(strtolower($type[$k]),$intTypes)) {
							$type[$k]=PDO::PARAM_INT;
						} else {
							$type[$k]=PDO::PARAM_STR;
						}
						$uniqid[$k]=uniqid();
						$upd.="`".$k."`=:".$k.$uniqid[$k];
						$upd.=", ";
					}
				}
				$upd=substr($upd, 0, strlen($upd)-2)." where ";
				$typeWhere=[];
				for ($i=0; $i<count($whereArray); $i++) {
					if (array_key_exists($i, $whereArray) && is_array($whereArray[$i])) {
						$statement=self::$mysqlLink->prepare("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='".self::$mysqlBase."' and TABLE_NAME=:table and column_name=:column");
						$statement->bindParam(':table', $table, PDO::PARAM_STR);
						$statement->bindParam(':column', $whereArray[$i]["name"], PDO::PARAM_STR);
						try {
							$statement->execute();
							$r=$statement->fetch(PDO::FETCH_ASSOC);
							$typeWhere[$i]=$r['DATA_TYPE'];
							$statement->closeCursor();
						} catch (PDOException $e) {
							return array("message"=>"ko","error"=>$e->getMessage());
						}
						if (strlen($typeWhere[$i])>0 && in_array(strtolower($typeWhere[$i]),$intTypes)) {
							$typeWhere[$i]=PDO::PARAM_INT;
						} else {
							$typeWhere[$i]=PDO::PARAM_STR;
						}
						$upd.="`".$whereArray[$i]["name"]."` ".$whereArray[$i]["operator"]." :".$whereArray[$i]["name"].$i;
						if ($whereArray[$i]["and|or"]!==null) {
							$upd.=" ".$whereArray[$i]["and|or"]." ";
						}
					} else {
						return array("message"=>"ko","error"=>"whereClauseBadlyWritten");
					}
				}
				$upd.=" ".$additionnalString;
				$statement=self::$mysqlLink->prepare($upd);
				foreach ($keyValueArray as  $k => $v) {
					$keyValueArray[$k]=($keyValueArray[$k]!==null?($type[$k]===PDO::PARAM_INT?(int)$keyValueArray[$k]:(string)$keyValueArray[$k]):$keyValueArray[$k]);
					$statement->bindParam(':'.$k.$uniqid[$k], $keyValueArray[$k], ($keyValueArray[$k]!==null?$type[$k]:PDO::PARAM_NULL));
				}
				for ($i=0; $i<count($whereArray); $i++) {
					if (array_key_exists($i, $whereArray) && is_array($whereArray[$i])) {
						$whereArray[$i]["value"]=($typeWhere[$i]===PDO::PARAM_INT?(int)$whereArray[$i]["value"]:(string)$whereArray[$i]["value"]);
						$statement->bindParam(":".$whereArray[$i]["name"].$i, $whereArray[$i]["value"], $typeWhere[$i]);
					} else {
						return array("message"=>"ko","error"=>"whereClauseBadlyWritten");
					}
				}
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$statement->closeCursor();
						return array("message"=>"ok");
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return self::$statusReturn;
		}
	}
	public static function updatePlusString($table, $keyValueArray, $plus) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$intTypes=array("tinyint","smallint","mediumint","int","bigint");
				$upd="update ".$table." set ";
				$type=array();
				$uniqid=array();
				foreach ($keyValueArray as $k => $v) {
					if (substr($k, 0, 5)!="where") {
						$statement=self::$mysqlLink->prepare("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='".self::$mysqlBase."' and TABLE_NAME=:table and column_name=:column");
						$statement->bindParam(':table', $table, PDO::PARAM_STR);
						$statement->bindParam(':column', $k, PDO::PARAM_STR);
						try {
							$statement->execute();
							$r=$statement->fetch(PDO::FETCH_ASSOC);
							$type[$k]=$r['DATA_TYPE'];
							$statement->closeCursor();
						} catch (PDOException $e) {
							return array("message"=>"ko","error"=>$e->getMessage());
						}
						$quotes=false;
						if (strlen($type[$k])>0 && in_array(strtolower($type[$k]),$intTypes)) {
							$type[$k]=PDO::PARAM_INT;
						} else {
							$type[$k]=PDO::PARAM_STR;
						}
						$uniqid[$k]=uniqid();
						$upd.="`".$k."`=:".$k.$uniqid[$k];
						$upd.=", ";
					}
				}
				$upd=substr($upd, 0, strlen($upd)-2)." where ".$plus;
				$statement=self::$mysqlLink->prepare($upd);
				foreach ($keyValueArray as  $k => $v) {
					$keyValueArray[$k]=($keyValueArray[$k]!==null?($type[$k]===PDO::PARAM_INT?(int)$keyValueArray[$k]:(string)$keyValueArray[$k]):$keyValueArray[$k]);
					$statement->bindParam(':'.$k.$uniqid[$k], $keyValueArray[$k], ($keyValueArray[$k]!==null?$type[$k]:PDO::PARAM_NULL));
				}
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$statement->closeCursor();
						return array("message"=>"ok");
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function deleteWhereId($table, $id) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table) && (is_int($id) || preg_match('/[1-9][0-9]*/', $id))) {
				$statement=self::$mysqlLink->prepare("delete from ".$table." where id=:id");
				$statement->bindParam(':id', $id, PDO::PARAM_INT);
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$statement->closeCursor();
						return array("message"=>"ok");
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else if (preg_match('/[^\\\] /', $table)) {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			} else {
				return array("message"=>"ko","error"=>"idIsNotANumber");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function deleteWhere($table, $whereArray) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$intTypes=array("tinyint","smallint","mediumint","int","bigint");
				$sql="delete from ".$table." where ";
				$typeWhere=array();
				foreach ($whereArray as $k => $v) {
					$statement=self::$mysqlLink->prepare("select DATA_TYPE from INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA='".self::$mysqlBase."' and TABLE_NAME=:table and column_name=:column");
					$statement->bindParam(':table', $table, PDO::PARAM_STR);
					$statement->bindParam(':column', $whereArray[$k]["name"], PDO::PARAM_STR);
					try {
						$statement->execute();
						$r=$statement->fetch(PDO::FETCH_ASSOC);
						$typeWhere[$k]=$r['DATA_TYPE'];
						$statement->closeCursor();
					} catch (PDOException $e) {
						return array("message"=>"ko","error"=>$e->getMessage());
					}
					if (strlen($typeWhere[$k])>0 && in_array(strtolower($typeWhere[$k]),$intTypes)) {
						$typeWhere[$k]=PDO::PARAM_INT;
					} else {
						$typeWhere[$k]=PDO::PARAM_STR;
					}
					$sql.="`".$whereArray[$k]["name"]."` ".$whereArray[$k]["operator"]." :".$whereArray[$k]["name"].$k;
					if ($k<count($whereArray)-1) {
						$sql.=" ".$whereArray[$k]["and|or"]." ";
					}
				}
				$statement=self::$mysqlLink->prepare($sql);
				foreach ($whereArray as $k => $v) {
					$whereArray[$k]["value"]=($typeWhere[$k]===PDO::PARAM_INT?(int)$whereArray[$k]["value"]:(string)$whereArray[$k]["value"]);
					$statement->bindParam(':'.$whereArray[$k]["name"].$k, $whereArray[$k]["value"], $typeWhere[$k]);
				}
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$statement->closeCursor();
						return array("message"=>"ok");
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function deleteWhereString($table, $whereString) {
		if (self::$mysqlLink===null) {
			self::connection("");
		}
		if (self::$statusReturn[0]) {
			if (!preg_match('/[^\\\] /', $table)) {
				$sql="delete from ".$table." where ".$whereString;
				$statement=self::$mysqlLink->prepare($sql);
				try {
					$req=$statement->execute();
					if (!$req) {
						return array("message"=>"ko","error"=>implode(", ", $statement->errorInfo()));
					} else {
						$statement->closeCursor();
						return array("message"=>"ok");
					}
				} catch (PDOException $e) {
					return array("message"=>"ko","error"=>$e->getMessage());
				}
			} else {
				return array("message"=>"ko","error"=>"tableStringContainingUnescapedSpaces");
			}
		} else {
			return array("message"=>"ko","error"=>self::$statusReturn[1]);
		}
	}
	public static function closeMysql() {
		self::$mysqlLink=null;
	}
}
?>