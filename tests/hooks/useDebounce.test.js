import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useDebounce from "../../src/hooks/useDebounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDebounce", () => {
  it("chỉ đổi giá trị sau khi ngừng gõ đủ delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: "b" } });
    expect(result.current).toBe("b");

    rerender({ value: "bi" });
    rerender({ value: "bin" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("b");

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("bin");
  });
});
