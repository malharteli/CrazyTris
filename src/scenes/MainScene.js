import "phaser";
import "../utils/polyk";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  create() {
    this.matter.world.update60Hz();
    this.matter.world.setBounds(
      10,
      10,
      game.config.width - 20,
      game.config.height - 20
    );
    const arrow = "40 0 40 20 100 20 100 80 40 80 40 100 0 50";
    var poly = this.add.polygon(400, 300, arrow);
    this.matter.add.gameObject(poly, {
      shape: {
        type: "fromVerts",
        verts: arrow,
        flagInternal: true
      }
    });
    this.matter.add.rectangle(
      game.config.width / 2 - 50,
      game.config.width / 2,
      100,
      300
    );
    this.lineGraphics = this.add.graphics();
    this.input.on("pointerdown", this.startDrawing, this);
    this.input.on("pointerup", this.stopDrawing, this);
    this.input.on("pointermove", this.keepDrawing, this);
    this.isDrawing = false;
  }

  startDrawing() {
    this.isDrawing = true;
  }

  keepDrawing() {
    if (this.isDrawing) {
      this.lineGraphics.clear();
      this.lineGraphics.lineStyle(1, 0x00ff00);
      this.lineGraphics.moveTo(point.downX, point.downY);
      this.lineGraphics.lineTo(pointer.x, pointer.y);
      this.lineGraphics.strokePath();
    }
  }

  stopDrawing(pointer) {
    this.lineGraphics.clear();
    this.isDrawing = false;
    let bodies = this.matter.world.localWorld.bodies;
    let toBeSliced = [];
    let toBeCreated = [];
    for (let i = 0; i < bodies.length; i++) {
      let vertices = bodies[i].parts[0].vertices;
      let pointsArr = [];
      vertices.forEach(vertex => {
        pointsArr.push(vertex.x, vertex.y);
      });
      let slicedPolygons = PolyK.Slice(
        pointsArray,
        pointer.downX,
        pointer.downY,
        pointer.upX,
        point.upY
      );
      if (slicedPolygons.length > 1) {
        toBeSliced.push(bodies[i]);
        slicedPolygons.forEach(points => {
          toBeCreated.push(points);
        });
      }
    }
    toBeSliced.forEach(
      function(body) {
        this.matter.world.remove(body);
      }.bind(this)
    );
    toBeCreated.forEach(
      function(points) {
        let polyObject = [];
        for (let i = 0; i < points.length / 2; i++) {
          polyObject.push({
            x: points[i * 2],
            y: points[i * 2 + 1]
          });
        }
        let sliceCenter = this.matter.add.fromVertices(
          sliceCenter.x,
          sliceCenter.y,
          polyObject,
          {
            isStatic: false
          }
        );
      }.bind(this)
    );
  }
}
