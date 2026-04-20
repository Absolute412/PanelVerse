function PageHeader({ title }) {
  return (
    <div className="flex items-center justify-between my-2">
      <div className="flex items-center gap-3 w-full">
        <span className="text-[15px] font-black tracking-[0.2em] uppercase text-(--text-main)/70">
          {title}
        </span>
        <span className="h-px flex-1 bg-black/20 dark:bg-white/20" />
      </div>
    </div>
  );
}

export default PageHeader;