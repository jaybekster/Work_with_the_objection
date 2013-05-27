var person=data.clients[0]

var app = angular.module('ng').controller('Persons', function($scope, $element) {
	$scope.person = person;
	$scope.person.objections = data.objections.filter(function(obj, i) {
			return person.objections_list.indexOf(obj.id)>-1
		})
	$scope.modal = function(event) {
		$("#modal_dialog").show();
	}
}).directive('habra', function() {
	return {
		restrict: "A",
		compile: function compile(templateElement, templateAttrs) {
			return  {
				pre: function($scope, element, attrs) {
					$scope.objections = data.objections;
					templateElement.html("<ul>"+$scope.objections.map(function(obj,i) { return "<li habra='11'>"+obj.text+"</li>" }).join("")+"</ul>");
					console.log(  $(templateElement).css("width")  )
				},
				post: function($scope, element, attrs) {
					$scope.getModalDialogStyle = function($scope, element) {
						console.log(12)
					}
					// templateElement.html("<div>{{person.id}}</div>");
				}
			}
		},
		template: "<input type='text' value='value'>",
		link: function($scope, element, attrs) {


			console.log(3)
		}
	}
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
app.controller("Objections", function($scope, $element) {
	$scope.objections = data.objections;
})

$(function() {

	$("#menu").on("click", "a", function(e) {
		e.preventDefault();
		var attr = $(this).attr("href");
		$( "#" + attr.substr(1, attr.length) ).show().siblings("div").hide();
	})

})

