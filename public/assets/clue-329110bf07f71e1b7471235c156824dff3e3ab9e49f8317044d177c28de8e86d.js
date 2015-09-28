$(document).ready(function(){
  onLoad();
  onAjax();
});

$(document).ajaxComplete(function() {
  onAjax();
});

function onAjax(){
  $('.edit').off()

  $('.delete').click(function(e){
  e.preventDefault();
  var clueId = $(this).parents('.clue-wrapper').children('.clue-info').children('.clue-id').text();
  var listId = $(this).parents('.clue-wrapper').children('.clue-info').children('.list-id').text();
  deleteClue(clueId, listId);
});

  $('.edit').on('click', (function(e){
    $(this).parent().parent().children(".edit_clue").slideToggle(1000);
  }));
}

function onLoad(){
  $("#clue-answer-form").submit(function(e){
    e.preventDefault();

    getLocation(function(location){
      $("#longitude").val(location.coords.longitude);
      $("#latitude").val(location.coords.latitude);
      $('#clue-answer-form').unbind("submit").submit();
    });
  });

  $("#new-clue-form").submit(function(e){
    e.preventDefault()

    getLocation(function(location){
      $("#longitude").val(location.coords.longitude);
      $("#latitude").val(location.coords.latitude);
      createClue()
    });
  });

  $('#new-from-address-submit-button').click(function(e){
    e.preventDefault();
    fetchAddressLocation();
  });

  $('.edit-clue-form').submit(function(e){
    e.preventDefault();
    var clueId = $(this).parents('.clue-wrapper').children('.clue-info').children('.clue-id').text();
    var listId = $(this).parents('.clue-wrapper').children('.clue-info').children('.list-id').text();
    var text = $(this).children('#text').val();
    var answer = $(this).children('#answer').val();
    editClue(clueId, list_id, text, answer);
  });
}

function getLocation(callback) {
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

      street: $('#add-clue-wrapper').find('#street').val(),
      city: $('#add-clue-wrapper').find('#city').val(),
      state: $('#add-clue-wrapper').find('#state').val(),
      zip: $('#add-clue-wrapper').find('#zip').val()}
    },
    success: function(message){
      $("#longitude").val(message['latitude']);
      $("#latitude").val(message['longitude']);
      createClue(message);
    }
  });
}

function createClue(){
  var listId = $('#list_id').val();
  $.ajax({
    url: "/lists/" + listId + "/clues",
    type: 'POST',
    dataType: "html",
    data: {
      answer: $('#new-clue-form').find('#answer').val(),
      text: $('#new-clue-form').find('#text').val(),
      latitude: $('#new-clue-form').find('#latitude').val(),
      longitude: $('#new-clue-form').find('#longitude').val(),
      list_id: $('#new-clue-form').find('#list_id').val()
      },
    success: function(message){
      // debugger
      $('#all-clues').append(message)
      $('form').trigger('reset');
      $('#new-clue-address-form').html('<button id="toggle-address" class="btn btn-small">Let me input an address.</button>')
      $("#new-from-address-submit-button").hide()
      $("#new-clue-form-submit-button").show()
    }
  });

}

function deleteClue(clueId, listId){
  $.ajax({
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
      $( "#clue-" + clueId ).find('.edit_clue').slideToggle(1000);
    }
  });
}

