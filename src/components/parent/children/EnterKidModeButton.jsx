import { useNavigate } from "react-router-dom";
import { Loader2, Rocket } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { useEnterKidMode } from "../../../hooks/useKid";
import useKidSessionStore from "../../../stores/kidSessionStore";
import { toast } from "../../../stores/toastStore";

// Mở Chế độ Trẻ Em cho bé (POST /auth/kid-mode/enter). Thoát ra phải nhập PIN của ba mẹ.
function EnterKidModeButton({ child, hasPin }) {
  const navigate = useNavigate();
  const start = useKidSessionStore((s) => s.start);
  const enter = useEnterKidMode();

  const onClick = () => {
    if (!hasPin) {
      toast.error("Ba mẹ cần đặt mã PIN thoát Kid Mode trước (mục bên dưới).");
      return;
    }
    enter.mutate(child.id, {
      onSuccess: ({ child: kid, session }) => {
        start(session.kidSessionToken, { id: kid.id, name: kid.name, birthDate: kid.birthDate });
        navigate(ROUTES.KID.BOOKSHELF);
      },
      onError: () => toast.error("Chưa mở được Kid Mode, ba mẹ thử lại nhé."),
    });
  };

  return (
    <button type="button" onClick={onClick} disabled={enter.isPending} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
      {enter.isPending ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />} Vào Kid Mode
    </button>
  );
}

export default EnterKidModeButton;
