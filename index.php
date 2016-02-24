<?php

/*Define self and location*/
$config['srv']['addr'] = 'http://localhost:4040/EduMS/api/index.php';
$config['auth']['login'] = 'BPMspace';
$config['auth']['token'] = 'abc';
$baseURL = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'];

/*Handle the requested view and define the URL*/
$responseurl = $baseURL."/";
if(array_key_exists('navdest',$_GET)){
    $navigationDestiny = $_GET['navdest'];
    switch ($_GET['navdest']){
        case 'brand': $responseurl = $baseURL.'/brand';
            break;
        case 'monitor': $responseurl = $baseURL.'/monitor';
            break;
        default:  $responseurl = $baseURL.'/';
    }
}

/*Fetch the data from the api*/
$response = file_get_contents($responseurl);

/*To echo out a debuging version of the response, add "&debug=1" to the URL.*/
if(isset($_REQUEST['debug']) && $_REQUEST['debug']==1){
    echo "<hr> The response-URL:'".($responseurl)."' responses as Array:<hr>";
    var_dump(is_array(json_decode($response, true)));
    echo "<hr> And just JSON-decoded";
    var_dump(json_decode($response, true));
    echo "<hr>";
}

/*The response is expected as a valid JSON-Array. If not echo the fail.*/
if(!is_array(json_decode($response, true))){
    echo "<h2>The response is not a valid JSON-Array</h2>";
    echo "<h3>$response:</h3>";
    echo $response;
    echo "<hr>";
    exit;
}

/*If the authentification on the server was successfull, seperate the valid $response*/ 
$response = json_decode($response, true);
if (is_array($response)) {
    if ($response != "invalidCredentials") {
        if(array_key_exists('ct',$response)){
            $ct = $response['ct']; $script = $response['script']; $controller = $response['controller']; $css = $response['css']; $directive = $response['directive'];
        }else{
            $ct = 'no content'; $script = ''; $controller = ''; $css = ''; $directive = '';
        }
    }
    else{
        $ct = 'invalid c'; $script = ''; $controller = ''; $css = ''; $directive = '';
    }
}  
else{
    $ct = 'Die empfangenen Daten sind kein Array.'; $script = ''; $controller = ''; $css = ''; $directive = '';
}

/*Create the page.*/
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