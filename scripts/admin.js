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
        when("/persons/:pId", {controller: "Persons", templateUrl: "persons.html"}).
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

app.controller("Persons", function($scope, $routeParams, theService) {
	$scope.person_id = $routeParams.pId || undefined;
	$scope.clients = theService.data.clients;
	$scope.person = theService.data.clients.filter(function(obj, i) { if (obj.id==$scope.person_id) {return obj} })[0]
	$scope.model = {
		id: $scope.person_id,
		name: $scope.person ? $scope.person.name : null,
		photo: $scope.person ? $scope.person.photo : null,
		loyalty: $scope.person ? $scope.person.loyalty : null,
		objections: $scope.person ? $scope.person.objections_list.map(function(obj1,i1) { return theService.data.objections.filter(function(obj2, i2) { return obj2.id==obj1 } )[0] }).filter(function(obj){ return obj }) : null,
		questions: []
	}
	$scope.getQuestions = function(objection_id) {
		var objection = theService.data.objections._find('id', objection_id);

		$scope.model.questions = objection.question_list.map(function(id) {
			var ques = theService.data.questions._find('id', id);
			if (ques) return ques;
		})
	}
})



app.value("values", {
	searchObjection: "",
	searchQuestion: ""
});


app.controller("Questions", function($scope, $filter, $routeParams, theService, values, $location) {
	$scope.search = {
		text: values.searchQuestion
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

app.controller("Objections", function($scope, $filter, $routeParams, theService) {
	$scope.oId = $routeParams.oId || false;
	$scope.objections = theService.data.objections;
	$scope.questions = theService.data.questions;
	$scope.objection = $scope.objections._find("id", $scope.qId) || {
		id: "",
		text: "",
		questions: []
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
		if (newValue===undefined || newValue===false) return $scope.objection = {
			id: "",
			text: "",
			questions: []
		}
		$scope.objection = $scope.objections._find("id", newValue)
		if (!$scope.objection) return false;
		$scope.objection.questions = $scope.objection.question_list.length>0 ? $scope.objection.question_list.map(function(obj1,i1) { return theService.data.questions.filter(function(obj2, i2) { return obj2.id==obj1 } )[0] }).filter(function(obj){ return obj }) : [];
	})
})