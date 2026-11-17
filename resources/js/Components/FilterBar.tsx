interface Props {
  size: number | null; onSize: (n: number | null) => void;
  maxPrice: number; onMaxPrice: (n: number) => void;
  deadstockOnly: boolean; onDeadstock: (b: boolean) => void;
}
const sizes = [7, 8, 9, 10, 11, 12, 13, 14];

export default function FilterBar(p: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl bg-white p-4 text-xs">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-semibold">Size (US)</span>
        {sizes.map((n) => (
          <button key={n} onClick={() => p.onSize(p.size === n ? null : n)} aria-pressed={p.size === n}
            className={`h-8 w-8 rounded-lg border ${p.size === n ? 'border-ink bg-ink text-white' : 'border-stone'}`}>{n}</button>
        ))}
      </div>
      <label className="flex items-center gap-2 font-semibold">Max price
        <input type="range" min={2000} max={12000} step={250} value={p.maxPrice} onChange={(e) => p.onMaxPrice(+e.target.value)} className="accent-ember" />
        <span className="w-14 font-normal">₱{p.maxPrice.toLocaleString()}</span>
      </label>
      <label className="flex items-center gap-2 font-semibold">
        <input type="checkbox" checked={p.deadstockOnly} onChange={(e) => p.onDeadstock(e.target.checked)} className="accent-ember" /> Deadstock only
      </label>
    </div>
  );
}
