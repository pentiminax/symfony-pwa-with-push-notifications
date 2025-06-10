<?php

namespace App\Service;

use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class PushNotificationService
{
    public function __construct(
        #[Autowire('%publicKey%')]
        private readonly string $publicKey,
        #[Autowire('%privateKey%')]
        private readonly string $privateKey,
    ) {
    }

    public function send(string $endpoint, string $auth, string $p256dh, string $title, string $body): void
    {
        $subscription = Subscription::create([
            'endpoint' => $endpoint,
            'publicKey' => $p256dh,
            'authToken' => $auth,
        ]);

        $webPush = new WebPush([
            'VAPID' => [
                'subject' => 'https://pentiminax.fr',
                'publicKey' => $this->publicKey,
                'privateKey' => $this->privateKey,
            ],
        ]);

        $payload = json_encode([
            'title' => $title,
            'options' => [
                'body' => $body,
                'actions' => [
                    ['action' => 'open', 'title' => 'Open'],
                    ['action' => 'close', 'title' => 'Close'],
                ],
            ]
        ]);

        $webPush->sendOneNotification($subscription, $payload);
    }
}
