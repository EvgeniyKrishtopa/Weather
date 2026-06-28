# AI Layer

## Browser Recommendation Boundary

- Browser code calls `src/api/outfitRecommendationApi`.
- Browser requests use `outfitProfile`; Worker requests use `gender`.
- Browser code may read only public `VITE_*` values.
- `VITE_OUTFIT_RECOMMENDATION_API_URL` is optional. When it is missing, the UI
  uses local fallback recommendations.
- Worker responses must validate as `{ title, items, description }` before
  rendering.
- Failed, aborted, or invalid Worker responses must fall back safely.

## Recommendation Hook

`src/components/Info/useOutfitRecommendation` owns recommendation request state.
Keep that state out of `WeatherStore`. The hook should:

- derive the recommendation request from current weather and outfit profile
- use `AbortController` for cancellable Worker requests
- avoid showing stale recommendation responses for a newer request
- keep local fallback recommendations available
- preserve the short minimum loading behavior when relevant

## Cloudflare Worker

The Worker lives in `worker/outfit-recommendation`.

- Validate request bodies before calling Workers AI.
- Keep CORS limited to local Vite and GitHub Pages origins unless deployment
  requirements change.
- Keep model policy explicit in the Worker.
- Normalize Workers AI output before returning it.
- Return fallback recommendations if model calls fail.
- Do not expose Cloudflare tokens, account secrets, or Workers AI internals to
  Vite client code.

## Contract

Browser-facing recommendation result:

```ts
interface OutfitRecommendation {
  title: string;
  items: string[];
  description: string;
}
```

Keep frontend guards, Worker output, fallback recommendations, fixtures, and
tests aligned with this contract.
