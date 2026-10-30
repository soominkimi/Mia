const order = ["edu", "book", "tmi", "sukhee", "thanks"];
const home = document.querySelector('[data-screen="home"]');
const lightbox = document.querySelector(".lightbox");
const lightImg = lightbox.querySelector("img");
const chew = document.querySelector("#chew");
const chewBtn = document.querySelector("[data-chew]");
const secret = document.querySelector("#secret");
const secretBtn = document.querySelector("[data-secret]");

function playVideos(root) {
  document.querySelectorAll("video").forEach((video) => {
    video.pause();
  });
  if (!root) return;
  root.querySelectorAll("video").forEach((video) => {
    if (video.closest("[hidden]")) return;
    video.muted = false;
    const attempt = video.play();
    if (attempt) {
      attempt.catch(() => {
        video.muted = true;
        video.play();
      });
    }
  });
}

function hideReveals() {
  chew.hidden = true;
  chewBtn.setAttribute("aria-expanded", "false");
  secret.hidden = true;
  secretBtn.setAttribute("aria-expanded", "false");
}

function showStage(name) {
  hideReveals();
  document.querySelectorAll("[data-stage-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.stagePanel !== name;
  });
  document.querySelectorAll("[data-stage]").forEach((button) => {
    button.classList.toggle("is-on", button.dataset.stage === name);
  });
  playVideos(document.querySelector(`[data-stage-panel="${name}"]`));
}

function showChew() {
  document.querySelectorAll("[data-stage-panel]").forEach((panel) => {
    panel.hidden = true;
  });
  document.querySelectorAll("[data-stage]").forEach((button) => {
    button.classList.remove("is-on");
  });
  secret.hidden = true;
  secretBtn.setAttribute("aria-expanded", "false");
  chew.hidden = false;
  chewBtn.setAttribute("aria-expanded", "true");
  playVideos(null);
}

function showSecret() {
  document.querySelectorAll("[data-stage-panel]").forEach((panel) => {
    panel.hidden = true;
  });
  document.querySelectorAll("[data-stage]").forEach((button) => {
    button.classList.remove("is-on");
  });
  chew.hidden = true;
  chewBtn.setAttribute("aria-expanded", "false");
  secret.hidden = false;
  secretBtn.setAttribute("aria-expanded", "true");
  playVideos(null);
}

function show(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    const on = screen.dataset.screen === id;
    screen.hidden = !on;
    screen.classList.toggle("is-active", on);
  });
  document.body.classList.toggle("is-home", id === "home");
  document.querySelectorAll("[data-open]").forEach((button) => {
    button.classList.toggle("is-current", button.dataset.open === id && id !== "home");
  });
  closeLight();
  window.scrollTo(0, 0);
  if (id === "sukhee") showStage("baby");
  else playVideos(document.querySelector(`.screen[data-screen="${id}"]`));
}

function openLight(src, alt) {
  lightImg.src = src;
  lightImg.alt = alt || "";
  lightbox.hidden = false;
}

function closeLight() {
  lightbox.hidden = true;
  lightImg.src = "";
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-light]") || event.target === lightbox) {
    closeLight();
    return;
  }

  const zoom = event.target.closest("[data-zoom]");
  if (zoom) {
    const image = zoom.tagName === "IMG" ? zoom : zoom.querySelector("img");
    if (image) openLight(image.currentSrc || image.src, image.alt);
    return;
  }

  const stage = event.target.closest("[data-stage]");
  if (stage) {
    showStage(stage.dataset.stage);
    return;
  }

  const chewToggle = event.target.closest("[data-chew]");
  if (chewToggle) {
    if (chew.hidden) showChew();
    else showStage("baby");
    return;
  }

  const secretToggle = event.target.closest("[data-secret]");
  if (secretToggle) {
    if (secret.hidden) showSecret();
    else showStage("baby");
    return;
  }

  const opener = event.target.closest("[data-open]");
  if (opener) show(opener.dataset.open);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!lightbox.hidden) closeLight();
    else show("home");
    return;
  }
  if ((event.key === "f" || event.key === "F") && !event.metaKey && !event.ctrlKey && !event.altKey) {
    toggleFullscreen();
    return;
  }
  if (event.key >= "1" && event.key <= "5") {
    show(order[Number(event.key) - 1]);
    return;
  }
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const current = document.querySelector(".screen.is-active")?.dataset.screen;
  if (current === "home") {
    if (event.key === "ArrowRight") show(order[0]);
    return;
  }
  event.preventDefault();
  const index = order.indexOf(current);
  if (event.key === "ArrowRight" && index < order.length - 1) show(order[index + 1]);
  if (event.key === "ArrowLeft" && index > 0) show(order[index - 1]);
});

const fullscreenButton = document.querySelector("[data-fullscreen]");

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

document.querySelectorAll("video").forEach((video) => video.pause());

fullscreenButton?.addEventListener("click", toggleFullscreen);
document.addEventListener("fullscreenchange", () => {
  fullscreenButton.textContent = document.fullscreenElement ? "전체화면 끄기" : "전체화면";
});
