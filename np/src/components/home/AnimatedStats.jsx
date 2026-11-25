"use client";

import { useEffect, useRef, useState } from "react";

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function StatCounter({ target, suffix = "", decimals = 0, isVisible, duration = 1800 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let animationFrameId;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const val = easedProgress * target;
      setCurrent(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    }

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, target, duration]);

  const formatted =
    decimals > 0
      ? current.toFixed(decimals)
      : Math.round(current).toLocaleString("en-US");

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

export default function AnimatedStats() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      target: 243241,
      suffix: " ha",
      decimals: 0,
      borderColor: "border-l-forest",
      text: "Peatland burned in Indonesia, releasing decades of stored carbon. Source: Pantau Gambut (2026).",
    },
    {
      target: 41.1,
      suffix: "M",
      decimals: 1,
      borderColor: "border-l-animals",
      text: "People exposed to hazardous haze and smoke in Sumatra and Kalimantan. Source: Greenpeace Indonesia.",
    },
    {
      target: 31,
      suffix: "M tons",
      decimals: 0,
      borderColor: "border-l-people",
      text: "Estimated greenhouse gas emissions from peat and forest fires. Source: WALHI Indonesia.",
    },
  ];

  return (
    <div
      ref={ref}
      aria-label="Environmental impact statistics"
      className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 pb-4"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`rounded-2xl border border-line bg-white p-6 sm:p-7 shadow-xs border-l-4 ${stat.borderColor} space-y-3 transition-all duration-700 hover:shadow-md hover:-translate-y-0.5 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${i * 120}ms` }}
        >
          <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight">
            <StatCounter
              target={stat.target}
              suffix={stat.suffix}
              decimals={stat.decimals}
              isVisible={inView}
              duration={1900}
            />
          </p>

          <p className="text-xs sm:text-sm text-mute leading-relaxed">
            {stat.text}
          </p>
        </div>
      ))}
    </div>
  );
}
