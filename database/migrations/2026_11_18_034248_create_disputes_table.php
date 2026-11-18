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
    Schema::table('orders', function (Blueprint $table) {
        $table->timestamp('delivered_at')->nullable();
    });

    Schema::create('disputes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->string('type');                 // dispute or return
        $table->string('reason');
        $table->text('details')->nullable();
        $table->string('status')->default('open'); // open, approved, declined
        $table->text('response')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
