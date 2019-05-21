function deleteNote() {
  var note = $(event.target).closest("div").find('a.list-group-item')
  var title = note.text();
  var path = note.attr("href");
  $("#deleteModalBody").text("Are you sure you want to delete note " + title + "?");
  $("#deleteModalBody").find("#ok-button")
  $("#deleteModal").modal();

}

$(".note-delete").toArray().forEach((el) => el.addEventListener("click", deleteNote));
