<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Seller;
use App\Models\Sneaker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(Request $request, ?Conversation $conversation = null): Response
    {
        $me = $request->user();
        $mine = fn () => Conversation::where(fn ($q) => $q->where('buyer_id', $me->id)->orWhere('seller_id', $me->id));

        $conversation ??= $mine()->orderByDesc('last_message_at')->first();

        if ($conversation) {
            abort_unless($conversation->includes($me), 403);
            $conversation->messages()->where('user_id', '!=', $me->id)->whereNull('read_at')->update(['read_at' => now()]);
        }

        $short = fn ($d) => $d?->isToday() ? $d->format('g:i A') : $d?->format('D');

        $threads = $mine()->with(['buyer', 'seller', 'last'])
            ->withCount(['messages as unread' => fn ($q) => $q->where('user_id', '!=', $me->id)->whereNull('read_at')])
            ->orderByDesc('last_message_at')->get()
            ->map(fn ($c) => [
                'id' => $c->id, 'name' => $c->other($me)->name,
                'last' => $c->last?->body ?? '', 'time' => $short($c->last_message_at),
                'unread' => $c->unread > 0, 'role' => $c->buyer_id === $me->id ? 'buying' : 'selling',
            ]);

        $active = null;
        if ($conversation) {
            $other = $conversation->other($me)->load('seller');
            $sneaker = $conversation->sneaker;
            $active = [
                'id' => $conversation->id, 'name' => $other->name, 'handle' => $other->seller?->handle,
                'role' => $conversation->buyer_id === $me->id ? 'buying' : 'selling',
                'sneaker' => $sneaker ? [
                    'slug' => $sneaker->slug, 'name' => $sneaker->name, 'image' => $sneaker->image,
                    'price' => $sneaker->price, 'condition' => $sneaker->condition, 'size' => $sneaker->sizes[0] ?? null,
                ] : null,
                'messages' => $conversation->messages()->oldest()->get()->map(fn ($m) => [
                    'id' => $m->id, 'mine' => $m->user_id === $me->id, 'body' => $m->body, 'kind' => $m->kind,
                    'time' => $m->created_at->format('g:i A'),
                    'day' => $m->created_at->isToday() ? 'Today' : $m->created_at->format('M j'),
                ]),
            ];
        }

        return Inertia::render('Messages', ['threads' => $threads, 'active' => $active]);
    }

    public function start(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'seller' => ['required', 'exists:sellers,handle'],
            'slug' => ['nullable', 'exists:sneakers,slug'],
        ]);

        $seller = Seller::where('handle', $data['seller'])->firstOrFail();
        if (! $seller->user_id || $seller->user_id === $request->user()->id) {
            return back();
        }

        $sneaker = ! empty($data['slug']) ? Sneaker::where('slug', $data['slug'])->first() : null;

        $conversation = Conversation::firstOrCreate(
            ['buyer_id' => $request->user()->id, 'seller_id' => $seller->user_id, 'sneaker_id' => $sneaker?->id],
            ['last_message_at' => now()],
        );

        return redirect("/messages/{$conversation->id}");
    }

    public function send(Request $request, Conversation $conversation): RedirectResponse
    {
        abort_unless($conversation->includes($request->user()), 403);

        $data = $request->validate(['body' => ['required', 'string', 'max:1000']]);

        $conversation->messages()->create(['user_id' => $request->user()->id, 'body' => trim($data['body'])]);
        $conversation->update(['last_message_at' => now()]);

        return back();
    }
}