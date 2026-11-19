<?php

namespace App\Http\Controllers;

use App\Models\Seller;
use App\Models\Sneaker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Models\Offer;
use App\Notifications\AppNotification;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    private const TYPES = ['Retro', 'Court', 'Runner', 'Trail', 'Mid', 'Slides', 'Other'];
    private const AUDIENCES = ["Men's", "Women's", 'Unisex', "Kids'"];

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80'],
            'type' => ['required', Rule::in(self::TYPES)],
            'audience' => ['required', Rule::in(self::AUDIENCES)],
            'model' => ['nullable', 'exists:sneakers,slug'],
            'size' => ['required', 'numeric', 'between:3,16'],
            'condition' => ['required', Rule::in(['Deadstock', 'Like new', 'Worn once', 'Good condition'])],
            'price' => ['required', 'integer', 'min:100', 'max:500000'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'box_included' => ['boolean'],
            'receipt_included' => ['boolean'],
        ]);

        // Use the starter photo only when the name still matches that starter model.
        $template = ! empty($data['model']) ? Sneaker::where('slug', $data['model'])->first() : null;
        $template = $template && strcasecmp($template->name, trim($data['name'])) === 0 ? $template : null;

        if (! $request->hasFile('photo') && ! $template) {
            throw ValidationException::withMessages(['photo' => 'Add a photo of your pair.']);
        }

        $user = $request->user();
        $seller = $user->seller ?? Seller::create([
            'user_id' => $user->id,
            'handle' => $this->uniqueHandle($user->name),
            'name' => $user->name,
            'bio' => 'New Laced Up seller.',
            'sales' => 0, 'rating' => 5.0, 'on_time' => 100,
        ]);

        $image = $request->hasFile('photo')
            ? Storage::url($request->file('photo')->store('listings', 'public'))
            : $template->image;

        $name = trim($data['name']);

        Sneaker::create([
            'seller_id' => $seller->id,
            'slug' => Str::slug($name).'-'.Str::lower(Str::random(5)),
            'name' => $name,
            'category' => $data['type'].' · '.$data['audience'],
            'condition' => $data['condition'],
            'price' => $data['price'],
            'sizes' => [$data['size'] + 0],
            'image' => $image,
            'box_included' => $request->boolean('box_included'),
            'receipt_included' => $request->boolean('receipt_included'),
        ]);

        return redirect('/dashboard');
    }

    public function edit(Request $request, Sneaker $sneaker): Response
{
    $this->owns($request, $sneaker);
    [$type, $audience] = array_pad(explode(' · ', $sneaker->category, 2), 2, '');

    return Inertia::render('EditListing', ['pair' => [
        'slug' => $sneaker->slug, 'name' => $sneaker->name, 'image' => $sneaker->image,
        'type' => in_array($type, self::TYPES, true) ? $type : 'Other',
        'audience' => in_array($audience, self::AUDIENCES, true) ? $audience : "Men's",
        'size' => $sneaker->sizes[0] ?? 9, 'condition' => $sneaker->condition, 'price' => $sneaker->price,
        'box' => $sneaker->box_included, 'receipt' => $sneaker->receipt_included,
    ]]);
}

public function update(Request $request, Sneaker $sneaker): RedirectResponse
{
    $this->owns($request, $sneaker);

    $data = $request->validate([
        'name' => ['required', 'string', 'min:2', 'max:80'],
        'type' => ['required', Rule::in(self::TYPES)],
        'audience' => ['required', Rule::in(self::AUDIENCES)],
        'size' => ['required', 'numeric', 'between:3,16'],
        'condition' => ['required', Rule::in(['Deadstock', 'Like new', 'Worn once', 'Good condition'])],
        'price' => ['required', 'integer', 'min:100', 'max:500000'],
        'photo' => ['nullable', 'image', 'max:4096'],
        'box_included' => ['boolean'],
        'receipt_included' => ['boolean'],
    ]);

    $name = trim($data['name']);
    $image = $sneaker->image;

    if ($request->hasFile('photo')) {
        if (str_starts_with($sneaker->image, '/storage/')) {
            Storage::disk('public')->delete(Str::after($sneaker->image, '/storage/'));
        }
        $image = Storage::url($request->file('photo')->store('listings', 'public'));
    }

    // Close open offers that are no longer below the asking price.
    if ((int) $data['price'] !== $sneaker->price) {
        Offer::with('buyer')->where('sneaker_id', $sneaker->id)
            ->whereIn('status', ['pending', 'countered'])->where('amount', '>=', $data['price'])->get()
            ->each(function ($o) use ($name) {
                $o->update(['status' => 'declined']);
                $o->buyer->notify(new AppNotification("Your offer on {$name} was closed because the price changed", '/offers'));
            });
    }

    $sneaker->update([
        'name' => $name,
        'category' => $data['type'].' · '.$data['audience'],
        'condition' => $data['condition'],
        'price' => $data['price'],
        'sizes' => [$data['size'] + 0],
        'image' => $image,
        'box_included' => $request->boolean('box_included'),
        'receipt_included' => $request->boolean('receipt_included'),
    ]);

    return redirect('/dashboard');
}

private function owns(Request $request, Sneaker $sneaker): void
{
    abort_unless($sneaker->seller?->user_id === $request->user()->id, 403);
    abort_if($sneaker->sold_at, 422, 'Sold pairs cannot be edited.');
}

    public function destroy(Request $request, Sneaker $sneaker): RedirectResponse
    {
        abort_unless($sneaker->seller?->user_id === $request->user()->id, 403);
        abort_if($sneaker->sold_at, 422, 'Sold pairs cannot be deleted.');
        $sneaker->delete();

        return back();
    }

    private function uniqueHandle(string $name): string
    {
        $base = Str::slug($name, '.') ?: 'seller';

        return Seller::where('handle', $base)->exists() ? $base.'.'.Str::lower(Str::random(4)) : $base;
    }
}