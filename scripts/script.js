data = {
	objections: [
		{
			id: 1,
			type: "reason",
			text: "На самом деле, у меня уже есть аналогичный продукт другого Банка, Ваш мне не нужен. (тип причина)",
			question_list: [1, 2, 3, 4],
			right_comment: "",
			wrong_comment: ""
		}, {
			id: 2,
			type: "excuse",
			text: "Мне это не нужно, я оплачиваю коммунальные платежи по другому (тип отговорка)",
			question_list: [1, 2, 3, 4],
			right_comment: "",
			wrong_comment: ""
		}, {
			id: 3,
			type: "vexation",
			text: "Нет, меня в Вашем Банке всегда обманывают, и банкоматы у Вас всегда не работают! (тип отыгрыш)",
			question_list: [1, 2, 3, 5],
			right_comment: "",
			wrong_comment: ""
		}, {
			id: 4,
			type: "excuse",
			text: "У меня дома нет интернета, мне этот продукт не интересен (тип отговорка)",
			question_list: [5, 6, 7, 8],
			right_comment: "",
			wrong_comment: ""
		}
	],
	clients: [{
		id: 1,
		name: "Иванов Иван Иванович",
		loyalty: 4,
		objections_list: [2],
		introduction_text: "Приобретая нашу карту \"Банк в кармане\" Вы сможете оплачивать коммунальные платежи, а также любые интернет товары не выходя из дома, хотите оформим карту сейчас...",
		closing_objection: "Если бы я действительно понял преимущества Вашей карты, я мог бы ей воспользоваться, но пока сомневаюсь...",
		question_list: [],
		right_closing_text: "Конечно, с удовольствием узнаю подробности продукта",
		wrong_closing_text: "Спасибо, но мне же необходимо уйти"
	}],
	questions: [
		{
			id: 1,
			text: "Это единственное что вас останавливает? (верный)",
			wrong_answer_type: null
		}, {
			id: 2,
			text: "Вы не правы, наш продукт лучше по всем параметрам (не верный, в параметрах переход на тип «отыгрыш»)",
			wrong_answer_type: "vexation"
		}, {
			id: 3,
			text: "Это не так, посмотрите наш продукт бесплатный и мы первые запустили его на рынок(не верный, в параметрах переход на тип «отговорка»)",
			wrong_answer_type: "excuse"
		}, {
			id: 4,
			text: "Ну и что, Вы можете использовать оба продукта – наш мы предоставим Вам бесплатно (не верный, в параметрах переход на тип «отговорка»)",
			wrong_answer_type: "excuse"
		}, {
			id: 5,
			text: "Расскажите мне что произошло, возможно я смогу помочь Вам (верный)",
			wrong_answer_type: null
		}, {
			id: 6,
			text: "Не надо врать, сейчас у всех есть интернет- все могут пользоваться дистанционными платежами (не верный, в параметрах переход на тип «отыгрыш»).",
			wrong_answer_type: "vexation"
		}, {
			id: 7,
			text: "У нашего продукта есть и другие достоинства, например он бесплатный и Вы можете хранить на нем денежные средства (не верный, в параметрах переход на тип «отговорка»)",
			wrong_answer_type: "excuse"
		}, {
			id: 8,
			text: "Ну ладно Вам, Вам все равно ничего не стоит попробовать наш продукт (не верный, в параметрах переход на тип «отговорка»)",
			wrong_answer_type: "excuse"
		}
	],
	settings: {}
}

var clientsDB = TAFFY(data.clients),
	objectionsDB = TAFFY(data.objections),
	questionsDB = TAFFY(data.questions);


ClientClass = function(obj) {
	this.name = obj.name;
	this.introduction_text = obj.introduction_text;
	this.objection = objectionsDB({id:2}).first();
	this.questions = objectionsDB({id:2}).first().question_list;

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
		}
	}
}
ClientClass.fn.getQuestions = function(arr) {
	var arr = arr || this.questions;
	$("#questions").empty().append( arr.reduce(function(prevV, curV, index, array) {
		if ( parseInt(prevV, 10)>=0 ) {
			return "<li>"+questionsDB({id:prevV}).first().text+"</li>";
		} else {
			return prevV + "<li>"+questionsDB({id:curV}).first().text+"</li>";
		}
	}) )
}
ClientClass.fn.getObjection = function() {
	$("#objection").html(this.objection.text);
}

Client = ClientClass.getClientById(1);


$(document).ready(function() {

$("body").removeClass("js");
$(".jqmWindow").hide().jqm();

})