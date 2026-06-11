import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, DepthOfField, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { AmbientFireflies } from "./AmbientFireflies";
import { SilhouetteOutline } from "./SilhouetteOutline";
import { FloatingFrames } from "./FloatingFrames";
import { MouseParallax } from "./MouseParallax";
import * as THREE from "three";

export function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 6.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 1);
      }}
    >
      <Suspense fallback={null}>
        <MouseParallax>
          <AmbientFireflies />
          <group position={[2.5, -0.35, 0]}>
            <SilhouetteOutline />
          </group>
          <FloatingFrames />
        </MouseParallax>

        <EffectComposer disableNormalPass>
          <DepthOfField 
            target={[2.5, -0.35, 0]} 
            focalLength={0.05} 
            bokehScale={5} 
            height={480} 
          />
          <Bloom
            luminanceThreshold={0.8}
            mipmapBlur
            intensity={1.2}
            radius={0.4} // Sharper glow, less hazy spread
          />
          <ChromaticAberration 
            blendFunction={BlendFunction.NORMAL} 
            offset={new THREE.Vector2(0.0015, 0.0015)} 
            radialModulation={true}
            modulationOffset={0.5}
          />
          <Vignette offset={0.3} darkness={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
