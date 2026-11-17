<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offer extends Model
{
    protected $fillable = ['sneaker_id', 'user_id', 'size', 'amount', 'counter_amount', 'final_amount', 'status'];

    public function sneaker(): BelongsTo
    {
        return $this->belongsTo(Sneaker::class);
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}