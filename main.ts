radio.onReceivedNumber(function (receivedNumber) {
    if (mode == 0) {
        if (Math.floor(receivedNumber / 3) == device_number) {
            running = true
            classed = receivedNumber % 3
            answered = false
            react_sum = 0
            react_start = input.runningTime()
        }
    }
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    if (mode == 0) {
        if (!(running)) {
            device_number += 1
            basic.showNumber(device_number)
            basic.pause(100)
            basic.showIcon(IconNames.Surprised)
        }
    } else {
        num_devices += 1
        basic.showNumber(num_devices)
    }
})
input.onButtonPressed(Button.A, function () {
    if (mode == 1) {
        if (!(running)) {
            running = true
            score = 0
            react_sum = 0
            number_picked = randint(0, num_devices * 3 - 1)
            radio.sendNumber(number_picked)
            react_start = input.runningTime()
        }
    } else {
        challenge_mode = !(challenge_mode)
        if (challenge_mode) {
            basic.showIcon(IconNames.House)
        } else {
            basic.showIcon(IconNames.Sword)
        }
        basic.pause(100)
        basic.clearScreen()
    }
})
radio.onReceivedValue(function (name, value) {
    if (mode == 1) {
        if (15000 > input.runningTime() - react_start) {
            if (running) {
                if (name == "correct") {
                    score += 1
                } else {
                    score += -1
                }
                react_sum += value
                number_picked = randint(0, num_devices * 3 - 1)
                radio.sendNumber(number_picked)
            }
        } else {
            basic.showString("Time")
            basic.showNumber(score)
            basic.showString(" ")
            basic.showNumber(react_sum / score / 1000)
            running = false
        }
    }
})
let pressed = 0
let number_picked = 0
let score = 0
let react_start = 0
let react_sum = 0
let answered = false
let classed = 0
let challenge_mode = false
let num_devices = 0
let mode = 0
let device_number = 0
let running = false
pins.touchSetMode(TouchTarget.P0, TouchTargetMode.Capacitive)
pins.touchSetMode(TouchTarget.P1, TouchTargetMode.Capacitive)
pins.touchSetMode(TouchTarget.P2, TouchTargetMode.Capacitive)
running = false
device_number = 0
mode = 0
let mode_switch = 0
num_devices = 1
challenge_mode = false
radio.setGroup(108)
basic.showIcon(IconNames.Surprised)
loops.everyInterval(1000, function () {
    if (mode == 0) {
        if (input.buttonIsPressed(Button.AB)) {
            mode_switch += 1
            if (mode_switch == 3) {
                mode = 1
                basic.showIcon(IconNames.TShirt)
            }
        }
    }
})
loops.everyInterval(100, function () {
    if (mode == 0) {
        if (running) {
            if (challenge_mode) {
                if (classed == 0) {
                    basic.showIcon(IconNames.Heart)
                } else if (classed == 1) {
                    basic.showIcon(IconNames.Butterfly)
                } else if (classed == 2) {
                    basic.showIcon(IconNames.StickFigure)
                }
            } else {
                basic.showNumber(classed)
            }
            if (!(answered)) {
                if (input.pinIsPressed(TouchPin.P0)) {
                    react_sum += input.runningTime() - react_start
                    pressed = 0
                    answered = true
                } else if (input.pinIsPressed(TouchPin.P1)) {
                    react_sum += input.runningTime() - react_start
                    pressed = 1
                    answered = true
                } else if (input.pinIsPressed(TouchPin.P2)) {
                    react_sum += input.runningTime() - react_start
                    pressed = 2
                    answered = true
                }
                if (answered) {
                    if (pressed == classed) {
                        basic.showIcon(IconNames.Yes)
                        score += 1
                        radio.sendValue("correct", react_sum)
                    } else if (pressed != classed) {
                        basic.showIcon(IconNames.No)
                        score += -1
                        radio.sendValue("wrong", react_sum)
                    }
                    answered = false
                    running = false
                }
            }
        }
    }
})
loops.everyInterval(5000, function () {
    if (mode == 0) {
        mode_switch = 0
    }
})
