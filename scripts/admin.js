var myApp = angular.module('myApp', []);

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
			model: "=autoinput"
		},
		template: "<div><span>{{model}}</span><input type=\"text\" ng-model=\"model\"></div>"
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
			model: "=autotextarea"
		},
		template: "<div><span>{{model}}</span><textarea type=\"text\" ng-model=\"model\"></div>"
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
				return f.id===obj1;
			})
			if (temp.length===1) return temp[0];
		})
	})
	console.info(copied_data);
	return copied_data;
}])

function Clients($scope, Data) {
	$scope.clients = Data.clients;
	$scope.current_client = Data.clients[0];
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
}

function Objections($scope, Data) {
	$scope.objections = Data.objections;
}

function Questions($scope, Data) {
	$scope.questions = Data.questions;
}