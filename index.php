<?php

$config['srv']['addr'] = 'http://localhost:4040/EduMS/api/index.php';
$config['auth']['login'] = 'BPMspace';
$config['auth']['token'] = 'abc';
$baseURL = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'];

if(array_key_exists('contentid',$_GET)){
    intval($_GET['contentid'])>0 ? $contentid="/".intval($_GET['contentid']) : $contentid="";
}

$navigationDestiny = '';
if(array_key_exists('navdest',$_GET)){
    $navigationDestiny = $_GET['navdest'];
}

$responseurl = "";
switch ($navigationDestiny){
    case 'brand': $responseurl = $baseURL.'/brand';
        break;
    case 'monitor': $responseurl = $baseURL.'/monitor';
        break;
    default:  $responseurl = $baseURL.'/';
}

$response = file_get_contents($responseurl);


if(isset($_REQUEST['debug']) && $_REQUEST['debug']==18234){
    echo "<hr>".($responseurl)."<hr>";
    var_dump(is_array(json_decode($response, true)));
    echo "<hr>";
    var_dump(json_decode($response, true));
    echo "<hr>";
}
if(!is_array(json_decode($response, true))){
    echo "Invalid response from Server - could not parse data";
    echo "<h2>Data is:</h2>";
    echo json_decode($response);
    echo "<h3>RAW:</h3>";
    echo $response;
    exit;
}
 
$response = json_decode($response, true);
if (is_array($response)) {
    if ($response != "invalidCredentials") {
        $ct = $response['ct']; $script = $response['script']; $controller = $response['controller']; $css = $response['css']; $directive = $response['directive'];
    }
    else{
        $ct = 'invalid c'; $script = ''; $controller = ''; $css = ''; $directive = '';
    }
}  
else{
    $ct = 'Die empfangenen Daten sind kein Array.'; $script = ''; $controller = ''; $css = ''; $directive = '';
}

//Konstruktion der Ausgabepage
echo <<<EOF
<!DOCTYPE html>
<html lang="de" ng-app='application'>
<head>
    $css
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">        
</head>
<body>
    <div id="inhalt">
      $ct
    </div>
</div>
</body>
$script
$controller 
$directive
</html>
EOF;
?>