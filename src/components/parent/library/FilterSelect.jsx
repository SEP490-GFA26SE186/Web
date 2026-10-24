import { ChevronDown } from "lucide-react";
import { Select } from "../../ui";

// Bộ lọc dạng viên thuốc: nút hiện "Nhãn: lựa chọn", danh sách chỉ hiện lựa chọn.
function FilterSelect({ label, value, onChange, options, highlight = false, icon = ChevronDown }) {
  return (
    <Select
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      shape="pill"
      width="w-auto"
      highlight={highlight}
      icon={icon}
      renderValue={(o) => (
        <>
          <span className="font-normal text-navy/55">{label}:</span> {o.label}
        </>
      )}
      size="sm"
    />
  );
}

export default FilterSelect;
