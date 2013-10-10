Array.prototype._find = function(property, value, pos) {
	if (!this.length) return false;
	var indexes = [];
	var objects = this.filter(function(obj, i) {
		if (obj[property]==value) {
			indexes.push(i);
			return obj
		}
	})
	if (pos && objects[0]) return indexes[0];
	return objects[0] || null;
}

var person=data.clients[0]

var app = angular.module('ng')

app.config(function ($routeProvider) {
    $routeProvider.
        when("/questions", {controller:"Questions", templateUrl: "questions.html"}).
        when("/objections", {controller: "Objections", templateUrl: "objections.html"}).
        when("/objections/:oId", {controller: "Objections", templateUrl: "objections.html"}).
        when("/persons", {controller: "Persons", templateUrl: "persons.html"}).
        when("/persons/:person_id", {controller: "Persons", templateUrl: "persons.html"}).
        when("/questions/:qId", {controller: "Questions", templateUrl: "questions.html"}).
        otherwise({redirectTo : "/persons"});
}).value('$anchorScroll', angular.noop);

app.run( function($rootScope, $location) {
	$rootScope.Questions = {};
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {

	})
})

app.factory('theService', function() {
    return {
    	// data : angular.copy( data )
    	data : angular.copy( data )
    };
});

app.controller("Tabs", function($scope) {
	$scope.setActive = function setActive($e) {
		angular.element($e.target).parent().parent().find(".active").removeClass("active");
		angular.element($e.target).addClass("active");
	}
})

app.value("values", {
	searchObjection: "",
	searchQuestion: "",
	selected_question: null,
	selected_objection: null,
	selected_person: null
});

app.controller("Persons", function($scope, $routeParams, theService, values) {
	var data = $scope.data = theService.data;
	if (values.selected_person && !$routeParams.person_id && theService.data.clients._find('person_id', values.selected_person)) {
		$location.path('/persons/'+values.selected_person);
	}
	$scope.person_id = $routeParams.person_id || undefined;
	$scope.clients = data.clients;
	$scope.$watch('person_id', function(newValue, oldValue) {
		if ($scope.person_id===undefined) return false;
		values.selected_person = newValue;
		$scope.person = data.clients._find('id', $scope.person_id);
		$scope.objections = $scope.person.objection_list.map(function(id, ind1) {
			return data.objections.filter(function(obj, ind2) {
				return obj.id===id;
			})[0]
		})
	})
	$scope.$watch('person.objection_list', function(newValue, oldValue) {
		if (newValue===undefined) return false;
		$scope.objections = $scope.person.objection_list.map(function(id, ind1) {
			return data.objections.filter(function(obj, ind2) {
				return obj.id===id;
			})[0]
		})
	}, true)
	$scope.getQuestions = function(objection_id) {
		var objection = data.objections._find('id', objection_id);
		$scope.questions = objection.question_list.map(function(id) {
			var ques = data.questions._find('id', id);
			if (ques) return ques;
		})
	}
	$scope.updateObjectionList = function($e, id) {
		var checkbox = $e.target,
				action = (checkbox.checked ? 'add' : 'remove');
		if (action==='add') {
			$scope.person.objection_list.push(id);
		} else {
			console.log(1)
			$scope.person.objection_list.splice( $scope.person.objection_list.indexOf(id), 1 );
		}
	}
})

app.controller("Questions", function($scope, $filter, $routeParams, theService, values, $location) {
	$scope.search = {
		text: values.searchQuestion
	}
	if (values.selected_question && !$routeParams.qId && theService.data.questions._find('id', values.selected_question)) {
		$location.path('/questions/'+values.selected_question);
	}
	$scope.qId = $routeParams.qId || undefined;
	$scope.questions = theService.data.questions;
	$scope.types = theService.data.settings.question_types;
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
	$scope.save = function() {
		data.questions._find("id", $scope.qId).text = $scope.question.text;
		data.questions._find("id", $scope.qId).type = $scope.question.type;
		$scope.$parent['isChanged_'+$scope.qId] = false;
	}
	$scope.cancel = function() {
	}
	$scope.delete = function() {
		$scope.questions.splice($scope.questions._find("id", $scope.qId, true), 1);
	}
	$scope.$watch("qId", function(newValue, oldValue) {
		if (newValue===undefined) return false;
		$scope.question = $scope.questions.filter(function(obj, i) {
			values.selected_question = newValue;
			return obj.id==newValue
		})[0]
	})
	$scope.$watch("search.text", function(newValue, oldValue) {
		values.searchQuestion = newValue;
	})
	$scope.$watch("question", function(newValue, oldValue) {
		if (!newValue.id) return false;
		var question = data.questions._find("id", newValue.id);
		for (i in question) {
			if (i==="id" || !newValue.hasOwnProperty(i)) continue;
			if (newValue[i]!==question[i] && newValue.id===question.id) {
				$scope.$parent['isChanged_'+newValue.id] = true;
				return false;
			}
			$scope.$parent['isChanged_'+newValue.id] = false;
		}
	}, true)
	$scope.getClass = function (qId) {
		if ($location.path()==='/questions/'+qId) {
			return 'selected'
		}
	};
})

app.controller("Objections", function($scope, $filter, $routeParams, theService, values, $location) {
	if (values.selected_objection && !$routeParams.oId && theService.data.questions._find('id', values.selected_objection)) {
		$location.path('/objections/'+values.selected_objection);
	}
	$scope.oId = $routeParams.oId || false;
	$scope.objections = theService.data.objections;
	$scope.questions = theService.data.questions;
	$scope.objection = $scope.objections._find("id", $scope.qId) || {
		id: "",
		text: "",
		questions: [],
		question_list: []
	}
	$scope.delete = function() {
		if ($scope.oId === false) return false;
		$scope.objections.splice($scope.objections._find("id", $scope.oId, true), 1);
		$scope.oId = false;
	}
	$scope.save = function() {
		if (!$scope.model.objection) return false;
	}
	$scope.cancel = function() {
		$scope.model = angular.copy($scope.initial);
	}
	$scope.add = function() {
		$scope.objections.push({
			id: $scope.objections[$scope.objections.length-1].id,
			text: $scope.objection.text
		})

	}
	$scope.$watch("oId", function(newValue, oldValue) {
		values.selected_objection = newValue;
		if (newValue===undefined || newValue===false) return $scope.objection = {
			id: "",
			text: "",
			questions: [],
			question_list: []
		}
		$scope.objection = $scope.objections._find("id", newValue)
		if (!$scope.objection) return false;
		$scope.objection.questions = $scope.objection.question_list.length>0 ? $scope.objection.question_list.map(function(obj1,i1) { return theService.data.questions.filter(function(obj2, i2) { return obj2.id==obj1 } )[0] }).filter(function(obj){ return obj }) : [];
	})
	$scope.$watch("objection.question_list", function(newValue, oldValue) {
		if (!$scope.objection) return false;
		$scope.objection.questions = $scope.objection.question_list.length>0 ? $scope.objection.question_list.map(function(obj1,i1) { return $scope.questions.filter(function(obj2, i2) { return obj2.id==obj1 } )[0] }).filter(function(obj){ return obj }) : [];
	}, true)
	$scope.$watch("question_list_backup", function(newValue, oldValue) {
		console.log($scope.question_list_backup)
	}, true)
	$scope.updateQuestionList = function($e, id) {
		var checkbox = $e.target,
			action = (checkbox.checked ? 'add' : 'remove');
		if (action==='add') {
			$scope.objection.question_list.push(id);
		} else {
			$scope.objection.question_list.splice( $scope.objection.question_list.indexOf(id), 1 );
		}
	}
})