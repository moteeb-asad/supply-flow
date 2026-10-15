import Link from "next/link";
import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import { QUICK_TASKS } from "../constants/quick-tasks";
import type { QuickTask } from "../types";

type QuickTasksProps = {
  role: Role | null;
};

const tileClassName =
  "group flex items-center gap-3 rounded-lg bg-background-light p-3 text-left";

function TaskContent({ task }: { task: QuickTask }) {
  return (
    <>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-white">
        <span className="material-symbols-outlined !text-[20px]">
          {task.icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{task.label}</p>
        <p className="truncate text-[11px] text-muted">{task.description}</p>
      </div>
    </>
  );
}

// Static links, no data: renders with the page (no Suspense needed).
export default function QuickTasks({ role }: QuickTasksProps) {
  const tasks = QUICK_TASKS.filter(
    (task) => "disabled" in task || hasPermission(role, task.permission),
  );

  if (tasks.length === 0) return null;

  return (
    <div className="rounded-xl border border-line-soft bg-white p-4">
      <h4 className="mb-3 text-sm font-bold">Quick Tasks</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tasks.map((task) =>
          "disabled" in task ? (
            <div
              key={task.label}
              aria-disabled="true"
              className={`${tileClassName} relative cursor-not-allowed opacity-50`}
              title="Coming soon"
            >
              <TaskContent task={task} />
              <span className="absolute right-2 top-2 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold text-muted">
                Soon
              </span>
            </div>
          ) : (
            <Link
              key={task.label}
              className={`${tileClassName} transition-colors hover:bg-primary/5`}
              href={task.href}
            >
              <TaskContent task={task} />
            </Link>
          ),
        )}
      </div>
    </div>
  );
}
