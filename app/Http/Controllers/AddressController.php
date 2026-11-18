<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    private function data(Request $request): array
    {
        return $request->validate([
            'label' => ['required', Rule::in(['Home', 'Work', 'Other'])],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'postal' => ['required', 'string', 'max:10'],
            'is_default' => ['boolean'],
        ]);
    }

    private function own(Request $request, Address $address): void
    {
        abort_unless($address->user_id === $request->user()->id, 403);
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Addresses', [
            'addresses' => $request->user()->addresses()->orderByDesc('is_default')->orderBy('id')->get()->map->toCard(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->data($request);
        $user = $request->user();

        $makeDefault = ! empty($data['is_default']) || ! $user->addresses()->exists();
        if ($makeDefault) {
            $user->addresses()->update(['is_default' => false]);
        }

        $user->addresses()->create($data + ['is_default' => $makeDefault]);

        return back();
    }

    public function update(Request $request, Address $address): RedirectResponse
    {
        $this->own($request, $address);
        $data = $this->data($request);

        if (! empty($data['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        } else {
            $data['is_default'] = $address->is_default; // keep the current default unless another is chosen
        }

        $address->update($data);

        return back();
    }

    public function makeDefault(Request $request, Address $address): RedirectResponse
    {
        $this->own($request, $address);
        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return back();
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        $this->own($request, $address);
        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $request->user()->addresses()->orderBy('id')->first()?->update(['is_default' => true]);
        }

        return back();
    }
}