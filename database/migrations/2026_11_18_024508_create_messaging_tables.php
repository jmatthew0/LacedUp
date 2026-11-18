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
    Schema::create('conversations', function (Blueprint $table) {
        $table->id();
        $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('sneaker_id')->nullable()->constrained()->nullOnDelete();
        $table->timestamp('last_message_at')->nullable();
        $table->timestamps();
        $table->unique(['buyer_id', 'seller_id', 'sneaker_id']);
    });

    Schema::create('messages', function (Blueprint $table) {
        $table->id();
        $table->foreignId('conversation_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->text('body');
        $table->string('kind')->default('text'); // text or system
        $table->timestamp('read_at')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messaging_tables');
    }
};
