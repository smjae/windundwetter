// Initialize variables
let angle = 0;
let temperature = 0;
let windSpeed = 0;
let windDirection = 0;
let windDirectionClean = "";
let maxWindSpeed = 0;
let middle;
let windStufe = 0;
let strength = { x: 1.5, y: 1.5 };
// let strength = { x: 5, y: 5 };
let strengthArray = {};
let dataIndex = 0;
let myColor = "#000000";
let body = document.querySelector("body");
let blob;
let distanceFromPoint = 5000;
let counter = 0;
let videoSource;

// Fetch data from the database and process it
async function getDataFromDB() {
  try {
    const response = await fetch("api.php");
    const data = await response.json();
    processData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Process the retrieved data
async function processData(data) {
  moveBlobByWindSpeed(data.actual_wind_speed);
  createBlob(strengthArray, data.actual_wind_speed);
  convertWindDirectionToRad(data.actual_wind_direction);
  roundData(data);
  changeColorByTemperature(temperature);
  getDegreeFromDirection(data.actual_wind_direction);
  showData(data);
  updateTextPosition();
  addAnimation();
}

// Convert wind direction from degrees to radians
function convertWindDirectionToRad(windDirection) {
  let angleDeg = windDirection - 90;
  if (angleDeg > 180) {
    angleDeg -= 360;
  }
  angle = angleDeg * (Math.PI / 180);
}

// Adjust blob movement based on wind speed
function moveBlobByWindSpeed(windSpeed) {
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
}

// Round data to one decimal place
function roundData(data) {
  temperature = Math.round(data.actual_air_temperature * 10) / 10;
  windSpeed = Math.round(data.actual_wind_speed * 10) / 10;
  maxWindSpeed = Math.round(data.actual_maximum_wind_speed * 10) / 10;
  windDirection = Math.round(data.actual_wind_direction);
}

// Round data to one decimal place
function roundDataOld(data) {
  temperature = Math.round(data.avg_air_temperature * 10) / 10;
  windSpeed = Math.round(data.avg_wind_speed * 10) / 10;
  windDirection = Math.round(data.avg_wind_direction);
}

// Change blob color based on temperature
function changeColorByTemperature(temperature) {
  let hue = Math.floor(mapRange(temperature, -20, 40, 180, 0));
  myColor = `hsl(${hue}, 50%, 46%)`;
  body.style.backgroundColor = `hsla(${hue}, 50%, 46%, 0.5)`;
  if (temperature > 40 || temperature < -20) {
    myColor = `hsl(180, 0%, 46%)`;
    body.style.backgroundColor = `hsla(180, 0%, 46%, 0.5)`;
  }
}

// Change blob color based on temperature
function changeColorByTemperatureOld(temperature) {
  let hue = Math.floor(mapRange(temperature, -20, 40, 180, 0));
  myColor = `hsl(${hue}, 50%, 46%)`;
}

// Display data on the UI
function showData(data) {
  const anzeige = document.createElement("div");
  anzeige.classList.add("anzeigeAllesCurrent");
  const temperaturAnzeige = document.createElement("div");
  temperaturAnzeige.innerHTML = `${temperature}°C`;
  temperaturAnzeige.classList.add("temperaturAnzeige");
  anzeige.append(temperaturAnzeige);

  const windrichtungsAnzeige = document.createElement("div");
  windrichtungsAnzeige.innerHTML = `Windrichtung: ${windDirectionClean}`;
  windrichtungsAnzeige.classList.add("windrichtungsAnzeige");
  anzeige.append(windrichtungsAnzeige);

  const windgeschwAnzeige = document.createElement("div");
  windgeschwAnzeige.innerHTML = "Windstärke: ";
  const windgeschwGruppe = document.createElement("div");
  windgeschwGruppe.classList.add("windgeschwGruppe");
  anzeige.append(windgeschwGruppe);
  windgeschwGruppe.append(windgeschwAnzeige);
  const windgeschwEllipsen = document.createElement("div");
  windgeschwEllipsen.classList.add("windgeschwEllipsen");
  windgeschwGruppe.append(windgeschwEllipsen);

  calculateWindSpeedEllipses(data.actual_wind_speed);

  for (let i = 0; i < (windStufe > 5 ? 5 : windStufe); i++) {
    const ellipse = document.createElement("div");
    ellipse.classList.add("ellipse");
    ellipse.style = "width: 10px; height: 10px; background-color: black;";
    windgeschwEllipsen.append(ellipse);
  }
  for (let i = 0; i < 5 - windStufe; i++) {
    const ellipse = document.createElement("div");
    ellipse.classList.add("ellipse");
    ellipse.style = "width: 10px; height: 10px;";
    windgeschwEllipsen.append(ellipse);
  }

  const windspitzenAnzeige = document.createElement("div");
  windspitzenAnzeige.innerHTML = `Windspitzen bis ${maxWindSpeed} m/s`;
  windspitzenAnzeige.classList.add("windspitzenAnzeige");
  anzeige.append(windspitzenAnzeige);

  const measuredAt = document.querySelector(".measuredAt");
  measuredAt.innerHTML = `Zuletzt aktualisiert am: <br>${data.actual_measured_at}`;

  body.append(anzeige);
}

// Display data on the UI
function showDataOld(data) {
  const anzeige = document.createElement("div");
  anzeige.classList.add("anzeigeAllesCurrent");

  const temperaturAnzeige = document.createElement("div");
  temperaturAnzeige.innerHTML = `${temperature}°C`;
  temperaturAnzeige.classList.add("temperaturAnzeige");
  anzeige.append(temperaturAnzeige);

  const windrichtungsAnzeige = document.createElement("div");
  windrichtungsAnzeige.innerHTML = `Windrichtung: ${windDirectionClean}`;
  windrichtungsAnzeige.classList.add("windrichtungsAnzeige");
  anzeige.append(windrichtungsAnzeige);

  const windgeschwAnzeige = document.createElement("div");
  windgeschwAnzeige.innerHTML = "Windstärke: ";
  const windgeschwGruppe = document.createElement("div");
  windgeschwGruppe.classList.add("windgeschwGruppe");
  anzeige.append(windgeschwGruppe);
  windgeschwGruppe.append(windgeschwAnzeige);
  const windgeschwEllipsen = document.createElement("div");
  windgeschwEllipsen.classList.add("windgeschwEllipsen");
  windgeschwGruppe.append(windgeschwEllipsen);

  calculateWindSpeedEllipses(data.avg_wind_speed);

  for (let i = 0; i < (windStufe > 5 ? 5 : windStufe); i++) {
    const ellipse = document.createElement("div");
    ellipse.classList.add("ellipse");
    ellipse.style = "width: 10px; height: 10px; background-color: black;";
    windgeschwEllipsen.append(ellipse);
  }
  for (let i = 0; i < 5 - windStufe; i++) {
    const ellipse = document.createElement("div");
    ellipse.classList.add("ellipse");
    ellipse.style = "width: 10px; height: 10px;";
    windgeschwEllipsen.append(ellipse);
  }

  body.append(anzeige);
}
//update data when scrubbing
function updatePastDataText(data) {
  const temperaturAnzeige = document.querySelector(".temperaturAnzeige");
  temperaturAnzeige.innerHTML = `${temperature}°C`;

  const windrichtungsAnzeige = document.querySelector(".windrichtungsAnzeige");
  windrichtungsAnzeige.innerHTML = `Windrichtung: ${windDirectionClean}`;

  const windgeschwEllipsen = document.querySelector(".windgeschwEllipsen");
  windgeschwEllipsen.innerHTML = "";

  calculateWindSpeedEllipses(data.avg_wind_speed);

  for (let i = 0; i < (windStufe > 5 ? 5 : windStufe); i++) {
    const ellipse = document.createElement("div");
    ellipse.classList.add("ellipse");
    ellipse.style = "width: 10px; height: 10px; background-color: black;";
    windgeschwEllipsen.append(ellipse);
  }
  for (let i = 0; i < 5 - windStufe; i++) {
    const ellipse = document.createElement("div");
    ellipse.classList.add("ellipse");
    ellipse.style = "width: 10px; height: 10px;";
    windgeschwEllipsen.append(ellipse);
  }
}

// // Update text position based on blob movement
function updateTextPosition() {
  findMiddleOfBlob();

  const anzeige = document.querySelector(".anzeigeAllesCurrent");
  if (anzeige) {
    anzeige.style.top = `${middle.y}px`;
    anzeige.style.left = `${middle.x}px`;
  }

  requestAnimationFrame(updateTextPosition);
}

function updateTextPositionOld() {
  findMiddleOfBlob();

  const anzeige = document.querySelector(".anzeigeAllesCurrent");
  if (anzeige) {
    anzeige.style.top = `${middle.y}px`;
    anzeige.style.left = `${middle.x}px`;
  }

  // requestAnimationFrame(updateTextPosition);
}

// Find the middle point of the blob
function findMiddleOfBlob() {
  let sumX = 0;
  let sumY = 0;
  for (const point of blob.points) {
    sumX += point.position.x;
    sumY += point.position.y;
  }
  middle = { x: sumX / blob.points.length, y: sumY / blob.points.length };
  return middle;
}

// Determine wind direction in cardinal points
function getDegreeFromDirection(windDirection) {
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

// Calculate the number of ellipses based on wind speed
function calculateWindSpeedEllipses(windSpeed) {
  if (windSpeed > 32.7) {
    windStufe = 6;
  } else if (windSpeed > 20) {
    windStufe = 5;
  } else if (windSpeed > 10.8) {
    windStufe = 4;
  } else if (windSpeed > 5.5) {
    windStufe = 3;
  } else if (windSpeed > 3.4) {
    windStufe = 2;
  } else if (windSpeed > 0.4) {
    windStufe = 1;
  } else {
    windStufe = 0;
  }
}

// Initialize and create the blob animation
function createBlob(strengthArray, windSpeed) {
  class Blob {
    constructor() {
      this.points = [];
    }

    resetProperties() {
      this.points.forEach((point) => {
        point.radialEffect = 0; // Reset radialEffect for each point
        point.speed = 0; // Reset speed for each point
        point.acceleration = 0;

        // point.azimuth = Math.PI - point.azimuth; // Reset azimuth for each point
        point.azimuth = 0; // Reset azimuth for each point
        point._acceleration = 0; // Reset acceleration for each point

        point._speed = 0; // Reset speed for each point
        point._radialEffect = 0; // Reset radialEffect for each point

        //reset elasticity and friction
        point.elasticity = 0.002;
        point.friction = 0.01;
        //reset all ather properties
        point._components = {
          x: Math.cos(point.azimuth),
          y: Math.sin(point.azimuth),
        };
        angle = 0;
        temperature = 0;
        middle;
        strength = { x: 1.5, y: 1.5 };
        //  strengthArray = {};
        dataIndex = 0;
        myColor = "#000000";
        body = document.querySelector("body");
        blob;
        distanceFromPoint = 0;

        // distanceFromPoint = 5000;
      });
    }

    init() {
      for (let i = 0; i < this.numPoints; i++) {
        this.points.push(new Point(this.divisional * (i + 1), this));
      }
    }

    render() {
      const canvas = this.canvas;
      const ctx = this.ctx;
      const pointsArray = this.points;
      const points = this.numPoints;
      const center = this.center;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointsArray[0].solveWith(pointsArray[points - 1], pointsArray[1]);

      let p0 = pointsArray[points - 1].position;
      let p1 = pointsArray[0].position;

      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      ctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);

      for (let i = 1; i < points; i++) {
        pointsArray[i].solveWith(
          pointsArray[i - 1],
          pointsArray[i + 1] || pointsArray[0]
        );

        const p2 = pointsArray[i].position;
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

        p1 = p2;
      }

      const xc = (p1.x + pointsArray[0].position.x) / 2;
      const yc = (p1.y + pointsArray[0].position.y) / 2;
      ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);

      ctx.fillStyle = myColor;
      ctx.fill();

      requestAnimationFrame(this.render.bind(this));
    }

    set canvas(value) {
      if (
        value instanceof HTMLElement &&
        value.tagName.toLowerCase() === "canvas"
      ) {
        this._canvas = value;
        this.ctx = this._canvas.getContext("2d");
      }
    }
    get canvas() {
      return this._canvas;
    }

    get numPoints() {
      return this._points || 32;
    }
    set numPoints(value) {
      if (value > 2) {
        this._points = value;
      }
    }

    get radius() {
      if (window.innerWidth < 600) {
        return this._radius || 120;
      } else {
        return this._radius || 150;
      }
    }
    set radius(value) {
      if (value > 0) {
        this._radius = value;
      }
    }

    get position() {
      return this._position || { x: 0.5, y: 0.5 };
    }
    set position(value) {
      if (typeof value === "object" && value.x && value.y) {
        this._position = value;
      }
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
          0.002 -
        this.speed * 0.01;

      if (this.acceleration > 0.5 || this.acceleration < -0.5) {
        this.acceleration = 0;
      }
      // this.speed += this.acceleration * 2;
      // this.radialEffect += this.speed * 5;
    }

    get position() {
      return {
        x:
          this.parent.center.x +
          this._components.x * (this.parent.radius + this.radialEffect),
        y:
          this.parent.center.y +
          this._components.y * (this.parent.radius + this.radialEffect),
      };
    }

    // get elasticity() {
    //   return this._elasticity || 0.002;
    // }
    // set elasticity(value) {
    //   if (typeof value === "number") {
    //     this._elasticity = value;
    //

    //   }
    // }

    // get friction() {
    //   return this._friction || 0.01;
    // }
    // set friction(value) {
    //   if (typeof value === "number") {
    //     this._friction = value;
    //   }
    // }

    get acceleration() {
      return this._acceleration || 0;
    }
    set acceleration(value) {
      if (typeof value === "number") {
        this._acceleration = value;
        // if (this._acceleration > 0.5 || this._acceleration < -0.5) {
        //   this._acceleration = 0;
        // }
        // this._acceleration = 0;
        // this.speed += this._acceleration * 2;
        //random numbers between -0.5 and 0.5
        if (this.speed > 0.5 || this.speed < -0.5) {
          this.speed = 0.5;
        }
        this.speed += this._acceleration * 2;
      }
    }

    get speed() {
      return this._speed || 0;
    }
    set speed(value) {
      if (typeof value === "number") {
        this._speed = value;
        this.radialEffect += this._speed * 5;
        if (this.radialEffect > 100) {
          this.radialEffect = 100;
        }
      }
    }

    get radialEffect() {
      return this._radialEffect || 0;
    }
    set radialEffect(value) {
      if (typeof value === "number") {
        this._radialEffect = value;
      }
    }
  }

  const init = function () {
    //remove all points

    blob = new Blob();

    const canvas = document.createElement("canvas");
    canvas.setAttribute("touch-action", "none");
    canvas.zIndex = -100;
    document.body.appendChild(canvas);

    const resize = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const mouseMove = function () {
      if (typeof angle === "number") {
        let nearestPoint = null;
        distanceFromPoint = 5000;

        blob.points.forEach((point) => {
          if (Math.abs(angle - point.azimuth) < distanceFromPoint) {
            nearestPoint = point;
            distanceFromPoint = Math.abs(angle - point.azimuth);
          }
        });
        if (nearestPoint) {
          strength = strengthArray;

          strength =
            Math.sqrt(strength.x * strength.x + strength.y * strength.y) * 10;
          if (strength > 50) strength = 50;
          nearestPoint.acceleration = strength / 100;
          // nearestPoint.acceleration = strength / 100;
        }
      }

      requestAnimationFrame(mouseMove.bind(this));
    };
    requestAnimationFrame(mouseMove);

    blob.canvas = canvas;

    blob.init();

    blob.render();
  };

  init();

  calculateWindSpeedEllipses(windSpeed);
}

// Map range of values
function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Add animation based on conditions
function addAnimation() {
  const animationContainer = document.createElement("div");
  animationContainer.classList.add("animationContainer");

  const videoContainer = document.createElement("div");
  videoContainer.classList.add("videoContainer");
  animationContainer.append(videoContainer);

  const video = document.createElement("img");
  video.classList.add("video");
  video.autoplay = true;
  video.loop = true;
  console.log(temperature, windSpeed);
  if (windSpeed > 5) {
    videoSource = "./img/flying_animation.gif";
  } else if (temperature > 20) {
    videoSource = "./img/walking_animation_hot.gif";
  } else if (temperature > 10) {
    videoSource = "./img/walking_animation_normal.gif";
  } else {
    videoSource = "./img/walking_animation.gif";
  }

  video.src = videoSource;
  video.preload = "auto";
  videoContainer.append(video);

  document.body.append(animationContainer);
}

// Event listener for info button
document.querySelector(".infoButton").addEventListener("click", function () {
  if (document.querySelector(".mobileOverlay")) {
    document.querySelector(".mobileOverlay").style.display = "flex";
  } else {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    overlay.style =
      "display: flex; width: 350px; height: auto; transition: all .3s ease-in;";

    const closeContainer = document.createElement("div");
    closeContainer.classList.add("close-container");
    const leftright = document.createElement("div");
    leftright.classList.add("leftright");
    const rightleft = document.createElement("div");
    rightleft.classList.add("rightleft");
    const closeButton = document.createElement("label");
    closeButton.classList.add("close");
    closeButton.innerHTML = "close";
    closeContainer.append(leftright);
    closeContainer.append(rightleft);
    closeContainer.append(closeButton);
    overlay.append(closeContainer);

    const title = document.createElement("div");
    title.classList.add("titleOverlay");
    title.innerHTML = "Über diese Website:";

    const text = document.createElement("div");
    text.classList.add("textOverlay");
    text.innerHTML =
      'Diese Visualisierung der Daten vom Bahnhof St. Gallen entstand im Rahmen eines studentischen Projekts im Studiengang "Multimedia Production". Die Daten stammen von opendata.swiss und werden von den St. Galler Stadtwerken (sgsw) zur Verfügung gestellt:<br> <a href="https://daten.stadt.sg.ch/explore/dataset/windmessung-bahnhofplatz-stadt-stgallen/information/?headless=" style="color: white">www.daten.stadt.sg.ch/windmessung-bahnhofplatz-stadt-stgallen</a>.';

    const title2 = document.createElement("div");
    title2.classList.add("titleOverlay");
    title2.innerHTML = "Wie funktioniert es?";

    const text2 = document.createElement("div");
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
  }
});

// Event listener for dark mode toggle
document.getElementById("dn").addEventListener("change", function () {
  if (this.checked) {
    switchToDarkMode();
    getPastData();
    timePassed();
  } else if (blob) {
    switchToLightMode();
    getDataFromDB();
  } else {
    console.log("blob not defined");
  }
});

// Switch to dark mode
function switchToDarkMode() {
  removeElementsForModeChange();
  body.style.backgroundColor = "rgb(3, 18, 49)";
  body.style.transition = "background-color 0.3s ease-in-out";
  changeTextColor("white");
  document.querySelector(".measuredAt").style.display = "none";
  document.querySelector(".title").innerHTML =
    "Wetterdaten der letzten 48 Stunden am Bahnhof St. Gallen";
  document.querySelector("#logo").src = "./img/logo_windundwetter_white.png";
}

// Switch to light mode
function switchToLightMode() {
  removeElementsForModeChange();
  changeTextColor("black");
  document.querySelector(".measuredAt").style.display = "block";
  document.querySelector(".title").innerHTML =
    "aktuelle Wetterdaten<br>am Bahnhof St. Gallen";
  document.querySelector("#logo").src = "./img/logo_windundwetter.png";
}

// Remove elements before mode change
function removeElementsForModeChange() {
  blob.resetProperties();
  document.querySelector("canvas")?.remove();
  document.querySelector(".anzeigeAllesCurrent")?.remove();
  document.querySelector(".animationContainer")?.remove();
  document.querySelector(".scrubberContainer")?.remove();

  //reset variables

  temperature = 0;
  windSpeed = 0;
  windDirection = 0;
  windDirectionClean = "";
  maxWindSpeed = 0;
  middle = null;
  windStufe = 0;
  strength = { x: 1.5, y: 1.5 };
  strengthArray = {};
  dataIndex = 0;
}

// Change text color based on mode
function changeTextColor(color) {
  document.querySelector(".header").style.color = color;
  document.querySelector(".header").style.transition = "color 0.3s ease-in-out";
  document.querySelector(".infoButton p").style.color = color;
  document.querySelector(".infoButton p").style.transition =
    "color 0.3s ease-in-out";
  document.querySelector(".infoButton").style.border = `3px solid ${color}`;
  document.querySelector(".infoButton").style.transition =
    "border 0.3s ease-in-out";
}

// Create containers and scrubber for past data
function timePassed() {
  const scrubberContainer = document.createElement("div");
  scrubberContainer.classList.add("scrubberContainer");
  scrubberContainer.innerHTML = `<input id="scrubberControl" type="range" value="0" />
  <div id="scrubberValue"></div>`;
  body.append(scrubberContainer);
}

// Fetch past data and display it
async function getPastData() {
  try {
    const response = await fetch("apiOldData.php");
    const data = await response.json();
    const newData = data.filter((item) => item.avg_wind_direction !== null);
    initializeScrubber(newData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Initialize scrubber for past data
function initializeScrubber(data) {
  const scrubberControl = document.querySelector("#scrubberControl");
  const scrubberValue = document.querySelector("#scrubberValue");
  //get value where data[0].hour_start.split(" ")[1].split(":")[0] is 00 and return what percentage of the scrubber it is

  scrubberControl.max = data.length - 1;
  scrubberControl.value = data.length - 1;
  dataIndex = data.length - 1;
  displayDataForTimestamp(data[dataIndex]);
  updateScrubberValue(scrubberValue, data[dataIndex].hour_start);

  scrubberControl.addEventListener("input", function () {
    document.querySelector("canvas")?.remove();
    blob.resetProperties();
    dataIndex = parseInt(this.value);
    displayDataForTimestamp(data[dataIndex]);
  });
}

// Display data for the selected timestamp
function displayDataForTimestamp(entry) {
  updateScrubberValue(
    document.querySelector("#scrubberValue"),
    entry.hour_start
  );
  updatePastData(entry);
}

// Update past data
function updatePastData(entry) {
  moveBlobByWindSpeed(entry.avg_wind_speed);
  createBlob(strengthArray, entry.avg_wind_speed);
  convertWindDirectionToRad(entry.avg_wind_direction);
  roundDataOld(entry);
  changeColorByTemperatureOld(entry.avg_air_temperature);
  getDegreeFromDirection(entry.avg_wind_direction);
  if (document.querySelector(".anzeigeAllesCurrent")) {
    updatePastDataText(entry);
  } else {
    showDataOld(entry);
  }

  updateTextPositionOld();
}

// Update scrubber value display
function updateScrubberValue(element, timestamp) {
  const date = new Date(timestamp);
  const formattedDate = `${padZero(date.getDate())}.${padZero(
    date.getMonth() + 1
  )}.${date.getFullYear()}. ${padZero(date.getHours())}:${padZero(
    date.getMinutes()
  )}`;
  element.innerText = formattedDate;
}

// Add leading zero to single digit numbers
function padZero(num) {
  return num.toString().padStart(2, "0");
}

// Execute getDataFromDB when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  getDataFromDB();
  checkWindowWidth();
});

function checkWindowWidth() {
  if (window.innerWidth < 600) {
    //remove all overlays
    document.querySelector(".mobileOverlay")?.remove();

    // document.querySelector(".infoButton").style.display = "none";
    const mobileOverlay = document.createElement("div");
    mobileOverlay.classList.add("mobileOverlay");
    const closeContainer = document.createElement("div");
    closeContainer.classList.add("close-container");
    const closeButton = document.createElement("label");
    closeButton.classList.add("close");
    closeButton.innerHTML = "close";
    const leftright = document.createElement("div");
    leftright.classList.add("leftright");
    const rightleft = document.createElement("div");
    rightleft.classList.add("rightleft");
    closeContainer.append(leftright);
    closeContainer.append(rightleft);
    closeContainer.append(closeButton);
    mobileOverlay.append(closeContainer);

    const title = document.createElement("div");
    title.classList.add("titleOverlay");
    title.innerHTML = "Über diese Website:";

    const text = document.createElement("div");
    text.classList.add("textOverlay");
    text.innerHTML =
      'Diese Visualisierung der Daten vom Bahnhof St. Gallen entstand im Rahmen eines studentischen Projekts im Studiengang "Multimedia Production". Die Daten stammen von opendata.swiss und werden von den St. Galler Stadtwerken (sgsw) zur Verfügung gestellt:<br> <a href="https://daten.stadt.sg.ch/explore/dataset/windmessung-bahnhofplatz-stadt-stgallen/information/?headless=" style="color: white">www.daten.stadt.sg.ch/windmessung-bahnhofplatz-stadt-stgallen</a>.';

    const title2 = document.createElement("div");
    title2.classList.add("titleOverlay");
    title2.innerHTML = "Wie funktioniert es?";

    const text2 = document.createElement("div");
    text2.classList.add("textOverlay");
    text2.innerHTML =
      "Die gezeigten Daten sind Echtzeitmessungen des Windes und der Temperatur am Bahnhof St. Gallen. Diese werden per CRON-Job alle 10 Minuten in eine Datenbank gespeichert und von da aus abgerufen. So können auch ältere Messzeitpunkte abgerufen werden. Die Visualisierung verändert sich je nach Temperatur, Windrichtung oder Windgeschwindigkeit. Viel Spass beim Anschauen!";

    mobileOverlay.append(title);
    mobileOverlay.append(text);
    mobileOverlay.append(title2);
    mobileOverlay.append(text2);
    document.body.insertAdjacentElement("beforeend", mobileOverlay);

    closeContainer.addEventListener("click", function () {
      mobileOverlay.style.display = "none";
    });
    return;
  } else {
    document.querySelector(".mobileOverlay")?.remove();
  }
}

// Call checkWindowWidth initially to create overlay if needed

// Event listener to check window width on resize
window.addEventListener("resize", checkWindowWidth);

//analyze blob and its properties and console.log the biggest changes over time
