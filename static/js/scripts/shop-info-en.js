(function (window , document , jQuery , undefined) {
    'use strict';

    var _shop = [{
        location : 'SOGO Tianmu Store',
        area     : [{
            store : 'Hi-Lai Harbour Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        }]
    } , {
        location : 'SOGO Zhongxiao Store',
        area     : [{
            store : 'Hi-Lai Vegetarian Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        }]
    } , {
        location : 'SOGO Dunhua Store',
        area     : [{
            store : 'Hi-Lai Harbour Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        }]
    } , {
        location : 'Tai Mall',
        area     : [{
            store : 'Hi-Lai Harbour Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        },{
            store : 'Hi-Lai Vegetarian Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        }]
    } , {
        location : 'SOGO Taichung',
        area     : [{
            store : 'Hi-Lai Harbour Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        },{
            store : 'Hi-Lai Jade Garden Restaurant-Taichung Branch',
            time  : 'Lunch,Dinner'
        }]
    } , {
        location : 'T.S. Mall',
        area     : [{
            store : 'Hi-Lai Harbour Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        },{
            store : 'Hi-Lai Vegetarian Restaurant',
            time  : 'Lunch,Dinner'
        }]
    } , {
        location : 'Buddha Museum',
        area     : [{
            store : 'Hi-Lai Vegetarian Restaurant',
            time  : 'Lunch,Dinner'
        }]
    } , {
        location : 'Hi-Lai Arena',
        area     : [{
            store : 'Hi-Lai Harbour Restaurant',
            time  : 'Lunch,Afternoon tea,Dinner'
        },{
            store : 'Hi-Lai Vegetarian Restaurant',
            time  : 'Lunch,Dinner'
        },{
            store : 'Cantonese Jade Garden Restaurant',
            time  : 'Lunch,Dinner'
        }]
    } , {
        location : 'Grand Hi-Lai Hotel',
        area     : [{
            store : 'Cantonese Jade Garden Restaurant',
            time  : 'Lunch,Dinner'
        },{
            store : 'Cantonese Jade Garden Restaurant',
            time  : 'Lunch,Dinner'
        },{
            store : 'Japanese Restaurant Ben Kei',
            time  : 'Lunch,Dinner'
        },{
            store : 'Shanghainese Dumpling',
            time  : 'Lunch,Dinner'
        },{
            store : 'Seafood Hotpot Restaurant',
            time  : 'Lunch,Dinner'
        },{
            store : 'Pool Side Cafe',
            time  : 'Lunch,Afternoon tea,Dinner'
        },{
            store : 'Celebrity Cuisine',
            time  : 'Lunch,Dinner'
        },{
            store : 'Hi-Lai Harbour Restaurant',
            time  : 'Breakfast,Lunch,Afternoon tea,Dinner'
        },{
            store : 'Teppanyaki Restaurant',
            time  : 'Lunch,Dinner'
        },{
            store : 'Steak House',
            time  : 'Lunch,Dinner'
        },{
            store : 'Lobster Bar',
            time  : 'Dinner'
        }]
    }];

    if ( ! window._shop ) {
        window._shop = _shop;
    }

    projects.$w.load(function(){
        var _shopStr = '';

        for (var i = 0; i < window._shop.length; i++) {
            _shopStr += '<option data-shop="' + i + '">' + window._shop[i].location + '</option>';
        }

        $('.jq-booking-shop').append(_shopStr);

        $('.jq-booking-shop').on('change', function(){
            var _restStr = '<option>Select Brand</option>',
                _idx     = $(this).find('option:selected').data('shop');

            for (var j = 0; j < window._shop[_idx].area.length; j++) {
                _restStr += '<option data-time="' + window._shop[_idx].area[j].time + '">' + window._shop[_idx].area[j].store + '</option>';
            }

            $('.jq-booking-rest').html(_restStr).prop('disabled', false);
        });

        $('.jq-booking-rest').on('change', function(){
            var _timeStr = '',
                _time    = $(this).find('option:selected').data('time').split(',');

            for (var k = 0; k < _time.length; k++) {
                _timeStr += '<option>' + _time[k] + '</option>';
            }

            $('.jq-booking-time').html(_timeStr).prop('disabled', false);
        });
    });
}(window, document, jQuery));