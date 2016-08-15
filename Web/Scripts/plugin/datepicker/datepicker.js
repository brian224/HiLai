/*!
 * sugarfun DatePicker - jQuery Plugin
 * version: 1.0.0 (mon , 24 Aug 2015)
 * @requires jQuery v1.9 or later
 *
 * Copyright 2015 sugarfun ciro
 */

(function ($, document, window, navigator) {
	'use strict';

	var H = $('html'),
		B = $('body'),
		W = $(window),
		D = $(document),
		DP = $.DatePicker = function () {
			DP.init.apply( this , arguments );
		},
		IE = navigator.userAgent.match(/msie/i),
		isQuery	= function(obj) {
			return obj && obj.hasOwnProperty && obj instanceof $;
		},
		isString = function(str) {
			return str && $.type(str) === "string";
		},
		isPercentage = function(str) {
			return isString(str) && str.indexOf('%') > 0;
		},
		isScrollable = function(el) {
			return ( el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
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
		Device = /Android|webOS|iPad|BlackBerry/i,
		UserAgent = function () {
			if ( W.width() < 768 ) {
				return 'Mobile';
			} else {
				if ( Device.test( navigator.userAgent ) ) {
					return 'Tablet';
				} else {
					return 'PC';
				}
			}
		};

	$.extend( DP , {
		version : '1.0.0',
		defaults : {
			width : null,
			height : null,
			maxDate : null,
			minDate : null,
			speed : 300,
			format : {
				months : null,
				weeks : null
			},
			types : 'YYYY/MM/DD',
			tpl : {
				wrap  : '<div class="sugarfun-datepicker"><div class="sugarfun-datepicker-hd"><div class="sugarfun-datepicker-tools"><button class="sugarfun-datepicker-arrow is-prev" data-value="-1">prev<i></i></button><time class="sugarfun-datepicker-times"></time><button class="sugarfun-datepicker-arrow is-next" data-value="1">next<i></i></button></div><ul class="sugarfun-datepicker-week"></ul></div><div class="sugarfun-datepicker-bd"><ul class="sugarfun-datepicker-date"></ul></div></div>',
				btn   : '.sugarfun-datepicker-button',
				arrow : '.sugarfun-datepicker-arrow'
			},
			set : {
				data        : null,
				maxDate     : null,
				minDate     : null,
				newDay      : null,
				newMonth    : null,
				newYear     : null,
				nowDay      : new Date().getDate(),
				nowMonth    : new Date().getMonth(),
				nowYear     : new Date().getFullYear(),
				months      : ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				weeks       : ['日', '一', '二', '三', '四', '五', '六'],
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
				lastDate    : {
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
				},
				getNewDate : function (Dates) {
					return new Date(Dates);
				},
				format : {
					header : function(date , format) {
						var z = {
							M    : ( date.getMonth() + 1 )
						};

						format = format.replace(/(M+)/g , function (v) {
							return ( ( v.length > 1 ? '0' : '' ) + eval( 'z.' + v.slice( -1 ) ) ).slice( -2 );
						});

						return format.replace(/(Y+)/g , function (v) {
							return date.getFullYear().toString().slice( -v.length );
						});
					},
					inputs : function(date , format) {
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
					}
				}
			}
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

			coming.set.monthsIdx = coming.set.monthsIdx + parseInt($(element).data('value'), 10);

        	if ( coming.set.monthsIdx < 0 ) {
                coming.set.monthsIdx = 11;
                coming.set.year --;
            } else if (coming.set.monthsIdx > 11) {
                coming.set.monthsIdx = 0;
                coming.set.year ++;
            }

            coming.set.appendDates = new Date(coming.set.year + '/' + coming.set.months[coming.set.monthsIdx] + '/' + coming.set.newDay);
            coming.date.empty();

            DP._calendar(coming.set.appendDates);
		},
		getValue : function(element) {
			var coming = DP.coming;
			
			$(coming.element[0]).val($(element).data('date'));
		},
		_parseISO8601 : function(dateString) {
			var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
				date   = new Date(NaN), month,
				parts  = isoExp.exec(dateString);
				
			if ( parts ) {
				month = +parts[2];

				date.setFullYear(parts[1], month - 1, parts[3]);
			
				if( month != date.getMonth() + 1 ) {
					date.setTime(NaN);
				}
			}

			return date;
		},
		_start: function (index) {
			var coming = {},
				obj,
				dateValue,
				types;

			index = getScalar( index );
			obj   = DP.group[ index ] || null;

			if ( ! obj ) {
				return false;
			}

			coming = $.extend(true , {} , DP.opts , obj);
			coming.group = DP.group;
			coming.index = index;
			coming.wrap = $(coming.tpl.wrap);

			// Give a chance for callback or helpers to update coming item (type, title, etc)
			DP.coming = coming;

			$.extend( coming , {
				hd    : $('.sugarfun-datepicker-hd', coming.wrap),
				tools : $('.sugarfun-datepicker-tools' , coming.wrap),
				times : $('.sugarfun-datepicker-times' , coming.wrap),
				week  : $('.sugarfun-datepicker-week', coming.wrap),
				bd    : $('.sugarfun-datepicker-bd', coming.wrap),
				date  : $('.sugarfun-datepicker-date', coming.wrap)
			});

			types = coming.element.val() ? coming.element.val().substring((/(Y+)/g.exec(coming.types).index) , (/(Y+)/g.exec(coming.types).index + 4)) + '-' + coming.element.val().substring((/(M+)/g.exec(coming.types).index) , (/(M+)/g.exec(coming.types).index + 2)) + '-' + coming.element.val().substring((/(D+)/g.exec(coming.types).index) , (/(D+)/g.exec(coming.types).index + 2)) : '';

			dateValue = coming.element.val() ? new Date(types) : '';
			
			DP._remove();
			B.append(coming.wrap);
			DP._calendar(dateValue);
			DP._dateOpen();
		},
		_remove : function() {
			var coming = DP.coming;

			coming.wrap.fadeOut(coming.speed , function(){
				$('.' + coming.wrap[0].className).remove();
			});
		},
		_calendar : function (selectDate) {
			var coming = DP.coming;

			coming.wrap.css({
				top    : coming.element.offset().top + coming.element.outerHeight(),
				left   : coming.element.offset().left,
				width  : coming.width ? ( /%/g.test(coming.width) ? coming.width : getScalar(coming.width) ) : coming.element.width(),
				height : coming.height ? ( /%/g.test(coming.height) ? coming.height : getScalar(coming.height) ) : null
			}).finish().fadeIn(coming.speed);

			coming.set.date      = selectDate ? selectDate : new Date(),
			coming.set.maxDate   = coming.maxDate ? new Date(coming.maxDate) : new Date(9999, 1, 1),
			coming.set.minDate   = coming.minDate ? new Date(coming.minDate) : new Date(1, 1, 1),
			coming.set.newDay    = coming.set.date.getDate(),
			coming.set.newMonth  = coming.set.date.getMonth(),
			coming.set.newYear   = ( coming.set.date.getYear() <= 200 ) ? ( coming.set.date.getYear() + 1900 ) : coming.set.date.getYear(),
			coming.set.monthsIdx = coming.set.newMonth,
			coming.set.year      = coming.set.newYear,
			coming.set.today     = coming.set.format.inputs(new Date() , coming.types.toUpperCase()),
			coming.set.getDays   = coming.set.monthDays[coming.set.newMonth],
			coming.set.setDate   = coming.set.date;

			if ( coming.format === 'EN' ) {
				coming.set.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				coming.set.weeks  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
			} else {
				if ( coming.format.months ) {
					if ( coming.format.months.split(',').length === 12 ) {
						coming.set.months = [];

						for ( var i = 0 ; i < coming.format.months.split(',').length ; i ++ ) {
							coming.set.months.push($.trim(coming.format.months.split(',')[i]));
						};
					}
				}
				
				if ( coming.format.weeks ) {
					if ( coming.format.weeks.split(',').length === 7 ) {
						coming.set.weeks  = [];
						for ( var i = 0 ; i < coming.format.weeks.split(',').length ; i ++ ) {
							coming.set.weeks.push($.trim(coming.format.weeks.split(',')[i]));
						};
					}
				}
			}


			if ( ( coming.set.newYear % 4 ) === 0 && coming.set.newYear !== 1900 ) {
				coming.set.monthDays[1] = 29;
			}

			coming.week.empty();

			for (var i = 0 ; i < coming.set.weeks.length ; i++) {
				coming.week.append('<li>'+ coming.set.weeks[i] +'</li>');
			};

			coming.set.setDate.setDate(1);

			if ( coming.set.setDate.getDate() === 2 ) {
				coming.set.setDate = setDate(0);
			}

			coming.set.setDate = coming.set.setDate.getDay();

			coming.set.lastDate.Year  = coming.set.newMonth > 0 ? coming.set.year : ( coming.set.year - 1 );
			coming.set.thisDate.Year  = coming.set.year;
			coming.set.nextDate.Year  = coming.set.newMonth < 11 ? coming.set.year : ( coming.set.year + 1 );
			coming.set.lastDate.Month = coming.set.newMonth > 0 ? coming.set.months[( coming.set.newMonth - 1 )] : coming.set.months[11];
			coming.set.thisDate.Month = coming.set.months[ ( coming.set.newMonth ) ];
			coming.set.nextDate.Month = coming.set.newMonth < 11 ? coming.set.months[ ( coming.set.newMonth + 1 ) ] : coming.set.months[0];

			coming.set.headerTypes = coming.types.toUpperCase().replace(/[-,.\/]D+|D+[-,.\/]/g , '');

			coming.times.text(coming.set.format.header( ( ! isNaN( new Date(coming.set.thisDate.Year + '-' + coming.set.thisDate.Month ) ) ? new Date(coming.set.thisDate.Year + '-' + coming.set.thisDate.Month ) : DP._parseISO8601( ( coming.set.thisDate.Year + '-' + coming.set.thisDate.Month + '-' + '01' ) ) ) , coming.set.headerTypes));

			for ( var i = 1 ; i <= coming.set.setDate ; i ++ ) {
				if ( coming.set.newMonth - 1 < 0 ) {
					coming.set.appendDates = ( coming.set.lastDate.Year + '' ) + '/' + ( coming.set.lastDate.Month + '' ) + '/' + ( ( coming.set.monthDays[ ( coming.set.monthDays.length - 1 ) ] - coming.set.setDate + i ) + '');
				} else {
					coming.set.appendDates = ( coming.set.lastDate.Year + '' ) + '/' + ( coming.set.lastDate.Month + '' ) + '/' + ( ( coming.set.monthDays[ ( coming.set.newMonth - 1 ) ] - coming.set.setDate + i ) + '' );
				}

				coming.set.formatDate = coming.set.format.inputs(new Date(coming.set.appendDates) , coming.types.toUpperCase());

				if ( coming.set.getNewDate(coming.set.appendDates) <= coming.set.maxDate && coming.set.minDate && coming.set.getNewDate(coming.set.appendDates) > coming.set.minDate ) {
					coming.set.appendDate = '<button class="sugarfun-datepicker-button" data-date="'+ coming.set.formatDate +'">' + coming.set.getNewDate(coming.set.appendDates).getDate() + '</button>';
				} else {
					coming.set.appendDate = '<em>' + coming.set.getNewDate(coming.set.appendDates).getDate() + '</em>';
				}
				
				coming.date.append('<li class="is-last">' + coming.set.appendDate + '</li>');
			
				coming.set.week ++;
			};
			
			for ( var i = 1 ; i <= coming.set.getDays ; i ++ ) {
				coming.set.appendDates = ( coming.set.thisDate.Year + '' ) + '/' + ( coming.set.thisDate.Month + '' ) + '/' + ( ( ( i > 9 ) ? i : ( '0' + i ) ) + '' );
				coming.set.formatDate  = coming.set.format.inputs(new Date(coming.set.appendDates) , coming.types.toUpperCase());
			
				if ( coming.set.getNewDate(coming.set.appendDates) <= coming.set.maxDate && coming.set.minDate && coming.set.getNewDate(coming.set.appendDates) > coming.set.minDate ) {
					coming.set.appendDate = '<button class="sugarfun-datepicker-button" data-date="'+ coming.set.formatDate +'">' + i + '</button>';
				} else {
					coming.set.appendDate = '<em>' + i + '</em>';
				}

				coming.date.append('<li class="is-this">' + coming.set.appendDate + '</li>');
			
				coming.set.week ++;
			
				if ( coming.set.week === 7 ) {
					coming.set.week = 0;
				}
			};
			
			for ( var i = 1 ; coming.set.week !== 0 ; i ++ ) {
				coming.set.appendDates = ( coming.set.nextDate.Year + '' ) + '/' + ( coming.set.nextDate.Month + '' ) + '/' + ( ( ( i > 9 ) ? i : ( '0' + i ) ) + '' );
				coming.set.formatDate  = coming.set.format.inputs(new Date(coming.set.appendDates) , coming.types.toUpperCase());
				
				if ( coming.set.getNewDate(coming.set.appendDates) <= coming.set.maxDate && coming.set.minDate && coming.set.getNewDate(coming.set.appendDates) > coming.set.minDate ) {
					coming.set.appendDate = '<button class="sugarfun-datepicker-button" data-date="'+ coming.set.formatDate +'">' + i + '</button>';
				} else {
					coming.set.appendDate = '<em>' + i + '</em>';
				}

				coming.date.append('<li class="is-next">' + coming.set.appendDate + '</li>');
			
				coming.set.week ++;
			
				if ( coming.set.week === 7 ) {
					coming.set.week = 0;
				}
			};
		},
		_dateOpen : function() {
			var coming = DP.coming;

			$('.' + coming.wrap[0].className).on('click' , coming.tpl.btn , function(e) {
				e.preventDefault();
				DP.getValue(this);
				DP._remove();
			});

			$('.' + coming.wrap[0].className).on('click' , coming.tpl.arrow , function(e) {
				e.preventDefault();
				DP.selectMonth(this);
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

				if ( ! ( e.ctrlKey || e.altKey || e.shiftKey || e.metaKey ) && ! what.is('.sugarfun-datepicker')) {
					options.index = idx;

					// // Stop an event from bubbling if everything is fine
					if ( DP.init( what , options ) !== false ) {
						e.preventDefault();
					}
				}

				off(e);
			},
			off = function(e) {
				D.on('click' , function(e) {
	                e.stopPropagation();
	                if ( ! $(e.target).is('.sugarfun-datepicker , .sugarfun-datepicker * , '+ selector +'')) {
	                    DP._remove();
	                }
	            });
			};

		options = options || {};
		index   = options.index || 0;

		if ( UserAgent() === 'PC' ) {
			if ( ! selector || options.live === false ) {
				that.unbind('click').bind('click', run);
			} else {
				D.undelegate(selector , 'click').delegate(selector , 'click', run);
			}

			return this;
		} else {
			that.attr('type' , 'date');
		}
	};

	D.ready(function() {
		$.extend(DP.defaults, {
			fixed  : $.support.fixedPosition,
			parent : B
		});
	});
}($, document, window, navigator));