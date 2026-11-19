<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('sneakers', function (Blueprint $table) {
        $table->boolean('box_included')->default(false);
        $table->boolean('receipt_included')->default(false);
    });

    DB::table('sneakers')->whereIn('condition', ['Deadstock', 'Like new'])->update(['box_included' => true]);
    DB::table('sneakers')->where('condition', 'Deadstock')->update(['receipt_included' => true]);
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sneakers', function (Blueprint $table) {
            //
        });
    }
};
