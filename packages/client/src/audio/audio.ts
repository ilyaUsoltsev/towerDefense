declare const zzfx: (...args: (number | undefined)[]) => void;

export const SoundLib = {
  enemyDeath: new Audio('/audio/enemy-death.wav'),

  sniperShot: new Audio('/audio/sniper-shot.mp3'),
};

// export const SoundLib = {
//   spawn: () => zzfx(...[.6,,300,.01,.03,.05]),
//   waveStart: () => zzfx(...[1,,500,.02,.2,.1,,1.5]),
//   baseHit: () => zzfx(...[2,,120,.05,.4,.4,,1,-1]),
//   win: () => zzfx(...[2,,700,.05,.6,.2,,2]),

//   enemyDeath: () => zzfx(...[
//     .2,      // volume
//     0,        // randomness
//     90,       // frequency
//     0.005,    // attack
//     0.12,     // sustain
//     0.18,     // release
//     0,        // shape (sine-ish)
//     1.5,      // shapeCurve
//     0,        // slide
//     0,        // deltaSlide
//     0,        // pitchJump
//     0,        // pitchJumpTime
//     0.02,     // repeatTime
//     0.4,      // noise (THIS makes it realistic)
//     0,        // modulation
//     0         // bitCrush
//   ]),
//   loseHealth: () => zzfx(...[
//     .8,      // volume
//     0.2,      // randomness (important for chaos)
//     1200,     // high frequency
//     0.001,    // instant attack
//     0.08,     // short sustain
//     0.25,     // decay tail
//     3,        // saw-ish shape (sharper)
//     0.5,      // shape curve
//     -200,     // downward slide
//     0,        // delta slide
//     0,        // pitch jump
//     0,
//     0,
//     0.9,      // heavy noise (this makes it glass)
//     0,
//     0
//   ]),
//   moneyPickup: () => zzfx(...[4.8,,349,.01,.02,.14,,3.7,-4,72,222,.04,,,,.1,,.54,.02,,-744]),
// };
