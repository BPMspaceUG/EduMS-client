<script  type="text/javascript">

/*Das angular.module initialisiert Angular*/

/*Ein controller wird für einen bestimmten Sinnabschnitt innerhalb von Angular definiert*/
app.controller('navCtrl', ['$scope','$http', function ($scope, $http) {
	//Der $http.get-service läd Ressourcen nach 

/*TOPICS-------------------------------------------------------------------------------------------*/
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getTopics')
	.then(function(response) {//wenn angeforderte Daten empfangen wurden...
		$scope.topics = response.data.topiclist;
		if ($scope.topics.length>5) {$scope.topics = $scope.topics.slice(0,5)};//limit to 5 to prevent overload
		//HTML5 3.2.3.1: Das id-Attribut darf kein Leerzeichen enthalten deshalb wird der topic_name nach name_raw kopiert u. anschließend die Leerzeichen entfernt
			for (var i = 0; i < $scope.topics.length; i++) {
				$scope.topics[i].topic_name_raw = $scope.topics[i].topic_name;			
				$scope.topics[i].topic_nr = i;			
				$scope.topics[i].topic_name = $scope.topics[i].topic_name.replace(/\s+/g,'');//löscht alle Leerzeichen			
			};
		console.log('getTopics: '); console.log($scope.topics);
	},function(response) {$scope.topics = 'Fehler in topicCtrl-$http: '+response}
	)


	/*SELECT course_id, course_name, number_of_days, internet_course_article_id, min_participants, course_description, course_mail_desc, course_price, course_certificate_desc FROM `course` WHERE deprecated = 0*/
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getCourses')
	.then(function(response) {
		$scope.courses = response.data.courselist;
		console.log('getCourses: '); console.log($scope.courses);

		for (var i = 0; i < $scope.courses.length; i++) {
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

/*FUTUREEVENTS-------------------------------------------------------------------------------------------*/
	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getNextFiveEvents')
	.then(function(response) {
		$scope.nextEvents = response.data;
		//delete ist workaround für defaultresponse - evtl. response differenzieren
		delete $scope.nextEvents.footer;
		delete $scope.nextEvents.topnav;

	},function(response) {$scope.nextEvents = 'Fehler in eventCtrl-$http: '+response}
	)

}])

app.directive('rightBarCourse', function() {//sideBarCourse = Directive Name
	return{template:'<div class="list-group"><a href="#" class="list-group-item active"><h4 class="list-group-item-heading">{{e.course_name}} <span class="badge"> {{e.start_date}} </span></h4><div><button type="button" class="btn btn-info btn-lg"><span class="fa-stack"><i class="fa fa-info fa-stack-1x fa-inverse"></i></span>Info</button> - <button type="button" class="btn btn-warning btn-lg"><span class="fa-stack"><i class="fa fa-cart-plus fa-stack-1x fa-inverse"></i></span>reservieren</button></div></a></div>'}
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