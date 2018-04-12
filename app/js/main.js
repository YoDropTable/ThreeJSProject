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
import {MeshPhongMaterial} from "three";
import {SphereGeometry} from "three";
import {Mesh} from "three";
import {MeshStandardMaterial} from "three";

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

    this.ambient = new THREE.AmbientLight(0xff52ef, 0.1);
    this.scene.add(this.ambient);

    this.spotLight = new THREE.SpotLight(0xf46e42, 1);
    this.spotLight.position.set(15,40,35);
    this.spotLight.angle = Math.PI / 4;
    this.spotLight.penumbra = 0.05;
    this.spotLight.decay = 2;
    this.spotLight.distance = 300;

     const Sphere = new SphereGeometry(50, 20, 20);
     const SphereColor = new MeshStandardMaterial ({color: 0xBBBBBB});
     this.sphereMesh = new Mesh(Sphere, SphereColor);
     this.sphereMesh.receiveShadow = true;
     this.sphereMesh.matrixAutoUpdate = false;
     this.sphereMesh.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-100,0));

    this.scene.add(this.sphereMesh);

    this.scene.add(this.spotLight);

    this.tracker = new TrackballControls(this.camera);
    this.tracker.rotateSpeed = 2.0;
    this.tracker.noZoom = false;
    this.tracker.noPan = false;
    var texture = new THREE.TextureLoader().load('app/js/textures/mario.jpg');
    this.wall = new Room();
    this.scene.add(this.wall);
    this.copter = new Copter();
    //this.copter.body.matrix.multiply(new THREE.Matrix4().makeTranslation(300,0,0));
    this.scene.add(this.copter);
    //this.myTie = new tie();
    this.myEnterpise = new ThreeJSEnterprise();
    //this.uni = new UniCycle();
    //this.uni.scale.set(new THREE.Vector3());
    //this.scene.add(this.myTie);
    //this.scene.add(this.myEnterpise);
    //this.scene.add(this.uni);


    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.copter.animate();
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
                break;
            case 87:
                // 'w'
                console.log("Thisis happening");
                this.myTie.move(20);
                //this.camera.matrixWorld.multiply(this.camForward);
                break;
            case 68:
                // 'd'
                //this.camera.matrixWorld.multiply(this.camRotateYNeg);
                break;
            case 83:
                // 's'
                //this.camera.matrixWorld.multiply(this.camBackward);
                break;
            case 73:
                // 'i': move bike forward
                this.uni.move(20);
                break;
            case 75:
                // 'k': move bike backward
                this.uni.move(-20);
                break;
            case 74:
                // 'j': turn bike left
                this.uni.turn(10);
                break;
            case 76:
                // 'l': turn bike right
                this.uni.turn(-10);
                break;
        }
    }
}