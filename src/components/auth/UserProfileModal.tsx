import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  GraduationCap,
  LogOut,
  Mail,
  RefreshCw,
  School,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentUser } from "@/lib/auth";

type UserProfileModalProps = {
  isOpen: boolean;
  user: StudentUser;
  onClose: () => void;
  onSwitchAccount: () => void;
  onLogout: () => void;
};

export function UserProfileModal({
  isOpen,
  user,
  onClose,
  onSwitchAccount,
  onLogout,
}: UserProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-[2px] animate-overlay-in motion-reduce:animate-none"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-modal-enter motion-reduce:animate-none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header with Student Badge */}
        <div className="relative border-b border-border bg-muted/40 p-5">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Đóng"
          >
            <X className="size-4" />
          </button>
          <div className="flex items-center gap-3">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-full text-base font-extrabold shadow-xs ${user.avatarColor}`}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .slice(-2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-foreground truncate">{user.name}</h2>
                <span className="rounded bg-success/15 px-1.5 py-0.5 text-[9px] font-bold text-success flex items-center gap-0.5">
                  <CheckCircle2 className="size-2.5" /> SSO
                </span>
              </div>
              <p className="text-xs font-semibold text-primary">MSSV: {user.studentId}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-3 p-5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Khoa / Viện</p>
              <p className="mt-1 font-bold text-foreground">{user.faculty}</p>
              <p className="text-[10px] text-muted-foreground">{user.program}</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Lớp sinh hoạt</p>
              <p className="mt-1 font-bold text-foreground truncate">{user.classId}</p>
              <p className="text-[10px] text-muted-foreground">{user.cohort}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-3">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">Tiến độ tích lũy:</span>
              <span className="font-bold text-foreground">
                {user.creditsAccumulated} / 135 Tín chỉ (
                {Math.round((user.creditsAccumulated / 135) * 100)}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((user.creditsAccumulated / 135) * 100, 100)}%` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-border/60 pt-2 text-[11px]">
              <span className="text-muted-foreground">Điểm tích lũy CPA:</span>
              <span className="font-extrabold text-foreground flex items-center gap-1">
                <Award className="size-3.5 text-warning" />
                {user.cpa.toFixed(2)} / 4.00 (Giỏi)
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-success/25 bg-success/5 p-3 text-[11px] text-success">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Điều kiện đăng ký hợp lệ
            </p>
            <p className="mt-0.5 text-muted-foreground text-[10px]">
              Tài khoản không bị nợ học phí và đủ điều kiện tham gia đợt đăng ký tín chỉ kỳ 2026.1.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              className="w-full justify-start text-xs font-semibold"
              onClick={() => {
                onClose();
                onSwitchAccount();
              }}
            >
              <RefreshCw className="size-3.5 mr-2" /> Đổi tài khoản sinh viên khác
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              <LogOut className="size-3.5 mr-2" /> Đăng xuất khỏi hệ thống
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
