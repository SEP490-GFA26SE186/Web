import { PlusCircle, Sprout } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { Button, Card, EmptyState } from "../ui";

// Phụ huynh chưa tạo hồ sơ bé nào → các màn phụ thuộc bé hiện lời mời tạo hồ sơ thay vì skeleton mãi
function NoChildState() {
  return (
    <Card reveal className="mx-auto mt-12 max-w-lg">
      <EmptyState
        icon={Sprout}
        tone="secondary"
        title="Chưa có hồ sơ bé nào"
        description="Ba mẹ tạo hồ sơ cho bé để StoryWeaver gợi ý truyện, theo dõi thời gian đọc và hành trình EQ riêng cho bé nhé."
        action={
          <Button size="lg" icon={PlusCircle} to={ROUTES.PARENT.CHILDREN}>
            Tạo hồ sơ bé
          </Button>
        }
      />
    </Card>
  );
}

export default NoChildState;
