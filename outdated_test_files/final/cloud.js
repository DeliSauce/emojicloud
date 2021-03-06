

//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

// Encapsulate the word cloud functionality


// import * as d3 from './d3.layout.cloud.js';
// import d3 from 'd3';
// import d3.layout.cloud from 'd3-layout-cloud';


function wordCloud(selector) {

  var fill = d3.scale.category20();

  //Construct the word cloud's SVG element
  var svg = d3.select(selector).append("svg")
      .attr("width", 500)
      .attr("height", 500)
      .append("g")
      .attr("transform", "translate(250,250)");


  //Draw the word cloud
  function draw(words) {
      var cloud = svg.selectAll("g text")
                      .data(words, function(d) { return d.text; })

      //Entering words
      cloud.enter()
          .append("text")
          .style("font-family", "Impact")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          .text(function(d) { return d.text; });

      //Entering and existing words
      cloud
          .transition()
              .duration(600)
              .style("font-size", function(d) { return d.size + "px"; })
              .attr("transform", function(d) {
                  return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .style("fill-opacity", 1);

      //Exiting words
      cloud.exit()
          .transition()
              .duration(200)
              .style('fill-opacity', 1e-6)
              .attr('font-size', 1)
              .remove();
  }


  //Use the module pattern to encapsulate the visualisation code. We'll
  // expose only the parts that need to be public.
  return {

      //Recompute the word cloud for a new set of words. This method will
      // asycnhronously call draw when the layout has been computed.
      //The outside world will need to call this function, so make it part
      // of the wordCloud return value.
      update: function(words) {
          d3.layout.cloud().size([500, 500])
              .words(words)
              .padding(5)
              // .rotate(function() { return ~~(Math.random() * 2) * 90; })
              .rotate(function() { return ~~0; })
              .font("Impact")
              .fontSize(function(d) { return d.size; })
              .on("end", draw)
              .start();
      }
  }

}

let emojis = {smiley: 44, frown: 22, banana: 25, apple: 33, tree: 55};

function getEmojis() {
  return Object.keys(emojis).map(function(emoji) {
    return {text: emoji, size: emojis[emoji]};
  });
}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
// function showNewWords(vis, i) {
//     i = i || 0;
//
//     vis.update(getWords(i ++ % words.length))
//     setTimeout(function() { showNewWords(vis, i + 1)}, 8000)
// }

function showNewWords(vis, i) {
  i = i || 0;

  vis.update(getEmojis());
  setTimeout(function() { showNewWords(vis, i + 1)}, 8000);
}


//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('body');

//Start cycling through the demo data
showNewWords(myWordCloud);
