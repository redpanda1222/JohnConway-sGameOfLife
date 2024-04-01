class Automata {
    constructor(game) {
        Object.assign(this, { game });

        this.automata = [];
        this.height = 50;
        this.width = 50;
        this.size = 12;

        this.tickCount = 0;
        this.ticks = 0;

        this.start = false;
        this.desired = false;
        this.editCell = false;

        this.speed = parseInt(document.getElementById("speed").value, 10);
        this.randomButton = document.getElementById("random");
        this.desiredButton = document.getElementById("desired");
        this.alienFaceButton = document.getElementById("alienFace");
        this.coolPattern1Button = document.getElementById("coolPattern1");
        this.testButton = document.getElementById("test");
        this.startButton = document.getElementById("start");
        this.stopButton = document.getElementById("stop");
        this.checkBox = document.getElementById("checkbox");

        for (let col = 0; col < this.width; col++) {
            this.automata.push([]);
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = 0;
            }
        }

        this.addEvents();
    };

    loadRandomAutomata() {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = randomInt(2);
            }
        }
    };

    clearAutomata() {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = 0;
            }
        }
    }

    addEvents() {
        // Get the canvas element
        var canvas = document.getElementById("gameWorld");

        // Function to handle mouse click event
        var handleClick = (event) => {
            // Get the mouse position relative to the canvas
            var rect = canvas.getBoundingClientRect();
            var mouseX = event.clientX - rect.left;
            var mouseY = event.clientY - rect.top;

            // Calculate the cell position clicked
            var cellX = Math.floor(mouseX / this.size);
            var cellY = Math.floor(mouseY / this.size);

            // Output the cell position clicked
            //console.log("Clicked cell:", cellX, cellY);
            if (this.desired) {
                this.automata[cellX][cellY] = this.automata[cellX][cellY] == 1 ? 0 : 1;
            }
        };

        // Add event listener for mouse click
        canvas.addEventListener("click", handleClick);

        this.startButton.addEventListener('click', () => {
            this.start = true;
        });

        this.stopButton.addEventListener('click', () => {
            this.start = false;
            this.desired = this.checkBox.checked;
        });

        this.desiredButton.addEventListener('click', () => {
            this.desired = true;
            this.start = false;
            this.clearAutomata();
            this.ticks = 0;
            document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;
            this.game.draw();
        });

        this.alienFaceButton.addEventListener('click', () => {
            this.desired = this.checkBox.checked;
            this.start = false;
            this.clearAutomata();
            this.ticks = 0;
            document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;
            for (let col = 0; col < this.width; col++) {
                this.automata[col][0] = 1;
            }
            this.game.draw();
        });

        this.randomButton.addEventListener('click', () => {
            this.loadRandomAutomata();
            this.desired = this.checkBox.checked;
            this.start = false;
            this.ticks = 0;
            document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;
            this.desired = this.checkBox.checked;
            this.game.draw();
        });

        this.coolPattern1Button.addEventListener('click', () => {
            this.desired = this.checkBox.checked;
            this.start = false;
            this.clearAutomata();
            this.ticks = 0;
            document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;
            for (let col = 0; col < this.width; col++) {
                for (let row = 0; row < this.height; row++) {
                    if (col % 2 == 0) {
                        if (row % 2 == 0) {
                            this.automata[col][row] = 1;
                        }
                    } else {
                        if (row % 2 == 1) {
                            this.automata[col][row] = 1;
                        }
                    }
                }
            }
            this.game.draw();
        });

        this.testButton.addEventListener('click', () => {
            this.desired = this.checkBox.checked;
            this.start = false;
            this.clearAutomata();
            this.ticks = 0;
            document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;
            for (let col = 0; col < this.width; col++) {
                this.automata[col][0 + col] = 1;
                this.automata[col][this.height - 1 - col] = 1;
            }
            this.game.draw();
        });

        this.checkBox.addEventListener("change", (event) => {
            if (event.target.checked) {
                this.desired = true;
            } else {
                this.desired = false;
            }
        });
    }

    count(col, row) {
        let count = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if the cell is within the bounds of the grid
                if (col - 1 + j >= 0 && col - 1 + j < this.width && row - 1 + i >= 0 && row - 1 + i < this.height) {
                    // Check if the current cell is not the center cell
                    if (!(j === 1 && i === 1)) {
                        if (this.automata[col - 1 + j][row - 1 + i]) {
                            count++;
                        }
                    }
                }
            }
        }
        return count;
    };

    update() {
        if (this.start) {
            this.desired = false; // set desired to flase to remove gird
            this.speed = parseInt(document.getElementById("speed").value, 10);

            if (this.tickCount++ >= this.speed && this.speed != 120) {
                this.tickCount = 0;
                this.ticks++;
                document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;

                let next = [];
                for (let col = 0; col < this.width; col++) {
                    next.push([]);
                    for (let row = 0; row < this.height; row++) {
                        next[col].push(0);
                    }
                }

                for (let col = 0; col < this.width; col++) {
                    for (let row = 0; row < this.height; row++) {
                        if (this.automata[col][row] && (this.count(col, row) === 2 || this.count(col, row) === 3)) next[col][row] = 1;
                        if (!this.automata[col][row] && this.count(col, row) === 3) next[col][row] = 1;
                    }
                }
                this.automata = next;
            }
        }
    };

    draw(ctx) {
        // Get the canvas element
        if (this.desired) {
            var canvas = document.getElementById("gameWorld");
            var ctx = canvas.getContext("2d");

            // Calculate cell width and height
            var cellWidth = canvas.width / this.width;
            var cellHeight = canvas.height / this.height;

            // Draw the grid
            for (var x = 0; x <= canvas.width; x += cellWidth) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
            }

            for (var y = 0; y <= canvas.height; y += cellHeight) {
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
            }

            // Set the color and draw the grid lines
            ctx.strokeStyle = "black";
            ctx.stroke();
        }

        let gap = 1;
        ctx.fillStyle = "Black";
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                let cell = this.automata[col][row];
                if (cell) ctx.fillRect(col * this.size + gap, row * this.size + gap, this.size - 2 * gap, this.size - 2 * gap);
            }
        }
    };
}