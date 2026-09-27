import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import PageNavigator from "../../components/moderator/workspace/PageNavigator";
import PagePreview from "../../components/moderator/workspace/PagePreview";
import ReviewActions, { DecisionModal } from "../../components/moderator/workspace/ReviewActions";
import ReviewChecklist from "../../components/moderator/workspace/ReviewChecklist";
import ReviewContextBar from "../../components/moderator/workspace/ReviewContextBar";
import { ROUTES } from "../../constants/routes";
import { useModeratorOverview, useReviewQueue, useReviewStory, useSavePageReview, useSubmitDecision } from "../../hooks/useModerator";
import { toast } from "../../stores/toastStore";

const nowTime = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

const DECISION_MESSAGES = {
  publish: "Đã phê duyệt & xuất bản truyện lên Chợ truyện 🎉",
  revise: "Đã gửi yêu cầu chỉnh sửa tới tác giả",
  reject: "Đã từ chối xuất bản và thông báo tới tác giả",
};

function Workspace({ story, moderatorName }) {
  const navigate = useNavigate();
  const noteRef = useRef(null);
  const [pages, setPages] = useState(story.pages);
  const [history, setHistory] = useState(story.history);
  const [currentNumber, setCurrentNumber] = useState(() => (story.pages.find((p) => p.status === "pending") ?? story.pages[0]).number);
  const [highlightMissing, setHighlightMissing] = useState(false);
  const [decision, setDecision] = useState(null);

  const savePage = useSavePageReview(story.id);
  const submitDecision = useSubmitDecision(story.id);

  const page = pages.find((p) => p.number === currentNumber);
  const approvedCount = pages.filter((p) => p.status === "approved").length;
  const needsFixCount = pages.filter((p) => p.status === "needs_fix").length;
  const firstPending = pages.find((p) => p.status === "pending")?.number ?? Infinity;
  // Bắt buộc duyệt tuần tự: không mở được trang nằm sau trang chưa xử lý đầu tiên
  const isLocked = (n) => n > firstPending;

  const updatePage = (patch) => setPages((ps) => ps.map((p) => (p.number === currentNumber ? { ...p, ...patch } : p)));
  const addHistory = (type, text) =>
    setHistory((h) => [...h, { id: `h_${Date.now()}`, time: nowTime(), author: `KDV ${moderatorName}`, type, text }]);

  const goToPage = (n) => {
    setCurrentNumber(n);
    setHighlightMissing(false);
  };

  // Sau khi xử lý xong 1 trang → nhảy tới trang chưa xử lý kế tiếp
  const goToNextPending = (updatedPages) => {
    const next = updatedPages.find((p) => p.status === "pending");
    if (next) goToPage(next.number);
  };

  const handleApprove = () => {
    const missing = Object.entries(page.checks).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) {
      setHighlightMissing(true);
      document.getElementById(`check-${missing[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error(`Còn ${missing.length} tiêu chí chưa xác nhận — tích đủ checklist trước khi duyệt trang ${page.number}`);
      return;
    }
    savePage.mutate(
      { pageNumber: page.number, status: "approved", checks: page.checks, note: page.note },
      {
        onSuccess: () => {
          const updated = pages.map((p) => (p.number === page.number ? { ...p, status: "approved", flagged: false } : p));
          setPages(updated);
          addHistory("approve", `Duyệt đạt Trang ${page.number} • ${page.title}`);
          toast.success(`Trang ${page.number} đạt chuẩn Sư phạm & An toàn`);
          goToNextPending(updated);
        },
      },
    );
  };

  const handleRequestFix = () => {
    if (!page.note.trim()) {
      noteRef.current?.focus();
      noteRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Nhập ghi chú cho tác giả để biết cần sửa gì ở trang này nhé");
      return;
    }
    savePage.mutate(
      { pageNumber: page.number, status: "needs_fix", checks: page.checks, note: page.note },
      {
        onSuccess: () => {
          const updated = pages.map((p) => (p.number === page.number ? { ...p, status: "needs_fix", flagged: true } : p));
          setPages(updated);
          addHistory("fix", `Yêu cầu sửa Trang ${page.number}: ${page.note.trim()}`);
          toast.info(`Đã gắn cờ Trang ${page.number} cần tác giả chỉnh sửa`);
          goToNextPending(updated);
        },
      },
    );
  };

  const reviseSummary = pages
    .filter((p) => p.status === "needs_fix" || p.flagged)
    .map((p) => `• Trang ${p.number}: ${p.note.trim() || "(cần chỉnh sửa)"}`)
    .join("\n");

  const confirmDecision = (note) =>
    submitDecision.mutate(
      { decision, note },
      {
        onSuccess: () => {
          toast.success(DECISION_MESSAGES[decision]);
          navigate(ROUTES.MODERATOR.DASHBOARD);
        },
        onError: (err) => toast.error(err.message),
      },
    );

  return (
    <div className="flex flex-col gap-5">
      <ReviewContextBar story={story} approvedCount={approvedCount} total={pages.length} />

      <div className="grid grid-cols-12 items-start gap-6">
        <div className="col-span-12 lg:col-span-3">
          <PageNavigator pages={pages} currentNumber={currentNumber} isLocked={isLocked} onSelect={goToPage} />
        </div>
        <div className="col-span-12 lg:col-span-9 xl:col-span-5">
          <PagePreview page={page} total={pages.length} scanner={story.scanner} />
        </div>
        <div className="col-span-12 flex flex-col gap-4 xl:col-span-4">
          <ReviewChecklist
            ref={noteRef}
            page={page}
            readOnly={page.status !== "pending"}
            highlightMissing={highlightMissing}
            history={history}
            onToggleCheck={(key) => updatePage({ checks: { ...page.checks, [key]: !page.checks[key] } })}
            onReopen={() => {
              updatePage({ status: "pending" });
              addHistory("note", `Mở lại Trang ${page.number} để duyệt lại`);
            }}
            onNoteChange={(note) => updatePage({ note })}
            onFlagChange={(flagged) => updatePage({ flagged })}
          />
          <ReviewActions
            page={page}
            approvedCount={approvedCount}
            total={pages.length}
            needsFixCount={needsFixCount}
            saving={savePage.isPending}
            onApprove={handleApprove}
            onRequestFix={handleRequestFix}
            onDecision={setDecision}
          />
        </div>
      </div>

      {decision && (
        <DecisionModal
          type={decision}
          defaultNote={decision === "revise" ? reviseSummary : ""}
          onClose={() => setDecision(null)}
          onConfirm={confirmDecision}
          isPending={submitDecision.isPending}
        />
      )}
    </div>
  );
}

function ReviewWorkspacePage() {
  const { storyId } = useParams();
  const { data: overview } = useModeratorOverview();
  const { data: story, isLoading, isError, error } = useReviewStory(storyId);

  if (isLoading || !overview) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-24 rounded-stage bg-surface" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 h-[600px] rounded-stage bg-surface" />
          <div className="col-span-5 h-[600px] rounded-stage bg-surface" />
          <div className="col-span-4 h-[600px] rounded-stage bg-surface" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card mx-auto mt-16 max-w-md p-8 text-center">
        <p className="font-display text-lg font-bold">{error.message}</p>
        <Link to={ROUTES.MODERATOR.DASHBOARD} className="btn-primary mt-4">
          Về hàng chờ
        </Link>
      </div>
    );
  }

  return <Workspace key={story.id} story={story} moderatorName={overview.moderator.name} />;
}

// /moderator/workspace (không có id) → mở truyện đầu tiên trong hàng chờ
export function WorkspaceIndexRedirect() {
  const { data, isLoading } = useReviewQueue();
  if (isLoading) return <div className="h-64 animate-pulse rounded-stage bg-surface" />;
  const first = data?.items[0];
  if (!first) {
    return (
      <div className="card mx-auto mt-16 max-w-md p-8 text-center">
        <p className="font-display text-lg font-bold">Hàng chờ đang trống 🎉</p>
        <Link to={ROUTES.MODERATOR.DASHBOARD} className="btn-primary mt-4">
          Về Tổng quan
        </Link>
      </div>
    );
  }
  return <Navigate to={ROUTES.MODERATOR.workspace(first.id)} replace />;
}

export default ReviewWorkspacePage;
