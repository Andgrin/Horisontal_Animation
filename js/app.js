var BACK_ANIMATION_DURATION = 200;
var FRONT_ANIMATION_DURATION = 600;
var UP_FRONT_ANIMATION_DURATION = FRONT_ANIMATION_DURATION-(BACK_ANIMATION_DURATION/2);
var SCROLL_DURATION = 800;


var pageCount = 1;
var lastScrollTop = 0;
var skipTime = 0;
var items = null;
var currentItem = null;

function initElements() {
   items = $(".wrap").children();
   console.log('items', items);
}

function childClass () {
	$(".wrap").children().addClass("new");
	$("ul li:first-child").removeClass("new").addClass("actual");
	console.log("classes were added");
};

function getCurrentAnimationElements(isPrev) {

   var index = pageCount + (isPrev ? -1 : 0),
       item = $(items[index]);
   return {
      item: item,
      shadow: item.find('.shadow-layer'),
      left: item.find('.left'),
      right: item.find('.right')
   };
}

function initialPosition() {

	$(".new .left").css("left", "-50vw");
	$(".new .right").css("right", "-50vw");
	$(".inner-shadow").css("opacity", 0);
	console.log("outside windows were positioned");
};

function actualOldAnimateMoveToBack () {
   var elements = getCurrentAnimationElements(true);

   elements.shadow.animate({opacity: "1"}, BACK_ANIMATION_DURATION, 'easeOutExpo'); //наложить на окно с lass = actual-old втуренюю тень
   elements.item.animate({ top: "10vh", left: "10vw",width: "80vw",height: "80vh"}, BACK_ANIMATION_DURATION, 'easeOutCirc'); 
   elements.left.animate({ top: "10vh", left: "10vw", height: "80vh", width: "40vw" }, BACK_ANIMATION_DURATION, 'easeOutCirc'); 
   elements.right.animate({ top: "10vh", right: "10vw", height: "80vh", width: "40vw" }, BACK_ANIMATION_DURATION , 'easeOutCirc'); //уменьшить размеры окна 
}
function actualOldAnimateMoveToFront () {
   var elements = getCurrentAnimationElements(true);

   elements.item.delay(UP_FRONT_ANIMATION_DURATION).animate({ top: 0, left: 0, width: "100vw", height: "100vh"}, BACK_ANIMATION_DURATION, 'easeOutCirc'); 
   elements.left.delay(UP_FRONT_ANIMATION_DURATION).animate({ top: 0,left: 0, height: "100vh", width: "50vw" }, BACK_ANIMATION_DURATION, 'easeOutCirc'); 
   elements.right.delay(UP_FRONT_ANIMATION_DURATION).animate({ top: 0, right: 0, height: "100vh", width: "50vw" }, BACK_ANIMATION_DURATION, 'easeOutCirc');
   elements.shadow.delay(UP_FRONT_ANIMATION_DURATION).animate({opacity: 0}, BACK_ANIMATION_DURATION);
}

function actualNewAnimateMoveInside () {
   var elements = getCurrentAnimationElements(false);

   elements.left.animate({left: 0}, FRONT_ANIMATION_DURATION, 'easeInOutQuart');
   elements.right.animate({right: 0}, FRONT_ANIMATION_DURATION, 'easeInOutQuart'); //сдвинуть окна
}
function actualNewAnimateMoveOutside () {
   var elements = getCurrentAnimationElements(false);

   elements.left.animate({left: "-50vw"}, FRONT_ANIMATION_DURATION, 'easeInOutQuart');
   elements.right.animate({right: "-50vw"}, FRONT_ANIMATION_DURATION, 'easeInOutQuart'); //раздвинуть окна
}

function frontAnimation () {
   actualOldAnimateMoveToBack();
	actualNewAnimateMoveInside();
};


function backAnimation () {
   actualNewAnimateMoveOutside();
   actualOldAnimateMoveToFront();
};

function footerUpAnimation () {
   actualOldAnimateMoveToBack();
   $("footer").animate({bottom: 0}, BACK_ANIMATION_DURATION);
}
function footerDownAnimation () {
   $("footer").animate({bottom: "-100px"}, BACK_ANIMATION_DURATION);
   actualOldAnimateMoveToFront();
}


$(document).on('mousewheel', function(event){

   event.preventDefault();
   event.stopPropagation();

   var currentTime = new Date().getTime();
  
   if (currentTime < skipTime) {
      console.log('skipping');
      return false;
   }
  
  // console.log('scrolling', event);

   var delta = event.originalEvent.wheelDelta;
   //   console.log("delta", event);    
    
   if (delta < 0){
      // downscroll code
      if ( pageCount > 0 && pageCount < 4 ) {
         
         frontAnimation();
         pageCount++;
      } else if (pageCount == 4) {
         
         footerUpAnimation();
         pageCount++;
      } else {
         return false;
      }
      console.log("down scroll");
      
    } else {
      // upscroll code
      if ( pageCount > 1 && pageCount < 5 ) {
         pageCount--;
         backAnimation();
         
      } else if ( pageCount == 5 ) {
         pageCount--;
         footerDownAnimation();
      }
      console.log("up scroll");
    }
   
   console.log(delta, pageCount);

   var statusOfFistPage = $("#section-one").hasClass("old");
   if(statusOfFistPage === false) {
      $(".navigation").removeClass("light-navigation");
   } else {
      $(".navigation").addClass("light-navigation");
   }

   skipTime = currentTime + SCROLL_DURATION;
    

   return false;
});



initElements();
childClass();
initialPosition();
console.log("hey");









