<template>
  <div class="social-media">
    <a class="underline">FB</a>
    <a class="underline">IG</a>
  </div>
</template>

<script>
export default {
  name: "SocialMedia"
};
</script>

<style lang="scss" scoped>
.social-media {
  position: fixed;
  bottom: 0;
  right: 0;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  font-size: 11px;
  text-align: center;
  padding: 3.25vw;
  will-change: transform;
  &.home {
    transform: translateY(100%);
  }
  a {
    cursor: pointer;
  }
  a + a {
    margin-top: 1em;
  }
}
</style>
