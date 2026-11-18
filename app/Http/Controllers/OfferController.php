<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use App\Models\Sneaker;
use App\Notifications\AppNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Conversation;

class OfferController extends Controller
{
    /** Buyer: my offers. */
    public function index(Request $request): Response
    {
        $offers = $request->user()->offers()->with('sneaker.seller')->latest()->get()->map(fn ($o) => [
            'id' => $o->id, 'status' => $o->status, 'size' => $o->size,
            'amount' => $o->amount, 'counter' => $o->counter_amount, 'final' => $o->final_amount,
            'sold' => (bool) $o->sneaker->sold_at,
            'sneaker' => [
                'slug' => $o->sneaker->slug, 'name' => $o->sneaker->name, 'image' => $o->sneaker->image,
                'price' => $o->sneaker->price, 'seller' => $o->sneaker->seller->handle,
                'condition' => $o->sneaker->condition,
            ],
        ]);

        return Inertia::render('Offers', ['offers' => $offers]);
    }

    /** Buyer: send an offer. */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'slug' => ['required', 'exists:sneakers,slug'],
            'size' => ['required', 'string', 'max:8'],
            'amount' => ['required', 'integer', 'min:1'],
        ]);

        $sneaker = Sneaker::available()->with('seller.user')->where('slug', $data['slug'])->firstOrFail();
        $user = $request->user();

        if ($sneaker->seller->user_id === $user->id) {
            throw ValidationException::withMessages(['amount' => 'You cannot make an offer on your own pair.']);
        }
        if ($data['amount'] >= $sneaker->price) {
            throw ValidationException::withMessages(['amount' => 'Offer must be below the asking price. Use Buy now instead.']);
        }
        if ($data['amount'] < $sneaker->price * 0.5) {
            throw ValidationException::withMessages(['amount' => 'Offers must be at least 50% of the asking price (₱'.number_format($sneaker->price * 0.5).').']);
        }
        if ($user->offers()->where('sneaker_id', $sneaker->id)->whereIn('status', ['pending', 'countered'])->exists()) {
            throw ValidationException::withMessages(['amount' => 'You already have an open offer on this pair.']);
        }

        $user->offers()->create(['sneaker_id' => $sneaker->id, 'size' => $data['size'], 'amount' => $data['amount']]);

        $sneaker->seller->user?->notify(new AppNotification(
            "New offer of ₱".number_format($data['amount'])." on {$sneaker->name} from {$user->name}",
            '/dashboard',
        ));

        if ($sneaker->seller->user_id) {
            $chat = Conversation::firstOrCreate(
                ['buyer_id' => $user->id, 'seller_id' => $sneaker->seller->user_id, 'sneaker_id' => $sneaker->id],
                ['last_message_at' => now()],
            );
            $chat->messages()->create(['user_id' => $user->id, 'kind' => 'system', 'body' => 'Offer ₱'.number_format($data['amount']).' sent']);
            $chat->update(['last_message_at' => now()]);
        }

        return redirect('/offers');
    }

    /** Seller: accept, counter, or decline. */
    public function respond(Request $request, Offer $offer): RedirectResponse
    {
        $offer->load('sneaker.seller', 'buyer');
        abort_unless($offer->sneaker->seller->user_id === $request->user()->id, 403);
        abort_unless($offer->status === 'pending' && ! $offer->sneaker->sold_at, 422);

        $data = $request->validate([
            'action' => ['required', Rule::in(['accept', 'decline', 'counter'])],
            'counter_amount' => ['required_if:action,counter', 'nullable', 'integer', 'min:1'],
        ]);

        $name = $offer->sneaker->name;

        if ($data['action'] === 'accept') {
            $offer->update(['status' => 'accepted', 'final_amount' => $offer->amount]);
            $offer->buyer->notify(new AppNotification("Your offer on {$name} was accepted. Buy it at ₱".number_format($offer->amount), '/offers'));
        } elseif ($data['action'] === 'decline') {
            $offer->update(['status' => 'declined']);
            $offer->buyer->notify(new AppNotification("Your offer on {$name} was declined", '/offers'));
        } else {
            $counter = (int) $data['counter_amount'];
            if ($counter <= $offer->amount || $counter >= $offer->sneaker->price) {
                throw ValidationException::withMessages(['counter_amount' => 'Counter must be above the offer and below the asking price.']);
            }
            $offer->update(['status' => 'countered', 'counter_amount' => $counter]);
            $offer->buyer->notify(new AppNotification("The seller countered your offer on {$name} with ₱".number_format($counter), '/offers'));
        }

        return back();
    }

    /** Buyer: accept or decline the seller's counter. */
    public function reply(Request $request, Offer $offer): RedirectResponse
    {
        abort_unless($offer->user_id === $request->user()->id && $offer->status === 'countered', 403);

        $action = $request->validate(['action' => ['required', Rule::in(['accept', 'decline'])]])['action'];

        $offer->update($action === 'accept'
            ? ['status' => 'accepted', 'final_amount' => $offer->counter_amount]
            : ['status' => 'declined']);

        $offer->load('sneaker.seller.user');
        $offer->sneaker->seller->user?->notify(new AppNotification(
            $request->user()->name.($action === 'accept' ? ' accepted' : ' declined')." your counter on {$offer->sneaker->name}",
            '/dashboard',
        ));

        return back();
    }

    /** Buyer: put an accepted offer in the bag at the agreed price. */
    public function checkout(Request $request, Offer $offer): RedirectResponse
    {
        abort_unless($offer->user_id === $request->user()->id && $offer->status === 'accepted', 403);

        $sneaker = Sneaker::available()->findOrFail($offer->sneaker_id);
        $request->user()->bagItems()->updateOrCreate(
            ['sneaker_id' => $sneaker->id],
            ['size' => $offer->size, 'price' => $offer->final_amount],
        );

        return redirect('/checkout');
    }

    /** Buyer: raise a pending offer. */
public function raise(Request $request, Offer $offer): RedirectResponse
{
    abort_unless($offer->user_id === $request->user()->id && $offer->status === 'pending', 403);

    $offer->load('sneaker.seller.user');
    $amount = (int) $request->validate(['amount' => ['required', 'integer']])['amount'];

    if ($amount <= $offer->amount || $amount >= $offer->sneaker->price) {
        throw ValidationException::withMessages(['amount' => 'New offer must be above your current offer and below the asking price.']);
    }

    $offer->update(['amount' => $amount]);
    $offer->sneaker->seller->user?->notify(new AppNotification(
        "{$request->user()->name} raised their offer on {$offer->sneaker->name} to ₱".number_format($amount), '/dashboard',
    ));

    return back();
}

/** Buyer: cancel a pending offer or dismiss a declined one. */
public function destroy(Request $request, Offer $offer): RedirectResponse
{
    abort_unless($offer->user_id === $request->user()->id && in_array($offer->status, ['pending', 'declined'], true), 403);
    $offer->delete();

    return back();
}
}