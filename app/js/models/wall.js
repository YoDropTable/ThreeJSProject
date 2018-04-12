import {CylinderGeometry, Group, Mesh, MeshBasicMaterial, TorusGeometry} from "three";
import * as THREE from "three";

export default class Wall {
    constructor (texture) { // number of spokes on the wheel

        const wallMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(500,500,10,10),
            new THREE.MeshBasicMaterial({map:texture}));
        wallMesh.matrixAutoUpdate = false;


        return wallMesh;   // the constructor must return the entire group
    }
}