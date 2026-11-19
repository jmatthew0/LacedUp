<?php

namespace App\Support;

use App\Models\Sneaker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ErrorPage
{
    public static function handle(Response $response, Throwable $e, Request $request): Response
    {
        $status = $response->getStatusCode();

        // 404s always use the branded page. Other errors do too, except locally, where you want the debug page.
        $show = $status === 404 || (! app()->environment('local') && in_array($status, [403, 500, 503], true));
        if (! $show) {
            return $response;
        }

        $popular = [];
        if ($status === 404) {
            try {
                $popular = Sneaker::available()->with('seller')->orderByDesc('featured')->latest()->take(3)->get()->map->toCard();
            } catch (Throwable) {
                // the page still renders without them
            }
        }

        return Inertia::render('Error', ['status' => $status, 'popular' => $popular])->toResponse($request)->setStatusCode($status);
    }
}