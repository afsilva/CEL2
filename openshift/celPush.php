<?php

// Put your device token here (without spaces):
//$deviceToken = '7e95791d5fe9384bcf275ec8f83e0c7972d78ca99b46aac1bb80c44840548fd5';
// Put your private key's passphrase here:
$passphrase = 'SOMEPASSPHRASE';
$server = $_ENV['OPENSHIFT_MYSQL_DB_HOST'];
$port = $_ENV['OPENSHIFT_MYSQL_DB_PORT'];

$con = mysql_connect("$server:$port","admin","SOMEPASSWORD");
if (!$con)
{
  file_put_contents('php://stderr', print_r($mysql_error() , TRUE));
}
mysql_select_db("push", $con);
$sql_result = mysql_query("SELECT deviceToken FROM cel");

////////////////////////////////////////////////////////////////////////////////
// Check Openshift Status
// test URL
#$variable = file_get_contents('http://people.redhat.com/~ansilva/status.json');
$variable = file_get_contents('https://openshift.redhat.com/app/status/status.json');
$decoded = json_decode($variable,true);
$openIssues = count($decoded['open']);
$message ="";

if ($openIssues == 0) {
 $message ="(OK)"; 
 echo "Openshift Status: $message";
 exit;
} else {
 $message ="Openshift Status: ($openIssues) Issue";
 if ($openIssues >1) $message = $message."s";
}

$ctx = stream_context_create();
stream_context_set_option($ctx, 'ssl', 'local_cert', 'cel.pem');
stream_context_set_option($ctx, 'ssl', 'passphrase', $passphrase);

// Open a connection to the APNS server
$fp = stream_socket_client(
	'ssl://gateway.sandbox.push.apple.com:2195', $err,
	$errstr, 60, STREAM_CLIENT_CONNECT|STREAM_CLIENT_PERSISTENT, $ctx);

if (!$fp)
	exit("Failed to connect: $err $errstr" . PHP_EOL);

echo 'Connected to APNS' . PHP_EOL;

// Create the payload body
$body['aps'] = array(
	'alert' => $message,
	'sound' => 'default'
	);

// Encode the payload as JSON
$payload = json_encode($body);
while($row = mysql_fetch_array($sql_result))
{
  $deviceToken = $row['deviceToken'];
  // Build the binary notification
  $msg = chr(0) . pack('n', 32) . pack('H*', $deviceToken) . pack('n', strlen($payload)) . $payload;

  // Send it to the server
  $result = fwrite($fp, $msg, strlen($msg));

  $err1 = "";
  $err_date = date("Y-m-d H:i:s");
  if (!$result)
    $err1 = "$deviceToken: Message not delivered\n";
  else
	$err1 = "$deviceToken: Message successfully delivered\n";
  file_put_contents('php://stderr', print_r($err_date." ".$err1 , TRUE));
}

mysql_close($con);

// Close the connection to the server
fclose($fp);
