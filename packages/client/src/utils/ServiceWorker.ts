export function startServiceWorker() {
  if (import.meta.env.DEV) {
    return;
  }
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          );
        })
        .catch((error: Error) => {
          console.log('ServiceWorker registration failed: ', error.message);
        });
    });
  }
}
