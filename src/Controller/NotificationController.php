<?php

namespace App\Controller;

use App\Service\PushNotificationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class NotificationController extends AbstractController
{
    public function __construct(
        private readonly PushNotificationService $pushNotificationService
    ) {
    }

    #[Route('/notifications/push', name: 'push', methods: ['POST'])]
    public function push(Request $request): Response
    {
        $payload = json_decode($request->getContent(), true);

        $this->pushNotificationService->send(
            endpoint: $payload['endpoint'],
            auth: $payload['keys']['auth'],
            p256dh: $payload['keys']['p256dh'],
            title: $payload['notification']['title'] ?? 'Tire de la notification',
            body: $payload['notification']['body'] ?? 'Body',
        );

        return $this->json([
            'status' => 'pushed',
        ], Response::HTTP_CREATED);
    }
}
