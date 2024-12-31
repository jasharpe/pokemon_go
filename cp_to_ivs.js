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

function findPossibleLevelsAndIVs(baseAttack, baseDefense, baseStamina, targetCP, ivFloor, candidateLevels) {
  let results = [];

  for (let attackIV = ivFloor; attackIV <= 15; attackIV++) {
    for (let defenseIV = ivFloor; defenseIV <= 15; defenseIV++) {
      for (let staminaIV = ivFloor; staminaIV <= 15; staminaIV++) {
        for (const dl of candidateLevels) {
          const combinedStats = withIVs(baseAttack, baseDefense, baseStamina, attackIV, defenseIV, staminaIV);
          const adjStats = levelAdjusted(combinedStats, dl);
          const calcCP = cpFormula(adjStats.attack, adjStats.defense, adjStats.stamina);
          if (calcCP === targetCP) {
            results.push({
              level: dl / 2,
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

  const pokemonVal = params.get('pokemon');
  if (pokemonVal !== null) document.getElementById('autoComplete').value = pokemonVal;

  const scenario = params.get('scenario');
  if (scenario !== null) document.getElementById('scenario').value = scenario;
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
  const pokemonVal = document.getElementById('autoComplete').value.trim();
  const scenario = document.getElementById('scenario').value.trim();

  // Set or delete each parameter only if there is a value
  if (cpVal)  params.set('cp', cpVal);
  if (atkVal) params.set('attack', atkVal);
  if (defVal) params.set('defense', defVal);
  if (staVal) params.set('stamina', staVal);
  if (pokemonVal) params.set('pokemon', pokemonVal);
  if (scenario) params.set('scenario', scenario);

  // Replace the current history state with the updated query string
  const newUrl = window.location.pathname + '?' + params.toString();
  history.replaceState({}, '', newUrl);

  document.getElementById('calculateBtn').click();
}

function computeStatProduct(stats) {
  return stats.attack * stats.defense * Math.floor(stats.stamina);
}

function rankAllIVs(baseAtk, baseDef, baseSta, ivFloor, cpLimit) {
  const products = [];
  const MAX_LEVEL = 50;
  for (let a = ivFloor; a <= 15; a++) {
    for (let d = ivFloor; d <= 15; d++) {
      STAMINA: for (let s = ivFloor; s <= 15; s++) {
        var last_product = null;
        for (let dl = 2; dl <= 2 * MAX_LEVEL; dl++) {
          const cpm = DOUBLED_LEVEL_TO_CPM[dl];
          if (!cpm) {
            console.error('No CPM for level', dl);
            continue;
          }
          const testCP = Math.floor((baseAtk + a) * Math.sqrt(baseDef + d) * Math.sqrt(baseSta + s) * cpm * cpm / 10);
          if (testCP > cpLimit) {
            products.push({
              ivs: `${a}/${d}/${s}`,
              double_level: dl - 1,
              product: last_product,
            });
            continue STAMINA;
          }
          last_product = (baseAtk + a) * (baseDef + d) * cpm * cpm * Math.floor((baseSta + s) * cpm);
        }
        products.push({
          ivs: `${a}/${d}/${s}`,
          double_level: 2 * MAX_LEVEL,
          product: last_product,
        });
      }
    }
  }
  const reverseSortedProducts = products.sort((a, b) => b.product - a.product);
  console.log(reverseSortedProducts);
  const rankedProducts = reverseSortedProducts.map((p, i, arr) => ({
    ...p,
    rank: (i > 0 && arr[i - 1].product === p.product) ? null: i + 1,
  })).map((p, i, arr) => {
    if (p.rank === null && i > 0) {
      p.rank = arr[i - 1].rank;
    }
    return p;
  });
  const ivsToRankedMap = rankedProducts.reduce((acc, p) => {
    acc[p.ivs] = p;
    return acc;
  }, {});
  return {
    bestProduct: rankedProducts[0].product,
    ivsToRankedMap,
  };
}

function rankAllLeagues(baseAtk, baseDef, baseSta, ivFloor) {
  const glRanks = rankAllIVs(baseAtk, baseDef, baseSta, ivFloor, 1500);
  console.log(glRanks);
  const ulRanks = rankAllIVs(baseAtk, baseDef, baseSta, ivFloor, 2500);
  console.log(ulRanks);
  const mlRanks = rankAllIVs(baseAtk, baseDef, baseSta, ivFloor, 10000);
  console.log(mlRanks);

  return {
    glRanks,
    ulRanks,
    mlRanks,
  };
}

function adjustTableFontSize() {
  const table = document.querySelector('.results-section table');
  const results = document.querySelector('.results-section #results');

  if (!table || !results) {
    console.error('table or results section does not exist');
    return;
  }

  let fontSize = 16; // Start with a base font size
  table.style.fontSize = `${fontSize}px`;

  while (table.clientWidth > results.clientWidth && fontSize > 10) {
    fontSize -= 1;
    table.style.fontSize = `${fontSize}px`;
  }
}

let currentCalcId = 0;

document.getElementById('calculateBtn').addEventListener('click', () => {
  const cp = parseInt(document.getElementById('cp').value, 10);
  const attack = parseInt(document.getElementById('attack').value, 10);
  const defense = parseInt(document.getElementById('defense').value, 10);
  const stamina = parseInt(document.getElementById('stamina').value, 10);
  const scenario = document.getElementById('scenario').value;
  var ivFloorForRanks;
  var ivFloorForPossibilities;
  var candidateLevels;
  switch (scenario) {
    case "wild":
      ivFloorForRanks = 0;
      ivFloorForPossibilities = 0;
      // Levels 1 - 30
      candidateLevels = Array.from({ length: 30 }, (_, i) => 2 + i * 2);
      break;
    case "wildwb":
      ivFloorForRanks = 4;
      ivFloorForPossibilities = 4;
      // Levels 6 - 35
      candidateLevels = Array.from({ length: 30 }, (_, i) => 12 + i * 2);
      break;
    case "research":
      ivFloorForRanks = 10;
      ivFloorForPossibilities = 10;
      // Level 15 only
      candidateLevels = [30];
      break;
    case "raid":
      ivFloorForRanks = 10;
      ivFloorForPossibilities = 10;
      // Level 20 only
      candidateLevels = [40];
      break;
    case "raidwb":
      ivFloorForRanks = 10;
      ivFloorForPossibilities = 10;
      // Level 25 only
      candidateLevels = [50];
      break;
    case "lraid":
      ivFloorForRanks = 10;
      ivFloorForPossibilities = 10;
      // Level 20 only
      candidateLevels = [40];
      break;
    case "lraidwb":
      ivFloorForRanks = 10;
      ivFloorForPossibilities = 10;
      // Level 25 only
      candidateLevels = [50];
      break;
    default:
      console.error('unexpected scenario value', scenario);
      break;
  }

  const resultsContainer = document.getElementById('results');
  const resultCount = document.getElementById('result-count');
  resultCount.innerText = '';
  resultsContainer.innerHTML = '... calculating ...';

  const localCalcId = ++currentCalcId;

  setTimeout(() => {
    if (isNaN(cp) || isNaN(attack) || isNaN(defense) || isNaN(stamina)) {
      resultsContainer.innerHTML = '<div class="no-results">Please enter valid numbers for all required fields.</div>';
      return;
    }
    const results = findPossibleLevelsAndIVs(attack, defense, stamina, cp, ivFloorForPossibilities, candidateLevels);
    const leagueRanks = rankAllLeagues(attack, defense, stamina, ivFloorForRanks);

    if (results.length === 0) {
      if (localCalcId !== currentCalcId) return; // Abort if new calculation started
      resultsContainer.innerHTML = '<div class="no-results">No results found.</div>';
      return;
    }

    // Compute stat products and percentiles
    console.log(results);
    let processedResults = results.map(r => {
      const glResult = leagueRanks.glRanks.ivsToRankedMap[r.IVs];
      const glRank = glResult.rank;
      const glProductPercent = (glResult.product / leagueRanks.glRanks.bestProduct * 100).toFixed(2);
      const ulResult = leagueRanks.ulRanks.ivsToRankedMap[r.IVs];
      const ulRank = ulResult.rank;
      const ulProductPercent = (ulResult.product / leagueRanks.ulRanks.bestProduct * 100).toFixed(2);
      const mlResult = leagueRanks.mlRanks.ivsToRankedMap[r.IVs];
      const mlRank = mlResult.rank;
      const mlProductPercent = (mlResult.product / leagueRanks.mlRanks.bestProduct * 100).toFixed(2);

      return {
        level: r.level,
        IVs: r.IVs,
        glRank,
        glProductPercent,
        ulRank,
        ulProductPercent,
        mlRank,
        mlProductPercent,
      };
    });

    // Sort by lowest rank in any league.
    processedResults.sort((a, b) => {
        const minA = Math.min(a.glRank, a.ulRank, a.mlRank);
        const minB = Math.min(b.glRank, b.ulRank, b.mlRank);
        return minA - minB;
    });

    let tableHtml = '<table><tr><th>Level</th><th>IVs (Atk / Def / Sta)</th><th>GL Rank (% of MSP)</th><th>UL Rank (% of MSP)</th><th>ML Rank (% of MSP)</th></tr>';
    processedResults.forEach(r => {
      const isRank1 = (r.glRank === 1 || r.ulRank === 1 || r.mlRank === 1);
      const highlightClass = isRank1 ? 'highlight' : '';
      tableHtml += `<tr class="${highlightClass}"><td>${r.level}</td><td>${r.IVs}</td>` +
      (cp > 1500 ? '<td>N/A</td>' : `<td>${r.glRank} (${r.glProductPercent}%)</td>`) +  
      (cp > 2500 ? '<td>N/A</td>' : `<td>${r.ulRank} (${r.ulProductPercent}%)</td>`) +  
      `<td>${r.mlRank} (${r.mlProductPercent}%)</td>` +
      `</tr>`;
    });
    tableHtml += '</table>';

    if (localCalcId !== currentCalcId) return; // Abort if new calculation started
    resultsContainer.innerHTML = tableHtml;
    resultCount.innerText = processedResults.length;

    // Adjust the table font size to fit within its container
    adjustTableFontSize();
  }, 0);
});

// Attach event listeners for input changes so that the URL updates each time
['cp', 'attack', 'defense', 'stamina'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateUrlParams);
});

document.getElementById('scenario').addEventListener('change', updateUrlParams);
document.getElementById('scenario').addEventListener('change', () => {
  const explanation = document.getElementById('scenario-explanation');
  switch (document.getElementById('scenario').value) {
    case "wild":
      explanation.innerText = 'IV Floor 0/0/0, Level 1-30';
      break;
    case "wildwb":
      explanation.innerText = 'IV Floor 4/4/4, Level 6-35';
      break;
    case "research":
      explanation.innerText = 'IV Floor 10/10/10, Level 15';
      break;
    case "raid":
      explanation.innerText = 'IV Floor 10/10/10, Level 20';
      break;
    case "raidwb":
      explanation.innerText = 'IV Floor 10/10/10, Level 25';
      break;
    case "lraid":
      explanation.innerText = 'IV Floor 10/10/10, Level 20, IV Floor for GL/UL Ranks';
      break;
    case "lraidwb":
      explanation.innerText = 'IV Floor 10/10/10, Level 25, IV Floor for GL/UL Ranks';
      break;
    default:
      console.error('unexpected scenario value', document.getElementById('scenario').value);
  }
});

function initAutoComplete() {
  fetch('pokemon_stats.json')
    .then(response => response.json())
    .then(data => {
      const autoCompleteJS = new autoComplete({
        placeHolder: "Type to search Pokemon...",
        data: {
          src: data.map(p => p.name),
        },
        submit: true,
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
                updateUrlParams();
              },
            }
        }
      });
      document.querySelector("#autoComplete").addEventListener("keydown", event => {
        if (event.key !== 'Enter' || !autoCompleteJS.feedback || autoCompleteJS.cursor !== -1 || autoCompleteJS.feedback.results.length === 0) {
          return;
        }
        console.log(autoCompleteJS.feedback);
        autoCompleteJS.select(0);
        updateUrlParams();
      });
      document.querySelector("#autoComplete").addEventListener("blur", event => {
        if (!autoCompleteJS.feedback || autoCompleteJS.feedback.results.length === 0) {
          return;
        }
        autoCompleteJS.select(0);
        updateUrlParams();
      });
    })
    .catch(err => console.error(err));
}

window.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  initAutoComplete();  
  document.getElementById('calculateBtn').click();
  window.addEventListener('resize', adjustTableFontSize);
});