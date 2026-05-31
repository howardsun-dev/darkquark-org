import * as THREE from 'https://unpkg.com/three@0.165.0/build/three.module.js';

const container = document.getElementById('scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x060912);

const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 100);
camera.position.set(0, 1.2, 5.5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0x8ba4ff, 0.7);
scene.add(ambient);

const key = new THREE.PointLight(0x6d86ff, 24, 30);
key.position.set(3, 3, 4);
scene.add(key);

const fill = new THREE.PointLight(0xff6da8, 14, 24);
fill.position.set(-3, -1, -2);
scene.add(fill);

const core = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 48, 48),
  new THREE.MeshStandardMaterial({
    color: 0x7ea2ff,
    emissive: 0x304ea8,
    emissiveIntensity: 1.25,
    metalness: 0.1,
    roughness: 0.35,
  })
);
scene.add(core);

const orbitGroup = new THREE.Group();
scene.add(orbitGroup);

const quarkColors = [0xff5f74, 0x5dd2ff, 0xffcf57];
const quarks = quarkColors.map((color, i) => {
  const q = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 32, 32),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.15,
    })
  );

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.45 + i * 0.08, 0.01, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0x2f3f75, transparent: true, opacity: 0.7 })
  );

  ring.rotation.x = Math.PI / 2;
  ring.rotation.y = i * 1.05;
  orbitGroup.add(ring);
  orbitGroup.add(q);
  return { mesh: q, phase: i * ((Math.PI * 2) / 3), radius: 1.45 + i * 0.08, speed: 0.8 + i * 0.16 };
});

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();

  core.rotation.y = t * 0.35;
  orbitGroup.rotation.y = t * 0.16;
  orbitGroup.rotation.x = Math.sin(t * 0.2) * 0.2;

  quarks.forEach((q, idx) => {
    const a = q.phase + t * q.speed;
    q.mesh.position.set(
      Math.cos(a) * q.radius,
      Math.sin(a * (idx === 1 ? 1.4 : 1.1)) * 0.35,
      Math.sin(a) * q.radius
    );
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
