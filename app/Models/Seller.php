<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Seller extends Model
{
    protected $fillable = ['handle', 'name', 'bio', 'sales', 'rating', 'on_time'];

    protected $casts = ['rating' => 'float'];

    public function sneakers(): HasMany
    {
        return $this->hasMany(Sneaker::class);
    }

    public function toCard(): array
    {
        return [
            'handle' => $this->handle, 'name' => $this->name, 'bio' => $this->bio,
            'sales' => $this->sales, 'rating' => $this->rating, 'onTime' => $this->on_time,
        ];
    }
}