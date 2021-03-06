import "phaser";
import "../utils/polyk";
import "poly-decomp";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  create() {
    console.log(this.matter);
    this.matter.world.update60Hz();
    this.matter.world.setBounds(
      10,
      10,
      game.config.width - 20,
      game.config.height - 40
    );
    // const arrow = [ 0,20, 84,20, 84,0, 120,50, 84,100, 84,80, 0,80 ];
    // var poly = this.add.polygon(400, 300, arrow);
    // var star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';
    // this.matter.add.gameObject(poly, {
    //   shape: {
    //     type: "fromVerts",
    //     verts: arrow,
    //     flagInternal: true
    //   }
    // })
    // this.matter.add.gameObject(poly, {
    //   shape:{
    //     type: "fromVertices",
    //     verts: star,
    //     flagInternal: true
    //   }
    // })
    const testBlock = this.matter.add.rectangle(
      game.config.width / 2 - 50,
      game.config.width / 2,
      100,
      300
    );
    this.matter.add.polygon(100, 200, 6, 75, 0x0000ff);
    this.matter.add.fromVertices(
      200,
      200,
      [0, 20, 84, 20, 84, 0, 120, 50, 84, 100, 84, 80, 0, 80],
      75
    );
    this.matter.add.circle(100, 100, 50, 10);

    // Sensors
    const lSideSensor = this.matter.add.rectangle(
      10,
      game.config.height / 2,
      2,
      game.config.height,
      { isStatic: true, isSensor: true }
    );
    const rSideSensor = this.matter.add.rectangle(
      game.config.width,
      game.config.height / 2,
      2,
      game.config.height,
      { isStatic: true, isSensor: true }
    );
    //const lSideSensor- detects if objects are hitting the left side
    this.matterCollision.addOnCollideStart({
      objectA: lSideSensor,
      callback: eventData => {
        console.log("left sensor", eventData);
      }
    });
    //const rSideSensor- detects if objects are hitting the right side
    this.matterCollision.addOnCollideStart({
      objectA: rSideSensor,
      callback: eventData => {
        console.log("right sensor", eventData);
      }
    });
    // const sensor = this.matter.add.rectangle(game.config.width/2, game.config.height-25, game.config.width, 50, { isStatic: true, isSensor: true });
    let sensorList = [];
    let px = 1;
    while (px < 2) {
      const sensor = this.matter.add.rectangle(
        game.config.width / 2,
        game.config.height - 25 * px,
        game.config.width,
        50,
        { isStatic: true, isSensor: true }
      );
      // MatterCollission
      this.matterCollision.addOnCollideStart({
        objectA: testBlock,
        callback: eventData => {
          let toBeSliced = [];
          let toBeCreated = [];
          let eventInterval = 4000
          let vertices = eventData.bodyB.parts[0].vertices;
          let pointsArr = [];
          setInterval(
          vertices.forEach(vertex => {
            pointsArr.push(vertex.x, vertex.y);
          }),eventInterval)
          let slicedPolygons = setInterval(PolyK.Slice(
            pointsArr,
            sensor.parts[0].vertices[1].x,
            sensor.parts[0].vertices[1].y,
            sensor.parts[0].vertices[0].x,
            sensor.parts[0].vertices[0].y
          ), eventInterval);
          console.log("slicedPolygon", slicedPolygons)
          if (slicedPolygons && !eventData.bodyB.isSensor) {
            console.log('slicethePolys!')
            toBeSliced.push(eventData.bodyB);
            slicedPolygons.forEach(points => {
              toBeCreated.push(points);
            });
            console.log('blockToBeCreated',  toBeCreated)
          }
          console.log("to Be Sliced Block", toBeSliced);
          toBeSliced.forEach(
            function(body) {
              console.log('slicing')
              this.matter.world.remove(body);
            }.bind(this)
          );
          console.log("toBeCreated Block", toBeCreated);
          toBeCreated.forEach(
            function(points) {
              let polyObject = [];
              for (let i = 0; i < points.length / 2; i++) {
                polyObject.push({
                  x: points[i * 2],
                  y: points[i * 2 + 1]
                });
              }
              // console.log('list of object positions', polyObject)
              let sliceCenter = Phaser.Physics.Matter.Matter.Vertices.centre(
                polyObject
              );
              this.matter.add.fromVertices(
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

      });
      sensorList.push(sensor);
      px++;
    }
    console.log(this.matter.world.localWorld.bodies);
    this.lineGraphics = this.add.graphics(2);
    this.input.on("pointerdown", this.startDrawing, this);
    this.input.on("pointerup", this.stopDrawing, this);
    this.input.on("pointermove", this.keepDrawing, this);
    this.isDrawing = false;
  }

  startDrawing() {
    this.isDrawing = true;
  }

  keepDrawing(pointer) {
    if (this.isDrawing) {
      this.lineGraphics.clear();
      this.lineGraphics.lineStyle(1, 0x00ff00);
      this.lineGraphics.moveTo(pointer.downX, pointer.downY);
      this.lineGraphics.lineTo(pointer.x, pointer.y);
      this.lineGraphics.strokePath();
    }
  }

  stopDrawing(pointer) {
    this.lineGraphics.clear();
    this.isDrawing = false;
    let bodies = [];
    this.matter.world.localWorld.bodies.forEach(body => {
      if (!body.isSensor) {
        console.log("body isn't sensor");
        bodies.push(body);
      }
    });
    console.log("body shapes", bodies);
    let toBeSliced = [];
    let toBeCreated = [];
    for (let i = 0; i < bodies.length; i++) {
      let vertices = bodies[i].parts[0].vertices;
      let pointsArr = [];
      vertices.forEach(vertex => {
        pointsArr.push(vertex.x, vertex.y);
      });
      let slicedPolygons = PolyK.Slice(
        pointsArr,
        pointer.downX,
        pointer.downY,
        pointer.upX,
        pointer.upY
      );
      if (slicedPolygons.length > 1) {
        toBeSliced.push(bodies[i]);
        slicedPolygons.forEach(points => {
          toBeCreated.push(points);
        });
      }
    }
    console.log("to Be Sliced", toBeSliced);
    toBeSliced.forEach(
      function(body) {
        this.matter.world.remove(body);
      }.bind(this)
    );
    console.log("toBeCreated", toBeCreated);
    toBeCreated.forEach(
      function(points) {
        let polyObject = [];
        for (let i = 0; i < points.length / 2; i++) {
          polyObject.push({
            x: points[i * 2],
            y: points[i * 2 + 1]
          });
        }
        // console.log('list of object positions', polyObject)
        let sliceCenter = Phaser.Physics.Matter.Matter.Vertices.centre(
          polyObject
        );
        this.matter.add.fromVertices(sliceCenter.x, sliceCenter.y, polyObject, {
          isStatic: false
        });
      }.bind(this)
    );
  }
}
