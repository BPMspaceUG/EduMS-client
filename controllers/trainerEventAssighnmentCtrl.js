<script  type="text/javascript">
app.controller('trainerEventAssignmentCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getTrainerEventAssignment')
	.then(function(response) {
		$scope.trainerEventAssignment = response.data;
		console.log('trainerEventAssignments: '); console.log($scope.trainerEventAssignment);
	},function(response) {$scope.statusTrainer = 'Fehler in trainerEventAssignmentCtrl-$http: '+response}
	)
}]);
</script>