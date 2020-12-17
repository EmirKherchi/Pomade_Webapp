<template>
  <div class="work-page">
    <div class="gabarit" ref="gabarit">
      <div class="board-container">
        <div
          :key="i"
          class="board"
          v-for="(board, i) in boards"
          :style="{
            gridColumn: board.sizes.gridColumn
          }"
        >
          <a>
            <div
              class="decoration"
              :style="{
                width: `${board.sizes.width * 100}vw`,
                height: `${board.sizes.height * 100}vw`
              }"
            >
              <div
                class="image-holder"
                :style="{
                  backgroundImage: `url(${board.image})`
                }"
              />
              <div class="cover">
                <div class="before" />
                <div class="after" />
              </div>
            </div>
            <div class="details">
              <h2>{{ board.title }}</h2>
              <span class="caption">{{ board.caption }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SubView from "@/mixins/SubView";
import Config from "@/Scene/Board/config.js";
export default {
  name: "Work",
  mixins: [SubView],
  data() {
    return {
      boards: Config
    };
  }
};
</script>

<style lang="scss" scoped>
.work-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  left: 0;
  top: 0;
}
.gabarit {
  padding-top: 12.8536285363vw;
  padding-bottom: 12.8536285363vw;
}
.board-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 80%;
  margin: auto;
}
.board {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 8vw;
}
.decoration {
  overflow: hidden;
  position: relative;
  cursor: pointer;
  &:hover {
    .image-holder {
      transform: scale(1.1);
    }
  }
}
.image-holder {
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  transition: transform 2s ease-out;
}
.cover {
  width: 101%;
  height: 220%;
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
  position: absolute;
  top: 50%;
  left: 50%;
  .before {
    position: absolute;
    width: 100%;
    height: 100%;
    right: 49.5%;
    background-color: #ffffff;
    top: 0;
  }
  .after {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    background-color: #ffffff;
    top: 0;
  }
}
h2 {
  font-size: 1.625em;
  margin-bottom: 0;
}
.caption {
  font-size: 0.75em;
}
</style>
