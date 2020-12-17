<template>
  <router-link
    class="cta"
    :to="{
      name: 'Work'
    }"
  >
    <span class="caption">VIEW OUR WORK</span>
    <span class="caption-2">VIEW OUR WORK</span>
  </router-link>
</template>

<script>
export default {
  name: "CTA"
};
</script>

<style lang="scss" scoped>
.cta {
  font-size: 11px;
  display: inline-block;
  // background-color: #ffffff;
  color: #000000;
  border: 2px solid #ffffff;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  padding: 1.5em 2em;
  text-decoration: none;
  .caption {
    transition: opacity 0.3125s;
  }
  &:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    width: 101%;
    height: 105%;
    transform: translateX(-50%) translateY(-50%) skewX(-35deg);
    background-color: green;
    background-color: #ffffff;
    z-index: 1;
    transition: transform 0.3125s;
  }
  &:after {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    width: 101%;
    height: 105%;
    transform: translateX(50%) translateY(-50%) skewX(-35deg);
    background-color: red;
    background-color: #ffffff;
    z-index: 1;
    transition: transform 0.3125s;
  }
  .caption {
    position: relative;
    z-index: 2;
  }
  .caption-2 {
    position: absolute;
    z-index: 0;
    color: #ffffff;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 1.5em 2em;
    transition: opacity 0.3125s;
    opacity: 0;
  }
  &:hover {
    .caption {
      opacity: 0;
    }
    .caption-2 {
      opacity: 1;
    }
    &:before {
      transform: translateX(-130%) translateY(-50%) skewX(-35deg);
    }
    &:after {
      transform: translateX(130%) translateY(-50%) skewX(-35deg);
    }
  }
}
</style>
