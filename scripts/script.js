'use strict';

var unitNumber = 28;
var step = 0.1;
var beta = [0.5, 0.5, 0.5];
var lambda = [12, 12, 12];
var mu = [0.05, 0.05];
var nu = 10;
var S = [new Array(unitNumber * (1 / step)), new Array(unitNumber * (1 / step)), new Array(unitNumber * (1 / step))];
var I = [new Array(unitNumber * (1 / step)), new Array(unitNumber * (1 / step)), new Array(unitNumber * (1 / step))];
var R = [new Array(unitNumber * (1 / step)), new Array(unitNumber * (1 / step)), new Array(unitNumber * (1 / step))];
var C = new Array(unitNumber * (1 / step));
var P = [new Array(unitNumber * (1 / step)), new Array(unitNumber * (1 / step))];

var graphWidth = 780;
var graphHeight = 560;
var legendXPadding = 50;
var legendYPadding = 50;
var legendYSpacing = 20;

var healthyPopulationColor = '#303F9F';
var infectedPopulationColor = '#E53935';
var recoveredPopulationColor = '#2E7D32';
var totalPopulationColor = '#F9A825';
var contaminatedPopulationColor = '#880E4F';

function getS(i, v) {
  S[v - 1][i] = [i * step, S[v - 1][i - 1][1] + -beta[v - 1] * S[v - 1][i - 1][1] * I[v - 1][i - 1][1] * step];
}
var getI = [function (i) {
  I[0][i] = [i * step, I[0][i - 1][1] + (beta[0] * S[0][i - 1][1] * I[0][i - 1][1] - I[0][i - 1][1] / lambda[0]) * step];
}, function (i) {
  I[1][i] = [i * step, I[1][i - 1][1] + (beta[1] * S[1][i - 1][1] * I[1][i - 1][1] - I[1][i - 1][1] / lambda[1] - I[1][i - 1][1] * mu[0]) * step];
}, function (i) {
  I[2][i] = [i * step, I[2][i - 1][1] + (C[i - 1][1] / nu - I[2][i - 1][1] / lambda[2] - I[2][i - 1][1] * mu[1]) * step];
}];
function getR(i, v) {
  R[v - 1][i] = [i * step, R[v - 1][i - 1][1] + I[v - 1][i - 1][1] / lambda[v - 1] * step];
}
var getP = [function (i) {}, function (i) {
  P[0][i] = [i * step, I[1][i - 1][1] + S[1][i - 1][1] + R[1][i - 1][1]];
}, function (i) {
  P[1][i] = [i * step, I[2][i - 1][1] + S[2][i - 1][1] + R[2][i - 1][1] + C[i - 1][1]];
}];
function getC(i, v) {
  if (v !== 3) return;
  C[i] = [i * step, C[i - 1][1] + (beta[2] * I[2][i - 1][1] * S[2][i - 1][1] - C[i - 1][1] / nu) * step];
}
function computeValues(v) {
  R[v - 1][0] = [0.0, 0.0];
  for (var i = 1; i <= unitNumber * (1 / step); i++) {
    getS(i, v);
    getI[v - 1](i);
    getR(i, v);
    getC(i, v);
    getP[v - 1](i);
  }
}

var options = [{
  target: '#appletEpidemieV1',
  tip: null,
  width: graphWidth,
  height: graphHeight,
  xAxis: {
    label: 'temps',
    domain: [0, unitNumber]
  },
  yAxis: {
    label: 'effectifs',
    domain: [0, 1]
  },
  disableZoom: true,
  grid: true,
  data: [{
    points: S[0],
    fnType: 'points',
    color: healthyPopulationColor,
    graphType: 'polyline'
  }, {
    points: I[0],
    fnType: 'points',
    color: infectedPopulationColor,
    graphType: 'polyline'
  }, {
    points: R[0],
    fnType: 'points',
    color: recoveredPopulationColor,
    graphType: 'polyline'
  }, {
    points: [[0.0, 1.0], [unitNumber, 1.0]],
    fnType: 'points',
    color: totalPopulationColor,
    graphType: 'polyline'
  }]
}, {
  target: '#appletEpidemieV2',
  tip: null,
  width: graphWidth,
  height: graphHeight,
  xAxis: {
    label: 'temps',
    domain: [0, unitNumber]
  },
  yAxis: {
    label: 'effectifs',
    domain: [0, 1]
  },
  disableZoom: true,
  grid: true,
  data: [{
    points: S[1],
    fnType: 'points',
    color: healthyPopulationColor,
    graphType: 'polyline'
  }, {
    points: I[1],
    fnType: 'points',
    color: infectedPopulationColor,
    graphType: 'polyline'
  }, {
    points: R[1],
    fnType: 'points',
    color: recoveredPopulationColor,
    graphType: 'polyline'
  }, {
    points: P[0],
    fnType: 'points',
    color: totalPopulationColor,
    graphType: 'polyline'
  }]
}, {
  target: '#appletEpidemieV3',
  tip: null,
  width: graphWidth,
  height: graphHeight,
  xAxis: {
    label: 'temps',
    domain: [0, unitNumber]
  },
  yAxis: {
    label: 'effectifs',
    domain: [0, 1]
  },
  disableZoom: true,
  grid: true,
  data: [{
    points: S[2],
    fnType: 'points',
    color: healthyPopulationColor,
    graphType: 'polyline'
  }, {
    points: I[2],
    fnType: 'points',
    color: infectedPopulationColor,
    graphType: 'polyline'
  }, {
    points: R[2],
    fnType: 'points',
    color: recoveredPopulationColor,
    graphType: 'polyline'
  }, {
    points: P[1],
    fnType: 'points',
    color: totalPopulationColor,
    graphType: 'polyline'
  }, {
    points: C,
    fnType: 'points',
    color: contaminatedPopulationColor,
    graphType: 'polyline'
  }]
}];

document.addEventListener('DOMContentLoaded', function () {
  P[0][0] = [0.0, 1.0];
  P[1][0] = [0.0, 1.0];
  for (var i = 1; i <= 3; i++) {
    document.getElementById('S0InputV' + i).oninput = S0ChangedVersions[i - 1];
    document.getElementById('I0InputV' + i).oninput = I0ChangedVersions[i - 1];
    document.getElementById('LambdaInputV' + i).oninput = lambdaChangedVersions[i - 1];
    document.getElementById('BetaInputV' + i).oninput = betaChangedVersions[i - 1];
    if (i > 1) {
      document.getElementById('MuInputV' + i).oninput = muChangedVersions[i - 2];
    }
    if (i < 3) {
      S[i - 1][0] = [0.0, 0.7];
      I[i - 1][0] = [0.0, 0.3];
      updateSliderDisplay('I0InputV' + i, 0.3);
      updateSliderDisplay('S0InputV' + i, 0.7);
    } else {
      S[i - 1][0] = [0.0, 0.4];
      I[i - 1][0] = [0.0, 0.2];
      C[0] = [0.0, 0.4];
      updateSliderDisplay('S0InputV' + i, 0.4);
      updateSliderDisplay('I0InputV' + i, 0.2);
      updateSliderDisplay('C0InputV' + i, 0.4);
      updateSliderDisplay('NuInputV' + i, 10);
    }
    computeValues(i);
    functionPlot(options[i - 1]);
    addLegend('Population totale', totalPopulationColor, 'arial', 12, 0, i);
    addLegend('Population saine', healthyPopulationColor, 'arial', 12, 1, i);
    addLegend('Population infectÃ©e', infectedPopulationColor, 'arial', 12, 2, i);
    addLegend('Population rÃ©tablie', recoveredPopulationColor, 'arial', 12, 3, i);

    updateSliderDisplay('LambdaInputV' + i, lambda[i - 1]);
    updateSliderDisplay('BetaInputV' + i, beta[i - 1]);
    if (i > 1) {
      updateSliderDisplay('MuInputV' + i, mu[i - 2]);
    }
  }
  addLegend('Population contaminÃ©e', contaminatedPopulationColor, 'arial', 12, 4, 3);
  document.getElementById('NuInputV3').oninput = nuChanged;

  document.getElementById('C0InputV3').oninput = C0Changed;
}, false);

function S0Changed(v) {
  var S0Val = parseFloat(document.getElementById('S0InputV' + v).value);
  var newI0Val = 1 - S0Val;
  updateSliderDisplay('I0InputV' + v, newI0Val.toFixed(2));
  updateSliderDisplay('S0InputV' + v, S0Val.toFixed(2));
  document.getElementById('I0InputV' + v).value = newI0Val;
  S[v - 1][0][1] = S0Val;
  I[v - 1][0][1] = newI0Val;
  computeValues(v);
  functionPlot(options[v - 1]);
}
var S0ChangedVersions = [function () {
  S0Changed(1);
}, function () {
  S0Changed(2);
}, function () {
  var oldVal = S[2][0][1];
  var S0Val = parseFloat(document.getElementById('S0InputV3').value);
  var deltaHalf = (S0Val - oldVal) / 2;
  var newI0Val = I[2][0][1] - deltaHalf;
  var newC0Val = C[0][1] - deltaHalf;
  if (newI0Val < 0) {
    newI0Val = 0;
    newC0Val -= deltaHalf;
  }
  if (newC0Val < 0) {
    newC0Val = 0;
    newI0Val -= deltaHalf;
  }
  newC0Val = newC0Val < 0 ? 0 : newC0Val;
  newI0Val = newI0Val < 0 ? 0 : newI0Val;
  document.getElementById('I0InputV3').value = newI0Val;
  document.getElementById('C0InputV3').value = newC0Val;
  S[2][0][1] = S0Val;
  I[2][0][1] = newI0Val;
  C[0][1] = newC0Val;
  updateSliderDisplay('I0InputV3', newI0Val.toFixed(2));
  updateSliderDisplay('S0InputV3', S0Val.toFixed(2));
  updateSliderDisplay('C0InputV3', newC0Val.toFixed(2));
  computeValues(3);
  functionPlot(options[2]);
}];
function I0Changed(v) {
  var I0Val = parseFloat(document.getElementById('I0InputV' + v).value);
  var newS0Val = 1 - I0Val;
  updateSliderDisplay('I0InputV' + v, I0Val.toFixed(2));
  updateSliderDisplay('S0InputV' + v, newS0Val.toFixed(2));
  document.getElementById('S0InputV' + v).value = newS0Val;
  S[v - 1][0][1] = newS0Val;
  I[v - 1][0][1] = I0Val;
  computeValues(v);
  functionPlot(options[v - 1]);
}
function C0Changed() {
  var oldVal = C[0][1];
  var C0Val = parseFloat(document.getElementById('C0InputV3').value);
  var deltaHalf = (C0Val - oldVal) / 2;
  var newS0Val = S[2][0][1] - deltaHalf;
  var newI0Val = I[2][0][1] - deltaHalf;
  if (newI0Val < 0) {
    newI0Val = 0;
    newS0Val -= deltaHalf;
  }
  if (newS0Val < 0) {
    newS0Val = 0;
    newI0Val -= deltaHalf;
  }
  newS0Val = newS0Val < 0 ? 0 : newS0Val;
  newI0Val = newI0Val < 0 ? 0 : newI0Val;
  document.getElementById('S0InputV3').value = newS0Val;
  document.getElementById('I0InputV3').value = newI0Val;
  S[2][0][1] = newS0Val;
  I[2][0][1] = newI0Val;
  C[0][1] = C0Val;
  updateSliderDisplay('I0InputV3', newI0Val.toFixed(2));
  updateSliderDisplay('S0InputV3', newS0Val.toFixed(2));
  updateSliderDisplay('C0InputV3', C0Val.toFixed(2));
  computeValues(3);
  functionPlot(options[2]);
}
var I0ChangedVersions = [function () {
  I0Changed(1);
}, function () {
  I0Changed(2);
}, function () {
  var oldVal = I[2][0][1];
  var I0Val = parseFloat(document.getElementById('I0InputV3').value);
  var deltaHalf = (I0Val - oldVal) / 2;
  var newS0Val = S[2][0][1] - deltaHalf;
  var newC0Val = C[0][1] - deltaHalf;
  if (newS0Val < 0) {
    newS0Val = 0;
    newC0Val -= deltaHalf;
  }
  if (newC0Val < 0) {
    newC0Val = 0;
    newS0Val -= deltaHalf;
  }
  newS0Val = newS0Val < 0 ? 0 : newS0Val;
  newC0Val = newC0Val < 0 ? 0 : newC0Val;
  document.getElementById('S0InputV3').value = newS0Val;
  document.getElementById('C0InputV3').value = newC0Val;
  S[2][0][1] = newS0Val;
  I[2][0][1] = I0Val;
  C[0][1] = newC0Val;
  updateSliderDisplay('I0InputV3', I0Val.toFixed(2));
  updateSliderDisplay('S0InputV3', newS0Val.toFixed(2));
  updateSliderDisplay('C0InputV3', newC0Val.toFixed(2));
  computeValues(3);
  functionPlot(options[2]);
}];

function lambdaChanged(v) {
  lambda[v - 1] = parseFloat(document.getElementById('LambdaInputV' + v).value);
  updateSliderDisplay('LambdaInputV' + v, lambda[v - 1]);
  computeValues(v);
  functionPlot(options[v - 1]);
}
var lambdaChangedVersions = [function () {
  lambdaChanged(1);
}, function () {
  lambdaChanged(2);
}, function () {
  lambdaChanged(3);
}];
var betaChangedVersions = [function () {
  betaChanged(1);
}, function () {
  betaChanged(2);
}, function () {
  betaChanged(3);
}];
var muChangedVersions = [function () {
  muChanged(2);
}, function () {
  muChanged(3);
}];
function betaChanged(v) {
  beta[v - 1] = parseFloat(document.getElementById('BetaInputV' + v).value);
  updateSliderDisplay('BetaInputV' + v, beta[v - 1].toFixed(2));
  computeValues(v);
  functionPlot(options[v - 1]);
}
function muChanged(v) {
  mu[v - 2] = parseFloat(document.getElementById('MuInputV' + v).value);
  updateSliderDisplay('MuInputV' + v, mu[v - 2].toFixed(2));
  computeValues(v);
  functionPlot(options[v - 1]);
}
function nuChanged() {
  nu = parseFloat(document.getElementById('NuInputV3').value);
  updateSliderDisplay('NuInputV3', nu.toFixed(2));
  computeValues(3);
  functionPlot(options[2]);
}

function updateSliderDisplay(sliderId, value) {
  document.getElementById(sliderId + 'Display').innerHTML = value;
}
function addLegend(text, color, font, fontSize, rank, version) {
  var y = rank * legendYSpacing + legendYPadding;
  var textSVG = d3.select('#appletEpidemieV' + version).select('svg').append('text').attr('font-family', font).attr('font-size', fontSize).attr('fill', color).attr('y', y).text(text);

  var bbox = null;
  textSVG.each(function () {
    bbox = this.getBBox();
  });
  var x = graphWidth - legendXPadding - bbox.width;
  textSVG.attr('x', x);

  d3.select('#appletEpidemieV' + version).select('svg').append('line').attr('x1', x - x % 100 - 20).attr('x2', x - x % 100).attr('y1', y - bbox.height / 4).attr('y2', y - bbox.height / 4).attr('stroke-width', 2).attr('stroke', color);
}