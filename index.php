<?php

/*Define self and location*/
//Beispiel login: ['BPMspaceID1','BtopgwtID8','EqpajbuuID9']
//Beispiel token: ['538a9f12437ff589708c58457af13256','611c1aae3564875430b2a66b1a809051','5b35716ce1ff524b662dfbb160e293a3']
// $config['srv']['addr'] = 'http://development.bpmspace.org:4040//EduMS/api/index.php';
$config['srv']['addr'] = 'http://dev.bpmspace.org:4040/~cedric/EduMS/api/index.php';
$apisvr = $config['srv']['addr'];
// $config['srv']['reserve'] = 'http://dev.bpmspace.org:4040/~cedric/EduMS/api/reservemail.php';
$config['auth']['login'] = 'EqpajbuuID9';
$config['auth']['token'] = '5b35716ce1ff524b662dfbb160e293a3';
$baseURL = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'];

/*Handle the requested view and define the URL*/
$responseurl = $baseURL."/";
if(array_key_exists('navdest',$_GET)){
    $navigationDestiny = $_GET['navdest'];
    switch ($_GET['navdest']){
        case 'brand': $responseurl = $baseURL.'/brand';
                /*Fetch the data from the api*/
                $response = file_get_contents($responseurl);
                $brandinfo = file_get_contents($baseURL.'/getBrandInfo');
            break;
        case 'monitor': $responseurl = $baseURL.'/monitor';
            break;
        // case 'reserveform': $responseurl = $baseURL.'/reserveform';
        //     $data = array('brand' => $config['auth']['login'].' '.$config['auth']['token'], 
        //         'rinfo' => '{a:[1]}');

        //     // use key 'http' even if you send the request to https://...
        //     $options = array(
        //         'http' => array(
        //             'header'  => "Content-type: application/json\r\n",
        //             'method'  => 'POST',
        //             'content' => http_build_query($data)
        //         )
        //     ); 
        //     $context  = stream_context_create($options);
        //     $result = file_get_contents($config['srv']['reserve'], false, $context);
        //     if ($result === FALSE) { /* Handle error */ }

        //     //var_dump($result);
        //         // $response = file_get_contents($responseurl);
        //         // $brandinfo = '["'.$config['auth']['login'].'","'.$config['auth']['token'].'"]';
        //     break;
        default:  $responseurl = $baseURL.'/';
            break;
    }
}else{    
    $response = file_get_contents($responseurl);
    $brandinfo = file_get_contents($baseURL.'/getBrandInfo');
}



// var_dump($response);
// var_dump($brandinfo);
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
    echo "<h3>Response in raw:</h3>";
    echo $response;
    echo "<h3>Response as var_dump:</h3>";
    var_dump($response);
    echo "<h3>-End Of Response</h3>";
    echo "<hr>";
    exit;
}

/*If the authentification on the server was successfull, seperate the valid $response*/ 
$response = json_decode($response, true);
if (is_array($response)) {
    if ($response != "invalidCredentials") {
        if(array_key_exists('ct',$response)){
            $ct = $response['ct']; $script = $response['script']; $controller = $response['controller']; $css = $response['css']; $directive = $response['directive'];
        // var_dump($response);
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
    <div id="content">
      $ct
    </div>

</body>
$script
<script>apisvr='$apisvr';</script>
<script>response = $brandinfo;</script>
$controller 
<script>console.log(response);</script>
<script>console.log(apisvr);</script>
$directive
</html>
EOF;
?>
