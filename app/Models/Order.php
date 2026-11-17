<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = ['user_id', 'code', 'stage', 'subtotal', 'shipping', 'fee', 'total', 'shipping_method', 'payment_method', 'address', 'confirmed_at'];

    protected $casts = ['address' => 'array', 'confirmed_at' => 'datetime'];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function status(): string
    {
        return match (true) {
            $this->stage >= 4 => 'Delivered',
            $this->stage >= 2 => 'In transit',
            default => 'To ship',
        };
    }

    /** Load `items.review` before calling this. */
    public function toCard(): array
    {
        return [
            'code' => $this->code, 'status' => $this->status(), 'stage' => $this->stage,
            'subtotal' => $this->subtotal, 'shipping' => $this->shipping, 'fee' => $this->fee, 'total' => $this->total,
            'shippingMethod' => $this->shipping_method, 'paymentMethod' => $this->payment_method,
            'address' => $this->address, 'placedAt' => $this->created_at->format('M j, g:i A'),
            'confirmed' => (bool) $this->confirmed_at,
            'items' => $this->items->map(fn ($i) => $i->only('id', 'name', 'image', 'seller', 'condition', 'size', 'price')
                + ['review' => $i->review?->only('rating', 'comment')])->values(),
        ];
    }
}