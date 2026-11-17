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
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('code')->unique();
        $table->unsignedTinyInteger('stage')->default(0);
        $table->unsignedInteger('subtotal');
        $table->unsignedInteger('shipping');
        $table->unsignedInteger('fee');
        $table->unsignedInteger('total');
        $table->string('shipping_method');
        $table->string('payment_method');
        $table->json('address');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
