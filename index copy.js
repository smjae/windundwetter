let angle = 0;
let temperature = 0;
let windSpeed = 0;
let windDirection = 0;
let windDirectionClean = "";
let maxWindSpeed = 0;
let middle;
let windStufe = 0;
let strength = { x: 1.5, y: 1.5 };
let strengthArray = {};
let videoCounter = 0;
let dataIndex = 0;

let myColor = "#000000";
// let temp1 = "rgb(120, 164, 194)";
// let temp1bg = "rgba(120, 164, 194, 0.5)";
// let temp2 = "rgb(173, 160, 95)";
// let temp2bg = "rgba(173, 160, 95, 0.5)";
// let temp3 = "rgb(242, 204, 114)";
// let temp3bg = "rgba(242, 204, 114, 0.5)";
// let temp4 = "rgb(242, 151, 121)";
// let temp4bg = "rgba(242, 151, 121, 0.5)";
// let temp5 = "rgb(255, 82, 151)";
// let temp5bg = "rgba(255, 82, 151, 0.5)";
let body = document.querySelector("body");

async function getDataFromDB() {
  try {
    const response = await fetch("api.php");
    const data = await response.json();
    // Process the retrieved data
    //convert deg to rad
    // console.log(data.actual_wind_speed);
    moveBlobByWindSpeed(data.actual_wind_speed);
    // moveBlobByWindSpeed(1); //for testing
    createBlob(strengthArray, data.actual_wind_speed);
    convertWindDirectionToRad(data.actual_wind_direction);
    // convertWindDirectionToRad(0); //Test
    //round temperature
    roundData(data);
    changeColorByTemperature(temperature);
    getDegreeFromDirection(data.actual_wind_direction);
    showData(data);
    updateTextPosition();
    addAnimation();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // console.log("DOM fully loaded and parsed");
  getDataFromDB();
});

function convertWindDirectionToRad(windDirection) {
  // console.log("vor -90:" + windDirection);

  let angleDeg = windDirection -90; //-90, weil Kreis rechts beginnt
  // let angleDeg = 197 -90;
  // console.log("nach -90: " + angleDeg);
  if (angleDeg > 180) {
    angleDeg = angleDeg - 360;
  }
  // console.log("angleDeg nach Transf.: " + angleDeg);
  angle = angleDeg * (Math.PI / 180);
  // console.log("angle in RAD: " + angle);
}

function moveBlobByWindSpeed(windSpeed) {
  // console.log("windSpeed: "+windSpeed);
  //Modify the array strength {x, y} based on windSpeed. no wind is strength 0.5, windSpeed of over 15 m/s is strength 5.

  if (windSpeed > 15) {
    strengthArray = { x: 5, y: 5 };
  } else if (windSpeed > 10) {
    strengthArray = { x: 4.5, y: 4.5 };
  } else if (windSpeed > 8) {
    strengthArray = { x: 4, y: 4 };
  } else if (windSpeed > 5) {
    strengthArray = { x: 3, y: 3 };
  } else if (windSpeed > 3) {
    strengthArray = { x: 2, y: 2 };
  } else {
    strengthArray = { x: 0.7, y: 0.7 };
  }

  // console.log(strengthArray);
}

function roundData(data) {
  //round temperature to .1 decimal
  temperature = Math.round(data.actual_air_temperature * 10) / 10;
  //round wind speed to .1 decimal
  windSpeed = Math.round(data.actual_wind_speed * 10) / 10;
  //round max wind speed to .1 decimal
  maxWindSpeed = Math.round(data.actual_maximum_wind_speed * 10) / 10;
  //wind direction
  windDirection = Math.round(data.actual_wind_direction);

  // console.log(temperature, windSpeed, maxWindSpeed, windDirection);
}

function roundDataOld(data) {
  //round temperature to .1 decimal
  console.log(data[dataIndex].avg_air_temperature);
  temperature = Math.round(data[dataIndex].avg_air_temperature * 10) / 10;
  console.log(temperature);
  //round wind speed to .1 decimal
  windSpeed = Math.round(data.avg_wind_speed * 10) / 10;
  //round max wind speed to .1 decimal
  maxWindSpeed = Math.round(data.avg_maximum_wind_speed * 10) / 10;
  //wind direction
  windDirection = Math.round(data.avg_wind_direction);

  // console.log(temperature, windSpeed, maxWindSpeed, windDirection);
}

function changeColorByTemperature(temperature) {
  //map the numbers from 186 to 7 on a scale from -10 to 40
  //depending on the temperature, change the color of the blob
  //the number changed is the hue of the color. saturation is 50 and brightness is 92.

  let hue = Math.floor(mapRange(temperature, -20, 40, 166, 7));
  // console.log("Hue:", hue); // Output should be a hue value between 186 and 7

  let blobColor = `hsl(${hue}, 50%, 46%)`;
  let backgroundColor = `hsla(${hue}, 50%, 46%, 0.5)`;
  // console.log(blobColor, backgroundColor);
  myColor = blobColor;
  body.style.backgroundColor = backgroundColor;
  // Set background-color using hsl() result
}

function changeColorByTemperatureOld(temperature) {
  console.log(temperature);
  //map the numbers from 186 to 7 on a scale from -10 to 40
  //depending on the temperature, change the color of the blob
  //the number changed is the hue of the color. saturation is 50 and brightness is 92.

  let hue = Math.floor(mapRange(temperature, -20, 40, 166, 7));
  // console.log("Hue:", hue); // Output should be a hue value between 186 and 7

  let blobColor = `hsl(${hue}, 50%, 46%)`;
  // console.log(blobColor, backgroundColor);
  myColor = blobColor;
}

function showData(data) {
  let anzeige = document.createElement("div");
  anzeige.classList.add("anzeigeAllesCurrent");

  //Temperaturanzeige
  let temperaturAnzeige = document.createElement("div");
  temperaturAnzeige.innerHTML = temperature + "°C";
  temperaturAnzeige.classList.add("temperaturAnzeige");
  anzeige.append(temperaturAnzeige);

  //Windrichtungsanzeige
  let windrichtungsAnzeige = document.createElement("div");
  windrichtungsAnzeige.innerHTML = "Windrichtung: " + windDirectionClean;
  windrichtungsAnzeige.classList.add("windrichtungsAnzeige");
  anzeige.append(windrichtungsAnzeige);

  //Windgeschwindigkeitsanzeige
  // let windgeschwAnzeige = document.createElement("div");
  // windgeschwAnzeige.innerHTML = "Windgeschwindigkeit: "+windSpeed + " m/s";
  // windgeschwAnzeige.classList.add("windgeschwAnzeige");
  // anzeige.append(windgeschwAnzeige);

  let windgeschwAnzeige = document.createElement("div");
  windgeschwAnzeige.innerHTML = "Windstärke: ";
  let windgeschwGruppe = document.createElement("div");
  windgeschwGruppe.classList.add("windgeschwGruppe");
  anzeige.append(windgeschwGruppe);
  windgeschwGruppe.append(windgeschwAnzeige);
  let windgeschwEllipsen = document.createElement("div");
  windgeschwEllipsen.classList.add("windgeschwEllipsen");
  windgeschwGruppe.append(windgeschwEllipsen);

  calculateWindSpeedEllipses(data.actual_wind_speed);
  // calculateWindSpeedEllipses(4); //Test

  //create 5 ellipses for wind speed
  if (windStufe > 5) {
    for (let i = 0; i < 5; i++) {
      let ellipse = document.createElement("div");
      ellipse.classList.add("ellipse");
      ellipse.style =
        "background-color:red; border: 1px solid red; height: 10px; width: 10px";
      windgeschwEllipsen.append(ellipse);
    }
  } else {
    for (let i = 0; i < windStufe; i++) {
      let ellipse = document.createElement("div");
      ellipse.classList.add("ellipse");
      ellipse.style.width = "10px";
      ellipse.style.height = "10px";
      ellipse.style.backgroundColor = "black";
      windgeschwEllipsen.append(ellipse);
    }

    for (let i = 0; i < 5 - windStufe; i++) {
      let ellipse = document.createElement("div");
      ellipse.classList.add("ellipse");
      ellipse.style.width = "10px";
      ellipse.style.height = "10px";
      windgeschwEllipsen.append(ellipse);
    }
  }
  // console.log("ellipsen created");

  windgeschwAnzeige.classList.add("windgeschwAnzeige");

  //Windspitzenanzeige
  let windspitzenAnzeige = document.createElement("div");
  windspitzenAnzeige.innerHTML = "Windspitzen bis " + maxWindSpeed + " m/s";
  windspitzenAnzeige.classList.add("windspitzenAnzeige");
  anzeige.append(windspitzenAnzeige);

  //Measured at
  let measuredAt = document.querySelector(".measuredAt");
  measuredAt.innerHTML =
    "Zuletzt aktualisiert am: " + "<br>" + data.actual_measured_at;

  body.append(anzeige);
}

function showDataOld(data) {
  let anzeige = document.createElement("div");
  anzeige.classList.add("anzeigeAllesCurrent");

  //Temperaturanzeige
  let temperaturAnzeige = document.createElement("div");
  temperaturAnzeige.innerHTML = temperature + "°C";
  temperaturAnzeige.classList.add("temperaturAnzeige");
  anzeige.append(temperaturAnzeige);

  //Windrichtungsanzeige
  let windrichtungsAnzeige = document.createElement("div");
  windrichtungsAnzeige.innerHTML = "Windrichtung: " + windDirectionClean;
  windrichtungsAnzeige.classList.add("windrichtungsAnzeige");
  anzeige.append(windrichtungsAnzeige);

  let windgeschwAnzeige = document.createElement("div");
  windgeschwAnzeige.innerHTML = "Windstärke: ";
  let windgeschwGruppe = document.createElement("div");
  windgeschwGruppe.classList.add("windgeschwGruppe");
  anzeige.append(windgeschwGruppe);
  windgeschwGruppe.append(windgeschwAnzeige);
  let windgeschwEllipsen = document.createElement("div");
  windgeschwEllipsen.classList.add("windgeschwEllipsen");
  windgeschwGruppe.append(windgeschwEllipsen);

  calculateWindSpeedEllipses(data[dataIndex].avg_wind_speed);
  console.log(data[dataIndex].avg_wind_speed);
  console.log(windStufe);
  //remove all ellipses

  // calculateWindSpeedEllipses(4); //Test

  //create 5 ellipses for wind speed
  if (windStufe > 5) {
    for (let i = 0; i < 5; i++) {
      let ellipse = document.createElement("div");
      ellipse.classList.add("ellipse");
      ellipse.style =
        "background-color:red; border: 1px solid red; height: 10px; width: 10px";
      windgeschwEllipsen.append(ellipse);
    }
  } else {
    for (let i = 0; i < windStufe; i++) {
      let ellipse = document.createElement("div");
      ellipse.classList.add("ellipse");
      ellipse.style.width = "10px";
      ellipse.style.height = "10px";
      ellipse.style.backgroundColor = "black";
      windgeschwEllipsen.append(ellipse);
      console.log("yay");
    }

    for (let i = 0; i < 5 - windStufe; i++) {
      let ellipse = document.createElement("div");
      ellipse.classList.add("ellipse");
      ellipse.style.width = "10px";
      ellipse.style.height = "10px";
      windgeschwEllipsen.append(ellipse);
    }
  }
  // console.log("ellipsen created");

  windgeschwAnzeige.classList.add("windgeschwAnzeige");

  

  body.append(anzeige);
}

function updateTextPosition() {
  // Find the middle of the blob
  findMiddleOfBlob();

  // Update the position of the text element
  let anzeige = document.querySelector(".anzeigeAllesCurrent");

  if (anzeige) {
    anzeige.style.top = middle.y + "px";
    anzeige.style.left = middle.x + "px";
  }

  // Call the function again on the next animation frame
  requestAnimationFrame(updateTextPosition);
}

function findMiddleOfBlob() {
  //calculate the current position of all points on the blob and find the middle
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < blob.points.length; i++) {
    sumX += blob.points[i].position.x;
    sumY += blob.points[i].position.y;
  }
  const middleX = sumX / blob.points.length;
  const middleY = sumY / blob.points.length;
  middle = { x: middleX, y: middleY };
  return middle;
}

function getDegreeFromDirection(windDirection) {
  //divide the circle into 8 parts
  //0° = N, 45° = NE, 90° = E, 135° = SE, 180° = S, 225° = SW, 270° = W, 315° = NW
  //if windDirection is between 0 and 22.5, it is N
  //if windDirection is between 22.5 and 67.5, it is NE
  //if windDirection is between 67.5 and 112.5, it is E
  //if windDirection is between 112.5 and 157.5, it is SE
  //if windDirection is between 157.5 and 202.5, it is S
  //if windDirection is between 202.5 and 247.5, it is SW
  //if windDirection is between 247.5 and 292.5, it is W
  //if windDirection is between 292.5 and 337.5, it is NW
  //if windDirection is between 337.5 and 360, it is N
  console.log("wind direction is: "+ windDirection);
  if (windDirection >= 0 && windDirection < 22.5) {
    windDirectionClean = "N";
  } else if (windDirection >= 22.5 && windDirection < 67.5) {
    windDirectionClean = "NE";
  } else if (windDirection >= 67.5 && windDirection < 112.5) {
    windDirectionClean = "E";
  } else if (windDirection >= 112.5 && windDirection < 157.5) {
    windDirectionClean = "SE";
  } else if (windDirection >= 157.5 && windDirection < 202.5) {
    windDirectionClean = "S";
  } else if (windDirection >= 202.5 && windDirection < 247.5) {
    windDirectionClean = "SW";
  } else if (windDirection >= 247.5 && windDirection < 292.5) {
    windDirectionClean = "W";
  } else if (windDirection >= 292.5 && windDirection < 337.5) {
    windDirectionClean = "NW";
  } else if (windDirection >= 337.5 && windDirection <= 360) {
    windDirectionClean = "N";
  }
}

function calculateWindSpeedEllipses(windSpeed) {
  // console.log(windSpeed);

  //Windbezeichnungen nach Beaufortskala (https://hygrometer.guru/windstaerkentabelle/)

  if (windSpeed > 32.7) {
    // console.log("ORKAN!!");
    windStufe = 6;
  } else if (windSpeed > 20) {
    // console.log("Sturm");
    windStufe = 5;
  } else if (windSpeed > 10.8) {
    // console.log("Starker Wind");
    windStufe = 4;
  } else if (windSpeed > 5.5) {
    // console.log("mäßige Brise");
    windStufe = 3;
  } else if (windSpeed > 3.4) {
    // console.log("schwache Brise");
    windStufe = 2;
  } else if (windSpeed > 0.4) {
    // console.log("kaum Wind");
    windStufe = 1;
  } else {
    // console.log("kein Wind");
    windStufe = 0;
  }

  // fillEllipses(windStufe);
}

// function fillEllipses(windStufe) {
//   // Get all ellipses
//   let ellipses = document.querySelectorAll(".ellipse");
//   console.log(windStufe);
//   console.log(ellipses);

//   // Loop through all ellipses and set their styles based on windStufe
//   for (let i = 0; i < windStufe; i++) {
//       // ellipses[i].style = "background-color:black";
//       console.log("yay");
//   }
// }

let canvas, ctx;
let render, init;
let blob;
function createBlob(strengthArray, windSpeed) {
  class Blob {
    constructor() {
      this.points = [];
    }

    init() {
      for (let i = 0; i < this.numPoints; i++) {
        let point = new Point(this.divisional * (i + 1), this);
        //   point.acceleration = -1 + Math.random() * 2;
        this.push(point);
      }
    }

    render() {
      let canvas = this.canvas;
      let ctx = this.ctx;
      let position = this.position;
      let pointsArray = this.points;
      let radius = this.radius;
      let points = this.numPoints;
      let divisional = this.divisional;
      let center = this.center;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointsArray[0].solveWith(pointsArray[points - 1], pointsArray[1]);

      let p0 = pointsArray[points - 1].position;
      let p1 = pointsArray[0].position;
      let _p2 = p1;

      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

      for (let i = 1; i < points; i++) {
        pointsArray[i].solveWith(
          pointsArray[i - 1],
          pointsArray[i + 1] || pointsArray[0]
        );

        let p2 = pointsArray[i].position;
        var xc = (p1.x + p2.x) / 2;
        var yc = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
        // ctx.lineTo(p2.x, p2.y);

        // ctx.fillStyle = fillColor;
        // ctx.fillRect(p1.x-2.5, p1.y-2.5, 5, 5);

        p1 = p2;
      }

      var xc = (p1.x + _p2.x) / 2;
      var yc = (p1.y + _p2.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      // ctx.lineTo(_p2.x, _p2.y);

      // ctx.closePath();
      // ctx.fillStyle = this.color;
      ctx.fillStyle = myColor;
      ctx.fill();
      ctx.strokeStyle = "#000000";
      // ctx.stroke();

      /*
    ctx.fillStyle = '#000000';
    if(this.mousePos) {
      let angle = Math.atan2(this.mousePos.y, this.mousePos.x) + Math.PI;
      ctx.fillRect(center.x + Math.cos(angle) * this.radius, center.y + Math.sin(angle) * this.radius, 5, 5);
    }
*/
      requestAnimationFrame(this.render.bind(this));
    }

    push(item) {
      if (item instanceof Point) {
        this.points.push(item);
      }
    }

    // set color(value) {
    //   this._color = value;
    // }
    // get color() {
    //   return this._color || '#000000';
    // }

    set canvas(value) {
      if (
        value instanceof HTMLElement &&
        value.tagName.toLowerCase() === "canvas"
      ) {
        this._canvas = canvas;
        this.ctx = this._canvas.getContext("2d");
      }
    }
    get canvas() {
      return this._canvas;
    }

    set numPoints(value) {
      if (value > 2) {
        this._points = value;
      }
    }
    get numPoints() {
      return this._points || 32;
    }

    set radius(value) {
      if (value > 0) {
        this._radius = value;
      }
    }
    get radius() {
      return this._radius || 150;
    }

    set position(value) {
      if (typeof value == "object" && value.x && value.y) {
        this._position = value;
      }
    }
    get position() {
      return this._position || { x: 0.5, y: 0.5 };
    }

    get divisional() {
      return (Math.PI * 2) / this.numPoints;
    }

    get center() {
      return {
        x: this.canvas.width * this.position.x,
        y: this.canvas.height * this.position.y,
      };
    }

    set running(value) {
      this._running = value === true;
    }
    get running() {
      return this.running !== false;
    }
  }

  class Point {
    constructor(azimuth, parent) {
      this.parent = parent;
      this.azimuth = Math.PI - azimuth;
      this._components = {
        x: Math.cos(this.azimuth),
        y: Math.sin(this.azimuth),
      };

      this.acceleration = -0.3 + Math.random() * 0.6;
    }

    solveWith(leftPoint, rightPoint) {
      this.acceleration =
        (-0.3 * this.radialEffect +
          (leftPoint.radialEffect - this.radialEffect) +
          (rightPoint.radialEffect - this.radialEffect)) *
          this.elasticity -
        this.speed * this.friction;
    }

    set acceleration(value) {
      if (typeof value == "number") {
        this._acceleration = value;
        this.speed += this._acceleration * 2;
      }
    }
    get acceleration() {
      return this._acceleration || 0;
    }

    set speed(value) {
      if (typeof value == "number") {
        this._speed = value;
        this.radialEffect += this._speed * 5;
      }
    }
    get speed() {
      return this._speed || 0;
    }

    set radialEffect(value) {
      if (typeof value == "number") {
        this._radialEffect = value;
      }
    }
    get radialEffect() {
      return this._radialEffect || 0;
    }

    get position() {
      return {
        x:
          this.parent.center.x +
          this.components.x * (this.parent.radius + this.radialEffect),
        y:
          this.parent.center.y +
          this.components.y * (this.parent.radius + this.radialEffect),
      };
    }

    get components() {
      return this._components;
    }

    set elasticity(value) {
      if (typeof value === "number") {
        this._elasticity = value;
      }
    }
    get elasticity() {
      return this._elasticity || 0.002; //0.001
    }
    set friction(value) {
      if (typeof value === "number") {
        this._friction = value;
      }
    }
    get friction() {
      return this._friction || 0.01; //0.001
    }
  }

  blob = new Blob();

  init = function () {
    canvas = document.createElement("canvas");
    canvas.setAttribute("touch-action", "none");
    canvas.zIndex = -100;

    document.body.appendChild(canvas);

    let resize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    //   let oldMousePoint = { x: 0, y: 0};
    //   let hover = false;
    let mouseMove = function (e) {
      let pos = blob.center;
      // let diff = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      // let dist = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y));
      // let angle = null;

      // blob.mousePos = { x: 100, y: 100 };

      // if(dist < blob.radius && hover === false) {
      //   let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      //   angle = Math.atan2(vector.y, vector.x);
      //   hover = true;
      // //   blob.color = '#77FF00';
      // } else if(dist > blob.radius && hover === true){
      //   let vector = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      //   angle = Math.atan2(vector.y, vector.x);
      //   hover = false;
      //   blob.color = null;
      // }

      // let vector = { x: -20, y: -20 }; //WINKEL FÜR DEN PUNKT
      // let angle = Math.atan2(vector.y, vector.x);
      //get data_wind_direction from db and save it in angle
      

      if (typeof angle == "number") {
        let nearestPoint = null;
        let distanceFromPoint = 5000; //100

        blob.points.forEach((point) => {
          if (Math.abs(angle - point.azimuth) < distanceFromPoint) {
            // console.log(point.azimuth, angle, distanceFromPoint);
            nearestPoint = point;
            distanceFromPoint = Math.abs(angle - point.azimuth);
          }
        });

        if (nearestPoint) {
          // let strength = { x: oldMousePoint.x - e.clientX, y: oldMousePoint.y - e.clientY };
          // strength = Math.sqrt((strength.x * strength.x) + (strength.y * strength.y)) * 10;
          // if(strength > 100) strength = 100;
          // nearestPoint.acceleration = strength / 100 * (hover ? -1 : 1);

          strength = strengthArray; // definiert die Länge des Ausschlags
    
          // console.log(strength);
          // console.log(strengthArray);
          strength =
            Math.sqrt(strength.x * strength.x + strength.y * strength.y) * 10;

          if (strength > 100) strength = 100;
          nearestPoint.acceleration = strength / 100;
          
        }
      }

      requestAnimationFrame(mouseMove.bind(this));

      // oldMousePoint.x = e.clientX;
      // oldMousePoint.y = e.clientY;
    };
    // window.addEventListener('mousemove', mouseMove);
    //   window.addEventListener('pointermove', mouseMove);
    requestAnimationFrame(mouseMove);

    blob.canvas = canvas;
    blob.init();
    blob.render();
  };

  init();

  calculateWindSpeedEllipses(windSpeed);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function addAnimation() {
  // console.log(windSpeed, temperature);
  let animationContainer = document.createElement("div");
  animationContainer.classList.add("animationContainer");
  //get display width
  // console.log(window.innerWidth);
  if (window.innerWidth > 1200) {
    videoCounter = 4;
  } else if (window.innerWidth > 750) {
    videoCounter = 3;
  } else if (window.innerWidth > 550) {
    videoCounter = 2;
  } else {
    videoCounter = 1;
  }
  // console.log(videoCounter);
  let videoContainer = document.createElement("div");
  videoContainer.classList.add("videoContainer");
  animationContainer.append(videoContainer);
  for (let i = 0; i < videoCounter; i++) {
    let video = document.createElement("img");
    video.classList.add("video");
    video.autoplay = true;
    video.loop = true;
    video.src = "./img/walking_animation.gif";
    // let source = document.createElement("source");
    // source.type = "video/gif";
    // source.src = "./img/walking_animation.gif";
    // video.append(source);
    video.preload = "auto";
    videoContainer.append(video);
    // console.log(video);
  }
  // Append animationContainer to the body after the loop
  document.body.append(animationContainer);
}

//add eventlistener on info button
document.querySelector(".infoButton").addEventListener("click", function () {
  //create overlay with text
  let overlay = document.createElement("div");
  overlay.classList.add("overlay");
overlay.style="display: flex; width: 350px; height: auto; transition: all .3s ease-in;";
  //add eventlistener on close button
  // let closeButton = document.createElement("button");
  // closeButton.classList.add("closeButton");
  // closeButton.innerHTML = "X";
  // overlay.append(closeButton);

  let closeContainer = document.createElement("div");
  closeContainer.classList.add("close-container");
  let leftright = document.createElement("div");
  leftright.classList.add("leftright");
  let rightleft = document.createElement("div");
  rightleft.classList.add("rightleft");
  let closeButton = document.createElement("label");
  closeButton.classList.add("close");
  closeButton.innerHTML = "close";
  closeContainer.append(leftright);
  closeContainer.append(rightleft);
  closeContainer.append(closeButton);
  overlay.append(closeContainer);

  let title = document.createElement("div");
  title.classList.add("titleOverlay");
  title.innerHTML = "Über diese Website:";

  let text = document.createElement("div");
  text.classList.add("textOverlay");
  text.innerHTML =
    'Diese Visualisierung der Daten vom Bahnhof St. Gallen entstand im Rahmen eines studentischen Projekts im Studiengang "Multimedia Production". Die Daten stammen von opendata.swiss und werden von den St. Galler Stadtwerken (sgsw) zur Verfügung gestellt:<br> <a href="https://daten.stadt.sg.ch/explore/dataset/windmessung-bahnhofplatz-stadt-stgallen/information/?headless=" style="color: white">www.daten.stadt.sg.ch/windmessung-bahnhofplatz-stadt-stgallen</a>.';
  let title2 = document.createElement("div");
  title2.classList.add("titleOverlay");
  title2.innerHTML = "Wie funktioniert es?";

  let text2 = document.createElement("div");
  text2.classList.add("textOverlay");
  text2.innerHTML =
    "Die gezeigten Daten sind Echtzeitmessungen des Windes und der Temperatur am Bahnhof St. Gallen. Diese werden per CRON-Job alle 10 Minuten in eine Datenbank gespeichert und von da aus abgerufen. So können auch ältere Messzeitpunkte abgerufen werden. Die Visualisierung verändert sich je nach Temperatur, Windrichtung oder Windgeschwindigkeit. Viel Spass beim Anschauen!";
  overlay.append(title);
  overlay.append(text);
  overlay.append(title2);
  overlay.append(text2);
  document.body.append(overlay);

  closeContainer.addEventListener("click", function () {
    overlay.style.display = "none";
  });
});


//verlauf
//check if checkbox with id=dn is checked
//if checked, change background color to dark mode
//if unchecked, change background color to light mode
//add event listener to checkbox
document.getElementById("dn").addEventListener("change", function () {
  //check if checkbox is checked
  if (this.checked) {
    //remove blob, text and video
    let blob = document.querySelector("canvas");
    blob.remove();
    let text = document.querySelector(".anzeigeAllesCurrent");
    text.remove();
    let video = document.querySelector(".animationContainer");
    video.remove();
    //change background color to dark mode
    body.style.backgroundColor = "rgb(3, 18, 49)";
    //transition to dark mode is a swipe from right to left
    body.style.transition = "background-color 0.3s ease-in-out";
   

    //change color of text to white
    document.querySelector(".header").style.color = "white";
    document.querySelector(".header").style.transition = "color 0.3s ease-in-out";
    document.querySelector(".infoButton p").style.color = "white";
    document.querySelector(".infoButton p").style.transition = "color 0.3s ease-in-out";
    document.querySelector(".infoButton").style.border = "3px solid white";
    document.querySelector(".infoButton").style.transition = "border 0.3s ease-in-out";
    document.querySelector(".measuredAt").style.display = "none";
    document.querySelector("#logo").src = "./img/logo_windundwetter_white.png";

    getPastData();
    timePassed();
    
  } else {
    //remove blob, text and video
   
    let blob = document.querySelector("canvas");
    blob.remove();
    document.querySelector(".scrubberContainer").remove();
    let text = document.querySelector(".anzeigeAllesCurrent");
    text.remove();

    //change color of text to black
    document.querySelector(".header").style.color = "black";
    document.querySelector(".header").style.transition = "color 0.3s ease-in-out";
    document.querySelector(".infoButton p").style.color = "black";
    document.querySelector(".infoButton p").style.transition = "color 0.3s ease-in-out";
    document.querySelector(".infoButton").style.border = "3px solid black";
    document.querySelector(".infoButton").style.transition = "border 0.3s ease-in-out";
    document.querySelector(".measuredAt").style.display = "block";
    document.querySelector("#logo").src = "./img/logo_windundwetter.png";
    getDataFromDB();
  }
});



function timePassed() {
  //Create containers and scrubber thingy
  let scrubberContainer = document.createElement("div");
  scrubberContainer.classList.add("scrubberContainer");
  scrubberContainer.innerHTML = `<input id="scrubberControl" type="range" value="0" />
  <div id="scrubberValue">3 ms</div>
</div>`
body.append(scrubberContainer);

}



async function getPastData() {

  try {
    const response = await fetch("apiOldData.php");
    const data = await response.json();
    // Process the retrieved data
      //get real data.length without all data that has null as value
  let newData = data.filter(item => item.avg_wind_direction !== null);
  let scrubberControl = document.querySelector("#scrubberControl");
  let scrubberValue = document.querySelector("#scrubberValue");

  scrubberControl.max = newData.length-1;
  scrubberControl.value = newData.length-1;
  dataIndex = newData.length-1;
  displayDataForTimestamp(newData[dataIndex]);
  let date = new Date(newData[dataIndex].hour_start);
  let formattedDate = `${padZero(date.getDate())}.${padZero(date.getMonth() + 1)}.${date.getFullYear()}. ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  scrubberValue.innerText = formattedDate;
  
    showPastData(newData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//put past data into scrubber
//add event listener to scrubber
//when scrubber is moved, show data from that time

async function showPastData(data) {
console.log(dataIndex);
  moveBlobByWindSpeed(data[dataIndex].avg_wind_speed);
  createBlob(strengthArray, data[dataIndex].avg_wind_speed);

  
      convertWindDirectionToRad(data[dataIndex].avg_wind_direction);
      // convertWindDirectionToRad(0); //Test
      //round temperature
      roundDataOld(data);
      console.log(data[dataIndex].avg_air_temperature);
      changeColorByTemperatureOld(data[dataIndex].avg_air_temperature);
      console.log(temperature);
      console.log(data[dataIndex].avg_wind_direction);
      getDegreeFromDirection(data[dataIndex].avg_wind_direction);
      showDataOld(data);
      updateTextPosition();
   
  
  // Add event listener to scrubber
  scrubberControl.addEventListener("input", function () {
    dataIndex = parseInt(this.value);
    console.log(dataIndex);
    // Update scrubber value display
    // Call function to display data for selected timestamp
    displayDataForTimestamp(data[dataIndex]);
    displayDataForTimestamp(data[0]);
  
  
  convertWindDirectionToRad(data[dataIndex].avg_wind_direction);
  roundDataOld(data);
  changeColorByTemperatureOld(data[dataIndex].avg_air_temperature);
  console.log(data[dataIndex].avg_wind_direction);
  getDegreeFromDirection(data[dataIndex].avg_wind_direction);
  showDataOld(data);
   
  });
  console.log(data[dataIndex]);
  // Initialize scrubber value display
  // scrubberValue.innerText = data[0].formattedTimestamp || "No data available";
  // Call function to display initial data
  
  updateTextPosition();
}

function displayDataForTimestamp(entry) {
  // Implement logic to display data for the selected timestamp
  console.log(entry); // For testing, you can log the data entry to see its structure and values
  // Update the UI with the data for the selected timestamp
  //change data format from yyyy-mm-dd hh:mm:ss to dd.mm.yyyy hh:mm
  let date = new Date(entry.hour_start);
  let formattedDate = `${padZero(date.getDate())}.${padZero(date.getMonth() + 1)}.${date.getFullYear()}. ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
  scrubberValue.innerText = formattedDate;
}

function padZero(num) {
  return num.toString().padStart(2, '0');
}


