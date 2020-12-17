<template>
  <div class="navigator">
    <a class="hamburger">
      <span class="bread top"></span>
      <span class="bread bottom"></span>
    </a>
    <div class="footer">
      <a class="contact-cta underline">CONTACT US</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "SocialMedia"
};
</script>

<style lang="scss" scoped>
.navigator {
  position: fixed;
  left: 0;
  top: 0;
  color: white;
  width: 15.25vw;
  text-align: right;
  box-sizing: border-box;
  padding-left: 16px;
  will-change: transform;
  opacity: 0;
  visibility: hidden;
  &.home {
    transform: translateY(100vh);
    opacity: 0;
    visibility: hidden;
  }
  @media screen and (max-width: 768px - 1) {
    display: none;
  }
}
.hamburger {
  width: 18px;
  height: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-bottom: 68px;
  cursor: pointer;
  .bread {
    display: block;
    width: 100%;
    height: 3px;
    margin: 2px 0;
    overflow: hidden;
    position: relative;
    &:before,
    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      transition: transform 0.3125s ease;
    }
    &:after {
      transform: translateX(-150%);
      background-color: #ffffff;
      position: absolute;
      top: 0;
      left: 0;
    }
    &.bottom {
      &:before,
      &:after {
        transition-delay: 0.1s;
      }
    }
  }
  &:hover {
    .bread {
      &:before {
        transform: translateX(150%);
      }
      &:after {
        transform: translateX(0%);
      }
    }
  }
}
.footer {
  font-size: 11px;
  &:before {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background-color: #ffffff;
    margin-bottom: 0.5em;
  }
}
.contact-cta {
  font-size: 11px;
  cursor: pointer;
}
</style>
