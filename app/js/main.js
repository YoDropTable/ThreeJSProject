import * as THREE from 'three';
import Copter from './models/Copter'
import tie from './models/tie';
import ThreeJSEnterprise from './models/ThreeJSEnterprise'
import UniCycle from './models/UniCycle'
// import orbit from 'three-orbit-controls';
// const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import {ShaderLib as myTie} from "three";
import Wall from "./models/wall";
import Room from "./models/Room";
const rotationSpeed = 20;
const swayDistance = 1;
var bladeRotation = rotationSpeed;
var copterSway = swayDistance;
export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
      window.addEventListener('keydown', this.onKeypress.bind(this), false);
    // Enable antialias for smoother lines
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 500);
    this.camera.position.z = 100;

      const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
      lightOne.position.set (10, 40, 100);
      this.scene.add (lightOne);
    // const orbiter = new OrbitControls(this.camera);
    // orbiter.enableZoom = false;
    // orbiter.update();
    this.tracker = new TrackballControls(this.camera);
    this.tracker.rotateSpeed = 2.0;
    this.tracker.noZoom = false;
    this.tracker.noPan = false;
    var texture = new THREE.TextureLoader().load('app/js/textures/mario.jpg');
    this.wall = new Room();
    this.scene.add(this.wall);
    this.copter = new Copter();
    this.copter.body.matrix.multiply(new THREE.Matrix4().makeTranslation(300,0,0));
    this.scene.add(this.copter);
    //this.myTie = new tie();
    this.myEnterpise = new ThreeJSEnterprise();
    //this.uni = new UniCycle();
    //this.uni.scale.set(new THREE.Vector3());
    //this.scene.add(this.myTie);
    this.scene.add(this.myEnterpise);
    //this.scene.add(this.uni);


    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.copter.animate(bladeRotation, copterSway);
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();
    requestAnimationFrame(() => this.render());

  }

  resizeHandler() {
    const canvas = document.getElementById("mycanvas");
    let w = window.innerWidth - 16;
    let h = 0.75 * w;  /* maintain 4:3 ratio */
    if (canvas.offsetTop + h > window.innerHeight) {
      h = window.innerHeight - canvas.offsetTop - 16;
      w = 4/3 * h;
    }
    canvas.width = w;
    canvas.height = h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.tracker.handleResize();
  }
    onKeypress(event) {
        const key = event.keyCode || event.charCode;

        switch (key) {
            case 65:
                // 'a'
                //this.camera.matrixWorld.multiply(this.camRotateYPos);
                //strafe left
                this.copter.strafe(10);
                break;
            case 87:
                // 'w'
                console.log("Thisis happening");
                //move forward
                this.copter.move(-10);
                //this.camera.matrixWorld.multiply(this.camForward);
                break;
            case 68:
                // 'd'
                //strafe right
                this.copter.strafe(-10);
                //this.camera.matrixWorld.multiply(this.camRotateYNeg);
                break;
            case 83:
                // 's'
                //move backward
                this.copter.move(10);
                //this.camera.matrixWorld.multiply(this.camBackward);
                break;
            case 38:
                // 'up arrow'
                //pitch up
                this.copter.pitch(-10);

                break;
            case 40:
                // down arrow - pitch down
                this.copter.pitch(10);
                break;
            case 37:
                // left arrow- roll left
                this.copter.roll(10);
                break;
            case 39:
                // right arrow- roll right
                this.copter.roll(-10);
                break;
            case 81:
                // 'q' climb down
                this.copter.climb(-10);
                break;
            case 69:
                // 'e' climb up
                this.copter.climb(10);
                break;
            case 49:
                // '1' turn left
                this.copter.turn(10);
                break;
            case 50:
                // '2' turn right
                this.copter.turn(-10);
                break;
            case 51:
                // '3'- stop blades rotation
                bladeRotation = 0;
                break;
            case 52:
                // '4'- start rotation
                bladeRotation = rotationSpeed;
                break;
            case 53:
                // '5' - stop sway
                copterSway = 0;
                break;
            case 54:
                // '6'- start sway
                copterSway = swayDistance;
                break;
        }
    }
}