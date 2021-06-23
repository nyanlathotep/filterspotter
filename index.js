// With enormous thanks to Will Boyd's textarea highlighting example
// https://codersblock.com/blog/highlight-text-inside-a-textarea/

var col_a = [
  " little girl", " young girl",
  " little boy", " young boy", " boy ",
  " little child", " young child", " child ", " kid ",
  "infant", "preteen", "pre-teen",
  "shota", " loli ", "toddler",
  "middle school", "elementary school", "preschool", "high school",
  "playground",
  "wee lass", "young lass", "wee lad", "young lad",
  "primary school", "pre-pubescent", "kindergarten",
  "young daughter", "young son",
  "too young",
  "the baby", " youth ", " youths",
  " small child",
  "kiddo",
  / (?:[1-9]|1[0-7]|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen)([ -])years?\1old/gi];
var col_b = [
  " penis", " dick", " cock",
  " vagina", " pussy", " clit",
  " breast", " ass ",
  " cum", " semen",
  " sex", "masturbate", " suck",
  "fuck ", "fucking ",
  " moan", " throb",
  " thrust",
  " tit ", " tits ",
  "jizz",
  " anal", " anus ", " hump", " molest", " testicle",
  "fucks ", " orgasm", " rape ", " raped ", " rapes ", " raping "];
var col_star = [
  " pedoph"
]
var bindings = [
  {rules: col_a, cls: 'col-a', title: 'Column A (Age-Related)'},
  {rules: col_b, cls: 'col-b', title: 'Column B (Sex-Related)'},
  {rules: col_star, cls: 'col-star', title: 'Column * (Hits Filter Alone)'}
];
// yeah, browser sniffing sucks, but there are browser-specific quirks to handle that are not a matter of feature detection
var ua = window.navigator.userAgent.toLowerCase();
var isIE = !!ua.match(/msie|trident\/7|edge/);
var isWinPhone = ua.indexOf('windows phone') !== -1;
var isIOS = !isWinPhone && !!ua.match(/ipad|iphone|ipod/);

function applyHighlights(text) {
  text = text
    .replace(/\n$/g, '\n\n');
    for (var binding of bindings) {
      for (var rule of binding.rules) {
        text = text.replace(new RegExp(rule,'gi'), '<mark class="'+binding.cls+'">$&</mark>');
      }
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
  $('#help').on('click', fill_help);
  $('#rules').on('click', fill_rules);
  $('#log').on('click', fill_log);
}

function fill_text(el, text) {
  $(el).val(text);
  handleInput();
}

var help_text = `Put your text in here to check for filter terms, e.g.:
You are a high school student in a real analysis class.

Column A (age-related) terms are blue:
  infantry, young lady, the babysitter
Column B (sex-related) terms are orange:
  cockpit, breastplate, fuck this shit

The filter will say "Uh oh" if terms from both columns are in the last 400 characters, and "AI doesn't know what to say" if they're anywhere in context or if the AI hits the filter.`

function fill_help() {
  fill_text('#filter-input', help_text);
}

var rules_intro = `* Note that the spacing matters on literal entries (surrounded and separated by |)
* For regex rules, you might want to try a regex testing site like regex101.com to test them in isolation
* All rules are case insensitive
`

function generate_rules() {
  var text = [rules_intro];
  for (var binding of bindings) {
    text.push(binding.title+':');
    var plain_rules = [];
    var re_rules = [];
    for (var rule of binding.rules) {
      if (rule instanceof RegExp) {
        re_rules.push(rule.source);
      } else {
        plain_rules.push(rule);
      }
    }
    text.push('|'+plain_rules.join('|')+'|');
    for (var re of re_rules) {
      text.push(re);
    }
    text.push('');
  }
  return text.join('\n');
}

function fill_rules() {
  fill_text('#filter-input', generate_rules());
}

var changelog = [
  {date: '2021-06-23', items: ['Added "kiddo" (seriously?']},
  {date: '2021-06-16', items: ['Moved " pedoph" to a new column and added " small child"', 'Added buttons to fill help, patterns, and changelog']},
  {date: '2021-06-15', items: ['Brought implementation up to date with the list on https://rentry.co/vfigb']}
];

function generate_log() {
  var lines = [];
  for (var day of changelog) {
    lines.push(day.date);
    for (var item of day.items) {
      lines.push('* '+item);
    }
  }
  return(lines.join('\n'));
}

function fill_log() {
  fill_text('#filter-input', generate_log());
}

$(function(){
  if (isIOS) {
    fixIOS();
  }
  bindEvents();
  fill_help();
});
