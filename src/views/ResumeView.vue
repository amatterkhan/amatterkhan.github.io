<script setup>
import ResumeAbout from '@/components/resume/ResumeAbout.vue'
import ResumeSkills from '@/components/resume/ResumeSkills.vue'
import ResumeWorkExp from '@/components/resume/ResumeWorkExp.vue';
import ResumeEducation from '@/components/resume/ResumeEducation.vue';
import ResumeCerts from '@/components/resume/ResumeCerts.vue';
</script>

<template>
  <div class="terminal-page w-full h-full overflow-auto">
    <div class="p-6 w-full">
      <a href="https://drive.google.com/file/d/1zOHswsF6g-j5tTBCMrsQ2p4YuOekCvEC/view?usp=sharing" target="_blank" rel="noopener noreferrer" class="download-link mb-4 p-2 rounded underline flex items-center inline-block transition-colors duration-200 font-terminal">
        <font-awesome-icon :icon="['fas', 'download']" class="mr-2" />
        Download PDF
      </a>
      <section>
        <ResumeAbout />
        <ResumeWorkExp />
        <ResumeEducation />
        <ResumeCerts />
      </section>
    </div>
  </div>
</template>

<style scoped>
.download-link {
  color: var(--color-text-primary);
}

.download-link:hover {
  color: var(--color-text-cyan);
}
</style>