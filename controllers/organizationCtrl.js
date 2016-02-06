<script  type="text/javascript">
app.controller('organizationCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getOrganization')
	.then(function(response) {
		$scope.organization = response.data;
		console.log('organizations: '); console.log($scope.organization);
	},function(response) {$scope.organization = 'Fehler in organizationCtrl-$http: '+response}
	)
}]);
</script>