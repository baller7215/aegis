document.getElementById("openChatGPT").addEventListener("click", (e) => {
  e.preventDefault();
  chrome.tabs.create({ url: "https://chatgpt.com" });
  window.close();
});
