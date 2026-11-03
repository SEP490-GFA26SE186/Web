import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Pagination, { PaginationBar } from "../../src/components/common/Pagination";

const pageLabels = () =>
  within(screen.getByRole("navigation", { name: "Phân trang" }))
    .getAllByText(/^(\d+|…)$/)
    .map((el) => el.textContent);

describe("Pagination", () => {
  it("≤ 7 trang: hiện đủ các số trang", () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />);
    expect(pageLabels()).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("nhiều trang: rút gọn bằng … quanh trang hiện tại", () => {
    render(<Pagination page={10} totalPages={20} onChange={() => {}} />);
    expect(pageLabels()).toEqual(["1", "…", "9", "10", "11", "…", "20"]);
  });

  it("đầu danh sách: không có … thừa ở bên trái", () => {
    render(<Pagination page={2} totalPages={20} onChange={() => {}} />);
    expect(pageLabels()).toEqual(["1", "2", "3", "…", "20"]);
  });

  it("đánh dấu trang hiện tại, khoá nút Trang trước ở trang 1", () => {
    render(<Pagination page={1} totalPages={3} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Trang trước" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Trang sau" })).toBeEnabled();
  });

  it("bấm số trang / Trang sau gọi onChange đúng trang", async () => {
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={3} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "3" }));
    await userEvent.click(screen.getByRole("button", { name: "Trang sau" }));
    await userEvent.click(screen.getByRole("button", { name: "Trang trước" }));

    expect(onChange.mock.calls).toEqual([[3], [3], [1]]);
  });
});

describe("PaginationBar", () => {
  it("chỉ một trang → không hiện gì", () => {
    const { container } = render(<PaginationBar page={1} totalPages={1} from={1} to={5} total={5} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("hiện khoảng đang xem và tổng số", () => {
    render(<PaginationBar page={2} totalPages={4} from={11} to={20} total={36} unit="mẫu" onChange={() => {}} />);
    expect(screen.getByText(/trong 36 mẫu/)).toHaveTextContent("Hiển thị 11–20 trong 36 mẫu");
  });
});
