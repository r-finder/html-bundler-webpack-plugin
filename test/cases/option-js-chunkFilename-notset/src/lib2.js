const Lib2 = {
  title: 'Lib2 Quisque ultrices',

  // 1024 bytes of text
  data: 'Lib2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce efficitur pretium urna. Fusce condimentum dapibus lectus, et cursus turpis interdum ut. Nulla suscipit viverra turpis ac eleifend. Nulla dignissim auctor nulla, at imperdiet magna volutpat in. Proin neque elit, interdum sit amet mauris quis, aliquam placerat enim. Morbi cursus, ipsum eu finibus suscipit, odio velit iaculis orci, vitae malesuada orci lacus nec erat. Integer pellentesque velit a ex convallis, ac commodo justo tincidunt. Cras ac lorem et sem feugiat molestie non et est. Nullam id diam ut lorem bibendum congue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras eget lectus gravida, dictum risus ac, rutrum ante. Phasellus faucibus lectus urna, eget vehicula magna fringilla et. Morbi tempus ipsum in velit auctor efficitur. Fusce luctus ultrices diam, ac pellentesque enim aliquet at. Cras finibus odio in nisl bibendum vulputate. Quisque ultrices nisi vel enim faucibus, non scelerisque ex portitor.',

  getTitle() {
    return this.title;
  },

  getText() {
    return this.data;
  },

  getSize() {
    return this.data.length;
  },
};

module.exports = Lib2;
