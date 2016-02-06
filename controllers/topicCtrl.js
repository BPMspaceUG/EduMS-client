<script  type="text/javascript">

/*Das angular.module initialisiert Angular*/

/*Ein controller wird für einen bestimmten Sinnabschnitt innerhalb von Angular definiert*/
app.controller('topicCtrl', ['$scope','$http', function ($scope, $http) {
	//Der $http.get-service läd Ressourcen nach 	
	allTopics=$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getTopics')
	.then(function(response) {//wenn angeforderte Daten empfangen wurden...
		$scope.topics = response.data.topiclist;
		//HTML5 3.2.3.1: Das id-Attribut darf kein Leerzeichen enthalten deshalb wird der topic_name nach name_raw kopiert u. anschließend die Leerzeichen entfernt
			for (var i = 0; i < $scope.topics.length; i++) {
				$scope.topics[i].topic_name_raw = $scope.topics[i].topic_name;			
				$scope.topics[i].topic_nr = i;			
				$scope.topics[i].topic_name = $scope.topics[i].topic_name.replace(/\s+/g,'');//löscht alle Leerzeichen			
			};
		console.log('getTopics: '); console.log($scope.topics);
	},function(response) {$scope.topics = 'Fehler in topicCtrl-$http: '+response}
	)
}]);
</script>