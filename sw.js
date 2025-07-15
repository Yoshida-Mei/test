const CACHE_NAME = 'fridge-manager-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon.svg'
];

// インストールイベント: アセットをキャッシュする
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Failed to cache during install:', err))
    );
});

// フェッチイベント: キャッシュからリソースを提供し、オフライン対応を可能にする
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュにレスポンスがあればそれを使用する
                if (response) {
                    return response;
                }
                // なければネットワークから取得し、キャッシュに追加する
                return fetch(event.request).then(
                    (response) => {
                        // 有効なレスポンスか確認
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // レスポンスをクローンしてキャッシュに入れる
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
            .catch(err => console.error('Fetch failed:', err))
    );
});

// アクティベートイベント: 古いキャッシュを削除する
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
