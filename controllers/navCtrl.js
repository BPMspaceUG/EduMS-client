<script  type="text/javascript">

/*
Der Controller navCtrl fordert über den $http-service JSON-Datensätze DB-Views und reorganisiert sie in $scope.
Die Templates rightBarCourseByTopic und rightBarCourseAll zeigen die nächsten courses in Abhängigkeit des ausgewählten Topics an.
Die lorem function erzeugt Dummytext.

------------------------------------------------------------------------------------------------------------------------------
DB-Views: 	|	`all_events`							|`v_futurecourses` 						|`v_topic_coursecourse` 		
------------------------------------------------------------------------------------------------------------------------------
$scope		|	.allNextEvents**++						|++topiccourseCourselist++				|++topiclist++			
------------------------------------------------------------------------------------------------------------------------------
			|											|										|						
Bsp.Daten	|	course_id: "103"						|$$hashKey: "object:295"				|$$hashKey: "object:263"
			|	course_name: "ISO 27001 Foundation"		|courseHeadline: "course1 Headline"		|deprecated: "0"
			|	event_id: "3893"						|courseImage: null						|footer: null
			|	event_status_id: "2"					|course_description: "co(...) database"	|sideBarCourses: Array[0]
			|	eventguaranteestatus: "1"				|course_id: "1"							|sidebar_description: null
			|	finish_date: "2016-02-16"				|course_name: "course1"					|topicHeadline: ""
			|	finish_time: "17:00:00"					|course_price: "1035"					|topicImage: null
			|	internet_course_article_id: "736"		|number_of_days: "2"					|topic_description: "Topic(...)Schwoanshaxn."
			|	internet_location_article_id: "0"		|tc_course_id: "1"						|topic_id: "1"
			|	internet_location_name: "Ogox..inu"		|topic_id: "1"							|topic_name: "Topic1"
			|	start_date: "2016-02-15"				|										|topic_name_raw: "Topic 1"
			|	start_time: "09:00:00"					|										|topic_nr: 0
			|	test: "0"								|										|trainer_id: "14"
------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------
/getCourses:
SELECT course_id, course_name, number_of_days, internet_course_article_id, min_participants, course_description, 
	course_mail_desc, course_price, course_certificate_desc 
FROM `course` WHERE deprecated = 0
------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------

*/

/*Ein controller wird für einen bestimmten Sinnabschnitt innerhalb von Angular definiert*/
app.controller('navCtrl', ['$scope','$http', function ($scope, $http) {

//Der $http.get-service läd Ressourcen nach 
/*TOPICS-------------------------------------------------------------------------------------------*/
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getTopics')
	.then(function(response) {//wenn angeforderte Daten empfangen wurden...
		$scope.topics = response.data.topiclist.topiclist; //Navigation
		$scope.topiccourseCourse = Object.keys(response.data.topiccourseCourselist)
		.map(function (key) {return response.data.topiccourseCourselist[key]}); //Topic-Course Panel
		$scope.allNextEvents = response.data.allNextEvents //Termine & Anmeldung Modal
		$scope.nextEvents =  Object.keys(response.data.allNextEvents)
		.map(function (key) {return response.data.allNextEvents[key]});
		$scope.nextEvents = $scope.nextEvents.slice(0,4) //Sidebar-next 'x' Events

		for (var i = 0; i < $scope.nextEvents.length; i++) { //directive: 'rightBarCourseAll' -> helpVariables init
			$scope.nextEvents[i].btnInfo=false; //Show
			$scope.nextEvents[i].btnRegister=false; //Show
			if (i==1) {$scope.nextEvents[i].btnInfo=true}; //Sample
			$scope.nextEvents[i].sysName=$scope.nextEvents[i].course_name.replace(/\W+/g,'');
			//console.log('nextEvents['+i+']:');console.log($scope.nextEvents[i]); console.log('')
		};

		console.log('ResponseData von getTopics: (Auskommentiert)')//console.log(response.data)


		if ($scope.topics.length>8) {$scope.topics = $scope.topics.slice(0,8)};//limit to 5 to prevent overload
			//HTML5 3.2.3.1: Das id-Attribut darf kein Leerzeichen enthalten deshalb wird der topic_name nach name_raw kopiert u. anschließend die Leerzeichen entfernt
			for (var i = 0; i < $scope.topics.length; i++) {
				$scope.topics[i].topic_name_raw = $scope.topics[i].topic_name;			
				$scope.topics[i].topic_nr = i;			
				$scope.topics[i].topic_name = $scope.topics[i].topic_name.replace(/\s+/g,'');//löscht alle Leerzeichen			
			}

			/*Suche Kurse und weise sie den Topics zu. Suche events zu den Kursen der Topics und weise sie den Topics zu*/
			var aNE=$scope.allNextEvents
			for (var i = 0; i < $scope.topics.length; i++) { //für alle topics
				var t=$scope.topics[i]

				for (var j = 0; j < $scope.topiccourseCourse.length; j++) { //für alle topiccourCourse-Einträge
					var tcC=$scope.topiccourseCourse[j]

					//Wenn die topic_id des Elements aus der Topicliste == der topic_id des Elements aus der m:n-TopicCourses-Liste ist
					//dann lege in der Topicliste ein Array für die Sidebarelemente an. 
					//Vergleiche darauf hin die tc_course_id des TopicCourse Elements mit den course_id's aus der AllNextEvents-Liste.
					//Wenn die id's identisch sind füge dem aktuellen SidebarArray das Event hinzu
					if (t.topic_id == tcC.topic_id) {	//wenn ids gleich sind
						if (!$scope.topics[i].sideBarCourses){$scope.topics[i].sideBarCourses=[]}//lege sidebarArray für topic an
						if ($scope.topics[i].sideBarCourses.length<3) { //sidebar soll 5 elemente haben
													
							for (var k = 0; k < aNE.length; k++) {	//für alle allNextEvents-Einträge
								if (tcC.tc_course_id == aNE[k].course_id) { //nur Events die zur aktuellen course_id passen
									$scope.topics[i].sideBarCourses.push(aNE[k]) //befülle SideBar-Array
								};								
							};
						};
					};					
				};

			};
			console.log('fertiges $scope.topics: (Auskommentiert)');//console.log($scope.topics);			
	},function(response) {$scope.topics = 'Fehler in topicCtrl-$http: '+response}
	)

	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getCourses')
	.then(function(response) {
		$scope.courses = response.data.courselist;
		//console.log('getCourses: '); console.log($scope.courses);

		for (var i = 0; i < $scope.courses.length; i++) { //Zufallspreisgenerator
			if ($scope.courses[i].course_price || $scope.courses[i].course_price < 1) {
				$scope.courses[i].course_price =  Math.floor(Math.random()*3000);
			};			
		};
	},function(response) {$scope.courses = 'Fehler in courseCtrl-$http: '+response}
	)

/*LOCATIONS-------------------------------------------------------------------------------------------*/
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getAllLocations')
	.then(function(response) {
		$scope.location = response.data;

		//Dummytext falls description leer
		for (x in $scope.location) {
			if (!$scope.location[x].location_description) {
				$scope.location[x].location_description = lorem(100);			
			};    		
		}	
	},function(response) {$scope.location = 'Fehler in locationCtrl-$http: '+response}
	)

}])


/*SIDEBARTEMPLATES-------------------------------------------------------------------------------------------*/	
app.directive('rightBarCourseAll', function() {//sideBarCourse = Directive Name
	return{
//Sidebarelement für allgemeine Kurse
template:'<div class="list-group">\
	<a class="list-group-item active">\
		<h3 class="list-group-item-heading">{{e.course_name}} \
			<span class="label label-danger"> {{e.start_date}} </span>\
		</h3>'+

		'<div>\
			<button type="button" class="btn btn-info" ng-click= "e.btnInfo=!e.btnInfo">\
				<span class="fa-stack">\
					<i class="fa fa-info fa-stack-1x fa-inverse"></i>\
				</span>Info</button> - <button type="button" class="btn btn-success" ng-model="reservate" ng-click= "e.btnRegister=!e.btnRegister">\
				<span class="fa-stack">\
					<i class="fa fa-cart-plus fa-stack-1x fa-inverse"></i>\
				</span>reservieren</button>\
		</div>'+

		'<div  ng-show="e.btnInfo">\
		<h3>Start: {{e.start_date}} {{e.start_time}}</h3> \
		<h3>Ende: {{e.finish_date}} {{e.finish_time}}</h3>\
		<h3>Internet-Location-Name: {{e.internet_location_name}}</h3>\
		</div>'+
		
		'<div  ng-show="e.btnRegister">\
			<form class="form-horizontal">\
	  		<div class="form-group">\
	    		<label for="inputName{{e.sysName}}">Name</label>\
	    		<input type="text" class="form-control" id="inputName{{e.sysName}}" placeholder="nur 1 Namensfeld?">\
	  		</div>\
	  		<div class="form-group">\
	    		<label for="inputEmail{{e.sysName}}">Email</label>\
	    		<input type="email" class="form-control" id="inputEmail{{e.sysName}}" placeholder="Validität.prüfen@????.TLD">\
	  		</div>\
	  		<button type="submit" class="btn btn-default">Reservierungsanfrage Abschicken</button>\
			</form>\
		</div>'+
	'</a>\
</div>'

	}
});
app.directive('rightBarCourseByTopic', function() {//sideBarCourse = Directive Name
	return{
		template:'<div class="list-group"><a href="#" class="list-group-item active"><h3 class="list-group-item-heading">{{sbc.course_name}} '+
		'<span class="label label-danger"> {{sbc.start_date}}</span></h3><div><button type="button" class="btn btn-info "><span class="fa-stack">'+
		'<i class="fa fa-info fa-stack-1x fa-inverse"></i></span>Info</button> - <button type="button" class="btn btn-success">'+
		'<span class="fa-stack"><i class="fa fa-cart-plus fa-stack-1x fa-inverse"></i></span>reservieren</button></div></a></div>'
	}
});

/*Dummytextgenerator
* max = Zahl der Rückgabewörter
* return = String 
*/
var lorem = function(max) {
	var lw = ['abenteuerlich','aktiv','angenehm','animalisch','anmutig','anregend','anspruchsvoll','anziehend','aphrodisierend','atemberaubend','athletisch','attraktiv','aufreizend','ausgelassen','außergewöhnlich','außerordentlich','bedeutend','beeindruckend','beflügelt','befreiend','begehrenswert','begeisternd','beglückend','belebt','berauschend','berühmt','besonders','bewundernswert','bezaubernd','bildlich','brillant','charismatisch','charmant','dominant','duftend','dynamisch','','[adjektivebuchbanner]','echt','edel','ehrlich','einfühlsam','einzigartig','ekstatisch','elegant','emotional','empfehlenswert','entzückend','erfrischend','erhellend','erotisch','erregend','erstaunlich','erstklassig','exklusiv','extravagant','exzellent','fabelhaft','fantastisch','faszinierend','fein','fesselnd','feurig','freizügig','freudig','freundlich','frisch','fröhlich','geborgen','geheim','geheimnisvoll','geliebt','genüsslich','geschmackvoll','gespannt','gigantisch','glänzend','glücklich','grandios','gravierend','grenzenlos','großartig','harmonisch','heißblütig','hell','hemmungslos','herrlich','hervorragend','hübsch','hüllenlos','','[adjektivebuchbanner]','humorvoll','ideal','imponierend','individuell','Instinktiv','intelligent','intensiv','interessant','klar','knallig','komfortabel','königlich','kostbar','kraftvoll','kunstvoll','lebendig','lebhaft','leidenschaftlich','leuchtend','liebenswert','lüstern','lustvoll','luxuriös','mächtig','magisch','märchenhaft','maximal','mitreißend','mysteriös','mystisch','packend','perfekt','persönlich','phänomenal','phantastisch','pikant','positiv','potent','prächtig','prall','rasant','real','reich','rein','reizend','riesig','riskant','romantisch','schamlos','scharf','schön','selbstlos','selbstsicher','selten','sensationell','sensibel','sexuell','sinnlich','spannend','spektakulär','sprachlos','spürbar','stark','stilvoll','stürmisch','sündig','sympathisch','traumhaft','überlegen','überwältigend','unfassbar','unglaublich','unsterblich','unwiderstehlich','verblüffend','verführerisch','verlockend','verwöhnt','vital','warm','weiblich','wertvoll','wild','wohlklingend','wohlriechend','wunderbar','wunderschön','wundervoll','zaghaft','zärtlich','zuverlässig','zwischenmenschlich','Anruf','Anzug','Apfel','April','Arm','Arzt','August','Ausweis','Bahnhof','Balkon','Baum','Berg','Beruf','Bildschirm','Bus','Computer','Dezember','Dienstag','Durst','Drucker','Eintrittskarte','Einwohner','Fahrschein','Februar','Fernseher','Finger','Flughafen','Flur','Frühling','Füller','Fuß','Fußboden','Garten','Gast','Geburtstag','Hafen','Hamburger','Herbst','Herr','Himmel','Hut','Hunger','Januar','Juli','Juni','Kaffee','Kakao','Keller','Kellner','Kleiderhaken','Koch','Kognak','Kuchen','Kugelschreiber','Kuchen','Kunde','Laden','Lehrer','Locher','Löffel','Mai','März','Mann','Markt','Marktplatz','Monitor','Name','November','Oktober','Opa','Park','Pass','Passant','Platz','Projektor','Pullover','Radiergummi','Regen','Rock','Schinken','Schlüssel','Schnaps','Schnee','Schrank','September','Sessel','Sommer','Star','Strumpf','Stuhl','Supermarkt','Tag','Tee','Teppich','Test','Tisch','Tourist','Urlaub','Vater','Wagen','Wein','Wind','Winter','Wunsch','Zeiger','Zucker','Zug','Zuschauer	Adresse','Apfelsine','Apotheke','Bank','Bankkarte','Bedienung','Beschreibung','Bestellung','Bibliothek','Bluse','Brille','Brücke','City','Cola','Decke','Diskette','Dolmetscherin','Dose','Dusche','Eile','Einladung','Etage','Fahrkarte','Festung','Fotografie','Frage','Funktion','Gabel','Garage','Gardine','Gasse','Gitarre','Größe','Hilfe','Hose','Hütte','Information','Kasse','Kassette','Kirche','Krawatte','Kreditkarte','Kreide','Küche','Kultur','Lampe','Landkarte','Landschaft','Mandarine','Maschine','Maus','Milch','Mutter','Mütze','Nachricht','Nacht','Nase','Natur','Nummer','Oma','Oper','Ordnung','Pause','Pflanze','Pizza','Polizistin','Post','Postkarte','Prüfung','Reparatur','Reservierung','Sache','Sahne','Schule','Sehenswürdigkeit','SMS','Socke','Sonne','Straße','Straßenbahn','Tasche','Tasse','Toilette','Torte','U-Bahn','Überraschung','Übung','Uhr','Umwelt','Universität','Verbindung','Wand','Wanderung','Welt','Werbung','Werkstatt','Wirtschaft','Woche','Wurst','Zeitung	Auge','Auto','Bad','Bein','Bett','Bier','Bild','Brötchen','Buch','Café','Einkaufszentrum','Fahrrad','Fest','Flugzeug','Foto','Fräulein','Frühstück','Gefühl','Gemüse','Geschäft','Glas','Gleis','Handy','Haus','Heft','Hemd','Hotel','Huhn','Kännchen','Internet','Kind','Kino','Kleid','Klo','Leben','Mädchen','Messer','Motorrad','Museum','Radio','Regal','Restaurant','Schiff','Schnitzel','Sofa','Spiel','Steak','Stück','Taxi','Telefon','Theater','Ticket','Tonbandgerät','Warenhaus','Wasser','Wetter','Wunder','Aids','Antibiotikum','Apartheid','Atombombe','Autobahn','Automatisierung','Beat','Beton','Bikini','Blockwart','Bolschewismus','Camping','Comics','Computer','Demokratisierung','Demonstration','Demoskopie','Deportation','Design','Doping','Dritte Welt','Drogen','Eiserner Vorhang','Emanzipation','Energiekrise','Entsorgung','Faschismus','Fernsehen','Film','Fließband','Flugzeug','Freizeit','Friedensbewegung','Führer','Fundamentalismus','Gen','Globalisierung','Holocaust','Image','Inflation','Information','Jeans','Jugendstil','Kalter Krieg','Kaugummi','Klimakatastrophe','Kommunikation','Konzentrationslager','Kreditkarte','Kugelschreiber','Luftkrieg','Mafia','Manipulation','Massenmedien','Molotowcocktail','Mondlandung','Oktoberrevolution','Panzer','Perestroika','Pille','Planwirtschaft','Pop','Psychoanalyse','Radar','Radio','Reißverschluss','Relativitätstheorie','Rock and Roll','Satellit','Säuberung','Schauprozess','Schreibtischtäter','Schwarzarbeit','Schwarzer Freitag','schwul','Selbstverwirklichung','Sex','Single','Soziale Marktwirtschaft','Sport','Sputnik','Star','Stau','Sterbehilfe','Stress','Terrorismus','U-Boot','Umweltschutz','Urknall','Verdrängung','Vitamin','Völkerbund','Völkermord','Volkswagen','Währungsreform','Weltkrieg','Wende','Werbung','Wiedervereinigung','Wolkenkratzer']
	var a = Math.floor(Math.random()*max), b='';
	for (var i = 0; i < a; i++) {
		b= b + ' ' + lw[Math.floor(Math.random()*lw.length)]
	}
	return b
}

</script>