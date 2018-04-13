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
import {Math} from 'three';
import {SphereGeometry} from "three";
import {MeshStandardMaterial} from "three";
import {Mesh} from "three";
var selected;
var rotationSpeed = 20;
var swayDistance = 1;
var bladeRotation = rotationSpeed;
var copterSway = swayDistance;

//select items with mouse vars
var raycaster;
var mouse;
var objects = [];
var stats;
///////////
const moveCamForward = new THREE.Matrix4().makeTranslation(0,0,-10);
const moveCamBackward = new THREE.Matrix4().makeTranslation(0,0,10);
const strafeCamLeft = new THREE.Matrix4().makeTranslation(-10,0,0);
const strafeCamRight = new THREE.Matrix4().makeTranslation(10,0,0);
const climbCamDown = new THREE.Matrix4().makeTranslation(0,-10,0);
const climbCamUp = new THREE.Matrix4().makeTranslation(0,10,0);
const rotCamLeft = new THREE.Matrix4().makeRotationZ(Math.degToRad(10));
const rotCamRight = new THREE.Matrix4().makeRotationZ(Math.degToRad(-10));
const turnCamLeft = new THREE.Matrix4().makeRotationY(Math.degToRad(10));
const turnCamRight = new THREE.Matrix4().makeRotationY(Math.degToRad(-10));
const pitchCamUp = new THREE.Matrix4().makeRotationX(Math.degToRad(10));
const pitchCamDown = new THREE.Matrix4().makeRotationX(Math.degToRad(-10));

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
      window.addEventListener('keydown', this.onKeypress.bind(this), false);
      window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    // Enable antialias for smoother lines
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 500);
    this.camera.position.z = 100;

      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      // renderer = new THREE.CanvasRenderer();
      // renderer.setPixelRatio( window.devicePixelRatio );
      // renderer.setSize( window.innerWidth, window.innerHeight );
      // container.appendChild( renderer.domElement );

      //stats = new Stats();
      //container.appendChild( stats.dom );

      window.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );
      window.addEventListener( 'touchstart', this.onDocumentTouchStart.bind(this), false );

      const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
      lightOne.position.set (10, 40, 100);
      this.scene.add (lightOne);

      this.ambient = new THREE.AmbientLight(0xff52ef, 0.1);
      this.scene.add(this.ambient);
      this.spotLight = new THREE.SpotLight(0xfFFFFF, 1);
      this.spotLight.position.set(15,40,35);
      this.spotLight.angle = Math.PI / 4;
      this.spotLight.penumbra = 0.4;
      this.spotLight.decay = 2;
      this.spotLight.distance = 300;

      const Sphere = new SphereGeometry(50, 20, 20);
      const SphereColor = new MeshStandardMaterial ({color: 0xBBBBBB});
      this.sphereMesh = new Mesh(Sphere, SphereColor);
      this.sphereMesh.receiveShadow = true;
      this.sphereMesh.matrixAutoUpdate = false;
      this.sphereMesh.matrix.multiply(new THREE.Matrix4().makeTranslation(0,-100,20));
        this.scene.add(this.sphereMesh);
        this.scene.add(this.spotLight);
      // const orbiter = new OrbitControls(this.camera);
    // orbiter.enableZoom = false;
    // orbiter.update();
    // this.tracker = new TrackballControls(this.camera);
    // this.tracker.rotateSpeed = 2.0;
    // this.tracker.noZoom = false;
    // this.tracker.noPan = false;
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

      this.camera.matrixAutoUpdate = false;
      //move camera only by default
      selected = this.camera;


    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.copter.animate(bladeRotation, copterSway);

      raycaster.setFromCamera( mouse, this.camera );
      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects( this.scene.children );
        if(intersects.length > 0){
            console.log(intersects);
            intersects = null;
        }

      for ( var i = 0; i < intersects.length; i++ ) {

          intersects[ i ].object.material.color.set( 0xff0000 );

      }


    this.renderer.render(this.scene, this.camera);
    //this.camera.lookAt( this.scene.position );
    //this.tracker.update();



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
    this.renderer.setSize(w, h, false);
   // this.tracker.handleResize();
  }
    onKeypress(event) {
        const key = event.keyCode || event.charCode;

        switch (key) {
            case 65:
                // 'a'
                this.strafeLeft(selected);

                break;
            case 87:
                // 'w'
                this.moveForward(selected);

                //this.copter.matrix.multiply(move);
                //this.camera.matrixWorld.multiply(move);
                break;
            case 68:
                // 'd'
this.strafeRight(selected);
                //this.camera.matrixWorld.multiply(this.camRotateYNeg);
                break;
            case 83:
                // 's'
                this.moveBackward(selected);
                break;
            case 38:
                // 'up arrow'
                this.pitchUp(selected);

                break;
            case 40:
                // down arrow - pitch down
                this.pitchDown(selected);
                break;
            case 37:
                // left arrow - rot left
                this.turnLeft(selected);
                break;
            case 39:
                // right arrow- rot right
                this.turnRight(selected);
                break;
            case 81:
                // 'q'- roll left
                this.rollLeft(selected);
                break;
            case 69:
                // 'e'- roll right
                this.rollRight(selected);
                break;
            case 70:
                // 'f' climb down
                this.climbDown(selected);
                break;
            case 82:
                // 'r' climb up
                this.climbUp(selected);
                break;
            case 49:
                // '1' turn left
                selected = this.camera;
                break;
            case 50:
                // '2' turn right
                selected = this.copter;

                break;
            case 51:
                // '3'- stop blades rotation
                selected = this.myEnterpise;
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
            case 55:
                // '7'- increase blade speed
                if(rotationSpeed < 120)
                rotationSpeed++;
                console.log(rotationSpeed);
                bladeRotation = rotationSpeed;
                break;
            case 56:
                // '8'- decrease blade speed
                if(rotationSpeed > 0)
                rotationSpeed--;
                bladeRotation = rotationSpeed;
                break;
        }
    }

    moveForward(selected){
      if(selected == this.copter){

          console.log("Thisis happening");
          //move forward
          this.copter.move(-10);

      } else if(selected == this.myEnterpise){

      } else if(selected == this.sphereMesh){

      } else { //move camera
          this.camera.matrixWorld.multiply(moveCamForward);
      }
    }

    moveBackward(selected){
        if(selected == this.copter){
            this.copter.move(10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(moveCamBackward);
            //move backward

            //this.camera.matrixWorld.multiply(this.camBackward);
        }
    }

    strafeLeft(selected){
        if(selected == this.copter){
            this.copter.strafe(10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(strafeCamLeft);
        }
    }

    strafeRight(selected){
        if(selected == this.copter){
            this.copter.strafe(-10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(strafeCamRight);
            //strafe right

        }
    }

    climbUp(selected){
        if(selected == this.copter){

            this.copter.climb(10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera

            //pitch up
            this.camera.matrixWorld.multiply(climbCamUp);
        }
    }

    climbDown(selected){
        if(selected == this.copter){

            this.copter.climb(-10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(climbCamDown);
        }
    }

    rollLeft(selected){
        if(selected == this.copter){

            this.copter.roll(10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(rotCamLeft);
        }
    }


    rollRight(selected){
        if(selected == this.copter){
            this.copter.roll(-10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(rotCamRight);
        }
    }

    turnLeft(selected){
        if(selected == this.copter){
            this.copter.turn(10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(turnCamLeft);
        }
    }

    turnRight(selected){
        if(selected == this.copter){

            this.copter.turn(-10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(turnCamRight);
        }
    }

    pitchUp(selected){
        if(selected == this.copter){

            this.copter.pitch(-10);

        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(pitchCamUp);

        }
    }

    pitchDown(selected){
        if(selected == this.copter){
            this.copter.pitch(10);
        } else if(selected == this.myEnterpise){

        } else if(selected == this.sphereMesh){

        } else { //move camera
            this.camera.matrixWorld.multiply(pitchCamDown);
        }
    }


    onDocumentTouchStart( event ) {
      // console.log("ondocumenttouch?");
      //
      //   event.preventDefault();
      //
      //   event.clientX = event.touches[0].clientX;
      //   event.clientY = event.touches[0].clientY;
      //   this.onDocumentMouseDown( event );

    }

    onDocumentMouseDown( event ) {
      console.log("in mouse down");

        // event.preventDefault();
        //
        // mouse.x = ( event.clientX / this.renderer.domElement.clientWidth ) * 2 - 1;
        // mouse.y = - ( event.clientY / this.renderer.domElement.clientHeight ) * 2 + 1;
        // console.log(mouse.x);
        // console.log(mouse.y);
        // raycaster.setFromCamera( mouse, this.camera );
        // console.log(raycaster);
        //
        // var intersects = raycaster.intersectObjects( this.scene.children );
        //
        // if ( intersects.length > 0 ) {
        //     console.log("clicked");
        //     console.log(mouse.x);
        //     console.log(mouse.y);
        //
        //     intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
        //
        //     //var particle = new THREE.Sprite( particleMaterial );
        //     //particle.position.copy( intersects[ 0 ].point );
        //     //particle.scale.x = particle.scale.y = 16;
        //     //this.scene.add( particle );
        //
        // }

        /*
        // Parse all the faces
        for ( var i in intersects ) {

            intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

        }
        */
    }

    onMouseMove( event ) {

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        //console.log(mouse.x);
        //console.log(mouse.y);
    }
}