var Ploan = function () {
	
	function initStep1(){
		$('#goStep2').click(function (e) {
			e.preventDefault() ;
			var title = $("#title").find(":selected").val();
			if(title==-1 ){
				alert("請選擇職稱！");
				return false;
			}
			var seniorityYesrs = getInputValue("#seniorityYesrs");
			var seniorityMonths =  getInputValue("#seniorityMonths");
			if(seniorityYesrs ==''){
				$("#seniorityYesrs").val(0) ;
				seniorityYesrs = 0 ;
			}
			if(seniorityMonths =='' && seniorityYesrs>0) {
				seniorityMonths = 0 ;
				$("#seniorityMonths").val(0) ;
			}
			if(!$.isNumeric(seniorityYesrs) || !$.isNumeric(seniorityMonths) || ! seniorityYesrs <0 || seniorityYesrs <0 ){
				alert("請輸入正確工作年資！");
				return false;
			}
			var annualIncome = getInputValue("#annualIncome");
			if( !$.isNumeric(annualIncome)){
				alert("年收入請填寫正確數字！");
				return false;
			}				
			//if( (seniorityYesrs*12+ seniorityMonths)<6){
			//	alert("工作年資必須大於6個月！");
			//	return false;
			//}
			//var annualIncome =  getInputValue("#annualIncome");

			//if( (title=='j14' || title=='j15') &&  annualIncome<42){
			//	alert("企業負責人年收入需NT$42萬以上！");
			//	return false;
			//}
			//else if(!$.isNumeric(annualIncome) ||  annualIncome<30){
			//	alert("請輸入正確年收入(NT$30萬以上)！");
			//	return false;
			//}
			
			  	//var age =  getInputValue("#age");
			//if(!$.isNumeric(age) || age>63 || age <20 ){
			//	alert("請輸入正確年齡(20~63歲)！");
			//	return false;
			//}
			
			$(this).tab('show');
			$('.step-progress').find('.list').removeClass('curr');
			$('.step-progress').find('.list').eq(1).addClass('curr');
		});

		$('a[data-toggle="tab"]').on('click', function(){
			var _step = $(this).attr('href').split('#step-')[1];

			$('.step-progress').find('.list').removeClass('curr');
			$('.step-progress').find('.list').eq(_step - 1).addClass('curr');
		});
	}
	
	function initStep2(){
		$('#annualIncome').blur(function (e) {
			checkAnnualIncome();
		});
        
		$('#age').blur(function (e) {
			var age =  getInputValue("#age");
			if(!$.isNumeric(age) || age>63 || age <20 ){
				$('#alert_age').show();
				$('#alert_box').show();
			} else {
				$('#alert_age').hide();
				if($('#alert_income42:visible').length == 0 && $('#alert_income30:visible').length == 0){
					$('#alert_box').hide();
				}
			}
		});
		
		$('#title').change(function (e) {
			var title = $("#title").find(":selected").val();
			var annualIncome =  getInputValue("#annualIncome");
			if( $.isNumeric(annualIncome)){
				checkAnnualIncome();
			}
		});

		$('#calculateCreditsBtn').click(function (e) {
			
			if(!validateStep2()) return false ;
			
			var factor_A =  getInputFloatValue("#annualIncome");
			var factor_B =  getInputFloatValue("#creditCardAmount");
			var factor_C =  getInputFloatValue("#creditLoansAmount");
			var factor_D =  getInputFloatValue("#cashCardAmount");
			
			var title = $("#title").find(":selected").val();
			var titleObj = titles[title] ;
			
			var dim = titleObj.dim ;
			var incomeRate = titleObj.incomeRate /100;
			
			//如果 Q6 答案為 "兩家以上" ==> 計算可貸金額時, 要額外考慮"表1"的"信用認列A%"
			var creditRateA = 1;
			var creditCards = $("#creditCards").find(":selected").val();
			if(creditCards==2){
				creditRateA = titleObj.creditRateA /100 ;
			}
			
			//如果 Q6-1 答案為 "是" ==> 計算可貸金額時, 要額外考慮"表1"的"信用認列B"%
			var creditRateB = 1;
			var revolvingCredit = $("#revolvingCredit").find(":selected").val();
			if(revolvingCredit=='true'){
				creditRateB = titleObj.creditRateB /100 ;
			}

			//當Q5的答案為"兩家以上" = > ==> 計算可貸金額時, 要額外考慮"表1"的"信用認列C%" (表一  J 欄 )
			var creditRateC = 1;
			var credit = $("#credit").find(":selected").val();
			if(credit==2){
				creditRateC = titleObj.creditRateC /100 ;
			}

			var reject = false;
			//E = Round ((A/12* DIM倍數*年收入認列%*信用認列A%*信用認列B%- (B+C+D) ),0) 
			var totalAmount =  Math.round(factor_A/12*dim*incomeRate*creditRateA*creditRateB*creditRateC -(factor_B+factor_C+factor_D));
			
			if (totalAmount > titleObj.maxAmount){
				totalAmount = titleObj.maxAmount ;
			}
			if(totalAmount<titleObj.minAmount){
				reject = true;
			}
			
			if(reject){					 
				$('.loandableResult').addClass('hidden');
				$('.rejectMessage').removeClass('hidden');
				alert("依您目前填寫資訊暫無法試算信用貸款可貸金額，建議您重新檢視填寫資訊，或點選網頁「與專人聯絡」將有專員為您服務。");
			} else {
				/*
				   1. 請詳 "表1"該職位相對應之年限
				   2. 如果可貸金額小於31萬, 請參考"表一" 最短年限
				   3. 當 Q5 的答案為"兩家以上 "=> 貸款年限請選擇"最低年限"
				 */
				var period = titleObj.maxPeriod ;				
				if(credit==2 || totalAmount<31){
					period = titleObj.minPeriod ;
				}

				$('#loanableAmount').val(totalAmount);
				$('#loanablePeriod').val(period);
				$('#repaymentAmount').val(newPMT(totalAmount, period ,titleObj.rate)); 
				
				$('.rejectMessage').addClass('hidden');
				$('.loandableResult').removeClass('hidden');
				$(this).tab('show');
			}				
		});

		$('#creditCards').change(function (e){
			var creditCards = $("#creditCards").find(":selected").val();
			if(creditCards>0){
				$("#q6_1").show();
				$("#q6_2").show();
			} else {
				$("#q6_1").hide();
				$("#revolvingCredit").val('false');
				$("#q6_2").hide();
				$("#creditCardAmount").val('');
			}
		});
		
		$('#homeLoans').change(function (e){
			var homeLoans = $("#homeLoans").find(":selected").val();
			if(homeLoans>0) {
				$("#q7_1").show();
			} else {
				$("#q7_1").hide();
				$("#homeLoansAmount").val('');
			}
		});    		
		
		$('#creditLoans').change(function (e){
			var creditLoans = $("#creditLoans").find(":selected").val();
			if(creditLoans>0){
				$("#q8_1").show();
				$("#q8_2").show();
			} else{
				$("#q8_1").hide();
				$("#creditLoansAmount").val('');
				$("#q8_2").hide();    				
				$("#needCreditLoan").val('false');
			}
		});   
		
		$('#cashCardY').click(function (e){
			$("#q9_1").show();
		});    	
		$('#cashCardN').click(function (e){
			$("#q9_1").hide();
			$("#cashCardAmount").val('');
		});    
	}
		
    return {
        init: function () {
        	initStep1();
        	initStep2();
            changeJobs();        	
        },
    };
}();

function checkAnnualIncome(){
	var title = $("#title").find(":selected").val();
	var annualIncome =  getInputValue("#annualIncome");

	if( (title=='j0601' || title=='j0602') &&  annualIncome<42){
		$('#alert_box').show();
		$('#alert_income30').hide();
		$('#alert_income42').show();
	}
	else if(!$.isNumeric(annualIncome) ||  annualIncome<30){
		$('#alert_income42').hide();
		$('#alert_income30').show();
		$('#alert_box').show();
	}
	else{
		$('#alert_income42').hide();
		$('#alert_income30').hide();
		if($('#alert_age:visible').length == 0){
			$('#alert_box').hide();
		}
	}
}

function validateStep2(){
	var credit = $("#credit").find(":selected").val();
	if(credit==-1 ){
		alert("請選擇最近3個月是否有申請任何金融機構之信用卡或貸款(房貸及信貸)！");
		return false;
	}
	var creditCards = $("#creditCards").find(":selected").val();
	if(creditCards==-1 ){
		alert("請選擇目前名下是否持有任何信用卡！");
		return false;
	}    			
	var homeLoans = $("#homeLoans").find(":selected").val();
	if(homeLoans==-1 ){
		alert("請選擇目前名下是否持有任何房屋貸款！");
		return false;
	}        			
	var creditLoans = $("#creditLoans").find(":selected").val();
	if(creditLoans==-1 ){
		alert("請選擇目前名下是否持有任何信用貸款！");
		return false;
	}    
	
	var revolvingCredit = $("#revolvingCredit").find(":selected").val();
	

	if(revolvingCredit=='true' && !$.isNumeric(getInputValue("#creditCardAmount"))){
		alert("請輸入正確信用卡帳單餘額合計金額！");
		return false;
	}
	
	if($("#homeLoansAmount").is(":visible") && !$.isNumeric(getInputValue("#homeLoansAmount"))){
		alert("請輸入正確房屋貸款餘額合計金額！");
		return false;
	}
	
	if($("#creditLoansAmount").is(":visible") && !$.isNumeric(getInputValue("#creditLoansAmount"))){
		alert("請輸入正確個人信用貸款餘額合計金額！");
		return false;
	}
	
	if($("#cashCardAmount").is(":visible") && !$.isNumeric(getInputValue("#cashCardAmount"))){
		alert("請輸入正確現金卡借款餘額合計金額！");
		return false;
	}
	return true ;
}

function getInputValue(id){
	var value = $.trim($(id).val());
	$(id).val(value) ;
	return value;
}
function getInputFloatValue(id){
	var value = getInputValue(id);
	return value=='' ? 0 : parseFloat(value) ;
}

function trialValidate(isAprKeyPress){
	var totalAmount = $('#totalAmount').val();//貨款總金額
	var period = $('#period').val();//貨款總期間
	var apr = $('#apr').val();//貨款年利率
	
	if(!validateNumber(totalAmount,false))
		$('#totalAmount').val(10);
	else
		$('#totalAmount').val(parseFloat($('#totalAmount').val()));
	totalAmount = parseFloat($('#totalAmount').val()) ;
	if(totalAmount<10 ){
		alert("貸款總金額：最低10萬，最高300萬。（以5萬為單位）");
		$('#totalAmount').val(10);
	}
	if(totalAmount>300 ){
		alert("貸款總金額：最低10萬，最高300萬。（以5萬為單位）");
		$('#totalAmount').val(300);
	}
	else if(totalAmount%5!=0){
		alert("貸款總金額需以5萬為單位！");
		
		totalAmount = Math.round(totalAmount /5)*5 ;
		$('#totalAmount').val(totalAmount);
	}			
	if(isAprKeyPress && apr=='')
		return ;			
	if(!validateNumber(apr,true))
		$('#apr').val(1.98);
	else{
		if(isAprKeyPress && apr.indexOf(".")==apr.length-1){
			return ;
		}
		$('#apr').val(parseFloat($('#apr').val()));			
	}
	trial();
}

function validateNumber(input, isApr){
	if(isApr){
		//小數2位
		var re = /^[0-9][0-9]*.?[0-9]{0,2}$/;
		return re.test(input);
	}else{
		//整數
		var re = /^[0-9][0-9]*$/;
		return re.test(input);
	}
}

function trial(){
	var totalAmount = $('#totalAmount').val();//貨款總金額
	var period = $('#period').val();//貨款總期間
	var apr = $('#apr').val();//貨款年利率
	if(period==null) period=0;
		
		if(totalAmount!=0 && period!=0 && apr!=0 ){
			$('#repayment').html(newPMT(totalAmount, period ,apr)); 	
		}
	else{
		$('#repayment').html('0'); 		
	}
}
	
function pmt(totalAmount, period ,apr){
	// 信貸試算公式
	// 貸款金額 ×{[(1+月利率)^月數]× 月利率｝÷ {[(1+月利率)^月數]-1}
	return Math.round(totalAmount*((apr * Math.pow(1+apr , period))/( Math.pow(1 + apr,period) - 1 )));
}

function newPMT(money, month, percent){
	var r = (percent / 100) / 12 ;
		t = month * 12 ;				//改成年單位之後的調整。
		y = money * 10000 ;			//改成萬元單位之後的調整。
		m1_1 = Math.pow(1 + r, t) * r ;
		m1_2 = Math.pow(1 + r, t) - 1 ;

	return formatNumber(Math.round(m1_1 / m1_2 * y)) ;
}

function formatNumber(n) { 
    n += ""; 
    var arr = n.split("."); 
    var re = /(\d{1,3})(?=(\d{3})+$)/g; 
    return arr[0].replace(re,"$1,") + (arr.length == 2 ? "."+arr[1] : ""); 
}

/* 
 * 取消格式，例如：$1,680,000　→　1680000。
 * 0)只取數字部分。
 */
function unFomatNumber(number){    
	return number.replace(/[^0-9]/g,"");
}			

var jobs = [
            {	id:	1,name:'績優公司',titles:[{id:'j0101',name:'主管'},{id:'j0102',name:'固定薪白領員工'},{id:'j0103',name:'傭金制業務人員'},{id:'j0104',name:'其他固定薪人員'} ]},
            {	id:	2,name:'專業人士',titles:[{id:'j0201',name:'會計師'},{id:'j0202',name:'律師'} ,{id:'j0203',name:'建築師'} ,{id:'j0204',name:'執業醫師'} ,{id:'j0205',name:'其他專業證照持有人士'}  ]},	
            {	id:	3,name:'公教人員',titles:[{id:'j0301',name:'正式編制人員'}, {id:'j0302',name:'退休人員'}, {id:'j0303',name:'其他'}]},	
            {	id:	4,name:'軍警',titles:[{id:'j0401',name:'校級以上軍官'}, {id:'j0402',name:'普考以上警察'},{id:'j0403',name:'其他'}]},	
            {	id:	5,name:'一般公司',titles:[{id:'j0501',name:'白領主管'}, {id:'j0502',name:'其他'}]},	
            {	id:	6,name:'業主或其他',titles:[{id:'j0601',name:'中小企業主'}, {id:'j0602',name:'小商號負責人'},{id:'j0603',name:'其他'}]},			                   
        ]
var titles = {
		j0101:{name:'主管' 				,rate: 7.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0102:{name:'固定薪白領員工' 	,rate: 9.87,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:200,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0103:{name:'傭金制業務人員' 	,rate:13.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:200,dim:15.00,incomeRate: 70.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		j0104:{name:'其他固定薪人員' 	,rate:15.37,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount:200,dim:15.00,incomeRate: 70.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		
		j0201:{name:'會計師' 				,rate: 7.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0202:{name:'律師' 					,rate: 7.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0203:{name:'建築師' 				,rate: 7.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0204:{name:'執業醫師' 				,rate: 7.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0205:{name:'其他專業證照持有人士' 	,rate: 7.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		
		j0301:{name:'正式編制人員' 	,rate: 5.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:22.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0302:{name:'退休人員' 		,rate: 9.87,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount:200,dim:15.00,incomeRate: 70.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		j0303:{name:'其他' 			,rate:13.37,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount:200,dim:15.00,incomeRate: 70.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		
		j0401:{name:'校級以上軍官' 	,rate: 7.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:300,dim:15.00,incomeRate:100.0,creditRateA:100.0,creditRateB:100.0,creditRateC:100.0},
		j0402:{name:'普考以上警察' 	,rate:11.37,maxPeriod:7,minPeriod:5,minAmount:10,maxAmount:200,dim:11.00,incomeRate:100.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		j0403:{name:'其他' 			,rate:17.27,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount: 80,dim:11.00,incomeRate:100.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		
		j0501:{name:'白領主管' 		,rate:13.37,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount:200,dim:15.00,incomeRate:100.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		j0502:{name:'其他' 			,rate:15.37,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount:200,dim:15.00,incomeRate:100.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		
		j0601:{name:'中小企業主' 		,rate:15.37,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount:100,dim:15.00,incomeRate:100.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		j0602:{name:'小商號負責人' 		,rate:17.27,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount:100,dim:11.00,incomeRate:100.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0},
		j0603:{name:'其他' 				,rate:17.27,maxPeriod:5,minPeriod:5,minAmount:10,maxAmount: 80,dim:11.00,incomeRate:100.0,creditRateA:100.0,creditRateB:  0.0,creditRateC:0.0}			
	}

function initializeTitles() {
	$("#title option").remove();
	$("#title").append("<option value='-1' selected disabled>職稱</option>");
	$("#title").selecter("refresh");
}

function changeJobs() {
	var index = $("#job").find(":selected").val();

	if (index > -1) {
		var job = jobs[index];

		if (job.titles.length == 1) {
			$("#title option").remove();
			$("#title").append($("<option></option>").attr("value", job.titles[0].id).text( job.titles[0].name));
			checkAnnualIncome();
		} else {
			initializeTitles();
			for (var i = 0; i < job.titles.length; i++) {
				$("#title").append($("<option></option>").attr("value", job.titles[i].id).text( job.titles[i].name));
			}
			$("#title").selecter("refresh");
		}
	}
}