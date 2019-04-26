import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
var decomp = require('poly-decomp');
import PolyK from "../utils/polyk";

export default {
  type: Phaser.AUTO,
  scale: {
    mode:Phaser.Scale.FIT,
    autoCenter:Phaser.Scale.CENTER_BOTH,
    parent: "thegame",
    width: 400,
    height: 600,
  },
  render: {
    pixelArt: true
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
      },
      {
        plugin: decomp,
        key: "decomp",
        mapping: "decomp"
      },
      {
        plugin: PolyK,
        key: "PolyK",
        mapping: "PolyK"
      }

    ]
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
