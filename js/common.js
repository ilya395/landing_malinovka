var inputmask = $('.phonemask');
    
    Inputmask.extendDefinitions({
      'f': {"validator": "[9\(\)\.\+/ ]"}
    });
    
 if (inputmask.length) {
  inputmask.inputmask({
   mask: "+7(f99)999-99-99"
  }); 
 }

$(document).ready(function() {

	var popUpGo = function() {
		$('.popup__row').css('bottom', '20px');
	};
	setTimeout(popUpGo, 3000);

	$('#closePopUpBtn').on('click', function() {
		$('.popup__row').css('display', 'none');
	});

	$('#deployContentPopUpBtn').on('click', function() {
		$('.popup__start-position').css('display', 'none');
		$('.popup__end-position').css('display', 'block');
	});



	$('#closeModalBtn').on('click', function() {
		$('.big-modal__section').css('display', 'none');
	});

	$('#deployModalBtn').on('click', function() {
		$('.big-modal__section').css('display', 'block');
	});

	$('#deployModalBtnOne').on('click', function() {
		$('.big-modal__section').css('display', 'block');
	});
	$('#deployModalBtnTwo').on('click', function() {
		$('.big-modal__section').css('display', 'block');
	});
	$('#deployModalBtnThree').on('click', function() {
		$('.big-modal__section').css('display', 'block');
	});

});