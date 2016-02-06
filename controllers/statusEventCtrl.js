<script  type="text/javascript">
app.controller('statusEventCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getStatusEvent')
	.then(function(response) {
		$scope.statusEvent = response.data;
		console.log('statusEvents: '); console.log($scope.statusEvent);
	},function(response) {$scope.statusEvent = 'Fehler in statusEventCtrl-$http: '+response}
	)
}]);
</script>