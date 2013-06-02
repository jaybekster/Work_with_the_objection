var person=data.clients[0]

var app = angular.module('ng').controller('Persons', function($scope, $element) {
	$scope.id = person.id;
	$scope.name = person.name;
	$scope.objections_list = (function() {
		var objections_list = {};
		person.objections_list.forEach(function(obj) {
			objections_list[obj] = true;
		})
		return objections_list;
	})()
	$scope.objections = data.objections.filter(function(obj, i) {
			return $scope.objections_list[obj.id]
	})
	$scope.modal = function(event) {
		$("#modal_dialog").show();
	}
	$scope.$watch('objections_list', function(newValue, oldValue) {
		$scope.objections = data.objections.filter(function(obj, i) {
			return newValue[obj.id]
		})
	}, true)
}).directive('habra', function() {
	return {
		template: "<ul ng-model='modelll'><li ng-repeat='i in _objections'><label><input type='checkbox' value='{{i.id}}' ng-model='objections_list[i.id]' ng-checked='objections_list[i.id]'>{{i.text}}</label></li></ul>",
		link: function($scope, element, attrs) {
			$scope._objections = data.objections;
		}
	}
})







app.controller("Questions", function($scope) {
	function findQuestionById(id) {
		var questions = null;
		if ( questions = $scope.questions.filter(function(obj) {
			return obj.id===id;
		}) ) {
			return questions[0];
		}
	}
	$scope.questions = data.questions;
	$scope.types = data.settings.question_types;
	// $scope.saveQuestion = function() {
	// 	var question = findQuestionById($scope.id);
	// }
})
app.controller("Objections", function($scope, $element) {
	$scope.objections = data.objections;
})

$(function() {

	$("#menu").on("click", "a", function(e) {
		e.preventDefault();
		var attr = $(this).attr("href");
		$( "#" + attr.substr(1, attr.length) ).show().siblings("div").hide();
	})
	$(".close").on("click", function() {
		$(this).closest("#modal_dialog").hide();
	})
})