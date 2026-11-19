<?php

namespace Database\Seeders;

use App\Data\Catalog;
use App\Models\BagItem;
use App\Models\Offer;
use App\Models\Order;
use App\Models\Review;
use App\Models\Seller;
use App\Models\Sneaker;
use App\Models\User;
use App\Notifications\AppNotification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    private array $templates = [];

    public function run(): void
    {
        $this->call(CatalogSeeder::class);
        $this->templates = collect(Catalog::sneakers())->keyBy('slug')->all();

        $juan = User::create(['name' => 'Juan Dela Cruz', 'email' => 'juan@example.com', 'password' => 'password']);
        $ana = User::create(['name' => 'Ana Lim', 'email' => 'ana@example.com', 'password' => 'password']);

        $mika = $this->seller('Mika Santos', 'mika@example.com', 'mika.kicks', 'Clean court and lifestyle pairs. Photographed in daylight and shipped within 48 hours.');
        $paolo = $this->seller('Paolo Reyes', 'paolo@example.com', 'paolo.soles', 'Retro and runner pairs. Every shoe comes with the original box when available.');

        // Mika's listings
        $mEmber = $this->pair($mika, 'ember-retro-high', 8200, 9, 'Deadstock');
        $mBone = $this->pair($mika, 'bone-court-low', 5900, 8, 'Like new');
        $mNight = $this->pair($mika, 'night-tide-runner', 10400, 10, 'Deadstock');
        $mSlide = $this->pair($mika, 'cloud-slide-ash', 1900, 8, 'Good condition');
        $mVolt = $this->pair($mika, 'volt-trail-2', 4300, 9, 'Worn once');
        $mBoneSold = $this->pair($mika, 'bone-court-low', 5500, 7, 'Like new');

        // Paolo's listings
        $pCoast = $this->pair($paolo, 'coastline-mid-sand', 6800, 10, 'Deadstock');
        $pEmber = $this->pair($paolo, 'ember-retro-high', 9100, 8, 'Like new');
        $pBone = $this->pair($paolo, 'bone-court-low', 6100, 9, 'Deadstock');
        $this->pair($paolo, 'volt-trail-2', 4500, 10, 'Worn once');
        $pNight = $this->pair($paolo, 'night-tide-runner', 11000, 11, 'Like new');

        // Juan's orders, one per tracking stage
        $this->order($juan, $mSlide, stage: 1, daysAgo: 1);                       // seller still has to ship
        $this->order($juan, $pEmber, stage: 3, daysAgo: 3);                       // out for delivery
        $this->order($juan, $pBone, stage: 4, daysAgo: 5);                        // delivered, not confirmed yet
        $done = $this->order($juan, $mEmber, stage: 4, confirmed: true, daysAgo: 6);
        $this->review($done, 5, 'Exactly as described. Box and receipt included, and it shipped the next day.');

        // Ana bought one of Mika's pairs too
        $anaOrder = $this->order($ana, $mBoneSold, stage: 4, confirmed: true, daysAgo: 4);
        $this->review($anaOrder, 4, 'Clean pair and well packed. Shipping took a day longer than promised.');

        // Offers
        $this->offer($juan, $pCoast, 5500);                                       // pending, Paolo sees it
        $this->offer($juan, $pNight, 8000, 'countered', 9500);                    // Paolo countered
        $this->offer($ana, $mNight, 8500);                                        // pending, Mika sees it
        $this->offer($ana, $mBone, 4800);                                         // pending, Mika sees it

        // Saved pairs and bag
        $juan->savedSneakers()->syncWithoutDetaching([$mBone->id, $pCoast->id, $mNight->id]);
        BagItem::create(['user_id' => $juan->id, 'sneaker_id' => $mVolt->id, 'size' => '9']);

        // A few notifications so the bell is not empty
        $mika->user->notify(new AppNotification('New offer of ₱8,500 on Night Tide Runner from Ana Lim', '/dashboard'));
        $mika->user->notify(new AppNotification('New offer of ₱4,800 on Bone Court Low from Ana Lim', '/dashboard'));
        $paolo->user->notify(new AppNotification('New offer of ₱5,500 on Coastline Mid "Sand" from Juan Dela Cruz', '/dashboard'));
        $juan->notify(new AppNotification('The seller countered your offer on Night Tide Runner with ₱9,500', '/offers'));
    }

    private function seller(string $name, string $email, string $handle, string $bio): Seller
    {
        $user = User::create(['name' => $name, 'email' => $email, 'password' => 'password']);

        return Seller::create([
            'user_id' => $user->id, 'handle' => $handle, 'name' => $name, 'bio' => $bio,
            'sales' => 0, 'rating' => 5.0, 'on_time' => 100,
        ]);
    }

    private function pair(Seller $seller, string $template, int $price, int $size, string $condition): Sneaker
    {
        $t = $this->templates[$template];

        return Sneaker::create([
            'seller_id' => $seller->id,
            'slug' => Str::slug($t['name']).'-'.Str::lower(Str::random(5)),
            'name' => $t['name'], 'category' => $t['category'], 'condition' => $condition,
            'price' => $price, 'sizes' => [$size], 'image' => $t['image'],
            'box_included' => in_array($condition, ['Deadstock', 'Like new'], true),
            'receipt_included' => $condition === 'Deadstock',
        ]);
    }

    private function order(User $buyer, Sneaker $sneaker, int $stage, bool $confirmed = false, int $daysAgo = 1): Order
    {
        $sneaker->update(['sold_at' => now()->subDays($daysAgo)]);
        $sneaker->load('seller');

        $order = Order::create([
            'user_id' => $buyer->id,
            'code' => 'LU-'.strtoupper(Str::random(6)),
            'stage' => $stage,
            'subtotal' => $sneaker->price, 'shipping' => 120, 'fee' => 90, 'total' => $sneaker->price + 210,
            'shipping_method' => 'Standard', 'payment_method' => 'GCash',
            'address' => [
                'name' => $buyer->name, 'phone' => '0917 123 4567',
                'address' => 'Unit 4B, Mabini St., Brgy. Poblacion', 'city' => 'Quezon City', 'postal' => '1100',
            ],
            'confirmed_at' => $confirmed ? now() : null,
        ]);

        $order->items()->create([
            'sneaker_id' => $sneaker->id, 'name' => $sneaker->name, 'image' => $sneaker->image,
            'seller' => $sneaker->seller->handle, 'condition' => $sneaker->condition,
            'size' => (string) $sneaker->sizes[0], 'price' => $sneaker->price,
        ]);

        $order->forceFill(['created_at' => now()->subDays($daysAgo)])->save();

        if ($confirmed) {
            $sneaker->seller->increment('sales');
        }

        return $order;
    }

    private function review(Order $order, int $rating, string $comment): void
    {
        $item = $order->items()->first();
        $seller = Seller::where('handle', $item->seller)->firstOrFail();

        Review::create([
            'order_item_id' => $item->id, 'user_id' => $order->user_id, 'seller_id' => $seller->id,
            'rating' => $rating, 'comment' => $comment,
        ]);

        $seller->update(['rating' => round(Review::where('seller_id', $seller->id)->avg('rating'), 1)]);
    }

    private function offer(User $buyer, Sneaker $sneaker, int $amount, string $status = 'pending', ?int $counter = null): void
    {
        Offer::create([
            'sneaker_id' => $sneaker->id, 'user_id' => $buyer->id, 'size' => (string) $sneaker->sizes[0],
            'amount' => $amount, 'counter_amount' => $counter, 'status' => $status,
        ]);
    }
}