/* ==============Lov Patsariya Code============ */
function headerbg(){
	var scroll = $(window).scrollTop();  
    if (scroll >= 100) {
        $("header").addClass("header-bg");
    } else {
    	$("header").removeClass("header-bg");
    }
}

$(window).scroll(function() {    
    headerbg();
});



$(document).ready(function(){
    

// $(".scan_btn").click(function(){
	
//   $(".not_received_fund").removeClass("active");
//   $(".scan_loader").addClass("active");
//   setTimeout(function(){
// 	  $(".scan_loader").removeClass("active");
// 	  $(".received_fund").addClass("active");
//   },500);  
// });


 /* ========For Image Change========== */
// $('.select-profile-img input[type=file]').change(function() {
//   readURL(this);
// });
// function readURL(input) {

// 	if (input.files && input.files[0]) {
// 		var reader = new FileReader();

// 		reader.onload = function(e) {
// 			$('.select-profile-img img').attr('src', e.target.result).fadeIn('slow');
// 		}
// 		reader.readAsDataURL(input.files[0]);
// 	}
// }
		
		/* =========Marqee Animate======== */
$('.marquee').marquee({
    //speed in milliseconds of the marquee
    duration:20000,
    //gap in pixels between the tickers
    gap: 50,
    //time in milliseconds before the marquee will start animating
    delayBeforeStart: 0,
    //'left' or 'right'
    direction: 'left',
    //true or false - should the marquee be duplicated to show an effect of continues flow
    duplicated: true
});
		
		
});/* ==============Ready End============ */


