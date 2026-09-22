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
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

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
      <Header credits={credits} conflicts={conflicts.length + (missingTheory ? 1 : 0)} count={selected.length} onCart={() => setCartOpen(true)} />
      <main className="mx-auto grid max-w-[1920px] grid-cols-1 xl:grid-cols-[minmax(480px,45%)_minmax(620px,55%)]">
        <section className="border-b border-border bg-card xl:h-[calc(100vh-80px)] xl:overflow-hidden xl:border-r xl:border-b-0">
          <div className="border-b border-border px-5 py-5 lg:px-6">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Khám phá học phần</p><h1 className="mt-1 text-2xl font-extrabold">Chọn môn cho kỳ mới</h1></div>
              <span className="text-xs font-semibold text-muted-foreground">{filteredCourses.length} môn phù hợp</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" placeholder="Tìm mã môn, tên môn hoặc giảng viên..." />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <FilterSelect value={faculty} onChange={setFaculty} label="Khoa" options={["Tất cả khoa", "CNTT", "Toán-Tin", "Ngoại ngữ"]} />
              <FilterSelect value={workload} onChange={setWorkload} label="Tải học" options={["Mọi tải học", "Nhẹ", "Vừa", "Nặng"]} />
              <label className={`flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-xs font-semibold transition ${availableOnly ? "border-primary bg-secondary text-primary" : "border-border bg-card text-muted-foreground"}`}>
                <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} className="size-3.5 accent-primary" /> Còn chỗ
              </label>
            </div>
          </div>
          <div className="flex border-b border-border bg-card px-5 lg:px-6">
            <button onClick={() => setTab("catalog")} className={`relative flex h-12 flex-1 items-center justify-center gap-2 text-sm font-bold transition ${tab === "catalog" ? "text-primary" : "text-muted-foreground"}`}><BookOpen className="size-4" /> Tất cả môn học {tab === "catalog" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}</button>
            <button onClick={() => setTab("ai")} className={`relative flex h-12 flex-1 items-center justify-center gap-2 text-sm font-bold transition ${tab === "ai" ? "text-primary" : "text-muted-foreground"}`}><Sparkles className="size-4" /> Gợi ý thông minh {tab === "ai" && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}</button>
          </div>
          <div className="scrollbar-thin space-y-3 overflow-y-auto bg-background/60 p-4 lg:p-5 xl:h-[calc(100%-207px)]">
            {tab === "ai" && <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-secondary p-4"><div className="rounded-md bg-primary p-2 text-primary-foreground"><Bot className="size-5" /></div><div><p className="text-sm font-bold">Lộ trình dành riêng cho An</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Dựa trên ngành CNTT, điểm học phần đã hoàn thành và sở thích AI · Data.</p></div></div>}
            {filteredCourses.map((course) => <CourseCard key={course.code} course={course} ai={tab === "ai"} open={expanded.includes(course.code)} selected={selected} onToggle={() => toggleExpanded(course.code)} onAdd={addSection} onRemove={removeSection} onHover={setHovered} />)}
            {filteredCourses.length === 0 && <div className="py-16 text-center"><Search className="mx-auto size-7 text-muted-foreground" /><p className="mt-3 text-sm font-bold">Không tìm thấy môn phù hợp</p><p className="mt-1 text-xs text-muted-foreground">Hãy thử thay đổi từ khóa hoặc bộ lọc.</p></div>}
          </div>
        </section>

        <section className="bg-background p-4 lg:p-6 xl:h-[calc(100vh-80px)] xl:overflow-y-auto">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Lịch học trực quan</p><h2 className="mt-1 text-2xl font-extrabold">Thời khóa biểu của bạn</h2></div>
            <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-muted-foreground"><Legend tone="bg-course-1 border-primary/40" label="Đã chọn" /><Legend tone="border-dashed border-muted-foreground/50 bg-muted/60" label="Xem thử" /><Legend tone="border-2 border-destructive bg-destructive/10" label="Xung đột" /></div>
          </div>
          <Timetable selected={selectedSections} preview={allSections.find((section) => section.id === hovered) ?? null} conflictIds={conflictIds} />
          {(conflicts.length > 0 || missingTheory || credits > 24) ? (
            <div className="sticky bottom-3 z-20 mt-4 space-y-2">
              {conflicts.map(([a, b]) => <div key={`${a.id}-${b.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-card p-3 shadow-lg"><div className="flex items-start gap-2 text-sm"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" /><span><strong>{a.id}</strong> trùng lịch với <strong>{b.id}</strong> vào {dayName(a.day)}, tiết {Math.max(a.start, b.start)}–{Math.min(a.end, b.end)}.</span></div>{a.courseCode === "IT3011" || b.courseCode === "IT3011" ? <Button size="sm" variant="danger" onClick={quickFix}><Zap className="size-3.5" /> Đổi sang IT3011-04</Button> : null}</div>)}
              {missingTheory && <AlertBar text="Lớp thực hành IT3011L-01 yêu cầu đăng ký kèm lớp lý thuyết IT3011." />}
              {credits > 24 && <AlertBar text={`Bạn đang vượt quá hạn mức 24 tín chỉ (${credits}/24).`} />}
            </div>
          ) : <div className="mt-4 flex items-center gap-3 rounded-lg border border-success/25 bg-success/5 p-3"><CheckCircle2 className="size-5 text-success" /><div><p className="text-sm font-bold">Lịch học đang hoàn hảo</p><p className="text-xs text-muted-foreground">Không có xung đột và khối lượng học tập ở mức phù hợp.</p></div></div>}
          <div className="mt-5 flex items-center justify-between rounded-lg border border-border bg-card p-4">
            <div><p className="text-sm font-bold">Sẵn sàng ghi danh?</p><p className="mt-0.5 text-xs text-muted-foreground">Kiểm tra lần cuối {selected.length} lớp học phần trong giỏ.</p></div>
            <Button onClick={() => setCartOpen(true)}><ShoppingCart className="size-4" /> Xem giỏ đăng ký</Button>
          </div>
        </section>
      </main>

      {cartOpen && <CartDrawer sections={selectedSections} credits={credits} conflicts={conflicts.length} missingTheory={missingTheory} onClose={() => setCartOpen(false)} onRemove={removeSection} onConfirm={() => { setCartOpen(false); setConfirmOpen(true); setSuccess(false); }} />}
      {confirmOpen && <ConfirmModal credits={credits} conflicts={conflicts.length} missingTheory={missingTheory} success={success} onClose={() => setConfirmOpen(false)} onConfirm={() => setSuccess(true)} onDownload={downloadCalendar} />}
      {removeWarning && <WarningModal onCancel={() => setRemoveWarning(null)} onConfirm={() => { removeSection(removeWarning, true); setSelected((items) => items.filter((id) => id !== "IT3011L-01")); }} />}
    </div>
  );
}

function Header({ credits, conflicts, count, onCart }: { credits: number; conflicts: number; count: number; onCart: () => void }) {
  return <header className="sticky top-0 z-30 flex min-h-20 flex-wrap items-center gap-4 border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:px-6">
    <div className="flex min-w-[280px] flex-1 items-center gap-3"><div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><GraduationCap className="size-6" /></div><div><div className="flex items-center gap-2"><p className="text-base font-extrabold">UniCourse AI</p><span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">Học kỳ 2026.1</span></div><p className="text-xs text-muted-foreground">Intelligent Registration Assistant</p></div></div>
    <div className="order-3 flex w-full items-center gap-2 overflow-x-auto lg:order-2 lg:w-auto">
      <StatPill icon={<BookOpen className="size-4 text-primary" />} title={`${credits} / 24 Tín chỉ`} detail={<div className="mt-1 h-1 w-24 overflow-hidden rounded bg-muted"><div className={`h-full ${credits > 24 ? "bg-destructive" : "bg-success"}`} style={{ width: `${Math.min(credits / 24 * 100, 100)}%` }} /></div>} />
      <StatPill icon={<Lightbulb className="size-4 text-warning" />} title="Vừa phải" detail={<span className="text-[10px] text-muted-foreground">Balanced</span>} />
      <StatPill icon={conflicts ? <AlertTriangle className="size-4 text-destructive" /> : <CheckCircle2 className="size-4 text-success" />} title={conflicts ? `${conflicts} xung đột` : "0 Xung đột"} detail={<span className={`text-[10px] ${conflicts ? "text-destructive" : "text-success"}`}>{conflicts ? "Cần xử lý" : "Lịch hợp lệ"}</span>} />
    </div>
    <div className="order-2 ml-auto flex items-center gap-2 lg:order-3 lg:ml-0"><Button variant="outline" onClick={onCart}><ShoppingCart className="size-4" /><span className="hidden sm:inline">Giỏ đăng ký</span><span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{count}</span></Button><div className="hidden items-center gap-2 border-l border-border pl-3 2xl:flex"><div className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary"><UserRound className="size-4" /></div><div><p className="text-xs font-bold">Nguyễn Văn An</p><p className="text-[10px] text-muted-foreground">CNTT · K66</p></div></div></div>
  </header>;
}

function StatPill({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: React.ReactNode }) {
  return <div className="flex min-w-max items-center gap-2 rounded-md border border-border bg-background px-3 py-2">{icon}<div><p className="text-xs font-bold">{title}</p>{detail}</div></div>;
}

function FilterSelect({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: string[] }) {
  return <label className="relative"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-md border border-border bg-card pl-3 pr-8 text-xs font-semibold text-muted-foreground outline-none focus:border-primary">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /></label>;
}

function CourseCard({ course, ai, open, selected, onToggle, onAdd, onRemove, onHover }: { course: Course; ai: boolean; open: boolean; selected: string[]; onToggle: () => void; onAdd: (id: string) => void; onRemove: (id: string) => void; onHover: (id: string | null) => void }) {
  return <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:border-primary/30 hover:shadow-md">
    <button onClick={onToggle} className="flex w-full items-start gap-3 p-4 text-left">
      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-extrabold text-primary">{course.code.slice(0, 2)}</div>
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-extrabold text-primary">{course.code}</span><span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">{course.credits} TC</span><span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${workloadTone[course.workload]}`}>{course.workload}</span></div><h3 className="mt-1 text-sm font-bold leading-snug">{course.name}</h3>{ai && <div className="mt-2 flex flex-wrap gap-1">{course.reasons.map((reason) => <span key={reason} className="rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-primary"><Sparkles className="mr-1 inline size-3" />{reason}</span>)}</div>}<div className={`mt-2 flex items-center gap-1.5 text-[10px] font-semibold ${course.prerequisitePassed ? "text-success" : "text-destructive"}`}>{course.prerequisite ? course.prerequisitePassed ? <Check className="size-3" /> : <LockKeyhole className="size-3" /> : <Check className="size-3" />}{course.prerequisite ?? "Không yêu cầu tiên quyết"}</div></div>{open ? <ChevronDown className="mt-1 size-4 text-muted-foreground" /> : <ChevronRight className="mt-1 size-4 text-muted-foreground" />}
    </button>
    {open && <div className="border-t border-border bg-background/50 px-4 py-3"><p className="mb-3 text-[11px] leading-relaxed text-muted-foreground">{course.description}</p><div className="space-y-2">{course.sections.map((section) => <SectionRow key={section.id} section={section} selected={selected.includes(section.id)} blocked={!course.prerequisitePassed || section.enrolled >= section.capacity} onAdd={() => onAdd(section.id)} onRemove={() => onRemove(section.id)} onHover={onHover} />)}</div></div>}
  </article>;
}

function SectionRow({ section, selected, blocked, onAdd, onRemove, onHover }: { section: Section; selected: boolean; blocked: boolean; onAdd: () => void; onRemove: () => void; onHover: (id: string | null) => void }) {
  const occupancy = Math.round(section.enrolled / section.capacity * 100);
  return <div onMouseEnter={() => onHover(section.id)} onMouseLeave={() => onHover(null)} className={`rounded-md border p-3 transition ${selected ? "border-primary/35 bg-secondary/60" : "border-border bg-card hover:border-primary/35"}`}>
    <div className="flex flex-wrap items-start justify-between gap-2"><div><div className="flex items-center gap-2"><p className="text-xs font-extrabold">{section.id}</p><span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">{section.type}</span></div><p className="mt-1.5 text-[11px] font-semibold text-foreground">{section.lecturer}</p></div><div className="text-right"><p className="text-[10px] font-bold">{section.enrolled}/{section.capacity} chỗ</p><div className="mt-1 h-1 w-16 overflow-hidden rounded bg-muted"><div className={`h-full ${occupancy >= 100 ? "bg-destructive" : occupancy > 85 ? "bg-warning" : "bg-success"}`} style={{ width: `${occupancy}%` }} /></div></div></div>
    <div className="mt-2 grid gap-1 text-[10px] text-muted-foreground sm:grid-cols-2"><span className="flex items-center gap-1"><CalendarDays className="size-3" />{dayName(section.day)}, Tiết {section.start}–{section.end}</span><span className="flex items-center gap-1"><Clock3 className="size-3" />{section.startTime}–{section.endTime}</span><span className="flex items-center gap-1"><MapPin className="size-3" />{section.room}</span><span className="flex items-center gap-1"><Building2 className="size-3" />{section.campus}</span></div>
    <div className="mt-3 flex justify-end">{selected ? <Button size="sm" variant="outline" onClick={onRemove}><Check className="size-3.5 text-success" /> Đã thêm</Button> : <Button size="sm" onClick={onAdd} disabled={blocked}>{blocked ? section.enrolled >= section.capacity ? "Đã đầy" : "Chưa đủ điều kiện" : "Thêm vào giỏ"}</Button>}</div>
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
  return <div className={`absolute inset-x-1 z-10 overflow-hidden rounded-md border p-2 text-[9px] transition-all ${conflict ? "border-2 border-destructive bg-destructive/10 shadow-md" : preview ? "border-2 border-dashed border-muted-foreground/50 bg-muted/70 opacity-80" : course?.color ?? "bg-course-1"}`} style={{ top: `${(section.start - 1) * 48 + 4}px`, height: `${(section.end - section.start + 1) * 48 - 8}px` }}><div className="flex items-center justify-between gap-1"><strong className="text-[10px]">{section.courseCode}</strong>{conflict && <AlertTriangle className="size-3.5 shrink-0 text-destructive" />}{preview && <span className="rounded bg-card/80 px-1 py-0.5 text-[8px] font-bold">XEM THỬ</span>}</div><p className="mt-1 truncate font-semibold">{section.room}</p><p className="mt-0.5 truncate opacity-70">{section.lecturer.replace("PGS. ", "").replace("TS. ", "")}</p><p className="mt-1 font-bold">Tiết {section.start}–{section.end}</p></div>;
}

function Legend({ tone, label }: { tone: string; label: string }) { return <span className="flex items-center gap-1.5"><i className={`size-3 rounded-sm border ${tone}`} />{label}</span>; }
function AlertBar({ text }: { text: string }) { return <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-card p-3 text-sm shadow-lg"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" /><span>{text}</span></div>; }

function CartDrawer({ sections, credits, conflicts, missingTheory, onClose, onRemove, onConfirm }: { sections: Section[]; credits: number; conflicts: number; missingTheory: boolean; onClose: () => void; onRemove: (id: string) => void; onConfirm: () => void }) {
  const valid = conflicts === 0 && !missingTheory && credits <= 24 && sections.length > 0;
  return <div className="fixed inset-0 z-40 flex justify-end bg-foreground/30 backdrop-blur-[2px]" onMouseDown={onClose}><aside className="flex h-full w-full max-w-md flex-col bg-card shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-border p-5"><div><p className="text-lg font-extrabold">Giỏ đăng ký</p><p className="text-xs text-muted-foreground">{sections.length} lớp · {credits}/24 tín chỉ</p></div><Button variant="ghost" size="icon" aria-label="Đóng" onClick={onClose}><X className="size-5" /></Button></div><div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-5">{sections.map((section) => { const course = courses.find((item) => item.code === section.courseCode); return <div key={section.id} className="flex items-center gap-3 rounded-lg border border-border p-3"><div className={`size-2 self-stretch rounded-sm border ${course?.color}`} /><div className="min-w-0 flex-1"><p className="text-xs font-extrabold">{section.id} · {course?.credits} TC</p><p className="mt-1 truncate text-[11px] text-muted-foreground">{course?.name}</p><p className="mt-1 text-[10px] font-semibold">{dayName(section.day)}, tiết {section.start}–{section.end} · {section.room}</p></div><Button variant="ghost" size="icon" aria-label={`Xóa ${section.id}`} onClick={() => onRemove(section.id)}><Trash2 className="size-4 text-destructive" /></Button></div>; })}{sections.length === 0 && <div className="py-20 text-center"><ShoppingCart className="mx-auto size-8 text-muted-foreground" /><p className="mt-3 text-sm font-bold">Giỏ đăng ký đang trống</p></div>}</div><div className="border-t border-border p-5"><div className="mb-4 flex items-center justify-between text-sm"><span className="text-muted-foreground">Tổng khối lượng</span><strong>{credits} tín chỉ</strong></div>{!valid && sections.length > 0 && <p className="mb-3 flex gap-2 text-xs text-destructive"><AlertTriangle className="size-4 shrink-0" />Hãy xử lý mọi xung đột trước khi xác nhận.</p>}<Button className="w-full" onClick={onConfirm} disabled={!valid}><CheckCircle2 className="size-4" /> Xác nhận ghi danh</Button></div></aside></div>;
}

function ConfirmModal({ credits, conflicts, missingTheory, success, onClose, onConfirm, onDownload }: { credits: number; conflicts: number; missingTheory: boolean; success: boolean; onClose: () => void; onConfirm: () => void; onDownload: () => void }) {
  return <Modal onClose={onClose}>{success ? <div className="p-7 text-center"><div className="animate-success-pop mx-auto flex size-20 items-center justify-center rounded-full bg-success text-success-foreground"><Check className="size-10" strokeWidth={3} /></div><h2 className="mt-5 text-xl font-extrabold">Xác nhận thành công!</h2><p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Bạn đã ghi danh các lớp học phần cho học kỳ 2026.1. Thời khóa biểu đã sẵn sàng.</p><div className="mt-6 flex flex-col gap-2 sm:flex-row"><Button variant="outline" className="flex-1" onClick={onDownload}><Download className="size-4" /> Xuất Google Calendar (.ics)</Button><Button className="flex-1" onClick={onClose}>Hoàn tất</Button></div></div> : <div><div className="flex items-center justify-between border-b border-border p-5"><div><p className="text-lg font-extrabold">Kiểm tra trước khi ghi danh</p><p className="text-xs text-muted-foreground">Hệ thống đã rà soát lịch học của bạn</p></div><Button variant="ghost" size="icon" onClick={onClose}><X className="size-5" /></Button></div><div className="space-y-3 p-5"><Checklist label="Đủ điều kiện tiên quyết" valid={!missingTheory} /><Checklist label="Không có xung đột thời gian" valid={conflicts === 0} /><Checklist label={`Tổng tín chỉ ${credits}/24`} valid={credits <= 24} /><Checklist label="Khối lượng học tập: Vừa phải" valid /></div><div className="border-t border-border p-5"><Button className="w-full" onClick={onConfirm}><CheckCircle2 className="size-4" /> Xác nhận ghi danh</Button><p className="mt-3 text-center text-[10px] text-muted-foreground">Bằng việc xác nhận, bạn đồng ý với quy định đăng ký học phần.</p></div></div>}</Modal>;
}

function Checklist({ label, valid }: { label: string; valid: boolean }) { return <div className="flex items-center justify-between rounded-md border border-border p-3"><span className="text-sm font-semibold">{label}</span>{valid ? <CheckCircle2 className="size-5 text-success" /> : <AlertTriangle className="size-5 text-destructive" />}</div>; }
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-[2px]" onMouseDown={onClose}><div className="w-full max-w-lg overflow-hidden rounded-lg bg-card shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>{children}</div></div>; }
function WarningModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) { return <Modal onClose={onCancel}><div className="p-6"><div className="flex size-11 items-center justify-center rounded-md bg-warning/15 text-warning"><AlertTriangle className="size-6" /></div><h2 className="mt-4 text-lg font-extrabold">Xóa cả lớp thực hành?</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">IT3011L-01 phụ thuộc vào lớp lý thuyết IT3011. Nếu tiếp tục, cả hai lớp sẽ được xóa khỏi giỏ.</p><div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={onCancel}>Giữ lại</Button><Button variant="danger" onClick={onConfirm}><Trash2 className="size-4" /> Xóa cả hai</Button></div></div></Modal>; }
