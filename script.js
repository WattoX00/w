const gameContainer = document.getElementById('game-container');
const monsters = [];
let score = 0;
let gold = 50
let goldB = 0
let waveNumber = 1;
let waveComplete = false;
let playerPower = 20;
let critChance = 0;
let hp = 0
let x = 0
let y=0
let upgradeCosts = { power: 50, crit: 60, gold: 100, hp: 200, slow: 30000 };
let upgradeLevels = { power: 1, crit: 0, gold: 0, hp: 0, slow: 0 };
let isCriticalStrike = false
let currentCast = null;
let mageLevel = 0;
let assassinLevel = 0;
let berserkerLevel = 0;

let mageLevelStat = 0;
let assassinLevelStat = 0;
let berserkerLevelStat = 0;

let mageCostStat = 100;
let assassinCostStat = 100;
let berserkerCostStat = 150;

let mageCost = 100;
let assassinCost = 100;
let berserkerCost = 100;
let assassin100 = false
let monsterSpeed = 1.8
let monsterSpeedHelp = monsterSpeed
let magePassiveBonus = 35;
let assassinCritBonus = { chance: 0, damage: 0 };
let mageFreezeTargets = 1;
let assassinInstantKillChance = 0.05;
let berserkRage = 1.1
let castUsedThisWave = false;
let monsterHelpCount = 1

const enemyDamageSound = new Audio('d2.mp3');
const enemyDeathSound = new Audio('d1.mp3');
const buttonClickSound = new Audio('buttons.mp3');
const abilityMageSound = new Audio('magesound.mp3');
const abilityAssassinSound = new Audio('assassinsound.mp3');
const abilityBerserkerSound = new Audio('berserksound.mp3');

const openSettings = document.getElementById('openSettings');
const settingsPage = document.getElementById('settingsPage');
const closeSettings = document.getElementById('closeSettings');
const muteSFX = document.getElementById('muteSFX');
const sfxVolume = document.getElementById('sfxVolume');

openSettings.addEventListener('click', () => {
    settingsPage.style.display = 'block';
    openSettings.style.display = 'none'
});

closeSettings.addEventListener('click', () => {
    settingsPage.style.display = 'none';
    openSettings.style.display = 'block'
});

muteSFX.addEventListener('change', () => {
    buttonClickSound.muted = muteSFX.checked;
    abilityBerserkerSound.muted = muteSFX.checked;
    abilityAssassinSound.muted = muteSFX.checked;
    abilityMageSound.muted = muteSFX.checked;
    enemyDeathSound.muted = muteSFX.checked;
    enemyDamageSound.muted = muteSFX.checked;
});

sfxVolume.addEventListener('input', () => {
    buttonClickSound.volume = sfxVolume.value;
    abilityBerserkerSound.volume = sfxVolume.value;
    abilityAssassinSound.volume = sfxVolume.value;
    abilityMageSound.volume = sfxVolume.value;
    enemyDeathSound.volume = sfxVolume.value;
    enemyDamageSound.volume = sfxVolume.value;
});

const pages = [
    {
      title: "Welcome, Hero!",
      text: "Long ago, the dungeon walls trembled as an ancient evil awakened beneath the surface. Waves of monsters emerged, threatening to engulf the land. Only you, the chosen adventurer, can stand against them!"
    },
    {
      title: "Gameplay Basics!",
      text: "Monsters will march relentlessly from the left side of the screen toward the right. If even one monster crosses the screen, the dungeon wins, and your quest ends. Click on the monsters to attack and deal damage. Slay them all to clear the room and advance."
    },
    {
      title: "Pro Tip!",
      text: "Adjust your aim, keep your reflexes sharp, and don’t let your guard down!"
    },
    {
      title: "Upgrades and Strategy!",
      text: "The spoils of battle are yours to keep! With each room cleared, the monsters' riches will be yours to spend."
    },
    {
      title: "Between Rooms!",
      text: "Use your hard-earned gold to purchase upgrades that strengthen your abilities. Focus on building your own unique playstyle—whether it's rapid attacks, devastating strikes, or balanced survival."
    },
    {
      title: "Dungeon Rhythm",
      text: "The dungeon has a peculiar pulse, adventurer. Use it to your advantage. Every 3rd level is a reprieve. The monsters’ health will be reduced—but beware! Each reprieve comes with a cost, as their numbers grow by one extra foe from then on. Every 10th level, the dungeon pits you against a mighty boss. These battles will test your strength and strategy to the fullest."
    },
    {
      title: "Heroic Advice",
      text: "Full-Screen Mastery: For the best experience, press F11 to play in full screen. Clicking Tactics: Focus on weak monsters first, then turn your fury to the stronger foes."
    },
    {
      title: "Destiny Awaits",
      text: "The dungeon calls, adventurer. Will you stand against the tide of darkness? Can you claim victory over the waves of monsters and bosses that await?"
    },
    {
      title: "Prepare your mouse, steel your will, and dive into the depths. The world is counting on you.",
      text: ""
    }
  ];
  let currentPage = 0;

  const contentElement = document.getElementById('tutorial-content');
  const prevButton = document.getElementById('prev-btn');
  const nextButton = document.getElementById('next-btn');
  const closeB = document.getElementById('closeB');
  const tutorial = document.getElementById('tutorial');

  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        buttonClickSound.currentTime = 0;
        buttonClickSound.play();
    });
});

closeB.addEventListener('click', () => {
    tutorial.style.display = 'none'
    closeB.style.display = 'none'
    document.getElementById('tutbtn').style.display = 'block'
    document.getElementById('start-content').style.display = 'block'
})
function updateContent() {
contentElement.innerHTML = `
    <h1>${pages[currentPage].title}</h1>
    <p>${pages[currentPage].text}</p>
`;
prevButton.disabled = currentPage === 0;
nextButton.disabled = currentPage === pages.length - 1;
}

prevButton.addEventListener('click', () => {
if (currentPage > 0) {
    currentPage--;
    updateContent();
}
});
function tutorialButton() {
    tutorial.style.display = 'block'
    closeB.style.display = 'block'
    document.getElementById('start-content').style.display = 'none'
    document.getElementById('tutbtn').style.display = 'none'
}
nextButton.addEventListener('click', () => {
if (currentPage < pages.length - 1) {
    currentPage++;
    updateContent();
}
});

updateContent();

function createMonster(extraHealth = 0) {
    const monster = document.createElement('div');
    monster.className = 'monster';
    monster.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    monster.style.left = '-100px';

    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';

    const healthBarInner = document.createElement('div');
    healthBarInner.className = 'health-bar-inner';

    healthBar.appendChild(healthBarInner);
    monster.appendChild(healthBar);
    gameContainer.appendChild(monster);

    const monsterData = {
        element: monster,
        health: 100 + extraHealth,
        maxHealth: 100 + extraHealth,
        position: 0,
        frozen: false,
        debuffed: false,
    };
    monsters.push(monsterData);

    monster.addEventListener('click', () => {
        let damage = calculateDamage(monsterData, playerPower);
        enemyDamageSound.currentTime = 0;
        enemyDamageSound.play();
        if (Math.random() < critChance / 100) {
            damage *= (2+assassinCritBonus['damage']);
            isCriticalStrike = true
        }

        showDamage(monster, damage);
        isCriticalStrike = false
        monsterData.health -= damage;

        healthBarInner.style.width = (monsterData.health / monsterData.maxHealth) * 100 + '%';

        if (monsterData.health <= 0) {
            if (currentCast === 'assassin' && Math.random() < 0.2) {
                score += (gold/2);
            }
            if (currentCast === 'berserker'){
                x+=1
                playerPower+=1
            }
            score += gold+(gold*(goldB/100));
            enemyDeathSound.play();
            monster.remove();
            monsters.splice(monsters.indexOf(monsterData), 1);

            if (monsters.length === 0 && !waveComplete) {
                endWave();
                gold+=10
            }
        }
    });
}

function spawnBoss() {
    setTimeout(() => {
}, 3000);

    const boss = document.createElement('div');
    boss.className = 'boss';
    boss.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    boss.style.left = '-100px';

    const healthBar = document.createElement('div');
    healthBar.className = 'health-bar';

    const healthBarInner = document.createElement('div');
    healthBarInner.className = 'health-bar-inner';

    healthBar.appendChild(healthBarInner);
    boss.appendChild(healthBar);
    gameContainer.appendChild(boss);

    const bossHealth = 500 + waveNumber * 100;

    const bossData = {
        element: boss,
        health: bossHealth,
        maxHealth: bossHealth,
        position: 0,
        frozen: false,
        debuffed: false,
        isBoss: true,
    };
    monsters.push(bossData);

    boss.addEventListener('click', () => {
        let damage = calculateDamage(bossData, playerPower);
        enemyDamageSound.currentTime = 0;
        enemyDamageSound.play();
        if (Math.random() < critChance / 100) {
            damage *= 2;
            isCriticalStrike = true
        }

        showDamage(boss, damage);
        bossData.health -= damage;

        healthBarInner.style.width = (bossData.health / bossData.maxHealth) * 100 + '%';

        if (bossData.health <= 0) {
            score += gold*10;
            enemyDeathSound.play();
            boss.remove();
            monsters.splice(monsters.indexOf(bossData), 1);

            if (monsters.length === 0 && !waveComplete) {
                endWave();
            }
        }
    });
}

function calculateDamage(monster, baseDamage) {
    let damage = baseDamage;

    if (monster.isBoss) {
        if (currentCast === 'mage') {
            damage *= 1 + magePassiveBonus / 100;
        }

        if (currentCast === 'assassin') {
            damage *= 1 + assassinCritBonus.damage;
        }

        if (currentCast === 'berserker') {
            damage *= 1.5;
        }
    } else {
        if (currentCast === 'mage' && monster.frozen) {
            damage *= 1 + magePassiveBonus / 100;
        }

        if (currentCast === 'assassin' && monster.debuffed) {
            if (Math.random() < assassinInstantKillChance) {
                damage = monster.health;
            } else {
                damage *= 1 + assassinCritBonus.damage;
            }
        }

        if (currentCast === 'berserker') {
            damage *= 1;
        }
    }
    return damage;
}

function showDamage(monster, damage) {
    const damageIndicator = document.createElement('div');
    damageIndicator.className = 'damage-indicator';
    if (isCriticalStrike) {
        damageIndicator.textContent = `-${damage}`;
        damageIndicator.style.color = 'red';
        const critImage = document.createElement('img');
        critImage.src = 'crit.png';
        critImage.alt = 'Critical Hit!';
        critImage.style.width = '16px';
        critImage.style.marginLeft = '10px';
        damageIndicator.appendChild(critImage);
    } else {
        damageIndicator.textContent = `-${damage}`;
        damageIndicator.style.color = 'yellow'; 
    }

    const rect = monster.getBoundingClientRect();
    damageIndicator.style.left = `${rect.left + rect.width / 2}px`;
    damageIndicator.style.top = `${rect.top}px`;
    document.body.appendChild(damageIndicator);

    setTimeout(() => damageIndicator.remove(), 1000);
}

function updateMonsters() {
    for (let i = monsters.length - 1; i >= 0; i--) {
        const monster = monsters[i];
        if (monster.frozen) continue;

        monster.position += monsterSpeed;
        monster.element.style.left = monster.position + 'px';

        if (monster.position > window.innerWidth) {
            if (hp === 0) {
                gameOver();
                return;
            } else if (hp === 1) {
                hp = 0;
                monster.element.remove();
                monsters.splice(i, 1);
                if (monsters.length === 0) {
                    endWave();
                }
            }
        }
    }
}

function spawnWave() {
    setTimeout(() => {
        waveComplete = false;
    const isBossWave = waveNumber % 10 === 0;
    if (waveNumber > 50){
        document.getElementById('slow').style.display = "block";
    }
    if (isBossWave) {
    document.getElementById('game-container').style.background = "url(boss.webp) repeat"
    document.getElementById('game-container').style.transition = "2s ease"

    setTimeout(() => {
        spawnBoss();
        }, 3000);
    } else {
        let monsterCount = Math.ceil(waveNumber / 3);
        const extraHealth = waveNumber % 3 === 0 ? 0 : waveNumber * 10;
        if (assassin100) {
            monsterCount = Math.round(monsterCount*0.5)
        }
        monsterHelpCount = monsterCount
        for (let i = 0; i < monsterCount; i++) {
            setTimeout(() => {
                createMonster(extraHealth);
                
            }, i * 300);
        }
    }
    castUsedThisWave = false;
    }, 2000);
    
}


function endWave() {
    if (waveNumber === 100){
        if (currentCast === 'mage') {
            
                document.getElementById("mage100").style.display = 'block'
        }
        else if (currentCast === 'assassin') {
                document.getElementById("assassin100").style.display = 'block'
        }
    }
    waveComplete = true;
    hp=0
    document.getElementById('game-container').classList.remove('glow-border');
    document.getElementById('heart').style.display = "block"
    document.getElementById('points-gained').innerHTML = 
    `${score} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;
    document.getElementById('wave-summary').style.display = 'block';
}

function startNextWave() {
    waveNumber++;
    saveGameState()
    document.getElementById('wave-summary').style.display = 'none';
    document.getElementById('game-container').style.background = "url(secondBg.webp) repeat"
                    document.getElementById('game-container').style.transition = "2s ease"
        spawnWave();
    
}

function gameLoop() {
    updateMonsters();
    requestAnimationFrame(gameLoop);
}

function upgradePower() {
    if (score >= upgradeCosts.power) {
       
        score -= upgradeCosts.power;
        playerPower += 5;
        upgradeLevels.power++;
        upgradeCosts.power = Math.floor(upgradeCosts.power * 1.25);
        updateUpgradeUI();
    }
}

function upgradeCrit() {
    if (score >= upgradeCosts.crit) {
        score -= upgradeCosts.crit;
        critChance += 5;
        upgradeLevels.crit++;
        upgradeCosts.crit = Math.floor(upgradeCosts.crit * 1.5);
        updateUpgradeUI();
    }
}
function upgradeGold() {
    if (score >= upgradeCosts.gold) {
        score -= upgradeCosts.gold;
        goldB += 5;
        upgradeLevels.gold++;
        upgradeCosts.gold = Math.floor(upgradeCosts.gold * 1.5);
        updateUpgradeUI();
    }
}
function upgradeHp() {
    if (score >= upgradeCosts.hp && hp === 0) {
        score -= upgradeCosts.hp;
        hp=1
        upgradeLevels.hp++;
        upgradeCosts.hp = Math.floor(upgradeCosts.hp * 2.5);
        updateUpgradeUI();
        document.getElementById('heart').style.display = "none"
        document.getElementById('game-container').classList.add('glow-border');
    }
}

function upgradeSlow() {
    if (score >= upgradeCosts.slow && monsterSpeed >= 0.2) {
        score -= upgradeCosts.slow;
        monsterSpeed-=0.1
        upgradeLevels.slow++;
        upgradeCosts.slow = Math.floor(upgradeCosts.slow * 2);
        updateUpgradeUI();
    }
}

function showTab(tabId) {
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.style.display = 'none');

    const selectedTab = document.getElementById(`${tabId}-tab`);
    selectedTab.style.display = 'block';
    
    document.getElementById('skins-tab').addEventListener('click', updateSkinsTab);
}

function upgradeMage() {
    if (currentCast && currentCast !== 'mage') {
        alert('You can only choose one cast per game!');
        return;
    }
    document.getElementById("assassin").style.display = 'none'
    document.getElementById("berserk").style.display = 'none'
    document.getElementById("mageStats").style.display = 'inline'
    document.getElementById("mageL").style.display = 'block'
    
    if (score >= mageCost) {
        if (mageLevel === 0) {
            monsterSpeed -= 0.8
        }
        score -= mageCost;
        mageLevel++;
        mageCost = Math.ceil(mageCost * 1.5);
        currentCast = 'mage';
        document.body.style.cursor = "url(mage.png), auto";
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.cursor = "url(mage.png), auto";
        });
        if (mageLevel % 3 === 0) {
            mageFreezeTargets++;
        }
        updateUpgradeUI();
    }
}
function upgradeMageStat(){
    if (score >= mageCostStat) {
        score -= mageCostStat;
        mageLevelStat++;
        mageCostStat = Math.ceil(mageCostStat * 1.5);
        magePassiveBonus += 2.5;
    }
    updateUpgradeUI();
}
function upgradeAssassinStat(){
    if (score >= assassinCostStat) {
        score -= assassinCostStat;
        assassinLevelStat++;
        assassinCostStat = Math.ceil(assassinCostStat * 1.5);
        critChance += 5;
        assassinCritBonus.damage += 0.1;
    }
    updateUpgradeUI();
}

function upgradeAssassin() {
    if (currentCast && currentCast !== 'assassin') {
        alert('You can only choose one cast per game!');
        return;
    }

    document.getElementById("mage").style.display = 'none'
    document.getElementById("berserk").style.display = 'none'
    document.getElementById("assassinStat").style.display = 'inline'
    document.getElementById("assassinL").style.display = 'block'
    
    if (score >= assassinCost) {
        score -= assassinCost;
        assassinLevel++;
        assassinCost = Math.ceil(assassinCost * 1.5);
        currentCast = 'assassin';

        document.body.style.cursor = "url(assassin.png), auto";
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.cursor = "url(assassin.png), auto";
        });
        if (assassinLevel % 1 === 0) {
            assassinInstantKillChance += 0.02;
        }
        updateUpgradeUI();
    }
}

function mage100Stat() {
    if (score >= 500000) {
        score -= 500000;
        document.getElementById("mage100").style.display = 'none'
        mageFreezeTargets= Math.round(mageFreezeTargets*2)
    }
    updateUpgradeUI();
}

function upgradeAssassin100Stat() {
    if (score >= 500000) {
        score -= 500000;
        assassin100 = true
        document.getElementById("assassin100").style.display = 'none';
    }
    updateUpgradeUI();
}

function upgradeBerserkerStat(){
    if (score >= berserkerCostStat) {
        score -= berserkerCostStat;
        berserkerLevelStat++;
        berserkerCostStat = Math.ceil(berserkerCostStat * 1.5);
        y+=10
        playerPower += 10;
    }
    updateUpgradeUI();
}
function upgradeBerserker() {
    if (currentCast && currentCast !== 'berserker') {
        alert('You can only choose one cast per game!');
        return;
    }

    document.getElementById("mage").style.display = 'none'
    document.getElementById("assassin").style.display = 'none'
    document.getElementById("berserkStat").style.display = 'inline'
    document.getElementById("berserkL").style.display = 'block'

    if (score >= berserkerCost) {
        score -= berserkerCost;
        berserkerLevel++;
        berserkRage +=0.2
        berserkerCost = Math.ceil(berserkerCost * 1.5);
        currentCast = 'berserker';

        document.body.style.cursor = "url(berserk.png), auto";
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.cursor = "url(berserk.png), auto";
        });
        updateUpgradeUI();
    }
}

function freezeEnemies(targetCount) {
    const toFreeze = monsters.slice(0, targetCount);

    toFreeze.forEach(monster => {
        if (!monster.frozen) {
            monster.frozen = true;

            if (monster.isBoss) {
                monster.element.style.background = 'url(mage-boss.gif)';
            } else {
                monster.element.style.background = 'url(frozen_eye.png)';
            }

            monster.element.style.backgroundSize = 'cover';

            setTimeout(() => {
                monster.frozen = false;
                monster.element.style.background = '';
            }, 5000);
        }
    });
}

function applyAssassinDebuff() {
    monsters.forEach(monster => {
        if (!monster.debuffed) {
            monster.debuffed = true;
            if (monster.isBoss) {
                monster.element.style.background = 'url(assassin-boss.gif)';
            } else {
                monster.element.style.background = 'url(assassin_eye.png)';
            }

            setTimeout(() => {
                monster.debuffed = false;
                monster.element.style.background = '';
                monsterSpeed = monsterSpeedHelp
            }, 5000);
        }
    });
}

function activateBerserkerRage() {
    if (castUsedThisWave) return;
    dmg=playerPower
    if (currentCast === 'berserker') {
        
        playerPower *= berserkRage;
        monsters.forEach(monster => {
            if (!monster.debuffed) {
                monster.debuffed = true;
                if (monster.isBoss) {
                    monster.element.style.background = 'url(berserk-boss.gif)';
                } else {
                    monster.element.style.background = 'url(berserk_eye.png)';
                }
    
    
                setTimeout(() => {
                    monster.debuffed = false;
                    monster.element.style.background = '';
                    playerPower = dmg;
                    monsterSpeed = monsterSpeedHelp
                }, 2000);
            }
        });
        castUsedThisWave = true;
    }
}

function activateCast() {
    if (castUsedThisWave) return;

    if (currentCast === 'mage') {
        abilityMageSound.play()
        freezeEnemies(mageFreezeTargets);
    } else if (currentCast === 'assassin') {
        abilityAssassinSound.play()
        monsterSpeedHelp = monsterSpeed
        monsterSpeed -= 0.1
        applyAssassinDebuff();
    } else if (currentCast === 'berserker') {
        abilityBerserkerSound.play()
        monsterSpeedHelp = monsterSpeed
        monsterSpeed -= 0.1
        activateBerserkerRage();
    }
    castUsedThisWave = true;
}

document.addEventListener('keydown', (e) => {
    if (e.key === '1') {
        activateCast();
    }
});

document.getElementById('stats-tab').style.display = 'block';

function showTooltip(event, text) {
    tooltip.innerHTML = text;
    tooltip.style.left = `${event.pageX -600}px`;
    tooltip.style.top = `${event.pageY -120}px`; 
    tooltip.style.display = 'block';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

function updateUpgradeUI() {
    document.getElementById('power-upgrade-level').textContent = upgradeLevels.power;
    document.getElementById('power-upgrade-cost').innerHTML = 
    `${upgradeCosts.power} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

    document.getElementById('crit-upgrade-level').textContent = upgradeLevels.crit;
    document.getElementById('crit-upgrade-cost').innerHTML = 
    `${upgradeCosts.crit} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

    document.getElementById('gold-upgrade-level').textContent = upgradeLevels.gold;
    document.getElementById('gold-upgrade-cost').innerHTML = 
    `${upgradeCosts.gold} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

    document.getElementById('hp-upgrade-level').textContent = upgradeLevels.hp;
    document.getElementById('hp-upgrade-cost').innerHTML = 
    `${upgradeCosts.hp} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

    document.getElementById('slow-upgrade-level').textContent = upgradeLevels.slow;
    document.getElementById('slow-upgrade-cost').innerHTML = 
    `${upgradeCosts.slow} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

    document.getElementById('mage-level').textContent = mageLevel;
    document.getElementById('assassin-level').textContent = assassinLevel;
    document.getElementById('berserker-level').textContent = berserkerLevel;

    document.getElementById('mage-level-stat').textContent = mageLevelStat;
    document.getElementById('assassin-level-stat').textContent = assassinLevelStat;
    document.getElementById('berserker-level-stat').textContent = berserkerLevelStat;

    document.getElementById('mage-cost').innerHTML = 
    `${mageCost} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

    document.getElementById('assassin-cost').innerHTML = 
        `${assassinCost} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

    document.getElementById('berserker-cost').innerHTML = 
        `${berserkerCost} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;


    document.getElementById('mage-cost-stat').innerHTML = 
        `${mageCostStat} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;
    
    document.getElementById('assassin-cost-stat').innerHTML = 
        `${assassinCostStat} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;
    
    document.getElementById('berserker-cost-stat').innerHTML = 
        `${berserkerCostStat} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;


    document.getElementById('points-gained').innerHTML = 
        `${score} <img src="coin32.png" alt="Coin" style="width:16px; height:16px;">`;

}
function updateSkinsTab() {
    document.getElementById('next-wave-number').textContent = waveNumber;
    document.getElementById('monsters-hp').textContent = 100 + (waveNumber - 1) * 10;
    document.getElementById('monsterCount').textContent = monsterHelpCount;
    document.getElementById('gold-monster').textContent = gold+(gold*(goldB/100));
    
    document.getElementById('player-damage').textContent = playerPower;
    document.getElementById('player-crit-chance').textContent = critChance + '%';
    document.getElementById('player-crit-damage').textContent = (2+assassinCritBonus['damage']) + 'x';

    document.getElementById('selected-cast').innerHTML = 
    `${currentCast || 'None'} <img src="levelup.png" alt="Mouse Icon" style="width:16px; height:16px;">`;
    
    if (currentCast === 'mage') {
        document.getElementById('cast-buffs').style.display = 'block';
        document.getElementById('buff0-text').textContent = 'Slowing monsters';
        document.getElementById('buff0-value').textContent = -1 + 'Movement Speed';
        document.getElementById('buff1-text').textContent = 'Freeze Targets';
        document.getElementById('buff1-value').textContent = mageFreezeTargets;
        document.getElementById('buff2-text').textContent = 'Bonus Damage to frozen monsters';
        document.getElementById('buff2-value').textContent = magePassiveBonus + '%';
    } else if (currentCast === 'assassin') {
        document.getElementById('cast-buffs').style.display = 'block';
        document.getElementById('buff0-text').textContent = 'Chance to gain more gold';
        document.getElementById('buff0-value').textContent = 20 + '%';
        document.getElementById('buff1-text').textContent = 'Execute Kill Chance';
        document.getElementById('buff1-value').textContent = Math.round((assassinInstantKillChance * 100)) + '%';
        document.getElementById('buff2-text').textContent = 'Crit Bonus';
        document.getElementById('buff2-value').textContent = assassinCritBonus.damage + '%';
    } else if (currentCast === 'berserker') {
        document.getElementById('cast-buffs').style.display = 'block';
        document.getElementById('buff0-text').textContent = 'Power from moster kill';
        document.getElementById('buff0-value').textContent = x;
        document.getElementById('buff1-text').textContent = 'Rage Damage Multiplier';
        document.getElementById('buff1-value').textContent = Math.round(berserkRage) + 'x';
        document.getElementById('buff2-text').textContent = 'Bonus Damage';
        document.getElementById('buff2-value').textContent = y;
    } else {
        document.getElementById('cast-buffs').style.display = 'none';
    }
}
function startGame() {
    loadGameState();
    document.getElementById('start-overlay').style.display = 'none';
    document.getElementById('game-container').style.background = "url(mainBg.jpg) repeat"
    document.getElementById('game-container').style.transition = "2s ease"
    spawnWave();
    gameLoop();
}
function gameOver() {
    document.getElementById('game-over-overlay').style.display = 'flex';
    localStorage.clear();
}

function saveGameState() {
    const gameState = {
        score,
        gold,
        goldB,
        waveNumber,
        waveComplete,
        playerPower,
        critChance,
        hp,
        x,
        y,
        upgradeCosts,
        upgradeLevels,
        isCriticalStrike,
        currentCast,
        mageLevel,
        assassinLevel,
        berserkerLevel,
        mageLevelStat,
        assassinLevelStat,
        berserkerLevelStat,
        mageCostStat,
        assassinCostStat,
        berserkerCostStat,
        mageCost,
        assassinCost,
        berserkerCost,
        assassin100,
        monsterSpeed,
        mageFreezeTargets,
        assassinCritBonus,
        magePassiveBonus,
        berserkRage,
        castUsedThisWave,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);

        score = gameState.score;
        gold = gameState.gold;
        goldB = gameState.goldB;
        waveNumber = gameState.waveNumber;
        waveComplete = gameState.waveComplete;
        playerPower = gameState.playerPower;
        critChance = gameState.critChance;
        hp = gameState.hp;
        x = gameState.x;
        y = gameState.y;
        upgradeCosts = gameState.upgradeCosts;
        upgradeLevels = gameState.upgradeLevels;
        isCriticalStrike = gameState.isCriticalStrike;
        currentCast = gameState.currentCast;
        mageLevel = gameState.mageLevel;
        assassinLevel = gameState.assassinLevel;
        berserkerLevel = gameState.berserkerLevel;
        mageLevelStat = gameState.mageLevelStat;
        assassinLevelStat = gameState.assassinLevelStat;
        berserkerLevelStat = gameState.berserkerLevelStat;
        mageCostStat = gameState.mageCostStat;
        assassinCostStat = gameState.assassinCostStat;
        berserkerCostStat = gameState.berserkerCostStat;
        mageCost = gameState.mageCost;
        assassinCost = gameState.assassinCost;
        berserkerCost = gameState.berserkerCost;
        assassin100 = gameState.assassin100;
        monsterSpeed = gameState.monsterSpeed;
        mageFreezeTargets = gameState.mageFreezeTargets;
        assassinCritBonus = gameState.assassinCritBonus;
        magePassiveBonus = gameState.magePassiveBonus;
        berserkRage = gameState.berserkRage;
        castUsedThisWave = gameState.castUsedThisWave;
    }
}


setInterval(saveGameState, 5000);
window.addEventListener('beforeunload', saveGameState);

function saveGameState() {
    const gameState = {
        score,
        gold,
        goldB,
        waveNumber,
        waveComplete,
        playerPower,
        critChance,
        hp,
        x,
        y,
        upgradeCosts,
        upgradeLevels,
        isCriticalStrike,
        currentCast,
        mageLevel,
        assassinLevel,
        berserkerLevel,
        mageLevelStat,
        assassinLevelStat,
        berserkerLevelStat,
        mageCostStat,
        assassinCostStat,
        berserkerCostStat,
        mageCost,
        assassinCost,
        berserkerCost,
        assassin100,
        monsterSpeed,
        mageFreezeTargets,
        assassinCritBonus,
        magePassiveBonus,
        berserkRage,
        castUsedThisWave,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);

        score = gameState.score;
        gold = gameState.gold;
        goldB = gameState.goldB;
        waveNumber = gameState.waveNumber;
        waveComplete = gameState.waveComplete;
        playerPower = gameState.playerPower;
        critChance = gameState.critChance;
        hp = gameState.hp;
        x = gameState.x;
        y = gameState.y;
        upgradeCosts = gameState.upgradeCosts;
        upgradeLevels = gameState.upgradeLevels;
        isCriticalStrike = gameState.isCriticalStrike;
        currentCast = gameState.currentCast;
        mageLevel = gameState.mageLevel;
        assassinLevel = gameState.assassinLevel;
        berserkerLevel = gameState.berserkerLevel;
        mageLevelStat = gameState.mageLevelStat;
        assassinLevelStat = gameState.assassinLevelStat;
        berserkerLevelStat = gameState.berserkerLevelStat;
        mageCostStat = gameState.mageCostStat;
        assassinCostStat = gameState.assassinCostStat;
        berserkerCostStat = gameState.berserkerCostStat;
        mageCost = gameState.mageCost;
        assassinCost = gameState.assassinCost;
        berserkerCost = gameState.berserkerCost;
        assassin100 = gameState.assassin100;
        monsterSpeed = gameState.monsterSpeed;
        mageFreezeTargets = gameState.mageFreezeTargets;
        assassinCritBonus = gameState.assassinCritBonus;
        magePassiveBonus = gameState.magePassiveBonus;
        berserkRage = gameState.berserkRage;
        castUsedThisWave = gameState.castUsedThisWave;

        if (currentCast === 'mage') {
            document.body.style.cursor = "url(mage.png), auto";
        } else if (currentCast === 'assassin') {
            document.body.style.cursor = "url(assassin.png), auto";
        } else if (currentCast === 'berserker') {
            document.body.style.cursor = "url(berserk.png), auto";
        } else {
            document.body.style.cursor = "default";
        }
    }
}
window.addEventListener('beforeunload', saveGameState);
function restartGame() {
    location.reload();
}
