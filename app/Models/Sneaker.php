<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sneaker extends Model
{
    protected $fillable = ['seller_id', 'slug', 'name', 'category', 'condition', 'price', 'sizes', 'image', 'blurb', 'featured', 'sold_at'];

    protected $casts = ['sizes' => 'array', 'featured' => 'boolean', 'sold_at' => 'datetime'];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(Seller::class);
    }

    public function scopeAvailable(Builder $query): Builder
    {
        return $query->whereNull('sold_at');
    }

    /** Same shape the React pages already expect. */
    public function toCard(): array
    {
        return [
            'slug' => $this->slug, 'name' => $this->name, 'category' => $this->category,
            'seller' => $this->seller->handle, 'rating' => $this->seller->rating,
            'price' => $this->price, 'condition' => $this->condition,
            'sizes' => $this->sizes, 'image' => $this->image,
        ];
    }
}