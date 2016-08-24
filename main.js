#! env node
var d3 = require("d3")
var _ = require("lodash")

var points = _.map({
    5:   { name: "lt5",    expression: "[pixel] < 5"    },
    20:  { name: "lt20",   expression: "[pixel] < 20"   },
    50:  { name: "lt50",   expression: "[pixel] < 50"   },
    100: { name: "lt100",  expression: "[pixel] < 100"  },
    150: { name: "lt150",  expression: "[pixel] < 150"  },
    255: { name: "geq150", expression: "[pixel] >= 150" },
}, (v,k) => [k, v]);

var domain = [5,255];
var colorRange = ["#ffc800","#ff0000"];

var scales = {
    linear: d3.scaleLinear(),
    pow2: d3.scalePow().exponent(2),
    sqrt: d3.scalePow().exponent(0.5),
    log: d3.scaleLog(),
}

function parseColor(color) {
  var match = /rgb\((.*), (.*), (.*)\)/.exec(color);
  return [match[1], match[2], match[3]].map(s => parseInt(s));
}

function hex(color) {
  return "#" + color.map(function(c) {
    var ret = c.toString(16).toUpperCase();
    return ret.length < 2 ? "0" + ret : ret;
  }).join("")
}

function cssRule(scale) {
  scaleInstance = scale.range(colorRange);
  var steps = points.map(function(p, i) {
    // make up for rounding issues
    var percentage;
    if (i == 0) {
      percentage = 0;
    } else if (i == points.length -1) {
      percentage = 100;
    } else {
      percentage = Math.round(100 * p[0] / domain[1]);
    }
    var color = parseColor(scaleInstance(p[0]));
    var hexCode = hex(color)
    return `${hexCode} ${percentage}%`
  });

  return rule = `background: linear-gradient(to right, ${steps.join(',')});`;
}

function mapserverClasses(scale) {
  scaleInstance = scale.range(colorRange);
  return points.map(function(p) {
    var point  = p[0];
    var config = p[1];
    var color = parseColor(scaleInstance(point));

    return `CLASS
  NAME ${config.name}
  EXPRESSION (${config.expression})
  STYLE
    COLOR ${color[0]} ${color[1]} ${color[2]}
  END
END
    `;
  })
}

function main() {
  var args = process.argv.slice(2);
  var output = args[0];
  var scaleName = args[1];
  var scale = scales[scaleName].domain(domain).nice();

  if (output == "values") {
    scaleInstance = scale.range([0, 1000]);
    console.log(points.map(p => [p[0], scaleInstance(p[0])]));
  } else if (output == "css") {
    console.log(cssRule(scale));
  } else if (output == "config") {
    var classes = mapserverClasses(scale);
    classes.forEach(c => console.log(c));
  }
}

main();
