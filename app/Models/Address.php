<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = ['user_id', 'label', 'name', 'phone', 'address', 'city', 'postal', 'is_default'];

    protected $casts = ['is_default' => 'boolean'];

    public function toCard(): array
    {
        return [
            'id' => $this->id, 'label' => $this->label, 'name' => $this->name, 'phone' => $this->phone,
            'address' => $this->address, 'city' => $this->city, 'postal' => $this->postal, 'isDefault' => $this->is_default,
        ];
    }
}