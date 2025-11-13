<script setup>
import { ref, computed, onMounted } from 'vue'

// Reference: Aug 18, 2025 (night shift, 5-day week)
const REFERENCE_DATE = new Date('2025-08-18')
const REFERENCE_IS_NIGHT = true
const REFERENCE_IS_5_DAY_WEEK = true

const WEEK_5_DAYS = [1, 2, 5, 6, 0] // Mon, Tue, Fri, Sat, Sun
const WEEK_2_DAYS = [3, 4] // Wed, Thu

const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())
const currentDate = ref(new Date())

function getWeekPattern(date) {
  const daysSinceReference = Math.floor((date - REFERENCE_DATE) / (1000 * 60 * 60 * 24))
  const weeksSinceReference = Math.floor(daysSinceReference / 7)
  return weeksSinceReference % 2 === 0 ? WEEK_5_DAYS : WEEK_2_DAYS
}

function isNightShift(date) {
  const monthDiff = (date.getFullYear() - REFERENCE_DATE.getFullYear()) * 12 + 
                    (date.getMonth() - REFERENCE_DATE.getMonth())
  return REFERENCE_IS_NIGHT ? monthDiff % 2 === 0 : monthDiff % 2 === 1
}

function isWorkDay(date) {
  return getWeekPattern(date).includes(date.getDay())
}

function getShiftType(date) {
  if (!isWorkDay(date)) return 'off'
  return isNightShift(date) ? 'night' : 'day'
}

const calendarDays = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()
  
  const days = []
  
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null)
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({
      date,
      day,
      isWorkDay: isWorkDay(date),
      shiftType: getShiftType(date),
      isToday: date.toDateString() === currentDate.value.toDateString()
    })
  }
  
  return days
})

// Month and year navigation
function previousMonth() {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
}

function nextMonth() {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
}

function goToToday() {
  const today = new Date()
  selectedMonth.value = today.getMonth()
  selectedYear.value = today.getFullYear()
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Get summary for current month
const monthSummary = computed(() => {
  const workDays = calendarDays.value.filter(day => day && day.isWorkDay)
  const nightShifts = workDays.filter(day => day.shiftType === 'night').length
  const dayShifts = workDays.filter(day => day.shiftType === 'day').length
  
  return {
    totalWorkDays: workDays.length,
    nightShifts,
    dayShifts,
    offDays: calendarDays.value.filter(day => day && !day.isWorkDay).length
  }
})
</script>

<template>
  <div class="terminal-page w-full h-full overflow-auto">
    <div class="p-4 md:p-6 w-full max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-terminal-green text-2xl md:text-3xl font-terminal mb-2 terminal-glow">
          > shift_calendar.sh
        </h1>
        <p class="text-terminal-content text-sm md:text-base">
          My Shift Schedule
        </p>
      </div>

      <!-- Month Navigation -->
      <div class="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-terminal-green p-4 bg-terminal-bg-secondary">
        <div class="flex items-center gap-4">
          <button
            @click="previousMonth"
            class="px-3 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all font-terminal"
          >
            &lt;
          </button>
          <h2 class="text-terminal-cyan text-xl md:text-2xl font-terminal">
            {{ monthNames[selectedMonth] }} {{ selectedYear }}
          </h2>
          <button
            @click="nextMonth"
            class="px-3 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all font-terminal"
          >
            &gt;
          </button>
        </div>
        <button
          @click="goToToday"
          class="px-4 py-2 border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-terminal-bg transition-all font-terminal text-sm"
        >
          Today
        </button>
      </div>

      <!-- Month Summary -->
      <div class="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="border border-terminal-green p-3 bg-terminal-bg-secondary">
          <div class="text-terminal-subtle text-xs mb-1">Total Work Days</div>
          <div class="text-terminal-green text-xl font-terminal">{{ monthSummary.totalWorkDays }}</div>
        </div>
        <div class="border border-terminal-cyan p-3 bg-terminal-bg-secondary">
          <div class="text-terminal-subtle text-xs mb-1">Night Shifts</div>
          <div class="text-terminal-cyan text-xl font-terminal">{{ monthSummary.nightShifts }}</div>
        </div>
        <div class="border border-terminal-yellow p-3 bg-terminal-bg-secondary">
          <div class="text-terminal-subtle text-xs mb-1">Day Shifts</div>
          <div class="text-terminal-yellow text-xl font-terminal">{{ monthSummary.dayShifts }}</div>
        </div>
        <div class="border border-terminal-green p-3 bg-terminal-bg-secondary">
          <div class="text-terminal-subtle text-xs mb-1">Off Days</div>
          <div class="text-terminal-content text-xl font-terminal">{{ monthSummary.offDays }}</div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="border border-terminal-green bg-terminal-bg-secondary p-4">
        <!-- Day Headers -->
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            class="text-center text-terminal-cyan text-xs md:text-sm font-terminal py-2"
          >
            {{ dayName }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="[
              'aspect-square border p-2 flex flex-col items-center justify-center transition-all',
              day ? {
                'border-terminal-green bg-terminal-bg': day.shiftType === 'night',
                'border-terminal-yellow bg-terminal-bg': day.shiftType === 'day',
                'border-terminal-green/30 bg-terminal-bg-secondary': day.shiftType === 'off',
                'ring-2 ring-terminal-cyan': day.isToday
              } : 'border-transparent'
            ]"
          >
            <template v-if="day">
              <div
                :class="[
                  'text-sm md:text-base font-terminal',
                  day.isToday ? 'text-terminal-cyan' : 'text-terminal-content'
                ]"
              >
                {{ day.day }}
              </div>
              <div
                v-if="day.isWorkDay"
                :class="[
                  'text-xs mt-1',
                  day.shiftType === 'night' ? 'text-terminal-green' : 'text-terminal-yellow'
                ]"
              >
                <font-awesome-icon 
                  :icon="day.shiftType === 'night' ? ['fas', 'moon'] : ['fas', 'sun']" 
                  class="text-sm"
                />
              </div>
              <div
                v-else
                class="text-xs mt-1 text-terminal-subtle font-terminal"
              >
                OFF
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 border border-terminal-green p-4 bg-terminal-bg-secondary">
        <h3 class="text-terminal-cyan text-lg font-terminal mb-3">> legend</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 border border-terminal-green bg-terminal-bg flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'moon']" class="text-terminal-green text-sm" />
            </div>
            <div class="text-terminal-content text-sm">
              <span class="text-terminal-green font-terminal">Moon</span> = Night Shift
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 border border-terminal-yellow bg-terminal-bg flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'sun']" class="text-terminal-yellow text-sm" />
            </div>
            <div class="text-terminal-content text-sm">
              <span class="text-terminal-yellow font-terminal">Sun</span> = Day Shift
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 border border-terminal-green/30 bg-terminal-bg-secondary"></div>
            <div class="text-terminal-content text-sm">
              <span class="text-terminal-subtle font-terminal">OFF</span> = Off Day
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-terminal-green/30">
          <p class="text-terminal-subtle text-xs">
            Week 1: Mon, Tue, Fri, Sat, Sun (5 days) | Week 2: Wed, Thu (2 days)
          </p>
          <p class="text-terminal-subtle text-xs mt-1">
            Shifts rotate monthly: 1 month Night → 1 month Day
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terminal-page {
  font-family: 'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.terminal-glow {
  text-shadow: 0 0 5px var(--color-primary);
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .aspect-square {
    min-height: 60px;
  }
}
</style>
