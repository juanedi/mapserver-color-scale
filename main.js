#! env node
var d3 = require("d3")

var points = {
    5:   { name: "lt5",    expression: "[pixel] < 5"    },
    20:  { name: "lt20",   expression: "[pixel] < 20"   },
    50:  { name: "lt50",   expression: "[pixel] < 50"   },
    100: { name: "lt100",  expression: "[pixel] < 100"  },
    150: { name: "lt150",  expression: "[pixel] < 150"  },
    255: { name: "geq150", expression: "[pixel] >= 150" },
};

var domain = [5,255];
var colorRange = ["#ffc800","#ff0000"];

function parseColor(color) {
    var match = /rgb\((.*), (.*), (.*)\)/.exec(color);
    return [match[1], match[2], match[3]];
}

function mapserverClass(name, expression, color) {
    return `CLASS
  NAME ${name}
  EXPRESSION (${expression})
  STYLE
   COLOR ${color[0]} ${color[1]} ${color[2]}
  END
END
`;
}

var scales = {
    linear: d3.scaleLinear(),
    pow2: d3.scalePow().exponent(2),
    sqrt: d3.scalePow().exponent(0.5),
    log: d3.scaleLog(),
}

var args = process.argv.slice(2);
var output = args[0];
var scaleName = args[1];

var scaleInstance = scales[scaleName].domain(domain).nice();

for (var point in points) {
    var config = points[point];

    if (output == "values") {
        scaleInstance = scaleInstance.range([0, 1000]);
        console.log(scaleInstance(point));
    } else {
        scaleInstance = scaleInstance.range(colorRange);
        var color = parseColor(scaleInstance(point));
        if (output == "color") {
            console.log(color);
        } else if (output == "config") {
            console.log(mapserverClass(config.name, config.expression, color));
        }
    }
}
