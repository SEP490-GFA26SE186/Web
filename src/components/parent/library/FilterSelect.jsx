import { ChevronDown } from "lucide-react";

function FilterSelect({ label, value, onChange, options, highlight = false, icon: Icon = ChevronDown }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`cursor-pointer appearance-none rounded-full border-[1.5px] border-outline bg-white py-2 pr-10 pl-4 text-sm font-semibold transition outline-none hover:bg-surface focus:border-secondary focus:ring-[3px] focus:ring-secondary/15 ${
          highlight ? "font-bold text-primary-dark" : "text-navy"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {label}: {o.label}
          </option>
        ))}
      </select>
      <Icon
        size={16}
        className={`pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 ${
          highlight ? "text-primary-dark" : "text-navy/50"
        }`}
      />
    </label>
  );
}

export default FilterSelect;
