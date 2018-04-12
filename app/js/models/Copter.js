import {CylinderGeometry, Group, Math, Matrix4, Mesh, MeshPhongMaterial, SphereGeometry} from "three";
import Blades from './blades';
import * as THREE from "three";

class Copter extends Group {
    constructor() {
        super();
        this.castShadow = true;
        this.myPosition = 0;
        this.swayLeft = false;
        //Body Color
        const bodyColorMaterial = new MeshPhongMaterial ({color: 0x808080});
        var texture = new THREE.TextureLoader().load('app/js/textures/copter2.jpg');
        var texture2 = new THREE.TextureLoader().load('app/js/textures/tail.jpg');
        var material = new THREE.MeshBasicMaterial({map:texture});
        //Create Blades
        this.blades = new Blades(150, 5);
        this.bladesBack = new Blades(25, 2);


        //create body
        const cockpitGeo = new SphereGeometry(50,20,20);
        // modify UVs to accommodate MatCap texture
        var faceVertexUvs = cockpitGeo.faceVertexUvs[ 0 ];
        for (let i = 0; i < faceVertexUvs.length; i ++ ) {

            var uvs = faceVertexUvs[i];
            var face = cockpitGeo.faces[i];

            for (var j = 0; j < 3; j++) {

                uvs[j].x = face.vertexNormals[j].x * 0.5 + 0.5;
                uvs[j].y = face.vertexNormals[j].y * 0.5 + 0.5;
            }
        }

        const tailGeo = new CylinderGeometry(10,10,150,20);
        this.body = new Group();
        const bodyMesh = new Mesh(cockpitGeo,material);
        material = new THREE.MeshBasicMaterial({map:texture2});
        const tailMesh = new Mesh(tailGeo,material);
        tailMesh.matrixAutoUpdate = false;

        /*const legGeo = new CylinderGeometry(5,5,20,20);
        const legMeshOne = new Mesh(legGeo,bodyColorMaterial);
        legMeshOne.matrixAutoUpdate = false;
        const legMeshTwo = new Mesh(legGeo, bodyColorMaterial);
        legMeshOne.matrixAutoUpdate = false;
        const legMeshThree = new Mesh(legGeo, bodyColorMaterial);
        legMeshOne.matrixAutoUpdate = false;
        const legMeshFour = new Mesh(legGeo, bodyColorMaterial);
        legMeshOne.matrixAutoUpdate = false;
        let rotation = new THREE.Matrix4().makeRotationX(Math.degToRad(45));
        let transOne = new THREE.Matrix4().makeTranslation(20, 0, 0);
        let transTwo = new THREE.Matrix4().makeTranslation(-10, 0, 0);
        legMeshOne.matrix.multiply(transOne);
        legMeshOne.matrix.multiply(rotation);
        legMeshOne.matrix.multiply(transTwo);
        legMeshTwo.matrix.multiply(transOne);
        legMeshTwo.matrix.multiply(rotation);
        legMeshTwo.matrix.multiply(transTwo);
        legMeshThree.matrix.multiply(transOne);
        legMeshThree.matrix.multiply(rotation);
        legMeshThree.matrix.multiply(transTwo);
        legMeshFour.matrix.multiply(transOne);
        legMeshFour.matrix.multiply(rotation);
        legMeshFour.matrix.multiply(transTwo);

        this.add(legMeshOne);
        this.add(legMeshTwo);
        this.add(legMeshThree);
        this.add(legMeshFour);*/


        let rot = new THREE.Matrix4().makeRotationZ(Math.degToRad(90));
        bodyMesh.matrixAutoUpdate = false;
        let trans = new THREE.Matrix4().makeTranslation(75, 0, 0);
        tailMesh.matrix.multiply(trans);
        trans = new THREE.Matrix4().makeTranslation(150,0,0);
        tailMesh.matrix.multiply(rot);
        rot = new THREE.Matrix4().makeRotationY(Math.degToRad(270));
        bodyMesh.matrix.multiply(rot);
        bodyMesh.castShadow = true;
        tailMesh.castShadow = true;


        this.body.add(bodyMesh);
        this.body.add(tailMesh);
        //this.add(this.blades);
        //this.add(this.bladesBack);
        this.add(this.body);
        this.body.add(this.blades);
        this.body.add(this.bladesBack);
        this.blades.matrixAutoUpdate = false;
        this.bladesBack.matrixAutoUpdate = false;
        this.body.matrixAutoUpdate = false;


        let rotX = new THREE.Matrix4().makeRotationX(Math.degToRad(90));
        let rotY = new THREE.Matrix4().makeRotationY(Math.degToRad(90));

        let transUp = new THREE.Matrix4().makeTranslation(0, 0, -50);

        this.blades.matrix.multiply(rotX);
        this.blades.matrix.multiply(transUp);
        this.bladesBack.matrix.multiply(trans);
        trans = new THREE.Matrix4().makeTranslation(0,0,-10);
        this.bladesBack.matrix.multiply(trans);
        this.scale.set(.3,.3,.3);
        this.body.castShadow = true;
    }

    animate() {
        let rotation = new THREE.Matrix4().makeRotationZ(Math.degToRad(20));
        this.blades.matrix.multiply(rotation);
        this.bladesBack.matrix.multiply(rotation);
        if(this.swayLeft){
            this.myPosition = this.myPosition + .1;
            if(this.myPosition > 2.5 ){
                this.swayLeft = false;
                //let rotTurn = new THREE.Matrix4().makeRotationX(Math.degToRad(30));
                //let rotTurnWOrld = new THREE.Matrix4().makeRotationX(Math.degToRad(-30));
                //this.body.matrix.multiply(rotTurn)
                //this.body.matrixWorld.multiply(rotTurnWOrld);
            }
            let translate = new THREE.Matrix4().makeTranslation(0,0,1);
            //let rotBack = new THREE.Matrix4().makeRotationX(Math.degToRad(-15));
            this.body.matrix.multiply(translate);
        }
        else {
            this.myPosition = this.myPosition - .1;
            if(this.myPosition < 0){
                this.swayLeft = true;
                //let rotTurn = new THREE.Matrix4().makeRotationX(Math.degToRad(-15));
                //let rotTurnWOrld = new THREE.Matrix4().makeRotationX(Math.degToRad(15));
                //this.body.matrix.multiply(rotTurn)
                //this.body.matrixWorld.multiply(rotTurnWOrld);
            }
            let translate = new THREE.Matrix4().makeTranslation(0,0,-1);
            this.body.matrix.multiply(translate);

        }


    }

    turn(angle) {
        const rot = new THREE.Matrix4().makeRotationY(Math.degToRad(angle));
        this.frame.matrix.multiply(rot);
    }
}

export default Copter;