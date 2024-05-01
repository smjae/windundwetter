// import chartJs from 'chart.js';

var container = document.createElement('div');
container.classList.add('chart-container');
document.body.appendChild(container);
//create elements for db data
var dbData = document.createElement('div');
dbData.classList.add('db-data');
//append to body of index.html
document.body.appendChild(dbData);

//db request
var request = new XMLHttpRequest();
request.open('GET', 'http://localhost:3000/data', true);
request.onload = function () {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var data = JSON.parse(request.responseText);
    console.log(data);
    dbData.innerHTML = data;
  } else {
    // We reached our target server, but it returned an error

  }
};

