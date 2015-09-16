///////      Funciones de edicion de apps        ////// 

function doProcess(){
   var cmdRaw = $("#cmdInput").val();
   var cmd = normalize(cmdRaw);
   switch (cmd.toLowerCase()){
      case "agregar boton":
        modalTitle = 'Add Button';
        modalBody = '<form role="form" \
                        <div class="form-group"> \
                           <label class="pull-left" for="inputButtonCaption">Caption:</label><input  class="form-control" id="inputButtonCaption"></input> \
                        </div> \
                        <div class="form-group"> \
                           <label class="pull-left" for="inputButtonOnClick">OnClick:</label><input  class="form-control" id="inputButtonOnClick"></input> \
                        </div> \
                     </form>';
        break;
      default:
        modalTitle = 'Unrecognized Command';
        modalBody = 'No params ';
   }
   $(".modal-title").html(modalTitle);
   $(".modal-body").html(modalBody);
}

 function onClick(){
        $.ajax
        ({
              type: "GET",
              url: "http://telus.crontopia.com/telus/updatecode.php",
              async: true,
              success: function (data){
                if (data == "OK"){
                  alert('Rebuild In Progress !!...');
                } else {
                  alert('Error in Rebuild Process...' + data);
                }
              },
              error: function (msg){
                alert('Sorry no se pudo contactar al proxy de telus: ' + msg.responseText);
              }
        });
    }
    function getContent(path){
         
        $.ajax
        ({
              type: "GET",
              url: "https://api.github.com/repos/agendacultural/phonegap-start/contents/" + path,
              async: true,
              dataType: 'json',
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('Authorization', make_base_auth('agendacultural@misideas.me', 'psclcdGH7'));
             },
              success: function (data){
                  var coden = data.content;
                  var codeRaw = Base64.decode(coden.replace('','\n'));
                  $("#codeArea").val(codeRaw);
                  $("#fileSha").text(data.sha);
                  $("#filePath").text(data.path);
                  
              },
              error: function (msg){
                alert('Sorry no se pudo obtener el contenido del index: ' + msg.responseText);
              }
        });
    }
    function updateContent(){
        var content = btoa($("#codeArea").val());
        var fileSha = $("#fileSha").text();
        var filePath = $("#filePath").text();
        var msg = "Updating " + filePath;
        var dataObject = {
            'message': msg,
            'content': content,
            'sha': fileSha
        };
        $.ajax
        ({
              type: "PUT",
              url: "https://api.github.com/repos/agendacultural/phonegap-start/contents/" + filePath,
              contentType: 'application/json',
              data: JSON.stringify(dataObject),
              async: true,
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('Authorization', make_base_auth('agendacultural@misideas.me', 'psclcdGH7'));
             },
              success: function (data){
                 $("#fileSha").text(data.content.sha);
                 alert("Successfull Updated " + data.content.name );
              },
              error: function (msg){
                alert('Sorry no se pudo actualizar el contenido del index: ' + msg.responseText);
              }
        });
    }
    function make_base_auth(user, password) {
       var tok = user + ':' + password;
       var hash = btoa(tok);
       return 'Basic ' + hash;
    }
    function onPreview(){
        var ref = window.open('http://telus.crontopia.com/website/www/', '_blank', 'location=no');
        ref.addEventListener('loadstart', function() { alert(event.url); });
    }

    $('#frmImport').submit(function(e){
     e.preventDefault();
      //CHECK ERRORS ON USER SIDE, IF TRUE, END OPERATIONS.
      if (import_errors()){
         return false;
      }
      import_db();
      return false;
   });

  function import_errors(){
    if ($('#fileImportData').val() == ''){
      alert('No file(s) selected. Please choose a image file to upload.');
      return true;
    }
    if ($('#fileImportData').val() != ''){
      var ext = $('#fileImportData').val().split('.').pop().toLowerCase();
      if($.inArray(ext, ['jpeg','jpg','png']) == -1) {
        alert('Invalid file type. Please choose a Image file to upload.');
        return true;
      }
    }
    return false;
 }

 function import_db(){
      var formData = new FormData();
      var imageFile = $('#fileImportData')[0].files[0];
      var msg = 'New image uploaded';
      var content = btoa(imageFile);
      var dataObject = {
            'message': msg,
            'content': content
      };
      $.ajax
        ({
              type: "PUT",
              url: "https://api.github.com/repos/agendacultural/phonegap-start/contents/www/img/prima.jpg",
              contentType: 'application/json',
              data: JSON.stringify(dataObject),
              async: true,
              beforeSend: function (xhr) {
                 xhr.setRequestHeader('Authorization', make_base_auth('agendacultural@misideas.me', 'psclcdGH7'));
             },
              success: function (data){
                 $("#fileSha").text(data.content.sha);
                 alert("Successful Upload Image " + data.content.name );
              },
              error: function (msg){
                alert('Sorry no se pudo subir la imagen: ' + msg.responseText);
              }
        });
}

function goEdit(){
   if ($("#editBtn").html() == "Edit"){
    $("#editPanel").css ("display","block");
    $("#runPanel").css ("display","none");
    $("#editBtn").html("Run");
   } else {
    $("#editPanel").css ("display","none");
    $("#runPanel").css ("display","block");
    $("#editBtn").html("Edit");
   }
}
