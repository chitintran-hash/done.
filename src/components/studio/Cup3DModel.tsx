'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CupModelDef, CupColorOption } from './types';

interface Cup3DModelProps {
  modelDef: CupModelDef;
  selectedColor: CupColorOption;
  lidColor: string;
  canvasTexture: THREE.CanvasTexture | null;
  showSafeZone?: boolean;
}

export function Cup3DModel({
  modelDef,
  selectedColor,
  lidColor,
  canvasTexture,
  showSafeZone = false,
}: Cup3DModelProps) {
  // 1. Physically accurate Lathe Profile Geometries
  const latheGeometry = useMemo(() => {
    const points: THREE.Vector2[] = [];

    if (modelDef.id === 'glass_tall') {
      // Highball Tall Glass: Thon cao, đáy kính đúc nguyên khối dày đặc
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(0.92, 0));
      points.push(new THREE.Vector2(1.06, 0.12));
      points.push(new THREE.Vector2(1.10, 0.65)); // Đáy kính đặc dày 0.65 unit
      points.push(new THREE.Vector2(1.18, 2.2));
      points.push(new THREE.Vector2(1.27, 4.15));
      points.push(new THREE.Vector2(1.24, 4.20)); // Viền miệng bo tròn
      points.push(new THREE.Vector2(1.18, 4.15));
      points.push(new THREE.Vector2(1.10, 2.2));
      points.push(new THREE.Vector2(0.98, 0.70));
      points.push(new THREE.Vector2(0, 0.65)); // Lòng đáy trong
    } else if (modelDef.id === 'glass_rocks') {
      // Rocks / Whiskey Glass: Thấp rộng, đáy pha lê đặc cực dày
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(1.30, 0));
      points.push(new THREE.Vector2(1.48, 0.16));
      points.push(new THREE.Vector2(1.50, 0.72)); // Đáy đặc dày 0.72 unit
      points.push(new THREE.Vector2(1.56, 1.70));
      points.push(new THREE.Vector2(1.62, 2.55));
      points.push(new THREE.Vector2(1.59, 2.60)); // Viền bo tròn
      points.push(new THREE.Vector2(1.52, 2.55));
      points.push(new THREE.Vector2(1.44, 1.70));
      points.push(new THREE.Vector2(1.36, 0.80));
      points.push(new THREE.Vector2(0, 0.72));
    } else if (modelDef.id === 'glass_can') {
      // Can Glass: Dáng vỏ lon bia/soda hiện đại, thắt cổ tinh tế
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(1.15, 0));
      points.push(new THREE.Vector2(1.28, 0.15));
      points.push(new THREE.Vector2(1.36, 0.50));
      points.push(new THREE.Vector2(1.36, 2.90)); // Thân lon thẳng
      points.push(new THREE.Vector2(1.22, 3.25)); // Thắt cổ
      points.push(new THREE.Vector2(1.10, 3.42)); // Gờ miệng
      points.push(new THREE.Vector2(1.14, 3.58));
      points.push(new THREE.Vector2(1.10, 3.60)); // Mép trên
      points.push(new THREE.Vector2(1.04, 3.58));
      points.push(new THREE.Vector2(1.02, 3.42));
      points.push(new THREE.Vector2(1.14, 3.25));
      points.push(new THREE.Vector2(1.27, 2.90));
      points.push(new THREE.Vector2(1.27, 0.50));
      points.push(new THREE.Vector2(1.18, 0.40));
      points.push(new THREE.Vector2(0, 0.35));
    } else if (modelDef.id === 'glass_mug') {
      // Glass Mug: Thân trụ quai cầm
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(1.20, 0));
      points.push(new THREE.Vector2(1.35, 0.15));
      points.push(new THREE.Vector2(1.36, 0.45));
      points.push(new THREE.Vector2(1.36, 3.15));
      points.push(new THREE.Vector2(1.33, 3.20));
      points.push(new THREE.Vector2(1.26, 3.15));
      points.push(new THREE.Vector2(1.26, 0.50));
      points.push(new THREE.Vector2(1.15, 0.42));
      points.push(new THREE.Vector2(0, 0.40));
    } else {
      // Reusable Boba / Plastic Cup: Thân thon
      points.push(new THREE.Vector2(0, 0));
      points.push(new THREE.Vector2(1.08, 0));
      points.push(new THREE.Vector2(1.18, 0.12));
      points.push(new THREE.Vector2(1.20, 0.30));
      points.push(new THREE.Vector2(1.54, 3.90));
      points.push(new THREE.Vector2(1.58, 3.95));
      points.push(new THREE.Vector2(1.56, 4.00));
      points.push(new THREE.Vector2(1.50, 3.95));
      points.push(new THREE.Vector2(1.16, 0.30));
      points.push(new THREE.Vector2(0, 0.15));
    }

    const geom = new THREE.LatheGeometry(points, 64);
    geom.computeVertexNormals();
    return geom;
  }, [modelDef.id]);

  // 2. Glass Mug Handle Geometry
  const mugHandleGeometry = useMemo(() => {
    if (modelDef.id !== 'glass_mug') return null;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.34, 0.85, 0),
      new THREE.Vector3(1.80, 0.80, 0),
      new THREE.Vector3(2.18, 1.30, 0),
      new THREE.Vector3(2.25, 1.95, 0),
      new THREE.Vector3(2.12, 2.55, 0),
      new THREE.Vector3(1.75, 2.75, 0),
      new THREE.Vector3(1.34, 2.70, 0)
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.17, 16, false);
  }, [modelDef.id]);

  // 3. Realistic MeshPhysicalMaterial for Glass / Plastic
  const cupMaterial = useMemo(() => {
    const isPlastic = modelDef.category === 'plastic';

    if (isPlastic) {
      return new THREE.MeshPhysicalMaterial({
        color: selectedColor.color || '#ffffff',
        transmission: 0.85,
        opacity: 0.95,
        transparent: true,
        roughness: 0.15,
        metalness: 0.0,
        ior: 1.49,
        thickness: 0.22,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.2,
        side: THREE.FrontSide
      });
    }

    // Pure Optical Crystal Clear Glass (No color tinting allowed for glass)
    return new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      transmission: 0.98,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      metalness: 0.02,
      ior: 1.52,
      thickness: 0.18,
      specularIntensity: 1.0,
      specularColor: new THREE.Color('#ffffff'),
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.4,
      side: THREE.FrontSide
    });
  }, [modelDef.category, selectedColor]);

  // 4. Printable Decal Sleeve Geometry (Conforming LatheGeometry precisely offset +0.015 from outer wall)
  const sleeveGeometry = useMemo(() => {
    let points: THREE.Vector2[] = [];
    const offset = 0.015; // Strictly 0.015 units outside outer cup wall to prevent any clipping

    if (modelDef.id === 'glass_tall') {
      points = [
        new THREE.Vector2(1.10 + offset, 0.75),
        new THREE.Vector2(1.18 + offset, 2.20),
        new THREE.Vector2(1.27 + offset, 4.05)
      ];
    } else if (modelDef.id === 'glass_rocks') {
      points = [
        new THREE.Vector2(1.50 + offset, 0.75),
        new THREE.Vector2(1.56 + offset, 1.70),
        new THREE.Vector2(1.62 + offset, 2.50)
      ];
    } else if (modelDef.id === 'glass_can') {
      points = [
        new THREE.Vector2(1.36 + offset, 0.55),
        new THREE.Vector2(1.36 + offset, 2.85)
      ];
    } else if (modelDef.id === 'glass_mug') {
      points = [
        new THREE.Vector2(1.36 + offset, 0.50),
        new THREE.Vector2(1.36 + offset, 3.10)
      ];
    } else {
      // plastic_boba
      points = [
        new THREE.Vector2(1.20 + offset, 0.35),
        new THREE.Vector2(1.54 + offset, 3.85)
      ];
    }

    const geom = new THREE.LatheGeometry(points, 128, 0, Math.PI * 2);
    geom.computeVertexNormals();
    return geom;
  }, [modelDef.id]);

  // Group centering offset
  const groupY = modelDef.id === 'glass_rocks' ? -1.0 : modelDef.id === 'glass_tall' ? -1.8 : -1.5;

  return (
    <group position={[0, groupY, 0]}>
      {/* 3D Cup Body */}
      <mesh geometry={latheGeometry} material={cupMaterial} castShadow receiveShadow />

      {/* Mug Glass Handle */}
      {mugHandleGeometry && (
        <mesh geometry={mugHandleGeometry} material={cupMaterial} castShadow />
      )}

      {/* Curved 3D Decal Sleeve with Canvas Texture - Centered u=0.5 facing camera, seam at back */}
      {canvasTexture && (
        <mesh
          geometry={sleeveGeometry}
          rotation={[0, Math.PI, 0]}
        >
          <meshStandardMaterial
            map={canvasTexture}
            transparent={true}
            opacity={1}
            roughness={0.2}
            metalness={0.02}
            polygonOffset={true}
            polygonOffsetFactor={-4}
            polygonOffsetUnits={-4}
            depthWrite={false}
            side={THREE.FrontSide}
          />
        </mesh>
      )}

      {/* Boba Cup Accessories: Lid & Straw */}
      {modelDef.id === 'plastic_boba' && (
        <>
          {/* Lid Ring Base */}
          <mesh position={[0, 4.02, 0]} castShadow>
            <cylinderGeometry args={[1.62, 1.62, 0.22, 64]} />
            <meshStandardMaterial color={lidColor} roughness={0.3} />
          </mesh>
          {/* Lid Dome Top */}
          <mesh position={[0, 4.22, 0]} castShadow>
            <cylinderGeometry args={[1.45, 1.62, 0.22, 64]} />
            <meshStandardMaterial color={lidColor} roughness={0.3} />
          </mesh>
          {/* Straw (Angled with clear physical material) */}
          <mesh position={[0.08, 4.85, 0]} rotation={[0.04, 0, -0.16]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 4.2, 24]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.92}
              transparent={true}
              opacity={0.8}
              roughness={0.08}
              ior={1.49}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
