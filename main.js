document.addEventListener('DOMContentLoaded', () => {
    
    // --- CẤU HÌNH CHUNG ---
    const MSSV = '231A010167';
    const TASK_STORAGE_KEY = `tasks_${MSSV}`;
    const MSSV_LAST_DIGIT = parseInt(MSSV.slice(-1), 10);
    const isOddMSSV = (MSSV_LAST_DIGIT % 2 !== 0); // True

    // -------------------------------------------------------------------
    // --- PHẦN 1: LOGIC TODO MATRIX (BAI01) ---
    // -------------------------------------------------------------------
    function initializeTodoMatrix() {
        const taskForm = document.getElementById('task-form');
        if (!taskForm) return;

        const taskLists = {
            1: document.querySelector('.task-list[data-priority="1"]'),
            2: document.querySelector('.task-list[data-priority="2"]'),
            3: document.querySelector('.task-list[data-priority="3"]'),
            4: document.querySelector('.task-list[data-priority="4"]')
        };

        function saveTask(task) {
            const currentTasks = JSON.parse(localStorage.getItem(TASK_STORAGE_KEY) || '[]');
            currentTasks.push(task);
            localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(currentTasks));
        }

        function renderTask(task, isNew) {
            const li = document.createElement('li');
            li.textContent = task.name;
            
            // --- LOGIC CHỐNG AI ---
            if (task.name.length > 10) {
                if (isOddMSSV) {
                    // MSSV lẻ (7) -> Xanh Dương (blue)
                    li.classList.add('text-color-odd');
                } else {
                    // MSSV chẵn -> Đỏ (red)
                    li.classList.add('text-color-even');
                }
            }

            const list = taskLists[task.priority];
            if (list) {
                list.appendChild(li);
            }

            if (isNew) {
                saveTask(task);
            }
        }

        function loadTasks() {
            const storedTasks = localStorage.getItem(TASK_STORAGE_KEY);
            if (storedTasks) {
                const tasks = JSON.parse(storedTasks);
                tasks.forEach(task => renderTask(task, false));
            }
        }

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const taskNameInput = document.getElementById('task-name');
            const taskPriorityInput = document.getElementById('task-priority');
            
            const newTask = {
                name: taskNameInput.value.trim(),
                priority: parseInt(taskPriorityInput.value, 10)
            };

            if (newTask.name === "") return;

            renderTask(newTask, true); 

            taskNameInput.value = '';
            taskPriorityInput.value = '1';
        });

        loadTasks(); 
    }

    // -------------------------------------------------------------------
    // --- PHẦN 2: LOGIC GAME ĐOÁN SỐ (BAI02) ---
    // -------------------------------------------------------------------
    function initializeGuessingGame() {
        const guessInput = document.getElementById('guess-input');
        const submitButton = document.getElementById('submit-guess');
        
        if (!submitButton) return;

        const minNum = 1;
        const maxNum = 100;
        let secretNumber = 0;
        let attempts = 0;

        const messageDisplay = document.getElementById('message');
        const attemptsDisplay = document.getElementById('attempts');
        const resetButton = document.getElementById('reset-game');

        function generateSecretNumber() {
            return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; 
        }

        function startGame() {
            secretNumber = generateSecretNumber();
            attempts = 0;
            messageDisplay.textContent = 'Hãy bắt đầu đoán!';
            attemptsDisplay.textContent = 'Số lần thử: 0';
            guessInput.value = '';
            guessInput.disabled = false;
            submitButton.disabled = false;
            resetButton.style.display = 'none';
            document.getElementById('confetti-container').innerHTML = '';
        }
        
        function checkGuess() {
            const guess = parseInt(guessInput.value.trim(), 10);
            
            if (isNaN(guess) || guess < minNum || guess > maxNum) {
                messageDisplay.textContent = `🚫 Lỗi: Vui lòng nhập một số hợp lệ từ ${minNum} đến ${maxNum}.`;
                return;
            }

            attempts++;
            attemptsDisplay.textContent = `Số lần thử: ${attempts}`;

            if (guess === secretNumber) {
                messageDisplay.textContent = `🎉 CHÚC MỪNG! Bạn đã đoán đúng số ${secretNumber} trong ${attempts} lần! 🎉`;
                endGame(true);
            } else if (guess < secretNumber) {
                messageDisplay.textContent = 'Quá thấp! ⬇️ Hãy thử lại.';
            } else {
                messageDisplay.textContent = 'Quá cao! ⬆️ Hãy thử lại.';
            }
            
            guessInput.value = '';
        }

        function endGame(isWin) {
            guessInput.disabled = true;
            submitButton.disabled = true;
            resetButton.style.display = 'inline-block';
            if (isWin) {
                triggerConfetti();
            }
        }

        function triggerConfetti() {
            const confettiContainer = document.getElementById('confetti-container');
            const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#fff'];
            
            for (let i = 0; i < 50; i++) {
                const piece = document.createElement('div');
                piece.classList.add('confetti-piece');
                piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                piece.style.left = `${Math.random() * 100}vw`; 
                piece.style.top = `${Math.random() * 100}vh`; 
                piece.style.animationDelay = `${Math.random() * 2}s`; 
                confettiContainer.appendChild(piece);
            }
        }

        submitButton.addEventListener('click', checkGuess);
        guessInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkGuess();
            }
        });
        resetButton.addEventListener('click', startGame);
        
        startGame();
    }
    
    // Khởi tạo các module chỉ khi các phần tử DOM của chúng tồn tại
    initializeTodoMatrix();
    initializeGuessingGame();
});