import {
  PlaneBufferGeometry,
  RawShaderMaterial,
  // MeshBasicMaterial,
  Mesh,
  Group,
  Uniform,
  WebGLRenderTarget,
  BufferAttribute,
  Scene,
  Vector2
} from "three";

import gsap from "gsap";

const assets = [
  "/assets/textures/leaves0",
  "/assets/textures/leaves1",
  "/assets/textures/leaves2"
].map(_ => (_ += ".png"));

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import logoFragmentShader from "./shaders/logo.fragment.glsl";
import logoBlackFragmentShader from "./shaders/logo.black.fragment.glsl";
import logoVertexShader from "./shaders/logo.vertex.glsl";

import RefractionMaterial from "./RefactionMaterial";

import { API } from "@/Scene/index";
// import { toISOString } from "core-js/fn/date";

export default class Flowers {
  renderable = true;
  constructor({ scene, loader, renderer, camera }) {
    this.loader = loader;
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;

    this.groupOffsetY = 0.0;
    this.groupLeftOffsetY = 0.0;
    this.groupOffsetlogoY = -6.25;
    this.logoY = 0;
    this.smallLogoY = -0.2;
    this.rgbaShift = 1.0;
    this.delta = 0;

    this.setFBO();
    this.createBackground();
    this.createRefaction();
    this.createLogo();
  }
  enter() {
    const helper = {
      offset: 0,
      rgbshift: 1.0,
      groupY: -6.25
    };
    this.tl = new gsap.timeline();
    this.tl
      .delay(0.625)
      .to(
        helper,
        {
          duration: 0.625,
          ease: "sine.out",
          offset: 1.0,
          onUpdate: () => {
            this.refractorMaterial.uniforms.offset.value = helper.offset;
          }
        },
        "a"
      )
      .to(
        helper,
        {
          duration: 2.0,
          ease: "expo.out",
          groupY: 0.0,
          onUpdate: () => {
            this.groupOffsetY = helper.groupY;
            this.groupOffsetlogoY = helper.groupY;
          },
          onComplete: () => {
            this.logoClip.visible = false;
          }
        },
        "a"
      )
      .to(
        helper,
        {
          duration: 1.0,
          ease: "sine.out",
          rgbshift: 0.0,
          onUpdate: () => {
            this.rgbaShift = helper.rgbshift;
          }
        },
        "a+=.625"
      );

    return this.tl;
  }
  reset() {
    this.tl?.kill();
    this.refractorMaterial.uniforms.offset.value = 0;
    this.groupOffsetY = -6.25;
    this.groupLeftOffsetY = 0.0;
    this.groupOffsetlogoY = -6.25;
    this.logoY = 0;
    this.smallLogoY = -0.2;
    this.rgbaShift = 1.0;
    this.delta = 0;
    this.refractor.material.uniforms.lightStep.value = 0.9;
    this.logoMaterial.uniforms.lightStep.value = 0.0;
  }
  completeIntro() {
    const tl = new gsap.timeline({ paused: true });
    const helper = {
      logoY: 0
    };
    tl.to(
      helper,
      {
        ease: "none",
        logoY: 2.5,
        onUpdate: () => {
          this.logoY = helper.logoY;
        }
      },
      "b"
    );
    return tl;
  }
  scrollY() {
    const tl = new gsap.timeline();
    const helper = {
      groupY: 0
    };
    tl.to(
      helper,
      {
        ease: "none",
        groupY: 6,
        onUpdate: () => {
          this.groupLeftOffsetY = helper.groupY;
        }
      },
      "b"
    );
    return tl;
  }
  setFBO() {
    this.sceneFBO = new Scene();
    this.envFBO = new WebGLRenderTarget(
      window.innerWidth * API.pixelRatio,
      window.innerHeight * API.pixelRatio
    );
  }
  createBackground() {
    this.material = new RawShaderMaterial({
      transparent: true,
      uniforms: {
        map: new Uniform()
      },
      vertexShader,
      fragmentShader
    });
    this.geometry = new PlaneBufferGeometry(25, 25, 1);
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.layers.set(0);

    this.group = new Group();

    assets.forEach((url, i) => {
      const plane = this.mesh.clone();
      plane.layers.set(0);
      plane.material = this.material.clone();
      plane.material.uniforms.map.value = this.loader.loadTexture(url);
      plane.position.z = i * -0.01 - 5.0;
      this.group.add(plane);
    });

    this.sceneFBO.add(this.group);
  }
  createLogo() {
    const texture = this.loader.loadTexture("/assets/textures/logo.png");
    const texScale = 1.825;
    this.logoMaterial = new RawShaderMaterial({
      transparent: true,
      uniforms: {
        map: new Uniform(texture),
        shift: new Uniform(0.0),
        reverse: new Uniform(0.0),
        scale: new Uniform(texScale),
        lightStep: new Uniform(0.0),
        resolution: new Uniform(
          new Vector2(
            window.innerWidth * API.pixelRatio,
            window.innerHeight * API.pixelRatio
          )
        )
      },
      vertexShader: logoVertexShader,
      fragmentShader: logoFragmentShader,
      depthTest: false
    });
    this.logoBlackMaterial = new RawShaderMaterial({
      transparent: true,
      uniforms: {
        map: new Uniform(texture),
        offset: new Uniform(0.0),
        scale: new Uniform(texScale),
        resolution: new Uniform(
          new Vector2(
            window.innerWidth * API.pixelRatio,
            window.innerHeight * API.pixelRatio
          )
        )
      },
      vertexShader: logoVertexShader,
      fragmentShader: logoBlackFragmentShader,
      depthTest: false
    });
    this.logoGeometry = new PlaneBufferGeometry(
      1.5 * texScale,
      1.5 * texScale,
      1.0
    );
    this.logo = new Group();
    this.logo.position.y = -6.25;

    this.logoMain = new Mesh(this.logoGeometry, this.logoMaterial);
    this.logoMain.layers.set(0);
    this.logo.add(this.logoMain);

    this.logoClip = this.logoMain.clone();
    this.logoClip.material = this.logoClip.material.clone();
    this.logoClip.material.uniforms.shift.value = 1.0;
    this.logoClip.material.uniforms.map.value = texture;
    this.logoClip.position.x = -0.5;

    this.logo.add(this.logoClip);

    const texturesmall = this.loader.loadTexture(
      "/assets/textures/logosmall.png"
    );
    this.logoSmall = this.logoMain.clone();
    this.logoSmall.layers.set(0);
    this.logoSmall.material = this.logoMaterial.clone();
    this.logoSmall.material.uniforms.shift.value = 0.0;
    this.logoSmall.material.uniforms.reverse.value = 1.0;
    this.logoSmall.material.uniforms.scale.value = 1.0;
    this.logoSmall.material.uniforms.map.value = texturesmall;
    this.logoSmall.scale.x = 0.2;
    this.logoSmall.scale.y = 0.2;
    this.logoSmall.position.y = 0.0;

    this.scene.add(this.logoSmall);
    this.logo.renderOrder = 2.0;

    this.blackLogo = this.logoMain.clone();
    this.blackLogo.layers.set(3);
    this.blackLogo.material = this.logoBlackMaterial.clone();
    this.blackLogo.material.uniforms.offset.value = 0.0;
    this.blackLogo.material.uniforms.scale.value = 1.0;
    this.blackLogo.material.uniforms.map.value = texturesmall;
    this.blackLogo.material.fragmentShader = logoBlackFragmentShader;
    this.blackLogo.scale.x = 0.2;
    this.blackLogo.scale.y = 0.2;
    this.blackLogo.position.y = 0.0;
    this.blackLogo.renderOrder = 6.0;

    this.scene.add(this.blackLogo);

    this.scene.add(this.logo);
  }
  createRefaction() {
    this.refractGroup = new Group();

    this.refractorMaterial = new RefractionMaterial({
      envMap: this.envFBO.texture,
      resolution: [
        window.innerWidth * API.pixelRatio,
        window.innerHeight * API.pixelRatio
      ]
    });

    this.refractorGeometry = new PlaneBufferGeometry(12.5, 3, 1.0);
    var vertices = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    this.refractorGeometry.setAttribute(
      "lightIncidence",
      new BufferAttribute(vertices, 1)
    );
    this.refractor = new Mesh(this.refractorGeometry, this.refractorMaterial);
    this.refractor.layers.set(0);
    this.refractor.rotation.x = -0.015;
    this.refractor.rotation.y = 0.0625;
    this.refractor.rotation.z = Math.PI * 0.125;

    this.displayFBOGeometry = new PlaneBufferGeometry(20, 20, 1);
    var vertices2 = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    this.displayFBOGeometry.setAttribute(
      "lightIncidence",
      new BufferAttribute(vertices2, 1)
    );
    this.displayFBO = new Mesh(this.displayFBOGeometry, this.refractorMaterial);
    this.displayFBO.layers.set(0);
    this.displayFBO.position.z = -1;
    this.refractGroup.add(this.refractor);
    this.refractor.renderOrder = 1.0;
    this.refractGroup.add(this.displayFBO);
    this.displayFBO.renderOrder = 0.0;
    this.scene.add(this.refractGroup);
  }
  updateSmall() {
    this.logoSmall.position.y = Math.max(
      this.logo.position.y + this.smallLogoY,
      0.0
    );
  }
  render() {
    if (this.renderable) {
      const x = API.mouse.target.x;
      const y = API.mouse.target.y;
      const mouseX = x;
      const mouseY = y;

      this.group.rotation.y = mouseX * Math.PI * 0.01875;
      this.group.position.x = mouseX * -0.25;

      this.group.children[0].position.x = mouseX * 0.3125;
      this.group.children[1].position.x = mouseX * 0.156255;

      this.group.children[0].position.y = this.groupLeftOffsetY * 0.125;
      this.group.children[1].position.y = this.groupLeftOffsetY * 0.0625;

      this.group.rotation.x = mouseY * -Math.PI * 0.0125;
      this.group.position.y =
        this.groupOffsetY + this.groupLeftOffsetY + mouseY * -0.125;
      this.logo.position.y = this.groupOffsetlogoY + this.logoY;

      this.refractorMaterial.uniforms.rgbshift.value = Math.min(
        this.rgbaShift + this.detla,
        1.0
      );
      this.renderer.setRenderTarget(this.envFBO);
      this.renderer.render(this.sceneFBO, this.camera);
      this.renderer.setRenderTarget(null);
    }
  }
  handleResize(sizes) {
    this.sizes = sizes;
    const width = sizes.viewport.width * API.pixelRatio;
    const height = sizes.viewport.height * API.pixelRatio;
    this.envFBO.setSize(width, height);
    this.displayFBO.material.uniforms.resolution.value = [width, height];
    this.refractor.material.uniforms.resolution.value = [width, height];
    this.logoMain.material.uniforms.resolution.value = [width, height];
    this.logoClip.material.uniforms.resolution.value = [width, height];
    this.logoSmall.material.uniforms.resolution.value = [width, height];
    if (sizes.viewport.width < 1200 || sizes.viewport.height < 630) {
      this.logoSmall.visible = false;
    } else {
      this.logoSmall.visible = true;
    }
  }
  dispose() {}
}
