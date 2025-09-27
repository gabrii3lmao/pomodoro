;(function(){

    //variáveis
    const timerDisplay = document.getElementById("display");
    let timer = null;
    const workTimeEdit = document.getElementById("workTimeEdit");
    const restTimeEdit = document.getElementById("restTimeEdit");
    let isRunning = false;
    let workTime = 25 * 60 * 1000; // 25 minutos de trabalho
    let restTime = 6 * 60 * 1000;   // 6 minutos de descanso
    let currentMode = 'work';
    let remainingTime = workTime;
    let endTime = 0;
    const startBtn = document.getElementById("start");
    const resetBtn = document.getElementById("reset");
    const pauseBtn = document.getElementById("pause");
    const rodadasDisplay = document.getElementById("rodadas");
    let roundCounts = 0;
    const modalEditar = document.getElementById("modalEditar");
    const fecharModal = document.getElementById("fecharModal");
    const situacao = document.getElementById("situacaoId");
    // Função para salvar os tempos automaticamente


    function salvarTempos() {
        // Converte minutos para milissegundos e salva nas variáveis
        workTime = workTimeEdit.value * 60 * 1000;
        restTime = restTimeEdit.value * 60 * 1000;
        // Se estiver no modo correspondente, aplica o novo tempo
        if (currentMode === 'work') {
            remainingTime = workTime;
        } else if (currentMode === 'rest') {
            remainingTime = restTime;
        }
        
        // Atualiza o display
        timerDisplay.textContent = formatTime(remainingTime);
    }

   

    //funções
    function start(){
        if(!isRunning){
            endTime = Date.now() + remainingTime;
            timer = setInterval(updateDisplay, 10);
            isRunning = true;
            if(currentMode === 'work'){
                situacao.textContent = "Hora de Estudar! Foco!";
            } else {
                situacao.textContent = "Hora do descanso... Relaxe!";
            }
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
        start(); // Reinicia o timer com novo tempo
    }

    function startWorkTimer() {
        stop();
        currentMode = 'work';
        remainingTime = workTime;
        endTime = Date.now() + workTime;
        document.title = "Temporizador - Trabalho";
        start(); // Reinicia o timer com novo tempo
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
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function updateDisplay(){
        remainingTime = endTime - Date.now();
        
        if(remainingTime <= 0){
            if(currentMode === 'work') {
                startRestTimer();
                stop();
            } else {
                roundCounts++
                updateRodadasDisplay();
                startWorkTimer();
                stop();
                document.title = "Ciclo completo - Trabalho";
            }
        }

        timerDisplay.textContent = formatTime(remainingTime);
        document.title = `${currentMode === 'work' ? 'Trabalho' : 'Descanso'} - ${timerDisplay.textContent}`;
    }

    // Função para fechar modal e salvar
    function fecharESalvar() {
        salvarTempos(); // Salva antes de fechar
        modalEditar.style.display = "none";
    }

    // Inicializa
    reset();
    
    // Eventos
    startBtn.addEventListener("click", start);
    resetBtn.addEventListener("click", reset);
    pauseBtn.addEventListener("click", stop);
    
    // Modal events
    timerDisplay.addEventListener("click", function(e){
        e.preventDefault();
        modalEditar.style.display = "flex";
    });
    
    fecharModal.addEventListener("click", fecharESalvar);
    
    modalEditar.addEventListener("click", function(e) {
        if (e.target === modalEditar) {
            fecharESalvar();
        }
    });

    // Salvar com Enter nos inputs
    workTimeEdit.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') fecharESalvar();
    });
    
    restTimeEdit.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') fecharESalvar();
    });

     // Event listeners para salvar automaticamente
    workTimeEdit.addEventListener('input', salvarTempos);
    restTimeEdit.addEventListener('input', salvarTempos);
    
    // Salvar também quando perder o foco (backup)
    workTimeEdit.addEventListener('change', salvarTempos);
    restTimeEdit.addEventListener('change', salvarTempos);
})();
