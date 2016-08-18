/*
 * npm init
 * npm install --save d3
 * node index.js
 */
var d3 = require("d3")

var domain = [0, 200];
var points = [5, 20, 50, 100, 150, 200];
var range = ["#ffc800","#ff0000"];

var scales = {
    linear: d3.scaleLinear(),
    pow2: d3.scalePow().exponent(2)
}

function getBlueComponent(colorString) {
    match = /rgb\(.*, (.*), .*\)/.exec(colorString)[1];
    return parseInt(match)
}

for(var name in scales) {
    console.log(name + ":")
    var scaleInstance = scales[name].domain(domain).range(range).nice();
    var colors = points.map(c => scaleInstance(c));
    var blues = colors.map(c => getBlueComponent(c));
    console.log(blues);
    console.log("")
}
