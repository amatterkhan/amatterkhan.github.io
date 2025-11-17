<script setup>
import { ref, computed, onMounted } from 'vue'

// Reference: Nov 24, 2025 (Monday, night shift, 5-day week)
const REFERENCE_DATE = new Date('2025-11-24')
const REFERENCE_IS_NIGHT = true

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
  const daysSinceReference = Math.floor((date - REFERENCE_DATE) / (1000 * 60 * 60 * 24))
  const weeksSinceReference = Math.floor(daysSinceReference / 7)
  const fourWeekPeriods = Math.floor(weeksSinceReference / 4)
  return REFERENCE_IS_NIGHT ? fourWeekPeriods % 2 === 0 : fourWeekPeriods % 2 === 1
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
  // Convert Sunday (0) to 6, Monday (1) to 0, etc. for Monday-first week
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  
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

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
    <div class="p-2 sm:p-4 md:p-6 w-full max-w-6xl mx-auto">
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
      <div class="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 border border-terminal-green p-2 sm:p-4 bg-terminal-bg-secondary">
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
      <div class="mb-4 sm:mb-6 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div class="border border-terminal-green p-3 bg-terminal-bg-secondary">
          <div class="text-terminal-subtle text-xs mb-1">Total Work Days</div>
          <div class="text-terminal-green text-xl font-terminal">{{ monthSummary.totalWorkDays }}</div>
        </div>
        <div class="border border-terminal-cyan p-3 bg-terminal-bg-secondary">
          <div class="flex items-center gap-2 mb-1">
            <font-awesome-icon :icon="['fas', 'moon']" class="text-terminal-green text-xs" />
            <div class="text-terminal-subtle text-xs">Night Shifts</div>
          </div>
          <div class="text-terminal-cyan text-xl font-terminal">{{ monthSummary.nightShifts }}</div>
        </div>
        <div class="border border-terminal-yellow p-3 bg-terminal-bg-secondary">
          <div class="flex items-center gap-2 mb-1">
            <font-awesome-icon :icon="['fas', 'sun']" class="text-terminal-yellow text-xs" />
            <div class="text-terminal-subtle text-xs">Day Shifts</div>
          </div>
          <div class="text-terminal-yellow text-xl font-terminal">{{ monthSummary.dayShifts }}</div>
        </div>
        <div class="border border-terminal-green p-3 bg-terminal-bg-secondary">
          <div class="text-terminal-subtle text-xs mb-1">Off Days</div>
          <div class="text-terminal-content text-xl font-terminal">{{ monthSummary.offDays }}</div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="border border-terminal-green bg-terminal-bg-secondary p-2 sm:p-4 overflow-x-auto">
        <!-- Day Headers -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2 min-w-[280px]">
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            class="text-center text-terminal-cyan text-xs font-terminal py-1 sm:py-2"
          >
            {{ dayName }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-1 sm:gap-2 min-w-[280px]">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            :class="[
              'aspect-square border p-1 sm:p-2 flex flex-col items-center justify-center transition-all min-w-0',
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
                  'text-xs sm:text-sm md:text-base font-terminal leading-tight',
                  day.isToday ? 'text-terminal-cyan' : 'text-terminal-content'
                ]"
              >
                {{ day.day }}
              </div>
              <div
                v-if="day.isWorkDay"
                :class="[
                  'text-[10px] sm:text-xs mt-0.5 sm:mt-1',
                  day.shiftType === 'night' ? 'text-terminal-green' : 'text-terminal-yellow'
                ]"
              >
                <font-awesome-icon 
                  :icon="day.shiftType === 'night' ? ['fas', 'moon'] : ['fas', 'sun']" 
                  class="text-[10px] sm:text-xs"
                />
              </div>
              <div
                v-else
                class="text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-terminal-subtle font-terminal"
              >
                OFF
              </div>
            </template>
          </div>
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
    min-height: 40px;
    max-height: 50px;
  }
}
</style>
