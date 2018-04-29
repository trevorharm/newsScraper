$(document).ready(function() {

//    function home(){}
   
    $("#scraper").on("click", function(){
        $.get("/scrape").then(
        alert("Scrape Complete!")
        );
    });
});