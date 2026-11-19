<?php

namespace App\Data;

/** Brand, colorway, and style code for each model. Edit the placeholder codes to match your real catalog. */
class ModelInfo
{
    private const MODELS = [
        'Ember Retro High' => ['brand' => 'Retro Labs', 'colorway' => 'Ember / Cream / Black', 'style_code' => 'RH-0425'],
        'Bone Court Low' => ['brand' => 'Courtline', 'colorway' => 'Bone / Gum', 'style_code' => 'BC-0112'],
        'Night Tide Runner' => ['brand' => 'Night Works', 'colorway' => 'Navy / Silver', 'style_code' => 'NT-0930'],
        'Volt Trail 2' => ['brand' => 'Night Works', 'colorway' => 'Volt / Black', 'style_code' => 'VT-0207'],
        'Cloud Slide Ash' => ['brand' => 'Courtline', 'colorway' => 'Ash', 'style_code' => 'CS-0618'],
        'Coastline Mid "Sand"' => ['brand' => 'Retro Labs', 'colorway' => 'Sand / White', 'style_code' => 'CM-0524'],
    ];

    public static function for(string $name): array
    {
        return self::MODELS[$name] ?? [];
    }
}