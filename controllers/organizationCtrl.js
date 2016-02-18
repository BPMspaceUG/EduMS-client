<script  type="text/javascript">
app.controller('organizationCtrl', ['$scope','$http', function ($scope, $http) {	
	$http.get('/EduMS/api/index.php/'+bname+'/'+pw+'/getOrganization')
	.then(function(response) {
		/* Beispiel:
		address_line_1: "Landaubogen", address_line_2: "1", city: "München", contact_url: 
		"mitsm.de", country: "Deutschland", organization_id: "1", organization_name: "mITsm", state: "bay", zip: "89999" */ 
		
		$scope.organization = response.data;
		console.log('organizations: '); console.log($scope.organization);
	},function(response) {$scope.organization = 'Fehler in organizationCtrl-$http: '+response}
	)
}]);
</script>