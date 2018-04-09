import * as THREE from 'three';
import wheel from './models/wheel';
import tie from './models/tie';
import ThreeJSEnterprise from './models/ThreeJSEnterprise'

// import orbit from 'three-orbit-controls';
// const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import {ShaderLib as myTie} from "three";

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
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

    this.myTie = new tie();
    this.myEnterpise = new ThreeJSEnterprise();
    this.scene.add(this.myTie);
    this.scene.add(this.myEnterpise);

    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
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
}