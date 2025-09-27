;(function(){

    //variáveis
    const timerDisplay = document.getElementById("display");
    let timer = null;
    let isRunning = false;
    let workTime = 25 * 60 * 1000; // 25 minutos de trabalho
    let restTime = 6 * 60 * 1000;   // 6 minutos de descanso
    let currentMode = 'work'; // 'work' ou 'rest'
    let remainingTime = workTime;
    let endTime = 0;
    const startBtn = document.getElementById("start");
    const resetBtn = document.getElementById("reset");
    const pauseBtn = document.getElementById("pause");
    const rodadasDisplay = document.getElementById("rodadas");
    let roundCounts = 0;

    //funções
    function start(){
        if(!isRunning){
            endTime = Date.now() + remainingTime;
            timer = setInterval(updateDisplay, 10);
            isRunning = true;
        }
    }

    function stop(){
        if(isRunning){
            clearInterval(timer);
            isRunning = false;
        }
    }
    
    function reset(){
        clearInterval(timer);
        currentMode = 'work';
        remainingTime = workTime;
        isRunning = false;
        timerDisplay.textContent = formatTime(workTime);
        document.title = "Temporizador - Trabalho";
    }

    function startRestTimer(){
        stop();
        currentMode = 'rest';
        remainingTime = restTime;
        endTime = Date.now() + restTime;
        document.title = "Temporizador - Descanso";
    }

    function updateRodadasDisplay() {
        if (rodadasDisplay) {
            rodadasDisplay.textContent = `#${roundCounts + 1}`;
        }
    }

    function formatTime(milliseconds) {
        let minutes = Math.floor(milliseconds / (1000 * 60));
        let seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        let ms = Math.floor((milliseconds % 1000) / 10);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(2, "0")}`;
    }

    function updateDisplay(){
        remainingTime = endTime - Date.now();
        
        // Quando o tempo acaba
        if(remainingTime <= 0){
            if(currentMode === 'work') {
                // Tempo de trabalho acabou, inicia descanso
                startRestTimer();
            } else {
                // Tempo de descanso acabou, para tudo
                roundCounts++
                updateRodadasDisplay();
                stop();
                timerDisplay.textContent = "00:00:00";
                reset();
                document.title = "Ciclo completo";
            }
        }

        timerDisplay.textContent = formatTime(remainingTime);
        document.title = `${currentMode === 'work' ? 'Trabalho' : 'Descanso'}: ${timerDisplay.textContent}`;
    }

    // Inicializa
    reset();
    
    // Eventos
    startBtn.addEventListener("click", start);
    resetBtn.addEventListener("click", reset);
    pauseBtn.addEventListener("click", stop);

})();