Array.prototype._find = function(value, property) {
	var index = this.map(function(obj, ind) {
		return (property ? obj[property] : obj);
	}).indexOf(value);
	return index;
}

Array.prototype._change = function(obj, property) {
	var index = this._find(obj[property], property);
	if (index==-1) {
		this.push(obj);
	} else {
		this.splice(index, 1);
	}
}

var myApp = angular.module('myApp', ['ngRoute']);

myApp.directive('autoinput', [function () {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			iElement.find('input').css('display', 'none');
			iElement.bind('click', function() {
				iElement.find('span').css('display', 'none');
				iElement.find('input').css('display', 'block');
				iElement.find('input')[0].focus();
			})
			iElement.find('input').bind('blur', function() {
				iElement.find('input').css('display', 'none');
				iElement.find('span').css('display', 'block');
			})
		},
		scope: {
			model: "=autoinput",
			placeholder: "@placeholder"
		},
		template: "<span>{{model.length>0 && model || placeholder}}</span><input type=\"text\" ng-model=\"model\" placeholder=\"{{placeholder}}\">"
	};
}])

myApp.directive('autotextarea', [function () {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			iElement.find('textarea').css('display', 'none');
			iElement.bind('click', function() {
				iElement.find('span').css('display', 'none');
				iElement.find('textarea').css('display', 'block');
				iElement.find('textarea')[0].focus();
			})
			iElement.find('textarea').bind('blur', function() {
				iElement.find('textarea').css('display', 'none');
				iElement.find('span').css('display', 'block');
			})
		},
		scope: {
			model: "=autotextarea",
			placeholder: "@placeholder"
		},
		template: "<span>{{model.length>0 && model || placeholder }}</span><textarea ng-model=\"model\" placeholder=\"{{placeholder}}\">"
	};
}])

myApp.factory('Data', [function () {
	var copied_data = angular.copy(data);
	copied_data.clients.forEach(function(obj, ind) {
		obj.final_questions = obj.final_questions.map(function(obj1, ind1){
			var temp = copied_data.final_questions.filter(function(f, indf) {
				return f.id===obj1;
			})
			if (temp.length===1) return temp[0];
		})
		obj.objection_list = obj.objection_list.map(function(obj1, ind1){
			var temp = copied_data.objections.filter(function(f, indf) {
				return f.id===obj1;
			})
			if (temp.length===1) return temp[0];
		})
	})
	copied_data.objections.forEach(function(obj, ind) {
		obj.question_list = obj.question_list.map(function(obj1, ind1) {
			var temp = copied_data.questions.filter(function(f, indf) {
				return f.id==obj1;
			})
			if (temp.length===1) return temp[0];
		})
	})
	return copied_data;
}])

myApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/clients', {
		templateUrl: 'templates/admin.clients.html'
	}).when('/clients/:client_id', {
		templateUrl: 'templates/admin.clients.html'
	}).when('/objections', {
		templateUrl: 'templates/admin.objections.html'
	}).when('/objections/:objection_id', {
		templateUrl: 'templates/admin.objections.html'
	}).when('/questions', {
		templateUrl: 'templates/admin.questions.html'
	})
}])

myApp.controller('Clients', function($scope, Data, $routeParams) {
	var temp = null;
	$scope.clients = Data.clients;
	$scope.objections = Data.objections;
	$scope.current_client =  Data.clients[0];
	$scope.add = function() {
		return $scope.current_client = {
			id: $scope.clients[$scope.clients.length-1].id+1,
			name: "",
			loyalty: undefined,
			objection_list: [],
			introduction_text: "",
			closing_text: "",
			final_questions: [],
			right_final_question: undefined,
			right_closing_text: "",
			wrong_closing_text: ""
		};
	}
	$scope.delete = function() {
		var client_id = $scope.current_client.id;
		var client = $scope.clients.map(function(obj, ind) {
			if (obj.id === client_id) return ind;
		}).filter(function(obj, ind) {
			return obj!==undefined;
		});
		if (client.length === 1) {
			$scope.clients.splice(client[0], 1);
		}
	}
	$routeParams.client_id = parseInt($routeParams.client_id, 10);
	if ( $routeParams.client_id!==undefined && typeof $routeParams.client_id==='number' ) {
		temp = $scope.clients._find($routeParams.client_id, 'id');
		if ( temp!==-1 ) {
			$scope.current_client = $scope.clients[temp];
		} else {
			$scope.add();
		}
	}
})

myApp.controller('Objections', function($scope, Data, $routeParams) {
	$scope.questions = Data.questions;
	$scope.types = Data.settings.question_types;
	$scope.objections = Data.objections;
	$scope.current_objection = $scope.objections[0];
	// if ( $routeParams.objection_id!==undefined && (typeof parseInt($routeParams.objection_id, 10)==='number') && $scope.objections._find($routeParams.objection_id, 'id') ) {
	// 	$scope.current_objection = $scope.objections._find($routeParams.objection_id, 'id');
	// }
	$scope.findId = function(id, model) {
		var model = model || $scope.current_objection.question_list;
		var index = 0;
		if (model.filter(function(obj, ind) {
			if (obj.id == id) index = ind;
			return obj.id == id;
		}).length===1) {
			return index;
		} else {
			return false;
		}
	}
	$scope.$watch('modal_dialog', function(newValue, oldValue) {
		if (newValue == true) {
			$scope.model = angular.copy($scope.current_objection);
		}
	})
	$scope.changeQuestionList = function(question, model) {
		var index = $scope.findId(question.id, model.question_list);
		if ( index === false ) {
			model.question_list.push(question);
		} else {
			model.question_list.splice(index, 1);
		}
	}
})

function Questions($scope, Data) {
	$scope.questions = Data.questions;
	$scope.types = Data.settings.question_types;
	$scope.current_question = $scope.questions[0];
}