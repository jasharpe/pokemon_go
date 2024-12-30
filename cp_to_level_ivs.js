const DOUBLED_LEVEL_TO_CPM = {
  2: 0.094,
  3: 0.1351374318,
  4: 0.16639787,
  5: 0.192650919,
  6: 0.21573247,
  7: 0.2365726613,
  8: 0.25572005,
  9: 0.2735303812,
  10: 0.29024988,
  11: 0.3060573775,
  12: 0.3210876,
  13: 0.3354450362,
  14: 0.34921268,
  15: 0.3624577511,
  16: 0.3752356,
  17: 0.387592416,
  18: 0.39956728,
  19: 0.4111935514,
  20: 0.4225,
  21: 0.4329264091,
  22: 0.44310755,
  23: 0.4530599591,
  24: 0.4627984,
  25: 0.472336093,
  26: 0.48168495,
  27: 0.4908558003,
  28: 0.49985844,
  29: 0.508701765,
  30: 0.51739395,
  31: 0.5259425113,
  32: 0.5343543,
  33: 0.5426357375,
  34: 0.5507927,
  35: 0.5588305862,
  36: 0.5667545,
  37: 0.5745691333,
  38: 0.5822789,
  39: 0.5898879072,
  40: 0.5974,
  41: 0.6048236651,
  42: 0.6121573,
  43: 0.6194041216,
  44: 0.6265671,
  45: 0.6336491432,
  46: 0.64065295,
  47: 0.6475809666,
  48: 0.65443563,
  49: 0.6612192524,
  50: 0.667934,
  51: 0.6745818959,
  52: 0.6811649,
  53: 0.6876849038,
  54: 0.69414365,
  55: 0.70054287,
  56: 0.7068842,
  57: 0.7131691091,
  58: 0.7193991,
  59: 0.7255756136,
  60: 0.7317,
  61: 0.7347410093,
  62: 0.7377695,
  63: 0.7407855938,
  64: 0.74378943,
  65: 0.7467812109,
  66: 0.74976104,
  67: 0.7527290867,
  68: 0.7556855,
  69: 0.7586303683,
  70: 0.76156384,
  71: 0.7644860647,
  72: 0.76739717,
  73: 0.7702972656,
  74: 0.7731865,
  75: 0.7760649616,
  76: 0.77893275,
  77: 0.7817900548,
  78: 0.784637,
  79: 0.7874736075,
  80: 0.7903,
  81: 0.792803968,
  82: 0.79530001,
  83: 0.797800015,
  84: 0.8003,
  85: 0.802799995,
  86: 0.8053,
  87: 0.8078,
  88: 0.81029999,
  89: 0.812799985,
  90: 0.81529999,
  91: 0.81779999,
  92: 0.82029999,
  93: 0.82279999,
  94: 0.82529999,
  95: 0.82779999,
  96: 0.83029999,
  97: 0.83279999,
  98: 0.83529999,
  99: 0.83779999,
  100: 0.84029999,
  101: 0.84279999,
  102: 0.84529999
};

function cpFormula(attack, defense, stamina) {
  return Math.floor(Math.max(10, attack * Math.sqrt(defense) * Math.sqrt(stamina) / 10));
}

function withIVs(baseAttack, baseDefense, baseStamina, aIV, dIV, sIV) {
  return {
      attack: baseAttack + aIV,
      defense: baseDefense + dIV,
      stamina: baseStamina + sIV
  };
}

function levelAdjusted(stats, doubled_level) {
  const cpm = DOUBLED_LEVEL_TO_CPM[doubled_level];
  return {
      attack: stats.attack * cpm,
      defense: stats.defense * cpm,
      stamina: stats.stamina * cpm
  };
}

function findPossibleLevelsAndIVs(baseAttack, baseDefense, baseStamina, targetCP) {
  let results = [];
  for (let attackIV = 0; attackIV <= 15; attackIV++) {
      for (let defenseIV = 0; defenseIV <= 15; defenseIV++) {
          for (let staminaIV = 0; staminaIV <= 15; staminaIV++) {
              for (let doubled_level = 2; doubled_level <= 70; doubled_level++) {
                  const combinedStats = withIVs(baseAttack, baseDefense, baseStamina, attackIV, defenseIV, staminaIV);
                  const adjStats = levelAdjusted(combinedStats, doubled_level);
                  const calcCP = cpFormula(adjStats.attack, adjStats.defense, adjStats.stamina);
                  if (calcCP === targetCP) {
                      results.push({
                          level: doubled_level / 2,
                          IVs: `${attackIV}/${defenseIV}/${staminaIV}`
                      });
                  }
              }
          }
      }
  }
  return results;
}

function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);

  // Each param is optional; if it exists, populate the input fields
  const cpVal = params.get('cp');
  if (cpVal !== null) document.getElementById('cp').value = cpVal;

  const atkVal = params.get('attack');
  if (atkVal !== null) document.getElementById('attack').value = atkVal;

  const defVal = params.get('defense');
  if (defVal !== null) document.getElementById('defense').value = defVal;

  const staVal = params.get('stamina');
  if (staVal !== null) document.getElementById('stamina').value = staVal;

  const glVal = params.get('gl_ivs');
  if (glVal !== null) document.getElementById('gl-ivs').value = glVal;

  const ulVal = params.get('ul_ivs');
  if (ulVal !== null) document.getElementById('ul-ivs').value = ulVal;
}

/**
* Updates the URL query parameters based on current form inputs,
* without reloading the page.
*/
function updateUrlParams() {
  const params = new URLSearchParams();

  // Gather current values
  const cpVal = document.getElementById('cp').value.trim();
  const atkVal = document.getElementById('attack').value.trim();
  const defVal = document.getElementById('defense').value.trim();
  const staVal = document.getElementById('stamina').value.trim();
  const glVal = document.getElementById('gl-ivs').value.trim();
  const ulVal = document.getElementById('ul-ivs').value.trim();

  // Set or delete each parameter only if there is a value
  if (cpVal)  params.set('cp', cpVal);
  if (atkVal) params.set('attack', atkVal);
  if (defVal) params.set('defense', defVal);
  if (staVal) params.set('stamina', staVal);
  if (glVal)  params.set('gl_ivs', glVal);
  if (ulVal)  params.set('ul_ivs', ulVal);

  // Replace the current history state with the updated query string
  const newUrl = window.location.pathname + '?' + params.toString();
  history.replaceState({}, '', newUrl);
}

let precomputedCombos = null;
function prepareCombos(baseA, baseD, baseS) {
  if (!precomputedCombos) {
    const combos = [];
    for (let aIV = 0; aIV <= 15; aIV++) {
      for (let dIV = 0; dIV <= 15; dIV++) {
        for (let sIV = 0; sIV <= 15; sIV++) {
          const a = baseA + aIV;
          const d = baseD + dIV;
          const s = baseS + sIV;
          combos.push({
            a, d, s,
            aIV, dIV, sIV,
            aDS: a * d * s,
            aSqrtDS: a * Math.sqrt(d) * Math.sqrt(s)
          });
        }
      }
    }
    precomputedCombos = combos.sort((x,y) => x.aSqrtDS - y.aSqrtDS);
  }
}

function computeBestIVsForLeague(baseAtk, baseDef, baseSta, cpLimit) {
  prepareCombos(baseAtk, baseDef, baseSta);
  let best = null;
  for (let dl = 2; dl <= 102; dl++) {
    const cpm = DOUBLED_LEVEL_TO_CPM[dl];
    if (!cpm) continue;
    const cpmSq = cpm * cpm;
    // Binary search for max i s.t. floor(aSqrtDS * cpmSq / 10) <= cpLimit
    let left = 0, right = precomputedCombos.length;
    while (left < right) {
      const mid = (left + right) >>> 1;
      const testCP = Math.floor(precomputedCombos[mid].aSqrtDS * cpmSq / 10);
      if (testCP <= cpLimit) left = mid + 1;
      else right = mid;
    }
    // Check combos up to left
    for (let i = 0; i < left; i++) {
      const c = precomputedCombos[i];
      const product = c.a * c.d * cpm * cpm * Math.floor(c.s * cpm);
      if (!best || product > best.product) {
        best = { level: dl / 2, cp: Math.floor(c.aSqrtDS * cpmSq / 10), totalA: cpm * c.a, totalD: cpm * c.d, totalS: Math.floor(c.s * cpm), a: c.aIV, d: c.dIV, s: c.sIV, product };
      }
    }
  }
  console.log(best);
  return best;
}

function computeStatProduct(stats) {
  return stats.attack * stats.defense * Math.floor(stats.stamina);
}

function findBestProducts(baseAtk, baseDef, baseSta) {
  const bestGL = computeBestIVsForLeague(baseAtk, baseDef, baseSta, 1500);
  const bestUL = computeBestIVsForLeague(baseAtk, baseDef, baseSta, 2500);

  return {
    GL: bestGL ? computeStatProduct(levelAdjusted(withIVs(baseAtk, baseDef, baseSta, bestGL.a, bestGL.d, bestGL.s), bestGL.level * 2)) : null,
    GLLevel: bestGL ? bestGL.level : null,
    UL: bestUL ? computeStatProduct(levelAdjusted(withIVs(baseAtk, baseDef, baseSta, bestUL.a, bestUL.d, bestUL.s), bestUL.level * 2)) : null,
    ULLevel: bestUL ? bestUL.level : null,
    ML: computeStatProduct(levelAdjusted(withIVs(baseAtk, baseDef, baseSta, 15, 15, 15), 100)), // Level 50
    MLLevel: 50,
  };
}

document.getElementById('calculateBtn').addEventListener('click', () => {
  const cp = parseInt(document.getElementById('cp').value, 10);
  const attack = parseInt(document.getElementById('attack').value, 10);
  const defense = parseInt(document.getElementById('defense').value, 10);
  const stamina = parseInt(document.getElementById('stamina').value, 10);

  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (isNaN(cp) || isNaN(attack) || isNaN(defense) || isNaN(stamina)) {
      resultsContainer.innerHTML = '<div class="no-results">Please enter valid numbers for all required fields.</div>';
      return;
  }

  const results = findPossibleLevelsAndIVs(attack, defense, stamina, cp);
  const bestProducts = findBestProducts(attack, defense, stamina);

  if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No results found.</div>';
      return;
  }

  // Compute stat products and percentages
  let processedResults = results.map(r => {
      const stats = withIVs(attack, defense, stamina, ...r.IVs.split('/').map(Number));
      const glAdjStats = levelAdjusted(stats, bestProducts.GLLevel * 2);
      const glProduct = computeStatProduct(glAdjStats);
      const ulAdjStats = levelAdjusted(stats, bestProducts.ULLevel * 2);
      const ulProduct = computeStatProduct(ulAdjStats);
      const mlAdjStats = levelAdjusted(stats, 100);
      const mlProduct = computeStatProduct(mlAdjStats);

      if (glProduct > bestProducts.GL) {
        console.log(stats)
        console.log(r.IVs)
        console.log(bestProducts.GLLevel)
        console.log(glAdjStats)
        console.log(glProduct)
        console.log(bestProducts.GL)
        console.log(cpFormula(glAdjStats.attack, glAdjStats.defense, glAdjStats.stamina))
      }
      const glPercent = bestProducts.GL ? (glProduct / bestProducts.GL * 100).toFixed(2) : 'N/A';
      const ulPercent = bestProducts.UL ? (ulProduct / bestProducts.UL * 100).toFixed(2) : 'N/A';
      const mlPercent = bestProducts.ML ? (mlProduct / bestProducts.ML * 100).toFixed(2) : 'N/A';

      return {
          IVs: r.IVs,
          glPercent,
          ulPercent,
          mlPercent
      };
  });

  // Sort by highest percentage in any league
  processedResults.sort((a, b) => {
      const maxA = Math.max(a.glPercent === 'N/A' ? 0 : parseFloat(a.glPercent), a.ulPercent === 'N/A' ? 0 : parseFloat(a.ulPercent), a.mlPercent === 'N/A' ? 0 : parseFloat(a.mlPercent));
      const maxB = Math.max(b.glPercent === 'N/A' ? 0 : parseFloat(b.glPercent), b.ulPercent === 'N/A' ? 0 : parseFloat(b.ulPercent), b.mlPercent === 'N/A' ? 0 : parseFloat(b.mlPercent));
      return maxB - maxA;
  });

  let tableHtml = '<table><tr><th>IVs (Attack/Defense/Stamina)</th><th>Great League (%)</th><th>Ultra League (%)</th><th>Master League (%)</th></tr>';
  processedResults.forEach(r => {
      tableHtml += `<tr><td>${r.IVs}</td><td>${r.glPercent}</td><td>${r.ulPercent}</td><td>${r.mlPercent}</td></tr>`;
  });
  tableHtml += '</table>';

  resultsContainer.innerHTML = tableHtml;
});

// Attach event listeners for input changes so that the URL updates each time
['cp','attack','defense','stamina','gl-ivs','ul-ivs'].forEach(id => {
document.getElementById(id).addEventListener('input', updateUrlParams);
});

function initAutoComplete() {
  fetch('pokemon_stats.json')
    .then(response => response.json())
    .then(data => {
      const autoCompleteJS = new autoComplete({
        //selector: "#autoComplete",
        placeHolder: "Type to search Pokemon...",
        data: {
          src: data.map(p => p.name),
        },
       events: {
            input: {
                selection: (event) => {
                    const selection = event.detail.selection.value;
                    autoCompleteJS.input.value = selection;
                    const p = data.find(item => item.name === selection);
                    if (p) {
                      document.getElementById('attack').value = p.attack;
                      document.getElementById('defense').value = p.defense;
                      document.getElementById('stamina').value = p.stamina;
                    }
                }
            }
        }
      });
    })
    .catch(err => console.error(err));
}

window.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  initAutoComplete();
});