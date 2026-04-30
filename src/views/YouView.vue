<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const leftTulips = [
    { left: '4%',  bottom: '0px', h: 1.0,  delay: '0.05s', color1: '#3a5fa8', color2: '#7a96d4' },
    { left: '11%', bottom: '0px', h: 0.85, delay: '0.18s', color1: '#1f2d4a', color2: '#3a5fa8' },
    { left: '17%', bottom: '0px', h: 0.95, delay: '0.32s', color1: '#7a96d4', color2: '#a9c4e8' }
]
const rightTulips = [
    { right: '4%',  bottom: '0px', h: 1.0,  delay: '0.10s', color1: '#3a5fa8', color2: '#7a96d4' },
    { right: '11%', bottom: '0px', h: 0.92, delay: '0.24s', color1: '#7a96d4', color2: '#a9c4e8' },
    { right: '17%', bottom: '0px', h: 0.82, delay: '0.40s', color1: '#1f2d4a', color2: '#3a5fa8' }
]
const breathClusters = [
    { x: 50, y: 30 }, { x: 56, y: 40 }, { x: 64, y: 36 },
    { x: 60, y: 48 }, { x: 70, y: 44 }, { x: 46, y: 44 }
]

function starStyle(n) {
    const seed = (n * 9301 + 49297) % 233280
    const r1 = (seed / 233280)
    const r2 = ((seed * 7) % 233280) / 233280
    const r3 = ((seed * 13) % 233280) / 233280
    return {
        left: (r1 * 100).toFixed(2) + '%',
        top: (r2 * 60).toFixed(2) + '%',
        animationDelay: (r3 * 4).toFixed(2) + 's',
        animationDuration: (3 + r3 * 3).toFixed(2) + 's'
    }
}

const stage = ref('envelope') // 'envelope' | 'loading' | 'letter'
const sealCracking = ref(false)
const flapOpen = ref(false)
const loadingIndex = ref(0)
const walkerStarted = ref(false)
const heartParticles = ref([])
const sealBurst = ref([])
const alreadyOpened = ref(false)
const closing = ref(false)
let particleId = 0
let burstId = 0

const yearsAgo = computed(() => new Date().getFullYear() - 2001)

// Letter is permanently addressed to 1 May (her birthday), not "now".
const stamp = ref('1 May 2026')
function updateStamp() { /* no-op — kept stable */ }

const loadingLines = [
    'have a bit of patience, my Queen…',
    'you are the sun — it takes time to load such hotness ☼',
    'warming up the ink…',
    'telling the tulips to behave themselves…',
    'this letter was rewritten one thousand times before it got it right',
    'polishing the words for you, ya habibti…'
]
const LOADING_PER_LINE = 1400
const LOADING_TOTAL = LOADING_PER_LINE * loadingLines.length // ~8.4s

let loadingTimer = null
let stageTimer = null
let stampTimer = null
let walkerTimer = null

function clearTimers() {
    if (loadingTimer) { clearInterval(loadingTimer); loadingTimer = null }
    if (stageTimer)   { clearTimeout(stageTimer);   stageTimer = null }
    if (walkerTimer)  { clearTimeout(walkerTimer);  walkerTimer = null }
}

function startWalker() {
    walkerStarted.value = false
    nextTick(() => {
        walkerTimer = setTimeout(() => { walkerStarted.value = true }, 60)
    })
}

function showLetter() {
    stage.value = 'letter'
    nextTick(() => {
        walkerTimer = setTimeout(() => { walkerStarted.value = true }, 1400)
    })
}

function openEnvelope() {
    if (stage.value !== 'envelope' || sealCracking.value) return

    // Subsequent opens skip the loading screen — go straight to the letter.
    if (alreadyOpened.value) {
        flapOpen.value = true
        sealCracking.value = true
        setTimeout(() => { showLetter() }, 700)
        return
    }

    sealCracking.value = true
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8
        sealBurst.value.push({
            id: burstId++,
            dx: Math.cos(angle) * (40 + Math.random() * 20),
            dy: Math.sin(angle) * (40 + Math.random() * 20)
        })
    }
    setTimeout(() => { sealBurst.value = [] }, 900)
    setTimeout(() => { flapOpen.value = true }, 350)
    setTimeout(() => {
        stage.value = 'loading'
        loadingIndex.value = 0
        loadingTimer = setInterval(() => {
            loadingIndex.value = (loadingIndex.value + 1) % loadingLines.length
        }, LOADING_PER_LINE)
        stageTimer = setTimeout(() => {
            clearInterval(loadingTimer)
            loadingTimer = null
            alreadyOpened.value = true
            showLetter()
        }, LOADING_TOTAL)
    }, 1100)
}

function closeLetter() {
    if (closing.value) return
    closing.value = true
    walkerStarted.value = false
    setTimeout(() => {
        stage.value = 'envelope'
        flapOpen.value = false
        sealCracking.value = false
        closing.value = false
    }, 650)
}

function replayWalker() { startWalker() }

function spawnHearts(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 4
    const count = 2 + Math.floor(Math.random() * 2)
    for (let i = 0; i < count; i++) {
        const id = particleId++
        heartParticles.value.push({
            id,
            x: x + (Math.random() - 0.5) * 30,
            y,
            drift: (Math.random() - 0.5) * 80,
            delay: i * 80
        })
        setTimeout(() => {
            heartParticles.value = heartParticles.value.filter(p => p.id !== id)
        }, 1800 + i * 80)
    }
}

const mx = ref(0)
const my = ref(0)
function onMove(e) {
    const w = window.innerWidth
    const h = window.innerHeight
    mx.value = (e.clientX / w - 0.5) * 2
    my.value = (e.clientY / h - 0.5) * 2
}

onMounted(() => {
    updateStamp()
    stampTimer = setInterval(updateStamp, 30000)
    window.addEventListener('mousemove', onMove)
})

onUnmounted(() => {
    clearTimers()
    if (stampTimer) clearInterval(stampTimer)
    window.removeEventListener('mousemove', onMove)
})
</script>

<template>
    <div
        class="you-page"
        :style="{ '--mx': mx, '--my': my }"
    >
        <!-- Twilight backdrop with moon halo, sun, stars -->
        <div class="backdrop" aria-hidden="true">
            <div class="moon-halo"></div>

            <!-- Sun: rays in their own layer (rotate as a whole), face on top (static) -->
            <div class="sun-wrap" aria-hidden="true">
                <svg viewBox="-50 -50 100 100" class="sun-rays-svg">
                    <g stroke="#f4c66c" stroke-width="2.4" stroke-linecap="round">
                        <line x1="0" y1="-22" x2="0" y2="-30"/>
                        <line x1="0" y1="22"  x2="0" y2="30"/>
                        <line x1="-22" y1="0" x2="-30" y2="0"/>
                        <line x1="22"  y1="0" x2="30"  y2="0"/>
                        <line x1="-15" y1="-15" x2="-21" y2="-21"/>
                        <line x1="15"  y1="-15" x2="21"  y2="-21"/>
                        <line x1="-15" y1="15"  x2="-21" y2="21"/>
                        <line x1="15"  y1="15"  x2="21"  y2="21"/>
                    </g>
                </svg>
                <svg viewBox="-50 -50 100 100" class="sun-face-svg">
                    <defs>
                        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%"  stop-color="#fde6a8" stop-opacity="0.8"/>
                            <stop offset="50%" stop-color="#f4c66c" stop-opacity="0.25"/>
                            <stop offset="100%" stop-color="#f4c66c" stop-opacity="0"/>
                        </radialGradient>
                    </defs>
                    <circle cx="0" cy="0" r="44" fill="url(#sun-glow)"/>
                    <circle cx="0" cy="0" r="13" fill="#f7d57c" stroke="#c79334" stroke-width="1"/>
                    <path d="M-4 1 Q-2 4 0 1" stroke="#7a4d18" stroke-width="0.9" fill="none" stroke-linecap="round"/>
                    <circle cx="-4" cy="-2" r="0.9" fill="#7a4d18"/>
                    <circle cx="4"  cy="-2" r="0.9" fill="#7a4d18"/>
                </svg>
            </div>

            <div class="moon-wrap" aria-hidden="true">
                <svg viewBox="-50 -50 100 100" class="moon-svg">
                    <defs>
                        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%"  stop-color="#eaf1fb" stop-opacity="0.7"/>
                            <stop offset="60%" stop-color="#a9c4e8" stop-opacity="0.18"/>
                            <stop offset="100%" stop-color="#a9c4e8" stop-opacity="0"/>
                        </radialGradient>
                    </defs>
                    <circle cx="0" cy="0" r="38" fill="url(#moon-glow)"/>
                    <circle cx="0" cy="0" r="14" fill="#eaf1fb" stroke="#a9c4e8" stroke-width="1"/>
                    <circle cx="-4" cy="-3" r="2"   fill="#cdd9ec" opacity="0.75"/>
                    <circle cx="3"  cy="2"  r="1.5" fill="#cdd9ec" opacity="0.75"/>
                    <circle cx="5"  cy="-4" r="1"   fill="#cdd9ec" opacity="0.6"/>
                    <path d="M-4 5 Q-2 7 0 5" stroke="#3a5fa8" stroke-width="0.8" fill="none" stroke-linecap="round"/>
                </svg>
            </div>

            <div class="stars">
                <span v-for="n in 14" :key="n" class="star" :style="starStyle(n)"></span>
            </div>
            <svg class="grain" aria-hidden="true">
                <filter id="grain-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
                    <feColorMatrix values="0 0 0 0 0.9  0 0 0 0 0.93  0 0 0 0 1  0 0 0 0.18 0"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#grain-filter)"/>
            </svg>
        </div>

        <!-- Baby's breath sprigs -->
        <div class="breath-layer" aria-hidden="true">
            <svg class="breath breath-1" viewBox="0 0 120 80">
                <g stroke="#5d7aa3" stroke-width="0.7" fill="none" opacity="0.7">
                    <path d="M60 78 Q58 50 50 30"/>
                    <path d="M60 78 Q63 55 70 35"/>
                    <path d="M60 78 Q60 60 56 45"/>
                </g>
                <g v-for="(c, i) in breathClusters" :key="i" :transform="`translate(${c.x} ${c.y})`">
                    <circle v-for="p in 5" :key="p" :cx="Math.cos(p * 1.256) * 3" :cy="Math.sin(p * 1.256) * 3" r="1.6" fill="#dde7f5"/>
                    <circle cx="0" cy="0" r="1.2" fill="#f4f8ff"/>
                </g>
            </svg>
            <svg class="breath breath-2" viewBox="0 0 120 80">
                <g stroke="#5d7aa3" stroke-width="0.7" fill="none" opacity="0.7">
                    <path d="M60 78 Q56 55 46 32"/>
                    <path d="M60 78 Q64 56 72 36"/>
                    <path d="M60 78 Q60 58 58 40"/>
                </g>
                <g v-for="(c, i) in breathClusters" :key="'b'+i" :transform="`translate(${c.x} ${c.y})`">
                    <circle v-for="p in 5" :key="p" :cx="Math.cos(p * 1.256) * 3" :cy="Math.sin(p * 1.256) * 3" r="1.6" fill="#dde7f5"/>
                    <circle cx="0" cy="0" r="1.2" fill="#f4f8ff"/>
                </g>
            </svg>
            <svg class="breath breath-3" viewBox="0 0 120 80">
                <g stroke="#5d7aa3" stroke-width="0.7" fill="none" opacity="0.7">
                    <path d="M60 78 Q58 52 52 28"/>
                    <path d="M60 78 Q66 52 76 30"/>
                </g>
                <g v-for="(c, i) in breathClusters" :key="'c'+i" :transform="`translate(${c.x} ${c.y})`">
                    <circle v-for="p in 5" :key="p" :cx="Math.cos(p * 1.256) * 3" :cy="Math.sin(p * 1.256) * 3" r="1.6" fill="#dde7f5"/>
                    <circle cx="0" cy="0" r="1.2" fill="#f4f8ff"/>
                </g>
            </svg>
        </div>

        <!-- Tulips -->
        <div class="tulips tulips-left">
            <button
                v-for="(t, i) in leftTulips"
                :key="'lt'+i"
                class="tulip-btn"
                :style="{ left: t.left, bottom: t.bottom, '--h': t.h, '--delay': t.delay }"
                @click="spawnHearts"
                aria-label="A tulip"
            >
                <svg viewBox="0 0 60 160" class="tulip-svg">
                    <path d="M30 158 Q28 110 30 70" stroke="#4f7a8a" stroke-width="2.4" fill="none"/>
                    <path d="M30 122 Q14 112 10 92 Q22 100 30 116" fill="#3d6573" stroke="#2c4d59" stroke-width="1"/>
                    <path d="M30 70 Q14 60 16 38 Q22 28 30 30 Q38 28 44 38 Q46 60 30 70 Z" :fill="t.color1" stroke="#1f2d4a" stroke-width="1.2"/>
                    <path d="M30 30 Q26 38 24 58 Q28 64 30 64 Q32 64 36 58 Q34 38 30 30 Z" :fill="t.color2" opacity="0.85"/>
                    <path d="M30 30 Q28 22 26 18" stroke="#1f2d4a" stroke-width="1" fill="none"/>
                </svg>
            </button>
        </div>
        <div class="tulips tulips-right">
            <button
                v-for="(t, i) in rightTulips"
                :key="'rt'+i"
                class="tulip-btn"
                :style="{ right: t.right, bottom: t.bottom, '--h': t.h, '--delay': t.delay }"
                @click="spawnHearts"
                aria-label="A tulip"
            >
                <svg viewBox="0 0 60 160" class="tulip-svg">
                    <path d="M30 158 Q32 110 30 70" stroke="#4f7a8a" stroke-width="2.4" fill="none"/>
                    <path d="M30 122 Q46 112 50 92 Q38 100 30 116" fill="#3d6573" stroke="#2c4d59" stroke-width="1"/>
                    <path d="M30 70 Q14 60 16 38 Q22 28 30 30 Q38 28 44 38 Q46 60 30 70 Z" :fill="t.color1" stroke="#1f2d4a" stroke-width="1.2"/>
                    <path d="M30 30 Q26 38 24 58 Q28 64 30 64 Q32 64 36 58 Q34 38 30 30 Z" :fill="t.color2" opacity="0.85"/>
                    <path d="M30 30 Q28 22 26 18" stroke="#1f2d4a" stroke-width="1" fill="none"/>
                </svg>
            </button>
        </div>

        <!-- Centered scene -->
        <div class="scene">
            <!-- Envelope -->
            <transition name="env-fade">
                <div
                    v-if="stage === 'envelope'"
                    class="envelope-wrap"
                    :class="{ cracking: sealCracking, opened: flapOpen }"
                    @click="openEnvelope"
                    @keydown.enter="openEnvelope"
                    tabindex="0"
                    role="button"
                    aria-label="Open the envelope"
                >
                    <svg viewBox="0 0 320 220" class="envelope-svg">
                        <path d="M20 60 L160 60 L300 60 L300 200 L20 200 Z" fill="#eaf1fb" stroke="#1f2d4a" stroke-width="2"/>
                        <path d="M20 200 L160 130 L300 200" fill="#dbe5f3" stroke="#1f2d4a" stroke-width="1.4"/>
                        <g class="flap">
                            <path d="M20 60 L160 150 L300 60 Z" fill="#d4e0f1" stroke="#1f2d4a" stroke-width="2"/>
                        </g>
                    </svg>
                    <div class="seal" :class="{ cracking: sealCracking }">
                        <svg viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="26" fill="#3a5fa8" stroke="#1f2d4a" stroke-width="1.5"/>
                            <circle cx="30" cy="30" r="22" fill="none" stroke="#7a96d4" stroke-width="0.8" stroke-dasharray="2 2"/>
                            <text x="30" y="36" text-anchor="middle" font-size="14" font-weight="700" fill="#eaf1fb" font-family="Caveat, cursive">A♡S</text>
                        </svg>
                    </div>
                    <span
                        v-for="b in sealBurst"
                        :key="b.id"
                        class="seal-shard"
                        :style="{ '--dx': b.dx + 'px', '--dy': b.dy + 'px' }"
                    ></span>
                    <p class="hint">{{ alreadyOpened ? 'click to read again' : 'click to open' }}</p>
                </div>
            </transition>

            <!-- Loading overlay -->
            <transition name="fade">
                <div v-if="stage === 'loading'" class="loading">
                    <transition name="line" mode="out-in">
                        <p :key="loadingIndex" class="line">{{ loadingLines[loadingIndex] }}</p>
                    </transition>
                    <p class="dots"><span>.</span><span>.</span><span>.</span></p>
                </div>
            </transition>

            <!-- Letter -->
            <transition name="letter">
                <div v-if="stage === 'letter'" class="letter" :class="{ closing: closing }">
                    <div class="paper">
                        <!-- Decorative frame: corner flourishes + side ornaments -->
                        <svg class="frame" viewBox="0 0 600 800" preserveAspectRatio="none" aria-hidden="true">
                            <!-- outer thin border -->
                            <rect x="14" y="14" width="572" height="772" fill="none" stroke="#3a5fa8" stroke-width="0.7" opacity="0.55"/>
                            <rect x="20" y="20" width="560" height="760" fill="none" stroke="#3a5fa8" stroke-width="0.4" opacity="0.4" stroke-dasharray="1 3"/>
                            <!-- corner flourishes (top-left) -->
                            <g stroke="#3a5fa8" stroke-width="1" fill="none" opacity="0.75">
                                <path d="M20 56 Q32 38 56 36 Q70 36 76 30"/>
                                <path d="M28 50 Q40 46 52 50"/>
                                <circle cx="32" cy="44" r="1.2" fill="#3a5fa8"/>
                                <circle cx="40" cy="42" r="1"   fill="#3a5fa8"/>
                                <circle cx="48" cy="44" r="1.2" fill="#3a5fa8"/>
                                <!-- tiny tulip -->
                                <path d="M62 24 Q56 18 58 12 Q62 8 64 12 Q66 8 70 12 Q72 18 66 24 Z" fill="#7a96d4"/>
                                <path d="M64 24 Q64 30 62 36" stroke="#4f7a8a"/>
                            </g>
                            <!-- top-right -->
                            <g stroke="#3a5fa8" stroke-width="1" fill="none" opacity="0.75" transform="translate(600 0) scale(-1 1)">
                                <path d="M20 56 Q32 38 56 36 Q70 36 76 30"/>
                                <path d="M28 50 Q40 46 52 50"/>
                                <circle cx="32" cy="44" r="1.2" fill="#3a5fa8"/>
                                <circle cx="40" cy="42" r="1"   fill="#3a5fa8"/>
                                <circle cx="48" cy="44" r="1.2" fill="#3a5fa8"/>
                                <path d="M62 24 Q56 18 58 12 Q62 8 64 12 Q66 8 70 12 Q72 18 66 24 Z" fill="#7a96d4"/>
                                <path d="M64 24 Q64 30 62 36" stroke="#4f7a8a"/>
                            </g>
                            <!-- bottom-left -->
                            <g stroke="#3a5fa8" stroke-width="1" fill="none" opacity="0.75" transform="translate(0 800) scale(1 -1)">
                                <path d="M20 56 Q32 38 56 36 Q70 36 76 30"/>
                                <path d="M28 50 Q40 46 52 50"/>
                                <circle cx="32" cy="44" r="1.2" fill="#3a5fa8"/>
                                <circle cx="40" cy="42" r="1"   fill="#3a5fa8"/>
                                <circle cx="48" cy="44" r="1.2" fill="#3a5fa8"/>
                                <path d="M62 24 Q56 18 58 12 Q62 8 64 12 Q66 8 70 12 Q72 18 66 24 Z" fill="#7a96d4"/>
                                <path d="M64 24 Q64 30 62 36" stroke="#4f7a8a"/>
                            </g>
                            <!-- bottom-right -->
                            <g stroke="#3a5fa8" stroke-width="1" fill="none" opacity="0.75" transform="translate(600 800) scale(-1 -1)">
                                <path d="M20 56 Q32 38 56 36 Q70 36 76 30"/>
                                <path d="M28 50 Q40 46 52 50"/>
                                <circle cx="32" cy="44" r="1.2" fill="#3a5fa8"/>
                                <circle cx="40" cy="42" r="1"   fill="#3a5fa8"/>
                                <circle cx="48" cy="44" r="1.2" fill="#3a5fa8"/>
                                <path d="M62 24 Q56 18 58 12 Q62 8 64 12 Q66 8 70 12 Q72 18 66 24 Z" fill="#7a96d4"/>
                                <path d="M64 24 Q64 30 62 36" stroke="#4f7a8a"/>
                            </g>
                            <!-- top center scrollwork -->
                            <g stroke="#3a5fa8" stroke-width="1" fill="none" opacity="0.75">
                                <path d="M220 36 Q260 26 300 30 Q340 26 380 36"/>
                                <path d="M250 40 Q280 50 300 40 Q320 50 350 40"/>
                                <circle cx="300" cy="34" r="2.4" fill="#3a5fa8"/>
                            </g>
                            <!-- bottom center scrollwork -->
                            <g stroke="#3a5fa8" stroke-width="1" fill="none" opacity="0.75" transform="translate(0 800) scale(1 -1)">
                                <path d="M220 36 Q260 26 300 30 Q340 26 380 36"/>
                                <path d="M250 40 Q280 50 300 40 Q320 50 350 40"/>
                                <circle cx="300" cy="34" r="2.4" fill="#3a5fa8"/>
                            </g>
                        </svg>

                        <!-- close button -->
                        <button class="close-btn" @click="closeLetter" aria-label="Close letter">✕</button>

                        <!-- Top wax ribbon -->
                        <div class="ribbon" aria-hidden="true">
                            <svg viewBox="0 0 120 60">
                                <path d="M10 18 L60 6 L110 18 L100 30 L60 22 L20 30 Z" fill="#3a5fa8" stroke="#1f2d4a" stroke-width="1"/>
                                <circle cx="60" cy="34" r="14" fill="#7a96d4" stroke="#1f2d4a" stroke-width="1"/>
                                <text x="60" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="#eaf1fb" font-family="Caveat, cursive">A♡S</text>
                            </svg>
                        </div>

                        <header class="letter-head">
                            <div class="ar-to">إلى سامية</div>
                            <div class="dates">
                                <span class="date-line">{{ stamp }}</span>
                                <span class="date-line hijri">12 Dhul Qa'dah</span>
                            </div>
                        </header>

                        <h1 class="hello">Dear gentle reader,</h1>
                        <p class="addressee">my love, my heart, <em>my Zawja</em> —</p>

                        <p>One must beg your forgiveness, for this humble letter arrives to you not on hand-pressed parchment, nor borne by a courier bearing a velvet ribbon, but through the cold, glowing window of a screen. Were the choice entirely mine, you would hold its weight within your very hands; alas, the hour is late, and ink runs ever slower than light. I do hope you shall accept it, all the same.</p>

                        <p>
                            <span class="big">Happy birthday, my dearest Saamiyah !!</span>
                            On this very day, <span class="ink-acc">{{ yearsAgo }} years past</span>, the most loving soul in all the world drew her very first breath. I, regrettably, had not yet taken my own form — yet of one matter I remain wholly certain: our souls had already met long before, somewhere in the realm we call the <em>World of Souls</em>. Of this there can be no doubt, my dearest, for you are my soulmate, my everything, my only.
                        </p>

                        <p>
                            Were I to attempt the full account of my love for you, no letter could ever contain it — the ink would weep before the page allowed it. So permit me, then, only this: you have come ever so far, and may we go ever so much further, together. Every small step counts; every quiet kindness, every gentle change of heart. And — oh — you are far more than merely <em>a little</em> kind; you are a sweetheart in the truest, most thorough sense of the word. So do not, I beg of you, underestimate these little graces. Do not ignore them. Do not overlook them. You, my love, are simply the very best of all that exists — and that, dearest, is a truth you must <em>never</em>, ever forget. &lt;3
                        </p>

                        <footer class="sign">
                            <p>— yours, ever and always,</p>
                            <p>your devoted husband and bestfriend,</p>
                            <p class="name">Asad</p>
                            <p class="ar-from">من أسد</p>
                        </footer>

                        <!-- Walker scene: stickman + cat walks in to stickgirl, kisses her -->
                        <div class="walker-track">
                            <!-- Stickgirl (stationary, in middle) — wearing a hijab (face fully visible) -->
                            <div class="girl">
                                <svg viewBox="0 0 40 80" class="char-svg">
                                    <!-- Back drape of hijab: flows behind head and over shoulders -->
                                    <path d="M5 24 Q3 38 5 50 Q8 54 12 52 L13 38 Q12 30 11 26 Z"  fill="#3a5fa8" stroke="#1f2d4a" stroke-width="1.2"/>
                                    <path d="M29 24 Q31 38 29 50 Q26 54 22 52 L21 38 Q22 30 23 26 Z" fill="#3a5fa8" stroke="#1f2d4a" stroke-width="1.2"/>

                                    <!-- Hijab base: rounded fabric framing the face (head fully wrapped above forehead) -->
                                    <ellipse cx="17" cy="22" rx="11" ry="11" fill="#5a7eb9" stroke="#1f2d4a" stroke-width="1.4"/>

                                    <!-- Soft fold line across the forehead -->
                                    <path d="M9 16 Q17 13 25 16" stroke="#1f2d4a" stroke-width="0.5" fill="none" opacity="0.55"/>

                                    <!-- Face is fully visible: skin-toned oval inside the hijab opening -->
                                    <ellipse cx="17" cy="23" rx="6.5" ry="7" fill="#eaf1fb" stroke="#1f2d4a" stroke-width="1.2"/>

                                    <!-- Tiny pin/flower on the hijab beside her face -->
                                    <circle cx="9" cy="22" r="1.2" fill="#a9c4e8" stroke="#1f2d4a" stroke-width="0.35"/>
                                    <circle cx="9" cy="22" r="0.4" fill="#1f2d4a"/>

                                    <!-- Front hijab drape coming down over the chest -->
                                    <path d="M9.5 28 Q7 36 8 46 L13.5 44 Q13.5 36 12 30 Z"  fill="#5a7eb9" stroke="#1f2d4a" stroke-width="1.2"/>
                                    <path d="M24.5 28 Q27 36 26 46 L20.5 44 Q20.5 36 22 30 Z" fill="#5a7eb9" stroke="#1f2d4a" stroke-width="1.2"/>

                                    <!-- Eyes -->
                                    <circle cx="14.5" cy="22" r="0.9" fill="#1f2d4a"/>
                                    <circle cx="19.5" cy="22" r="0.9" fill="#1f2d4a"/>
                                    <!-- Lashes -->
                                    <line x1="13.6" y1="21" x2="12.9" y2="20.4" stroke="#1f2d4a" stroke-width="0.6" stroke-linecap="round"/>
                                    <line x1="20.4" y1="21" x2="21.1" y2="20.4" stroke="#1f2d4a" stroke-width="0.6" stroke-linecap="round"/>
                                    <!-- Smile -->
                                    <path d="M14 26 Q17 28 20 26" stroke="#1f2d4a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
                                    <!-- Blush -->
                                    <circle cx="13" cy="25" r="1.2" fill="#d99baa" opacity="0.6"/>
                                    <circle cx="21" cy="25" r="1.2" fill="#d99baa" opacity="0.6"/>
                                    <!-- Modest long dress (abaya style) — long, flowing, covers arms -->
                                    <path d="M9 38
                                             L25 38
                                             Q26 50 27 60
                                             Q29 70 30 76
                                             L4 76
                                             Q5 70 7 60
                                             Q8 50 9 38 Z" fill="#7a96d4" stroke="#1f2d4a" stroke-width="1.4"/>
                                    <!-- Subtle pleat / drape lines on dress -->
                                    <path d="M13 42 Q12 56 10 74" stroke="#5a7eb9" stroke-width="0.6" fill="none" opacity="0.6"/>
                                    <path d="M17 42 L17 74" stroke="#5a7eb9" stroke-width="0.6" fill="none" opacity="0.5"/>
                                    <path d="M21 42 Q22 56 24 74" stroke="#5a7eb9" stroke-width="0.6" fill="none" opacity="0.6"/>
                                    <!-- Decorative trim along neckline of abaya -->
                                    <path d="M11 40 Q17 42 23 40" stroke="#3a5fa8" stroke-width="0.9" fill="none"/>
                                    <!-- Hem trim -->
                                    <path d="M4 76 Q17 74 30 76" stroke="#3a5fa8" stroke-width="0.9" fill="none"/>
                                    <!-- Long sleeves (cover arms) -->
                                    <path d="M9 40 L4 50 Q4 52 6 52 L11 44 Z"  fill="#7a96d4" stroke="#1f2d4a" stroke-width="1.2"/>
                                    <path d="M25 40 L30 50 Q30 52 28 52 L23 44 Z" fill="#7a96d4" stroke="#1f2d4a" stroke-width="1.2"/>
                                    <!-- Hand peeking from sleeve, holding flower -->
                                    <circle cx="29" cy="51" r="1.6" fill="#eaf1fb" stroke="#1f2d4a" stroke-width="0.6"/>
                                    <!-- Tiny flower in her hand -->
                                    <g transform="translate(31.5 50.5)">
                                        <circle cx="0" cy="0" r="1.5" fill="#a9c4e8" stroke="#1f2d4a" stroke-width="0.4"/>
                                        <circle cx="-1.5" cy="0" r="1.1" fill="#a9c4e8" stroke="#1f2d4a" stroke-width="0.3"/>
                                        <circle cx="1.5" cy="0" r="1.1" fill="#a9c4e8" stroke="#1f2d4a" stroke-width="0.3"/>
                                        <circle cx="0" cy="-1.3" r="1.1" fill="#dde7f5" stroke="#1f2d4a" stroke-width="0.3"/>
                                    </g>
                                    <!-- Other hand peeking -->
                                    <circle cx="5" cy="51" r="1.6" fill="#eaf1fb" stroke="#1f2d4a" stroke-width="0.6"/>
                                    <!-- Shoes peeking from hem -->
                                    <path d="M11 76 Q14 78 16 76" stroke="#1f2d4a" stroke-width="1.6" fill="#1f2d4a"/>
                                    <path d="M18 76 Q20 78 23 76" stroke="#1f2d4a" stroke-width="1.6" fill="#1f2d4a"/>
                                </svg>
                            </div>

                            <!-- Asad + cat (static, holding hands with Saamiyah) -->
                            <div class="walker">
                                <svg viewBox="0 0 100 80" class="char-svg">
                                    <!-- cat next to him -->
                                    <g class="cat">
                                        <ellipse cx="14" cy="62" rx="12" ry="6" fill="#1f2d4a"/>
                                        <circle cx="6" cy="56" r="5" fill="#1f2d4a"/>
                                        <polygon points="2,52 4,46 7,52" fill="#1f2d4a"/>
                                        <polygon points="9,52 11,46 13,52" fill="#1f2d4a"/>
                                        <circle cx="4.5" cy="56" r="0.7" fill="#a9c4e8"/>
                                        <circle cx="7.5" cy="56" r="0.7" fill="#a9c4e8"/>
                                        <path class="cat-tail" d="M26 60 Q34 50 32 42" stroke="#1f2d4a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
                                        <line x1="10" y1="68" x2="10" y2="72" stroke="#1f2d4a" stroke-width="1.6"/>
                                        <line x1="18" y1="68" x2="18" y2="72" stroke="#1f2d4a" stroke-width="1.6"/>
                                    </g>
                                    <!-- Asad (stickman), facing right toward Saamiyah -->
                                    <g class="man" transform="translate(40 0)">
                                        <circle cx="14" cy="22" r="8" fill="#eaf1fb" stroke="#1f2d4a" stroke-width="2"/>
                                        <circle cx="11.5" cy="22" r="0.9" fill="#1f2d4a"/>
                                        <circle cx="16.5" cy="22" r="0.9" fill="#1f2d4a"/>
                                        <!-- soft smile -->
                                        <path d="M11 26 Q14 28 17 26" stroke="#1f2d4a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
                                        <!-- body -->
                                        <line x1="14" y1="30" x2="14" y2="54" stroke="#1f2d4a" stroke-width="2"/>
                                        <!-- left arm (down by side) -->
                                        <line x1="14" y1="36" x2="6"  y2="48" stroke="#1f2d4a" stroke-width="2" stroke-linecap="round"/>
                                        <!-- right arm: extended out to hold her hand (meets at SVG x≈40) -->
                                        <line x1="14" y1="36" x2="38" y2="44" stroke="#1f2d4a" stroke-width="2" stroke-linecap="round"/>
                                        <!-- legs (standing) -->
                                        <line x1="14" y1="54" x2="9"  y2="72" stroke="#1f2d4a" stroke-width="2" stroke-linecap="round"/>
                                        <line x1="14" y1="54" x2="19" y2="72" stroke="#1f2d4a" stroke-width="2" stroke-linecap="round"/>
                                    </g>
                                </svg>
                            </div>

                            <!-- Joined hands marker (between them) -->
                            <span class="joined-hands" aria-hidden="true">
                                <svg viewBox="0 0 20 20">
                                    <!-- two small clasped hand shapes -->
                                    <path d="M3 12 Q3 8 7 8 L9 10 L9 14 L7 16 Q3 16 3 12 Z"   fill="#eaf1fb" stroke="#1f2d4a" stroke-width="1"/>
                                    <path d="M17 12 Q17 8 13 8 L11 10 L11 14 L13 16 Q17 16 17 12 Z" fill="#eaf1fb" stroke="#1f2d4a" stroke-width="1"/>
                                    <path d="M9 11 Q10 12 11 11 M9 13 Q10 14 11 13" stroke="#1f2d4a" stroke-width="0.6" fill="none"/>
                                </svg>
                            </span>

                            <!-- Floating heart drifts up gently between them -->
                            <span class="kiss-heart">♡</span>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <!-- Floating heart particles from tulip clicks -->
        <span
            v-for="p in heartParticles"
            :key="p.id"
            class="heart-particle"
            :style="{
                left: p.x + 'px',
                top: p.y + 'px',
                '--drift': p.drift + 'px',
                animationDelay: p.delay + 'ms'
            }"
        >♡</span>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Reem+Kufi:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&display=swap');

.you-page {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: linear-gradient(180deg, #0b1a30 0%, #122a4a 55%, #13335c 100%);
    color: #1c2440;
    font-family: 'Caveat', 'Segoe Script', cursive;
    cursor: default;
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    width: 100dvw;
    -webkit-tap-highlight-color: transparent;
}

/* Backdrop */
.backdrop { position: absolute; inset: 0; pointer-events: none; }
.moon-halo {
    position: absolute;
    top: -8%; left: 50%;
    width: 60vmin; height: 60vmin;
    transform: translateX(-50%);
    background: radial-gradient(circle at 50% 50%, rgba(234,241,251,0.22) 0%, rgba(169,196,232,0.10) 35%, rgba(11,26,48,0) 65%);
    filter: blur(4px);
}
.sun-wrap, .moon-wrap {
    position: absolute;
    width: 13vmin; height: 13vmin;
    min-width: 64px; min-height: 64px;
    pointer-events: none;
    text-align: center;
}
.sun-wrap {
    top: 6%; right: 7%;
    transform: translate(calc(var(--mx, 0) * -4px), calc(var(--my, 0) * -3px));
    transition: transform 0.5s ease;
    filter: drop-shadow(0 0 10px rgba(244,198,108,0.45));
}
.moon-wrap {
    top: 6%; left: 7%;
    transform: translate(calc(var(--mx, 0) * 4px), calc(var(--my, 0) * -3px));
    transition: transform 0.5s ease;
    filter: drop-shadow(0 0 10px rgba(169,196,232,0.4));
}
.moon-svg { width: 100%; height: 100%; display: block; overflow: visible; }
/* Two-layer sun: rays SVG rotates as a whole; face SVG sits on top, static. */
.sun-rays-svg, .sun-face-svg {
    position: absolute;
    inset: 0;
    width: 100%; height: 100%;
    display: block;
    overflow: visible;
}
.sun-rays-svg {
    animation: sun-spin 30s linear infinite;
    transform-origin: 50% 50%;
}
@keyframes sun-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}

.stars { position: absolute; inset: 0; }
.star {
    position: absolute;
    width: 2px; height: 2px;
    background: #eaf1fb;
    border-radius: 50%;
    opacity: 0.7;
    animation: twinkle 4s ease-in-out infinite;
    box-shadow: 0 0 4px rgba(234,241,251,0.7);
}
@keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50%      { opacity: 1; transform: scale(1.1); }
}
.grain {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    opacity: 0.35;
    mix-blend-mode: soft-light;
}

/* Baby's breath */
.breath-layer { position: absolute; inset: 0; pointer-events: none; }
.breath {
    position: absolute;
    width: 18vmin; height: 12vmin;
    filter: drop-shadow(0 0 2px rgba(221,231,245,0.6));
    opacity: 0;
    --scale: 1;
    animation:
        breath-fade 1.4s ease-out forwards,
        breath-float 6s ease-in-out infinite;
}
.breath-1 { top: 8%;  left: 22%; animation-delay: 0.4s, 1.4s; }
.breath-2 { top: 14%; left: 60%; animation-delay: 0.7s, 1.7s; --scale: 0.9; }
.breath-3 { top: 22%; left: 40%; animation-delay: 1.0s, 2.0s; --scale: 0.8; }
@keyframes breath-fade { from { opacity: 0; } to { opacity: 0.95; } }
@keyframes breath-float {
    0%, 100% { transform: translate(calc(var(--mx, 0) * -6px), -2px) scale(var(--scale)); }
    50%      { transform: translate(calc(var(--mx, 0) * -6px),  4px) scale(var(--scale)); }
}

/* Tulips */
.tulips { position: absolute; bottom: 0; height: 38vmin; pointer-events: none; }
.tulips-left  { left: 0;  width: 26vw; }
.tulips-right { right: 0; width: 26vw; }
.tulip-btn {
    position: absolute;
    background: none; border: 0; padding: 0; cursor: pointer;
    pointer-events: auto;
    transform-origin: bottom center;
    transform: translate(calc(var(--mx, 0) * 4px), calc(var(--my, 0) * -3px));
    transition: transform 0.5s ease;
}
.tulip-btn:focus-visible { outline: 2px dashed #a9c4e8; outline-offset: 2px; }
.tulip-svg {
    width: calc(10vmin * var(--h, 1));
    height: calc(28vmin * var(--h, 1));
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.35));
    transform-origin: bottom center;
    transform: scaleY(0);
    animation: grow 1.2s cubic-bezier(.2,.8,.2,1) forwards;
    animation-delay: var(--delay, 0s);
    transition: transform 0.4s ease;
}
.tulip-btn:hover .tulip-svg { transform: scaleY(1) rotate(-3deg) translateY(-4px); }
@keyframes grow {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
}

/* Scene + envelope */
.scene {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
    padding: 4vmin;
}
.envelope-wrap {
    position: relative;
    width: min(420px, 70vw);
    aspect-ratio: 320 / 220;
    pointer-events: auto;
    cursor: pointer;
    transform: translate(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * -4px)) rotate(-1deg);
    transition: transform 0.35s ease;
    filter: drop-shadow(0 12px 30px rgba(0,0,0,0.45));
}
.envelope-wrap:hover { transform: translate(calc(var(--mx, 0) * -8px), calc(var(--my, 0) * -6px)) rotate(-2deg); }
.envelope-wrap:focus-visible { outline: 2px dashed #a9c4e8; outline-offset: 6px; border-radius: 8px; }
.envelope-svg { width: 100%; height: 100%; display: block; }
.envelope-svg .flap {
    transform-origin: 50% 33%;
    transition: transform 0.7s cubic-bezier(.4,1.4,.5,1);
}
.envelope-wrap.opened .envelope-svg .flap { transform: rotateX(180deg); }

.seal {
    position: absolute;
    top: 36%; left: 50%;
    width: 18%;
    transform: translate(-50%, -50%);
    transition: transform 0.4s ease;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
}
.seal svg { width: 100%; height: 100%; display: block; }
.envelope-wrap:hover .seal:not(.cracking) { animation: seal-pulse 1.2s ease-in-out infinite; }
.seal.cracking { animation: seal-crack 0.5s ease-out forwards; }
@keyframes seal-pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50%      { transform: translate(-50%, -50%) scale(1.06); }
}
@keyframes seal-crack {
    0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50%  { transform: translate(-50%, -50%) scale(1.4) rotate(8deg); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(2.2) rotate(-12deg); opacity: 0; }
}
.seal-shard {
    position: absolute;
    top: 36%; left: 50%;
    width: 6px; height: 6px;
    background: #3a5fa8;
    border-radius: 50%;
    pointer-events: none;
    animation: shard 0.85s ease-out forwards;
}
@keyframes shard {
    from { transform: translate(-50%, -50%) translate(0,0); opacity: 1; }
    to   { transform: translate(-50%, -50%) translate(var(--dx), var(--dy)); opacity: 0; }
}
.hint {
    position: absolute;
    bottom: -2.4em; left: 50%;
    transform: translateX(-50%);
    color: #a9c4e8;
    font-size: 1.4rem;
    letter-spacing: 1px;
    margin: 0;
    animation: hint-pulse 2s ease-in-out infinite;
    white-space: nowrap;
}
@keyframes hint-pulse {
    0%, 100% { opacity: 0.5; }
    50%      { opacity: 1; }
}

/* Loading */
.loading {
    position: relative;
    pointer-events: auto;
    color: #eaf1fb;
    font-size: clamp(1.4rem, 2.6vw, 2rem);
    text-align: center;
    width: min(620px, 86vw);
    padding: 1.5rem 1rem;
    background: rgba(11,26,48,0.55);
    border: 1px solid rgba(169,196,232,0.25);
    border-radius: 14px;
    backdrop-filter: blur(6px);
}
.loading .line { margin: 0.4em 0; min-height: 1.6em; }
.loading .dots {
    display: inline-flex;
    gap: 4px;
    margin: 0.4em 0 0;
    color: #a9c4e8;
    font-size: 1.6rem;
    line-height: 1;
}
.loading .dots span { animation: dot-blink 1.2s ease-in-out infinite; }
.loading .dots span:nth-child(2) { animation-delay: 0.2s; }
.loading .dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-blink {
    0%, 80%, 100% { opacity: 0.2; }
    40%           { opacity: 1; }
}

/* ─── Letter ─── */
.letter {
    position: absolute; inset: 0;
    display: flex;
    align-items: flex-start; /* allow scroll for tall content; vertical center via margin auto */
    justify-content: center;
    padding: 4vmin;
    pointer-events: auto;
    overflow-y: auto;
    overflow-x: hidden;
}
.letter.closing .paper {
    animation: letter-fold 0.65s cubic-bezier(.4,.1,.6,1) forwards;
}
@keyframes letter-fold {
    0%   { opacity: 1; transform: rotate(-0.5deg) translateY(0) scale(1); }
    100% { opacity: 0; transform: rotate(-2deg) translateY(80px) scale(0.5); }
}

.paper {
    position: relative;
    width: clamp(320px, 70vw, 760px);
    margin: auto; /* vertical-centre when fits, scroll when too tall */
    /* aged-paper gradient with vignette */
    background:
        radial-gradient(ellipse 110% 90% at 50% 50%, rgba(255,255,255,0) 50%, rgba(31,45,74,0.10) 100%),
        radial-gradient(circle at 18% 22%, rgba(192,158,108,0.08) 0%, rgba(192,158,108,0) 35%),
        radial-gradient(circle at 84% 78%, rgba(122,150,212,0.10) 0%, rgba(122,150,212,0) 35%),
        linear-gradient(180deg, #f0e7d6 0%, #ece2cf 55%, #e7dac3 100%);
    color: #2a2418;
    padding: clamp(2.6rem, 5vw, 4.4rem) clamp(1.2rem, 3vw, 2.6rem) clamp(3.4rem, 5vw, 5.5rem);
    border-radius: 6px;
    transform: rotate(-0.5deg);
    box-shadow:
        0 30px 70px rgba(0,0,0,0.55),
        0 0 0 1px rgba(31,45,74,0.18) inset,
        0 0 60px rgba(169,196,232,0.18);
    line-height: 1.6;
    font-size: clamp(1rem, 1.4vw + 0.4rem, 1.4rem);
}
.paper::before {
    /* subtle paper-grain overlay */
    content: '';
    position: absolute; inset: 0;
    background-image:
        repeating-linear-gradient(0deg,
            transparent 0,
            transparent 31px,
            rgba(31,36,64,0.06) 31px,
            rgba(31,36,64,0.06) 32px);
    pointer-events: none;
    border-radius: 6px;
}
.paper::after {
    /* deckle-like inner edge */
    content: '';
    position: absolute; inset: 6px;
    border: 1px dashed rgba(122,77,24,0.25);
    pointer-events: none;
    border-radius: 4px;
}
.frame {
    position: absolute; inset: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    pointer-events: none;
    opacity: 0.85;
}

.ribbon {
    position: absolute;
    top: -22px; left: 50%;
    transform: translateX(-50%) rotate(0.5deg);
    width: 110px;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
    z-index: 2;
}
.ribbon svg { width: 100%; height: auto; display: block; }

.close-btn {
    position: absolute;
    top: 0.5rem; right: 0.6rem;
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(31,45,74,0.3);
    background: rgba(234,241,251,0.6);
    color: #1f2d4a;
    font-family: 'Caveat', cursive;
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
    z-index: 3;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
}
.close-btn:hover { background: #3a5fa8; color: #eaf1fb; transform: scale(1.08); }

.letter-head {
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.6rem;
    margin-top: 0.6rem;
    font-size: 0.95rem;
    color: #4f6488;
    font-family: 'Cormorant Garamond', serif;
}
.ar-to, .ar-from {
    font-family: 'Reem Kufi', sans-serif;
    font-size: 1.7rem;
    color: #3a5fa8;
    letter-spacing: 0.5px;
}
.ar-from { margin-top: 0.4rem; opacity: 0.9; }
.dates {
    display: flex; flex-direction: column; align-items: flex-end;
    gap: 0.1em;
    font-style: italic;
}
.date-line { font-size: 1rem; opacity: 0.85; }
.date-line.hijri { font-family: 'Cormorant Garamond', serif; color: #6c5635; opacity: 0.95; }

.hello {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.5rem, 3vw, 2.4rem);
    font-weight: 700;
    font-style: italic;
    margin: 0.2em 0 0.2em;
    color: #1f2d4a;
    text-align: center;
    letter-spacing: 0.5px;
}
.addressee {
    text-align: center;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: clamp(1.15rem, 2vw, 1.55rem);
    color: #3a5fa8;
    margin: 0 0 1em !important;
}
.addressee em { font-family: 'Reem Kufi', 'Cormorant Garamond', serif; font-style: italic; color: #3a5fa8; font-weight: 700; }
.hello::after {
    content: '✦';
    display: block;
    margin: 0.15em auto 0;
    font-size: 0.85rem;
    color: #c79334;
    letter-spacing: 1em;
    text-indent: 1em;
}
.paper p { margin: 0 0 1em; }
.big { font-size: 1.4em; font-weight: 700; color: #3a5fa8; font-family: 'Cormorant Garamond', serif; font-style: italic; display: inline-block; margin-right: 0.2em; }
.ink-acc { color: #3a5fa8; font-weight: 700; }
.aside { font-style: italic; color: #6c5635; }
.sign { margin-top: 1.4em; }
.sign p { margin: 0; }
.sign .name { font-size: 1.9rem; font-weight: 700; color: #1f2d4a; margin-top: 0.1em; }

.replay {
    position: absolute;
    right: 1rem; bottom: 0.8rem;
    background: rgba(234,241,251,0.6);
    border: 1px solid rgba(31,45,74,0.25);
    color: #4f6488;
    padding: 0.2em 0.7em;
    border-radius: 999px;
    font-family: 'Caveat', cursive;
    font-size: 1rem;
    cursor: pointer;
    z-index: 3;
}
.replay:hover { background: rgba(58,95,168,0.18); color: #1f2d4a; }

/* ─── Walker scene ─── */
.walker-track {
    position: relative;
    margin-top: 2rem;
    height: 90px;
    pointer-events: none;
    overflow: visible;
}
.walker, .girl {
    position: absolute;
    bottom: 0;
    width: 100px; height: 80px;
}
.char-svg { width: 100%; height: 100%; display: block; }
.girl {
    left: 52%;
    width: 60px; height: 80px;
    transform: scaleX(-1); /* she faces the man */
}

.walker {
    left: -110px;
}
.walker.go { animation: walk-in 5.5s cubic-bezier(.4,.2,.2,1) forwards; }
@keyframes walk-in {
    0%   { left: -110px; }
    72%  { left: calc(52% - 56px); }
    100% { left: calc(52% - 56px); }
}

.walker .leg-l, .walker .leg-r { transform-origin: 14px 54px; }
.walker.go .leg-l { animation: leg-l 0.5s steps(2) infinite; }
.walker.go .leg-r { animation: leg-r 0.5s steps(2) infinite; }
@keyframes leg-l { 0% { transform: rotate(20deg);} 100% { transform: rotate(-20deg);} }
@keyframes leg-r { 0% { transform: rotate(-20deg);} 100% { transform: rotate(20deg);} }
.walker .arm-l, .walker .arm-r { transform-origin: 14px 36px; }
.walker.go .arm-l { animation: arm-l 0.5s steps(2) infinite; }
.walker.go .arm-r { animation: arm-r 0.5s steps(2) infinite; }
@keyframes arm-l { 0% { transform: rotate(-15deg);} 100% { transform: rotate(15deg);} }
@keyframes arm-r { 0% { transform: rotate(15deg);} 100% { transform: rotate(-15deg);} }
.walker .cat-tail { transform-origin: 26px 60px; }
.walker.go .cat-tail { animation: tail 0.6s ease-in-out infinite; }
@keyframes tail {
    0%, 100% { transform: rotate(0deg); }
    50%      { transform: rotate(-15deg); }
}
/* When walker stops, lean toward the girl */
.walker.go .man { animation: lean 1s ease-out 3.5s forwards; transform-origin: 14px 54px; }
@keyframes lean {
    0%   { transform: translate(40px, 0) rotate(0deg); }
    100% { transform: translate(46px, -2px) rotate(-12deg); }
}
/* girl tilts head toward him at the same time */
.girl { transition: transform 0.4s ease; }
.walker.go ~ .girl,
.walker-track .walker.go + .girl { /* fallback selector */ }

/* Kiss heart between man and girl */
.kiss-heart {
    position: absolute;
    bottom: 56px;
    left: calc(52% + 14px);
    color: #d99baa;
    font-size: 1.6rem;
    opacity: 0;
    text-shadow: 0 0 8px rgba(217,155,170,0.6);
    pointer-events: none;
}
.kiss-heart.go { animation: kiss-rise 1.6s ease-out 4.0s forwards; }
@keyframes kiss-rise {
    0%   { opacity: 0; transform: translateY(0) scale(0.6); }
    20%  { opacity: 1; transform: translateY(-6px) scale(1); }
    100% { opacity: 0; transform: translateY(-44px) scale(1.4); }
}

/* Heart particles (tulip clicks) */
.heart-particle {
    position: fixed;
    color: #a9c4e8;
    font-size: 1.4rem;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: heart-rise 1.6s ease-out forwards;
    text-shadow: 0 0 8px rgba(169,196,232,0.6);
}
@keyframes heart-rise {
    0%   { opacity: 0; transform: translate(-50%, -50%) translateY(0) scale(0.6); }
    20%  { opacity: 1; transform: translate(-50%, -50%) translateY(-10px) scale(1); }
    100% { opacity: 0; transform: translate(-50%, calc(-50% - 80px)) translateX(var(--drift, 0)) scale(0.7); }
}

/* Vue transitions */
.env-fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.env-fade-leave-to { opacity: 0; transform: scale(0.94); }
.env-fade-enter-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.env-fade-enter-from { opacity: 0; transform: scale(0.92); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.line-enter-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.line-leave-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.line-enter-from { opacity: 0; transform: translateY(8px); }
.line-leave-to   { opacity: 0; transform: translateY(-8px); }

.letter-enter-active { transition: opacity 0.7s ease, transform 0.8s cubic-bezier(.2,.9,.2,1.1); }
.letter-enter-from { opacity: 0; transform: translateY(40px) scale(0.92); }

/* ─── Mobile ─── */
@media (max-width: 900px) {
    .envelope-wrap { width: min(380px, 78vw); }
    .paper { font-size: clamp(1rem, 1.6vw, 1.25rem); padding: 4rem 2rem 5rem; }
    .sun-wrap, .moon-wrap { width: 11vmin; height: 11vmin; }
}

@media (max-width: 640px) {
    .tulips-left, .tulips-right { width: 36vw; height: 32vmin; }
    .tulip-svg {
        width: calc(11vmin * var(--h, 1));
        height: calc(28vmin * var(--h, 1));
    }
    .tulips-left .tulip-btn:nth-child(1)  { left: 1% !important; }
    .tulips-left .tulip-btn:nth-child(2)  { left: 11% !important; }
    .tulips-left .tulip-btn:nth-child(3)  { left: 22% !important; }
    .tulips-right .tulip-btn:nth-child(1) { right: 1% !important; }
    .tulips-right .tulip-btn:nth-child(2) { right: 11% !important; }
    .tulips-right .tulip-btn:nth-child(3) { right: 22% !important; }

    .envelope-wrap { width: min(340px, 84vw); }
    .hint { font-size: 1.15rem; bottom: -2em; }

    .breath { width: 22vmin; height: 14vmin; }
    .breath-1 { top: 6%;  left: 14%; }
    .breath-2 { top: 12%; left: 58%; }
    .breath-3 { top: 20%; left: 36%; }

    .moon-halo { width: 70vmin; height: 70vmin; }
    .sun-wrap  { top: 4%; right: 4%; width: 56px; height: 56px; }
    .moon-wrap { top: 4%; left: 4%; width: 56px; height: 56px; }
    .sun-label, .moon-label { font-size: 0.85rem; }

    .loading {
        font-size: clamp(1.1rem, 4.6vw, 1.6rem);
        width: min(520px, 90vw);
        padding: 1.2rem 0.9rem;
    }

    .letter { padding: 2vmin; }
    .paper {
        width: clamp(280px, 94vw, 520px);
        padding: 3rem 1.1rem 4.8rem;
        font-size: 1rem;
        line-height: 1.5;
    }
    .ribbon { width: 84px; top: -16px; }
    .hello { font-size: 1.7rem; }
    .ar-to, .ar-from { font-size: 1.3rem; }
    .sign .name { font-size: 1.55rem; }
    .big { font-size: 1.25em; }
    .date-line.hijri { font-size: 0.85rem; }

    .walker-track { height: 80px; margin-top: 1.4rem; }
    .walker { width: 88px; height: 70px; left: -88px; }
    .girl { width: 50px; height: 70px; }
    @keyframes walk-in {
        0%   { left: -88px; }
        72%  { left: calc(52% - 50px); }
        100% { left: calc(52% - 50px); }
    }

    .replay { right: 0.5rem; bottom: 0.4rem; font-size: 0.92rem; }
    .close-btn { top: 0.4rem; right: 0.4rem; width: 26px; height: 26px; font-size: 1rem; }
}

@media (max-width: 380px) {
    .envelope-wrap { width: 86vw; }
    .paper { padding: 3rem 1rem 5rem; font-size: 0.98rem; }
    .hello { font-size: 1.4rem; }
    .letter-head { font-size: 0.85rem; }
    .ar-to, .ar-from { font-size: 1.1rem; }
    .sign .name { font-size: 1.4rem; }
    .ribbon { width: 70px; }
}

@media (max-height: 560px) and (orientation: landscape) {
    .paper {
        padding: 3rem 1.4rem 4.8rem;
        font-size: 0.95rem;
    }
    .hello { font-size: 1.4rem; }
    .tulips { height: 26vmin; }
    .moon-halo { top: -20%; width: 50vmin; height: 50vmin; }
    .breath { width: 14vmin; height: 9vmin; }
    .sun-wrap, .moon-wrap { width: 50px; height: 50px; }
    .ribbon { width: 80px; top: -14px; }
}

@media (prefers-reduced-motion: reduce) {
    .star, .breath, .tulip-btn:hover .tulip-svg,
    .walker.go, .walker.go .leg-l, .walker.go .leg-r,
    .walker.go .arm-l, .walker.go .arm-r,
    .walker.go .cat-tail, .walker.go .man, .kiss-heart.go,
    .seal, .heart-particle, .loading .dots span, .sun-rays-svg {
        animation-duration: 0.001s !important;
        animation-iteration-count: 1 !important;
    }
    .tulip-btn { transform: none !important; }
    .tulip-svg { transform: scaleY(1) !important; }
}
</style>
