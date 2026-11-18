<?php

namespace App\Http\Controllers;

use App\Models\Dispute;
use App\Models\Seller;
use App\Notifications\AppNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class DisputeController extends Controller
{
    private const REASONS = [
        'dispute' => ['Item not as described', 'Item damaged', 'Wrong item or size', 'Not authentic', 'Not delivered'],
        'return' => ['Wrong size', 'Not as described', 'Damaged', 'Changed my mind'],
    ];

    /** Buyer: open a dispute or request a return. */
    public function store(Request $request, string $code): RedirectResponse
    {
        $order = $request->user()->orders()->with(['items', 'disputes'])->where('code', $code)->firstOrFail();

        $type = $request->validate(['type' => ['required', Rule::in(array_keys(self::REASONS))]])['type'];
        $data = $request->validate([
            'reason' => ['required', Rule::in(self::REASONS[$type])],
            'details' => ['nullable', 'string', 'max:500'],
        ]);

        $allowed = $type === 'dispute' ? $order->canDispute() : $order->canReturn();
        if (! $allowed) {
            throw ValidationException::withMessages([
                'reason' => $type === 'dispute'
                    ? 'You cannot open a dispute on this order right now.'
                    : 'Returns are only available for '.\App\Models\Order::RETURN_DAYS.' days after delivery.',
            ]);
        }

        $order->disputes()->create([
            'user_id' => $request->user()->id, 'type' => $type,
            'reason' => $data['reason'], 'details' => $data['details'] ?? null,
        ]);

        $label = $type === 'dispute' ? 'dispute' : 'return request';
        Seller::whereIn('handle', $order->items->pluck('seller')->unique())->with('user')->get()
            ->each(fn ($s) => $s->user?->notify(new AppNotification("New {$label} on order {$order->code}: {$data['reason']}", '/dashboard')));

        return back();
    }

    /** Seller: approve or decline. */
    public function respond(Request $request, Dispute $dispute): RedirectResponse
    {
        $seller = $request->user()->seller;
        $dispute->load('order.items', 'user');

        abort_unless($seller && $dispute->order->items->contains('seller', $seller->handle), 403);
        abort_unless($dispute->status === 'open', 422);

        $data = $request->validate([
            'action' => ['required', Rule::in(['approve', 'decline'])],
            'response' => ['nullable', 'string', 'max:500'],
        ]);

        $approved = $data['action'] === 'approve';
        $dispute->update(['status' => $approved ? 'approved' : 'declined', 'response' => $data['response'] ?? null]);

        $label = $dispute->type === 'dispute' ? 'dispute' : 'return request';
        $dispute->user->notify(new AppNotification(
            "Your {$label} on order {$dispute->order->code} was ".($approved ? 'approved' : 'declined'),
            "/orders/{$dispute->order->code}",
        ));

        return back();
    }
}