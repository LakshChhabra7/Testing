import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShelterConfig, ViewerMode } from '../../types';
import { calculateSolarAngles } from '../../physics/solarGeometry';
import { Layers, Sun, Wind, Flame, Eye, Maximize2, RotateCcw } from 'lucide-react';

interface Shelter3DCanvasProps {
  config: ShelterConfig;
  currentHour?: number;
  latitude?: number;
  mode?: ViewerMode;
  onModeChange?: (mode: ViewerMode) => void;
  indoorTemp?: number;
  ambientTemp?: number;
  interactive?: boolean;
}

export const Shelter3DCanvas: React.FC<Shelter3DCanvasProps> = ({
  config,
  currentHour = 13,
  latitude = 34.15,
  mode = 'physical',
  onModeChange,
  indoorTemp = 18.5,
  ambientTemp = -7.2,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<ViewerMode>(mode);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [cameraView, setCameraView] = useState<'iso' | 'south' | 'top' | 'cross'>('iso');

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  const handleModeSelect = (newMode: ViewerMode) => {
    setActiveMode(newMode);
    onModeChange?.(newMode);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 420;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Sky & Cloud Background Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/BG.jpg', (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    }, undefined, () => {
      scene.background = new THREE.Color(activeMode === 'thermal' ? 0x091428 : 0x070b17);
    });

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(12, 9, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Coordinate Grid & Ground (Light Blue Cyan Grid)
    const gridHelper = new THREE.GridHelper(24, 24, 0x38bdf8, 0x0c4a6e);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(
      activeMode === 'thermal' ? 0x0f2942 : 0xfff8ee,
      activeMode === 'thermal' ? 0.8 : 0.9
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    const d = 12;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    // Sun Sphere Indicator
    const sunAngles = calculateSolarAngles(latitude, currentHour);
    const sunDist = 18;
    const sunAltRad = (sunAngles.altitudeDeg * Math.PI) / 180;
    const sunAzRad = ((sunAngles.azimuthDeg - 90) * Math.PI) / 180; // align with 3D space

    const sunX = sunDist * Math.cos(sunAltRad) * Math.sin(sunAzRad);
    const sunY = Math.max(0.5, sunDist * Math.sin(sunAltRad));
    const sunZ = sunDist * Math.cos(sunAltRad) * Math.cos(sunAzRad);

    sunLight.position.set(sunX, sunY, sunZ);

    const sunGeo = new THREE.SphereGeometry(0.8, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({
      color: activeMode === 'thermal' ? 0xd76f30 : 0xfac858,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(sunX, sunY, sunZ);
    scene.add(sunMesh);

    // Sun path celestial ring
    const ringGeo = new THREE.RingGeometry(17.8, 18.2, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Shelter Group
    const shelterGroup = new THREE.Group();
    scene.add(shelterGroup);

    // Rotate shelter according to orientationDeg
    shelterGroup.rotation.y = (config.orientationDeg * Math.PI) / 180;

    const L = Math.max(3, config.lengthM);
    const W = Math.max(3, config.widthM);
    const H = Math.max(2.4, config.heightM);

    // Explosion offsets if mode === 'exploded'
    const expRoofY = activeMode === 'exploded' ? 2.5 : 0;
    const expWallOffset = activeMode === 'exploded' ? 1.4 : 0;

    // Materials generator based on active mode
    const getShaderMaterial = (type: 'wall' | 'roof' | 'glass' | 'floor' | 'mass') => {
      if (activeMode === 'thermal') {
        // False color thermal gradient
        if (type === 'glass') {
          return new THREE.MeshStandardMaterial({
            color: 0xd76f30,
            emissive: 0xd76f30,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.85,
          });
        }
        if (type === 'roof') {
          return new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            emissive: 0x0284c7,
            emissiveIntensity: 0.4,
            roughness: 0.3,
          });
        }
        if (type === 'mass') {
          return new THREE.MeshStandardMaterial({
            color: 0xe99a68,
            emissive: 0xd76f30,
            emissiveIntensity: 0.5,
          });
        }
        return new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          emissive: 0x075985,
          emissiveIntensity: 0.2,
          roughness: 0.5,
        });
      }

      if (activeMode === 'solar') {
        if (type === 'glass') {
          return new THREE.MeshStandardMaterial({
            color: 0xfbd060,
            roughness: 0.1,
            transparent: true,
            opacity: 0.9,
          });
        }
        if (type === 'roof') {
          return new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            roughness: 0.4,
          });
        }
        return new THREE.MeshStandardMaterial({
          color: 0xf5f2ea,
          roughness: 0.7,
        });
      }

      // Physical Architectural View
      if (type === 'glass') {
        return new THREE.MeshPhysicalMaterial({
          color: 0x90caf9,
          transmission: 0.8,
          opacity: 0.4,
          transparent: true,
          roughness: 0.1,
          ior: 1.5,
        });
      }
      if (type === 'roof') {
        return new THREE.MeshStandardMaterial({
          color: 0x38bdf8, // Vibrant Light Blue Roof
          roughness: 0.35,
          metalness: 0.15,
        });
      }
      if (type === 'floor') {
        return new THREE.MeshStandardMaterial({
          color: 0x8d6e63,
          roughness: 0.8,
        });
      }
      if (type === 'mass') {
        return new THREE.MeshStandardMaterial({
          color: 0xbcaaa4,
          roughness: 0.9,
        });
      }
      // Walls
      return new THREE.MeshStandardMaterial({
        color: 0xd7ccc8,
        roughness: 0.75,
      });
    };

    // 1. Concrete Foundation / Floor Slab
    const floorGeo = new THREE.BoxGeometry(L + 0.6, 0.3, W + 0.6);
    const floorMesh = new THREE.Mesh(floorGeo, getShaderMaterial('floor'));
    floorMesh.position.set(0, 0.15, 0);
    floorMesh.receiveShadow = true;
    shelterGroup.add(floorMesh);

    // 2. Interior Thermal Storage Mass (Trombe Wall / Core Mass)
    if (config.hasThermalStorageWall) {
      const massGeo = new THREE.BoxGeometry(L * 0.7, H * 0.85, 0.4);
      const massMesh = new THREE.Mesh(massGeo, getShaderMaterial('mass'));
      massMesh.position.set(0, H * 0.85 * 0.5 + 0.3, W * 0.25);
      massMesh.castShadow = true;
      shelterGroup.add(massMesh);
    }

    // 3. Walls
    const wallThick = 0.25;

    // South Wall (Z = +W/2) with Solar Glazing
    const sWinW = L * (config.wwrSouth || 0.4);
    const sWallGroup = new THREE.Group();
    sWallGroup.position.set(0, 0, W / 2 + expWallOffset);

    // South solid parts & window
    const sLeftGeo = new THREE.BoxGeometry((L - sWinW) / 2, H, wallThick);
    const sLeftMesh = new THREE.Mesh(sLeftGeo, getShaderMaterial('wall'));
    sLeftMesh.position.set(-(L + sWinW) / 4, H / 2 + 0.3, 0);
    sLeftMesh.castShadow = true;
    sWallGroup.add(sLeftMesh);

    const sRightGeo = new THREE.BoxGeometry((L - sWinW) / 2, H, wallThick);
    const sRightMesh = new THREE.Mesh(sRightGeo, getShaderMaterial('wall'));
    sRightMesh.position.set((L + sWinW) / 4, H / 2 + 0.3, 0);
    sRightMesh.castShadow = true;
    sWallGroup.add(sRightMesh);

    const sWinGeo = new THREE.BoxGeometry(sWinW, H * 0.75, 0.08);
    const sWinMesh = new THREE.Mesh(sWinGeo, getShaderMaterial('glass'));
    sWinMesh.position.set(0, H * 0.75 * 0.5 + 0.3 + (H * 0.2) / 2, 0);
    sWallGroup.add(sWinMesh);

    // Overhang Shading on South Facade
    if (config.roofOverhangM > 0 || config.shadingType !== 'none') {
      const shadeDepth = config.roofOverhangM || 0.6;
      const shadeGeo = new THREE.BoxGeometry(sWinW + 0.6, 0.1, shadeDepth);
      const shadeMesh = new THREE.Mesh(shadeGeo, getShaderMaterial('roof'));
      shadeMesh.position.set(0, H + 0.3, shadeDepth / 2);
      shadeMesh.castShadow = true;
      sWallGroup.add(shadeMesh);
    }
    shelterGroup.add(sWallGroup);

    // North Wall (Z = -W/2)
    const nWallGroup = new THREE.Group();
    nWallGroup.position.set(0, 0, -W / 2 - expWallOffset);
    const nWallGeo = new THREE.BoxGeometry(L, H, wallThick);
    const nWallMesh = new THREE.Mesh(nWallGeo, getShaderMaterial('wall'));
    nWallMesh.position.set(0, H / 2 + 0.3, 0);
    nWallMesh.castShadow = true;
    nWallGroup.add(nWallMesh);
    shelterGroup.add(nWallGroup);

    // East Wall (X = +L/2)
    const eWallGroup = new THREE.Group();
    eWallGroup.position.set(L / 2 + expWallOffset, 0, 0);
    const eWallGeo = new THREE.BoxGeometry(wallThick, H, W);
    const eWallMesh = new THREE.Mesh(eWallGeo, getShaderMaterial('wall'));
    eWallMesh.position.set(0, H / 2 + 0.3, 0);
    eWallMesh.castShadow = true;
    eWallGroup.add(eWallMesh);
    shelterGroup.add(eWallGroup);

    // West Wall (X = -L/2)
    const wWallGroup = new THREE.Group();
    wWallGroup.position.set(-L / 2 - expWallOffset, 0, 0);
    const wWallGeo = new THREE.BoxGeometry(wallThick, H, W);
    const wWallMesh = new THREE.Mesh(wWallGeo, getShaderMaterial('wall'));
    wWallMesh.position.set(0, H / 2 + 0.3, 0);
    wWallMesh.castShadow = true;
    wWallGroup.add(wWallMesh);
    shelterGroup.add(wWallGroup);

    // 4. Roof
    const roofGroup = new THREE.Group();
    roofGroup.position.set(0, H + 0.3 + expRoofY, 0);

    const roofOverhang = Math.max(0.3, config.roofOverhangM);
    const roofGeo = new THREE.BoxGeometry(L + roofOverhang * 2, 0.25, W + roofOverhang * 2);
    const roofMesh = new THREE.Mesh(roofGeo, getShaderMaterial('roof'));
    roofMesh.position.set(0, 0.125, 0);
    roofMesh.castShadow = true;
    roofGroup.add(roofMesh);
    shelterGroup.add(roofGroup);

    // 5. Airflow Particles (Streamlines in airflow mode)
    let particleSystem: THREE.Points | null = null;
    if (activeMode === 'airflow') {
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * (L * 0.8);
        posArray[i + 1] = Math.random() * (H * 0.9) + 0.4;
        posArray[i + 2] = (Math.random() - 0.5) * (W * 0.8);
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x6bb77b,
        size: 0.18,
        transparent: true,
        opacity: 0.8,
      });
      particleSystem = new THREE.Points(particleGeo, particleMat);
      shelterGroup.add(particleSystem);
    }

    // Solar Rays in Solar mode
    if (activeMode === 'solar' && sunAngles.altitudeDeg > 5) {
      const rayGeo = new THREE.CylinderGeometry(0.04, 0.04, 12, 8);
      const rayMat = new THREE.MeshBasicMaterial({
        color: 0xffd54f,
        transparent: true,
        opacity: 0.4,
      });
      for (let r = -2; r <= 2; r++) {
        const ray = new THREE.Mesh(rayGeo, rayMat);
        ray.position.set(r * (L / 5), H * 0.8, W / 2);
        ray.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(sunX, sunY, sunZ).normalize()
        );
        shelterGroup.add(ray);
      }
    }

    // Camera viewpoints
    if (cameraView === 'south') {
      camera.position.set(0, H * 0.7, 16);
      camera.lookAt(0, H / 2, 0);
    } else if (cameraView === 'top') {
      camera.position.set(0, 20, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (cameraView === 'cross') {
      camera.position.set(16, H * 0.8, 0);
      camera.lookAt(0, H / 2, 0);
    } else {
      camera.position.set(12, 9, 14);
      camera.lookAt(0, H / 2, 0);
    }

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Subtle slow orbit if user is idling
      if (interactive) {
        shelterGroup.rotation.y += delta * 0.05;
      }

      // Airflow particle animation
      if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += delta * 0.8; // rise up (stack effect)
          if (positions[i] > H + 0.2) {
            positions[i] = 0.4;
          }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [config, currentHour, latitude, activeMode, cameraView, interactive]);

  return (
    <div 
      className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden bg-cover bg-center border border-sky-500/30 shadow-2xl flex flex-col"
      style={{ backgroundImage: "url('/BG.jpg')" }}
    >
      {/* Top 3D Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#070B14]/90 backdrop-blur-md rounded-lg border border-sky-400/30 pointer-events-auto shadow-lg">
          <button
            onClick={() => handleModeSelect('physical')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'physical'
                ? 'bg-sky-500/20 text-[#38BDF8] border border-sky-400/50 shadow-sm'
                : 'text-[#F5F2EA]/70 hover:text-[#F5F2EA] hover:bg-white/5'
            }`}
            title="Standard architectural geometry"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Physical</span>
          </button>

          <button
            onClick={() => handleModeSelect('thermal')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'thermal'
                ? 'bg-[#D76F30] text-white border border-[#D76F30] shadow-sm'
                : 'text-[#F5F2EA]/70 hover:text-[#F5F2EA] hover:bg-white/5'
            }`}
            title="False-color thermal infrared gradients"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Thermal IR</span>
          </button>

          <button
            onClick={() => handleModeSelect('solar')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'solar'
                ? 'bg-sky-400 text-slate-950 font-semibold shadow-sm'
                : 'text-[#F5F2EA]/70 hover:text-[#F5F2EA] hover:bg-white/5'
            }`}
            title="Solar beam trajectory and incident vectors"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Solar Rays</span>
          </button>

          <button
            onClick={() => handleModeSelect('airflow')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'airflow'
                ? 'bg-sky-900 text-[#38BDF8] border border-sky-400/40 shadow-sm'
                : 'text-[#F5F2EA]/70 hover:text-[#F5F2EA] hover:bg-white/5'
            }`}
            title="Stack effect and induced cross-ventilation"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Airflow</span>
          </button>

          <button
            onClick={() => handleModeSelect('exploded')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              activeMode === 'exploded'
                ? 'bg-[#E99A68] text-[#10140F] font-semibold shadow-sm'
                : 'text-[#F5F2EA]/70 hover:text-[#F5F2EA] hover:bg-white/5'
            }`}
            title="Exploded layer disassembly"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Exploded</span>
          </button>
        </div>

        {/* View Camera Angles */}
        <div className="flex items-center gap-1 p-1 bg-[#070B14]/90 backdrop-blur-md rounded-lg border border-sky-400/30 pointer-events-auto text-xs">
          <button
            onClick={() => setCameraView('iso')}
            className={`px-2 py-1 rounded transition-colors ${cameraView === 'iso' ? 'bg-sky-900 text-[#38BDF8]' : 'text-gray-300 hover:text-white'}`}
          >
            ISO
          </button>
          <button
            onClick={() => setCameraView('south')}
            className={`px-2 py-1 rounded transition-colors ${cameraView === 'south' ? 'bg-sky-900 text-[#38BDF8]' : 'text-gray-300 hover:text-white'}`}
          >
            South
          </button>
          <button
            onClick={() => setCameraView('top')}
            className={`px-2 py-1 rounded transition-colors ${cameraView === 'top' ? 'bg-sky-900 text-[#38BDF8]' : 'text-gray-300 hover:text-white'}`}
          >
            Plan
          </button>
          <button
            onClick={() => setCameraView('cross')}
            className={`px-2 py-1 rounded transition-colors ${cameraView === 'cross' ? 'bg-sky-900 text-[#38BDF8]' : 'text-gray-300 hover:text-white'}`}
          >
            Section
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Mount Target */}
      <div ref={containerRef} className="w-full flex-1 min-h-[380px] cursor-grab active:cursor-grabbing" />

      {/* Floating Technical Telemetry Overlay at Bottom */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-3 p-2.5 bg-[#070B14]/90 backdrop-blur-md rounded-lg border border-sky-400/30 text-[11px] text-[#F5F2EA]/90 pointer-events-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
            <span className="font-mono text-[#38BDF8] font-semibold">DIGITAL TWIN ONLINE</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-gray-400">
            <span>DIM:</span>
            <span className="text-white font-medium">{config.lengthM}m × {config.widthM}m × {config.heightM}m</span>
          </div>
          <div className="hidden md:flex items-center gap-1 font-mono text-gray-400">
            <span>ORI:</span>
            <span className="text-[#D76F30] font-medium">{config.orientationDeg}° (S-Bias)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-sky-400/30">
            <span className="text-[#38BDF8]">T_in:</span>
            <span className="text-white font-bold">{indoorTemp.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-sky-400/30">
            <span className="text-gray-400">T_amb:</span>
            <span className="text-[#E99A68]">{ambientTemp.toFixed(1)}°C</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded border border-sky-400/30">
            <span className="text-[#D76F30]">Sun:</span>
            <span className="text-white">{String(currentHour).padStart(2, '0')}:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
