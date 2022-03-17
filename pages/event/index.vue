<template>
  <aboutPc
    v-if="!$store.state.isMobile"
  />
  <eventNoti
    v-else
  />
</template>

<script>
import aboutPc from '~/components/event/pc/about.vue'; // eslint-disable-line
import eventNoti from '~/components/event/mobile/eventNoti.vue'; // eslint-disable-line

export default {
  components: {
    aboutPc,
    eventNoti,
  },
};
</script>
