<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Seller extends Model
{
    protected $fillable = ['user_id', 'handle', 'name', 'bio', 'avatar', 'sales', 'rating', 'on_time'];

    protected $casts = ['rating' => 'float'];

    public function sneakers(): HasMany
    {
        return $this->hasMany(Sneaker::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function toCard(): array
    {
        return [
            'handle' => $this->handle, 'name' => $this->name, 'bio' => $this->bio, 'avatar' => $this->avatar,
            'sales' => $this->sales, 'rating' => $this->rating, 'onTime' => $this->on_time,
        ];
    }

    public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

}