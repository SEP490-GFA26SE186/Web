import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import DateInput from "../../src/components/common/DateInput";

function Controlled({ initial = "", onValue }) {
  const [value, setValue] = useState(initial);
  return (
    <DateInput
      id="birth"
      aria-label="Ngày sinh"
      value={value}
      onChange={(v) => {
        setValue(v);
        onValue?.(v);
      }}
    />
  );
}

const textBox = () => screen.getByLabelText("Ngày sinh");
const picker = (container) => container.querySelector('input[type="date"]');

afterEach(() => vi.restoreAllMocks());

describe("DateInput", () => {
  it("gõ số → tự chèn dấu / và đồng bộ lịch ẩn sang YYYY-MM-DD", async () => {
    const { container } = render(<Controlled />);
    await userEvent.type(textBox(), "10052020");

    expect(textBox()).toHaveValue("10/05/2020");
    expect(picker(container)).toHaveValue("2020-05-10");
  });

  it("ngày không tồn tại → lịch ẩn để trống", () => {
    const { container } = render(<Controlled initial="31/02/2020" />);
    expect(picker(container)).toHaveValue("");
  });

  it("chọn ngày trên lịch → ô nhập hiện dd/mm/yyyy", () => {
    const onValue = vi.fn();
    const { container } = render(<Controlled onValue={onValue} />);

    fireEvent.change(picker(container), { target: { value: "2019-06-15" } });

    expect(onValue).toHaveBeenLastCalledWith("15/06/2019");
    expect(textBox()).toHaveValue("15/06/2019");
  });

  it("bấm biểu tượng lịch mở date picker; trình duyệt cũ không có showPicker thì focus", async () => {
    const { container } = render(<Controlled />);
    const showPicker = vi.fn();
    picker(container).showPicker = showPicker;

    await userEvent.click(screen.getByRole("button", { name: "Chọn ngày trên lịch" }));
    expect(showPicker).toHaveBeenCalledOnce();

    picker(container).showPicker = () => {
      throw new Error("not supported");
    };
    const focus = vi.spyOn(picker(container), "focus");
    await userEvent.click(screen.getByRole("button", { name: "Chọn ngày trên lịch" }));
    expect(focus).toHaveBeenCalled();
  });
});
