<?php
/**User: cwalonka, cneuland*/
require_once 'config.inc.php';

$baseURL = $config['srv']['addr'].'/'.$config['auth']['login'].'/'.$config['auth']['token'];
$scripte = file_get_contents($baseURL.'/scripte');
$css = file_get_contents($baseURL.'/css');
$cssSheets = file_get_contents($baseURL.'/cssSheets');

$topnav='';$sidebar='';$response = '';$contentid = '';$footer = '';

if(array_key_exists('contentid',$_GET)){
    intval($_GET['contentid'])>0 ? $contentid="/".intval($_GET['contentid']) : $contentid="";
}

$navigationDestiny = '';
if(array_key_exists('navdest',$_GET)){
    $navigationDestiny = $_GET['navdest'];
}

$responseurl = "";
switch ($navigationDestiny){
    // $config['srv']['addr'] = 'http://localhost:4040/EduMS/api/index.php';

    case 'packages':
        $responseurl = $baseURL.'/package'.$contentid;
        break;
    case 'locations':
        $responseurl = $baseURL.'/location'.$contentid;
        break;
    case 'topics':
        $responseurl = $baseURL.'/topics'.$contentid;
        break;
    case 'signup':
        $responseurl = $baseURL.'/signup';
        break;
    case 'boot':
        $responseurl = $baseURL.'/boot';
        break;
    case 'monitor':
        $responseurl = $baseURL.'/monitor';
        break;
    default:
        $responseurl = $baseURL.'/';
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






switch ($navigationDestiny){

    case 'boot':
    $content = $navigationDestiny . '|'; 
    $content .= file_get_contents('./controllers/topicCtrl.js');
    $content .= file_get_contents('boot.html');
    break;

    case 'monitor':
        //$topnav = ;
        $sidebar = 'sidebar';
        $content = file_get_contents('controllers/monitor.php');   
        $content .= '<div ng-controller="monitorCtrl">';   
        $content .= file_get_contents('viewressources/inputFieldAndButton.html');   
        $content .= $response.'</div>';   
        $footer = 'footer';
    break;

    case 'topics':
        $response = json_decode($response, true);
        $content = '';
        foreach ($response['topiclist'] as $key){
            $name = $key['topic_name'];
            $description = $key['topic_description'];
            $id = $key['topic_id'];
            if ($contentid==''){
                $content .= <<<EOT
            <p><a href="?navdest=topics&contentid=$id">$name </a></p>
EOT;
            }
            else{
                $footer = $key['footer'];
                $content .= <<<EOT
            <p>$name<br>
            $description</p>
EOT;
            }
        }
        break;

    case 'locations':
        $response = json_decode($response, true);
        $content = '';
        if(count($response['locations'])==0){
            echo "error - no locations available";
            exit;
        }
        foreach ($response['locations'] as $key){
            $name = $key['location_name'];
            $description = $key['location_description'];
            $id = $key['location_id'];
            if ($contentid==''){
                $content .= <<<EOT
            <p><a href="?navdest=locations&contentid=$id">$name </a></p>
EOT;
            }
            else{
                $content .= <<<EOT
            <p>$name<br>
            $description</p>
EOT;
            }

        }
        break;

    case 'packages':
        $response = json_decode($response, true);
        $content = '';
        if(count($response['packagelist'])==0){
            echo "Keine Daten empfangen";
            exit;
        }
        $listedTopics = array();
        foreach ($response['packagelist'] as $key){
            $name = $key['topic_name'];
            $topicId = $key["topic_id"];
            $description = $key['topic_description'];
            if($contentid==''){
                if(!in_array($topicId,$listedTopics)){
                    array_push($listedTopics,$topicId);
                    $content .= <<<EOT
            <p><a href="?navdest=packages&contentid=$topicId">$name </a></p>
EOT;
                }
            }
            else{
                $packageId = $key['package_id'];
                $packageName = $key['package_name'];                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                $packagePrice = $key['package_price'];
                $packageDiscount = $key['package_discount'];
                $packageDescription = $key['package_description'];

                $content .= <<<EOT
            <p>$packageName<br>
            $packagePrice<br>
            $packageDiscount<br>
            $packageDescription</p>
            <hr>
EOT;
            }
        }

        break;

    default:
    $response = json_decode($response, true);
    ob_start();
    var_dump($response);
    $content = ob_get_clean();
}


//var_dump($response);

if (isset($response['content'])) {
    $content = "";
    foreach($response['content'] as $key){
       $content .= $key['text'];
    }
}

function getTopNav($response,$baseURL=""){
    if(!array_key_exists('topnav',$response)){
        return '';
    }
    $topnav = $response['topnav'];
    $result = "";
    if(sizeof($topnav)==0){
        return $result;
    }
    foreach($topnav as $key){
        $result .= "<a href=".$baseURL.$key['path'].">".$key['text']."</a>&nbsp;";
    }
    return $result;
}

function getSidebar($response,$baseURL=""){
    $result = "";
    if(array_key_exists('sidebar',$response)){
        foreach($response['sidebar'] as $key){
            $result .= $key['text'];
        }
    }
    if(array_key_exists('nextEvents',$response)){
        if(array_key_exists('sidebar',$response)){
            $result .= "<hr>";
        }
        for($i=0;$i<sizeof($response['nextEvents']);$i++){
            $result.= parseEvent($response['nextEvents'][$i]);
        }
    }
    return $result;
}

function parseEvent($eventdata){
    $name = $eventdata['course_name'];
    $start = $eventdata['start_date'];
    $end = $eventdata['finish_date'];
    $location = $eventdata['location_name'];

    $content = <<<EOT
$name<br>
$start bis $end<br>
$location
<hr>
EOT;
    return $content;
}

function getFooter($response,$baseURL){
    $result = "";
    if(array_key_exists('footer',$response)){
        foreach($response['footer'] as $key){
            $result .= $key['text'];
        }
    }
    return $result;
}
if (isset($response['topnav'])) {
    $topnav = getTopNav($response,$baseURL);
    $sidebar = getSidebar($response,$baseURL);
    $footer = $footer==''?getFooter($response,$baseURL):$footer;
}


//Konstruktion der Ausgabepage
echo <<<EOF
<!DOCTYPE html>
<html lang="de" ng-app='application'>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">    
    $scripte
    $cssSheets
    <style type="text/css"> $css </style>
</head>
<body>
    <div id="kopfbereich">
        $topnav
    </div>

    <div id="steuerung">
        $sidebar
    </div>

    <div id="inhalt">
        $content
    </div>

    <div id="fussbereich">
        $footer
    </div>
</div>
<span class="label label-success">Success</span>
<span class="label label-info">Info</span>
<span class="label label-warning">Warning</span>

</body>
</html>
EOF;
?>