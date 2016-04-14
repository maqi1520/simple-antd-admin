var d3 = require('d3');
require('d3.hexbin.min.js');
var redrawMap = require('./Algorithm.js').redrawMap;

const displayTagsHexRadius = 65;
const minshowhexRadius = 250; // the min size of hexradius on click
const minshowhexRadiusRatio = 3; // diameter/min(width,height)
const appTag = "apps";
const hostTag = "host";
const upTag = "up";
const hostIdTag = "host_id";

var globalScale = 1;
var globalTranslate = [0, 0];
var svgContainer;

function setShowSize(width, height) {
    return Math.max(minshowhexRadius, Math.min(width / minshowhexRadiusRatio / Math.sqrt(3), height / minshowhexRadiusRatio / 2));
}

exports.reload = function() {
    svgContainer.style("opacity", 0);
    svgContainer.transition().duration(500).style("opacity", 1);
}

exports.stock = function(warehouse, _width, _height, appClickCallback) {

    if (warehouse == false) {
        return;
    }

    // every additional details should be added into collection
    var collection = {};
    for (var i = 0; i < warehouse.showData.length; i++) {
        collection[warehouse.showData[i][hostTag]] = {};
        collection[warehouse.showData[i][hostTag]][appTag] = warehouse.showData[i][appTag];
        collection[warehouse.showData[i][hostTag]][upTag] = warehouse.showData[i][upTag];
        collection[warehouse.showData[i][hostTag]][hostIdTag] = warehouse.showData[i][hostIdTag];
    }


    // redraw svg is better then move all the elements
    var move = [0, 42];
    if (svgContainer) {
        svgContainer.remove();
    }

    d3.select("div.tooltip").remove();
    // getWidthHeight();
    var showhexRadius = setShowSize(_width, _height);
    var svg;
    var svgContainerWindow = [_width, _height];

    var mapWidth = _width - move[0];
    var mapHeight = _height - move[1];

    var mess = redrawMap(warehouse, mapWidth, mapHeight);
    var size = mess[0];
    var card = mess[1];

    //The number of columns and rows of the heatmap
    var mapColumns = size[1],
        mapRows = size[0];

    //The maximum radius the hexagons can have to still fit the screen
    var hexRadius = d3.min([mapWidth / ((mapColumns + 0.5) * Math.sqrt(3)),
        mapHeight / ((mapRows + 1 / 3) * 1.5)
    ]);

    var displayscale = displayTagsHexRadius / hexRadius;

    //Set the new height and width of the SVG based on the max possible
    mapWidth = (mapColumns + 0.5) * hexRadius * Math.sqrt(3);
    mapHeight = mapRows * 1.5 * hexRadius + 0.5 * hexRadius;

    //Set the hexagon radius
    var hexbin = d3.hexbin()
        .radius(hexRadius);

    //Calculate the center positions of each hexagon
    var points = [];
    var hostname = [];
    var rects = [];
    var rectLabels = [];

    function addPoint(i, j) {
        var a;
        var b = (3 * i) * hexRadius / 2;
        if (i % 2 == 0) {
            a = Math.sqrt(3) * j * hexRadius;
        } else {
            a = Math.sqrt(3) * (j - 0.5) * hexRadius;
        }
        points.push([a, b]);

    }

    var offsetX = (move[0] + (svgContainerWindow[0] - move[0] - mapWidth) / 2);
    var offsetY = (move[1] + ((svgContainerWindow[1] - move[1] - mapHeight) / 2));
    var center = [mapWidth / 2 + offsetX, mapHeight / 2 + offsetY];

    var focus;
    var focusd;

    var zoomer = d3.behavior.zoom()
        .scaleExtent([0.5, showhexRadius / hexRadius])
        .on('zoom', redraw);

    var details;
    var weizhi;

    function redraw() {
        svg.attr('transform', 'translate(' + d3.event.translate + ')' +
            ' scale(' + d3.event.scale + ')');
        globalScale = d3.event.scale;
        globalTranslate = d3.event.translate;
        if (d3.event.scale < displayscale) {
            // d3.selectAll("details-wrapper").style("display", "none");
            details.style("display", "none");
        } else {
            // d3.selectAll("details-wrapper").style("display", "block");
            details.style("display", "block");
        }
    }

    // Create SVG element
    svgContainer = d3.select("#hostmap").append("svg")
        .attr("width", svgContainerWindow[0])
        .attr("height", svgContainerWindow[1])
        .call(zoomer);

    weizhi = svgContainer.append("g")
        .attr("class", "weizhi");

    svg = weizhi.append("g")
        .attr("class", "holder");

    function build(data, position) {
        if (data.children) {

            var tempposion = [data.position[0] + position[0], data.position[1] + position[1]];
            // for rects
            if (data.frame) {

                if (data.name != "flare") {
                    var name;
                    name = (data.name[0] + ": " + data.name[1])
                    var temp = {
                        "name": name,
                        "x": Math.sqrt(3) * tempposion[1] * hexRadius,
                        "y": (3 * tempposion[0]) * hexRadius / 2,
                        "width": (data.size[1] + 0.5) * hexRadius * Math.sqrt(3),
                        "height": data.size[0] * 1.5 * hexRadius + 0.5 * hexRadius
                    };
                    if (data.littleBox == true) {
                        var k = 0.12;
                        temp.x -= k * Math.sqrt(3) * hexRadius;
                        temp.y -= k * 2 * hexRadius;
                        temp.width += 2 * k * Math.sqrt(3) * hexRadius;
                        temp.height += 2 * k * 2 * hexRadius;
                    }
                    rects.push(temp);
                }
            }
            // for labels
            var name;
            if (data.name == "flare") {
                name = data.name;
            } else {
                name = data.name[1];
                if (name == 'miss') {
                    // name=data.name[0]+' '+name;
                    name = '';
                }

            }

            if (data.size) {
                if (name.length > 8 * data.size[1] + 4) {
                    name = name.slice(0, 8 * data.size[1] + 3) + '..'
                }
                if (name != "flare") {
                    rectLabels.push({
                        "name": name,
                        "x": Math.sqrt(3) * tempposion[1] * hexRadius + (data.size[1] + 0.5) * hexRadius * Math.sqrt(3) / 2,
                        "y": (3 * tempposion[0]) * hexRadius / 2 - hexRadius
                    });
                }

            }


            for (var i in data.children) {
                build(data.children[i], tempposion);
            }
        } else {
            addPoint(data.position[0] + position[0], data.position[1] + position[1]);
            hostname.push(data.name);
        }
    }

    build(card, [0, 0]);


    var frames = svg.append("g");
    frames.selectAll("rect")
        .data(rects)
        .enter().append("rect")
        .style("opacity", 0.05)
        .style("fill", "#000")
        .attr("rx", hexRadius / 4)
        .attr("ry", hexRadius / 4)
        // .style("fill", "#ECF5FF")
        // .style("stroke", "#C4E1FF")
        // .style("stroke", "rgb(1,1,1)")
        // // .style("stroke", "red")
        // // .style("stroke-dasharray", "20,10,5,5,5,10")
        // .style("stroke-width", 10)
        // .style("stroke-linejoin", "round")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("width", function(d) {
            return d.width;
        })
        .attr("height", function(d) {
            return d.height;
        })
        .on("mouseover", function(d, i) {
            d3.select(this)
                .transition()
                .duration(85)
                // .style("stroke-width", 2)
                .style("opacity", 0.2);
        })
        .on("mouseout", function(d) {
            var el = d3.select(this)
                .transition()
                .duration(500)
                // .style("stroke-width", 0.5)
                .style("opacity", 0.05);
        })
        .on("click", function(d) {
            if (d3.event.defaultPrevented) return;
            var el = d3.select(this);
            if (focusd != d) {
                var sk = Math.min(mapWidth / d.width, mapHeight / (d.height + 2 * hexRadius));
                sk = Math.min(showhexRadius / hexRadius, sk);
                motion(d.x + d.width / 2, d.y + (d.height - hexRadius) / 2, sk);
                focusd = d;
                d3.event.stopPropagation();
            } else {
                zoomback();
                focusd = 0;
                d3.event.stopPropagation();
            }
        });

    var divTooltip = d3.select("#hostmap").append("div")
        .attr("class", "tooltip");


    //Start drawing the hexagons
    var hexbins = svg.append("g").selectAll(".hexagon")
        .data(hexbin(points))
        .enter().append("g")
        .attr("class", "hexagon")
        // .attr("d", function(d) {
        //   return "M" + (d.x + Math.sqrt(3) * hexRadius) + "," + (d.y + hexRadius) + hexbin.hexagon();
        // })
        .style("fill", function(d, i) {
            if (collection[hostname[i]][upTag] == true) {
                return "#65B37E";
            }
            return "#DCDCDC";
        })
        .style("stroke-width", hexRadius / 50)
        .style("stroke-linejoin", "round")
        .style("fill-opacity", 1)
        .on("mouseover", function(d, i) {
            d3.select(this).select("path")
                .transition()
                .duration(10)
                .attr("d", function(d) {
                    return "M" + (d.x + Math.sqrt(3) * hexRadius) + "," + (d.y + hexRadius) + hexbin.hexagon(hexRadius);
                })
            if (globalScale < displayscale) {
                divTooltip.html(hostname[i] + "<br/>")
                    .style("opacity", 0.7)
                    .style("left", (d.x * globalScale + globalTranslate[0] + 1.5 * Math.sqrt(3) * hexRadius * globalScale) + "px")
                    .style("top", (d.y * globalScale + globalTranslate[1] + hexRadius * globalScale - 10) + "px");
            }
        })
        .on("mouseout", function(d) {
            d3.select(this).select("path")
                .transition()
                .duration(500)
                .attr("d", function(d) {
                    return "M" + (d.x + Math.sqrt(3) * hexRadius) + "," + (d.y + hexRadius) + hexbin.hexagon(hexRadius * 0.92);
                })
            divTooltip.style("opacity", 0);
        })
        .on("click", function(d) {
            if (d3.event.defaultPrevented) return;
            var el = d3.select(this);
            if (focusd != d) {
                if (focus) {
                    focus.style("stroke", "#000")
                }
                focus = el;
                el.style("stroke", "#fff");
                hexagonMotion((d.x + Math.sqrt(3) * hexRadius), (d.y + hexRadius), showhexRadius / hexRadius);
                focusd = d;
                d3.event.stopPropagation();
            }
            // else {
            //   zoomback();
            //   focusd = 0;
            //   d3.event.stopPropagation();
            // }
            d3.event.stopPropagation();
        });

    hexbins.append("path")
        .attr("d", function(d) {
            return "M" + (d.x + Math.sqrt(3) * hexRadius) + "," + (d.y + hexRadius) + hexbin.hexagon(hexRadius * 0.92);
        });


    frames.selectAll("text")
        .data(rectLabels)
        .enter().append("g")
        .attr("transform", function(d) {
            return "translate(" + (d.x) + "," + (d.y) + ")";
        })
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "label")
        .style("width", "1px")
        .style("stroke-width", 0)
        .style("fill", "white")
        .style("opacity", 1)
        .style("font", "sans-serif")
        .style("font-size", hexRadius * 0.3 + "px")
        .text(function(d) {
            return d.name;
        });

    details = hexbins.append("g");

    // hostTag
    details.append("foreignObject")
        .attr("x", function(d) {
            return (d.x + Math.sqrt(3) * hexRadius - 0.9 * Math.sqrt(3) * hexRadius / 2);
        })
        .attr("y", function(d) {
            return (d.y + hexRadius - 0.75 * hexRadius);
        })
        .attr("width", 0.9 * hexRadius * Math.sqrt(3))
        .attr("height", hexRadius / 4)
        .append('xhtml:div')
        .append('div').attr("class", "details-div")
        .style("font-size", hexRadius / 12 + "px")
        .append("span")
        .style("white-space", "nowrap")
        .style("overflow", "hidden")
        .style("text-overflow", "ellipsis")
        .style("background-color", "rgba(0, 0, 0, 0.3)")
        .style("display", "inline-block")
        .style("color", "white")
        .style("max-width", 0.8 * hexRadius * Math.sqrt(3))
        .style("border-radius", (hexRadius / 50) + "px")
        .style("padding", "0px " + (hexRadius / 30) + "px")
        .text(function(d, i) {
            return hostname[i];
        });

    var labelHeight = hexRadius / 4;

    var labelWidth = hexRadius * 3 * Math.sqrt(3) / 8;
    var labelWidthGap = labelWidth / 6;

    var appWrapperFocus;
    var appWrapperFocusd;
    var appWrapper = details.selectAll("g").data(labelLayout)
        .enter().append("g")
        .attr("transform", function(d) {
            return "translate(" + d.x + ", " + d.y + ")";
        })
        .attr("hostId", function(d, i) {
            return d.hostName;
        })
        .on("click", function(d, i) {
            if (d3.event.defaultPrevented) return;
            if (appWrapperFocus) {
                appWrapperFocus.style("stroke", "rgba(90, 80, 80, 0)");
            };
            appWrapperFocusd = d;
            appWrapperFocus = d3.select(this).select("rect")
            appWrapperFocus.style("stroke", "rgba(255, 255, 255, 1)");

            appClickCallback(d.hostId, d.appName);
            // d3.event.stopPropagation();
        })
        .on("mouseover", function() {
            d3.select(this).select("rect").style("stroke", "rgba(255, 255, 255, 1)");
        })
        .on("mouseout", function(d) {
            if (appWrapperFocusd == d) {
                return;
            } else {
                d3.select(this).select("rect").style("stroke", "rgba(90, 80, 80, 0)");
            }

        });

    appWrapper.append("rect")
        .attr({
            width: labelWidth,
            height: labelHeight,
            fill: "rgba(50,50,50,0.3)",
            stroke: "rgba(90, 80, 80, 0)",
        })
        .style("stroke-width", labelHeight / 50 + "px");

    appWrapper.append("text")
        .attr({
            "text-anchor": "middle",
            "dominant-baseline": "central",
            "fill": "white",
            "font-size": hexRadius / 12 + "px"
        })
        .attr("transform", function(d) {
            return "translate(" + labelWidth / 2 + ", " + labelHeight / 2 + ")";
        })
        .style({
            "stroke-width": 0,
        })
        .text(function(d) {
            return d.appName;
        });


    function labelLayout(d, i) {
        var dx = d.x + Math.sqrt(3) * hexRadius;
        var dy = d.y + hexRadius;
        var temp = [];
        var tags = collection[hostname[i]][appTag];
        var hostId = collection[hostname[i]][hostIdTag];
        for (var item in tags) {
            temp.push(item)
        }
        temp = temp.slice(0, 6);

        var x = 0,
            y = 0;

        if (temp.length == 1) {
            x = -labelWidth / 2 + dx;
            y = -labelHeight / 2 + dy;
            temp[0] = {
                hostId: hostId,
                appName: temp[0],
                x: x,
                y: y
            }
        } else if (temp.length == 2) {
            x = -labelWidth / 2 + dx;
            temp[0] = {
                hostId: hostId,
                appName: temp[0],
                x: x,
                y: -7 / 6 * labelHeight + dy
            }
            temp[1] = {
                hostId: hostId,
                appName: temp[1],
                x: x,
                y: 1 / 6 * labelHeight + dy
            }
        } else if (temp.length == 4) {
            for (var index = 0; index < temp.length; index++) {
                if (index % 2 == 0) {
                    x = -labelWidth - 0.5 * labelWidthGap + dx;
                } else {
                    x = 0.5 * labelWidthGap + dx;
                }
                if (parseInt(index / 2) == 0) {
                    y = -7 / 6 * labelHeight + dy;
                } else {
                    y = 1 / 6 * labelHeight + dy;
                }
                temp[index] = {
                    hostId: hostId,
                    appName: temp[index],
                    x: x,
                    y: y
                }
            }
        } else if (temp.length == 3) {
            x = -labelWidth / 2 + dx;
            temp[0] = {
                hostId: hostId,
                appName: temp[0],
                x: x,
                y: -11 / 6 * labelHeight + dy
            }
            temp[1] = {
                hostId: hostId,
                appName: temp[1],
                x: x,
                y: -1 / 2 * labelHeight + dy
            }
            temp[2] = {
                hostId: hostId,
                appName: temp[2],
                x: x,
                y: 5 / 6 * labelHeight + dy
            }
        } else if (temp.length >= 5) {
            for (var index = 0; index < temp.length; index++) {
                if (index % 2 == 0) {
                    x = -labelWidth - 0.5 * labelWidthGap + dx;
                } else {
                    x = 0.5 * labelWidthGap + dx;
                }
                if (parseInt(index / 2) == 0) {
                    y = -11 / 6 * labelHeight + dy;
                } else if (parseInt(index / 2) == 1) {
                    y = -1 / 2 * labelHeight + dy;
                } else {
                    y = 5 / 6 * labelHeight + dy;
                }
                temp[index] = {
                    hostId: hostId,
                    appName: temp[index],
                    x: x,
                    y: y
                }
            }
        }
        return temp;
    }

    initPosition();

    function zoomback() {
        motion(center[0] - offsetX, center[1] - offsetY, 1);
    }

    function initPosition() {
        globalTranslate = [offsetX, offsetY];
        svg.call(zoomer.translate(globalTranslate).scale(1).event);
    }

    function motion(x, y, sk) {
        globalScale = sk;
        globalTranslate = [center[0] - x * sk, center[1] - y * sk];
        svg.transition()
            .duration(800)
            .call(zoomer.translate(globalTranslate).scale(globalScale).event);
        if (globalScale) {
            if (globalScale < displayscale) {
                details.style("display", "none");
            } else {
                details.style("display", "block");
            }
        }
    }

    function hexagonMotion(x, y, sk) {
        globalScale = sk;
        globalTranslate = [2.9 * hexRadius - x * sk, center[1] - y * sk];
        svg.transition()
            .duration(800)
            .call(zoomer.translate(globalTranslate).scale(globalScale).event);
        if (globalScale) {
            if (globalScale < displayscale) {
                details.style("display", "none");
            } else {
                details.style("display", "block");
            }
        }
    }

    d3.select('#hostmap').on("click", function() {
        if (d3.event.defaultPrevented) return;
        return zoomback();
    });
}



/*****************
 ** WEBPACK FOOTER
 ** ./modules/hostmap/Stock.js
 ** module id = 706
 ** module chunks = 4
 **/