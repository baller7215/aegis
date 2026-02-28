document.getElementById('analyze').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      console.log('Analyze:', tabs[0].url);
      // TODO: Send to backend API
    }
  });
});
