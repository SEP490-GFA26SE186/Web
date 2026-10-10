import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROLES } from "../constants/roles";
import {
  createChild,
  deleteChild,
  getChild,
  getChildBookshelf,
  getChildEqReport,
  getChildOverview,
  getChildren,
  getChildUsage,
  logUsageSession,
  updateChild,
} from "../services/childService";
import useAuthStore from "../stores/authStore";
import useParentStore from "../stores/parentStore";

export const childKeys = {
  all: ["children"],
  list: ["children", "list"],
  detail: (childId) => ["children", childId],
  overview: (childId) => ["children", childId, "overview"],
  eqReport: (childId, range) => ["children", childId, "eq-report", range],
  bookshelf: (childId, params) => ["children", childId, "bookshelf", params],
  usage: (childId, date) => ["children", childId, "usage", date ?? "today"],
};

// API children chỉ dành cho phụ huynh đã đăng nhập (Kid Mode demo ở Landing thì không gọi)
const useIsParent = () => useAuthStore((s) => s.isAuthenticated && s.user?.role === ROLES.PARENT);

export const useChildren = () => {
  const isParent = useIsParent();
  return useQuery({ queryKey: childKeys.list, queryFn: getChildren, enabled: isParent });
};

/** Bé đang được chọn trên header. Bé đã chọn không còn (bị xóa / đổi tài khoản) → lấy bé đầu tiên */
export const useSelectedChild = () => {
  const selectedChildId = useParentStore((s) => s.selectedChildId);
  const { data: children = [], isLoading } = useChildren();
  const child = children.find((c) => c.id === selectedChildId) ?? children[0] ?? null;
  return { child, children, isLoading, isEmpty: !isLoading && children.length === 0 };
};

export const useChild = (childId) =>
  useQuery({ queryKey: childKeys.detail(childId), queryFn: () => getChild(childId), enabled: !!childId });

export const useChildOverview = (childId) =>
  useQuery({ queryKey: childKeys.overview(childId), queryFn: () => getChildOverview(childId), enabled: !!childId });

export const useChildEqReport = (childId, range = {}) =>
  useQuery({
    queryKey: childKeys.eqReport(childId, range),
    queryFn: () => getChildEqReport(childId, range),
    enabled: !!childId,
  });

export const useChildBookshelf = (childId, params = {}) =>
  useQuery({
    queryKey: childKeys.bookshelf(childId, params),
    queryFn: () => getChildBookshelf(childId, params),
    enabled: !!childId,
    placeholderData: (prev) => prev,
  });

/** date: "YYYY-MM-DD" theo giờ VN (giống cách DB tính usage_date). Bỏ trống = hôm nay */
export const useChildUsage = (childId, date) =>
  useQuery({ queryKey: childKeys.usage(childId, date), queryFn: () => getChildUsage(childId, date), enabled: !!childId });

// Hồ sơ bé thay đổi → danh sách, tổng quan, thời lượng đều có thể lệch → làm mới toàn bộ nhánh "children"
const useInvalidateChildren = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: childKeys.all });
};

export const useCreateChild = () => {
  const invalidate = useInvalidateChildren();
  return useMutation({ mutationFn: createChild, onSuccess: invalidate });
};

export const useUpdateChild = (childId) => {
  const invalidate = useInvalidateChildren();
  return useMutation({ mutationFn: (payload) => updateChild(childId, payload), onSuccess: invalidate });
};

export const useDeleteChild = () => {
  const invalidate = useInvalidateChildren();
  return useMutation({ mutationFn: deleteChild, onSuccess: invalidate });
};

export const useLogUsage = (childId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (session) => logUsageSession(childId, session),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: childKeys.detail(childId) }),
  });
};
