class Automata {
    constructor(game) {
        Object.assign(this, { game });

        this.automata = [];
        this.height = 50;
        this.width = 50;

        this.tickCount = 0;
        this.ticks = 0;

        this.speed = parseInt(document.getElementById("speed").value, 10);
        this.randomButton = document.getElementById("random");
        this.randomButton.addEventListener('click', () => {
            this.loadRandomAutomata();
            this.game.draw();
        });
   
        for (let col = 0; col < this.width; col++) {
            this.automata.push([]);
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = 0;
            }
        }
        this.loadRandomAutomata();
    };

    loadRandomAutomata() {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = randomInt(2);
            }
        }
    };

    update() {
        // this.ticks++;
        // document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;
    };

    draw(ctx) {
        let size = 8;
        let gap = 1;
        ctx.fillStyle = "Black";
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                let cell = this.automata[col][row];
                if (cell) ctx.fillRect(col * size + gap, row * size + gap, size - 2 * gap, size - 2 * gap);
            }
        }
    };
}