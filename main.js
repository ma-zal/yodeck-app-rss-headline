'use strict';

async function init_widget(config) {
  if (!config) {
    displayMessage("Missing the Yodeck app config", true);
    return;
  }

  if (!config["rssUrl"]) {
    displayMessage("Missing the Yodeck app config.rssUrl", true);
    return;
  }

  if (!config["pageDisplaySeconds"]) {
    displayMessage("Missing the Yodeck app config.pageDisplaySeconds", true);
    return;
  }

  window.config = config;

  // For avoid to free the app, stop after 3 minutes
  // setTimeout(() => {
  //   exit_widget();
  // }, 3 * 60 * 1000);

  fetch(config["rssUrl"])
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch RSS feed");
      }
      return response.text();
    })
    .then((str) => new DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {

      const channelTitle = data.firstChild.querySelector("title").textContent;
      document.getElementById('h1').innerText = channelTitle;

      const items = data.querySelectorAll("item");
      const randomIndex = Math.floor(Math.random() * items.length); // Get a random index

      const randomItem = items[randomIndex];
      const title = randomItem.querySelector("title").textContent;
      const description = randomItem.querySelector("description").textContent;
      let imageUrl = randomItem
        .querySelector("enclosure")
        .getAttribute("url");

      // Hack for CT24
      imageUrl = imageUrl.replace('?width=228', '?width=1000');

      const html = `
          <article>
            <div class="left">
              <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}">
            </div>
            <div class="right">
              <h2>${escapeHtml(title)}</h2>
              <p>${escapeHtml(description)}</p>
            <div>

          </article>
      `;

      document.getElementById("content").innerHTML = html;

      setTimeout(() => exit_widget(), config['pageDisplaySeconds'] * 1000);
    })
    .catch((error) => {
      displayMessage("Error fetching or parsing RSS feed: " + error, true);
      setTimeout(() => exit_widget(), config['pageDisplaySeconds'] * 4000);
    });
}

function start_widget() { /* ignore */ }

function displayMessage(message, isError = false) {
  const el = document.getElementById("messages");
  if (!message) {
    console.log("Hidding message");
    el.style.display = "none";
    return;
  }
  console.log("Message: " + message + ", isError: " + isError);
  el.style.display = "block";
  el.innerHTML =
    (isError ? "APPLICATION ERROR: " : "") +
    escapeHtml(message) +
    (isError ? "<br /><br />Developer/Contact: Martin Zaloudek" : "");

  if (isError) {
    // In case of any error, just end the widget after 10s.
    setTimeout(() => {
      exit_widget();
    }, 10_000);
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const RSS_URL = "https://example.com/feed.rss"; // Replace with your actual RSS feed URL
