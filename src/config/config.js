var config = {
  type: Phaser.AUTO,
  scale: {
    mode:Phaser.Scale.FIT,
    autoCenter:Phaser.Scale.CENTER_BOTH,
    parent: "thegame",
    width: 800,
    height: 600,
  },

  render: {
    pixelArt: true
  },

  physics: {
    default: "matter",
    matter: {
      gravity: {
        y: 1
      },
      debug: true
    }
  }
};
