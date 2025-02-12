<?php
ini_set('session.gc_maxlifetime', 86400);
@session_cache_expire(1440);
@session_start();
?>