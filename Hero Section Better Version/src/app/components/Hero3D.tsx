import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import silhouetteImg from "../../imports/DSC02769_2.png";
import universeBg from "../../imports/image-12.png";

const FRAME_URLS = [
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1490604001847-b712b0c2f967?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=70",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=700&q=70",
];

export function Hero3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#030308", 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor("#030308");
    mount.appendChild(renderer.domElement);

    // Universe Background (Reference Image)
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    const bgTex = loader.load(universeBg, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
    });
    const bgMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 50),
      new THREE.MeshBasicMaterial({ 
        map: bgTex, 
        transparent: true, 
        opacity: 0.5, 
        depthWrite: false, 
        blending: THREE.AdditiveBlending 
      })
    );
    bgMesh.position.z = -25;
    scene.add(bgMesh);

    // Bust group
    const bust = new THREE.Group();
    scene.add(bust);

    // Heart light inside silhouette
    const heartLightPos = new THREE.Vector3(0, 0.2, 0.4);

    // Generate dreamy 3D particle silhouette
    const img = new Image();
    img.src = silhouetteImg;
    img.crossOrigin = "anonymous";
    img.onload = () => {
        const w = 120;
        const h = Math.floor(w * (img.height / img.width));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        
        const bgR = data[0], bgG = data[1], bgB = data[2], bgA = data[3];
        const isBgTransparent = bgA < 10;
        
        const validPixels = [];
        for (let py = 0; py < h; py++) {
            for (let px = 0; px < w; px++) {
                const i = (py * w + px) * 4;
                let isSolid = false;
                if (isBgTransparent) {
                    isSolid = data[i+3] > 50;
                } else {
                    const dist = Math.abs(data[i] - bgR) + Math.abs(data[i+1] - bgG) + Math.abs(data[i+2] - bgB);
                    isSolid = dist > 50;
                }
                if (isSolid) {
                    validPixels.push({ px, py });
                }
            }
        }
        
        const particlesPerPixel = 15;
        const totalParticles = validPixels.length * particlesPerPixel;
        
        const positions = new Float32Array(totalParticles * 3);
        const colors = new Float32Array(totalParticles * 3);
        const sizes = new Float32Array(totalParticles);
        const phases = new Float32Array(totalParticles);
        const randomAxes = new Float32Array(totalParticles * 3);
        
        const palette = [
            new THREE.Color("#ffb86b"),
            new THREE.Color("#fe4638"),
            new THREE.Color("#7ea8ff"),
            new THREE.Color("#ffd6a5"),
            new THREE.Color("#c89bff"),
        ];
        
        const scaleY = 3.2; 
        const scaleX = scaleY * (w / h);
        
        let idx = 0;
        for (const { px, py } of validPixels) {
            const nx = (px / w) - 0.5;
            const ny = (py / h) - 0.5;
            
            const depthProfile = Math.cos(nx * Math.PI);
            const maxZ = depthProfile * 0.6; 
            
            for (let p = 0; p < particlesPerPixel; p++) {
                const x = nx * scaleX;
                const y = -ny * scaleY;
                const z = (Math.random() - 0.5) * maxZ * 2.0;
                
                positions[idx*3] = x + (Math.random()-0.5)*0.03;
                positions[idx*3+1] = y + (Math.random()-0.5)*0.03;
                positions[idx*3+2] = z;
                
                const c = palette[Math.floor(Math.random() * palette.length)];
                colors[idx*3] = c.r;
                colors[idx*3+1] = c.g;
                colors[idx*3+2] = c.b;
                
                sizes[idx] = 0.015 + Math.random() * 0.035;
                phases[idx] = Math.random() * Math.PI * 2;
                
                randomAxes[idx*3] = Math.random() - 0.5;
                randomAxes[idx*3+1] = Math.random() - 0.5;
                randomAxes[idx*3+2] = Math.random() - 0.5;
                
                idx++;
            }
        }
        
        const pGeom = new THREE.BufferGeometry();
        pGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        pGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        pGeom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        pGeom.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
        pGeom.setAttribute("randomAxis", new THREE.BufferAttribute(randomAxes, 3));
        
        const pMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uLightPos: { value: heartLightPos }
            },
            vertexShader: `
                uniform float uTime;
                uniform vec3 uLightPos;
                attribute vec3 color;
                attribute float size;
                attribute float phase;
                attribute vec3 randomAxis;
                varying vec3 vColor;
                
                void main() {
                    vec3 pos = position;
                    
                    // Dreamy movement
                    pos.x += sin(uTime * 0.8 + phase) * 0.06 * randomAxis.x;
                    pos.y += cos(uTime * 0.6 + phase) * 0.06 * randomAxis.y;
                    pos.z += sin(uTime * 0.7 + phase) * 0.06 * randomAxis.z;
                    
                    // Light interaction
                    float d = distance(pos, uLightPos);
                    float lightFactor = max(0.0, 1.0 - d / 1.0);
                    vec3 glow = vec3(1.0, 0.8, 0.4) * lightFactor * 2.0;
                    
                    vColor = color + glow;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    vec2 xy = gl_PointCoord.xy - vec2(0.5);
                    float ll = length(xy);
                    if (ll > 0.5) discard;
                    
                    float alpha = pow(1.0 - (ll * 2.0), 1.5);
                    gl_FragColor = vec4(vColor, alpha * 0.9);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        
        const particles = new THREE.Points(pGeom, pMat);
        particles.position.y = 0.6; // adjust to center nicely
        bust.add(particles);
        bust.userData.pMat = pMat;
    };

    // 20 Floating frames
    const frames: { mesh: THREE.Mesh; base: { p: [number, number, number]; r: [number, number, number]; s: number; seed: number } }[] = [];
    const planeGeom = new THREE.PlaneGeometry(1.05, 0.74);
    
    for (let i = 0; i < 20; i++) {
        // Golden angle distribution for sphere-like even placement
        const phi = Math.acos(1 - 2 * (i + 0.5) / 20); // 0 to PI
        const theta = Math.PI * (1 + Math.sqrt(5)) * i; // Golden ratio
        
        const r = 2.8 + Math.random() * 1.5; 
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) + 0.5;
        const z = r * Math.cos(phi) - 0.5; 
        
        const s = 0.35 + Math.random() * 0.8;
        
        const rotX = (Math.random() - 0.5) * 0.6;
        const rotY = (Math.random() - 0.5) * 1.0;
        const rotZ = (Math.random() - 0.5) * 0.4;
        
        const base = { p: [x, y, z] as [number, number, number], r: [rotX, rotY, rotZ] as [number, number, number], s, seed: Math.random() * 10 };
        
        const url = FRAME_URLS[i % FRAME_URLS.length];
        const tex = loader.load(url, (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.needsUpdate = true;
        });
        tex.colorSpace = THREE.SRGBColorSpace;
        const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, toneMapped: false });
        const mesh = new THREE.Mesh(planeGeom, mat);
        mesh.position.set(...base.p);
        mesh.rotation.set(...base.r);
        mesh.scale.setScalar(base.s);
        scene.add(mesh);
        frames.push({ mesh, base });
    }

    // Postprocessing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.6, 0.85, 0.15);
    composer.addPass(bloom);

    const vignetteShader = {
      uniforms: { tDiffuse: { value: null }, offset: { value: 0.15 }, darkness: { value: 0.9 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float offset;
        uniform float darkness;
        varying vec2 vUv;
        void main(){
          vec4 texel = texture2D(tDiffuse, vUv);
          vec2 uv = (vUv - 0.5) * vec2(offset);
          float v = 1.0 - dot(uv, uv) * darkness * 4.0;
          gl_FragColor = vec4(texel.rgb * v, texel.a);
        }
      `,
    };
    composer.addPass(new ShaderPass(vignetteShader));
    composer.addPass(new OutputPass());

    // Mouse
    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    // Resize
    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // Animate
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const t = (performance.now() - start) / 1000;

      bust.rotation.y += (mouse.x * 0.4 - bust.rotation.y) * 0.05;
      bust.rotation.x += (-mouse.y * 0.2 - bust.rotation.x) * 0.05;
      bust.position.y = Math.sin(t * 0.6) * 0.04;

      if (bust.userData.pMat) {
          bust.userData.pMat.uniforms.uTime.value = t;
          // Animate heart light position
          const hPulse = 0.4 + Math.sin(t * 2.0) * 0.1;
          bust.userData.pMat.uniforms.uLightPos.value.set(
              Math.sin(t * 1.5) * 0.1,
              0.2 + Math.cos(t * 1.2) * 0.1,
              hPulse
          );
      }

      // Animate frames
      for (const f of frames) {
        const tt = t + f.base.seed;
        f.mesh.position.x = f.base.p[0] + mouse.x * 0.2 * (f.base.p[2] < 0 ? 1 : 0.5);
        f.mesh.position.y = f.base.p[1] + Math.sin(tt * 0.5) * 0.08 + mouse.y * 0.1;
        f.mesh.rotation.z = f.base.r[2] + Math.sin(tt * 0.4) * 0.04;
      }

      composer.render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      
      planeGeom.dispose();
      
      frames.forEach((f) => {
        const m = f.mesh.material as THREE.MeshBasicMaterial;
        m.map?.dispose();
        m.dispose();
      });
      
      if (bust.userData.pMat) bust.userData.pMat.dispose();
      
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}
