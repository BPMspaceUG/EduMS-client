<script  type="text/javascript">


/*Das angular.module initialisiert Angular*/

/*Ein controller wird für einen bestimmten Sinnabschnitt innerhalb von Angular definiert*/
app.controller('modalCtrl', ['$scope','$http', function ($scope, $http) {
	//Der $http.get-service läd Ressourcen nach 




	/*SELECT course_id, course_name, number_of_days, internet_course_article_id, min_participants, course_description, course_mail_desc, course_price, course_certificate_desc FROM `course` WHERE deprecated = 0*/



/*LOCATIONS-------------------------------------------------------------------------------------------*/




/*FUTUREEVENTS-------------------------------------------------------------------------------------------*/
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getFutureCourses')
	.then(function(response) {
		$scope.futureCourses = response.data;
		console.log('getFutureCourses: '); console.log($scope.futureCourses);

		/*Folgender Codeabschnitt definiert freie Plätze und wurde durch besseres sql ersetzt
		$scope.futureCourses.leftSeats = [];
		$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/countParticipantsOnEvent')
		.then(function(response) {
			$scope.countParticipantsOnEvent = response.data;

			fc=Object.keys($scope.futureCourses).map(function (key) {return $scope.futureCourses[key]})
			poe=Object.keys($scope.countParticipantsOnEvent).map(function (key) {return $scope.countParticipantsOnEvent[key]})

			for (var i = 0; i < fc.length; i++) {//alle zukünftigen Kurse durchgehen
				for (var j = 0; j < poe.length; j++) {//alle Teilnehmerzählungen durchgehen
					//console.log('event_id cp:'+poe[j].event_id+' event_id fe:'+fc[i].event_id);
					if (poe[j].event_id==fc[i].event_id) {//Schlüssel ist event_id
						//speichere Differenz von der aktuellen und maximalen Teilnehmeranzahl
						$scope.futureCourses.leftSeats[fc[i].event_id] = fc[i].maxParticipants - poe[j].count;
						console.log('event_id '+poe[j].event_id+' hat:'+$scope.futureCourses.leftSeats[fc[i].event_id]+' freie Plätze');
						j=poe.length;//Schleifenende weil genau 1 match erwartet (performance)
					};					
				};
			};

			console.log('countParticipantsOnEvent: '); console.log($scope.countParticipantsOnEvent);
		},function(response) {$scope.countParticipantsOnEvent = 'Fehler in courseCtrl-$http: '+response}
		)*/

	},function(response) {$scope.courses = 'Fehler in courseCtrl-$http: '+response}
	)	



	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getNextFiveEvents')
	.then(function(response) {
		$scope.nextEvents = response.data;
		delete $scope.nextEvents.footer;
		delete $scope.nextEvents.topnav;
		
		console.log('Event: '+$scope.nextEvents.length); console.log($scope.nextEvents);
		/*course_id: "103"
		course_name: "ISO 27001 Foundation"
		event_id: "3893"
		event_status_id: "2"
		eventguaranteestatus: "1"
		finish_date: "2016-02-16"
		finish_time: "17:00:00"
		internet_course_article_id: "736"
		internet_location_article_id: "0"
		internet_location_name: "Ogoxuhap Edahuy-Liwoweraqinu"
		start_date: "2016-02-15"
		start_time: "09:00:00"
		test: "0"*/
	},function(response) {$scope.nextEvents = 'Fehler in eventCtrl-$http: '+response}
	)

}]);












</script>