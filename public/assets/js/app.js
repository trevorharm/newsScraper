

$(document).ready(function() {
    var winwidth = $(window).width();
    $("img.main-img").attr({
        width: winwidth
    });
    $(window).bind("resize", function() {
        var winwidth = $(window).width();
        $("img.main-img").attr({
            width: winwidth
        });
    });
    $(".scrape").click(function(event) {
        event.preventDefault();
        $.get("/api/fetch").then(function(data) {
            $(".articles").remove();
            $.get("/").then(function(){
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>", function(result) {
                  location.reload()
                });
            });
        });
    });
    $(".save-article").click(function() {
        var articleToSave = {};
        articleToSave.id = $(this).data("id");
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToSave
        }).then(function(data) {
            location.reload();
        });
    });
    $(".removeSaved").click(function() {
        var articleToremoveSaved = {};
        articleToremoveSaved.id = $(this).data("id");
        articleToremoveSaved.saved = false;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToremoveSaved
        }).then(function(data) {
            location.reload();
        });
    });
    $('.saved-buttons').on('click',  function () {
        var thisId = $(this).attr("data-value");
  
        $("#saveButton").attr({"data-value": thisId});
  
        $.get("/notes/" + thisId, function(data){
            console.log(data);
            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#notestext').val('');
  
  
            $('#noteModalLabel').append(' ' + thisId);
            //add notes to body of modal, will loop through if multiple notes
            for(var i = 0; i<data.note.length; i++) {
                var button = ' <a href=/deleteNote/' + data.note[i]._id + '><i class="pull-right fa fa-times fa-2x deletex" aria-hidden="true"></i></a>';
                $('#notesBody').append('<div class="panel panel-default"><div class="noteText panel-body">' + data.note[i].body + '  ' + button + '</div></div>');
            }
        });
    });
  
    $(".savenote").click(function() {
    // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-value");
  
  
    // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "POST",
        url: "/notes/" + thisId,
        data: {
          // Value taken from title input
  
          // Value taken from note textarea
          body: $("#notestext").val().trim()
        }
      })
        // With that done
      .done(function(data) {
          // Log the response
          //console.log(data);
          $('#noteModal').modal('hide');
  
      });
    });
  });
  






