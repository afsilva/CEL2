<?php

$server = $_ENV['OPENSHIFT_MYSQL_DB_HOST'];
$port = $_ENV['OPENSHIFT_MYSQL_DB_PORT'];

$con = mysql_connect("$server:$port","admin","SOMEPASSWORD");

if (!$con)
{
  die('Could not connect: ' . mysql_error());
}

mysql_select_db("push", $con);

$sql = "INSERT INTO cel SET ";
foreach($_GET as $key => $value) 
{ 
  $sql .= "$key = '$value',";
}
//remove last comma
$sql = substr_replace($sql ,"",-1);;
file_put_contents('php://stderr', print_r($sql, TRUE)); 
@mysql_query("$sql");

mysql_close($con);


?>
