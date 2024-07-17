import React, { useEffect, useState } from 'react';
import './game.css';
import Room from '../room/room';

// Labirent verilerini içeren JSON dosyası
import mazesJson from '../../mazes.json';

const GamePage = () => {
    const [roomKey, setRoomKey] = useState(0);
    const [movement, setMovement] = useState();
    const [previousDirection, setPreviousDirection] = useState();
    const [currentMazeIndex, setCurrentMazeIndex] = useState(0); // Başlangıçta ilk maze'i kullan

    // Labirentlerin bulunduğu JSON'dan veriyi çek
    const mazes = mazesJson.mazes;

    // Geçerli labirentin satır ve sütun bilgileri
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);


    function generateMaze(rows, cols) {
        // Labirent matrisini oluştur, tüm hücreler 'X' (duvar) ile başlasın
        let maze = new Array(rows).fill().map(() => new Array(cols).fill('X'));
    
        // Başlangıç noktası (0, 0)
        let currentRow = 0;
        let currentCol = 0;
    
        // Bitiş noktası (rows-1, cols-1)
        let finishRow = rows - 1;
        let finishCol = cols - 1;
    
        // Başlangıç noktasını 'O' olarak işaretle
        maze[currentRow][currentCol] = 'O';
    
        // Labirenti oluşturma algoritması
        while (currentRow !== finishRow || currentCol !== finishCol) {
            // Rastgele yön seçimi: 0 -> sağ, 1 -> aşağı
            let direction = Math.floor(Math.random() * 2);
    
            // Sağa hareket
            if (direction === 0 && currentCol < cols - 1) {
                currentCol++;
            }
            // Aşağı hareket
            else if (direction === 1 && currentRow < rows - 1) {
                currentRow++;
            }
    
            // Mevcut hücreyi 'O' olarak işaretle
            maze[currentRow][currentCol] = 'O';
        }
    
        // Bitiş noktasını 'F' olarak işaretle
        maze[finishRow][finishCol] = 'F';
    
        // Rastgele bazı 'X' hücrelerini 'O' olarak değiştir (çıkmaz yollar oluştur)
        const deadEndCount = Math.floor((rows * cols) / 4); // Yaklaşık %25 oranında çıkmaz yol
        for (let i = 0; i < deadEndCount; i++) {
            let randomRow, randomCol;
            do {
                randomRow = Math.floor(Math.random() * rows);
                randomCol = Math.floor(Math.random() * cols);
            } while (maze[randomRow][randomCol] === 'O' || maze[randomRow][randomCol] === 'F');
    
            maze[randomRow][randomCol] = 'O';
        }
    
        console.log(maze);
    }
    

    // Labirent değiştirme fonksiyonu
    const changeMaze = () => {
        setRoomKey(prevKey => prevKey + 1);
        console.log("maze changed")
        if (currentMazeIndex < mazes.length - 1) {

            setCurrentMazeIndex(currentMazeIndex + 1); // Bir sonraki labirente geç
            setCurrentRow(0); // Başlangıç noktasını sıfırla
            setCurrentCol(0); // Başlangıç noktasını sıfırla
        } else {
            // Tüm labirentler geçildiyse burada yapılacak işlemler
            console.log("Tüm labirentler geçildi.");
            setCurrentMazeIndex(0)
        }
    };

    // Kapıya tıklama işlemi
    const handleDoorClick = (side, lastDirection) => {
        // Belirli bir süre sonra tekrar render etmek için setTimeout kullan
        setTimeout(() => {
            setPreviousDirection(lastDirection);
            switch (side) {
                case 'top':
                    setMovement("toTop");
                    if (currentRow > 0 && mazes[currentMazeIndex].maze[currentRow - 1][currentCol] !== 'X') setCurrentRow(currentRow - 1);
                    break;
                case 'bottom':
                    setMovement("toBottom");
                    if (currentRow < mazes[currentMazeIndex].maze.length - 1 && mazes[currentMazeIndex].maze[currentRow + 1][currentCol] !== 'X') setCurrentRow(currentRow + 1);
                    break;
                case 'left':
                    setMovement("toLeft");
                    if (currentCol > 0 && mazes[currentMazeIndex].maze[currentRow][currentCol - 1] !== 'X') setCurrentCol(currentCol - 1);
                    break;
                case 'right':
                    setMovement("toRight");
                    if (currentCol < mazes[currentMazeIndex].maze[currentRow].length - 1 && mazes[currentMazeIndex].maze[currentRow][currentCol + 1] !== 'X') setCurrentCol(currentCol + 1);
                    break;
                default:
                    setMovement(null);
                    break;
            }



            setRoomKey(prevKey => prevKey + 1);
        }, 500); // 0.5 saniye sonra yeniden render et
    };

    useEffect(() => {
        if (mazes[currentMazeIndex].maze[currentRow][currentCol] === 'F') {
            // Eğer bitiş alanına ulaşıldıysa labirenti değiştir
            setTimeout(() => {
                alert("labirenti çözdün! bir sonraki labirente geçtin")
                changeMaze();
            }, 1000);
        }
    }, [currentRow, currentCol])

    return (
        <div className='gamepage'>
            <div className='maze-level-container'>
                <div className='maze-level-label'>
                Level {currentMazeIndex + 1}
                </div>
                <div className='maze-level-label small-label'>
                Maze Size {currentMazeIndex + 2} x {currentMazeIndex + 2}
                </div>
          </div>
            <div className='room-container'>
                
                <Room
                    key={roomKey} // Key'i dinamik olarak değiştir
                    leftDoor={currentCol > 0 && mazes[currentMazeIndex].maze[currentRow][currentCol - 1] !== 'X'}
                    bottomDoor={currentRow < mazes[currentMazeIndex].maze.length - 1 && mazes[currentMazeIndex].maze[currentRow + 1][currentCol] !== 'X'}
                    topDoor={currentRow > 0 && mazes[currentMazeIndex].maze[currentRow - 1][currentCol] !== 'X'}
                    rightDoor={currentCol < mazes[currentMazeIndex].maze[currentRow].length - 1 && mazes[currentMazeIndex].maze[currentRow][currentCol + 1] !== 'X'}
                    isFinish={mazes[currentMazeIndex].maze[currentRow][currentCol] === 'F'} // Finish alanını belirtiyoruz
                    handleDoorClick={handleDoorClick}
                    movement={movement}
                    lastDirection={previousDirection}
                />
            </div>
        </div>
    );
};

export default GamePage;
