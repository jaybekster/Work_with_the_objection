var person=data.clients[0]

var app = angular.module('ng')

app.controller('Persons', function($scope, $element) {
	function updateObjection(objections) {
		var objections = objections || data.objections;
		return objections.filter(function(obj, i) {
			return $scope.objections_list[obj.id]
		})
	}
	$scope.model = person;
	$scope.id = person.id;
	$scope.name = person.name;
	$scope.objections_list = (function() {
		var objections_list = {};
		person.objections_list.forEach(function(obj) {
			objections_list[obj] = true;
		})
		return objections_list;
	})()
	$scope.objections = updateObjection();
	$scope.modal = function(event) {
		$("#modal_dialog").show();
	}
	$scope.$watch('objections_list', function(newValue, oldValue) {
		$scope.objections = data.objections.filter(function(obj, i) {
			return newValue[obj.id]
		})
	}, true)
	$scope.$root.$watch("objections", function(newValue, oldValue) {
		$scope.objections = updateObjection(newValue)
	}, true)
}).directive('habra', function() {
	return {
		template: "<ul ng-model='modelll'><li ng-repeat='i in _objections'><label><input type='checkbox' value='{{i.id}}' ng-model='objections_list[i.id]' ng-checked='objections_list[i.id]'>{{i.text}}</label></li></ul>",
		link: function($scope, element, attrs) {
			$scope._objections = data.objections;
		}
	}
}).directive("textarea", function() {
	var counter = 0;
	return {
		restrict: "C",
		scope: {
			text: '=ngModel'
		},
		template: "<label ng-show='edit_is_hidden'><input type='checkbox' ng-click='edit_is_hidden=!edit_is_hidden' style='display: none;'><div>{{text}}</div></label>" +
			"<span><textarea ng-model='text' ng-hide='edit_is_hidden'></textarea><button ng-click='edit_is_hidden=!edit_is_hidden'>Сохранить</button></span>",
		compile: function compile(templateElement, templateAttrs) {
			return function(scope, element, attrs) {
				scope.edit_is_hidden = true;
			}
        },
	}
})







app.controller("Questions", function($scope) {
	function findById(id) {
		var questions = null;
		if ( questions = $scope.model.questions.filter(function(obj) {
			return obj.id===id;
		}) ) {
			return questions[0];
		}
	}
	$scope.model = {
		questions: data.questions,
		types: data.settings.question_types
	}
	$scope.initial = angular.copy($scope.model);
	$scope.editQuestion = function(question, $e) {
		// var element = angular.element($.toElement)
	}
	// $scope.saveQuestion = function() {
	// 	var question = findQuestionById($scope.id);
	// }
	$scope.cancel = function() {
		$scope.model = angular.copy($scope.initial);
	}
	$scope.delete = function() {
		if (!$scope.model.questions) return false;
		$scope.model.questions.splice( findById($scope.model.questions.id), 1 );
	}
})

app.controller("Objections", function($scope, $element) {
	function updateQuestions(questions, objections) {
		var questions = questions || data.questions;
		var objections = objections || $scope.objections;
		objections.forEach(function(obj, i) {
			obj.questions = [];
			obj.question_list.forEach(function(id) {
				obj.questions.push(
					questions.filter(function(question) {
						return question.id===id;
					})[0]
				)
			})
		})


	}
	$scope.model = {
		objections: data.objections,
		objection: null,
		questions: updateQuestions(null, data.objections)
	}
	console.log()

	$scope.initial = angular.copy($scope.model)
	function findById(id) {
		var result = $scope.model.objections.filter(function(obj,i) {
			return obj.id===id;
		})
		if (result) return result[0];
	}
	$scope.delete = function() {
		if (!$scope.model.objection) return false;
		$scope.model.objections.splice( findById($scope.model.objection.id), 1 );
	}
	$scope.save = function() {
		if (!$scope.model.objection) return false;

	}
	$scope.cancel = function() {
		$scope.model = angular.copy($scope.initial);
	}
	$scope.$root.objections = $scope.model.objections;
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