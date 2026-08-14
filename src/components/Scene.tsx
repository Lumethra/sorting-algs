'use client'
// https://threejsresources.com/frameworks/three-js-nextjs
// https://r3f.docs.pmnd.rs/getting-started/introduction

import { useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

function SpinnyBox() {
    const mesh = useRef<any>(null)
    const [active, setActive] = useState(false)

    useFrame((_, delta) => {
        if (mesh.current) {
            mesh.current.rotation.x += delta
        }
    })

    return (
        <mesh
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            position={[1, 2, 3]}
            rotation={[Math.PI / 2, 0, 0]}
        >
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    )
}

export default function Scene() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas
                fallback={<div>Hehe, ur browser is trash</div>}
                camera={{ fov: 50, near: 2, far: 1000, position: [5, 5, 10] }}
                shadows={true}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <SpinnyBox />
            </Canvas>
        </div>
    )
}
