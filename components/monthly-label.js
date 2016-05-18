AFRAME.registerComponent('monthly-label', {
  schema: {
    type: 'string'
  },

  init: function () {
    if (this.data.slice(8, 10) !== '01') { return; }

    var el = this.el;
    setTimeout(function () {
      el.setAttribute('geometry', 'depth', 2);
    });
  }
});
