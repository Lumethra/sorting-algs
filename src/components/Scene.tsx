'use client'
// https://threejsresources.com/frameworks/three-js-nextjs
// https://r3f.docs.pmnd.rs/getting-started/introduction

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
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
    const [numbers, setNumbers] = useState<number[]>([2, 6, 3, 4, 5, 1, 7])
    const [lastNum, setLastNum] = useState<number[]>([2, 6, 3, 4, 5, 1, 7])
    const [swappedNum, setSwappedNum] = useState<number[]>([]) //https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
    const [chosenNum, setChosenNum] = useState<number>();
    const [finishNum, setFinishNum] = useState<number>();
    const [sorting, setSorting] = useState<boolean>(false);
    const [shuffling, setShuffling] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showNumCtrl, setShowNumCTRL] = useState<boolean>(false);
    const [sortingSpeed, setSortingSpeed] = useState<number>(800);
    const [shufflingSpeed, setShufflingSpeed] = useState<number>(600);
    const [sortingFunction, setSortingFunction] = useState<number>(2);

    const valueSlider = useRef<HTMLInputElement>(null)
    const numberControls = useRef<HTMLInputElement>(null)
    const isSortingRef = useRef(false); // somehow need a ref or else not working, maybe because of async? 

    const sort = () => {
        if (shuffling) return
        if (sorting) {
            setSorting(false);
            isSortingRef.current = false;
        } else {

            const functions = [bubbleSort, selectionSort, insertionSort];
            // bubbleSort();
            // selectionSort();
            // insertionSort();
            functions[sortingFunction]();
            setSorting(true);
            isSortingRef.current = true;
        }
    }

    const shuffle = async () => {
        if (shuffling) return
        if (sorting) return
        // setNumbers(numbers.map(() => Math.floor((Math.random() * 7 + 1) * 10) / 10));

        // console.log(Math.floor(Math.random() * 7 + 1));

        let numbersCache = [...numbers];
        let randomPos = Math.floor(Math.random() * 7);
        let lastRPos = randomPos;

        setShuffling(true);
        for (let i = 1; i <= 2; i++) {
            for (let i = 0; i < numbersCache.length; i++) {
                setLastNum([...numbersCache]);
                while (randomPos == lastRPos || randomPos == i) {
                    randomPos = Math.floor(Math.random() * numbersCache.length);
                }
                // console.log(randomPos)
                // console.log(lastRPos)
                lastRPos = randomPos;
                setSwappedNum([numbersCache[i], numbersCache[randomPos]]);
                [numbersCache[i], numbersCache[randomPos]] = [numbersCache[randomPos], numbersCache[i]];
                setNumbers([...numbersCache]);
                await delay(shufflingSpeed);
                if (numbersCache.length == 2) break;
            }
            if (numbersCache.length > 10) break;
            if (numbersCache.length == 2) break;
        }
        await delay(400);
        setSwappedNum([]);
        setLastNum([...numbersCache]);
        setShuffling(false);
    }

    const add = () => {
        let numbersCache = [...numbers];

        numbersCache.sort(function (a, b) {                     // https://stackoverflow.com/questions/1063007/how-can-i-sort-an-array-of-integers
            return a - b;
        });

        numbersCache[numbersCache.length] = numbersCache.length + 1;
        setNumbers([...numbersCache]);
        setLastNum([...numbersCache]);
    }

    const remove = () => {
        let numbersCache = [...numbers];
        if (numbersCache.length <= 2) return;

        numbersCache.sort(function (a, b) {                     // https://stackoverflow.com/questions/1063007/how-can-i-sort-an-array-of-integers
            return a - b;
        });

        numbersCache.splice(numbersCache.length - 1, 1);        // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
        setNumbers([...numbersCache]);
        setLastNum([...numbersCache]);
    }

    const updateValue = (sliderValue: number) => {
        if (!sliderValue) return
        let numbersCache = [...numbers];

        numbersCache.sort(function (a, b) {
            return a - b;
        });

        if (numbers.length < sliderValue) {
            // console.log(sliderValue);
            for (let i = sliderValue; i > numbers.length; i--) {
                numbersCache.push(numbersCache.length + 1);
            }
        } else if (numbers.length > sliderValue) {
            // console.log(sliderValue)
            for (let i = sliderValue; i < numbers.length; i++) {
                numbersCache.splice(numbersCache.length - 1, 1);
            }
        }

        setNumbers([...numbersCache]);
        setLastNum([...numbersCache]);

        // if (numbers.length < Number(valueSlider.current?.value)) {
        //     for (let i = Number(valueSlider.current?.value); i > numbers.length; i--) {
        //         add();
        //     }
        // } else {
        //     for (let i = Number(valueSlider.current?.value); i < numbers.length; i++) {
        //         remove();
        //     }
        // }
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
                    await delay(sortingSpeed);
                }
            }
            if (!swapped) break;
        }
        await delay(400);
        setLastNum([...numbersCache]);
        setChosenNum(-1);
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
                await delay(sortingSpeed);
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
                    await delay(sortingSpeed);
                } else {
                    break;
                }
            }
        }
        await delay(400);
        setLastNum([...numbersCache]);
        setChosenNum(-1);
        finishedSort(); // inspired by https://sortvisualizer.com/insertionsort/
    }

    async function finishedSort() {
        let numbersCache = [...numbers];

        for (let i = 0; i <= numbersCache.length - 1; i++) {
            setFinishNum(i);
            await delay(100);
        }
        setFinishNum(-1);
        setSorting(false);
        isSortingRef.current = false;
    }

    // function updateCam() {                          // https://discourse.threejs.org/t/using-r3f-to-update-camera-rotation-lookat-value/67734
    //     const { camera } = useThree();

    //     useEffect(() => {
    //         if (!camera) return

    //         camera.position.z = numbers.length * 2

    //         camera.updateProjectionMatrix()
    //     }, [numbers.length, camera])
    // }

    function Box({ position, lastPos, scale, isSwapping, isChosen, isFinish, isShuffling }: IBoxProps) {
        const mesh = useRef<any>(null)

        useFrame((state, delta) => {
            if (!mesh.current) return

            const distance = position - mesh.current.position.x

            mesh.current.position.x += distance * delta * (isShuffling ? (14 - (shufflingSpeed / 100)) : (14 - (sortingSpeed / 100)))

            // https://r3f.docs.pmnd.rs/api/hooks#selector
            if (numbers.length > 7) {
                state.camera.position.z += (numbers.length * 1.5 - state.camera.position.z /* oh god was that painful */) * delta * (3 /*slower?*/) // like above?
                state.camera.position.y += ((numbers.length - (numbers.length * (1 / 6))) - state.camera.position.y) * delta * 3
            } else {
                // console.log("weee")
                // state.camera.position.z == 15;
                // state.camera.position.y == 5;

                // this one works if I change the value too suddenly (slider) 
                state.camera.position.z += (11 - state.camera.position.z) * delta * (3)
                state.camera.position.y += ((7 - (numbers.length * (1 / 6))) - state.camera.position.y) * delta * 3
            }
            // state.camera.lookAt(0, 0, 0);
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
            <div style={{ position: "absolute", width: "calc(100vw - 70px)", height: "69.25px", top: 30, right: 35, zIndex: 10, display: "flex", gap: "10px", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                    {/* <select style={{ padding: "10px" }} onChange={(e) => { setSortingFunction(Number(e.target.value)) }}>
                        <option value={0}>Bubble Sort</option>
                        <option value={1}>Selection Sort</option>
                        <option value={2}>Insertion Sort</option>
                    </select> */}
                    <button onClick={() => { setShowMenu(!showMenu) }} className="material-symbols-outlined" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", cursor: "pointer" }}>
                        sort
                    </button>
                    <div style={{ display: showMenu ? "flex" : "none", justifyContent: "center", alignItems: "center", padding: "10px", height: "60px", borderRadius: "7px", backgroundColor: "#272727", transition: "0.2s" }} >
                        <button title="Bubble Sort" onClick={() => { setSortingFunction(0) }} disabled={shuffling || sorting} className="material-symbols-outlined sortingMethod" style={{ display: showMenu ? "flex" : "none", justifyContent: "center", alignItems: "center", padding: "10px", height: "60px", borderRadius: "7px", backgroundColor: "#272727", transition: "0.2s" }} >
                            <div className="tooltip">
                                bubble_chart
                                <span className="tooltiptext">Bubble Sort</span>
                            </div>
                        </button>
                        <button onClick={() => { setSortingFunction(1) }} disabled={shuffling || sorting} className="material-symbols-outlined sortingMethod" style={{ display: showMenu ? "flex" : "none", justifyContent: "center", alignItems: "center", padding: "10px", height: "60px", borderRadius: "7px", backgroundColor: "#272727", transition: "0.2s" }} >
                            <div className="tooltip">
                                select
                                <span className="tooltiptext">Selection Sort</span>
                            </div>
                        </button>
                        <button onClick={() => { setSortingFunction(2) }} disabled={shuffling || sorting} className="material-symbols-outlined sortingMethod" style={{ display: showMenu ? "flex" : "none", justifyContent: "center", alignItems: "center", padding: "10px", height: "60px", borderRadius: "7px", backgroundColor: "#272727", transition: "0.2s" }} >
                            <div className="tooltip">
                                text_select_move_back_character
                                <span className="tooltiptext">Insertion Sort</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                    <button onClick={sort} className="material-symbols-outlined" disabled={shuffling} style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", cursor: "pointer" }}>
                        <div className="tooltip">
                            {sorting ? "pause" : shuffling ? "play_disabled" : "play_arrow"}
                            <span className="tooltiptext">Sort</span>
                        </div>
                    </button>
                    <button onClick={shuffle} className="material-symbols-outlined" disabled={sorting} style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", cursor: "pointer" }}>
                        <div className="tooltip">
                            {sorting ? "block" : "shuffle"}
                            <span className="tooltiptext">Shuffle</span>
                        </div>
                    </button>
                    <input id="slider" type="range" min="2" max="100" defaultValue="7" onChange={(e) => updateValue(Number(e.target.value))} ref={valueSlider} />
                </div>
            </div >
            <div style={{ position: "absolute", width: "calc(100vw - 40px)", bottom: 25, right: 20, zIndex: 10, display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                {/* <button onClick={add} style={{ padding: "10px", cursor: "pointer", display: showNumCtrl ? "block" : "none" }}>Add Number</button> */}
                {/* <button onClick={remove} style={{ padding: "10px", cursor: "pointer", display: showNumCtrl ? "block" : "none" }}>Remove Number</button> */}
                <span>
                    <label htmlFor="slider" style={{ display: showNumCtrl ? "block" : "none", paddingBottom: "15px" }}>Sorting Speed</label>
                    <input id="slider" type="range" min="100" max="1000" defaultValue="800" style={{ display: showNumCtrl ? "block" : "none" }} onChange={(e) => setSortingSpeed(Number(e.target.value))} ref={valueSlider} />
                </span>
                <span>
                    <label htmlFor="slider" style={{ display: showNumCtrl ? "block" : "none", paddingBottom: "15px" }}>Shuffling Speed</label>
                    <input id="slider" type="range" min="100" max="1000" defaultValue="600" style={{ display: showNumCtrl ? "block" : "none" }} onChange={(e) => setShufflingSpeed(Number(e.target.value))} ref={valueSlider} />
                </span>
            </div>
            <input type="checkbox" style={{ position: "absolute", bottom: 5, right: 5, zIndex: 10, width: "50px", height: "50px", WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }} ref={numberControls} onChange={(e) => setShowNumCTRL(e.target.checked)} />

            <Canvas
                fallback={<div>Hehe, ur browser is trash</div>}
                camera={{ fov: 50, near: 2, far: 1000, position: [0, 5, numbers.length * 1.5] }}
                shadows={true}
            >
                <ambientLight intensity={0.5} />

                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <group position={[-(numbers.length / 2), -(numbers.length / 2), 0]}> {/*ahhhhhhhhhhhhh hardcoded value of 0.235*/}
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
        </div >
    )
}
