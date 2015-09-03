(function () {
  'use strict';

  var TWO_PI = Math.PI * 2;

  var gray_range = function(gray, delta) {
    if(gray - delta < 0){
      return [0, gray];
    }
    else{
      return [gray - delta, gray];
    }
  };

  var gray_to_rgb = function(gray){
    return gray + ', ' + gray + ', ' + gray;
  };

  var default_opts = {
     // Cloud radius
    radius: 60,

    // Center of the cloud coordinates [x, y]. If null, it's to the top-left of the canvas
    // Can also be an array of coordinates if the cloud have many positions [[x,y],..]
    position: [60, 60],

    // rgb(gray, gray, gray) - goes from 0 for black to 255 for white
    gray: 128,

    // How much we variate the gray
    gray_delta: 50,

    // How many circles we draw per cloud
    circles_per_cloud: 30,

    // Inner Cloud Circle radius (from 0 to 1), Can be either Float or Array of float [min, max]
    circle_radius_ratio: [0.3, 0.6],

    // Font family of the text
    font_family: 'Arial',

    // Ratio of radius that represent line 1 font-size
    line1_ratio: 0.4,

    // Ratio of radius that represent the margin between line1 and line2
    line_margin_ratio: 0,

    // Ratio of radius that represent line 2 font-size
    line2_ratio: 0.3,

    // Ratio of radius that represent text shadow position
    text_shadow_ratio: 0.03,

    // Ratio of radius that represent text blur size
    text_blur_ratio: 0.1,

    // Ratio of circles positions on the x axis
    ratio_circles_x: 1,

    // Ratio of circles positions on the y axis
    ratio_circles_y: 1,

    // Text content on the line 1
    line1: null,

    // Text content on the line 2
    line2: null,

    // If set true, show cloud area and centroid
    debug: false
  };

  // Used for drawing cloud area if debug is set true
  // Credits: http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
  CanvasRenderingContext2D.prototype.roundRect = function(sx,sy,ex,ey,r) {
    var r2d = Math.PI/180;
    if( ( ex - sx ) - ( 2 * r ) < 0 ) { r = ( ( ex - sx ) / 2 ); } //ensure that the radius isn't too large for x
    if( ( ey - sy ) - ( 2 * r ) < 0 ) { r = ( ( ey - sy ) / 2 ); } //ensure that the radius isn't too large for y
    this.beginPath();
    this.moveTo(sx+r,sy);
    this.lineTo(ex-r,sy);
    this.arc(ex-r,sy+r,r,r2d*270,r2d*360,false);
    this.lineTo(ex,ey-r);
    this.arc(ex-r,ey-r,r,r2d*0,r2d*90,false);
    this.lineTo(sx+r,ey);
    this.arc(sx+r,ey-r,r,r2d*90,r2d*180,false);
    this.lineTo(sx,sy+r);
    this.arc(sx+r,sy+r,r,r2d*180,r2d*270,false);
    this.fill();
    this.closePath();
  };

  CanvasRenderingContext2D.prototype.appendCloud = function(custom_opts) {
    var context = this;

    var opts = {};

    // Override default propterties
    for (var key_default in default_opts) {
      if (default_opts.hasOwnProperty(key_default)){
        opts[key_default] = default_opts[key_default];
      }
    }

    for (var key_custom in custom_opts) {
      if (custom_opts.hasOwnProperty(key_custom)){
        opts[key_custom] = custom_opts[key_custom];
      }
    }

    // Position the cloud to topLeft=0,0
    if(opts.position === null){
      opts.position = [[opts.radius, opts.radius]];
    }
    else if(opts.position instanceof Array && opts.position.length > 0 && !(opts.position[0] instanceof Array)){
      opts.position = [opts.position];
    }

    var max_x = Math.max.apply(null, opts.position.map(function(p){return p[0];}));
    var max_y = Math.max.apply(null, opts.position.map(function(p){return p[1];}));
    var min_x = Math.min.apply(null, opts.position.map(function(p){return p[0];}));
    var min_y = Math.min.apply(null, opts.position.map(function(p){return p[1];}));

    var centroid = [(max_x + min_x) / 2 , (max_y + min_y) / 2];

    // Show container circle
    if(opts.debug){
      context.fillStyle = '#00BFFF';
      context.roundRect(min_x - opts.radius, min_y - opts.radius, max_x + opts.radius, max_y + opts.radius, opts.radius);
    }

    // Clouds.
    // Create the circle's radial gradient.

    var gray_extent = gray_range(opts.gray, opts.gray_delta);

    // Draw the specified number of circles.
    for(var p = 0; p < opts.position.length; p++ ) {
      for (var i = 0; i < opts.circles_per_cloud; i++) {
          var random_gray = parseInt(Math.random() * (gray_extent[1] - gray_extent[0]) + gray_extent[0]);

          var circle_radius = opts.radius * opts.circle_radius_ratio;
          if(opts.circle_radius_ratio instanceof Array && opts.circle_radius_ratio.length === 2){
            circle_radius = opts.radius * (Math.random() * (opts.circle_radius_ratio[1] - opts.circle_radius_ratio[0]) + opts.circle_radius_ratio[0]);
          }

          // Compute a randomised circle position within the cloud.
          var angle = Math.random() * TWO_PI;
          var cx = opts.position[p][0] + Math.random() * Math.cos(angle) * (opts.radius - circle_radius) * opts.ratio_circles_x;
          var cy = opts.position[p][1] + Math.random() * Math.sin(angle) * (opts.radius - circle_radius) * opts.ratio_circles_y;


          var gradient = context.createRadialGradient(cx, cy, 0, cx, cy, circle_radius);

          var gradient_color = 'rgba(' + gray_to_rgb(random_gray) + ', ';
          gradient.addColorStop(0, gradient_color + '0.3)');
          gradient.addColorStop(1, gradient_color + '0)');


          context.beginPath();
          context.fillStyle = gradient;
          context.arc(cx, cy, circle_radius, 0, TWO_PI, true);
          context.fill();
          context.closePath();

      }
    }

    // Line 1
    if(opts.line1 !== null){
      context.save();
      var line1_font_size = opts.line1_ratio * opts.radius;
      var line1_position_delta = 0;
      if(opts.line2 !== null){
        line1_position_delta = opts.radius * (opts.line1_ratio / 2 + opts.line_margin_ratio);
      }
      context.font =  line1_font_size + 'px ' + opts.font_family;
      context.fillStyle = 'white';
      context.shadowColor = 'black';
      context.shadowOffsetX = line1_font_size * opts.text_shadow_ratio;
      context.shadowOffsetY = line1_font_size * opts.text_shadow_ratio;
      context.shadowBlur = line1_font_size * opts.text_blur_ratio;
      context.textAlign = 'center';
      context.textBaseline='middle';
      context.fillText(opts.line1, centroid[0], centroid[1] - line1_position_delta);
      context.restore();
    }

    // Line 2
    if(opts.line2 !== null){
      context.save();
      var line2_font_size = opts.line2_ratio * opts.radius;
      var line2_position_delta = 0;
      if(opts.line1 !== null){
        line2_position_delta = opts.radius * (opts.line2_ratio / 2 + opts.line_margin_ratio);
      }
      context.font =  line2_font_size + 'px ' + opts.font_family;
      context.fillStyle = 'white';
      context.shadowColor = 'black';
      context.shadowOffsetX = line2_font_size * opts.text_shadow_ratio;
      context.shadowOffsetY = line2_font_size * opts.text_shadow_ratio;
      context.shadowBlur = line2_font_size * opts.text_blur_ratio;
      context.textAlign = 'center';
      context.textBaseline='middle';
      context.fillText(opts.line2, centroid[0], centroid[1] + line2_position_delta);
      context.restore();
    }

    // Show centroid
    if(opts.debug){
      context.beginPath();
      context.fillStyle = 'green';
      context.arc(centroid[0], centroid[1], 3, 0, TWO_PI, true);
      context.fill();
      context.closePath();
    }

    return this;

  };
}());
