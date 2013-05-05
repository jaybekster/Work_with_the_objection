data = {
	objections: [
		{
			id: 1,
			type: "reason",
			text: "На самом деле, у меня уже есть аналогичный продукт другого Банка, Ваш мне не нужен",
			question_list: [1, 2, 3, 4],
			right_answer: 1,
			right_comment: "",
			wrong_comment: ""
		}, {
			id: 2,
			type: "excuse",
			text: "Мне это не нужно, я оплачиваю коммунальные платежи по другому",
			question_list: [1, 2, 3, 4],
			right_answer: 1,
			right_comment: "",
			wrong_comment: ""
		}, {
			id: 3,
			type: "vexation",
			text: "Нет, меня в Вашем Банке всегда обманывают, и банкоматы у Вас всегда не работают!",
			question_list: [1, 2, 3, 5],
			right_answer: 5,
			right_comment: "",
			wrong_comment: ""
		}, {
			id: 4,
			type: "excuse",
			text: "У меня дома нет интернета, мне этот продукт не интересен",
			question_list: [1, 6, 7, 8],
			right_answer: 1,
			right_comment: "",
			wrong_comment: ""
		}
	],
	clients: [{
		id: 1,
		name: "Иванов Иван Иванович",
		loyalty: 4,
		//objections_list: [2,1,3,4],
		objections_list: [1,2,3,4],
		introduction_text: "Приобретая нашу карту \"Банк в кармане\" Вы сможете оплачивать коммунальные платежи, а также любые интернет товары не выходя из дома, хотите оформим карту сейчас...",
		closing_text: "Если бы я действительно понял преимущества Вашей карты, я мог бы ей воспользоваться, но пока сомневаюсь...",
		final_questions: [1,2,3,4],
		right_final_question: 1,
		right_closing_text: "Конечно, с удовольствием узнаю подробности продукта",
		wrong_closing_text: "Спасибо, но мне же необходимо уйти"
	},
	{
		id: 2,
		name: "Сергеева Нина Ивановна",
		loyalty: 3,
		objections_list: [1,2,3,4],
		introduction_text: "Приобретая нашу карту \"Банк в кармане\" Вы сможете оплачивать коммунальные платежи, а также любые интернет товары не выходя из дома, хотите оформим карту сейчас...",
		closing_text: "Если бы я действительно понял преимущества Вашей карты, я мог бы ей воспользоваться, но пока сомневаюсь...",
		final_questions: [1,2,3,4],
		right_final_question: 1,
		right_closing_text: "Конечно, с удовольствием узнаю подробности продукта",
		wrong_closing_text: "Спасибо, но мне же необходимо уйти"
	}],
	questions: [
		{
			id: 1,
			text: "Это единственное что вас останавливает?",
			wrong_answer_type: "excuse",
		}, {
			id: 2,
			text: "Вы не правы, наш продукт лучше по всем параметрам",
			wrong_answer_type: "vexation"
		}, {
			id: 3,
			text: "Это не так, посмотрите наш продукт бесплатный и мы первые запустили его на рынок",
			wrong_answer_type: "excuse"
		}, {
			id: 4,
			text: "Ну и что, Вы можете использовать оба продукта – наш мы предоставим Вам бесплатно",
			wrong_answer_type: "excuse"
		}, {
			id: 5,
			text: "Расскажите мне что произошло, возможно я смогу помочь Вам",
			wrong_answer_type: ""
		}, {
			id: 6,
			text: "Не надо врать, сейчас у всех есть интернет - все могут пользоваться дистанционными платежами",
			wrong_answer_type: "vexation"
		}, {
			id: 7,
			text: "У нашего продукта есть и другие достоинства, например он бесплатный и Вы можете хранить на нем денежные средства",
			wrong_answer_type: "excuse"
		}, {
			id: 8,
			text: "Ну ладно Вам, Вам все равно ничего не стоит попробовать наш продукт",
			wrong_answer_type: "excuse"
		}
	],
	final_questions: [
		{
			id: 1,
			text: "Раз вы действительно могли бы опробовать наш продукт, то я бы попросил уделить мне две минуты времени, за которые я расскажу о преимуществах нашего продукта"
		}, {
			id: 2,
			text: "Ну ладно Вам, Вам все равно ничего не стоит попробовать наш продукт"
		}, {
			id: 3,
			text: "Я работаю в Банке уже пять лет и гарантирую - наш продукт луче"
		}, {
			id: 4,
			text: "Правильно! Как Вы можете понять преимущества не пользуясь картой: оформите и они будут для Вас очевидны"
		}
	],
	settings: {
		clients_count: 1,
		objections_count: 2,
		questions_count: null,
		easy_mode: false
	}
}

var clientsDB = TAFFY(data.clients),
	objectionsDB = TAFFY(data.objections),
	questionsDB = TAFFY(data.questions),
	final_questionsDB = TAFFY(data.final_questions),
	settings = data.settings;

ClientClass = function(obj) {
	console.log(obj)
	this.step = 1;
	this.loyalty = obj.loyalty;
	this.name = obj.name;
	this.introduction_text = obj.introduction_text;
	this.closing_text = obj.closing_text;
	this.objections = (function(objections_list) {
		return objections_list.map(function(v, i) {
			return objectionsDB({id:v}).first();
		});
	})(obj.objections_list);
	this.objection = objectionsDB({id:2}).first();
	this.used_objections = [];
	this.questions = (function(objections) {

		return objectionsDB({id:objections[0]}).first().question_list.map(function(v, i) {
			return questionsDB({id:v}).first();
		});
	})(obj.objections_list);
	this.final_questions = (function() {
		return obj.final_questions.map(function(v, i) {
			return final_questionsDB({id:v}).first();
		})
	})();
	this.right_final_question = obj.right_final_question;
	this.wrong_answer_types = (function(self) {
		return self.questions.map(function(v, i) {
			return v.wrong_answer_type;
		});
	})(this);
	this.right_answers_count = 0;
	this.id = obj.id;
	this.right_answer = this.objection.right_answer;
	this.right_closing_text = obj.right_closing_text;
	this.wrong_closing_text = obj.wrong_closing_text;
}
ClientClass.getClientById = function(id) {
	var client = clientsDB({id: id}).first();
	return new ClientClass(client);
}
ClientClass.fn = ClientClass.prototype;
ClientClass.fn.init = function() {
	var i = null;
	for (i in this) {
		switch (i) {
			case "name":
				$("#name").html(this[i]);
				break;
			case "introduction_text":
				$("#introduction_text").html(this[i]);
				break;
			case "questions":
				this.getQuestions(this[i]);
				break;
			case "objection":
				this.getObjection();
				break;
			case "loyalty":
				$("#loyalty>span").html(this[i]);
				break;
		}
	}
	return this;
}
ClientClass.fn.getQuestions = function(arr) {
	var arr = arr || this.questions;
	$("#questions").empty().append( arr.map(function(v, i) {
		return "<li data-id='"+v.id+"'>"+v.text+"</li>";
	}).join("") );
	return this;
}
ClientClass.fn.getObjection = function() {
	$("#objection>span").html(this.objection.text);
	return this;
}
ClientClass.fn.updateObjection = function(type) {
	var self = this;
	var quez = self.objections.map(function(v, i) {
		if (v.type==type) {
			return v.id;
		}
	}).filter(function(v, i) {
		if (v!=undefined && self.used_objections.indexOf(v)==-1) return v;
	})
	console.log(quez)
	self.used_objections.push( quez = quez[getRandomInt(0, quez.length-1)] );
	self.objection = objectionsDB({id:quez}).first();
	self.right_answer = self.objection.right_answer;
	return self;
}
ClientClass.fn.updateQuestions = function() {
	this.questions = (function(self) {
		return self.objection.question_list.map(function(v, i) {
			return questionsDB({id:v}).first();
		});
	})(this);
	return this;
}

Client = ClientClass.getClientById(1);


$(document).ready(function() {

$("body").removeClass("js");
$(".jqmWindow").hide().jqm();

Client.init();

$("#questions").on("click", "li", function() {
	var qId = $(this).data("id");
	if (Client.final===true) {
		console.log("Client.final===true")
		if (Client.right_final_question===qId) {
			alert("WIN");
		} else {
			alert("LOOSE");
		}
		return;
	}
	$("#introduction_text").html( Client.introduction_text = questionsDB({id:qId}).first().text );
	if (Client.step===settings.objections_count) {
		if (Client.right_answer==qId) Client.right_answers_count++;
		if (Client.right_answer==qId && Client.right_answers_count==Client.step) {
			Client.final = true;
			Client.getQuestions( Client.final_questions );
			$("#objection>span").html(Client.closing_text);
			alert("Верно. Теперь переходим к финальному вопросу");
		} else {
			console.log("Неверно. Не переходим к финальному вопросу, а показываем следующего клиента если он есть")
			try {
				Client = ClientClass.getClientById(++Client.id).init();
			} catch(err) {
				console.log("Очередь закончена")
			}
			//wrong
		}
		return;
	}
	Client.updateObjection(
		(Client.right_answer==qId)?function(){Client.right_answers_count++; return "reason";}():(questionsDB({id:qId}).first().wrong_answer_type)
	).updateQuestions();
	Client.getObjection().getQuestions();
	Client.step+=1;
})

})