import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ROLES } from "../constants/roles";
import {
  createChild,
  deleteChild,
  getChildBookshelf,
  getChildEqJourney,
  getChildOverview,
  getChildren,
  getChildUsage,
  updateChild,
} from "../services/childService";
import useAuthStore from "../stores/authStore";
import { refreshCreditWhenDrawn } from "./useStudio";
import useParentStore from "../stores/parentStore";

export const childKeys = {
  all: ["children"],
  list: ["children", "list"],
  detail: (childId) => ["children", childId],
  overview: (childId) => ["children", childId, "overview"],
  eqJourney: (childId, weeks) => ["children", childId, "eq-journey", weeks],
  bookshelf: (childId, params) => ["children", childId, "bookshelf", params],
  usage: (childId, date) => ["children", childId, "usage", date ?? "today"],
};

// API children chỉ dành cho phụ huynh đã đăng nhập (Kid Mode demo ở Landing thì không gọi)
const useIsParent = () => useAuthStore((s) => s.isAuthenticated && s.user?.role === ROLES.PARENT);

const childrenOf = (data) => (Array.isArray(data) ? data : data?.children ?? []);
const countDrawingChildPortraits = (data) =>
  childrenOf(data).filter((c) => ["queued", "generating"].includes(c.character?.portraitStatus)).length;

export const useChildren = () => {
  const isParent = useIsParent();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: childKeys.list,
    queryFn: async () => {
      const before = countDrawingChildPortraits(queryClient.getQueryData(childKeys.list));
      const data = await getChildren();
      refreshCreditWhenDrawn(queryClient, before, countDrawingChildPortraits(data)); // chân dung của bé vẽ xong / lỗi
      return data;
    },
    enabled: isParent,
    // Chân dung của bé đang vẽ -> tải lại mỗi 4 s để thẻ nhân vật cập nhật
    refetchInterval: (query) => (countDrawingChildPortraits(query.state.data) > 0 ? 4000 : false),
  });
};

/** Bé đang được chọn trên header. Bé đã chọn không còn (bị xóa / đổi tài khoản) → lấy bé đầu tiên */
export const useSelectedChild = () => {
  const selectedChildId = useParentStore((s) => s.selectedChildId);
  const { data: children = [], isLoading } = useChildren();
  const child = children.find((c) => c.id === selectedChildId) ?? children[0] ?? null;
  return { child, children, isLoading, isEmpty: !isLoading && children.length === 0 };
};

export const useChildOverview = (childId) =>
  useQuery({ queryKey: childKeys.overview(childId), queryFn: () => getChildOverview(childId), enabled: !!childId });

export const useChildEqJourney = (childId, weeks = 8) =>
  useQuery({
    queryKey: childKeys.eqJourney(childId, weeks),
    queryFn: () => getChildEqJourney(childId, weeks),
    placeholderData: keepPreviousData,
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

