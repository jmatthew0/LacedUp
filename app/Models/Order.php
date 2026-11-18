<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = ['user_id', 'code', 'stage', 'subtotal', 'shipping', 'fee', 'total', 'shipping_method', 'payment_method', 'address', 'confirmed_at', 'delivered_at'];

    protected $casts = ['address' => 'array', 'confirmed_at' => 'datetime', 'delivered_at' => 'datetime'];

    public const RETURN_DAYS = 3;

    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    public function items(): HasMany { return $this->hasMany(OrderItem::class); }

    public function disputes(): HasMany { return $this->hasMany(Dispute::class); }

    public function status(): string
    {
        return match (true) {
            $this->stage >= 4 => 'Delivered',
            $this->stage >= 2 => 'In transit',
            default => 'To ship',
        };
    }

    public function hasOpen(string $type): bool
    {
        return $this->disputes->where('type', $type)->where('status', 'open')->isNotEmpty();
    }

    public function canDispute(): bool
    {
        return $this->stage >= 2 && ! $this->hasOpen('dispute');
    }

    public function canReturn(): bool
    {
        $since = $this->delivered_at ?? $this->updated_at;

        return $this->stage >= 4
            && $since->gt(now()->subDays(self::RETURN_DAYS))
            && $this->disputes->where('type', 'return')->whereIn('status', ['open', 'approved'])->isEmpty();
    }

    /** Load `items.review` and `disputes` before calling this. */
    public function toCard(): array
    {
        return [
            'code' => $this->code, 'status' => $this->status(), 'stage' => $this->stage,
            'subtotal' => $this->subtotal, 'shipping' => $this->shipping, 'fee' => $this->fee, 'total' => $this->total,
            'shippingMethod' => $this->shipping_method, 'paymentMethod' => $this->payment_method,
            'address' => $this->address, 'placedAt' => $this->created_at->format('M j, g:i A'),
            'confirmed' => (bool) $this->confirmed_at,
            'canDispute' => $this->canDispute(), 'canReturn' => $this->canReturn(),
            'disputes' => $this->disputes->sortByDesc('created_at')->map(fn ($d) => [
                'id' => $d->id, 'type' => $d->type, 'status' => $d->status, 'reason' => $d->reason,
                'response' => $d->response, 'date' => $d->created_at->format('M j'),
            ])->values(),
            'items' => $this->items->map(fn ($i) => $i->only('id', 'name', 'image', 'seller', 'condition', 'size', 'price')
                + ['review' => $i->review?->only('rating', 'comment')])->values(),
        ];
    }
}