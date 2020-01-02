var _system_loaded = 0;
var _system_load = 0;
var _panel_1_drawn = 0;
var _panel_2_drawn = 0;

//document.getElementsByClassName('class1 class2');
console.log('[*] i am here');


function _site_check() {
  console.log('checking site');
  var _url = window.location.href.replace('https://','');
  console.log(_url);
  if(_url == 'www.binance.com/en/futures/BTCUSDT') {
    // it's currect site
    console.log('[*] it`s binence futures for BTCUSDT.');
    _system_load = 1;
  }
  else {
    // it's not currect site
    _system_load = -1;
  }
}

var _site_checker_id = setInterval(function() {
  if(_system_load == 1) {
    clearInterval(_site_checker_id);
    console.log('[*] currect site detected.');
    console.log('[*] Launching system.');
    _panel_1_drawer_run();
    _panel_2_drawer_run();
    _price_checker_run();

  }
  else if(_system_load == -1) {
    console.log('[*] it`s not correct site.');
    clearInterval(_site_checker_id);
  }
  else {
    _site_check();
  }
}, 1000);

var _price_checker = -1;
var _panel_1_drawer = -1;
var _panel_2_drawer = -1;
var _ex_price_value = 0;
var _price_value = 0;
var _market_price_value = 0;
var _positions_box = null;
var _position_pair = 'BTCUSDT';
var _position_size = 0;
var _position_entry = 0;
var _position_liquid = 0;
var _position_real_profit = 0;
var _position_fake_profit = 0;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function _price_checker_run() {
  _price_checker = setInterval(function() {
      if(document.getElementsByClassName('sc-bdVaJa sc-jzJRlG SCrHj')[0] != null && document.getElementsByClassName('sc-bdVaJa sc-jzJRlG SCrHj')[0] != undefined)
      {
        _ex_price_value = _price_value;
        _price_value = parseFloat(document.getElementsByClassName('sc-bdVaJa sc-jzJRlG SCrHj')[0].innerHTML.replace(',','').replace('↓','').replace('↑','').trim());
        _market_price_value = parseFloat(document.getElementsByClassName('sc-bdVaJa sc-jzJRlG libsuS')[0].innerHTML.replace(',','').replace('↓','').replace('↑','').trim());

        if(_ex_price_value != _price_value) {
          // price changed
          document.getElementById('bpro-real-price').innerHTML = numberWithCommas(_price_value);
          // get box of open positions

          var _positions_tab_active = false;
          var _pos_s = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.jDrElC.trade-history > div.sc-bdVaJa.sc-bwzfXH.sc-hMqMXs.cwilFo.position-tab > div > div.sc-bdVaJa.brEdkJ > div:nth-child(1) > div > div > div:nth-child(9) > div");
          if(_pos_s != null) {
            _positions_tab_active = true;
          }
          if(_positions_tab_active) {

            _positions_box = $('.sc-bdVaJa.sc-bwzfXH.eNjMLO:nth-child(1)');
            if(_positions_box != null && _positions_box != undefined) {
              var _boxes = document.getElementsByClassName('sc-bdVaJa sc-bwzfXH isPNTX');
              if(_boxes.length == 7) {
                //console.log('boxes found');
                //console.log(_boxes);
                // get position

                if(_boxes[1].children[0] != null && _boxes[1].children[0] != undefined){
                  console.log('size : ' + _boxes[1].children[0].innerHTML);
                  _position_size = parseFloat(_boxes[1].children[0].innerHTML.trim());
                }
                if(_boxes[2].children[0] != null && _boxes[2].children[0] != undefined) {
                  console.log('entry : ' + _boxes[2].children[0].innerHTML);
                  _position_entry = parseFloat(_boxes[2].children[0].innerHTML.trim().replace(',',''));
                }
                if(_boxes[4].children[0] != null && _boxes[4].children[0] != undefined)
                {
                  console.log('liquid : ' + _boxes[4].children[0].innerHTML);
                  if(_boxes[4].children[0].innerHTML.trim() == '-') {
                    _position_liquid = 0;
                  }
                  else {
                    _position_liquid = parseFloat(_boxes[4].children[0].innerHTML.trim().replace(',',''));
                  }
                }
                //
                //_position_pair = _boxes[0].children.innerHTML.trim();
                //
                //
              }
              else {
                // no open positions
                console.log('no open positions');
                _position_size = 0;
                _position_entry = 0;
                _position_liquid = 0;
                _position_real_profit = 0;
                _position_fake_profit = 0;
              }
            }
          }

          document.getElementById('bpro-size').innerHTML = _position_size;
          document.getElementById('bpro-entry').innerHTML = numberWithCommas(_position_entry);
          document.getElementById('bpro-liquid').innerHTML = numberWithCommas(_position_liquid);
          //
          // calculate real profit



          if(_position_size != 0) {

            var _maker_fee = _position_entry * (_position_size > 0 ? _position_size : -1 * _position_size) * 0.02 * 0.01;
            var _taker_fee = _price_value * (_position_size > 0 ? _position_size : -1 * _position_size) * 0.04 * 0.01;
            var _temp_profit=  0;
            var _temp_profit2= 0;

            var _tp = document.getElementById('bpro-tp').value;
            var _sl = document.getElementById('bpro-sl').value;
            var _tp_profit = 0;
            var _sl_loss = 0;

            if(_position_size > 0) {
              // it`s long
              _temp_profit = (_price_value - _position_entry) * _position_size;
              document.getElementById('bpro-size').style.color = '#00c582';
              _temp_profit2 = _temp_profit - _maker_fee - _taker_fee;



              if(_temp_profit2 > 0) {
                // in profit
                _position_real_profit = _temp_profit2.toFixed(3);
                document.getElementById('bpro-real-profit').style.color = '#00c582';
                document.getElementById('bpro-real-profit-container').style.borderColor = '#00c582';

              }
              else if(_temp_profit2 == 0) {
                // break-even
                _position_real_profit = 0;
                document.getElementById('bpro-real-profit').style.color = '#fff';
                document.getElementById('bpro-real-profit-container').style.borderColor = '#fff';
              }
              else {
                // in loss
                _position_real_profit = _temp_profit2.toFixed(3);
                document.getElementById('bpro-real-profit').style.color = '#ff0372';
                document.getElementById('bpro-real-profit-container').style.borderColor = '#ff0372';


              }


              if(_tp > 0 && _sl > 0) {
                _tp_profit = (_tp - _position_entry) * _position_size - _maker_fee - (_tp * _position_size * 0.04 * 0.01);
                _sl_loss = (_position_entry - _sl) * _position_size + _maker_fee + (_sl * _position_size * 0.04 * 0.01);

                if(_temp_profit2 > 0) {
                  document.getElementById('bpro-fake-profit').style.color = '#00c582';
                  document.getElementById('bpro-fake-profit-container').style.borderColor = '#00c582';
                  document.getElementById('bpro-fake-profit').innerHTML = parseFloat(1 + (_temp_profit2 / _sl_loss)).toFixed(2) + 'x';
                }
                else if(_temp_profit2 == 0) {
                  document.getElementById('bpro-fake-profit').style.color = '#fff';
                  document.getElementById('bpro-fake-profit-container').style.borderColor = '#fff';
                  document.getElementById('bpro-fake-profit').innerHTML = "0";
                }
                else {
                  document.getElementById('bpro-fake-profit-container').style.borderColor = '#ff0372';
                  document.getElementById('bpro-fake-profit').style.color = '#ff0372';
                  document.getElementById('bpro-fake-profit').innerHTML = '' + parseFloat((_temp_profit2 / _sl_loss)).toFixed(2) + 'x';
                }

              }


              /*
              if(_market_price_value > _position_entry) {
                // in profit
                _position_fake_profit = ((_market_price_value - _position_entry) * _position_size).toFixed(3);
                document.getElementById('bpro-fake-profit').style.color = '#00c582';
                document.getElementById('bpro-fake-profit-container').style.borderColor = '#00c582';
              }
              else if(_market_price_value == _position_entry) {
                // break-even
                _position_fake_profit = 0;
                document.getElementById('bpro-fake-profit').style.color = '#fff';
                document.getElementById('bpro-fake-profit-container').style.borderColor = '#fff';
              }
              else {
                // in loss
                _position_fake_profit = -1 * ((_position_entry - _market_price_value) * _position_size).toFixed(3);
                document.getElementById('bpro-fake-profit-container').style.borderColor = '#ff0372';
                document.getElementById('bpro-fake-profit').style.color = '#ff0372';
              }
              */
            }
            else {
              // it`s short
              _temp_profit = (_price_value - _position_entry) * _position_size;
              _temp_profit2 = _temp_profit - _maker_fee - _taker_fee;

              document.getElementById('bpro-size').style.color = '#ff0372';
              if(_temp_profit2 < 0) {
                // in loss
                _position_real_profit = _temp_profit2.toFixed(3);
                document.getElementById('bpro-real-profit').style.color = '#ff0372';
                document.getElementById('bpro-real-profit-container').style.borderColor = '#ff0372';
              }
              else if(_temp_profit2 == 0) {
                // break-even
                _position_real_profit = 0;
                document.getElementById('bpro-real-profit').style.color = '#fff';
                document.getElementById('bpro-real-profit-container').style.borderColor = '#fff';
              }
              else {
                // in profit
                _position_real_profit = _temp_profit2.toFixed(3);
                document.getElementById('bpro-real-profit').style.color = '#00c582';
                document.getElementById('bpro-real-profit-container').style.borderColor = '#00c582';
              }

              if(_tp > 0 && _sl > 0) {
                _tp_profit = (_position_entry - _tp) * -1 * _position_size - _maker_fee - (_tp * -1 * _position_size * 0.04 * 0.01);
                _sl_loss = (_sl - _position_entry) * -1 *_position_size + _maker_fee + (_sl * -1 *_position_size * 0.04 * 0.01);

                if(_temp_profit2 > 0) {
                  document.getElementById('bpro-fake-profit').style.color = '#00c582';
                  document.getElementById('bpro-fake-profit-container').style.borderColor = '#00c582';
                  document.getElementById('bpro-fake-profit').innerHTML = parseFloat(1 + (_temp_profit2 / _sl_loss)).toFixed(2) + 'x';
                }
                else if(_temp_profit2 == 0) {
                  document.getElementById('bpro-fake-profit').style.color = '#fff';
                  document.getElementById('bpro-fake-profit-container').style.borderColor = '#fff';
                  document.getElementById('bpro-fake-profit').innerHTML = "0";
                }
                else {
                  document.getElementById('bpro-fake-profit-container').style.borderColor = '#ff0372';
                  document.getElementById('bpro-fake-profit').style.color = '#ff0372';
                  document.getElementById('bpro-fake-profit').innerHTML = '' + parseFloat((_temp_profit2 / _sl_loss)).toFixed(2) + 'x';
                }
              }

              /*
              if(_market_price_value > _position_entry) {
                // in loss
                _position_fake_profit = ((_market_price_value - _position_entry) * _position_size).toFixed(3);
                document.getElementById('bpro-fake-profit').style.color = '#ff0372';
                document.getElementById('bpro-fake-profit-container').style.borderColor = '#ff0372';
              }
              else if(_market_price_value == _position_entry) {
                // break-even
                _position_fake_profit = 0;
                document.getElementById('bpro-fake-profit').style.color = '#fff';
                document.getElementById('bpro-fake-profit-container').style.borderColor = '#fff';
              }
              else {
                // in profit
                _position_fake_profit = ((_position_entry - _market_price_value) * -1 * _position_size).toFixed(3);
                document.getElementById('bpro-fake-profit').style.color = '#00c582';
                document.getElementById('bpro-fake-profit-container').style.borderColor = '#00c582';
              }
              */

            }
          }
          else {
            document.getElementById('bpro-size').style.color = '#fff';
          }

          //document.getElementById('bpro-fake-profit').innerHTML = parseFloat(_position_fake_profit).toFixed(3); // _boxes[5].child[0].innerHTML;
          document.getElementById('bpro-real-profit').innerHTML = parseFloat(_position_real_profit).toFixed(3);//_boxes[5].innerHTML;
          document.getElementById('bpro-breakeven').innerHTML = numberWithCommas(parseFloat(_position_real_profit).toFixed(3));
          // 0 : PAIR (BTCUSDT)
          // 1 : SIZE (ex : 0.1)
          // 2 : ENTRY PRICE
          // 3 : MARKET PRICE
          // 4 : LIQUID PRICE
          // 5 : PNL (ROE)
          // 6 : CLOSE POSITION

        }
        // console.log(document.getElementsByClassName('sc-bdVaJa sc-jzJRlG SCrHj')[0].innerHTML);
      }
      else {
        // console.log('[*] price label not found.');
      }
  }, 200);
}
function _panel_1_drawer_run() {
  _panel_1_drawer = setInterval(function() {
      if(_panel_1_drawn == 1) {
        clearInterval(_panel_1_drawer);
        return;
      }
      if(document.getElementById('bpro-k1-panel-1') != null && document.getElementById('bpro-k1-panel-1') != undefined)
      {
        // panel 1 drawn
        _panel_1_drawn = 1;
        clearInterval(_panel_1_drawer);
      }
      else {
        // console.log('[*] price label not found.');
        draw_panel_1();
      }
  }, 500);
}
function _panel_2_drawer_run() {

  _panel_2_drawer = setInterval(function() {
      if(_panel_2_drawn == 1) {
        clearInterval(_panel_2_drawer);
        return;
      }
      if(document.getElementById('bpro-k1-panel-2') != null && document.getElementById('bpro-k1-panel-2') != undefined)
      {
        // panel 1 drawn
        _panel_2_drawn = 1;
        clearInterval(_panel_2_drawer);
      }
      else {
        // console.log('[*] price label not found.');
        draw_panel_2();
      }
  }, 500);
}

var _panel_1 = '<div id="bpro-k1-panel-1" style="position:absolute;width:100%;height:100%;background:#12161c;padding:5px;color:#fff;text-align:center;justify-content: center;align-items: center;"><img id="bpro-k1-logo" src="http://arastehinsurance.ir/bpro/bprologo.png" /><br><div style="direction:ltr;text-align:left;padding:5px;width:80%;border:1px #707070 solid;border-radius:5px;font-size:10pt;line-height:16px;"><table style="width:90%"><tr><td style="text-align:center;"><span id="bpro-size">-</span></td><td style="text-align:center;"><span id="bpro-entry">-</span></td></tr><tr style="display:none;"><td>Price : </td><td style="text-align:center;"><span id="bpro-real-price">-</span></td></tr><tr><td id="bpro-real-profit-container" style="text-align:center;border:3px #fff solid;border-radius:2px;padding:3px 7px 3px 7px;" ><span id="bpro-real-profit" style="font-size:16pt">-</span></td><td id="bpro-fake-profit-container" style="text-align:center;padding:3px 7px 3px 7px;border:1px #fff solid;border-radius:2px;"><span id="bpro-fake-profit" style="font-size:10pt;">-</span></td></tr><tr><td>Liq. Price : </td><td><span id="bpro-liquid">-</span></td></tr><tr><td>BreakEven @ </td><td><span id="bpro-breakeven">-</span></td></tr></table></div><div style="direction:ltr;text-align:left;padding:5px;width:80%;border:1px #707070 solid;border-radius:5px;font-size:10pt;line-height:16px;margin-top:3px;"><div class="sc-bdVaJa sc-hSdWYo gfLSHz" height="31"><div width="70" color="foreground" font-size="0" class="sc-bdVaJa sc-jzJRlG sc-kAzzGY eYCCEM">StopLoss</div>	<input id="bpro-sl" type="number" step="0.001" min="0" max="" color="white" font-size="2" class="sc-bdVaJa sc-eHgmQL hkreOw" value="" style="text-align: right;">	<div color="foreground" font-size="0" class="sc-bdVaJa sc-jzJRlG sc-kAzzGY lebACr"></div></div><div class="sc-bdVaJa sc-hSdWYo gfLSHz" style="margin-top:3px;" height="31"><div width="70" color="foreground" font-size="0" class="sc-bdVaJa sc-jzJRlG sc-kAzzGY eYCCEM">Take Profit</div>	<input id="bpro-tp" type="number" step="0.001" min="0" max="" color="white" font-size="2" class="sc-bdVaJa sc-eHgmQL hkreOw" value="" style="text-align: right;">	<div color="foreground" font-size="0" class="sc-bdVaJa sc-jzJRlG sc-kAzzGY lebACr"></div></div></div></div>';
// <table style="margin-top:3px;"><tr><td style="width:45%;*border:1px #00c582 solid;border-radius:2px;padding:5px;text-align:center;"><button width="100%" onclick="bpro_buy(0)" display="inline-flex" color="white" class="sc-bdVaJa sc-ifAKCX kZZDMH">LONG</button></td><td style="width:45%;*border:1px #ff0372 solid;border-radius:2px;padding:5px;text-align:center;"><button onclick="bpro_sell(0)" width="80%" display="inline-flex" color="white" class="sc-bdVaJa sc-ifAKCX TDRiD">SHORT</button></td></tr></table>
var _panel_2 = '<div id="bpro-k1-panel-2" style="position:absolute;width:100%;height:100%;background:#fff;display:none;">Binance Pro Panel...<br><br>by Keyvan Arasteh</div>';

// bpro-real-price
// bpro-entry
// bpro-size
// bpro-real-profit
// bpro-liquid
// bpro-fake-profit

async function bpro_sell(_step) {
  //alert('not implamented yet');
  //$('#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.brEdkJ > div.sc-bdVaJa.gUfSNz > div:nth-child(1) > div');
  var _short_price = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.brEdkJ > div.sc-bdVaJa.gUfSNz > div:nth-child(1) > div > input");
  var _long_price = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.gSUIPj > div.sc-bdVaJa.gUfSNz > div:nth-child(1) > div > input");
  var _short_size = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.brEdkJ > div.sc-bdVaJa.gUfSNz > div:nth-child(2) > div > input");
  var _long_size = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.gSUIPj > div.sc-bdVaJa.gUfSNz > div:nth-child(2) > div > input");
  var _short_button = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.brEdkJ > button");
  var _long_button = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.gSUIPj > button");
  console.log('selling');
  _short_price.focus();
  await sleep(1500);
  console.log('setting price to ' + _price_value);
  _short_price.value = _price_value;
  await sleep(1500);
  _short_size.focus();
  await sleep(1500);
  console.log('setting size to ' + document.getElementById('bpro-qty').value);
  _short_size = document.getElementById('bpro-qty').value;
  await sleep(1500);
  _short_button.click();
}

function typeText(item, text, delay, i) {
    $(item).append(text.charAt(i))
        .delay(delay)
        .promise()
        .done(function() {
          if(i<text.length) {
            i++;
            typeText(item, text, delay, i);
          }
    });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function bpro_buy(step) {
  var _short_price = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.brEdkJ > div.sc-bdVaJa.gUfSNz > div:nth-child(1) > div > input");
  var _long_price = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.gSUIPj > div.sc-bdVaJa.gUfSNz > div:nth-child(1) > div > input");
  var _short_size = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.brEdkJ > div.sc-bdVaJa.gUfSNz > div:nth-child(2) > div > input");
  var _long_size = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.gSUIPj > div.sc-bdVaJa.gUfSNz > div:nth-child(2) > div > input");
  var _short_button = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.brEdkJ > button");
  var _long_button = document.querySelector("#__next > div > div.sc-bdVaJa.sc-bwzfXH.sc-htpNat.bimDPE > div.sc-bdVaJa.sc-bwzfXH.kiaYtS > div.sc-bdVaJa.gSUIPj > button");
  _long_price.focus();
  await sleep(100);
  _long_price.value = _price_value;
  await sleep(100);
  _long_size.focus();
  await sleep(100);
  _long_size = document.getElementById('bpro-qty').value;
  await sleep(100);
  _long_button.click();

}

function draw_panel_1() {
  // sc-bdVaJa sc-bwzfXH UzzDt  (panel1 classes)
  // ReactVirtualized__Grid ReactVirtualized__List (panel2 classes)
  if(document.getElementsByClassName('sc-bdVaJa sc-bwzfXH sc-bxivhb irmyMb')[0] != null && document.getElementsByClassName('sc-bdVaJa sc-bwzfXH sc-bxivhb irmyMb')[0] != undefined) {
    $('.sc-bdVaJa.sc-bwzfXH.sc-htpNat.JorPh').append(_panel_1);
  }


}

// not implemented yet
function draw_panel_2() {
  if(document.getElementsByClassName('sc-bdVaJa sc-bwzfXH UzzDt')[0] != null && document.getElementsByClassName('sc-bdVaJa sc-bwzfXH UzzDt')[0] != undefined) {
    //$('.sc-bdVaJa, .sc-bwzfXH, .sc-bxivhb, .bidObA').after(_panel_2);
    $('.sc-bdVaJa.sc-bwzfXH.UzzDt').append(_panel_2);
  }
 }
