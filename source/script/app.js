
//requires
var gui = require('nw.gui');
gui.Window.get().show();


//main application
var app = {

  init: function() {
    this.init_menubar();
    this.init_tray();
    this.init_camera();
    this.init_system_info();
  },

  /**
   * Initialize OS menu bar (file menu)
   */
  init_menubar: function() {
    var main_menu = new gui.Menu({ type: 'menubar' });
    var submenu = new gui.Menu();

    submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'You' }));
    submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'Can' }));
    submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'Tick' }));
    submenu.append(new gui.MenuItem({ type: 'checkbox', label: 'These items' }));

    main_menu.append(new gui.MenuItem({ label: 'Menu', submenu: submenu }));
    main_menu.append(new gui.MenuItem({ icon: 'img/cut.png', label: 'Cut', submenu: new gui.Menu() }));
    main_menu.append(new gui.MenuItem({ icon: 'img/apple.png', label: 'Play', submenu: new gui.Menu() }));
    main_menu.append(new gui.MenuItem({ icon: 'img/tick.png', label: 'Tick', submenu: new gui.Menu() }));

    gui.Window.get().menu = main_menu;
  },

  /**
   * Initialize system tray icon
   */
  init_tray: function() {
    var tray = new gui.Tray({ icon: 'img/play.png' });

    // Give it a menu
    var menu = new gui.Menu();
    var exit_item = new gui.MenuItem({ type: 'checkbox', label: 'Farewell' });
    menu.append(exit_item);
    exit_item.click = function() {
      gui.App.quit();
    }

    tray.menu = menu;
  },

  /**
   * Initialize video feed (WebRTC)
   */
  init_camera: function() {
    navigator.webkitGetUserMedia({video:true}, function(stream) {
      $('#video_feed').get(0).src = webkitURL.createObjectURL(stream)
    });
  },

  /**
   * Open file browser, and highlight specific file
   */
  show_file: function() {
    alert('Simply update the hardcoded file line (67 in app.js)');
    //filepaths are different if running in compiled app mode, to source mode
    gui.Shell.showItemInFolder('/Volumes/Data/dev/desktop.js/example/script/app.js');
  },

  /**
   * Open a diretory chooser dialog
   */
  open_file: function() {
    var chooser = $('<input type="file" nwdirectory />');
    chooser.trigger('click');
  },

  /**
   * Spawn external process, and capture standard out
   */
  begin_external: function() {
    var output = $('#process_output');
    var spawn = require('child_process').exec;
    var proc = spawn('ping -c 5 reddit.com');

    proc.stdout.on('data', function (data) {
      output.val(output.val() + data);
    });

    proc.stderr.on('data', function (data) {
       output.val(output.val() + '\nError: ' + data);
    });

    proc.on('exit', function (code) {
      output.val(output.val() + '\nExited with code ' + code);
    });
  },

  /**
   * Enumerate and display system information
   */
  init_system_info: function() {
    var info = [];
    var os = require('os');
    var info = [
      'System type:\t\t' + os.type(),
      'System arch:\t\t' + os.arch(),
      'System uptime:\t\t' + Math.round(os.uptime() / 60) + 'mins',
      'System totalmem:\t' + (os.totalmem() / 1024 / 1024) + 'MB',
    ];

    var cpus = os.cpus();
    for(var i in cpus) {
      var cpu = cpus[i];
      info.push('System CPU '+ (parseInt(i)+1) +':\t\t' + cpu.model);
    }

    $('#system_info').val(info.join('\n'));
  },

}