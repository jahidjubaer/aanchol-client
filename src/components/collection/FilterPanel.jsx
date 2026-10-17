const SWATCH = {
  Ash: '#9a9a96',
  Blue: '#1d2340',
  Green: '#1f4d3a',
  Multicolour: 'conic-gradient(#b3262e, #e2b520, #1f4d3a, #5b2a6e, #b3262e)',
  Red: '#a3242f',
  Yellow: '#e2b520',
}

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-base-300 py-5 first:pt-0">
      <legend className="eyebrow mb-3 float-left w-full">{title}</legend>
      <div className="clear-both space-y-1">{children}</div>
    </fieldset>
  )
}

function Option({ checked, onChange, children }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={checked} onChange={onChange} />
      {children}
    </label>
  )
}

// options: { type: {id,label}[], fabric: string[], color: string[], price: {id,label}[] }
// filters: { type: string[], fabric: string[], color: string[], price: string[] }
// A group only shows when it has more than one choice.
export default function FilterPanel({ options, filters, onToggle }) {
  return (
    <div>
      {options.type.length > 1 && (
        <Group title="Type">
          {options.type.map((t) => (
            <Option key={t.id} checked={filters.type.includes(t.id)} onChange={() => onToggle('type', t.id)}>
              {t.label}
            </Option>
          ))}
        </Group>
      )}

      {options.fabric.length > 1 && (
        <Group title="Fabric">
          {options.fabric.map((f) => (
            <Option key={f} checked={filters.fabric.includes(f)} onChange={() => onToggle('fabric', f)}>
              {f}
            </Option>
          ))}
        </Group>
      )}

      {options.color.length > 1 && (
        <Group title="Colour">
          {options.color.map((c) => (
            <Option key={c} checked={filters.color.includes(c)} onChange={() => onToggle('color', c)}>
              <span className="size-4 rounded-full ring-1 ring-base-300" style={{ background: SWATCH[c] ?? '#ccc' }} />
              {c}
            </Option>
          ))}
        </Group>
      )}

      {options.price.length > 1 && (
        <Group title="Price">
          {options.price.map((r) => (
            <Option key={r.id} checked={filters.price.includes(r.id)} onChange={() => onToggle('price', r.id)}>
              {r.label}
            </Option>
          ))}
        </Group>
      )}
    </div>
  )
}
