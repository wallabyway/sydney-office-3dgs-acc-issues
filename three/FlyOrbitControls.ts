import { Clock, Vector3, Vector4, Camera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const tempVec4 = new Vector4(0, 0, 0, 0);
const tempVec3 = new Vector3(0, 0, 0);

export class FlyOrbitControls extends OrbitControls {
	enableKeys: boolean;
	enableFlight: boolean;
	baseSpeed: number;
	fastSpeed: number;
	forwardKey: string;
	backKey: string;
	leftKey: string;
	rightKey: string;
	upKey: string;
	downKey: string;
	fastKey: string;
	blurCallback: () => void;
	keyDownCallback: (e: any) => void;
	keyUpCallback: (e: any) => void;
	disableShiftKeyCallback: (e: any) => void;
	isTransitioning: boolean;

	constructor(camera: Camera, domElement: HTMLElement) {
		// Disable use of shift key so we can use it for acceleration
		const disableShiftKeyCallback = (e: any) => {
			if (this.enabled) {
				Object.defineProperty( e, 'shiftKey', {
					get() { return false; }
				});
			}
		};
		domElement.addEventListener('pointerdown', disableShiftKeyCallback);

		super(camera, domElement);
		this.isTransitioning = false;
		this.enableDamping = true;
		this.dampingFactor = 0.25;
		this.enableKeys = false;
		this.enableFlight = true;
		this.baseSpeed = 10;
		this.fastSpeed = 1;
		this.forwardKey = 'w';
		this.backKey = 's';
		this.leftKey = 'a';
		this.rightKey = 'd';
		this.upKey = 'q';
		this.downKey = 'e';
		this.fastKey = 'shift';

		let fastHeld = false;
		let forwardHeld = false;
		let backHeld = false;
		let leftHeld = false;
		let rightHeld = false;
		let upHeld = false;
		let downHeld = false;

		let originalDistance = 0;
		let originalMinDistance = 0;
		let originalMaxDistance = 0;
		let rafHandle = - 1;
		const originalTarget = new Vector3();
		const clock = new Clock();

		const endFlight = () => {
			if (rafHandle !== -1) {
				// cancel the animation playing
				cancelAnimationFrame(rafHandle);
				rafHandle = -1;
				// store the original distances for the controls
				this.minDistance = originalMinDistance;
				this.maxDistance = originalMaxDistance;
				const targetDistance = Math.min(originalDistance, camera.position.distanceTo(originalTarget));
				tempVec4.set(0, 0, -1, 0).applyMatrix4(camera.matrixWorld);
				tempVec3.set(tempVec4.x, tempVec4.y, tempVec4.z);
				this
					.target
					.copy(camera.position)
					.addScaledVector(tempVec3, targetDistance);
				this.dispatchEvent({ type: 'fly-end', target: this });
			}
		};

		const updateFlight = () => {
			if (!this.enabled || ! this.enableFlight) {
				return;
			}
			rafHandle = requestAnimationFrame(updateFlight);
			// get the direction
			tempVec4.set(0, 0, 0, 0);
			if (forwardHeld) tempVec4.z -= 1;
			if (backHeld) tempVec4.z += 1;
			if (leftHeld) tempVec4.x -= 1;
			if (rightHeld) tempVec4.x += 1;
			if (upHeld) tempVec4.y += 1;
			if (downHeld) tempVec4.y -= 1;
			tempVec4.applyMatrix4(camera.matrixWorld);
			tempVec3.set(tempVec4.x, tempVec4.y, tempVec4.z);

			// apply the movement
			const delta = 60 * clock.getDelta();
			const speed = fastHeld ? this.fastSpeed : this.baseSpeed;
			camera.position.addScaledVector(tempVec3, speed * delta);
			this.target.addScaledVector(tempVec3, speed * delta);
			this.dispatchEvent({ type: 'fly-change', target: this });
		};

		const keyDownCallback = (e: any) => {
			const key = e.key.toLowerCase();
			if (rafHandle === -1) {
				originalMaxDistance = this.maxDistance;
				originalMinDistance = this.minDistance;
				originalDistance = camera.position.distanceTo(this.target);
				originalTarget.copy(this.target);
			}
			switch (key) {
				case this.forwardKey:
					forwardHeld = true;
					break;
				case this.backKey:
					backHeld = true;
					break;
				case this.leftKey:
					leftHeld = true;
					break;
				case this.rightKey:
					rightHeld = true;
					break;
				case this.upKey:
					upHeld = true;
					break;
				case this.downKey:
					downHeld = true;
					break;
				case this.fastKey:
					fastHeld = true;
					break;
			}
			switch (key) {
				case this.fastKey:
				case this.forwardKey:
				case this.backKey:
				case this.leftKey:
				case this.rightKey:
				case this.upKey:
				case this.downKey:
					e.stopPropagation();
					e.preventDefault();
			}

			if (forwardHeld || backHeld || leftHeld || rightHeld || upHeld || downHeld || fastHeld) {
				this.minDistance = 0.01;
				this.maxDistance = 0.01;
				// Move the orbit target out to just in front of the camera
				tempVec4.set(0, 0, -1, 0).applyMatrix4(camera.matrixWorld);
				tempVec3.set(tempVec4.x, tempVec4.y, tempVec4.z);
				this
					.target
					.copy(camera.position)
					.addScaledVector(tempVec3, 0.01);
				if (rafHandle === -1) {
					// start the flight and reset the clock
					this.dispatchEvent({ type: 'fly-start', target: this });
					clock.getDelta();
					updateFlight();
				}
			}
		};

		const keyUpCallback = (e: any) => {
			const key = e.key.toLowerCase();
			switch (key) {
				case this.fastKey:
				case this.forwardKey:
				case this.backKey:
				case this.leftKey:
				case this.rightKey:
				case this.upKey:
				case this.downKey:
					e.stopPropagation();
					e.preventDefault();
			}
			switch (key) {
				case this.forwardKey:
					forwardHeld = false;
					break;
				case this.backKey:
					backHeld = false;
					break;
				case this.leftKey:
					leftHeld = false;
					break;
				case this.rightKey:
					rightHeld = false;
					break;
				case this.upKey:
					upHeld = false;
					break;
				case this.downKey:
					downHeld = false;
					break;
				case this.fastKey:
					fastHeld = false;
					break;
			}
			if (!(forwardHeld || backHeld || leftHeld || rightHeld || upHeld || downHeld || fastHeld)) {
				endFlight();
			}
		};

		const blurCallback = () => {
			endFlight();
		};

		this.blurCallback = blurCallback;
		this.keyDownCallback = keyDownCallback;
		this.keyUpCallback = keyUpCallback;
		this.disableShiftKeyCallback = disableShiftKeyCallback;

		this.domElement.addEventListener('blur', blurCallback);
		this.domElement.addEventListener('keydown', keyDownCallback);
		this.domElement.addEventListener('keyup', keyUpCallback);
	}

	dispose() {
		super.dispose();
		this.domElement.removeEventListener('blur', this.blurCallback);
		this.domElement.removeEventListener('keydown', this.keyDownCallback);
		this.domElement.removeEventListener('keyup', this.keyUpCallback);
		this.domElement.removeEventListener('pointerdown', this.disableShiftKeyCallback);
	}

	transitionTo(newPosition: Vector3, newTarget: Vector3, duration: number = 2000) {
		function easeInOutCubic(t: number): number {
			return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
		}

		const startPosition = this.object.position.clone();
		const endPosition = newPosition;
		const startTarget = this.target.clone();
		const endTarget = newTarget;
		const transitionStartTime = Date.now();
	
		const updateTransition = () => {
			if (!this.isTransitioning) return;

			const elapsed = Date.now() - transitionStartTime;
			let t = Math.min(elapsed / duration, 1);

			t = easeInOutCubic(t);  // Apply the ease-in-out function

			this.object.position.lerpVectors(startPosition, endPosition, t);
			this.target.lerpVectors(startTarget, endTarget, t);

			if (t < 1) {
				requestAnimationFrame(updateTransition);
			} else {
				this.isTransitioning = false;
			}
		};
	
		this.isTransitioning = true;
		updateTransition();
	}
	
}