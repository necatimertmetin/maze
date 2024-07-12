import React, { useState, useEffect } from 'react';
import './room.css';
import playerIdle from './idle.png';
import playerMove1 from './right.png';
import playerMove2 from './left.png';

const Room = ({ leftDoor, rightDoor, topDoor, bottomDoor, handleDoorClick, movement, lastDirection, isFinish }) => {
    const [playerDirection, setPlayerDirection] = useState(lastDirection ? lastDirection : '');
    const [position, setPosition] = useState(movement === "toTop" ? { top: -90, left: 0 } : movement === "toBottom" ? { top: 90, left: 0 } : movement === "toLeft" ? { top: 0, left: -90 } : movement === "toRight" ? { top: 0, left: 90 } : { top: 0, left: 0 });
    const [side, setSide] = useState();
    const [playerImage, setPlayerImage] = useState(playerIdle);

    const movePlayer = (way) => {
        const currentTop = isNaN(position.top) ? 0 : position.top;
        const currentLeft = isNaN(position.left) ? 0 : position.left;

        switch (way) {
            case 'top':
                setPosition({
                    top: currentTop + 90,
                    left: currentLeft
                });
                break;
            case 'left':
                setPosition({
                    top: currentTop,
                    left: currentLeft + 90
                });
                break;
            case 'right':
                setPosition({
                    top: currentTop,
                    left: currentLeft - 90
                });
                break;
            case 'bottom':
                setPosition({
                    top: currentTop - 90,
                    left: currentLeft
                });
                break;
            default:
                break;
        }
        setTimeout(() => {
            setPlayerImage(playerMove1);
        }, 0);

        setTimeout(() => {
            setPlayerImage(playerIdle);
        }, 150);

        setTimeout(() => {
            setPlayerImage(playerMove2);
        }, 300);

        setTimeout(() => {
            setPlayerImage(playerIdle);
        }, 450);

    };

    useEffect(() => {
        setTimeout(() => {
            switch (movement) {
                case 'toTop':
                    movePlayer('top');
                    break;
                case 'toBottom':
                    movePlayer('bottom');
                    break;
                case 'toLeft':
                    movePlayer('left');
                    break;
                case 'toRight':
                    movePlayer('right');
                    break;
                default:
                    setPosition({ top: 0, left: 0 });
                    break;
    
            }
        }, 5);
        

    }, [movement]); 




    const onDoorClick = (way) => {
        setSide(way);
        handleDoorClick(way, playerDirection);
        movePlayer(way);
    }
    const handleMouseEnter = (direction) => {
        setPlayerDirection(`rotate-${direction}`);
    };
    



    return (
        <div className='room'>
            <div className='room-top room-part'>
                <div
                    className={`door-way door-way-top ${topDoor ? '' : "visibility-hidden"}`}
                    onClick={() => onDoorClick("top")}
                    onMouseEnter={() => handleMouseEnter("top")}
                    
                >
                    <div className='door-gate door-gate-top-left'></div>
                    <div className='door-gate door-gate-top-right'></div>
                </div>
            </div>
            <div className='room-middle room-part'>
                <div
                    className={`door-way door-way-left  ${leftDoor ? '' : "visibility-hidden"}`}
                    onClick={() => onDoorClick("left")}
                    onMouseEnter={() => handleMouseEnter("left")}
                    
                >
                    <div className='door-gate door-gate-left-top'></div>
                    <div className='door-gate door-gate-left-bottom'></div>
                </div>
                <div id='cell' className={isFinish ? 'finish-cell' : 'room-cell'}>
                    <div className={`player ${playerDirection}`}
                        style={{
                            position: 'absolute',
                            top: `calc(25% - ${position.top}px)`,
                            left: `calc(25% - ${position.left}px)`
                        }}
                    >
                        <img src={playerImage} alt="Player" />
                    </div>
                </div>
                <div
                    className={`door-way door-way-right  ${rightDoor ? '' : "visibility-hidden"}`}
                    onClick={() => onDoorClick("right")}
                    onMouseEnter={() => handleMouseEnter("right")}
                    
                >
                    <div className='door-gate door-gate-right-top'></div>
                    <div className='door-gate door-gate-right-bottom'></div>
                </div>
            </div>
            <div className='room-bottom room-part'>
                <div
                    className={`door-way door-way-bottom  ${bottomDoor ? '' : "visibility-hidden"}`}
                    onClick={() => onDoorClick("bottom")}
                    onMouseEnter={() => handleMouseEnter("bottom")}
                    
                >
                    <div className='door-gate door-gate-bottom-left'></div>
                    <div className='door-gate door-gate-bottom-right'></div>
                </div>
            </div>
        </div>
    );
}

export default Room;
