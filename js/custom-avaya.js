window.onload = function() {
  var startPos;
  var geoSuccess = function(position) {
    startPos = position;
    var lat = startPos.coords.latitude;
    var long = startPos.coords.longitude;
    var coordenadas = lat + "," + long;
    console.log("Coordenadas: " + coordenadas);
  };
  var geoError = function(error) {
    switch (error.code) {
      case 0:
        console.log('Ha ocurrido un Error Desconocido con el GPS: ');
        $('#modalerrores').modal('show');
        $('#mensajeerror').text("Ha ocurrido un Error Desconocido con el GPS: ");
        break;
      case 1:
        console.log('Ha ocurrido un error con los permisos del GPS ');
        $('#modalerrores').modal('show');
        $('#mensajeerror').text("Ha ocurrido un Error con los permisos del GPS ");
        break;
      case 2:
        console.log('Tu equipo no cuenta con GPS o no se puede acceder a el');
        $('#modalerrores').modal('show');
        $('#mensajeerror').text("Tu equipo no cuenta con GPS o no se puede acceder a el");
        break;
      case 3:
        console.log('No se pudo conectar al GPS');
        $('#modalerrores').modal('show');
        $('#mensajeerror').text("No se puede conectar al GPS");
        break;
      default:
        console.log('Este error no se ha implementadp:' + error.code);
        $('#modalerrores').modal('show');
        $('#mensajeerror').text("Este error no s eha implementado" + error.code);
        break;
    }
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  var watchId = navigator.geolocation.watchPosition(function(position) {
    var lat = startPos.coords.latitude;
    var long = startPos.coords.longitude;
    var coordenadas = lat + "," + long;
    $('#lat_txt').val(lat);
    $('#long_txt').val(long);
    console.log("Coordenadas RealTime: " + coordenadas);
  });
  if (typeof(Storage) !== "undefined") {} else {
    console.log("tu dispositivo no cuenta con localStorage");
  }
};
$(document).ready(function() {
  var ajustes = localStorage.getItem("ajustes");
  if (ajustes == "1") {
    console.log("Ya guardaste Valores");
    var nombre = localStorage.getItem("nombre");
    var poliza = localStorage.getItem("poliza");
    var host = localStorage.getItem("host");
    var numero = localStorage.getItem("numero");
    var puerto = localStorage.getItem("puerto");
    var empresa = localStorage.getItem("empresa");
    $("#nombre_txt").val(nombre);
    $("#pass_txt").val(poliza);
    $("#host_txt").val(host);
    $("#num_txt").val(numero);
    $("#puerto_txt").val(puerto);
    $("#nombreempresa").text(empresa);
  } else {
    console.log("Nunca guardaste Valores");
    $("#nombre_txt").val("John Doe");
    $("#pass_txt").val("12345");
    $("#host_txt").val("amv.collaboratory.avaya.com");
    $("#num_txt").val("2681322102");
    $("#puerto_txt").val("443");
  }
  $('#dAudio').hide();
  $('#dcolgar').hide();
  $('#dVideo').hide();
  $("#limpiarbtn").click(function() {
    localStorage.clear();
    $("#snombre_txt").val("John Doe");
    $("#spoliza_txt").val("12345");
    $("#shost_txt").val("amv.collaboratory.avaya.com");
    $("#snumero_txt").val("2681322102");
    $("#spuerto_txt").val("443");
    $("#nombreempresa").val("");
    $('#modalajustes').modal('hide');
    location.reload();
  });
  $("#ajustesbtn").click(function() {
    $('#modalajustes').modal('show');
    var ajustes = localStorage.getItem("ajustes");
    if (ajustes == "1") {
      console.log("Ya guardaste Valores");
      var nombre = localStorage.getItem("nombre");
      var poliza = localStorage.getItem("poliza");
      var host = localStorage.getItem("host");
      var numero = localStorage.getItem("numero");
      var puerto = localStorage.getItem("puerto");
      var empresa = localStorage.getItem("empresa");
      $("#snombre_txt").val(nombre);
      $("#spoliza_txt").val(poliza);
      $("#shost_txt").val(host);
      $("#snumero_txt").val(numero);
      $("#spuerto_txt").val(puerto);
      $("#sempresa_txt").val(empresa);
    } else {
      console.log("Nunca guardaste Valores");
      $("#snombre_txt").val("John Doe");
      $("#spoliza_txt").val("12345");
      $("#shost_txt").val("amv.collaboratory.avaya.com");
      $("#snumero_txt").val("2681322102");
      $("#spuerto_txt").val("443");
      $("#sempresa_txt").val("");
    }

    $("#guardarbtn").click(function() {
      $.ajax({
             url: 'php/imagen.php',
             type: 'POST',
             data: new FormData(this),
            mimeTypes:"multipart/form-data",
            contentType: false,
            cache: false,
            processData: false, 
             success: function (response) {
               alert(response);

               // console.log("Ajustes Guardados");
               // var nombre = $('#snombre_txt').val();
               // var poliza = $('#spoliza_txt').val();
               // var host = $('#shost_txt').val();
               // var numero = $('#snumero_txt').val();
               // var puerto = $('#spuerto_txt').val();
               // var empresa = $('#sempresa_txt').val();
               // localStorage.setItem("nombre", nombre);
               // localStorage.setItem("poliza", poliza);
               // localStorage.setItem("host", host);
               // localStorage.setItem("numero", numero);
               // localStorage.setItem("puerto", puerto);
               // localStorage.setItem("empresa", empresa);
               // localStorage.setItem("ajustes", "1");
               // $('#modalajustes').modal('hide');
               // location.reload();
             }
         });


    });


  });
  $("#iniciarllamada").click(function() {
    $('#dAudio').show("slow");
    $('#dcolgar').show("slow");
    $('#dVideo').show("slow");
    $('video#remote-video-view').css({
      display: 'block'
    });
    $("#dcolgar").click(function() {
      console.log("Colgar");
      location.reload();
    });
    var nombre = $('#nombre_txt').val();
    var nombre = nombre.replace(/ /g, "_");
    var pass = $('#pass_txt').val();
    var latitud = $('#lat_txt').val();
    var longitud = $('#long_txt').val();
    var coordenadas = latitud + "," + longitud;
    var host = $('#host_txt').val();
    var puerto = $('#puerto_txt').val();
    var numero = $('#num_txt').val();
    var url = "https://" + host + ":" + puerto + "/avayatest/auth?displayName=" + nombre + "&userName=" + pass + "";
    $.get(url, function(data, status) {
      if (status == "success") {
        var response = data;
        console.log("Request Correcto");
        var sessionid = data.sessionid;
        var uuid = data.uuid;
        var dominiio = data.defaultdomain;
        var vCliente = new ClientPlatformFactory().getClientPlatform();
        var navegador = vCliente.getUserAgentBrowser();
        var versionsdk = vCliente.getVersionNumber();
        var cDispositivo = vCliente.getDevice();
        cDispositivo.setLocalVideoView("local-video-view");
        cDispositivo.setRemoteVideoView("remote-video-view");
        console.log("Navegador: " + navegador);
        console.log("Version del SDK: " + versionsdk);
        var cDispositivo = vCliente.getDevice();
        var DDisponible = cDispositivo.couldMediaBeAccessible();
        console.log(DDisponible);
        var cUsuario = vCliente.getUser();
        cUsuario.setSessionAuthorizationToken(response);
        var cSesion = cUsuario.createSession();
        cSesion.enableVideo(true);
        cSesion.setRemoteAddress(numero);
        cSesion.setContextId(coordenadas);
        cSesion.start();
        $("#dcolgar").click(function() {
          console.log("Colgar");
          cSesion.end();
          location.reload();
        });
        $("#dAudio").click(function() {
          console.log("Audio" + cSesion.isAudioMuted());
          var estadioaudio = cSesion.isAudioMuted();
          if (estadioaudio == false) {
            cSesion.muteAudio(true);
          } else {
            cSesion.muteAudio(false);
            console.log("Nada que hacer");
          }
        });
        $("#dVideo").click(function() {
          console.log("Video" + cSesion.isVideoMuted());
          var estadovideo = cSesion.isVideoMuted();
          if (estadovideo == false) {
            cSesion.muteVideo(true);
          } else {
            cSesion.muteVideo(false);
            console.log("Nada que hacer");
          }
        });
        cUsuario.onServiceUnavailableCB = function() {
          console.log("Servicio dispoible");
        };
        cUsuario.onServiceAvailableCB = function() {
          console.log("Servicio dispoible");
        };
        cUsuario.onConnectionInProgressCB = function() {
          console.log("Conexion en Progreso");
        };
        cUsuario.onConnLost = function() {
          console.log("Se ha perdido la Conexion");
        };
        cUsuario.onConnRetry = function() {
          console.log("Intentado Reconectar");
        };
        cUsuario.onConnReestablished = function() {
          console.log("conexion Restablecida ");
        };
        cUsuario.onNetworkError = function() {
          console.log("Error de Red");
        };
        cUsuario.onCriticalError = function() {
          console.log("Error Critico");
        };
        cSesion.onSessionRemoteAlerting(hasEarlyMedia) = function() {
          console.log("Timbrando");
        };
        cSesion.onSessionRedirected() = function() {
          console.log("Sesion Redirigida");
        };
        cSesion.onSessionQueued() = function() {
          console.log("La llamada ha sido puesta en espera");
        };
        cSesion.onSessionEstablished() = function() {
          console.log("Sesion Establecida");
        };
        cSesion.onSessionEnded() = function() {
          console.log("La Sesion se ha terminado");
        };
        cSesion.onSessionFailed(sessionError) = function() {
          console.log("La sesion ha fallado");
        };
        cSesion.onSessionAudioMuteStatusChanged(muted) = function() {
          console.log("cambio en el estado del Audio");
        };
        cSesion.onSessionAudioMuteFailed(requestedMuteStatus, sessionError) = function() {
          console.log("Ha fallado la sesion al intentar mutear el audio");
        };
        cSesion.onSessionVideoMuteStatusChanged(muted) = function() {
          console.log("Ha cambiado el estado del video");
        };
        cSesion.onSessionVideoMuteFailed(requestedMuteStatus, sessionError) = function() {
          console.log("Ha fallado la sesion al intentar mutear el video ");
        };
        cSesion.onSessionServiceAvailable() = function() {
          console.log("La sesion está dispoible");
        };
        cSesion.onSessionServiceUnavailable() = function() {
          console.log("La sesion no está disponible");
        };
        cSesion.onSessionRemoteDisplayNameChanged(newDisplayName) = function() {
          console.log("El Nombre remoto ha cambiado" + newDisplayName);
        };
        cSesion.onCallError() = function() {
          console.log("Ha ocurrido un error en la llamada");
        };
        cSesion.onCallError() = function() {
          console.log("Ha ocurrido un error en la llamada");
        };
        cSesion.onCallError() = function() {
          console.log("Ha ocurrido un error en la llamada");
        };
      }
    });
    $("#formulario1").fadeOut("slow", function() {});
  });
});
