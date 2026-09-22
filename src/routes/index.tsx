import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  GraduationCap,
  Lightbulb,
  Loader2,
  LockKeyhole,
  MapPin,
  Search,
  ShoppingCart,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DEFAULT_STUDENT, getStoredUser, saveStoredUser, StudentUser } from "@/lib/auth";
import { LoginModal } from "@/components/auth/LoginModal";
import { UserProfileModal } from "@/components/auth/UserProfileModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniCourse AI — Trợ lý đăng ký học phần" },
      { name: "description", content: "Xây dựng thời khóa biểu không xung đột với gợi ý học phần thông minh." },
      { property: "og:title", content: "UniCourse AI — Trợ lý đăng ký học phần" },
      { property: "og:description", content: "Tìm lớp, kiểm tra xung đột và hoàn tất đăng ký học phần chính xác." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegistrationAssistant,
});

type Workload = "Nhẹ" | "Vừa" | "Nặng";
type Section = {
  id: string;
  courseCode: string;
  type: "Lý thuyết" | "Thực hành";
  lecturer: string;
  room: string;
  campus: string;
  day: number;
  start: number;
  end: number;
  startTime: string;
  endTime: string;
  enrolled: number;
  capacity: number;
};
type Course = {
  code: string;
  name: string;
  credits: number;
  faculty: string;
  workload: Workload;
  prerequisite?: string;
  prerequisitePassed: boolean;
  reasons: string[];
  description: string;
  color: string;
  sections: Section[];
};

const courses: Course[] = [
  {
    code: "IT3011", name: "Cấu trúc dữ liệu & Giải thuật", credits: 3, faculty: "CNTT", workload: "Vừa",
    prerequisite: "IT1010 · Nhập môn lập trình", prerequisitePassed: true, color: "bg-course-1 border-primary/35",
    reasons: ["Môn then chốt · Mở khóa 3 môn", "Phù hợp lộ trình K66"],
    description: "Cấu trúc dữ liệu, giải thuật tìm kiếm, sắp xếp và phân tích độ phức tạp.",
    sections: [
      { id: "IT3011-01", courseCode: "IT3011", type: "Lý thuyết", lecturer: "PGS. Trần Minh", room: "D9-301", campus: "Cơ sở 1", day: 3, start: 1, end: 3, startTime: "07:00", endTime: "09:25", enrolled: 45, capacity: 50 },
      { id: "IT3011-04", courseCode: "IT3011", type: "Lý thuyết", lecturer: "TS. Lê Hoàng", room: "D6-202", campus: "Cơ sở 1", day: 5, start: 4, end: 6, startTime: "09:30", endTime: "11:55", enrolled: 31, capacity: 50 },
    ],
  },
  {
    code: "IT3011L", name: "Thực hành Cấu trúc dữ liệu", credits: 1, faculty: "CNTT", workload: "Vừa",
    prerequisite: "Đăng ký kèm IT3011", prerequisitePassed: true, color: "bg-course-2 border-success/40",
    reasons: ["Bổ trợ IT3011", "Còn nhiều chỗ"], description: "Thực hành hiện thực và đánh giá các cấu trúc dữ liệu cốt lõi.",
    sections: [
      { id: "IT3011L-01", courseCode: "IT3011L", type: "Thực hành", lecturer: "ThS. Phạm Lan", room: "B1-402", campus: "Cơ sở 1", day: 4, start: 7, end: 9, startTime: "12:30", endTime: "14:55", enrolled: 18, capacity: 25 },
    ],
  },
  {
    code: "MI2020", name: "Xác suất thống kê", credits: 3, faculty: "Toán-Tin", workload: "Nặng",
    prerequisite: "MI1111 · Giải tích", prerequisitePassed: true, color: "bg-course-3 border-warning/45",
    reasons: ["Nền tảng cho Data Science", "Cân bằng lộ trình"], description: "Xác suất, biến ngẫu nhiên, ước lượng và kiểm định giả thuyết.",
    sections: [
      { id: "MI2020-02", courseCode: "MI2020", type: "Lý thuyết", lecturer: "TS. Nguyễn Hương", room: "D3-105", campus: "Cơ sở 1", day: 3, start: 3, end: 5, startTime: "08:40", endTime: "11:05", enrolled: 48, capacity: 60 },
      { id: "MI2020-05", courseCode: "MI2020", type: "Lý thuyết", lecturer: "PGS. Vũ Nam", room: "D5-201", campus: "Cơ sở 1", day: 2, start: 7, end: 9, startTime: "12:30", endTime: "14:55", enrolled: 55, capacity: 60 },
    ],
  },
  {
    code: "IT4010", name: "Trí tuệ nhân tạo cơ bản", credits: 3, faculty: "CNTT", workload: "Nặng",
    prerequisite: "IT3011 · Cấu trúc dữ liệu", prerequisitePassed: true, color: "bg-course-4 border-primary/35",
    reasons: ["Khớp định hướng AI", "Mở khóa 2 môn chuyên ngành"], description: "Tìm kiếm, biểu diễn tri thức, học máy và các hệ thống thông minh.",
    sections: [
      { id: "IT4010-01", courseCode: "IT4010", type: "Lý thuyết", lecturer: "PGS. Đỗ Bình", room: "D9-401", campus: "Cơ sở 1", day: 6, start: 1, end: 3, startTime: "07:00", endTime: "09:25", enrolled: 39, capacity: 50 },
    ],
  },
  {
    code: "SSH1110", name: "Kỹ năng giao tiếp", credits: 2, faculty: "Ngoại ngữ", workload: "Nhẹ",
    prerequisitePassed: true, color: "bg-course-5 border-primary/30", reasons: ["Cân bằng tải", "Môn tự chọn phù hợp"],
    description: "Rèn luyện giao tiếp học thuật, thuyết trình và làm việc nhóm hiệu quả.",
    sections: [
      { id: "SSH1110-03", courseCode: "SSH1110", type: "Lý thuyết", lecturer: "ThS. Mai Anh", room: "C2-204", campus: "Cơ sở 1", day: 7, start: 4, end: 5, startTime: "09:30", endTime: "11:05", enrolled: 22, capacity: 40 },
    ],
  },
  {
    code: "IT3320", name: "Cơ sở dữ liệu", credits: 3, faculty: "CNTT", workload: "Vừa",
    prerequisite: "IT1010 · Nhập môn lập trình", prerequisitePassed: true, color: "bg-course-6 border-warning/30", reasons: ["Nền tảng ngành", "Khớp định hướng Data"],
    description: "Mô hình dữ liệu, SQL, chuẩn hóa và thiết kế cơ sở dữ liệu quan hệ.",
    sections: [
      { id: "IT3320-01", courseCode: "IT3320", type: "Lý thuyết", lecturer: "TS. Hà Linh", room: "D8-302", campus: "Cơ sở 1", day: 4, start: 1, end: 3, startTime: "07:00", endTime: "09:25", enrolled: 50, capacity: 50 },
      { id: "IT3320-03", courseCode: "IT3320", type: "Lý thuyết", lecturer: "ThS. Bùi An", room: "D8-305", campus: "Cơ sở 2", day: 2, start: 4, end: 6, startTime: "09:30", endTime: "11:55", enrolled: 42, capacity: 50 },
    ],
  },
  {
    code: "FL1101", name: "Tiếng Anh chuyên ngành", credits: 2, faculty: "Ngoại ngữ", workload: "Nhẹ",
    prerequisite: "FL1001 · Tiếng Anh cơ sở", prerequisitePassed: false, color: "bg-course-5 border-destructive/30", reasons: ["Tăng năng lực nghề nghiệp"],
    description: "Đọc hiểu tài liệu, thuật ngữ và giao tiếp tiếng Anh trong lĩnh vực công nghệ.",
    sections: [
      { id: "FL1101-02", courseCode: "FL1101", type: "Lý thuyết", lecturer: "ThS. Lê Thu", room: "C1-303", campus: "Cơ sở 1", day: 5, start: 7, end: 8, startTime: "12:30", endTime: "14:05", enrolled: 28, capacity: 35 },
    ],
  },
];

const initialSelected = ["IT4010-01", "IT3011-04", "IT3011L-01", "MI2020-05", "SSH1110-03"];
const allSections = courses.flatMap((course) => course.sections);
const days = [2, 3, 4, 5, 6, 7];
const periods = Array.from({ length: 12 }, (_, index) => index + 1);
const dayName = (day: number) => `Thứ ${day}`;
const workloadTone: Record<Workload, string> = {
  Nhẹ: "bg-success/10 text-success", Vừa: "bg-primary/10 text-primary", Nặng: "bg-warning/15 text-warning-foreground",
};

function RegistrationAssistant() {
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(DEFAULT_STUDENT);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selected, setSelected] = useState(initialSelected);
  const [hovered, setHovered] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string[]>(["IT3011", "IT4010"]);
  const [query, setQuery] = useState("");
  const [faculty, setFaculty] = useState("Tất cả khoa");
  const [workload, setWorkload] = useState("Mọi tải học");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [tab, setTab] = useState<"catalog" | "ai">("catalog");
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [removeWarning, setRemoveWarning] = useState<string | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
    }
  }, []);

  const handleLoginSuccess = (user: StudentUser) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredUser(null);
  };

  const selectedSections = allSections.filter((section) => selected.includes(section.id));
  const credits = courses.filter((course) => selectedSections.some((section) => section.courseCode === course.code)).reduce((sum, course) => sum + course.credits, 0);
  const conflicts = useMemo(() => {
    const result: Array<[Section, Section]> = [];
    selectedSections.forEach((a, index) => selectedSections.slice(index + 1).forEach((b) => {
      if (a.day === b.day && a.start <= b.end && b.start <= a.end) result.push([a, b]);
    }));
    return result;
  }, [selected]);
  const missingTheory = selected.includes("IT3011L-01") && !selectedSections.some((section) => section.courseCode === "IT3011");
  const conflictIds = new Set(conflicts.flatMap((pair) => pair.map((item) => item.id)));

  const filteredCourses = courses.filter((course) => {
    const text = `${course.code} ${course.name} ${course.sections.map((section) => section.lecturer).join(" ")}`.toLowerCase();
    const matchesSearch = text.includes(query.toLowerCase());
    const matchesFaculty = faculty === "Tất cả khoa" || course.faculty === faculty;
    const matchesWorkload = workload === "Mọi tải học" || course.workload === workload;
    const matchesSeats = !availableOnly || course.sections.some((section) => section.enrolled < section.capacity);
    return matchesSearch && matchesFaculty && matchesWorkload && matchesSeats;
  });

  const toggleExpanded = (code: string) => setExpanded((items) => items.includes(code) ? items.filter((item) => item !== code) : [...items, code]);
  const addSection = (id: string) => setSelected((items) => items.includes(id) ? items : [...items, id]);
  const removeSection = (id: string, force = false) => {
    const section = allSections.find((item) => item.id === id);
    if (!force && section?.courseCode === "IT3011" && selected.includes("IT3011L-01")) {
      setRemoveWarning(id); return;
    }
    setSelected((items) => items.filter((item) => item !== id));
    setRemoveWarning(null);
  };
  const quickFix = () => {
    setSelected((items) => [...items.filter((id) => id !== "IT3011-01"), "IT3011-04"]);
  };
  const downloadCalendar = () => {
    const events = selectedSections.map((section) => `BEGIN:VEVENT\nSUMMARY:${section.courseCode} - ${section.id}\nLOCATION:${section.room}\nDESCRIPTION:${section.lecturer} · ${dayName(section.day)} tiết ${section.start}-${section.end}\nEND:VEVENT`).join("\n");
    const blob = new Blob([`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//UniCourse AI//VN\n${events}\nEND:VCALENDAR`], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "thoi-khoa-bieu-2026-1.ics"; anchor.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        credits={credits}
        conflicts={conflicts.length + (missingTheory ? 1 : 0)}
        count={selected.length}
        currentUser={currentUser}
        onCart={() => setCartOpen(true)}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />
      <main className="mx-auto grid max-w-[1920px] grid-cols-1 xl:grid-cols-[minmax(480px,45%)_minmax(620px,55%)]">
        <section className="border-b border-border bg-card xl:h-[calc(100vh-80px)] xl:overflow-hidden xl:border-r xl:border-b-0">
          <div className="border-b border-border px-5 py-5 lg:px-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Khám phá học phần</p><h1 className="mt-1 text-2xl font-extrabold">Chọn môn cho kỳ mới</h1></div>
              <span className="text-xs font-semibold text-muted-foreground">{filteredCourses.length} môn phù hợp</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm outline-none transition-all duration-200 ease-out focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="Tìm mã môn, tên môn hoặc giảng viên..." />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <FilterSelect value={faculty} onChange={setFaculty} label="Khoa" options={["Tất cả khoa", "CNTT", "Toán-Tin", "Ngoại ngữ"]} />
              <FilterSelect value={workload} onChange={setWorkload} label="Tải học" options={["Mọi tải học", "Nhẹ", "Vừa", "Nặng"]} />
              <label className={`flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-all duration-200 ease-out hover:border-primary/40 ${availableOnly ? "border-primary bg-secondary text-primary shadow-xs" : "border-border bg-card text-muted-foreground"}`}>
                <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} className="size-3.5 accent-primary transition-transform duration-150" /> Còn chỗ
              </label>
            </div>
          </div>
          <div className="flex border-b border-border bg-card px-5 lg:px-6">
            <button onClick={() => setTab("catalog")} className={`relative flex h-12 flex-1 items-center justify-center gap-2 text-sm font-bold transition-colors duration-200 ease-out ${tab === "catalog" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}><BookOpen className="size-4" /> Tất cả môn học {tab === "catalog" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transition-all duration-300" />}</button>
            <button onClick={() => setTab("ai")} className={`relative flex h-12 flex-1 items-center justify-center gap-2 text-sm font-bold transition-colors duration-200 ease-out ${tab === "ai" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}><Sparkles className="size-4" /> Gợi ý thông minh {tab === "ai" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transition-all duration-300" />}</button>
          </div>
          <div className="scrollbar-thin space-y-3 overflow-y-auto bg-background/60 p-4 lg:p-5 xl:h-[calc(100%-207px)]">
            {tab === "ai" && (
              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-secondary p-4 animate-list-enter motion-reduce:animate-none">
                <div className="rounded-md bg-primary p-2 text-primary-foreground">
                  <Bot className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {currentUser ? `Lộ trình dành riêng cho ${currentUser.name}` : "Lộ trình đào tạo thông minh"}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {currentUser
                      ? `Dựa trên ngành ${currentUser.faculty}, MSSV ${currentUser.studentId} và tiến độ tích lũy ${currentUser.creditsAccumulated}/135 TC.`
                      : "Đăng nhập bằng tài khoản email trường (@sis.edu.vn) để nhận gợi ý học phần theo tiến độ ngành của bạn."}
                  </p>
                </div>
              </div>
            )}
            {filteredCourses.map((course, idx) => (
              <div
                key={`${course.code}-${query}-${faculty}-${workload}-${availableOnly}-${tab}`}
                className="animate-card-enter motion-reduce:animate-none"
                style={{ animationDelay: `${Math.min(idx * 60, 360)}ms` }}
              >
                <CourseCard
                  course={course}
                  ai={tab === "ai"}
                  open={expanded.includes(course.code)}
                  selected={selected}
                  onToggle={() => toggleExpanded(course.code)}
                  onAdd={addSection}
                  onRemove={removeSection}
                  onHover={setHovered}
                />
              </div>
            ))}
            {filteredCourses.length === 0 && <div className="py-16 text-center animate-page-enter motion-reduce:animate-none"><Search className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-bold">Không tìm thấy môn phù hợp</p><p className="mt-1 text-xs text-muted-foreground">Hãy thử thay đổi từ khóa hoặc bộ lọc.</p></div>}
          </div>
        </section>

        <section className="bg-background p-4 lg:p-6 xl:h-[calc(100vh-80px)] xl:overflow-y-auto">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Lịch học trực quan</p><h2 className="mt-1 text-2xl font-extrabold">Thời khóa biểu của bạn</h2></div>
            <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-muted-foreground"><Legend tone="bg-course-1 border-primary/40" label="Đã chọn" /><Legend tone="border-dashed border-muted-foreground/50 bg-muted/60" label="Xem thử" /><Legend tone="border-2 border-destructive bg-destructive/10" label="Xung đột" /></div>
          </div>
          <Timetable selected={selectedSections} preview={allSections.find((section) => section.id === hovered) ?? null} conflictIds={conflictIds} />
          {(conflicts.length > 0 || missingTheory || credits > 24) ? (
            <div className="sticky bottom-3 z-20 mt-4 space-y-2 animate-alert-enter motion-reduce:animate-none">
              {conflicts.map(([a, b]) => <div key={`${a.id}-${b.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-card p-3 shadow-lg transition-all duration-200"><div className="flex items-start gap-2 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" /><span><strong>{a.id}</strong> trùng lịch với <strong>{b.id}</strong> vào {dayName(a.day)}, tiết {Math.max(a.start, b.start)}–{Math.min(a.end, b.end)}.</span></div>{a.courseCode === "IT3011" || b.courseCode === "IT3011" ? <Button size="sm" variant="danger" onClick={quickFix}><Zap className="size-3.5" /> Đổi sang IT3011-04</Button> : null}</div>)}
              {missingTheory && <AlertBar text="Lớp thực hành IT3011L-01 yêu cầu đăng ký kèm lớp lý thuyết IT3011." />}
              {credits > 24 && <AlertBar text={`Bạn đang vượt quá hạn mức 24 tín chỉ (${credits}/24).`} />}
            </div>
          ) : <div className="mt-4 flex items-center gap-3 rounded-lg border border-success/25 bg-success/5 p-3 animate-page-enter motion-reduce:animate-none"><CheckCircle2 className="size-5 text-success" /><div><p className="text-sm font-bold">Lịch học đang hoàn hảo</p><p className="text-xs text-muted-foreground">Không có xung đột và khối lượng học tập ở mức phù hợp.</p></div></div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:shadow-sm">
            <div>
              <p className="text-sm font-bold">Sẵn sàng ghi danh?</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Hệ thống sẽ chạy kiểm tra thông minh trước khi xác nhận.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setCartOpen(true)}>
                <ShoppingCart className="size-4" /> Giỏ hàng ({selected.length})
              </Button>
              <Button
                onClick={() => {
                  if (!currentUser) {
                    setLoginModalOpen(true);
                    return;
                  }
                  setConfirmOpen(true);
                }}
              >
                <CheckCircle2 className="size-4" /> Đăng ký học phần
              </Button>
            </div>
          </div>
        </section>
      </main>

      {cartOpen && (
        <CartDrawer
          sections={selectedSections}
          credits={credits}
          conflicts={conflicts.length}
          missingTheory={missingTheory}
          currentUser={currentUser}
          onClose={() => setCartOpen(false)}
          onRemove={removeSection}
          onRequireLogin={() => {
            setCartOpen(false);
            setLoginModalOpen(true);
          }}
          onConfirm={() => {
            if (!currentUser) {
              setCartOpen(false);
              setLoginModalOpen(true);
              return;
            }
            setCartOpen(false);
            setConfirmOpen(true);
          }}
        />
      )}
      {confirmOpen && (
        <ConfirmModal
          selectedSections={selectedSections}
          credits={credits}
          conflicts={conflicts}
          missingTheory={missingTheory}
          onClose={() => setConfirmOpen(false)}
          onQuickFix={quickFix}
          onDownload={downloadCalendar}
        />
      )}
      {removeWarning && (
        <WarningModal
          onCancel={() => setRemoveWarning(null)}
          onConfirm={() => {
            removeSection(removeWarning, true);
            setSelected((items) => items.filter((id) => id !== "IT3011L-01"));
          }}
        />
      )}

      {/* University SSO Login Simulation Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Student Profile & Academic Progress Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={profileModalOpen}
          user={currentUser}
          onClose={() => setProfileModalOpen(false)}
          onSwitchAccount={() => {
            setProfileModalOpen(false);
            setLoginModalOpen(true);
          }}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

function Header({
  credits,
  conflicts,
  count,
  currentUser,
  onCart,
  onOpenLogin,
  onOpenProfile,
}: {
  credits: number;
  conflicts: number;
  count: number;
  currentUser: StudentUser | null;
  onCart: () => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center gap-4 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex min-w-[280px] flex-1 items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform duration-200 hover:scale-105">
          <GraduationCap className="size-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-base font-extrabold">UniCourse AI</p>
            <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
              Học kỳ 2026.1
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Intelligent Registration Assistant</p>
        </div>
      </div>
      <div className="order-3 flex w-full items-center gap-2 overflow-x-auto lg:order-2 lg:w-auto">
        <StatPill
          icon={<BookOpen className="size-4 text-primary" />}
          title={`${credits} / 24 Tín chỉ`}
          detail={
            <div className="mt-1 h-1 w-24 overflow-hidden rounded bg-muted">
              <div
                className={`h-full transition-all duration-300 ease-out ${
                  credits > 24 ? "bg-destructive" : "bg-success"
                }`}
                style={{ width: `${Math.min((credits / 24) * 100, 100)}%` }}
              />
            </div>
          }
        />
        <StatPill
          icon={<Lightbulb className="size-4 text-warning" />}
          title="Vừa phải"
          detail={<span className="text-[10px] text-muted-foreground">Balanced</span>}
        />
        <StatPill
          icon={
            conflicts ? (
              <AlertTriangle className="size-4 text-destructive" />
            ) : (
              <CheckCircle2 className="size-4 text-success" />
            )
          }
          title={conflicts ? `${conflicts} xung đột` : "0 Xung đột"}
          detail={
            <span
              className={`text-[10px] transition-colors duration-200 ${
                conflicts ? "text-destructive" : "text-success"
              }`}
            >
              {conflicts ? "Cần xử lý" : "Lịch hợp lệ"}
            </span>
          }
        />
      </div>
      <div className="order-2 ml-auto flex items-center gap-2 lg:order-3 lg:ml-0">
        <Button variant="outline" onClick={onCart}>
          <ShoppingCart className="size-4" />
          <span className="hidden sm:inline">Giỏ đăng ký</span>
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground transition-transform duration-200">
            {count}
          </span>
        </Button>

        {currentUser ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-card/70 px-2.5 py-1.5 text-left transition-all duration-150 hover:border-primary/40 hover:bg-muted/40 cursor-pointer group shadow-2xs"
            title="Nhấn để xem thông tin sinh viên & học vụ"
          >
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-transform duration-200 group-hover:scale-105 shadow-2xs ${currentUser.avatarColor}`}
            >
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .slice(-2)
                .join("")}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold leading-none text-foreground">{currentUser.name}</p>
                <span className="rounded bg-success/15 px-1 py-0.5 text-[8px] font-bold text-success leading-none">
                  SSO
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-none text-muted-foreground">
                {currentUser.faculty} · {currentUser.studentId}
              </p>
            </div>
          </button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onOpenLogin}
            className="font-bold flex items-center gap-1.5 shadow-xs"
          >
            <LockKeyhole className="size-3.5" />
            <span>Đăng nhập SSO</span>
          </Button>
        )}
      </div>
    </header>
  );
}

function StatPill({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: React.ReactNode }) {
  return <div className="flex min-w-max items-center gap-2 rounded-md border border-border bg-background px-3 py-2 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xs hover:border-primary/30 motion-reduce:hover:translate-y-0">{icon}<div><p className="text-xs font-bold">{title}</p>{detail}</div></div>;
}

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: string[] }) {
  return <label className="relative"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-md border border-border bg-card pl-3 pr-8 text-xs font-semibold text-muted-foreground outline-none transition-all duration-200 ease-out hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/15">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground transition-transform duration-200" /></label>;
}

function CourseCard({ course, ai, open, selected, onToggle, onAdd, onRemove, onHover }: { course: Course; ai: boolean; open: boolean; selected: string[]; onToggle: () => void; onAdd: (id: string) => void; onRemove: (id: string) => void; onHover: (id: string | null) => void }) {
  const isSelected = course.sections.some((section) => selected.includes(section.id));
  const selectedCount = course.sections.filter((section) => selected.includes(section.id)).length;

  return (
    <article
      className={`overflow-hidden rounded-lg border transition-all duration-200 ease-out hover:-translate-y-[3px] hover:shadow-md motion-reduce:hover:translate-y-0 ${
        isSelected
          ? "border-primary/50 bg-card ring-1 ring-primary/20 shadow-xs"
          : "border-border bg-card shadow-xs hover:border-primary/40"
      }`}
    >
      <button onClick={onToggle} className="flex w-full items-start gap-3 p-4 text-left transition-colors duration-150 hover:bg-muted/30">
        <div
          className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md text-xs font-extrabold transition-all duration-200 ${
            isSelected
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-secondary text-primary"
          }`}
        >
          {isSelected ? <Check className="size-5 animate-check-pop" /> : course.code.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold text-primary">{course.code}</span>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{course.credits} TC</span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${workloadTone[course.workload]}`}>{course.workload}</span>
            {isSelected && (
              <span className="animate-check-pop rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary transition-all">
                Đã chọn {selectedCount} lớp
              </span>
            )}
          </div>
          <h3 className="mt-1 text-sm font-bold leading-snug">{course.name}</h3>
          {ai && (
            <div className="mt-2 flex flex-wrap gap-1">
              {course.reasons.map((reason) => (
                <span key={reason} className="rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-primary transition-transform duration-150 hover:scale-102">
                  <Sparkles className="mr-1 inline size-3" />{reason}
                </span>
              ))}
            </div>
          )}
          <div className={`mt-2 flex items-center gap-1.5 text-[10px] font-semibold transition-colors duration-150 ${course.prerequisitePassed ? "text-success" : "text-destructive"}`}>
            {course.prerequisite ? course.prerequisitePassed ? <Check className="size-3" /> : <LockKeyhole className="size-3" /> : <Check className="size-3" />}
            {course.prerequisite ?? "Không yêu cầu tiên quyết"}
          </div>
        </div>
        {open ? <ChevronDown className="mt-1 size-4 text-muted-foreground transition-transform duration-200" /> : <ChevronRight className="mt-1 size-4 text-muted-foreground transition-transform duration-200" />}
      </button>
      {open && (
        <div className="animate-list-enter border-t border-border bg-background/50 px-4 py-3 motion-reduce:animate-none">
          <p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">{course.description}</p>
          <div className="space-y-2">
            {course.sections.map((section) => (
              <SectionRow
                key={section.id}
                section={section}
                selected={selected.includes(section.id)}
                blocked={!course.prerequisitePassed || section.enrolled >= section.capacity}
                onAdd={() => onAdd(section.id)}
                onRemove={() => onRemove(section.id)}
                onHover={onHover}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function SectionRow({ section, selected, blocked, onAdd, onRemove, onHover }: { section: Section; selected: boolean; blocked: boolean; onAdd: () => void; onRemove: () => void; onHover: (id: string | null) => void }) {
  const [loading, setLoading] = useState(false);
  const occupancy = Math.round(section.enrolled / section.capacity * 100);

  const handleAdd = () => {
    if (blocked || loading) return;
    setLoading(true);
    setTimeout(() => {
      onAdd();
      setLoading(false);
    }, 220);
  };

  return <div onMouseEnter={() => onHover(section.id)} onMouseLeave={() => onHover(null)} className={`rounded-md border p-3 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xs motion-reduce:hover:translate-y-0 ${selected ? "border-primary/40 bg-secondary/60 shadow-xs ring-1 ring-primary/10" : "border-border bg-card hover:border-primary/35"}`}>
    <div className="flex flex-wrap items-start justify-between gap-2"><div><div className="flex items-center gap-2"><p className="text-xs font-extrabold">{section.id}</p><span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">{section.type}</span></div><p className="mt-1.5 text-[11px] font-semibold text-foreground">{section.lecturer}</p></div><div className="text-right"><p className="text-[10px] font-bold">{section.enrolled}/{section.capacity} chỗ</p><div className="mt-1 h-1 w-16 overflow-hidden rounded bg-muted"><div className={`h-full transition-all duration-300 ease-out ${occupancy >= 100 ? "bg-destructive" : occupancy > 85 ? "bg-warning" : "bg-success"}`} style={{ width: `${occupancy}%` }} /></div></div></div>
    <div className="mt-2 grid gap-1 text-[10px] text-muted-foreground sm:grid-cols-2"><span className="flex items-center gap-1"><CalendarDays className="size-3" />{dayName(section.day)}, Tiết {section.start}–{section.end}</span><span className="flex items-center gap-1"><Clock3 className="size-3" />{section.startTime}–{section.endTime}</span><span className="flex items-center gap-1"><MapPin className="size-3" />{section.room}</span><span className="flex items-center gap-1"><Building2 className="size-3" />{section.campus}</span></div>
    <div className="mt-3 flex justify-end">
      {selected ? (
        <Button size="sm" variant="outline" onClick={onRemove} className="transition-all duration-200 hover:border-destructive/40 hover:text-destructive">
          <Check className="size-3.5 text-success animate-check-pop" /> Đã thêm
        </Button>
      ) : (
        <Button size="sm" onClick={handleAdd} disabled={blocked || loading} className="transition-all duration-200 ease-out">
          {loading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" /> Đang thêm...
            </>
          ) : blocked ? (
            section.enrolled >= section.capacity ? "Đã đầy" : "Chưa đủ điều kiện"
          ) : (
            "Thêm vào giỏ"
          )}
        </Button>
      )}
    </div>
  </div>;
}

function Timetable({ selected, preview, conflictIds }: { selected: Section[]; preview: Section | null; conflictIds: Set<string> }) {
  return <div className="scrollbar-thin overflow-x-auto rounded-lg border border-border bg-card shadow-sm"><div className="min-w-[720px]">
    <div className="grid grid-cols-[58px_repeat(6,1fr)] border-b border-border bg-muted/60"><div className="p-3 text-center text-[10px] font-bold text-muted-foreground">TIẾT</div>{days.map((day) => <div key={day} className="border-l border-border p-3 text-center"><p className="text-xs font-extrabold">{dayName(day)}</p><p className="mt-0.5 text-[9px] text-muted-foreground">22/09</p></div>)}</div>
    <div className="relative grid grid-cols-[58px_repeat(6,1fr)]">
      <div>{periods.map((period) => <div key={period} className="flex h-12 items-center justify-center border-b border-border text-[10px] font-bold text-muted-foreground">{period}<span className="ml-1 font-normal">{period === 1 ? "07:00" : period === 4 ? "09:30" : period === 7 ? "12:30" : period === 10 ? "15:00" : ""}</span></div>)}</div>
      {days.map((day) => <div key={day} className="relative border-l border-border">{periods.map((period) => <div key={period} className="h-12 border-b border-border bg-card odd:bg-background/35" />)}{selected.filter((section) => section.day === day).map((section) => <ScheduleBlock key={section.id} section={section} conflict={conflictIds.has(section.id)} />)}{preview && preview.day === day && !selected.some((section) => section.id === preview.id) && <ScheduleBlock section={preview} preview />}</div>)}
    </div>
  </div></div>;
}

function ScheduleBlock({ section, conflict = false, preview = false }: { section: Section; conflict?: boolean; preview?: boolean }) {
  const course = courses.find((item) => item.code === section.courseCode);
  return <div className={`absolute inset-x-1 z-10 overflow-hidden rounded-md border p-2 text-[9px] transition-all duration-200 ease-out ${conflict ? "border-2 border-destructive bg-destructive/10 shadow-md animate-alert-enter motion-reduce:animate-none" : preview ? "border-2 border-dashed border-muted-foreground/50 bg-muted/70 opacity-85 transition-opacity duration-200" : course?.color ?? "bg-course-1"} hover:shadow-xs`} style={{ top: `${(section.start - 1) * 48 + 4}px`, height: `${(section.end - section.start + 1) * 48 - 8}px` }}><div className="flex items-center justify-between gap-1"><strong className="text-[10px]">{section.courseCode}</strong>{conflict && <AlertTriangle className="size-3.5 shrink-0 text-destructive" />}{preview && <span className="rounded bg-card/80 px-1 py-0.5 text-[8px] font-bold">XEM THỬ</span>}</div><p className="mt-1 truncate font-semibold">{section.room}</p><p className="mt-0.5 truncate opacity-70">{section.lecturer.replace("PGS. ", "").replace("TS. ", "")}</p><p className="mt-1 font-bold">Tiết {section.start}–{section.end}</p></div>;
}

function Legend({ tone, label }: { tone: string; label: string }) { return <span className="flex items-center gap-1.5"><i className={`size-3 rounded-sm border ${tone}`} />{label}</span>; }
function AlertBar({ text }: { text: string }) { return <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-card p-3 text-sm shadow-lg animate-alert-enter motion-reduce:animate-none"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" /><span>{text}</span></div>; }

function CartDrawer({
  sections,
  credits,
  conflicts,
  missingTheory,
  currentUser,
  onClose,
  onRemove,
  onRequireLogin,
  onConfirm,
}: {
  sections: Section[];
  credits: number;
  conflicts: number;
  missingTheory: boolean;
  currentUser: StudentUser | null;
  onClose: () => void;
  onRemove: (id: string) => void;
  onRequireLogin: () => void;
  onConfirm: () => void;
}) {
  const [exiting, setExiting] = useState(false);
  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onClose, 200);
  };
  const valid = conflicts === 0 && !missingTheory && credits <= 24 && sections.length > 0;

  return (
    <div
      className={`fixed inset-0 z-40 flex justify-end bg-foreground/30 backdrop-blur-[2px] ${
        exiting ? "animate-overlay-exit" : "animate-overlay-in"
      } motion-reduce:animate-none`}
      onMouseDown={handleClose}
    >
      <aside
        className={`flex h-full w-full max-w-md flex-col bg-card shadow-2xl ${
          exiting ? "animate-drawer-exit" : "animate-drawer-enter"
        } motion-reduce:animate-none`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <p className="text-lg font-extrabold">Giỏ đăng ký</p>
            <p className="text-xs text-muted-foreground">
              {sections.length} lớp · {credits}/24 tín chỉ
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Đóng" onClick={handleClose}>
            <X className="size-5" />
          </Button>
        </div>
        <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-5">
          {sections.map((section) => {
            const course = courses.find((item) => item.code === section.courseCode);
            return (
              <div
                key={section.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs motion-reduce:hover:translate-y-0"
              >
                <div className={`size-2 self-stretch rounded-sm border ${course?.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold">
                    {section.id} · {course?.credits} TC
                  </p>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">{course?.name}</p>
                  <p className="mt-1 text-[10px] font-semibold">
                    {dayName(section.day)}, tiết {section.start}–{section.end} · {section.room}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Xóa ${section.id}`}
                  onClick={() => onRemove(section.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            );
          })}
          {sections.length === 0 && (
            <div className="py-20 text-center animate-page-enter motion-reduce:animate-none">
              <ShoppingCart className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-bold">Giỏ đăng ký đang trống</p>
            </div>
          )}
        </div>
        <div className="border-t border-border p-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tổng khối lượng</span>
            <strong>{credits} tín chỉ</strong>
          </div>
          {!valid && sections.length > 0 && (
            <p className="mb-3 flex gap-2 text-xs text-destructive animate-alert-enter motion-reduce:animate-none">
              <AlertTriangle className="size-4 shrink-0" />
              Hãy xử lý mọi xung đột trước khi xác nhận.
            </p>
          )}
          {!currentUser ? (
            <Button className="w-full font-bold" onClick={onRequireLogin}>
              <LockKeyhole className="size-4 mr-2" /> Đăng nhập để ghi danh
            </Button>
          ) : (
            <Button className="w-full font-bold" onClick={onConfirm} disabled={!valid}>
              <CheckCircle2 className="size-4 mr-2" /> Xác nhận ghi danh
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}

type CheckingStepId = "prereq" | "schedule" | "credits" | "capacity";
type CheckingStatus = "pending" | "checking" | "passed" | "failed";

interface CheckingStepItem {
  id: CheckingStepId;
  label: string;
  detail: string;
}

const CHECK_STEPS: CheckingStepItem[] = [
  { id: "prereq", label: "Kiểm tra học phần tiên quyết", detail: "Rà soát điều kiện tiên quyết và học phần song hành" },
  { id: "schedule", label: "Kiểm tra lịch học", detail: "Phát hiện xung đột trùng lịch giữa các lớp học phần" },
  { id: "credits", label: "Kiểm tra giới hạn tín chỉ", detail: "Đối chiếu hạn mức đăng ký tối đa 24 tín chỉ" },
  { id: "capacity", label: "Kiểm tra tình trạng lớp", detail: "Xác thực sĩ số còn chỗ và liên kết lý thuyết - thực hành" },
];

function ConfirmModal({
  selectedSections,
  credits,
  conflicts,
  missingTheory,
  onClose,
  onQuickFix,
  onDownload,
}: {
  selectedSections: Section[];
  credits: number;
  conflicts: Array<[Section, Section]>;
  missingTheory: boolean;
  onClose: () => void;
  onQuickFix: () => void;
  onDownload: () => void;
}) {
  const [phase, setPhase] = useState<"checking" | "success" | "failed">("checking");
  const [stepStatuses, setStepStatuses] = useState<Record<CheckingStepId, CheckingStatus>>({
    prereq: "checking",
    schedule: "pending",
    credits: "pending",
    capacity: "pending",
  });
  const [failureInfo, setFailureInfo] = useState<{
    title: string;
    subtitle: string;
    conflictPair?: [Section, Section];
    customText?: string;
    canQuickFix?: boolean;
  } | null>(null);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    let t4: ReturnType<typeof setTimeout>;
    let tEnd: ReturnType<typeof setTimeout>;

    // Bước 1: Kiểm tra học phần tiên quyết (280ms)
    t1 = setTimeout(() => {
      const failedPrereqCourse = courses.find(
        (c) => selectedSections.some((s) => s.courseCode === c.code) && !c.prerequisitePassed
      );

      if (failedPrereqCourse) {
        setStepStatuses((prev) => ({ ...prev, prereq: "failed" }));
        setFailureInfo({
          title: "Chưa đủ điều kiện tiên quyết",
          subtitle: `Học phần ${failedPrereqCourse.name} (${failedPrereqCourse.code}) yêu cầu môn tiên quyết chưa hoàn thành.`,
          customText: `Yêu cầu: ${failedPrereqCourse.prerequisite ?? "Học phần tiên quyết bắt buộc"}. Vui lòng đăng ký học phần tiên quyết trước.`,
        });
        tEnd = setTimeout(() => setPhase("failed"), 350);
        return;
      }

      setStepStatuses((prev) => ({ ...prev, prereq: "passed", schedule: "checking" }));

      // Bước 2: Kiểm tra lịch học / trùng lịch (300ms)
      t2 = setTimeout(() => {
        if (conflicts.length > 0) {
          const [a, b] = conflicts[0];
          setStepStatuses((prev) => ({ ...prev, schedule: "failed" }));
          setFailureInfo({
            title: "Trùng lịch học",
            subtitle: "Phát hiện xung đột thời gian giữa 2 lớp học phần trong thời khóa biểu.",
            conflictPair: [a, b],
            canQuickFix: a.courseCode === "IT3011" || b.courseCode === "IT3011",
          });
          tEnd = setTimeout(() => setPhase("failed"), 350);
          return;
        }

        setStepStatuses((prev) => ({ ...prev, schedule: "passed", credits: "checking" }));

        // Bước 3: Kiểm tra giới hạn tín chỉ (300ms)
        t3 = setTimeout(() => {
          if (credits > 24) {
            setStepStatuses((prev) => ({ ...prev, credits: "failed" }));
            setFailureInfo({
              title: "Vượt quá giới hạn tín chỉ",
              subtitle: `Tổng số tín chỉ đăng ký (${credits} TC) vượt quá hạn mức tối đa 24 tín chỉ/kỳ.`,
              customText: `Hiện tại bạn đang chọn ${credits}/24 tín chỉ (vượt ${credits - 24} TC). Vui lòng bỏ bớt học phần.`,
            });
            tEnd = setTimeout(() => setPhase("failed"), 350);
            return;
          }

          if (selectedSections.length === 0) {
            setStepStatuses((prev) => ({ ...prev, credits: "failed" }));
            setFailureInfo({
              title: "Giỏ đăng ký đang trống",
              subtitle: "Bạn chưa chọn lớp học phần nào để ghi danh.",
              customText: "Vui lòng chọn ít nhất 1 lớp học phần trước khi thực hiện đăng ký.",
            });
            tEnd = setTimeout(() => setPhase("failed"), 350);
            return;
          }

          setStepStatuses((prev) => ({ ...prev, credits: "passed", capacity: "checking" }));

          // Bước 4: Kiểm tra tình trạng lớp & ràng buộc LT-TH (300ms)
          t4 = setTimeout(() => {
            if (missingTheory) {
              setStepStatuses((prev) => ({ ...prev, capacity: "failed" }));
              setFailureInfo({
                title: "Thiếu học phần lý thuyết song hành",
                subtitle: "Lớp thực hành IT3011L-01 bắt buộc phải đăng ký kèm lớp lý thuyết IT3011.",
                customText: "Quy chế yêu cầu sinh viên phải hoàn thành hoặc đăng ký đồng thời học phần lý thuyết cùng kỳ.",
              });
              tEnd = setTimeout(() => setPhase("failed"), 350);
              return;
            }

            const fullSection = selectedSections.find((s) => s.enrolled >= s.capacity);
            if (fullSection) {
              setStepStatuses((prev) => ({ ...prev, capacity: "failed" }));
              setFailureInfo({
                title: "Lớp học phần đã đầy chỗ",
                subtitle: `Lớp ${fullSection.id} đã đủ sĩ số tối đa (${fullSection.enrolled}/${fullSection.capacity} chỗ).`,
                customText: "Vui lòng chuyển sang một lớp học phần khác còn chỗ trống.",
              });
              tEnd = setTimeout(() => setPhase("failed"), 350);
              return;
            }

            setStepStatuses((prev) => ({ ...prev, capacity: "passed" }));
            tEnd = setTimeout(() => setPhase("success"), 320);
          }, 300);
        }, 300);
      }, 300);
    }, 280);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, []);

  return (
    <Modal onClose={onClose}>
      {(handleClose) => (
        <div className="animate-page-enter motion-reduce:animate-none">
          {phase === "checking" && (
            <div>
              <div className="flex items-center justify-between border-b border-border p-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs">
                    <Sparkles className="size-4 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-foreground">Smart Registration</h2>
                    <p className="text-[11px] text-muted-foreground">Đang kiểm tra điều kiện đăng ký thông minh...</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="size-5" />
                </Button>
              </div>

              <div className="space-y-2.5 p-5">
                {CHECK_STEPS.map((step) => {
                  const status = stepStatuses[step.id];
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start justify-between gap-3 rounded-lg border p-3 transition-all duration-200 ${
                        status === "checking"
                          ? "border-primary/40 bg-primary/5 shadow-xs"
                          : status === "passed"
                          ? "border-success/30 bg-success/5"
                          : status === "failed"
                          ? "border-destructive/40 bg-destructive/5"
                          : "border-border bg-card/60 opacity-60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {status === "checking" && (
                            <Loader2 className="size-4 animate-spin text-primary" />
                          )}
                          {status === "passed" && (
                            <CheckCircle2 className="size-4 text-success animate-check-pop" />
                          )}
                          {status === "failed" && (
                            <AlertTriangle className="size-4 text-destructive animate-check-pop" />
                          )}
                          {status === "pending" && (
                            <div className="size-4 rounded-full border-2 border-muted-foreground/30" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold ${
                              status === "checking"
                                ? "text-primary"
                                : status === "passed"
                                ? "text-foreground"
                                : status === "failed"
                                ? "text-destructive"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">{step.detail}</p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        {status === "checking" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary animate-pulse">
                            Checking...
                          </span>
                        )}
                        {status === "passed" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success animate-check-pop">
                            ✓ Passed
                          </span>
                        )}
                        {status === "failed" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive animate-check-pop">
                            ⚠️ Failed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border bg-muted/20 px-5 py-3 text-center text-[10px] text-muted-foreground">
                Đang đối chiếu quy chế đào tạo học kỳ 2026.1
              </div>
            </div>
          )}

          {phase === "failed" && failureInfo && (
            <div className="p-6">
              <div className="flex items-start gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive animate-check-pop">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-destructive">{failureInfo.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{failureInfo.subtitle}</p>
                </div>
              </div>

              {failureInfo.conflictPair && (
                <div className="my-4 space-y-2">
                  <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-3 text-xs">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>{failureInfo.conflictPair[0].courseCode} — {failureInfo.conflictPair[0].id}</span>
                      <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-[9px] font-bold text-destructive">Lớp xung đột</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {dayName(failureInfo.conflictPair[0].day)} · Tiết {failureInfo.conflictPair[0].start}–{failureInfo.conflictPair[0].end} ({failureInfo.conflictPair[0].startTime}–{failureInfo.conflictPair[0].endTime}) · Phòng {failureInfo.conflictPair[0].room}
                    </p>
                  </div>

                  <div className="text-center text-[10px] font-bold uppercase tracking-widest text-destructive py-0.5">
                    trùng lịch học với
                  </div>

                  <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-3 text-xs">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>{failureInfo.conflictPair[1].courseCode} — {failureInfo.conflictPair[1].id}</span>
                      <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-[9px] font-bold text-destructive">Lớp xung đột</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      {dayName(failureInfo.conflictPair[1].day)} · Tiết {failureInfo.conflictPair[1].start}–{failureInfo.conflictPair[1].end} ({failureInfo.conflictPair[1].startTime}–{failureInfo.conflictPair[1].endTime}) · Phòng {failureInfo.conflictPair[1].room}
                    </p>
                  </div>
                </div>
              )}

              {failureInfo.customText && (
                <div className="my-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive leading-relaxed">
                  {failureInfo.customText}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                {failureInfo.canQuickFix && (
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => {
                      onQuickFix();
                      handleClose();
                    }}
                  >
                    <Zap className="size-3.5" /> Đổi sang IT3011-04 (Quick Fix)
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Quay lại điều chỉnh
                </Button>
              </div>
            </div>
          )}

          {phase === "success" && (
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-md animate-check-pop">
                  <Check className="size-7" strokeWidth={3} />
                </div>
                <h2 className="mt-3.5 text-lg font-extrabold text-foreground animate-page-enter">
                  Đăng ký học phần thành công!
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Hệ thống đã ghi danh {selectedSections.length} lớp học phần · {credits}/24 tín chỉ học kỳ 2026.1.
                </p>
              </div>

              <div className="scrollbar-thin my-4 max-h-52 space-y-2 overflow-y-auto rounded-lg border border-border bg-muted/30 p-2.5">
                {selectedSections.map((section, idx) => {
                  const course = courses.find((c) => c.code === section.courseCode);
                  return (
                    <div
                      key={section.id}
                      className="flex items-center justify-between rounded-md border border-border bg-card p-2.5 text-xs animate-card-enter shadow-2xs"
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-primary">{section.id}</span>
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                            {course?.credits} TC
                          </span>
                        </div>
                        <p className="mt-0.5 truncate font-semibold text-foreground">{course?.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {dayName(section.day)} · {section.startTime}–{section.endTime} · {section.room}
                        </p>
                      </div>
                      <CheckCircle2 className="size-4 text-success shrink-0" />
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="flex-1" onClick={onDownload}>
                  <Download className="size-4" /> Xuất Google Calendar (.ics)
                </Button>
                <Button className="flex-1" onClick={handleClose}>
                  Xem thời khóa biểu
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function Checklist({ label, valid }: { label: string; valid: boolean }) { return <div className="flex items-center justify-between rounded-md border border-border p-3 transition-colors duration-200"><span className="text-sm font-semibold">{label}</span>{valid ? <CheckCircle2 className="size-5 text-success" /> : <AlertTriangle className="size-5 text-destructive" />}</div>; }

function Modal({ children, onClose }: { children: (handleClose: () => void) => React.ReactNode; onClose: () => void }) {
  const [exiting, setExiting] = useState(false);
  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(onClose, 200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-[2px] ${exiting ? "animate-overlay-exit" : "animate-overlay-in"} motion-reduce:animate-none`} onMouseDown={handleClose}>
      <div className={`w-full max-w-lg overflow-hidden rounded-lg bg-card shadow-2xl ${exiting ? "animate-modal-exit" : "animate-modal-enter"} motion-reduce:animate-none`} onMouseDown={(event) => event.stopPropagation()}>
        {children(handleClose)}
      </div>
    </div>
  );
}

function WarningModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal onClose={onCancel}>
      {(handleClose) => (
        <div className="p-6 animate-page-enter motion-reduce:animate-none">
          <div className="flex size-11 items-center justify-center rounded-md bg-warning/15 text-warning">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="mt-4 text-lg font-extrabold">Xóa cả lớp thực hành?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">IT3011L-01 phụ thuộc vào lớp lý thuyết IT3011. Nếu tiếp tục, cả hai lớp sẽ được xóa khỏi giỏ.</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Giữ lại</Button>
            <Button variant="danger" onClick={() => { onConfirm(); handleClose(); }}><Trash2 className="size-4" /> Xóa cả hai</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
