"use strict"

class Statistics {
    constructor(botsLeft) {
        this.botsLeft = botsLeft;
    }

    isGameEnd() {
        return this.botsLeft == 0;
    }

    isLastBots(botsOnMap) {
        return this.botsLeft - botsOnMap == 0;
    }
}