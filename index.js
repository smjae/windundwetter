let angle = 0;
let temperature = 0;
let windSpeed = 0;
let windDirection = 0;
let windDirectionClean = "";
let maxWindSpeed = 0;
let middle;

let myColor = "#000000";
let temp1 = "rgb(120, 164, 194)";
let temp1bg = "rgba(120, 164, 194, 0.5)";
let temp2 = "rgb(173, 160, 95)";
let temp2bg = "rgba(173, 160, 95, 0.5)";
let temp3 = "rgb(242, 204, 114)";
let temp3bg = "rgba(242, 204, 114, 0.5)";
let temp4 = "rgb(242, 151, 121)";
let temp4bg = "rgba(242, 151, 121, 0.5)";
let temp5 = "rgb(255, 82, 151)";
let temp5bg = "rgba(255, 82, 151, 0.5)";
let body = document.querySelector("body");

(async function getDataFromDB() {
  try {
    const response = await fetch("api.php");
    const data = await response.json();
    // Process the retrieved data
    //convert deg to rad
    convertWindDirectionToRad(data.actual_wind_direction);
    //round temperature
    roundData(data);
    changeColorByTemperature(temperature);
getDegreeFromDirection(data.actual_wind_direction);
    showData(data);
    updateTextPosition();

  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();

function convertWindDirectionToRad(windDirection) {
  angle = (windDirection * Math.PI) / 180;
  // console.log(angle);
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

function changeColorByTemperature(temperature) {
  if (temperature < 0) {
    myColor = temp1;
    body.style.backgroundColor = temp1bg;
  } else if (temperature < 10) {
    myColor = temp2;
    body.style.backgroundColor = temp2bg;
  } else if (temperature < 20) {
    myColor = temp3;
    body.style.backgroundColor = temp3bg;
  } else if (temperature < 30) {
    myColor = temp4;
    body.style.backgroundColor = temp4bg;
  } else {
    myColor = temp5;
    body.style.backgroundColor = temp5bg;
  }
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
  windrichtungsAnzeige.innerHTML = "Windrichtung: "+ windDirectionClean;
  windrichtungsAnzeige.classList.add("windrichtungsAnzeige");
  anzeige.append(windrichtungsAnzeige);

  //Windgeschwindigkeitsanzeige
  let windgeschwAnzeige = document.createElement("div");
  windgeschwAnzeige.innerHTML = "Windgeschwindigkeit: "+windSpeed + " km/h";
  windgeschwAnzeige.classList.add("windgeschwAnzeige");
  anzeige.append(windgeschwAnzeige);

  //Windspitzenanzeige
  let windspitzenAnzeige = document.createElement("div");
  windspitzenAnzeige.innerHTML = "Windspitzen bis "+maxWindSpeed + " km/h";
  windspitzenAnzeige.classList.add("windspitzenAnzeige");
  anzeige.append(windspitzenAnzeige);

  //Measured at
  let measuredAt = document.createElement("div");
  measuredAt.innerHTML = "Zuletzt aktualisiert am: " + data.actual_measured_at;
  measuredAt.classList.add("measuredAt");
  body.append(measuredAt);

  body.append(anzeige);
}

function updateTextPosition() {
  // Find the middle of the blob
  findMiddleOfBlob();

  // Update the position of the text element
  let anzeige = document.querySelector(".anzeigeAllesCurrent");
  anzeige.style.top = middle.y + "px";
  anzeige.style.left = middle.x + "px";

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

let canvas, ctx;
let render, init;
let blob;

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
      let distanceFromPoint = 100;

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

        let strength = { x: 1.5, y: 1.5 };
        strength =
          Math.sqrt(strength.x * strength.x + strength.y * strength.y) * 10;
        if (strength > 100) strength = 100;
        nearestPoint.acceleration = strength / 100;

        // console.log(nearestPoint.acceleration);
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
