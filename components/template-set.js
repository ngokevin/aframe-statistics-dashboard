AFRAME.registerComponent('template-set', {
  schema: {
    on: {type: 'string'},
    src: {type: 'string'},
    data: {type: 'string'}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    el.addEventListener(data.on, function () {
      el.setAttribute('template', {src: data.src, data: data.data});
    });
  }
});
