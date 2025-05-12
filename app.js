import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// use es module import
import { LCCRender } from './sdk/lcc-0.4.0.js'


const _rfiMarkers = [
  { id:'Issue #20', position:{x: 0.3, y: 6.85, z: 1.7},  title:'Paint-job problem' },
  { id:'Issue #21', position:{x: 1.0, y: 3.9, z: 1.5},  title:'Replace Painting' }
];

const codeMap = { KeyW:'w', KeyA:'a', KeyS:'s', KeyD:'d', KeyQ:'q', KeyE:'e' };

const keys = { w:false, a:false, s:false, d:false, q:false, e:false };
const SPEED = 1;                      // units / second
let prev = performance.now();

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(0.5);

renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 20);
camera.up.set(0, 0, 1);
camera.position.set(0, -1, 1); // Set init camera position


const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set( 0, -0.5, 1 );
controls.enableDamping = true;
controls.update(); 

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth,innerHeight);
labelRenderer.domElement.style.cssText = 'position:absolute;top:0;pointer-events:none';
document.body.appendChild(labelRenderer.domElement);

// Fetch rfiMarkers from /issues endpoint and add markers
fetch('/issues')
  .then(response => response.json())
  .then(rfiMarkers => {
    addMarkers(rfiMarkers);
  })
  .catch(err => {
    console.error('Failed to load issues:', err);
  });

window.addEventListener('keydown', e => { if(e.code in codeMap) keys[codeMap[e.code]] = true; });
window.addEventListener('keyup',   e => { if(e.code in codeMap) keys[codeMap[e.code]] = false; });
window.addEventListener('resize',  onResize);

function addMarkers(rfiMarkers){
  _rfiMarkers.forEach(m=>{
    const div = document.createElement('div');
    div.className='marker';
    div.innerHTML=`<div class="marker-icon"></div><div class="marker-tooltip">${m.id}: ${m.title}</div>`;
    const label = new CSS2DObject(div);
    label.position.set(m.position.x,m.position.y,m.position.z);
    scene.add(label);
  });
}


// Loading lcc object
const lccObj = LCCRender.load({
    camera: camera,
    scene: scene,
    dataPath: 'http://localhost:3000/AutodeskSydneyOffice/Australia0402_Fey.lcc', // Lcc data path
    renderLib: THREE,
    canvas: renderer.domElement,
    renderer: renderer
}, (mesh) => {
    // 'mesh' is type of THREE.Mesh
    console.log('Lcc object Loaded:  ', mesh);
}, (percent) => {
    console.log('Lcc object loading: ' + percent * 100 + '%' );
});

window.obj = lccObj




function onResize(){
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
    labelRenderer.setSize(innerWidth,innerHeight);
  }

function animate(){
    requestAnimationFrame(animate);
    const now = performance.now();
    const dt  = (now - prev)/1000;
    prev = now;
  
    const move = new THREE.Vector3();
    const fwd  = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    fwd.z = 0;
    fwd.normalize();
    const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
  
    if(keys.w) move.add   (fwd);
    if(keys.s) move.sub   (fwd);
    if(keys.d) move.add   (right);
    if(keys.a) move.sub   (right);
    if(keys.q) move.z += 1;  // Move up
    if(keys.e) move.z -= 1;  // Move down

    
    if(move.lengthSq()){
      move.normalize().multiplyScalar(SPEED * dt);
      camera.position.add(move);
      controls.target.add(move);        // move pivot the same amount
    }
  
    controls.update();
    LCCRender.update();
    renderer.render(scene,camera);
    labelRenderer.render(scene,camera);
  }

  animate();
