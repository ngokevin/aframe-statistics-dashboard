var d3 = require('d3');

var DATE_FORMAT = d3.timeFormat('%Y-%m-%d');

AFRAME.registerComponent('calendar-heatmap', {
  schema: {
    color: {default: '#BA6C65'},
    colorAlt: {default: '#F2BE8D'},
    json: {default: ''},
    dayMargin: {default: 0.05},
    scaleY: {default: 0.02},
    size: {default: 0.03},
    yearMargin: {default: 0.75}
  },

  init: function () {
    d3.json('data/githubStargazersPerDay.json', this.generate.bind(this));
  },

  generate: function (err, json) {
    var data = this.data;
    var el = this.el;

    var year = d3.select(el)
      .selectAll('.year')
      .data(d3.range(2015, 2017))
      .enter()
      .append('a-entity')
      .attr('data-year', function (datum, i) { return datum; })
      .attr('position', function (datum, i) {
        return {
          x: 0,
          y: 0,
          z: i * data.yearMargin
        };
      })

    d3.selectAll('.year')
      .enter()
      .append('a-entity')
      .attr('geometry', {
        primitive: 'box',
        depth: 2,
        height: .01,
        width: 10
      })
      .attr('material', {
        color: 'brown'
      });

    var bars = year.selectAll('.day')
      .data(function (year) {
        return d3.timeDays(new Date(year, 0, 1), new Date(year + 1, 0, 1));
      })
      .enter()
      .append('a-entity')
      .datum(DATE_FORMAT)
      .attr('position', function (dateStr) {
        date = new Date(dateStr);
        var dayOfWeek = date.getDay();
        var weekOfYear = parseInt(d3.timeFormat('%W')(date));
        return {
          x: weekOfYear * (data.size + data.dayMargin),
          y: json[dateStr] ? (json[dateStr] * data.scaleY / 2) : 0,
          z: dayOfWeek * (data.size + data.dayMargin)
        };
      })
      .attr('geometry', function (date) {
        return {
          primitive: 'box',
          depth: data.size,
          height: json[date] ? json[date] * data.scaleY : .01,
          width: data.size
        };
      })
      .attr('material', function (date) {
        var color = new Date(date).getMonth() % 2 === 0 ? data.color : data.colorAlt;
        return {
          color: json[date] ? color : 'black',
          metalness: 0.3,
          roughness: 0
        };
      });

    el.emit('calendar-heatmap-generated');
  }
});
