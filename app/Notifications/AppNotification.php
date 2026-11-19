<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class AppNotification extends Notification
{
    public function __construct(private string $message, private string $url = '/') {}

    private function category(): string
    {
        $m = strtolower($this->message);

        return match (true) {
            str_contains($m, 'review') => 'reviews',
            str_contains($m, 'offer'), str_contains($m, 'counter') => 'offers',
            str_contains($m, 'order'), str_contains($m, 'dispute'), str_contains($m, 'return') => 'orders',
            default => 'general',
        };
    }

    public function via(object $notifiable): array
    {
        $prefs = $notifiable->notification_prefs ?? [];

        return ($prefs[$this->category()] ?? true) ? ['database'] : [];
    }

    public function toArray(object $notifiable): array
    {
        return ['message' => $this->message, 'url' => $this->url];
    }
}