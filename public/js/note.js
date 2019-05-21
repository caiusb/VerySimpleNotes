function deleteNote(path) {
  var note = $(event.target).closest("div").find('a.list-group-item')
  var title = note.text();
  var path = note.attr("href");
  $("#deleteModalBody").text("Are you sure you want to delete note \"" + title + "\"?");
  $("#ok-button").click(function() {
    $.ajax({
      url: path,
      type: 'DELETE',
      success: function() {
        window.location.href="/notes"
      }
    });
  })
  $("#cancel-button").click(function() {
    $("#deleteModal").modal('hide');
  });
  $("#deleteModal").modal();
}

$(".note-delete").toArray().forEach((el) => el.addEventListener("click", deleteNote));
