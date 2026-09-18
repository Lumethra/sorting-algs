'use client'
// https://threejsresources.com/frameworks/three-js-nextjs
// https://r3f.docs.pmnd.rs/getting-started/introduction

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

interface IBoxProps {
    position: number;
    lastPos: any;
    scale: number;
    isSwapping: boolean;
    isChosen: boolean;
    isFinish: boolean;
    isShuffling: boolean;
}

export default function Scene() {
    const [numbers, setNumbers] = useState([2, 6, 3, 4, 5, 1, 7])
    const [lastNum, setLastNum] = useState([2, 6, 3, 4, 5, 1, 7])
    const [swappedNum, setSwappedNum] = useState<number[]>([]) //https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
    const [chosenNum, setChosenNum] = useState<number>();
    const [finishNum, setFinishNum] = useState<number>();
    const [shuffling, setShuffling] = useState<boolean>(false);

    const sort = () => {
        // bubbleSort();
        // selectionSort();
        insertionSort();
    }

    const shuffle = async () => {
        // setNumbers(numbers.map(() => Math.floor((Math.random() * 7 + 1) * 10) / 10));

        // console.log(Math.floor(Math.random() * 7 + 1));

        let numbersCache = [...numbers];
        let randomPos = Math.floor(Math.random() * 7);
        let lastRPos = randomPos;

        setShuffling(true);
        for (let i = 0; i < numbersCache.length; i++) {
            setLastNum([...numbersCache]);
            while (randomPos == lastRPos) {
                randomPos = Math.floor(Math.random() * 7);
            }
            lastRPos = randomPos;
            setSwappedNum([numbersCache[i], numbersCache[randomPos]]);
            [numbersCache[i], numbersCache[randomPos]] = [numbersCache[randomPos], numbersCache[i]];
            setNumbers([...numbersCache]);
            await delay(600);
        }
        await delay(400);
        setSwappedNum([]);
        setLastNum([...numbersCache]);
        setShuffling(false);
    }

    // useEffect(() => {
    //     console.log("Numbers updated to:", numbers);
    //     console.log("last Numbers updated to:", lastNum);
    // }, [numbers]);

    const delay = (time: any) => new Promise<void>((resolve) => setTimeout(resolve, time))

    async function bubbleSort() {
        let swapped = false;
        let numbersCache = [...numbers];

        for (let i = 0; i < numbersCache.length - 1; i++) {
            swapped = false;
            for (let j = 0; j < numbersCache.length - i - 1; j++) {
                if (numbersCache[j] > numbersCache[j + 1]) {
                    setLastNum([...numbersCache]);
                    setChosenNum(j + 1);
                    [numbersCache[j], numbersCache[j + 1]] = [numbersCache[j + 1], numbersCache[j]];
                    setNumbers([...numbersCache]);
                    swapped = true;
                    await delay(800);
                }
            }
            if (!swapped) break;
        }
        await delay(400);
        setLastNum([...numbersCache]);
        setChosenNum(numbersCache.length);
        finishedSort();
    }

    async function selectionSort() {
        let numbersCache = [...numbers];

        for (let i = 0; i < numbersCache.length - 1; i++) {
            let smallestNumIndex = i;

            for (let j = i + 1; j <= numbersCache.length - 1; j++) {
                if (numbersCache[j] < numbersCache[smallestNumIndex]) {
                    smallestNumIndex = j;
                }
            }

            if (smallestNumIndex !== i) {
                setLastNum([...numbersCache]);
                setSwappedNum([numbersCache[i], numbersCache[smallestNumIndex]]);
                [numbersCache[i], numbersCache[smallestNumIndex]] = [numbersCache[smallestNumIndex], numbersCache[i]];
                setNumbers([...numbersCache]);
                await delay(800);
            }
        }
        await delay(400);
        setLastNum([...numbersCache]);
        setSwappedNum([]);
        finishedSort();
    }

    async function insertionSort() {
        let numbersCache = [...numbers];

        for (let i = 0; i <= numbersCache.length - 1; i++) {
            for (let j = i; j > 0; j--) {
                if (numbersCache[j] < numbersCache[j - 1]) {
                    setLastNum([...numbersCache]);
                    setChosenNum(j - 1);
                    [numbersCache[j], numbersCache[j - 1]] = [numbersCache[j - 1], numbersCache[j]];
                    setNumbers([...numbersCache]);
                    await delay(800);
                } else {
                    break;
                }
            }
        }
        await delay(500);
        setLastNum([...numbersCache]);
        setChosenNum(numbersCache.length);
        finishedSort(); // inspired by https://sortvisualizer.com/insertionsort/
    }

    async function finishedSort() {
        let numbersCache = [...numbers];

        for (let i = 0; i <= numbersCache.length - 1; i++) {
            setFinishNum(i);
            await delay(200);
        }
        setFinishNum(numbersCache.length);
    }

    function Box({ position, lastPos, scale, isSwapping, isChosen, isFinish, isShuffling }: IBoxProps) {
        const mesh = useRef<any>(null)

        useFrame((_, delta) => {
            if (!mesh.current) return

            const distance = position - mesh.current.position.x

            mesh.current.position.x += distance * delta * 5
        })
        return (
            <group>
                <mesh
                    ref={mesh}
                    position={[lastPos, scale / 2, 0]}
                    scale={[1, scale, isChosen || isSwapping ? 1.001 : 1]}
                >
                    <boxGeometry />
                    <meshStandardMaterial color={isFinish ? "#6cd4af" : isChosen || isSwapping ? isShuffling ? "#cb8b82" : "#97e5e8" : "white"} />
                </mesh>
            </group>
        )
    }

    return (
        <div style={{ width: "100vw", height: "100vh", background: "black" }}>
            <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10, display: "flex", gap: "10px" }}>
                <button onClick={sort} style={{ padding: "10px", cursor: "pointer" }}>Sort</button>
                <button onClick={shuffle} style={{ padding: "10px", cursor: "pointer" }}>Shuffle</button>
            </div>

            <Canvas
                fallback={<div>Hehe, ur browser is trash</div>}
                camera={{ fov: 50, near: 2, far: 1000, position: [0, 5, 15] }}
                shadows={true}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <group position={[-(numbers.length / 2 - 0.235), -(numbers.length / 2), 0]}> {/*ahhhhhhhhhhhhh hardcoded value of 0.235*/}
                    {numbers.map((value, index) => {
                        const isSwappedNum = swappedNum.includes(value);
                        const isfinishNum = finishNum == index;
                        const isChosenNum = chosenNum == index;
                        return (
                            <Box key={index} position={(index * 1.1)} lastPos={(lastNum.findIndex(element => element === value)) * 1.1} scale={value} isSwapping={isSwappedNum} isChosen={isChosenNum} isFinish={isfinishNum} isShuffling={shuffling} />
                        )
                    })}
                </group>
            </Canvas>
        </div>
    )
}
