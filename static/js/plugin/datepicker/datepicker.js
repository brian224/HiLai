/*!
 * sugarfun DatePicker - jQuery Plugin
 * version: 2.1.0 (thu , 16 Aug 2016)
 * @requires jQuery v1.9 or later
 *
 * Copyright 2015 sugarfun ciro
 */

(function ($, document, window, navigator) {
	'use strict';

	var $b = $('body'),
		$d = $(document),
		DP = $.DatePicker = function () {
			DP.init.apply( this , arguments );
		},
		_IE = navigator.userAgent.match(/msie/i),
		isQuery	= function(obj) {
			return obj && obj.hasOwnProperty && obj instanceof $;
		},
		isString = function(str) {
			return str && $.type(str) === "string";
		},
		isPercentage = function(str) {
			return isString(str) && str.indexOf('%') > 0;
		},
		getScalar = function(orig , dim) {
			var value = parseInt( orig , 10) || 0;

			if ( dim && isPercentage(orig) ) {
				value = DP.getViewport()[ dim ] / 100 * value;
			}

			return Math.ceil(value);
		},
		getValue = function(value, dim) {
			return getScalar(value , dim) + 'px';
		},
		devices = function() {
			if ( /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && $d.width() < 768 ) {
				return 'M';
			} else {
				if ( /Android|webOS|iPad|BlackBerry/i.test(navigator.userAgent) ) {
					return 'T';
				} else {
					return 'D';
				}
			}
		},
		getNewDate = function (Dates) {
			return new Date(Dates);
		};

	$.extend( DP , {
		version : '2.1.0',
		defaults : {
			width    : null,
			height   : null,
			maxDate  : null,
			minDate  : null,
			headType : 'text',
			speed    : 300,
			format   : {
				months : null,
				weeks  : null
			},
			types    : 'YYYY/MM/DD'
		},
		tpl : {
			'datepicker' : 'sugarfun-datepicker',
			'hd'         : 'sugarfun-datepicker-hd',
			'tools'      : 'sugarfun-datepicker-tools',
			'arrow'      : 'sugarfun-datepicker-arrow',
			'times'      : 'sugarfun-datepicker-times',
			'week'       : 'sugarfun-datepicker-week',
			'frame'      : 'sugarfun-datepicker-frame',
			'input'      : 'sugarfun-datepicker-input',
			'select'     : 'sugarfun-datepicker-select',
			'bd'         : 'sugarfun-datepicker-bd',
			'date'       : 'sugarfun-datepicker-date',
			'btn'        : 'sugarfun-datepicker-button',
			'prev'       : 'is-prev',
			'next'       : 'is-next',
			'this'       : 'is-this',
			'today'      : 'is-today',
			'chose'      : 'is-chose',
			'holiday'    : 'is-holiday'
		},
		setting : {
			regex       : /(\w*)YYYY(.*)MM(.*)DD(.*)/g,
			data        : null,
			maxDate     : null,
			minDate     : null,
			newDay      : null,
			newMonth    : null,
			newYear     : null,
			nowDay      : new Date().getDate(),
			nowMonth    : new Date().getMonth(),
			nowYear     : new Date().getFullYear(),
			language    : {
				CH : {
					months : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
					weeks  : ['日', '一', '二', '三', '四', '五', '六']
				},
				EN : {
					months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					weeks  : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
				} 
			},
			months      : null,
			weeks       : null,
			monthsIdx   : null,
			monthDays   : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			year        : null,
			week        : 0,
			today       : null,
			getDays     : null,
			setDate     : null,
			appendDates : null,
			appendDate  : null,
			formatDate  : null,
			headerTypes : null,
			headType    : {},
			prevDate    : {
				'Year' : null,
                'Month': null,
                'Day'  : []
			},
			thisDate : {
				'Year' : null,
                'Month': null,
                'Day'  : []
			},
			nextDate : {
				'Year' : null,
                'Month': null,
                'Day'  : []
			}
		},
		formatHeader :  function(date) {
			var coming = DP.coming;
			var setYear  = ( /(?!(\,))\d+/.exec(coming.headType) ? ( /(?!(\,))\d+/.exec(coming.headType)[0] | 0 ) : 1911 ),
				setMonth = coming.format.months ? coming.format.months.split(',')[(DP.setting.newMonth | 0)] : DP.setting.thisDate.Month;

			if ( coming.headType !== 'text' ) {
				DP.setting.headType.ready = true;

				if ( coming.headType === 'input' ) {
					DP.setting.headType.year  = '<div class="'+DP.tpl.frame+'"><input type="text" class="'+DP.tpl.input+' is-year" value="'+DP.setting.thisDate.Year+'" maxlength="4"></div>';
					DP.setting.headType.month = '<div class="'+DP.tpl.frame+'"><input type="text" class="'+DP.tpl.input+' is-month" value="'+DP.setting.thisDate.Month+'" maxlength="2"></div>';
				} else {
					if ( /((?!\,)\S)*/.exec(coming.headType)[0] === 'select' ) {
						DP.setting.headType.year = '<div class="'+DP.tpl.frame+'"><select class="'+DP.tpl.select+' is-year">';
						if ( DP.setting.nowYear >= setYear ) {
							for ( var i = DP.setting.nowYear; i >= setYear ; i -- ) {
								if ( DP.setting.thisDate.Year !== i ) {
									DP.setting.headType.year += '<option value="'+i+'">'+i+'</option>';
								} else {
									DP.setting.headType.year += '<option value="'+i+'" selected>'+i+'</option>';
								}
							}
						} else {
							for ( var i = DP.setting.nowYear ; i < ( setYear + 1 ) ; i ++ ) {
								if ( DP.setting.thisDate.Year !== i ) {
									DP.setting.headType.year += '<option value="'+i+'">'+i+'</option>';
								} else {
									DP.setting.headType.year += '<option value="'+i+'" selected>'+i+'</option>';
								}
							}
						}
						
						DP.setting.headType.year += '</select></div>';
						DP.setting.headType.month = '<div class="'+DP.tpl.frame+'"><select class="'+DP.tpl.select+' is-month">';
						for ( var i = 0 , _i = null ; i < 12 ; i ++ ) {
							_i = ( coming.format.months && coming.format.months.split(',').length === 12 ) ? coming.format.months.split(',')[i] : ((i < 9) ? ('0' + (i + 1)) : (i + 1));
							if ( _i !== DP.setting.thisDate.Month ) {
								DP.setting.headType.month += '<option value="'+i+'">'+_i+'</option>';
							} else {
								DP.setting.headType.month += '<option value="'+i+'" selected>'+_i+'</option>';
							}
						}
						DP.setting.headType.month += '</select></div>';
					}
				}
			} else {
				DP.setting.headType.year  = '<em>'+DP.setting.thisDate.Year+'</em>';
				DP.setting.headType.month = '<em>'+setMonth+'</em>';
				$('.' + DP.tpl.arrow).removeClass('is-hide');
				$('.' + DP.tpl.tools).addClass('is-text');
			}

			DP.setting.headType.append = DP.setting.headerTypes;
			DP.setting.headType.append = DP.setting.headType.append.replace(/\W/.exec(DP.setting.headerTypes)[0] , '<i>'+/\W/.exec(DP.setting.headerTypes)[0]+'</i>');
			DP.setting.headType.append = DP.setting.headType.append.replace(/Y+/g , DP.setting.headType.year);
			DP.setting.headType.append = DP.setting.headType.append.replace(/M+/g , DP.setting.headType.month);
			
			return DP.setting.headType.append;
		},
		formatInputs : function(date , format) {
			var z = {
				M    : ( date.getMonth() + 1 ),
				D    : date.getDate(),
				Hour : date.getHours(),
				Min  : date.getMinutes(),
				Sec  : date.getSeconds()
			};

			format = format.replace(/(M+|D+|Hour|Min|Sec)/g , function (v) {
				return ( ( v.length > 1 ? '0' : '' ) + eval( 'z.' + v.slice( -1 ) ) ).slice( -2 );
			});

			return format.replace(/(Y+)/g , function (v) {
				return date.getFullYear().toString().slice( -v.length );
			});
		},
		init : function(group , opts) {
			if ( ! group ) {
				return;
			}

			if ( ! $.isPlainObject(opts) ) {
				opts = {};
			}

			// Normalize group
			if ( ! $.isArray(group) ) {
				group = isQuery(group) ? $(group).get() : [group];
			}

			$.each( group , function( i , element ) {
				var obj = {};

				if ( $.type(element) === 'object' ) {
					// Check if is DOM element
					if ( element.nodeType ) {
						element = $(element);
					}

					if ( isQuery(element) ) {
						obj = {
							width : element.data('width'),
							height : element.data('height'),
							speed : element.data('speed'),
							maxDate : element.data('max-date'),
							minDate : element.data('min-date'),
							headType : element.data('head-type'),
							format : ( element.data('format') === 'CH' || element.data('format') === 'EN' ) ? element.data('format') : ( element.data('format') === undefined && ( element.data('months') || element.data('weeks')) ) ? {
								months : element.data('months'),
								weeks : element.data('weeks'),
							} : 'CH',
							types : element.data('types'),
							element : element
						};

						if ( $.metadata ) {
							$.extend(true , obj , element.metadata());
						}

					} else {
						obj = element;
					}
				}

				group[ i ] = obj;
			});

			DP.opts = $.extend(true , {} , DP.defaults , opts);

			DP.group = group;

			return DP._start(DP.opts.index);
		},
		selectMonth : function(element) {
			var coming = DP.coming;

			DP.setting.monthsIdx = DP.setting.monthsIdx + parseInt($(element).data('value'), 10);

        	if ( DP.setting.monthsIdx < 0 ) {
                DP.setting.monthsIdx = 11;
                DP.setting.year --;
            } else if (DP.setting.monthsIdx > 11) {
                DP.setting.monthsIdx = 0;
                DP.setting.year ++;
            }

            DP.setting.appendDates = DP.defaults.types.replace(DP.setting.regex , '$1'+DP.setting.year+'$2'+DP.setting.months[DP.setting.monthsIdx]+'$3'+DP.setting.newDay);

            DP.setting.appendDates = new Date(DP.setting.appendDates);
            $('.' + DP.tpl.date).empty();

            DP._calendar(DP.setting.appendDates);
		},
		formSelect : function(element) {
			var coming = DP.coming;
			var _date = null;

			if ( element.hasClass('is-year') ) {
				DP.setting.year = ( element.val() | 0 );
			}

			_date = new Date(DP.defaults.types.replace(DP.setting.regex , '$1'+DP.setting.year+'$2'+DP.setting.months[( ( element.val().length <= 2 && element.val() ) ? ( element.hasClass(DP.tpl.input) ? ( ( element.val() | 0 ) - 1 ) : (element.val() | 0 ) ) : DP.setting.newMonth)]+'$3'+DP.setting.newDay));
			$('.' + DP.tpl.date).empty();
			DP._calendar(_date);
		},
		getValue : function(element) {
			var coming = DP.coming;
			
			$(coming.element[0]).val($(element).data('date'));
		},
		_start: function (index) {
			var coming = {},
				obj,
				dateValue;
			var year,
				month,
				day;

			index = getScalar( index );
			obj   = DP.group[ index ] || null;

			if ( ! obj ) {
				return false;
			}

			coming = $.extend(true , {} , DP.opts , obj);
			DP.tpl.wrap = '<div class="'+DP.tpl.datepicker+'"><div class="'+DP.tpl.hd+'"><div class="'+DP.tpl.tools+'"><button class="'+DP.tpl.arrow+' is-prev" data-value="-1">prev<i></i></button><div class="'+DP.tpl.times+'"></div><button class="'+DP.tpl.arrow+' is-next" data-value="1">next<i></i></button></div><ul class="'+DP.tpl.week+'"></ul></div><div class="'+DP.tpl.bd+'"><ul class="'+DP.tpl.date+'"></ul></div></div>';
			DP.coming = coming;
			DP.setting.headType.ready = false;

			year = coming.element.val() ? (coming.element.val().substring(/Y+/.exec(coming.types).index , ((/Y+/.exec(coming.types).index) + ((/Y+/.exec(coming.types)[0].length)))) | 0) : '';
			month = coming.element.val() ? (coming.element.val().substring(/M+/.exec(coming.types).index , ((/M+/.exec(coming.types).index) + ((/M+/.exec(coming.types)[0].length)))) | 0) : '';
			day = coming.element.val() ? (coming.element.val().substring(/D+/.exec(coming.types).index , ((/D+/.exec(coming.types).index) + ((/D+/.exec(coming.types)[0].length)))) | 0) : '';

			if ( coming.format === 'EN' ) {
				DP.setting.months = DP.setting.language.EN.months;
				DP.setting.weeks  = DP.setting.language.EN.weeks;
			} else {
				DP.setting.months = DP.setting.language.CH.months;
				DP.setting.weeks = DP.setting.language.CH.weeks;
				
				if ( coming.format.weeks ) {
					if ( coming.format.weeks.split(',').length === 7 ) {
						DP.setting.weeks  = [];
						for ( var i = 0 ; i < coming.format.weeks.split(',').length ; i ++ ) {
							DP.setting.weeks.push($.trim(coming.format.weeks.split(',')[i]));
						};
					}
				}
			}
			
			dateValue = coming.element.val() ? new Date(DP.defaults.types.replace(DP.setting.regex , '$1'+year+'$2'+DP.setting.months[(month-1)]+'$3'+day)) : '';

			DP._remove();
			$b.append(DP.tpl.wrap);
			DP._calendar(dateValue);
			DP._dateOpen();
		},
		_remove : function() {
			var coming = DP.coming;

			if ( $('.' + DP.tpl.datepicker).length !== 0 ) {
				$('.' + DP.tpl.datepicker).fadeOut(coming.speed , function(){
					$(this).remove();
				});
			}
		},
		_calendar : function (selectDate) {
			var coming = DP.coming;
			var date ,
				today,
				chose,
				holiday;

			$('.' + DP.tpl.datepicker).css({
				top    : coming.element.offset().top + coming.element.outerHeight(),
				left   : coming.element.offset().left,
				width  : coming.width ? ( /%/g.test(coming.width) ? coming.width : getScalar(coming.width) ) : coming.element.outerWidth(),
				height : coming.height ? ( /%/g.test(coming.height) ? coming.height : getScalar(coming.height) ) : null
			}).finish().fadeIn(coming.speed);

			DP.setting.date      = selectDate ? selectDate : new Date(),
			DP.setting.maxDate   = coming.maxDate ? new Date(coming.maxDate) : new Date(9999, 1, 1),
			DP.setting.minDate   = coming.minDate ? new Date(coming.minDate) : new Date(100, 1, 1),
			DP.setting.newDay    = DP.setting.date.getDate(),
			DP.setting.newMonth  = DP.setting.date.getMonth(),
			DP.setting.newYear   = ( DP.setting.date.getYear() <= 200 ) ? ( DP.setting.date.getYear() + 1900 ) : DP.setting.date.getYear(),
			DP.setting.monthsIdx = DP.setting.newMonth,
			DP.setting.year      = DP.setting.newYear,
			DP.setting.today     = DP.formatInputs(new Date() , coming.types.toUpperCase()),
			DP.setting.getDays   = DP.setting.monthDays[DP.setting.newMonth],
			DP.setting.setDate   = DP.setting.date;
			
			if ( ( DP.setting.newYear % 4 ) === 0 && DP.setting.newYear !== 1900 ) {
				DP.setting.monthDays[1] = 29;
			}

			$('.' + DP.tpl.week).empty();

			for (var i = 0 ; i < DP.setting.weeks.length ; i++) {
				$('.' + DP.tpl.week).append('<li>'+ DP.setting.weeks[i] +'</li>');
			};

			DP.setting.setDate.setDate(1);

			if ( DP.setting.setDate.getDate() === 2 ) {
				DP.setting.setDate = setDate(0);
			}

			DP.setting.setDate = DP.setting.setDate.getDay();

			DP.setting.prevDate.Year  = DP.setting.newMonth > 0 ? DP.setting.year : ( DP.setting.year - 1 );
			DP.setting.thisDate.Year  = DP.setting.year;
			DP.setting.nextDate.Year  = DP.setting.newMonth < 11 ? DP.setting.year : ( DP.setting.year + 1 );
			DP.setting.prevDate.Month = DP.setting.newMonth > 0 ? DP.setting.months[( DP.setting.newMonth - 1 )] : DP.setting.months[11];
			DP.setting.thisDate.Month = DP.setting.months[ ( DP.setting.newMonth ) ];
			DP.setting.nextDate.Month = DP.setting.newMonth < 11 ? DP.setting.months[ ( DP.setting.newMonth + 1 ) ] : DP.setting.months[0];

			DP.setting.headerTypes   = coming.types.toUpperCase().replace(/[-,.\/]D+|D+[-,.\/]/g , '');
			DP.setting.headType.date = DP.setting.headerTypes;
			DP.setting.headType.date = DP.setting.headType.date.replace(/Y+/g , DP.setting.thisDate.Year);
			DP.setting.headType.date = DP.setting.headType.date.replace(/M+/g , DP.setting.thisDate.Month);

			if ( ! DP.setting.headType.ready ) {
				$('.' + DP.tpl.times).html(DP.formatHeader(DP.setting.headType.date));
			}

			for ( var i = 1 ; i <= DP.setting.setDate ; i ++ ) {

				// console.log(i);

				if ( DP.setting.newMonth - 1 < 0 ) {
					date = ( DP.setting.monthDays[ ( DP.setting.monthDays.length - 1 ) ] - DP.setting.setDate + i );
				} else {
					date = ( DP.setting.monthDays[ ( DP.setting.newMonth - 1 ) ] - DP.setting.setDate + i );
				}

				DP.setting.appendDates = DP.defaults.types.replace(DP.setting.regex , '$1'+DP.setting.prevDate.Year+'$2'+DP.setting.prevDate.Month+'$3'+date);

				DP.setting.formatDate = DP.formatInputs(new Date(DP.setting.appendDates) , coming.types.toUpperCase());

				if ( coming.element.val() === DP.setting.formatDate ) {
					chose = ' '+DP.tpl.chose+''
				} else {
					chose = '';
				}

				if ( new Date(DP.setting.appendDates).getDay() === 0 || new Date(DP.setting.appendDates).getDay() === 6 ) {
					holiday = ' '+DP.tpl.holiday+'';
				} else {
					holiday = '';
				}
			
				if ( getNewDate(DP.setting.appendDates) <= DP.setting.maxDate && DP.setting.minDate && getNewDate(DP.setting.appendDates) > DP.setting.minDate ) {
					DP.setting.appendDate = '<button class="'+DP.tpl.btn+''+chose+'" data-date="'+ DP.setting.formatDate +'">' + getNewDate(DP.setting.appendDates).getDate() + '</button>';
				} else {
					DP.setting.appendDate = '<em class="'+chose+'">' + getNewDate(DP.setting.appendDates).getDate() + '</em>';
				}
				
				$('.' + DP.tpl.date).append('<li class="'+DP.tpl.prev+''+holiday+'">' + DP.setting.appendDate + '</li>');
			
				DP.setting.week ++;
			};
			
			for ( var i = 1 ; i <= DP.setting.getDays ; i ++ ) {
				date = ( ( i > 9 ) ? i : ( '0' + i ) );
				DP.setting.appendDates = DP.defaults.types.replace(DP.setting.regex , '$1'+DP.setting.thisDate.Year+'$2'+DP.setting.thisDate.Month+'$3'+date);
				DP.setting.formatDate  = DP.formatInputs(new Date(DP.setting.appendDates) , coming.types.toUpperCase());

				if ( DP.setting.today === DP.setting.formatDate ) {
					today = ' '+DP.tpl.today+'';
				} else {
					today = '';
				}

				if ( coming.element.val() === DP.setting.formatDate ) {
					chose = ' '+DP.tpl.chose+''
				} else {
					chose = '';
				}

				if ( new Date(DP.setting.appendDates).getDay() === 0 || new Date(DP.setting.appendDates).getDay() === 6 ) {
					holiday = ' '+DP.tpl.holiday+'';
				} else {
					holiday = '';
				}
			
				if ( getNewDate(DP.setting.appendDates) <= DP.setting.maxDate && DP.setting.minDate && getNewDate(DP.setting.appendDates) > DP.setting.minDate ) {
					DP.setting.appendDate = '<button class="'+DP.tpl.btn+''+today+''+chose+'" data-date="'+ DP.setting.formatDate +'">' + i + '</button>';
				} else {
					DP.setting.appendDate = '<em class="'+today+''+chose+'">' + i + '</em>';
				}

				$('.' + DP.tpl.date).append('<li class="'+DP.tpl.this+''+holiday+'">' + DP.setting.appendDate + '</li>');
			
				DP.setting.week ++;
			
				if ( DP.setting.week === 7 ) {
					DP.setting.week = 0;
				}
			};
			
			for ( var i = 1 ; DP.setting.week !== 0 ; i ++ ) {
				date = ( ( i > 9 ) ? i : ( '0' + i ) );
				DP.setting.appendDates = DP.defaults.types.replace(DP.setting.regex , '$1'+DP.setting.nextDate.Year+'$2'+DP.setting.nextDate.Month+'$3'+date);
				DP.setting.formatDate  = DP.formatInputs(new Date(DP.setting.appendDates) , coming.types.toUpperCase());

				if ( coming.element.val() === DP.setting.formatDate ) {
					chose = ' '+DP.tpl.chose+''
				} else {
					chose = '';
				}

				if ( new Date(DP.setting.appendDates).getDay() === 0 || new Date(DP.setting.appendDates).getDay() === 6 ) {
					holiday = ' '+DP.tpl.holiday+'';
				} else {
					holiday = '';
				}
				
				if ( getNewDate(DP.setting.appendDates) <= DP.setting.maxDate && DP.setting.minDate && getNewDate(DP.setting.appendDates) > DP.setting.minDate ) {
					DP.setting.appendDate = '<button class="'+DP.tpl.btn+''+chose+'" data-date="'+ DP.setting.formatDate +'">' + i + '</button>';
				} else {
					DP.setting.appendDate = '<em class="'+chose+'">' + i + '</em>';
				}

				$('.' + DP.tpl.date).append('<li class="'+DP.tpl.next+''+holiday+'">' + DP.setting.appendDate + '</li>');
			
				DP.setting.week ++;
			
				if ( DP.setting.week === 7 ) {
					DP.setting.week = 0;
				}
			};
		},
		_dateOpen : function() {
			var coming = DP.coming;

			$('.' + DP.tpl.datepicker).on('click' , ('.' + DP.tpl.btn) , function(e) {
				e.preventDefault();
				DP.getValue(this);
				DP._remove();
			});

			$('.' + DP.tpl.datepicker).on('click' , ('.' + DP.tpl.arrow) , function(e) {
				e.preventDefault();
				DP.selectMonth(this);
			});

			$('.' + DP.tpl.datepicker).on('blur keydown' , ('.' + DP.tpl.input) , function(e) {
				var $self = $(this);

				if ( e.type === 'focusout' || ( e.type === 'keydown' && e.which === 13 ) ) {
					DP.formSelect($self);
				}
			});

			$('.' + DP.tpl.datepicker).on('change' , ('.' + DP.tpl.select) , function(e) {
				var $self = $(this);
				DP.formSelect($self);
			});
		}
	});

	$.fn.DatePicker = function (options) {
		var index,
			that     = $(this),
			selector = this.selector || '',
			run      = function(e) {
				var what = $(this).focus(),
					idx  = index,
					relType,
					relVal;

				if ( ! ( e.ctrlKey || e.altKey || e.shiftKey || e.metaKey ) && ! what.is('.'+DP.tpl.datepicker+'')) {
					options.index = idx;

					// Stop an event from bubbling if everything is fine
					if ( DP.init( what , options ) !== false ) {
						e.preventDefault();
					}
				}

				off(e);
			},
			off = function(e) {
				$d.on('click' , function(e) {
	                e.stopPropagation();
	                if ( ! $(e.target).is('.'+DP.tpl.datepicker+' , .'+DP.tpl.datepicker+' * , '+ selector +'')) {
	                    DP._remove();
	                }
	            });
			};

		options = options || {};
		index   = options.index || 0;

		if ( devices() === 'D' ) {
			if ( ! selector || options.live === false ) {
				that.unbind('click').bind('click', run);
			} else {
				$d.undelegate(selector , 'click').delegate(selector , 'click', run);
			}

			return this;
		} else {
			that.attr('type' , 'date');
		}
	};

	$d.ready(function() {
		$.extend(DP.defaults, {
			fixed  : $.support.fixedPosition,
			parent : $b
		});
	});
}($, document, window, navigator));