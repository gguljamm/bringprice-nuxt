<template>
  <div class="bubbleBack" :style="{
    top: `${position[0] - 36}px`,
    left: `${position[1]}px`,
  }">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ['text', 'position'],
};
</script>

<style lang="scss" scoped>
  .bubbleBack{
    white-space: nowrap;
    position: absolute;
    display: none;
    top: -36px;
    padding: 0 16px;
    line-height: 30px;
    height: 30px;
    opacity: 0.96;
    border-radius: 2px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    background-color: #4a4a4a;
    color: #fff;
    left: 0;
    transform: translateX(-50%);
    font-size: 14px;
    &:before{
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      margin-left: -4px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #4a4a4a;
    }
  }
  .bubbleWrap:hover .bubbleBack{
    display: block;
  }
</style>
