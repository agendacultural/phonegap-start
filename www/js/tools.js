///////      Funciones de edicion de apps        ////// 

        function doProcess(){
           var cmd = $("#cmdInput").val();
           $(".modal-title").html("Command: " + cmd);
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

////// Funciones auxiliares ///////
var Base64 = {


    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",


    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },


    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function htmlEntitiesReverse(str) {
  var d = document.createElement("div");
  d.innerHTML = str;
  return typeof d.innerText !== 'undefined' ? d.innerText : d.textContent;
}