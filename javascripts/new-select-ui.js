function selectUI(){
	$('select').each(function(i , v){
		var $this = $('select').eq(i),
			_text = $this.find('option:selected').text() || $this.find('option:eq(0)').text(); // 是否有預選項目

		if ($this.parent().hasClass('selecter')) { // 重新append時
			$this.unwrap();
			$this.siblings().remove();
		}
		$this.wrap('<div id="select-'+i+'" class="selecter closed" />');
		$this.css({'display': 'none'});
		$('#select-'+i+'').append('<span class="selecter-selected">'+ _text +'</span>');

		$('#select-'+i+'').append('<div class="selecter-options" style="display:none;"></div>');

		$this.find('option').each(function(idx , val){
			var _sta = '';

			if ($(this).attr('disabled') === 'disabled') {
				_sta += ' disabled'; // 如果不可選
			}

			if ($(this).attr('selected') === 'selected') {
				_sta += ' selected'; // 如果是預選項目
			}

			$('#select-'+i+'').find('div').append('<span class="selecter-item'+_sta+'" data-value="'+ $this.find('option:eq('+idx+')').val() +'">'+ $this.find('option:eq('+idx+')').text() +'</span>');
		});

		$('#select-'+i+'').hover(function(){
			$('#select-'+i+'').addClass('focus open').removeClass('closed').find('.selecter-options').css('display' , 'block');
		} , function(){
			$('#select-'+i+'').addClass('closed').removeClass('focus open').find('.selecter-options').css('display' , 'none');
		});

		$('#select-'+i+'').find('.selecter-item').on('click' , function(e){
			var $this  = $(this),
				$index = $(this).index();
			$('#select-'+i+'').addClass('closed').removeClass('focus open').find('.selecter-options').css('display' , 'none');
			if (!$this.hasClass('disabled')) { // 不可選時不做事
				$('#select-'+i+'').find('.selecter-selected').addClass('selected').text($this.text());
				$('#select-'+i+'').find('select option:eq('+ $index +')').prop('selected' , true);
				$('#select-'+i+'').find('select').trigger('change');
				$this.addClass('selected').siblings().removeClass('selected');
			}
		});
	});
}