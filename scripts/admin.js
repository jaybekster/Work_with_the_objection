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
			iElement.find('input').bind('keyup', function(e) {
				var key_code = e.which || e.keyCode;
				if (key_code===27) {
					this.blur();
				}
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
			iElement.find('textarea').bind('keyup', function(e) {
				var key_code = e.which || e.keyCode;
				if (key_code===27) {
					this.blur();
				}
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
		templateUrl: 'templates/admin.clients.html',
		resolve: {
			myApp: function($route, $routeParams) {
				$route.current.params.client_id = parseInt($route.current.params.client_id, 10);
				return;
			}
		}
	}).when('/objections', {
		templateUrl: 'templates/admin.objections.html'
	}).when('/objections/:objection_id', {
		templateUrl: 'templates/admin.objections.html',
		resolve: {
			myApp: function($route, $routeParams) {
				$route.current.params.objection_id = parseInt($route.current.params.objection_id, 10);
				return;
			}
		}
	}).when('/questions', {
		templateUrl: 'templates/admin.questions.html'
	}).when('/questions/:question_id', {
		templateUrl: 'templates/admin.questions.html',
		resolve: {
			myApp: function($route, $routeParams) {
				$route.current.params.question_id = parseInt($route.current.params.question_id, 10);
				return;
			}
		}
	}).when('/final_questions', {
		templateUrl: 'templates/admin.final_questions.html'
	}).when('/final_questions/:question_id', {
		templateUrl: 'templates/admin.final_questions.html',
		resolve: {
			myApp: function($route, $routeParams) {
				$route.current.params.question_id = parseInt($route.current.params.question_id, 10);
				return;
			}
		}
	}).when('/settings', {
		templateUrl: 'templates/admin.settings.html'
	})
}])

myApp.controller('Clients', ['$scope', 'Data', '$routeParams', '$location', function($scope, Data, $routeParams, $location) {
	$scope.modal = {
		is_visible: false,
		big_data: null,
		tiny_data: null,
		toggle: function(big_data, tiny_data) {
			this.is_visible = !this.is_visible;
			if ( this.is_visible ) {
				this.big_data = big_data;
				this.backup_data = '$scope.'+tiny_data;
				this.tiny_data = angular.copy(eval(this.backup_data));
			}
			return this.is_visible;
		},
		save: function() {
			eval(this.backup_data+'=this.tiny_data');
			console.log( eval(this.backup_data) )
		}
	}
	$scope.last_ids = Data.settings.last_ids;
	$scope.loyalties = Data.settings.loyalty_range;
	$scope.clients = Data.clients;
	$scope.objections = Data.objections;
	$scope.final_questions = Data.final_questions;
	$scope.current_client =  Data.clients[0];
	$scope.add = function() {
		$scope.current_client = {
			id: $scope.last_ids.clients+=1,
			name: "",
			avatar: null,
			closing_text: "",
			final_questions: [],
			right_final_question: null,
			right_closing_text: "",
			wrong_closing_text: "",
			objection_list: []
		};
		$scope.clients.push($scope.current_client);
		return $scope.current_client;
	}
	$scope.delete = function() {
		var client_id = $scope.current_client.id;
		var index = $scope.clients._find($scope.current_client.id, 'id');
		$scope.clients.splice(index, 1);
		if ( !$scope.clients.length ) {
			$scope.add();
		} else {
			$location.path( '/clients/' + ($scope.clients[index-1] ? $scope.clients[index-1].id : $scope.clients[index].id) );
		}
	}
	if ( $routeParams.client_id ) {
		if ( $scope.clients._find($routeParams.client_id, 'id')!==-1 ) {
			$scope.current_client = $scope.clients[$scope.clients._find($routeParams.client_id, 'id')];
		} else {
			$scope.add();
		}
	}
}])

myApp.controller('Objections', ['$scope', 'Data', '$routeParams', '$location', function($scope, Data, $routeParams, $location) {
	$scope.modal = {
		is_visible: false,
		big_data: null,
		tiny_data: null,
		toggle: function(big_data, tiny_data) {
			this.is_visible = !this.is_visible;
			if (this.is_visible) {
				this.big_data = big_data;
				this.backup_data = '$scope.'+tiny_data;
				this.tiny_data = angular.copy(eval(this.backup_data));
			}
			return this.is_visible;
		},	
		save: function() {
			eval(this.backup_data+'=this.tiny_data');
		}
	}
	$scope.last_ids = Data.settings.last_ids;
	$scope.questions = Data.questions;
	$scope.types = Data.settings.question_types;
	$scope.objections = Data.objections;
	$scope.current_objection = $scope.objections[0];
	$scope.add = function() {
		$scope.current_objection = {
			id: $scope.last_ids.objections+=1,
			type: null,
			text: '',
			question_list: [],
			right_answer: null,
			right_comment: '',
			wrong_comment: ''
		}
		$scope.objections.push( $scope.current_objection );
		return $scope.current_objection;
	}
	$scope.delete = function() {
		var objection_id = $scope.current_objection.id;
		var index = $scope.objections._find($scope.current_objection.id, 'id');
		$scope.objections.splice(index, 1);
		if ( !$scope.objections.length ) {
			$scope.add();
		} else {
			$location.path( '/objections/' + ($scope.objections[index-1] ? $scope.objections[index-1].id : $scope.objections[index].id) );
		}
	}
	if ( $routeParams.objection_id ) {
		if ( $scope.objections._find($routeParams.objection_id, 'id')!==-1 ) {
			$scope.current_objection = $scope.objections[$scope.objections._find($routeParams.objection_id, 'id')];
		} else {
			$scope.add();
		}
	}
}])

myApp.controller('Questions', ['$scope', 'Data', '$routeParams', '$location', function ($scope, Data, $routeParams, $location) {
	$scope.last_ids = Data.settings.last_ids;
	$scope.questions = Data.questions;
	$scope.types = Data.settings.question_types;
	$scope.current_question = $scope.questions[0];
	$scope.add = function() {
		$scope.current_question = {
			id: $scope.last_ids.questions+=1,
			text: '',
			wrong_answer_type: null
		}
		$scope.questions.push( $scope.current_question );
		return $scope.current_question;
	}
	$scope.delete = function() {
		var question_id = $scope.current_question.id;
		var index = $scope.questions._find($scope.current_question.id, 'id');
		$scope.questions.splice(index, 1);
		if ( !$scope.questions.length ) {
			$scope.add();
		} else {
			$location.path( '/questions/' + ($scope.questions[index-1] ? $scope.questions[index-1].id : $scope.questions[index].id) );
		}
	}
	if ( $routeParams.question_id ) {
		if ( $scope.questions._find($routeParams.question_id, 'id')!==-1 ) {
			$scope.current_question = $scope.questions[$scope.questions._find($routeParams.question_id, 'id')];
		} else {
			$scope.add();
		}
	}
}])

myApp.controller('Final_Questions', ['$scope', 'Data', '$routeParams', '$location', function ($scope, Data, $routeParams, $location) {
	$scope.last_ids = Data.settings.last_ids;
	$scope.questions = Data.final_questions;
	$scope.types = Data.settings.question_types;
	$scope.current_question = $scope.questions[0];
	$scope.add = function() {
		$scope.current_question = {
			id: $scope.last_ids.questions+=1,
			text: '',
			wrong_answer_type: null
		}
		$scope.questions.push( $scope.current_question );
		return $scope.current_question;
	}
	$scope.delete = function() {
		var question_id = $scope.current_question.id;
		var index = $scope.questions._find($scope.current_question.id, 'id');
		$scope.questions.splice(index, 1);
		if ( !$scope.questions.length ) {
			$scope.add();
		} else {
			$location.path( '/questions/' + ($scope.questions[index-1] ? $scope.questions[index-1].id : $scope.questions[index].id) );
		}
	}
	if ( $routeParams.question_id ) {
		if ( $scope.questions._find($routeParams.question_id, 'id')!==-1 ) {
			$scope.current_question = $scope.questions[$scope.questions._find($routeParams.question_id, 'id')];
		} else {
			$scope.add();
		}
	}
}])

myApp.controller('Settings', ['$scope', 'Data', function ($scope, Data) {
	$scope.settings = Data.settings;
}])