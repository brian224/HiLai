(function (window , document , jQuery , undefined) {
    'use strict';

    var _shop = [{
        location : '台北天母SOGO',
        area     : [{
            store : '海港自助餐廳',
            time  : '午餐、下午餐、晚餐'
        }]
    } , {
        location : '台北忠孝SOGO',
        area     : [{
            store : '漢來蔬食',
            time  : '午餐、下午餐、晚餐'
        }]
    } , {
        location : '台北敦化SOGO',
        area     : [{
            store : '海港自助餐廳',
            time  : '午餐、下午餐、晚餐'
        }]
    } , {
        location : '桃園台茂購物中心',
        area     : [{
            store : '海港自助餐廳',
            time  : '午餐、下午餐、晚餐'
        },{
            store : '漢來蔬食',
            time  : '午餐、下午餐、晚餐'
        }]
    } , {
        location : '台中廣三SOGO',
        area     : [{
            store : '海港自助餐廳',
            time  : '午餐、下午餐、晚餐'
        },{
            store : '翠園小館',
            time  : '午餐、晚餐'
        }]
    } , {
        location : '南坊購物中心',
        area     : [{
            store : '海港自助餐廳',
            time  : '午餐、下午餐、晚餐'
        },{
            store : '漢來蔬食',
            time  : '午餐、晚餐'
        }]
    } , {
        location : '高雄佛陀紀念館',
        area     : [{
            store : '漢來蔬食',
            time  : '午餐、晚餐'
        }]
    } , {
        location : '高雄漢神巨蛋購物廣場',
        area     : [{
            store : '海港自助餐廳',
            time  : '午餐、下午餐、晚餐'
        },{
            store : '漢來蔬食',
            time  : '午餐、晚餐'
        },{
            store : '翠園粵菜餐廳',
            time  : '午餐、晚餐'
        }]
    } , {
        location : '高雄漢來飯店',
        area     : [{
            store : '福園台式海鮮餐廳',
            time  : '午餐、晚餐'
        },{
            store : '翠園粵菜餐廳',
            time  : '午餐、晚餐'
        },{
            store : '日本料理弁慶',
            time  : '午餐、晚餐'
        },{
            store : '紅陶上海湯包',
            time  : '午餐、晚餐'
        },{
            store : '港式海鮮火鍋',
            time  : '午餐、晚餐'
        },{
            store : '池畔餐廳',
            time  : '午餐、下午餐、晚餐'
        },{
            store : '名人坊高級粵菜餐廳',
            time  : '午餐、晚餐'
        },{
            store : '海港自助餐廳',
            time  : '早餐、午餐、下午餐、晚餐'
        },{
            store : '鐵板燒',
            time  : '午餐、晚餐'
        },{
            store : '牛排館',
            time  : '午餐、晚餐'
        },{
            store : '龍蝦酒殿',
            time  : '晚餐'
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
            var _restStr = '',
                _idx     = $(this).find('option:selected').data('shop');

            for (var j = 0; j < window._shop[_idx].area.length; j++) {
                _restStr += '<option data-time="' + window._shop[_idx].area[j].time + '">' + window._shop[_idx].area[j].store + '</option>';
            }

            $('.jq-booking-rest').append(_restStr).prop('disabled', false);
        });

        $('.jq-booking-rest').on('change', function(){
            var _timeStr = '',
                _time    = $(this).find('option:selected').data('time').split('、');

            for (var k = 0; k < _time.length; k++) {
                _timeStr += '<option>' + _time[k] + '</option>';
            }

            $('.jq-booking-time').html(_timeStr).prop('disabled', false);
        });
    });
}(window, document, jQuery));