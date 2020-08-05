/**
 * Made When            :   2020.01.30;
 * Last Update          :   2020.08.04;
 * Supervisor/Advisor   :   Breno Ferraz de Oliveira <>;
 * Author               :   Gabriel Marino de Oliveira <gcmarino404@gmail.com>;
 * Execution            :   node RandomWalk.js
 * Notes                :   Stochastic simulation of a Random Walk;
 *                                  Improvise. Adapt. Overcome.
 *                                         - Grylls, Bear. 2017
 */

const fs = require('fs');
const N = 1000,     // Number of total individuals;
      L = 1.0,      // Space size;
      l = 0.01,     // Pace Length;
      NG = 1000,    // Number of Generations;
      Pr = 0.7,     // Reproduction Probability;
      Pd = 0.3;     // Death Probability;

class Individual {
    constructor(Gender, PosX, PosY) {
        this.g = Gender;
        this.x = PosX;
        this.y = PosY;
        // 'Pos' stands for 'Position', therefore 'PosX' and 'PosY' stands for 'Position X' and 'Position Y', respectively;
    };
};

async function op(t, arr) {
    // Printing data for female(1) individuals;
    fs.open(`dat/caminhda-${1}-${t}.dat`, 'w', function (err) {if (err) throw err;});
    for (i = 0; i < N; i++) {
        arr[i].g === 1 ? await fs.promises.writeFile(`dat/caminhda-${1}-${t}.dat`, `${Space[i].x} ${Space[i].y}\n`, function (err) {if (err) throw err;}) : '';
    };
    // Printing data for male(2) individuals;
    fs.open(`dat/caminhda-${2}-${t}.dat`, 'w', function (err) {if (err) throw err;});
    for (i = 0; i < N; i++) {
        arr[i].g === 2 ? await fs.promises.writeFile(`dat/caminhda-${2}-${t}.dat`, `${Space[i].x} ${Space[i].y}\n`, function (err) {if (err) throw err;}) : '';
    };
    // Therefore any other value is take as empty space or a non-individual;
};

function main() {
    const Space = [];
    let i, j, n, o, t;  // These letters stands for a vairety of indexs;
    let n_m = 0,        // Number of male individuals;
        n_f = 0;        // Number of female individuals;
    let d, dx, dy, th, act;
    /**
     * 'd' stands for 'distance', therefore 'dx' and 'dy' stands for 'x distance' and 'y distance', respectively;
     * 'th' stands for;
     */

    // Loop for random draw gender and position of each individual;
    for (i = 0; i < N; i++) {
        const g = 2.0*Math.random()+1.0,
            x = Math.random(),
            y = Math.random();
        Space.push(new Individual(g, x, y));
    };
    op(0, Space);
    for (i = 0; i < N; i++) {
        Space[i].g === 1 ? n_f++ : n_m++;
    };
    fs.promises.writeFile('dat/dst.dat', `${1.0*n_f/N}, ${1.0*n_m/N}\n`, function (err) {if (err) throw err;});

    // Main Loop - Temporal Loop;
    for (t = 1; t < NG; t++) {
        // Loop to each individual take their act;
        for (i = 0; i < N; i++) {
            do {
                n = Math.floor(Math.random()*N);
            } while (Space[n].g === 0);
            //  Mobility conditions;
            th = 2.0*Math.PI*Math.random();
            Space[n].x += l*Math.cos(th);
            Space[n].x > L ? Space[n].x -= L :
            Space[n].x < 0.0 ? Space[n].x += L : '';
            Space[n].y += l*Math.sin(th);
            Space[n].y > L ? Space[n].y -= L :
            Space[n].y < 0.0 ? Space[n].y += L : '';
            // Act;
            act = Math.random();
            if (act < Pr) {
                // Reproduction conditions;
                o = 0;
                d = L;
                for (j = 0; j < N; j++) {
                    if (Space[j].g !== Space[n].g && Space[j].g !== 0) {
                        dx = Math.abs(Space[j].x-Space[n].x);
                        dx > 0.5*L ? dx -= L : '';
                        dy = Math.abs(Space[j].y-Space[n].y);
                        dy > 0.5*L ? dy -= L : '';
                        if (Math.sqrt(dx*dx + dy*dy) < d) {
                            d = Math.sqrt(dx*dx + dy*dy);
                            o = j;
                        };
                    };
                };
                if (l >= d) {
                    for (j = 0; j < N; j++) {
                        if (Space[j].g === 0) {
                            Space[j].g = 2.0*Math.random()+1.0;
                            Space[j].g === 1 ? n_f++ : n_m++;
                            th = 2.0*Math.PI*Math.random();
                            if (Space[j].g === 1) {
                                Space[j].x = Space[n].x + l*Math.cos(th);
                                Space[j].x > L ? Space[j].x -= L :
                                Space[j].x < 0.0 ? Space[j].x += L : '';
                                Space[j].y = Space[n].y + l*Math.sin(th);
                                Space[j].y > L ? Space[j].y -= L :
                                Space[j].y < 0.0 ? Space[j].y += L : '';
                            } else {
                                Space[j].x = Space[o].x + l*Math.cos(th);
                                Space[j].x > L ? Space[j].x -= L :
                                Space[j].x < 0.0 ? Space[j].x += L : '';
                                Space[j].y = Space[o].y + l*Math.sin(th);
                                Space[j].y > L ? Space[j].y -= L :
                                Space[j].y < 0.0 ? Space[j].y += L : '';
                            };
                            j = N;
                        };
                    };
                };
            } else {
                // Death Conditions;
                Space[n].g === 1 ? n_f-- : n_m--;
                Space[n].g = 0;
            };
        };
        op(t, Space);
        fs.appendFile('dat/dst.dat', `${1.0*n_f/N}, ${1.0*n_m/N}\n`, function (err) {if (err) throw err;});
        t%(NG/100) === 0 ? console.log(`${t/(NG/100)}%`) : '';
    };

    return Space;
};

main();
// console.table(main());