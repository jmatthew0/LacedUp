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
    Schema::create('offers', function (Blueprint $table) {
        $table->id();
        $table->foreignId('sneaker_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('size', 8)->nullable();
        $table->unsignedInteger('amount');
        $table->unsignedInteger('counter_amount')->nullable();
        $table->unsignedInteger('final_amount')->nullable();
        $table->string('status')->default('pending'); // pending, countered, accepted, declined
        $table->timestamps();
    });

    Schema::table('bag_items', function (Blueprint $table) {
        $table->unsignedInteger('price')->nullable(); // agreed offer price
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
