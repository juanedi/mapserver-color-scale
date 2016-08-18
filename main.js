var d3 = require("d3")

var points = {
    5:   { name: "lt5",    expression: "[pixel] < 5"    },
    20:  { name: "lt20",   expression: "[pixel] < 20"   },
    50:  { name: "lt50",   expression: "[pixel] < 50"   },
    100: { name: "lt100",  expression: "[pixel] < 100"  },
    150: { name: "lt150",  expression: "[pixel] < 150"  },
    255: { name: "geq200", expression: "[pixel] >= 150" },
};

var colorRange = ["#ffc800","#ff0000"];

function mapserverClass(name, expression, color) {
    var match = /rgb\((.*), (.*), (.*)\)/.exec(color);
    return `CLASS
  NAME ${name}
  EXPRESSION (${expression})
  STYLE
   COLOR ${match[1]} ${match[2]} ${match[3]}
  END
END
`;
}

var scales = {
    linear: d3.scaleLinear(),
    pow2: d3.scalePow().exponent(2),
    log: d3.scalePow().exponent(0.5),
}

var args = process.argv.slice(2)
var scaleName = args[0]
var scaleInstance = scales[scaleName].domain([0, 255]).range(colorRange).nice();

for (var point in points) {
    var config = points[point];
    var color = scaleInstance(point);
    var classDef = mapserverClass(config.name, config.expression, color);
    console.log(classDef);
}
