import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export const WovenCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const PARTICLE_COUNT = 35000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocitiesArr = new Float32Array(PARTICLE_COUNT * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 32);
    const posAttr = torusKnot.attributes.position;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const vi = i % posAttr.count;
      const x = posAttr.getX(vi);
      const y = posAttr.getY(vi);
      const z = posAttr.getZ(vi);

      positions[i * 3] = x; positions[i * 3 + 1] = y; positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x; originalPositions[i * 3 + 1] = y; originalPositions[i * 3 + 2] = z;

      // Gold/yellow color palette
      const color = new THREE.Color();
      const hue = 0.1 + Math.random() * 0.08;
      color.setHSL(hue, 0.95, 0.55 + Math.random() * 0.3);
      colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.018,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const tempCurrent = new THREE.Vector3();
    const tempOriginal = new THREE.Vector3();
    const tempVelocity = new THREE.Vector3();
    const tempDir = new THREE.Vector3();
    const mouseWorld = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseWorld.set(mouse.x * 3, mouse.y * 3, 0);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        tempCurrent.set(positions[ix], positions[iy], positions[iz]);
        tempOriginal.set(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
        tempVelocity.set(velocitiesArr[ix], velocitiesArr[iy], velocitiesArr[iz]);

        const dist = tempCurrent.distanceTo(mouseWorld);
        if (dist < 1.5) {
          const force = (1.5 - dist) * 0.01;
          tempDir.subVectors(tempCurrent, mouseWorld).normalize().multiplyScalar(force);
          tempVelocity.add(tempDir);
        }

        tempDir.subVectors(tempOriginal, tempCurrent).multiplyScalar(0.001);
        tempVelocity.add(tempDir);
        tempVelocity.multiplyScalar(0.95);

        positions[ix] += tempVelocity.x; positions[iy] += tempVelocity.y; positions[iz] += tempVelocity.z;
        velocitiesArr[ix] = tempVelocity.x; velocitiesArr[iy] = tempVelocity.y; velocitiesArr[iz] = tempVelocity.z;
      }

      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = elapsedTime * 0.05;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};
