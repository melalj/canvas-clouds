# Canvas appendCloud

Programmatically draw clouds using HTML5 Canvas

## Getting Started

```javascript
var canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 900;

var context = canvas.getContext("2d");

context.appendCloud({
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
});
```

### Cloud colors `gray`

<img width="885" alt="canvas_cloud_gray" src="https://cloud.githubusercontent.com/assets/3869766/9648091/173c8852-5199-11e5-946e-14ec9993ac7f.png">

### Cloud Gray variations `gray_delta`

<img width="909" alt="canvas_cloud_gray_delta" src="https://cloud.githubusercontent.com/assets/3869766/9648102/3a47341e-5199-11e5-80de-6c60105ba752.png">

### Circles Per Cloud `circles_per_cloud`

<img width="903" alt="canvas_cloud_cpc" src="https://cloud.githubusercontent.com/assets/3869766/9648103/3d72bc94-5199-11e5-8075-708c4d586e87.png">

# Ratio Circle on Y axis `ratio_circles_y`

<img width="886" alt="canvas_cloud_ratio_c_y" src="https://cloud.githubusercontent.com/assets/3869766/9648107/477c867a-5199-11e5-9dbb-b6581a7e1211.png">

# Position `position`

<img width="426" alt="canvas_cloud_position" src="https://cloud.githubusercontent.com/assets/3869766/9648109/49bffbf6-5199-11e5-8099-77aca752143f.png">


## Contribute

You are welcomed to fork the project and make pull requests.
Be sure to create a branch for each feature!
