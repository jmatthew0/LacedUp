<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Conversation extends Model
{
    protected $fillable = ['buyer_id', 'seller_id', 'sneaker_id', 'last_message_at'];

    protected $casts = ['last_message_at' => 'datetime'];

    public function buyer(): BelongsTo { return $this->belongsTo(User::class, 'buyer_id'); }

    public function seller(): BelongsTo { return $this->belongsTo(User::class, 'seller_id'); }

    public function sneaker(): BelongsTo { return $this->belongsTo(Sneaker::class); }

    public function messages(): HasMany { return $this->hasMany(Message::class); }

    public function last(): HasOne { return $this->hasOne(Message::class)->latestOfMany(); }

    public function includes(User $user): bool
    {
        return in_array($user->id, [$this->buyer_id, $this->seller_id], true);
    }

    public function other(User $me): User
    {
        return $this->buyer_id === $me->id ? $this->seller : $this->buyer;
    }
}