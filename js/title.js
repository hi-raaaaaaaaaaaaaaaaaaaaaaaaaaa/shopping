function noscroll(e){
   e.preventDefault();
}
 
$('#off').on('click', function(){
   document.addEventListener('touchmove', noscroll, {passive: false});
   document.addEventListener('wheel', noscroll, {passive: false});
});
 
$('#on').on('click', function(){
   document.removeEventListener('touchmove', noscroll);
   document.removeEventListener('wheel', noscroll);
});
