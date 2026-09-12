<script>
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let { acento = '#722f37' } = $props();
  let canvas;
  let colorAcento = acento;

  $effect(() => {
    colorAcento = acento;
  });

  onMount(() => {
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    cam.position.set(0.2, 0.95, 3.7);
    cam.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x3a1a1f,
      metalness: 0.4,
      roughness: 0.34,
      clearcoat: 1,
      clearcoatRoughness: 0.14
    });
    const accentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colorAcento),
      metalness: 0.35,
      roughness: 0.4,
      emissive: new THREE.Color(colorAcento),
      emissiveIntensity: 0.35
    });

    const mouse = new THREE.Group();
    const shell = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 1.05, 10, 28), bodyMat);
    shell.scale.set(0.92, 0.48, 1.18);
    shell.rotation.x = 0.18;
    mouse.add(shell);

    const hump = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 24), bodyMat);
    hump.scale.set(1.05, 0.55, 1.15);
    hump.position.set(0, 0.18, -0.15);
    mouse.add(hump);

    const left = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.85), bodyMat);
    left.position.set(-0.28, 0.28, 0.28);
    left.rotation.z = 0.08;
    const right = left.clone();
    right.position.x = 0.28;
    right.rotation.z = -0.08;
    mouse.add(left, right);

    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 16), accentMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0, 0.34, 0.38);
    mouse.add(wheel);

    for (const [x, y] of [[-0.55, 0.12], [0.55, -0.05], [-0.2, -0.35]]) {
      const hole = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 10, 24), accentMat);
      hole.position.set(x, 0.05, y);
      hole.rotation.y = 0.4;
      mouse.add(hole);
    }

    const shard = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.38, 3),
      accentMat
    );
    shard.position.set(-1.35, 0.55, 0.2);
    shard.rotation.set(0.3, 0.4, 0.6);
    mouse.add(shard);
    const shard2 = shard.clone();
    shard2.position.set(-1.1, 0.95, -0.1);
    shard2.scale.setScalar(0.7);
    mouse.add(shard2);

    mouse.position.y = 0.15;
    scene.add(mouse);
    scene.add(new THREE.HemisphereLight(0xffe8ea, 0x3a1218, 1.05));
    const key = new THREE.DirectionalLight(0xfff2f3, 2.2);
    key.position.set(2.4, 4.2, 3.2);
    scene.add(key);
    const rim = new THREE.PointLight(colorAcento, 40, 10);
    rim.position.set(-2.2, 1.4, -0.6);
    scene.add(rim);
    const fill = new THREE.PointLight(0x722f37, 22, 10);
    fill.position.set(2.2, 0.2, 1.8);
    scene.add(fill);
    const front = new THREE.PointLight(0xffd6db, 16, 8);
    front.position.set(0, 1.6, 3.2);
    scene.add(front);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.2, 48),
      new THREE.MeshBasicMaterial({ color: 0x12080a })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.85;
    scene.add(floor);

    let mx = 0, my = 0, raf;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      my = ((e.clientY - r.top) / r.height - 0.5) * 0.3;
    };
    window.addEventListener('pointermove', onMove);

    const resize = () => {
      const w = canvas.clientWidth || canvas.parentElement.clientWidth;
      const h = canvas.clientHeight || canvas.parentElement.clientHeight;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();

    const tick = () => {
      accentMat.color.set(colorAcento);
      accentMat.emissive.set(colorAcento);
      rim.color.set(colorAcento);
      mouse.rotation.y += (mx - mouse.rotation.y) * 0.06;
      mouse.rotation.x += (my - mouse.rotation.x) * 0.06;
      mouse.position.y = 0.15 + Math.sin(performance.now() / 900) * 0.05;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      ro.disconnect();
      renderer.dispose();
    };
  });
</script>

<canvas bind:this={canvas} class="block h-full w-full"></canvas>
