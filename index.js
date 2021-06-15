// With enormous thanks to Will Boyd's textarea highlighting example
// https://codersblock.com/blog/highlight-text-inside-a-textarea/

col_a = [" little girl", " young girl", " little boy", " young boy", " boy ", " little child", " young child", " child ", " kid ", "infant", "preteen", "pre-teen", "shota", " loli ", "toddler", " pedoph", "middle school", "elementary school", "preschool", "high school", "playground", "wee lass", "young lass", "wee lad", "young lad", "primary school", "pre-pubescent", "kindergarten", "young daughter", "young son", "too young", "the baby", " youth ", " youths", / (?:[1-9]|1[0-7]|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen)([ -])years?\1old/gi];
col_b = [" penis", " dick", " cock", " vagina", " pussy", " clit", " breast", " ass ", " cum", " semen", " sex", "masturbate", " suck", "fuck ", "fucking ", " moan", " throb", " thrust", " tit ", " tits ", "jizz", " anal", " anus ", " hump", " molest", " testicle", "fucks ", " orgasm", " rape ", " raped ", " rapes ", " raping "];

// yeah, browser sniffing sucks, but there are browser-specific quirks to handle that are not a matter of feature detection
var ua = window.navigator.userAgent.toLowerCase();
var isIE = !!ua.match(/msie|trident\/7|edge/);
var isWinPhone = ua.indexOf('windows phone') !== -1;
var isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);

function applyHighlights(text) {
  text = text
    .replace(/\n$/g, '\n\n');
    for (rule of col_a) {
      text = text.replace(new RegExp(rule,'gi'), '<mark class="col-a">$&</mark>');
    }
    for (rule of col_b) {
      text = text.replace(new RegExp(rule,'gi'), '<mark class="col-b">$&</mark>');
    }
  
  if (isIE) {
    // IE wraps whitespace differently in a div vs textarea, this fixes it
    text = text.replace(/ /g, ' <wbr>');
  }
  
  return text;
}

function handleInput() {
  var text = $('textarea').val();
  var highlightedText = applyHighlights(text);
  $('.highlights').html(highlightedText);
}

function handleScroll() {
  var scrollTop = $('textarea').scrollTop();
  $('.backdrop').scrollTop(scrollTop);
  
  var scrollLeft = $('textarea').scrollLeft();
  $('.backdrop').scrollLeft(scrollLeft);  
}

function fixIOS() {
  // iOS adds 3px of (unremovable) padding to the left and right of a textarea, so adjust highlights div to match
  // is it 8px now? I do not know.
  $('.highlights').css({
    'padding-left': '+=8px',
    'padding-right': '+=8px'
  });
}

function bindEvents() {
  $('textarea').on({
    'input': handleInput,
    'scroll': handleScroll
  }); 
}

$(function(){
  if (isIOS) {
    fixIOS();
  }
  bindEvents();
  handleInput();
});
