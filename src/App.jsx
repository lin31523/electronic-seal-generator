import { useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpenText,
  BracketsCurly,
  CaretLeft,
  CaretRight,
  Compass,
  CopySimple,
  DotsSixVertical,
  Eye,
  Feather,
  FrameCorners,
  Lightning,
  MouseSimple,
  PenNib,
  Shuffle,
  Sparkle,
  Stack,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, Flip, Draggable, Observer);
gsap.defaults({ duration: 0.7, ease: "power3.out" });

const articles = [
  {
    id: "slow-code",
    title: "慢代码，锋利边缘",
    category: "过程",
    minutes: 8,
    metric: "3.74万",
    image: "/images/article-process.jpg",
    excerpt: "关于界面创作的一则札记：少一点假设，多一点草图，再给思考留一点安静。",
  },
  {
    id: "small-tools",
    title: "我信任的小工具",
    category: "工具",
    minutes: 6,
    metric: "1.28万",
    image: "/images/article-tools.jpg",
    excerpt: "那些每次重启后依然留下来的工具：一张清单，一个捕捉习惯，一条严格的命名规则。",
  },
  {
    id: "field-systems",
    title: "给动荡周次的田野系统",
    category: "系统",
    minutes: 11,
    metric: "2.41万",
    image: "/images/article-system.jpg",
    excerpt: "我如何让研究、草稿和开放问题继续移动，同时不假装每一周都可以被完美预测。",
  },
  {
    id: "interface-weather",
    title: "界面的天气",
    category: "设计",
    minutes: 9,
    metric: "1.86万",
    image: "/images/article-design.jpg",
    excerpt: "一篇关于光线、密度、节奏的设计日记，也关于细小动效如何改变界面的体感温度。",
  },
  {
    id: "motion-ethics",
    title: "动效的伦理",
    category: "动效",
    minutes: 7,
    metric: "3.17万",
    image: "/images/article-motion.jpg",
    excerpt: "动画应该澄清状态，而不是索取注意力。这里有几条判断动效是否值得存在的测试。",
  },
];

const dispatches = [
  "可迁移的笔记应该像工具一样变旧，而不是像公告一样过期。",
  "个人网站可以是工作间，不必把自己伪装成仪表盘。",
  "当动效能教会手指界面去了哪里，它才真正有用。",
  "在文章知道自己要成为什么之前，先写下边注。",
];

const categories = ["全部", "设计", "动效", "过程", "系统", "工具"];

const skillCards = [
  ["gsap-core", "补间语法", "文字、图像层和悬停状态都以克制的方式移动。"],
  ["gsap-timeline", "入场编排", "第一屏像一段短小的编辑序列一样展开。"],
  ["gsap-scrolltrigger", "阅读中的运动", "页面用进度、纵深和横向笔记回应滚动。"],
  ["gsap-plugins", "界面行为", "导航、排序、拖拽和方向手势都保留触感。"],
  ["gsap-utils", "动效数学", "数值会吸附、循环、映射，形成有意图的运动。"],
  ["gsap-react", "局部清理", "每个组件都把动画收束在自己的标记结构里。"],
  ["gsap-performance", "合成优先", "动效保持轻、稳、快，不打扰指尖。"],
  ["gsap-frameworks", "可迁移生命周期", "同一套纪律也能带进 Vue 和 Svelte 的笔记。"],
];

const frameworkSnippets = [
  {
    label: "Vue",
    code:
      "onMounted(() => {\n  ctx = gsap.context(() => {\n    gsap.from('.note', { autoAlpha: 0, y: 24 });\n  }, container.value);\n});\nonUnmounted(() => ctx?.revert());",
  },
  {
    label: "Svelte",
    code:
      "onMount(() => {\n  const ctx = gsap.context(() => {\n    gsap.to('.rail', { x: 80, duration: 0.6 });\n  }, container);\n  return () => ctx.revert();\n});",
  },
];

function App() {
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const articleGridRef = useRef(null);
  const flipStateRef = useRef(null);
  const [filter, setFilter] = useState("全部");
  const [snippetIndex, setSnippetIndex] = useState(0);

  const visibleArticles = useMemo(() => {
    if (filter === "全部") return articles;
    return articles.filter((article) => article.category === filter);
  }, [filter]);

  useGSAP(
    (context, contextSafe) => {
      const q = gsap.utils.selector(rootRef);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cleanupFns = [];
      const pluginInstances = [];

      const heroTimeline = gsap.timeline({
        defaults: { duration: reduceMotion ? 0 : 0.8, ease: "power3.out" },
      });

      heroTimeline
        .addLabel("intro")
        .from(q(".nav-shell"), { autoAlpha: 0, y: -18 }, "intro")
        .from(q(".hero-kicker"), { autoAlpha: 0, y: 18 }, "intro+=0.1")
        .from(q(".hero-title-line"), { autoAlpha: 0, yPercent: 105, stagger: 0.08 }, "intro+=0.12")
        .from(q(".hero-copy"), { autoAlpha: 0, y: 18 }, "intro+=0.38")
        .from(q(".cover-card"), { autoAlpha: 0, y: 34, rotation: -2, stagger: 0.08 }, "intro+=0.28")
        .from(q(".hero-stat"), { autoAlpha: 0, y: 16, stagger: 0.06 }, "intro+=0.5");

      const mm = gsap.matchMedia(rootRef.current);

      mm.add(
        {
          isDesktop: "(min-width: 860px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          if (conditions.reduceMotion) return undefined;

          gsap.to(q(".portrait-plate"), {
            yPercent: conditions.isDesktop ? -9 : -3,
            ease: "none",
            scrollTrigger: {
              trigger: q(".hero")[0],
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          const horizontal = q(".notebook-track")[0];
          if (horizontal && conditions.isDesktop) {
            const panels = q(".notebook-panel");
            const scrollTween = gsap.to(horizontal, {
              x: () => -(horizontal.scrollWidth - window.innerWidth * 0.82),
              ease: "none",
              scrollTrigger: {
                trigger: q(".notebook-section")[0],
                start: "top top",
                end: () => `+=${horizontal.scrollWidth}`,
                pin: true,
                scrub: 1,
                refreshPriority: 2,
              },
            });

            panels.forEach((panel) => {
              gsap.from(panel.querySelector(".panel-inner"), {
                y: 42,
                autoAlpha: 0,
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: scrollTween,
                  start: "left 72%",
                  toggleActions: "play none none reverse",
                },
              });
            });
          }

          return undefined;
        }
      );

      ScrollTrigger.batch(q(".article-card"), {
        start: "top 82%",
        interval: 0.08,
        batchMax: 3,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.08,
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.set(batch, { autoAlpha: 0, y: 34, overwrite: true });
        },
      });

      gsap.to(q(".progress-line"), {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      const mapToRotation = gsap.utils.pipe(
        gsap.utils.normalize(0, 1),
        gsap.utils.mapRange(0, 1, -18, 18),
        gsap.utils.snap(0.5)
      );

      q(".cover-card").forEach((card, index) => {
        const rotateTo = gsap.quickTo(card, "rotation", { duration: 0.45, ease: "power3" });
        const yTo = gsap.quickTo(card, "y", { duration: 0.45, ease: "power3" });
        const onMove = contextSafe((event) => {
          const rect = card.getBoundingClientRect();
          const progress = gsap.utils.clamp(0, 1, (event.clientX - rect.left) / rect.width);
          rotateTo(mapToRotation(progress));
          yTo(gsap.utils.wrap([-10, -6, -12], index));
        });
        const onLeave = contextSafe(() => {
          rotateTo(0);
          yTo(0);
        });
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cleanupFns.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      if (dragRef.current) {
        pluginInstances.push(...Draggable.create(dragRef.current, {
          type: "x",
          bounds: dragRef.current.parentElement,
          edgeResistance: 0.72,
          cursor: "grab",
          onDragEnd() {
            gsap.to(this.target, { x: gsap.utils.snap(24, this.x), duration: 0.35 });
          },
        }));
      }

      pluginInstances.push(Observer.create({
        target: q(".snippet-stage")[0],
        type: "touch,pointer",
        tolerance: 18,
        onLeft: contextSafe(() => setSnippetIndex((value) => (value + 1) % frameworkSnippets.length)),
        onRight: contextSafe(() =>
          setSnippetIndex((value) => (value - 1 + frameworkSnippets.length) % frameworkSnippets.length)
        ),
      }));

      ScrollTrigger.refresh();
      return () => {
        cleanupFns.forEach((cleanup) => cleanup());
        pluginInstances.forEach((instance) => instance?.kill?.());
        mm.revert();
      };
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      const state = flipStateRef.current;
      if (!articleGridRef.current || !state) return;
      Flip.from(state, {
        duration: 0.55,
        ease: "power2.inOut",
        absolute: true,
        stagger: 0.035,
        onComplete: () => ScrollTrigger.refresh(),
      });
      flipStateRef.current = null;
    },
    { dependencies: [filter], scope: articleGridRef }
  );

  const applyFilter = (nextFilter) => {
    if (articleGridRef.current) {
      flipStateRef.current = Flip.getState(articleGridRef.current.querySelectorAll(".article-card"));
    }
    setFilter(nextFilter);
  };

  const scrollTo = (target) => {
    gsap.to(window, {
      duration: 0.9,
      ease: "power3.inOut",
      scrollTo: { y: target, offsetY: 72 },
    });
  };

  const changeSnippet = (direction) => {
    setSnippetIndex((value) =>
      direction === "next"
        ? (value + 1) % frameworkSnippets.length
        : (value - 1 + frameworkSnippets.length) % frameworkSnippets.length
    );
  };

  return (
    <main ref={rootRef} className="site-shell">
      <aside className="scroll-progress" aria-hidden="true">
        <span className="progress-line" />
      </aside>

      <nav className="nav-shell" aria-label="主导航">
        <button className="brand-mark" onClick={() => scrollTo(".hero")} aria-label="回到顶部">
          <PenNib size={18} weight="duotone" />
          <span>田野笔记</span>
        </button>
        <div className="nav-actions">
          <button onClick={() => scrollTo(".journal-section")}>文章</button>
          <button onClick={() => scrollTo(".notebook-section")}>笔记</button>
          <button onClick={() => scrollTo(".skill-section")}>技术栈</button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy-block">
          <p className="hero-kicker">关于设计、代码与工作笔记的个人博客</p>
          <h1 className="hero-title">
            <span className="line-mask">
              <span className="hero-title-line">安静系统</span>
            </span>
            <span className="line-mask">
              <span className="hero-title-line">容纳</span>
            </span>
            <span className="line-mask">
              <span className="hero-title-line">不安分的</span>
            </span>
            <span className="line-mask">
              <span className="hero-title-line">想法。</span>
            </span>
          </h1>
          <p className="hero-copy">
            这是一本持续生长的工作笔记，记录界面手艺、研究习惯，以及让野心勃勃的项目仍然保持人味的小工具。
          </p>
          <div className="hero-cta-row">
            <button className="primary-action" onClick={() => scrollTo(".journal-section")}>
              <BookOpenText size={18} />
              阅读文章
            </button>
            <button className="ghost-action" onClick={() => scrollTo(".skill-section")}>
              <Lightning size={18} />
              动效技术栈
            </button>
          </div>
          <div className="hero-stats" aria-label="博客统计">
            {[
              ["47", "篇文章"],
              ["6.8", "年记录"],
              ["128", "则笔记"],
            ].map(([value, label]) => (
              <div className="hero-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="精选视觉笔记">
          <div className="portrait-plate">
            <img
              src="/images/hero.jpg"
              alt="有笔记本、屏幕光和打印草稿的编辑桌面"
            />
          </div>
          {articles.slice(0, 3).map((article, index) => (
            <article className={`cover-card cover-card-${index + 1}`} key={article.id}>
              <img src={article.image} alt="" />
              <div>
                <span>{article.category}</span>
                <strong>{article.title}</strong>
              </div>
            </article>
          ))}
        </div>
        <button className="scroll-cue" onClick={() => scrollTo(".journal-section")} aria-label="滚动到文章列表">
          <ArrowDown size={18} />
        </button>
      </section>

      <section className="journal-section" id="journal">
        <div className="section-heading">
          <p>文章</p>
          <h2>近期文章，给阅读留一点余地。</h2>
          <span>
            从工作桌边整理出的草稿，按主题归类，适合慢一点读。
          </span>
        </div>

        <div className="filter-row" aria-label="文章筛选">
          {categories.map((category) => (
            <button
              key={category}
              className={filter === category ? "active" : ""}
              onClick={() => applyFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="article-grid" ref={articleGridRef}>
          {visibleArticles.map((article, index) => (
            <article className="article-card" key={article.id} style={{ "--card-index": index }}>
              <div className="article-image">
                <img src={article.image} alt="" />
              </div>
              <div className="article-body">
                <div className="article-meta">
                  <span>{article.category}</span>
                  <span>{article.minutes} 分钟</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <div className="article-footer">
                  <span>{article.metric} 次阅读</span>
                  <button aria-label={`打开《${article.title}》`}>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dispatch-section">
        <div className="dispatch-copy">
          <p>现场边注</p>
          <h2>页面保持安静的节奏，草稿继续移动。</h2>
        </div>
        <div className="drag-field">
          <div className="drag-note" ref={dragRef}>
            <DotsSixVertical size={22} />
            <span>草稿节奏</span>
            <strong>62%</strong>
          </div>
        </div>
        <div className="dispatch-list">
          {dispatches.map((dispatch, index) => (
            <p key={dispatch} style={{ "--dispatch-index": index }}>
              {dispatch}
            </p>
          ))}
        </div>
      </section>

      <section className="notebook-section">
        <div className="notebook-track">
          {[
            ["01", "研究", "在大纲变硬之前，先收集截图、碎片和问题。"],
            ["02", "起草", "公开到足以测试形状，私密到还能保持诚实。"],
            ["03", "打磨", "如果一段聪明话不能让读者更有能力，就把它删掉。"],
            ["04", "发布", "带着一个未关闭的问题发布，让下一则笔记有地方开始。"],
          ].map(([number, title, body]) => (
            <article className="notebook-panel" key={number}>
              <div className="panel-inner">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="framework-section">
        <div className="section-heading compact">
          <p>框架笔记</p>
          <h2>同一种动效语法，也能穿过不同框架。</h2>
          <span>Vue 与 Svelte 的生命周期笔记，让模式可以迁移，同时不改变页面的气质。</span>
        </div>
        <div className="snippet-stage">
          <button onClick={() => changeSnippet("prev")} aria-label="上一个框架模式">
            <CaretLeft size={20} />
          </button>
          <div className="snippet-card">
            <div>
              <BracketsCurly size={22} />
              <span>{frameworkSnippets[snippetIndex].label}</span>
            </div>
            <pre>{frameworkSnippets[snippetIndex].code}</pre>
          </div>
          <button onClick={() => changeSnippet("next")} aria-label="下一个框架模式">
            <CaretRight size={20} />
          </button>
        </div>
      </section>

      <section className="skill-section">
        <div className="section-heading">
          <p>动效技术栈</p>
          <h2>支撑这次阅读体验的手艺栈。</h2>
        </div>
        <div className="skill-grid">
          {skillCards.map(([name, title, body], index) => (
            <article className="skill-card" key={name} style={{ "--skill-index": index }}>
              <div className="skill-icon">{skillIcon(index)}</div>
              <span>{name}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function skillIcon(index) {
  const icons = [
    <Sparkle size={20} />,
    <Stack size={20} />,
    <Compass size={20} />,
    <FrameCorners size={20} />,
    <Shuffle size={20} />,
    <CopySimple size={20} />,
    <Eye size={20} />,
    <MouseSimple size={20} />,
  ];
  return icons[index] ?? <Feather size={20} />;
}

export default App;
