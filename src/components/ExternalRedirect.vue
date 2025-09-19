<template>
  <div></div>
</template>

<script>
export default {
  name: 'ExternalRedirect',
  props: {
    url: {
      type: String,
      required: true
    }
  },
  mounted() {
    // Redirect to the external URL
    if (this.url) {
      window.location.href = this.url
    }
  }
}
</script>
