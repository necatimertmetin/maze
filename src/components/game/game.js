import React, { useEffect, useState, useRef } from "react";
import "./game.css";
import Room from "../room/room";
import mazesJson from "../../mazes.json";
import wallImg from "./wall.png";
import copy from "copy-to-clipboard";
import { useLocation } from 'react-router-dom';

const GamePage = () => {
  const [roomKey, setRoomKey] = useState(0);
  const [movement, setMovement] = useState();
  const [previousDirection, setPreviousDirection] = useState();
  const [currentMazeIndex, setCurrentMazeIndex] = useState(0);
  const [mazeCreatorVisible, setMazeCreatorVisible] = useState(false);
  const isMouseDown = useRef(false);
  const { search } = window.location;
  const urlParams = new URLSearchParams(search);
  const mazeParam = urlParams.get('maze');
  
  let mazes = [];
  
  if (mazeParam) {
    const customMazeObject = {
      name: "Custom",
      maze: JSON.parse(decodeURIComponent(mazeParam))
    };
    mazes = [customMazeObject, ...mazesJson.mazes];
  } else {
    mazes = mazesJson.mazes;
  }
  
  
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [decodedMaze, setDecodedMaze] = useState(false);
  console.log(mazes[currentMazeIndex]);
  const location = useLocation();

  const changeMaze = () => {
    setRoomKey((prevKey) => prevKey + 1);
    console.log("maze changed");
    if (currentMazeIndex < mazes.length - 1) {
      setCurrentMazeIndex(currentMazeIndex + 1); // Bir sonraki labirente geç
      setCurrentRow(0); // Başlangıç noktasını sıfırla
      setCurrentCol(0); // Başlangıç noktasını sıfırla
    } else {
      // Tüm labirentler geçildiyse burada yapılacak işlemler
      console.log("Tüm labirentler geçildi.");
      setCurrentMazeIndex(0);
    }
  };

  // Kapıya tıklama işlemi
  const handleDoorClick = (side, lastDirection) => {
    // Belirli bir süre sonra tekrar render etmek için setTimeout kullan
    setTimeout(() => {
      setPreviousDirection(lastDirection);
      switch (side) {
        case "top":
          setMovement("toTop");
          if (
            currentRow > 0 &&
            mazes[currentMazeIndex].maze[currentRow - 1][currentCol] !== "X"
          )
            setCurrentRow(currentRow - 1);
          break;
        case "bottom":
          setMovement("toBottom");
          if (
            currentRow < mazes[currentMazeIndex].maze.length - 1 &&
            mazes[currentMazeIndex].maze[currentRow + 1][currentCol] !== "X"
          )
            setCurrentRow(currentRow + 1);
          break;
        case "left":
          setMovement("toLeft");
          if (
            currentCol > 0 &&
            mazes[currentMazeIndex].maze[currentRow][currentCol - 1] !== "X"
          )
            setCurrentCol(currentCol - 1);
          break;
        case "right":
          setMovement("toRight");
          if (
            currentCol < mazes[currentMazeIndex].maze[currentRow].length - 1 &&
            mazes[currentMazeIndex].maze[currentRow][currentCol + 1] !== "X"
          )
            setCurrentCol(currentCol + 1);
          break;
        default:
          setMovement(null);
          break;
      }

      setRoomKey((prevKey) => prevKey + 1);
    }, 500); // 0.5 saniye sonra yeniden render et
  };

  useEffect(() => {
    if (mazes[currentMazeIndex].maze[currentRow][currentCol] === "F") {
      // Eğer bitiş alanına ulaşıldıysa labirenti değiştir
      setTimeout(() => {
        alert("labirenti çözdün! bir sonraki labirente geçtin");
        changeMaze();
      }, 1000);
    }
  }, [currentRow, currentCol]);

  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [matrix, setMatrix] = useState([]);

  const handleCreateMatrix = () => {
    const newMatrix = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({ backgroundImage: "" }))
    );
    setMatrix(newMatrix);
  };

  const handleMouseDown = (rowIndex, cellIndex) => {
    isMouseDown.current = true;
    changeCellBackground(rowIndex, cellIndex, true);
  };

  const handleMouseEnter = (rowIndex, cellIndex) => {
    if (isMouseDown.current) {
      changeCellBackground(rowIndex, cellIndex, true);
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
  };
  const changeCellBackground = (rowIndex, cellIndex, onMouseEnter = false) => {
    if (
      (rowIndex === 0 && cellIndex === 0) ||
      (rowIndex === height - 1 && cellIndex === width - 1)
    ) {
      return;
    }

    const newMatrix = [...matrix];
    if (
      onMouseEnter &&
      newMatrix[rowIndex][cellIndex].backgroundImage === `url(${wallImg})`
    ) {
      newMatrix[rowIndex][cellIndex].backgroundImage = "url('gray.png')";
    } else {
      newMatrix[rowIndex][cellIndex].backgroundImage = `url(${wallImg})`;
    }
    setMatrix(newMatrix);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mazeParam = params.get('maze');
  
    if (mazeParam) {
      const decodedMaze = JSON.parse(decodeURIComponent(mazeParam));
      console.log("Decoded Maze from URL:", decodedMaze);
      // Further processing if needed
    }
  }, [location.search]);

  const handleSaveMatrix = () => {
    const newMatrix = [...matrix];
    newMatrix[0][0].backgroundImage = "O";
    newMatrix[height - 1][width - 1].backgroundImage = "F";
  
    const result = newMatrix.map(row =>
      row.map(cell =>
        cell.backgroundImage === `url(${wallImg})` ? "X" : (cell.backgroundImage === "O" || cell.backgroundImage === "F" ? cell.backgroundImage : "O")
      )
    );
  
    const encodedResult = encodeURIComponent(JSON.stringify(result));
    const url = `${window.location.origin}${window.location.pathname}?maze=${encodedResult}`;
  
    // Copy to clipboard
    copy(url);
  
    // Update the browser's URL bar
    window.history.replaceState(null, '', url);
  
    // Show notification
    alert("Maze is copied to clipboard!");
  
    console.log(result);
  };
  
  return (
    <div className="gamepage">
      <div
        className="create-your-own-maze-button"
        onClick={() => {
          setMazeCreatorVisible(!mazeCreatorVisible);
        }}
      >
        Create Your Own Maze
      </div>
      {mazeCreatorVisible && (
        <div className="maze-creator-container">
          <div className="maze-creator-wrapper">
            <div className="maze-creator-input-container">
              <label className="maze-creator-label">
                Height:
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="maze-creator-input"
                  min="1"
                  max="10"
                />
              </label>

              <label className="maze-creator-label">
                Width:
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="maze-creator-input"
                  min="1"
                  max="10"
                />
              </label>

              <button
                onClick={handleCreateMatrix}
                className="maze-creator-button"
              >
                Create
              </button>
            </div>
            {matrix.length > 0 && (
              <div
                className="maze-creator-matrix-container"
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {matrix.map((row, rowIndex) => (
                  <div key={rowIndex} className="maze-creator-row">
                    {row.map((cell, cellIndex) => (
                      <div
                        key={`${rowIndex}-${cellIndex}`}
                        className={`maze-creator-cell ${
                          rowIndex === 0 && cellIndex === 0 ? "start-cell" : ""
                        } ${
                          rowIndex === height - 1 && cellIndex === width - 1
                            ? "end-cell"
                            : ""
                        }`}
                        style={{ backgroundImage: cell.backgroundImage }}
                        onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                        onMouseEnter={() =>
                          handleMouseEnter(rowIndex, cellIndex)
                        }
                      >
                        {rowIndex === 0 && cellIndex === 0 && <p>Start</p>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="maze-creator-button-container">
            <div className="maze-creator-button" onClick={() => {handleSaveMatrix()}}>
              Save
            </div>
            <div className="maze-creator-button" onClick={() => {setMazeCreatorVisible(!mazeCreatorVisible)}}>Cancel</div>
          </div>
        </div>
      )}
      <div className="maze-level-container">
        <div className="maze-level-label">Level {mazes[currentMazeIndex].name}</div>
        <div className="maze-level-label small-label visibility-hidden">
          Maze Size {currentMazeIndex + 2} x {currentMazeIndex + 2}
        </div>
      </div>
      <div className="room-container">
        <Room
          key={roomKey} // Key'i dinamik olarak değiştir
          leftDoor={
            currentCol > 0 &&
            mazes[currentMazeIndex].maze[currentRow][currentCol - 1] !== "X"
          }
          bottomDoor={
            currentRow < mazes[currentMazeIndex].maze.length - 1 &&
            mazes[currentMazeIndex].maze[currentRow + 1][currentCol] !== "X"
          }
          topDoor={
            currentRow > 0 &&
            mazes[currentMazeIndex].maze[currentRow - 1][currentCol] !== "X"
          }
          rightDoor={
            currentCol < mazes[currentMazeIndex].maze[currentRow].length - 1 &&
            mazes[currentMazeIndex].maze[currentRow][currentCol + 1] !== "X"
          }
          isFinish={
            mazes[currentMazeIndex].maze[currentRow][currentCol] === "F"
          } // Finish alanını belirtiyoruz
          handleDoorClick={handleDoorClick}
          movement={movement}
          lastDirection={previousDirection}
        />
      </div>
    </div>
  );
};

export default GamePage;
