export function sw_init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'}).
            then(function (registration) {
                console.log('SW success:', registration);
            }).
            catch(function (err) {
                console.log('SW fail:', err);
            });
    };
}