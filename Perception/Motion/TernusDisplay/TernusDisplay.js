function Ball (radius, color) {
    if (radius === undefined)
        radius = 25;
    if (color === undefined)
        color = "#000000";
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.color = utils.parseColor(color);
    this.lineWidth = 0;
}

Ball.prototype.draw = function (context, x, y) {
    context.save();
    context.translate(x, y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);

    context.lineWidth = this.lineWidth;
    context.fillStyle = this.color;
    context.beginPath();
    //x, y, radius, start_angle, end_angle, anti-clockwise
    context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
    context.closePath();
    context.fill();
    if (this.lineWidth > 0) {
        context.stroke();
    }
    context.restore();
};

window.onload = function () {
    var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    log = document.getElementById("log"),
    mouse = utils.captureMouse(canvas),
    start_time = new Date().getTime(),
    time = getTimer(),
    next_onset_time = time,
    ball = new Ball(),
    displayDuration = 200,
    isi = [200, 150, 100, 75, 50, 25],
    isi_index = 0,
    state = 0,
    x0 = [canvas.width * 3 / 10, canvas.width * 5 / 10],
    x2 = [canvas.width * 5 / 10, canvas.width * 7 / 10],
    y = canvas.height / 2;

    canvas.addEventListener('mousedown', function () {
        isi_index = (isi_index + 1) % isi.length;
    }, false);

    function getTimer () {
        return (new Date().getTime() - start_time);
    }

    (function drawFrame () {
        window.requestAnimationFrame(drawFrame, canvas);

        time = getTimer();
        if (time >= next_onset_time) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (state == 0) {
                for (i = 0; i < x0.length; i++)
                    ball.draw(context, x0[i], y);
                next_onset_time = next_onset_time + displayDuration;
            } else if (state == 2) {
                for (i = 0; i < x2.length; i++)
                    ball.draw(context, x2[i], y);
                next_onset_time = next_onset_time + displayDuration;
            } else {
                next_onset_time = next_onset_time + isi[isi_index];
            }
            log.value = "ISI = " + isi[isi_index];
            state = (state + 1) % 4;
        }
    }());
};
