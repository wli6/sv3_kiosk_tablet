// ASSURTEC DRIVER LICENSE SCANNER
kiosk.factory('dlScanner', function($rootScope) {
  var socket = null;
  var timer = null;
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
    last: function() {
      return last_scan;
    },
    connect: function() {
      if (typeof io === "undefined" || null === io)
        throw "Socket.io not found!";
      socket = null;
      try {
        socket = io.connect(AppConf.dln_url);
      } catch (e) {
        console.log("Connection Failed");
      }
      return socket;
    },
    getSocket: function() {
      return socket;
    },
    start: function() {
      socket.emit('idscanctl', {
        command: 'start'
      });
    },
    stop: function() {
      socket.emit('idscanctl', {
        command: 'stop'
      });
    },
    status: function() {
      socket.emit('idscanctl', {
        command: 'status'
      });
    },
    restart: function() {
      socket.emit('idscanctl', {
        command: 'stop'
      });
      timer = setTimeout(function() {
        socket.emit('idscanctl', {
          command: 'start'
        });
      }, 3200);
    },
    removeAllListeners: function() {
      socket.removeAllListeners();
      clearTimeout(timer);
    }
  };
});

// ASSURTEC DRIVER LICENSE SCANNER
kiosk.factory('pivScanner', function($rootScope) {
  var socket = null;
  var timer = null;
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
    last: function() {
      return last_scan;
    },
    connect: function() {
      if (typeof io === "undefined" || null === io)
        throw "Socket.io not found!";
      socket = null;
      try {
        socket = io.connect(AppConf.piv_url);
      } catch (e) {
        console.log("Connection Failed");
      }
      return socket;
    },
    getSocket: function() {
      return socket;
    },
  };
});

// MOTOROLA BARCODE SCANNER
kiosk.factory('motoScanner', function($rootScope) {
  var socket = null;
  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },
    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
    connect: function() {
      socket = netIO.createConnection(AppConf.moto_port, AppConf.moto_host);
      return socket;
    },
    removeAllListeners: function() {
      socket.removeAllListeners();
    }
  };
});

kiosk.factory('dymoPrinter', function($rootScope) {

  var labelXml = '<?xml version="1.0" encoding="utf-8"?><DieCutLabel Version="8.0" Units="twips"><PaperOrientation>Portrait</PaperOrientation><Id>NameBadge</Id><PaperName>30256 Shipping</PaperName><DrawCommands><Path><FillMode>EvenOdd</FillMode><RoundRectangle X="0" Y="0" Width="3331" Height="5760" Rx="180" Ry="180" /><RoundRectangle X="2880" Y="2520" Width="180" Height="720" Rx="120" Ry="120" /></Path></DrawCommands><ObjectInfo><ImageObject><Name>PHOTO</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>False</IsVariable><Image>iVBORw0KGgoAAAANSUhEUgAAASwAAAF3CAAAAAA6XymdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAMNSURBVHhe7dChAcAwDMCwrP+f1qNGekDMJWLu7w5b55UFswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCswKzArMCs9Zmfi4pA7pOJks0AAAAAElFTkSuQmCC</Image><ScaleMode>Uniform</ScaleMode><BorderWidth>15</BorderWidth><BorderColor Alpha="255" Red="0" Green="0" Blue="0" /><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Center</VerticalAlignment></ImageObject><Bounds X="142" Y="336" Width="2891.10009765625" Height="1290" /></ObjectInfo><ObjectInfo><TextObject><Name>DATE</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>False</IsVariable><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><TextFitMode>ShrinkToFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText><Element><String>5 NOV 2010</String><Attributes><Font Family="Arial" Size="14" Bold="True" Italic="False" Underline="False" Strikeout="False" /><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /></Attributes></Element></StyledText></TextObject><Bounds X="112" Y="4699" Width="2280" Height="375" /></ObjectInfo><ObjectInfo><TextObject><Name>NAME</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>False</IsVariable><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><TextFitMode>AlwaysFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText><Element><String>NAME</String><Attributes><Font Family="Arial" Size="4" Bold="True" Italic="False" Underline="False" Strikeout="False" /><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /></Attributes></Element></StyledText></TextObject><Bounds X="108.099975585938" Y="1714" Width="2700" Height="863.571533203125" /></ObjectInfo><ObjectInfo><TextObject><Name>COMPANY</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>False</IsVariable><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><TextFitMode>ShrinkToFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText /></TextObject><Bounds X="82" Y="2719" Width="2700" Height="195" /></ObjectInfo><ObjectInfo><TextObject><Name>ACCESS</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>True</IsVariable><HorizontalAlignment>Center</HorizontalAlignment><VerticalAlignment>Middle</VerticalAlignment><TextFitMode>ShrinkToFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText><Element><String>NO ACCESS</String><Attributes><Font Family="Arial" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" /><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /></Attributes></Element></StyledText></TextObject><Bounds X="123.099975585938" Y="3855" Width="3105" Height="735" /></ObjectInfo><ObjectInfo><TextObject><Name>TIME</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>True</IsVariable><HorizontalAlignment>Right</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><TextFitMode>ShrinkToFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText><Element><String>2:37pm</String><Attributes><Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" /><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /></Attributes></Element></StyledText></TextObject><Bounds X="2313.10009765625" Y="4744" Width="930" Height="270" /></ObjectInfo><ObjectInfo><TextObject><Name>TENANT</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>True</IsVariable><HorizontalAlignment>Left</HorizontalAlignment><VerticalAlignment>Top</VerticalAlignment><TextFitMode>ShrinkToFit</TextFitMode><UseFullFontHeight>True</UseFullFontHeight><Verticalized>False</Verticalized><StyledText><Element><String>TENANT</String><Attributes><Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="True" Strikeout="False" /><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /></Attributes></Element></StyledText></TextObject><Bounds X="121" Y="2985" Width="2715" Height="675" /></ObjectInfo><ObjectInfo><BarcodeObject><Name>BARCODE</Name><ForeColor Alpha="255" Red="0" Green="0" Blue="0" /><BackColor Alpha="0" Red="255" Green="255" Blue="255" /><LinkedObjectName></LinkedObjectName><Rotation>Rotation0</Rotation><IsMirrored>False</IsMirrored><IsVariable>False</IsVariable><Text>the quick brown fox jumped over the lazy dog</Text><Type>Pdf417</Type><Size>Large</Size><TextPosition>None</TextPosition><TextFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" /><CheckSumFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" /><TextEmbedding>None</TextEmbedding><ECLevel>0</ECLevel><HorizontalAlignment>Center</HorizontalAlignment><QuietZonesPadding Left="0" Top="0" Right="0" Bottom="0" /></BarcodeObject><Bounds X="82" Y="5104" Width="3192" Height="570" /></ObjectInfo></DieCutLabel>';
  var label = dymo.label.framework.openLabelXml(labelXml);

  return {
    print: function(visit) {
      var labelSet = new dymo.label.framework.LabelSetBuilder();
      var record = labelSet.addRecord();

      // set label text
      var d = new Date();
      var date = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
      var time = d.getHours() + ':' + (d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes());
      var b64 = visit.image.replace(/^data:.*;base64,/, '');

      record.setText("NAME", visit.visitor.name.toString());
      record.setText("TENANT", visit.tenant.name.toString());
      record.setText("BARCODE", (visit.barcode || "").toString());
      if (b64) record.setText("PHOTO", b64.toString());
      record.setText("DATE", date.toString());
      record.setText("TIME", time.toString());
      // record.setText("ACCESS", (visit.floor.name || "") + " " + (visit.space.name || ""));

      var printers = dymo.label.framework.getPrinters();
      if (printers.length == 0) {
        throw "No DYMO printers are installed. Install DYMO printers.";
      }

      var printerName = "";
      for (var i = 0; i < printers.length; ++i) {
        var printer = printers[i];
        if (printer.printerType == "LabelWriterPrinter" && printer.isConnected) {
          printerName = printer.name;
          break;
        }
      }

      if (printerName == "") {
        throw "No LabelWriter printers found. Install LabelWriter printer";
      }

      // finally print the label
      label.print(printerName, '', labelSet);
    }

  };



});