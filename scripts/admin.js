var person=data.clients[0]

var app = angular.module('ng').controller('Persons', function($scope, $element) {
	$scope.person = person;
	$scope.person.objections = data.objections.filter(function(obj, i) {
			return person.objections_list.indexOf(obj.id)>-1
		})
	console.log($scope.person)
})




app.controller("Questions", function($scope) {
	$scope.questions = data.questions;
})