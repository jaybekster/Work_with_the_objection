var person=data.clients[0]

var app = angular.module('ng').controller('Persons', function($scope, $element) {
	$scope.person = person;
	$scope.person.objections = data.objections.filter(function(obj, i) {
			return person.objections_list.indexOf(obj.id)>-1
		})
})

app.controller("Questions", function($scope) {
	$scope.questions = data.questions;
	$scope.questionsQuestionsClick = function($e, $attr) {
		// if ( angular.element($e.toElement).hasClass("questions question") ) {
			 
		// }
	}
}).directive("questionsQuestion", function() {
	return {
		restrict: 'C',
		link: function($scope, $element, $attr) {
			$element.click(function(e) {
				e.preventDefault();
				console.log(e)
			})
		}
	}
})


$(function() {

	$("#menu").on("click", "a", function(e) {
		e.preventDefault();
		var attr = $(this).attr("href");
		$( "#" + attr.substr(1, attr.length) ).show().siblings("div").hide();
	})

})

