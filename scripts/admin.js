var person={id: 1,
		name: "name",
		loyalty: 4,
		//objections_list: [2,1,3,4],
		objections_list: [1,2,3,4],
		introduction_text: "intro_text",
		closing_text: "closing_text",
		final_questions: [1,2,3,4],
		right_final_question: 1,
		right_closing_text: "right_closing_text",
		wrong_closing_text: "wrong_closing_text"
	}

var app = angular.module('ng').controller('Person', function($scope, $element) {
	$scope.person = person;
})