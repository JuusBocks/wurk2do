// Register Service Worker for PWA functionality

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js', { updateViaCache: 'none' })
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
          
          // Check for updates every hour
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
          
          // Check for updates immediately on page load
          registration.update();
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New version available - reload to activate
                  console.log('🔄 New version available! Reloading...');
                  // Wait a moment for user to see the app, then reload
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } else {
                  // First install
                  console.log('✅ Service Worker installed');
                }
              }
            });
          });
          
          // Listen for controller change (update activated)
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('🔄 Service Worker updated, reloading...');
            window.location.reload();
          });
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }
}
