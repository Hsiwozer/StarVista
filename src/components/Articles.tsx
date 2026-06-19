import { useState, type ReactNode } from "react";
import { ArrowRight, Database, FileSearch, MapPinned, Ruler, Sparkles } from "lucide-react";
import { archiveRecords } from "../data/mockData";
import { ArchiveCard } from "./ArchiveCard";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const fallbackImage = "/images/hero-nebula.png";

function openSolarSystemExplorer() {
  window.location.href = "/solar-system";
}

export function Articles() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isArchiveExpanded, setIsArchiveExpanded] = useState(false);
  const activeArchive = archiveRecords[activeIndex];

  return (
    <section id="articles" className="section-shell">
      <Reveal>
        <SectionHeading
          eyebrow="Cosmic Archives"
          title="宇宙档案"
          description="选择一份深空记录，像在星空档案馆中调出一页正在显影的宇宙档案。"
        />
      </Reveal>

      <div className="archive-system-grid">
        <Reveal delay={80} distance="short" className="min-w-0">
          <div
            className="archive-system-track"
            aria-label="深空档案列表"
          >
            <button
              type="button"
              onClick={openSolarSystemExplorer}
              className="archive-system-card archive-system-card-feature"
              aria-label="启动太阳系漫游星轨仪"
            >
              <span className="archive-system-card-scan" aria-hidden="true" />
              <span className="archive-system-card-axis" aria-hidden="true" />

              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="archive-system-id block">ORRERY-000</span>
                  <span className="mt-2 block text-xs text-white/38">
                    实时日心轨道
                  </span>
                </span>
                <Sparkles
                  size={17}
                  className="mt-0.5 text-galaxy-400/36 transition duration-700"
                  aria-hidden="true"
                />
              </span>

              <span className="mt-8 block">
                <span className="block text-lg font-medium leading-snug text-starlight/88">
                  太阳系漫游
                </span>
                <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-galaxy-400/52">
                  Solar System Explorer
                </span>
              </span>

              <span className="mt-7 block text-sm leading-6 text-white/52">
                进入实时运行的日心轨道，观察八大行星在深空中的运动。
              </span>

              <span className="archive-system-open mt-7 inline-flex items-center gap-2 text-xs tracking-[0.18em] text-white/42">
                启动星轨仪
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </button>

            {archiveRecords.map((archive, index) => {
              const isActive = activeIndex === index;

              return (
                <button
                  id={archive.targetId}
                  type="button"
                  key={archive.archiveId}
                  aria-pressed={isActive}
                  aria-label={`查阅${archive.name}档案`}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsArchiveExpanded(false);
                  }}
                  className={`archive-system-card ${
                    isActive ? "archive-system-card-active" : ""
                  }`}
                >
                  <span className="archive-system-card-scan" aria-hidden="true" />
                  <span className="archive-system-card-axis" aria-hidden="true" />

                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="archive-system-id block">
                        {archive.archiveId}
                      </span>
                      <span className="mt-2 block text-xs text-white/38">
                        {archive.type}
                      </span>
                    </span>
                    <Database
                      size={17}
                      className="mt-0.5 text-white/22 transition duration-700"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="mt-8 block">
                    <span className="block text-lg font-medium leading-snug text-starlight/84">
                      {archive.name}
                    </span>
                    <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-galaxy-400/42">
                      {archive.englishName}
                    </span>
                  </span>

                  <span className="mt-7 block text-sm leading-6 text-white/46">
                    {archive.region} / {archive.distance}
                  </span>

                  <span className="archive-system-open mt-7 inline-flex items-center gap-2 text-xs tracking-[0.18em] text-white/34">
                    查阅档案
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={160} distance="short" className="min-w-0">
          <ArchiveCard
            className={`archive-system-panel archive-system-panel-${activeArchive.accent}`}
          >
            <div
              key={`image-${activeArchive.archiveId}`}
              className="archive-system-panel-media"
              aria-hidden="true"
            >
              <img
                src={activeArchive.image}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
              />
            </div>
            <span className="archive-system-panel-veil" aria-hidden="true" />
            <span className="archive-system-panel-dust" aria-hidden="true" />

            <div
              key={activeArchive.archiveId}
              className="archive-system-panel-content"
            >
              <div className="flex flex-col gap-5 border-b border-white/[0.075] pb-7 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.28em] text-galaxy-400/78">
                    <FileSearch size={14} aria-hidden="true" />
                    {activeArchive.archiveId}
                  </p>
                  <h3 className="mt-5 font-display text-4xl font-medium leading-[1.02] text-starlight sm:text-5xl lg:text-6xl">
                    {activeArchive.name}
                  </h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/42">
                    {activeArchive.englishName}
                  </p>
                </div>

                <button
                  type="button"
                  aria-expanded={isArchiveExpanded}
                  onClick={() => setIsArchiveExpanded((expanded) => !expanded)}
                  className="archive-system-action"
                >
                  {isArchiveExpanded ? "收起档案" : "展开档案"}
                  <Sparkles size={15} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <ArchiveMeta
                  icon={<Database size={15} aria-hidden="true" />}
                  label="Object Type"
                  value={activeArchive.type}
                />
                <ArchiveMeta
                  icon={<Ruler size={15} aria-hidden="true" />}
                  label="Distance / Scale"
                  value={activeArchive.distance}
                />
                <ArchiveMeta
                  icon={<MapPinned size={15} aria-hidden="true" />}
                  label="Region"
                  value={activeArchive.region}
                />
              </div>

              <p className="mt-9 max-w-3xl text-base leading-8 text-white/68 md:text-lg md:leading-9">
                {activeArchive.summary}
              </p>

              <div
                className={`archive-system-detail ${
                  isArchiveExpanded ? "archive-system-detail-open" : ""
                }`}
                aria-hidden={!isArchiveExpanded}
              >
                <div className="archive-system-detail-inner">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-galaxy-400/62">
                    Expanded Notes
                  </p>
                  <p className="mt-4 text-sm leading-7 text-white/58 md:text-base md:leading-8">
                    {activeArchive.detail}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {activeArchive.tags.map((tag) => (
                  <span key={tag} className="archive-system-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ArchiveCard>
        </Reveal>
      </div>
    </section>
  );
}

interface ArchiveMetaProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function ArchiveMeta({ icon, label, value }: ArchiveMetaProps) {
  return (
    <div className="archive-system-meta">
      <p className="mb-2 flex items-center gap-2 text-[0.64rem] uppercase tracking-[0.2em] text-white/34">
        {icon}
        {label}
      </p>
      <p className="text-sm leading-6 text-starlight/76">{value}</p>
    </div>
  );
}
