
  // $(function() {
  // import d3 from 'd3';
  // var d3 = require('d3');
  // import emojione from 'https://cdn.jsdelivr.net/emojione/2.2.7/lib/js/emojione.min.js'
  // import d3 from 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min.js'
  // $(document).ready(function() {

  let emojis;
  // let gravity = .1;
  // fetchEmojis('world', 'static');

  // d3.json('/api/world_emojis/1', function(data) {
  //   svg.selectAll("*").remove();
  //   emojis = getEmojis(data.emojis);
  //   addEmoji();
  // })
  fetchEmojis('world');

  var width = 500;
  var height = 500;
  var nodes = [];
  var links = [];

  var svg = d3.select("#cloud")
      .attr("width", width)
      .attr("height", height)

  function fetchEmojis(place) {
    // beginTransition();
    let streamPath = '/api/' + place + '_emojis';
    let staticPath = streamPath + '/1'

    d3.json(staticPath, function(data) {
      // endTransition();
      // gravity = .1;
      // nodes.splice(d.index,1) //this deletes the node from the data at the nodes index

      console.log("begin", nodes.length)
      svg.selectAll("*").remove();
      while (nodes.length > 0) {
        nodes.pop();
      }
      // nodes.remove();
      // debugger
      console.log("end", nodes.length)

      // d3.event.stopPropagation();
        //  this.remove();
        //  force.resume();




      // svg.remove();
      // svg.attr("width", width).attr("height", height)

      emojis = getEmojis(data.emojis);
      addEmoji();
      console.log("made a static request");
      //pass in geo location here to point on a map
      initMap({lat: 36.8, lng: -122.75});
    })
    d3.json(streamPath, function(data) {
      console.log("made a streaming request");
    })
  }




  function beginTransition() {
    // const $body = $('body')
    // const $pending = $("<div></div>")
    // $pending.text("FETCHING DATA ...")
    // $body.append($pending)
    // force.gravity(44)
    // .linkStrength(0.8)
    // .friction(0.9)
    // .linkDistance(2000)
    // .charge(-30)
    // .theta(0.8)
    // .alpha(.1);
  }
  function endTransition() {
    // $pending.text("")
    // force.gravity(.3)
    // .linkStrength(0.8)
    // .friction(0.9)
    // .linkDistance(2)
    // .charge(-100)
    // .theta(0.8)
    // .alpha(4.1);
  }

  // function getGravity() {
  //   return gravity;
  // }

  function getEmojis(emojis) {
    let totalVolume = 0;
    let minCount;
    let maxCount;
    Object.values(emojis).forEach((arr, idx) => {
      let count = arr[0];
      totalVolume += ((1 + Math.log(count)) * (1 + Math.log(count)));
      if (idx === 0) {
        minCount = count;
        maxCount = count;
      } else {
        if (count < minCount) minCount = count;
        if (count > maxCount) maxCount = count;
      }
    });

    let emojiScalingFactor = getScalingFactor(totalVolume, minCount, maxCount);

    return Object.keys(emojis).map(function(emoji) {
      // console.log(emojis[emoji])
      return {
        emojiData: emojis[emoji],
        // imageUrl: emojione.shortnameToImage(emoji).match(/src="(.*)"/)[1],
        imageUrl: emojione.unicodeToImage(emoji).match(/src="(.*)"/)[1],
        count: (1 + Math.log(emojis[emoji][0])) * emojiScalingFactor
      };
    });
  }

  function getScalingFactor(total, min, max) {
    let factor = Math.sqrt(width * height / total);
    return factor
  }




  var node = svg.selectAll(".node");


  var force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([width, height])
      .on("tick", tick)
      .friction(0.9)
      .charge(-200)
      .gravity(.1)
      // .charge(-100)
      // .theta(0.8)
      // .alpha(4.1);

      // force.gravity(function() {
      //   return 5
      // });

  function start() {
      node = node.data(force.nodes(), function(d) {
          return d.index;
      });
      node.enter()
          .append("svg:image")
          .attr("xlink:href", function (d) {
            return d.imageUrl;
          })
          .attr("height", function (d) {
            return d.count; // scaleEmoji(d.count);
          })
          .attr("class", function(d) {
              return "node";
          })
          .attr("emojiData", function(d) {
              return d.emojiData;
          });
          // .on("mouseover", fade(.1, true));
          // .attr("width", 120)
          // .attr("height", 120)
      node.exit().remove();
      node.call(force.drag)
          .on("mousedown", function() {
              // console.log("this is a node on mousedown:", node);
              d3.event.stopPropagation();
          });
      // node.on("mousedown", function() {
      //         console.log(node);
      //     });
      node.on("mouseover", function(d) {
        // console.log(d.emojiData);
        updateSidebar(d.emojiData);

        d3.select(this).attr("height", function(d) {
          return d.count * 1.2;
        });

      });

      node.on("mouseout", function(d) {
        d3.select(this).attr("height", function(d) {
          return d.count;
        });
      });

      force.start();
  }

  let tweets = document.getElementById('tweet-text');

  function updateSidebar(emojiData){
    tweets.innerHTML = "COUNT: " + emojiData[0] + ", TEXT: " + emojiData[1] + ", LOCATION: " + emojiData[2] + ", COORDINATES: " + emojiData[3] + ", SCREENAME: " + emojiData[4]
  }


  ////////////////////////////////// COMMENT OUT FOR COLLISION DETECTION //////////////////////////////////

  function tick(e) {
      node.attr("x", function(d) {
              if (d.x >= width - (d.count)) {
                return width - (d.count);
              } else if (d.x <= 0) {
                return 0;
              } else {return d.x;}
          })
          .attr("y", function(d) {
                  if (d.y >= height - (d.count)) {
                    return height - (d.count);
                  } else if (d.y <= 0) {
                    return 0;
                  } else {return d.y;}
              });



  }

  ////////////////////////////////// COLLISION DETECTION //////////////////////////////////


  // root.radius = 0;
  // root.fixed = true;
  //
  // var force = d3.layout.force()
  //     .gravity(0.05)
  //     .charge(function(d, i) { return i ? 0 : -2000; })
  //     .nodes(nodes)
  //     .size([width, height]);

  // force.start();
  //
  // var svg = d3.select("body").append("svg")
  //     .attr("width", width)
  //     .attr("height", height);

  // svg.selectAll("*")
  //     .data(nodes.slice(1))
  //   .enter().append("circle")
  //     .attr("r", function(d) { return d.radius; })
  //     .style("fill", function(d, i) { return color(i % 3); });

  // force.on("tick", function(e) {
  //   var q = d3.geom.quadtree(nodes),
  //       i = 0,
  //       n = nodes.length;
  //
  //   while (++i < n) q.visit(collide(nodes[i]));
  //
  //   svg.selectAll("*")
  //       .attr("x", function(d) { return d.x; })
  //       .attr("y", function(d) { return d.y; });
  // });

  // svg.on("mousemove", function() {
  //   var p1 = d3.mouse(this);
  //   root.px = p1[0];
  //   root.py = p1[1];
  //   force.resume();
  // });

  // function collide(node) {
  //   console.log(node.count);
  //   var r = node.count + 10,
  //       nx1 = node.x - r,
  //       nx2 = node.x + r,
  //       ny1 = node.y - r,
  //       ny2 = node.y + r;
  //   return function(quad, x1, y1, x2, y2) {
  //     if (quad.point && (quad.point !== node)) {
  //       var x = node.x - quad.point.x,
  //           y = node.y - quad.point.y,
  //           l = Math.sqrt(x * x + y * y),
  //           r = node.count + quad.point.radius;
  //       if (l < r) {
  //         l = (l - r) / l * .5;
  //         node.x -= x *= l;
  //         node.y -= y *= l;
  //         quad.point.x += x;
  //         quad.point.y += y;
  //       }
  //     }
  //     return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  //   };
  // }






  ////////////////////////////////// COLLISION DETECTION //////////////////////////////////

  // force.on("tick", function(e) {
  //   var q = d3.geom.quadtree(nodes),
  //       i = 0,
  //       n = nodes.length;
  //   while (++i < n) {
  //     q.visit(collide(nodes[i]));
  //   }
  //   // svg.selectAll("node")
  //   //     .attr("x", function(d) { return d.x; })
  //   //     .attr("y", function(d) { return d.y; });
  //
  //   node.attr("x", function(d) {
  //           if (d.x >= width - (d.count)) {
  //             return width - (d.count);
  //           } else if (d.x <= 0) {
  //             return 0;
  //           } else {return d.x;}
  //       })
  //       .attr("y", function(d) {
  //               if (d.y >= height - (d.count)) {
  //                 return height - (d.count);
  //               } else if (d.y <= 0) {
  //                 return 0;
  //               } else {return d.y;}
  //           });
  //
  // })
  //
  //
  // function collide(node) {
  //   var r = node.count,
  //       nx1 = node.x - r,
  //       nx2 = node.x + r,
  //       ny1 = node.y - r,
  //       ny2 = node.y + r;
  //       console.log(node.count, nx1, nx2, ny1, ny2);
  //   return function(quad, x1, y1, x2, y2) {
  //     if (quad.point && (quad.point !== node)) {
  //       var x = node.x - quad.point.x,
  //           y = node.y - quad.point.y,
  //           l = Math.sqrt(x * x + y * y),
  //           r = node.count + quad.point.radius;
  //       if (l < r) {
  //         l = (l - r) / l * .5;
  //         node.x -= x *= l;
  //         node.y -= y *= l;
  //         quad.point.x += x;
  //         quad.point.y += y;
  //       }
  //     }
  //     return x1 > nx2
  //         || x2 < nx1
  //         || y1 > ny2
  //         || y2 < ny1;
  //   };
  // }


  ////////////////////////////////// COLLISION DETECTION //////////////////////////////////









  let padding = 15, // separation between same-color circles
      clusterPadding = 16, // separation between different-color circles
      maxRadius = 12;

  // function getInitialPosition() {
  //   var position = {};
  //   var dir = Math.floor(Math.random() * 4);
  //   if (dir === 1) {
  //     position.x = Math.random() * width;
  //     position.y = 0;
  //   } else if (dir === 2) {
  //     position.x = Math.random() * width;
  //     position.y = height;
  //   } else if (dir === 3) {
  //     position.x = 0;
  //     position.y = Math.random() * height;
  //   } else if (dir === 4) {
  //     position.x = width;
  //     position.y = Math.random() * height;
  //   }
  //   return position;
  // }
  var delay = 0;
  function addEmoji() {
    // emojis.forEach((emoji) => {
    //   emoji.x = width/2;
    //   emoji.y = width/2;
    //   nodes.push(emoji));
    // });
    // start();

      var emoji = emojis.pop();
      // var position = getInitialPosition();
      emoji.x = width/2;
      emoji.y = width/2;
      // feeling.x = position.x;
      // feeling.y = position.y;
      nodes.push(emoji);

      start();
      if (emojis.length > 0) {
        setTimeout(function () {
          addEmoji();
        }, delay);
          delay -= .1;
      }
  }

  // });
