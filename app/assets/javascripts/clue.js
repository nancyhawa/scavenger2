$(document).ready(function(){
  $("#clue-answer-form").submit(function(e){
    e.preventDefault();

    getLocation(function(location){
      $("#longitude").val(location.coords.longitude);
      $("#latitude").val(location.coords.latitude);
      $('#clue-answer-form').unbind("submit").submit();
    });
  });

  $('#new-from-address').submit(function(e){
    e.preventDefault();
    fetchAddressLocation();
  });

  $('#new-clue-form').submit(function(e){
    e.preventDefault();
    createClue();
  });

  $('.delete').click(function(e){
    e.preventDefault();
    // debugger
    // $(this).parent().parent()
    var clueId = $(this).parent().parent().children('.clue-info').children('.clue-id').text();
    var listId = $(this).parent().parent().children('.clue-info').children('.list-id').text();
    deleteClue(clueId, listId);
  });

  $('.edit').click(function(e){
    $(this).parent().parent().children(".edit_clue").slideToggle(1000);
  });

  $('.edit-clue-form').submit(function(e){
    e.preventDefault();
    var listId = $(this).parent().parent().children('.clue-info').children('.list-id').text();
    var clueId = $(this).parent().parent().children('.clue-info').children('.clue-id').text();
    var text = $(this).children('#text').val();
    var answer = $(this).children('#answer').val();
    editClue(clueId, list_id, text, answer);
  });

});

function getLocation(callback) {
    // callback
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(callback);
    } else {
        $("#test").html("Geolocation is not supported by this browser.");
    }
}

function fetchAddressLocation(callback){
    var listId = $('#list_id').val();
    $.ajax({
      url: "/lists/" + listId + "/newcluefromaddress",
      type: 'POST',
      data: { address: {
        street: $('#street').val(),
        city: $('#city').val(),
        state: $('#state').val(),
        zip: $('#zip').val()}
      },
      success: function(message){
        $("#longitude").val(message['latitude']);
        $("#latitude").val(message['longitude']);
        createClue();
      }
    });
  }

function addClueToList(){
  $('#ol-clues').append(
    "<li>" + $('#text').val() + "<br>" +
    $('#answer').val() + "</li>"
  );
}

function createClue(){
  var listId = $('#list_id').val();
  $.ajax({
    url: "/lists/" + listId + "/clues",
    type: 'POST',
    data: {
      answer: $('#answer').val(),
      text: $('#text').val(),
      latitude: $('#latitude').val(),
      longitude: $('#longitude').val(),
      list_id: $('#list_id').val()
      },
    success: function(message){
      addClueToList();
      $('form').trigger('reset');
    }
  });

}

function deleteClue(clueId, listId){

  $.ajax({
    // /lists/:list_id/clues/:id(.:format)
    url: "/lists/" + listId + "/clues/" + clueId,
    type: 'DELETE',
    data: {
      clue_id: clueId
      },
    success: function(message){
      $( "#clue-" + clueId ).remove();
    }
  });
}

function editClue(clueId, listId, text, answer){

  $.ajax({
    url: "/lists/" + listId + "/clues/" + clueId,
    type: 'PATCH',
    data: {
      text: text,
      answer: answer
      },
    success: function(message){
      $( "#clue-" + clueId ).children('.clue-info').children('.clue-text').text(text);
      $( "#clue-" + clueId ).children('.clue-info').children('.clue-answer').text(answer);
      $( "#clue-" + clueId ).children('.edit_clue').slideToggle(1000);
    }
  });
}
// //validations for address
