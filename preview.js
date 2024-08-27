/**
 * Enable events simulation during local development:
 */
if (!window.exit_widget) {
  document.addEventListener(
    "DOMContentLoaded",
    async () => {
      window.exit_widget = function () {
        console.log("EXIT_WIDGET");
      };
      const config = {
        rssUrl: "https://ct24.ceskatelevize.cz/rss/tema/hlavni-zpravy-84313",
        pageDisplaySeconds: 20,
      };

      displayMessage("Loading in PREVIEW mode ...");

      // Simulate the widget initialization
      init_widget(config);

      // Simulate delay before widget displaying
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Not used in this app

      // Simulate the widget displaying
      // await start_widget(); // Not used in this app
      
      displayMessage("");

    },
    false
  );
}