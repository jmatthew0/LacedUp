<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('sneakers', function (Blueprint $table) {
        $table->id();
        $table->foreignId('seller_id')->constrained()->cascadeOnDelete();
        $table->string('slug')->unique();
        $table->string('name');
        $table->string('category');
        $table->string('condition');
        $table->unsignedInteger('price');
        $table->json('sizes');
        $table->string('image');
        $table->text('blurb')->nullable();
        $table->boolean('featured')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sneakers');
    }
};
