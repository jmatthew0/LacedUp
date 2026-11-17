<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'sneaker_id', 'name', 'image', 'seller', 'condition', 'size', 'price'];
}