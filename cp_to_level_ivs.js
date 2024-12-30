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

document.getElementById('calculateBtn').addEventListener('click', () => {
  const cp = parseInt(document.getElementById('cp').value, 10);
  const attack = parseInt(document.getElementById('attack').value, 10);
  const defense = parseInt(document.getElementById('defense').value, 10);
  const stamina = parseInt(document.getElementById('stamina').value, 10);

  const glIvsInput = document.getElementById('gl-ivs').value.trim();
  const ulIvsInput = document.getElementById('ul-ivs').value.trim();

  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (isNaN(cp) || isNaN(attack) || isNaN(defense) || isNaN(stamina)) {
      resultsContainer.innerHTML = '<div class="no-results">Please enter valid numbers for all required fields.</div>';
      return;
  }

  const results = findPossibleLevelsAndIVs(attack, defense, stamina, cp);

  if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No results found.</div>';
      return;
  }

  // Add special tags
  let processedResults = results.map(r => {
      let specialTags = [];
      if (r.IVs === "15/15/15") {
          specialTags.push("Hundo");
      }
      if (glIvsInput && r.IVs === glIvsInput) {
          specialTags.push("Best GL");
      }
      if (ulIvsInput && r.IVs === ulIvsInput) {
          specialTags.push("Best UL");
      }
      return {
          level: r.level,
          IVs: r.IVs,
          specialTags: specialTags
      };
  });

  // Sort so that special results appear at the top
  processedResults.sort((a, b) => {
      return b.specialTags.length - a.specialTags.length;
  });

  let tableHtml = '<table><tr><th>Level</th><th>IVs (Attack/Defense/Stamina)</th><th>Special</th></tr>';
  processedResults.forEach(r => {
      let specialCell = r.specialTags.length > 0 ? r.specialTags.join(", ") : "";
      let rowClass = r.specialTags.length > 0 ? "highlight" : "";
      tableHtml += `<tr class="${rowClass}"><td>${r.level}</td><td>${r.IVs}</td><td>${specialCell}</td></tr>`;
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