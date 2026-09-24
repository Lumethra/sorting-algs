# Sorting Algs

## What is this?? 

This is a small little fun project, where I take some sorting algorithms and visualize them in 3d using ThreeJS. This idea came from [@Leon](https://github.com/Leonhoch5), thank you very much. He was also the reason, why I made the whole thing in ThreeJS, he wanted me to have some fun with it (because its annoying). I am still trying to convince him to learn ABAP, but that aside. This entire project was coded by myself and could contain some edge cases, that I didnt thought of. Feel free to open issues and report them to me. 

### Features: 

    - pillars of different heights
    - start/pause sorting button
    - shuffling button
    - moving animation and pillars highlighting
    - finishing animation
    - slider to adjust the number of pillars
    - 3 different sorting algorithms
        - bubble sort
        - selection sort
        - insertion sort
    - hidden controls to adjust shuffling and sorting speed
    - made out of NextJS and ThreeJS
    - ability to add other sorting algorithms 

## How to deploy

1. **Install NodeJS** <br />
    Make sure you have [Node.js](https://nodejs.org/) installed. 

2. **Clone the repo** <br />
    Run this command to clone the repo in any folder: 
    ``` bash
    git clone https://github.com/Lumethra/sorting-algs.git
    cd sorting-algs
    ```

3. **Install the dependencies** <br />
    You need to run the command to install the libraries
    ``` bash
    npm install
    ```

4. **Start the Dev-Server** <br />
    The website needs to be running first to be able to be visited: 
    ``` bash 
    npm run dev
    ```

5. **Visit the site** <br />
    visit [http://localhost:3000](http://localhost:3000)

## How to make an own version of it 

1. **Understand how a sorting function works** <br />
    - There are 3 parts
        - declaring numberChache
        - the sorting logic
            - setLastNum (numbers before swapping)
            - setChosenNum (number/pillar being moved --> is going to be colored)
            - setSwappedNum (2 numbers/pillars being swapped --> also being colored)
            - swapping numbers in the array
            - setNumbers (setting array with the cache so the pillars can "see" the change and react)
            - await delay(sortingSpeed) (delay until next step, so not instant sort)
        - finishing part
            - delay 
            - setLastNum as sorted array
            - clearing swappedNum/chosenNum
            - finishing animation

2. **Make own version of a sorting function** <br />
    uhh keep in mind to declare numberCache and copy the finishing part

3. **Adding Function** <br />
    - Add the function into the array of function in line 45
    - Add own selection button
        - copy one of the 3 button in lines 316 - 333
        - change the value of setSortingFunction to the place of your function in the function array (line 45) (should be 3 if its the first function YOU added)
    - And you should see a working version now

    - Tip: there are sliders to adjust the speed of shuffling and sorting, its easier to troubleshoot with them

4. **Contributing** 
    Feel free to add your sorting algorithms via pull request

## Final words

This project was mostly about having fun with ThreeJS and NextJS, learning the basic sorting algorithms and practicing coding without any help from any AI. 

Have a nice day and have fun with this project :) ❤️