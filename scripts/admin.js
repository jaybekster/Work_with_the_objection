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







app.controller("Questions", function($scope, $filter) {


	$scope.questions = data.questions;
	$scope.types = data.settings.question_types;
	$scope.question = {
		id: "",
		text: "",
		wrong_answer_type: ""
	}
	$scope.add = function() {
		$scope.questions.push({
			id: $scope.questions[$scope.questions.length-1].id+1,
			text: $scope.question.text,
			wrong_answer_type: $scope.question.wrong_answer_type
		})
	}
	$scope.cancel = function() {
	}
	$scope.delete = function() {
		$scope.questions.splice($scope.question_index, 1);
	}
	$scope.$watch("questions.length", function(newValue, oldValue) {
		if (newValue<oldValue) {
			if ($scope.question_index===0) $scope.question = $scope.questions[0];
		}
		if (newValue>oldValue) $scope.question_index = newValue-1;
	})
	$scope.$watch("question_index", function(newValue, oldValue) {
		if (newValue===undefined) return false;
		$scope.question = $scope.questions[newValue];
	})
	$scope.search = function(property, index) {
		if ( $scope.questions[index][property].search( new RegExp($scope.searchText, "i") )!==-1 ) return true;
	}
})

app.controller("Objections", function($scope, $element) {
	$scope.objections = data.objections;
	$scope.model = {
		objection: {
			id: function() {
				return data.objections[data.objections.length-1].id
			}(),
			text: ""
		},
		questions: "Список вопросов"
	}
	$scope.delete = function() {
		$scope.objections.splice($scope.objection_index--, 1);
	}
	$scope.save = function() {
		if (!$scope.model.objection) return false;
	}
	$scope.cancel = function() {
		$scope.model = angular.copy($scope.initial);
	}
	$scope.$root.objections = $scope.model.objections;
	$scope.add = function() {
		$scope.objections.push({
			id: $scope.model.objection.id+=1,
			text: $scope.model.objection.text
		})

	}
	$scope.$watch("objection_index", function(newValue, oldValue) {
		$scope.model.objection = $scope.objections[newValue];
	})
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