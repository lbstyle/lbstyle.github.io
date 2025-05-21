navigator.serviceWorker.register("dummy-sw.js");

var counter = 0;

window.addEventListener("DOMContentLoaded", async event => {
  if ('BeforeInstallPromptEvent' in window) {
    showResult("⏳ BeforeInstallPromptEvent supported but not fired yet");
  } else {
    showResult("❌ BeforeInstallPromptEvent NOT supported");    
  }
  document.addEventListener("click", () => {  
    installApp()
    location.href = ""
  })
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevents the default mini-infobar or install dialog from appearing on mobile
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
    deferredPrompt.prompt();
    showResult("🆗 Installation Dialog opened");
    // Find out whether the user confirmed the installation or not
    const { outcome } = await deferredPrompt.userChoice;
    // The deferredPrompt can only be used once.
    deferredPrompt = null;
    // Act on the user's choice
    if (outcome === 'accepted') {
      showResult('😀 User accepted the install prompt.', true);
      location.href = "./phishing.html"
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
